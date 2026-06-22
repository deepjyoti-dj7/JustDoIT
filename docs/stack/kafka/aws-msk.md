---
title: AWS & MSK
description: Amazon Managed Streaming for Apache Kafka — provisioned vs serverless, IAM authentication, MSK Connect, monitoring, and MSK vs self-hosted tradeoffs.
---

# AWS & MSK

Amazon MSK (Managed Streaming for Apache Kafka) is the fully managed Kafka service from AWS. It handles broker provisioning, patching, availability zone failover, ZooKeeper or KRaft cluster management, and disk scaling. You focus on topics, producers, and consumers — AWS handles the infrastructure underneath.

---

## What MSK Manages for You

| What you would do self-hosted | MSK handles it |
|---|---|
| Provision EC2 instances, configure networking | Automatic |
| ZooKeeper or KRaft cluster | Automatic |
| Broker OS patching and Kafka upgrades | Managed — you schedule the maintenance window |
| Multi-AZ deployment and partition failover | Automatic |
| TLS certificate rotation | Automatic |
| CloudWatch metrics integration | Automatic |
| Storage expansion (with auto-scaling enabled) | Optional automatic scaling |

**What MSK does not manage:** topics, consumer groups, schemas, Kafka Connect workers, and your application code. Those remain entirely your responsibility.

---

## Provisioned vs Serverless

### Provisioned MSK

You choose the broker instance type and count. Billing is per broker-hour plus EBS storage.

```
Example cluster:
  Brokers:        3  (one per Availability Zone)
  Instance type:  kafka.m5.2xlarge  (8 vCPU, 32 GB RAM)
  Storage:        2000 GB EBS per broker
  Replication:    3
```

**When to use provisioned:**
- Sustained, predictable throughput
- Need control over broker instance size and specific configuration
- Cost-sensitive at high volume — provisioned is cheaper per MB/s at scale
- Need to tune specific broker configs (custom properties)

```bash
# Create a provisioned MSK cluster
aws kafka create-cluster \
  --cluster-name prod-kafka \
  --broker-node-group-info '{
    "InstanceType": "kafka.m5.2xlarge",
    "BrokerAZDistribution": "DEFAULT",
    "ClientSubnets": ["subnet-aaa", "subnet-bbb", "subnet-ccc"],
    "StorageInfo": {"EbsStorageInfo": {"VolumeSize": 2000}}
  }' \
  --kafka-version "3.6.0" \
  --number-of-broker-nodes 3 \
  --encryption-info '{"EncryptionInTransit": {"ClientBroker": "TLS", "InCluster": true}}' \
  --enhanced-monitoring PER_TOPIC_PER_PARTITION
```

### Serverless MSK

You do not provision brokers. Kafka scales automatically. Billing is per partition-hour plus data transfer (ingress and egress).

**When to use serverless:**
- Spiky or unpredictable traffic patterns
- Development and staging environments
- Multiple small Kafka deployments that do not justify dedicated brokers
- Teams that want zero capacity planning

**Serverless limitations:**
- Maximum 120 MB/s ingest throughput per cluster
- No custom broker configuration overrides
- Slightly higher latency than provisioned
- Limited Kafka version options

| | Provisioned | Serverless |
|---|---|---|
| **Billing** | Per broker-hour + EBS storage | Per partition-hour + data transfer |
| **Throughput** | You control via instance type | Auto-scales, capped at 120 MB/s |
| **Config flexibility** | Full access to allowed broker configs | MSK-managed defaults only |
| **Cold start** | Minutes (cluster creation) | Seconds |
| **Best for** | Production, high/steady volume | Dev/staging, spiky or unknown load |

---

## Connecting to MSK

MSK brokers live inside your VPC. Clients must be in the same VPC or a peered/Transit Gateway-connected VPC.

```bash
# Get the bootstrap broker string for your cluster
aws kafka get-bootstrap-brokers \
  --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-kafka/xxx

# Example output
{
  "BootstrapBrokerStringTls":     "b-1.prod-kafka.xxx.kafka.us-east-1.amazonaws.com:9094,...",
  "BootstrapBrokerStringSaslIam": "b-1.prod-kafka.xxx.kafka.us-east-1.amazonaws.com:9098,..."
}
```

### IAM authentication (recommended for AWS)

MSK supports AWS IAM as a SASL mechanism — the client uses its EC2 instance role or ECS task role automatically. No SASL credentials to manage.

```properties
# Producer / consumer config for MSK with IAM auth + TLS
bootstrap.servers=b-1.prod-kafka.xxx.kafka.us-east-1.amazonaws.com:9098
security.protocol=SASL_SSL
sasl.mechanism=AWS_MSK_IAM
sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler
```

The IAM policy needed on the EC2 or ECS task role:

```json
{
  "Effect": "Allow",
  "Action": [
    "kafka-cluster:Connect",
    "kafka-cluster:AlterCluster",
    "kafka-cluster:DescribeCluster",
    "kafka-cluster:WriteData",
    "kafka-cluster:ReadData",
    "kafka-cluster:DescribeTopic",
    "kafka-cluster:CreateTopic",
    "kafka-cluster:AlterGroup",
    "kafka-cluster:DescribeGroup"
  ],
  "Resource": [
    "arn:aws:kafka:us-east-1:123456789012:cluster/prod-kafka/*",
    "arn:aws:kafka:us-east-1:123456789012:topic/prod-kafka/*",
    "arn:aws:kafka:us-east-1:123456789012:group/prod-kafka/*"
  ]
}
```

---

## MSK Configuration

Provisioned MSK allows overriding a subset of broker properties through MSK Configurations:

```properties
# Common MSK custom configuration
auto.create.topics.enable=false      # always disable in production
default.replication.factor=3
min.insync.replicas=2
log.retention.hours=168
num.partitions=6
log.segment.bytes=1073741824
compression.type=zstd
```

```bash
# Create an MSK configuration object
aws kafka create-configuration \
  --name prod-kafka-config \
  --kafka-versions '["3.6.0"]' \
  --server-properties fileb://custom-config.properties

# Apply it when creating or updating a cluster
aws kafka update-cluster-configuration \
  --cluster-arn arn:aws:kafka:... \
  --configuration-info '{"Arn": "arn:aws:kafka:...:configuration/prod-kafka-config/1", "Revision": 1}' \
  --current-version K1234ABC
```

> MSK does not allow changing `broker.id`, `listeners`, `advertised.listeners`, or ZooKeeper-related properties — those are MSK-managed and cannot be overridden.

---

## MSK Connect

MSK Connect is a fully managed Kafka Connect service. You deploy connectors without managing Connect workers or the coordinator infrastructure.

```bash
# Deploy a Debezium source connector on MSK Connect
aws kafkaconnect create-connector \
  --connector-name pg-orders-source \
  --kafka-cluster '{
    "apacheKafkaCluster": {
      "bootstrapServers": "b-1.prod-kafka...:9092",
      "vpc": {
        "subnets": ["subnet-aaa", "subnet-bbb"],
        "securityGroups": ["sg-xxx"]
      }
    }
  }' \
  --connector-configuration '{
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "postgres.internal",
    "database.port": "5432",
    "database.user": "debezium",
    "database.dbname": "commerce",
    "table.include.list": "public.orders",
    "topic.prefix": "pg",
    "plugin.name": "pgoutput"
  }' \
  --capacity '{"provisionedCapacity": {"mcuCount": 2, "workerCount": 2}}'
```

---

## MSK vs Self-Hosted Kafka

| Dimension | MSK | Self-hosted on EC2 or Kubernetes |
|---|---|---|
| **Ops burden** | Low — AWS manages brokers, ZooKeeper, failover | High — you own everything including upgrades |
| **Configuration flexibility** | Limited to MSK-allowed properties | Full control over every broker config |
| **Cost at scale** | Higher per-broker vs raw EC2 — roughly 20–30% premium | Lower per-MB/s at high volume |
| **Kafka version** | MSK-supported subset — not always latest | Any version, immediately |
| **Upgrade process** | Managed rolling upgrade — you schedule | Full control; more complex to automate safely |
| **Multi-region replication** | MSK Replicator or MirrorMaker 2 | MirrorMaker 2 or Confluent Replicator |
| **Compliance** | AWS-managed encryption, IAM audit trail | You implement and audit |
| **Time to production** | Hours | Days to weeks |

**Use MSK when:**
- Your team lacks Kafka operations expertise
- Time-to-production is a priority
- You are already deeply invested in AWS — IAM, CloudWatch, VPC integration
- Scale is moderate (under 500 MB/s) where MSK pricing is acceptable

**Use self-hosted when:**
- You have dedicated Kafka operators or SRE teams
- You need configuration options MSK does not expose
- Cost at very high scale matters — savings are real above ~1 GB/s sustained
- You need the latest Kafka features immediately after release
- You need multi-cloud or on-premise deployment

---

## Monitoring MSK with CloudWatch

MSK publishes metrics to CloudWatch at four levels:

| Monitoring level | Metrics included | Cost |
|---|---|---|
| `DEFAULT` | Cluster-level CPU, network, storage | Included |
| `PER_BROKER` | Per-broker breakdown | Included |
| `PER_TOPIC_PER_BROKER` | Per-topic throughput per broker | Included |
| `PER_TOPIC_PER_PARTITION` | Partition-level metrics | Additional charge |

```bash
# Enable enhanced monitoring on an existing cluster
aws kafka update-monitoring \
  --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-kafka/xxx \
  --enhanced-monitoring PER_TOPIC_PER_BROKER
```

### Key CloudWatch metrics for MSK

| Metric name | Alert threshold | Why it matters |
|---|---|---|
| `EstimatedMaxTimeLag` | > 0 trending up | Consumer falling behind |
| `UnderReplicatedPartitions` | > 0 | ISR shrinkage — broker unhealthy |
| `OfflinePartitionsCount` | > 0 | Partition has no leader — data unavailable |
| `BytesInPerSec` / `BytesOutPerSec` | Approaching provisioned capacity | Scale cluster before saturation |
| `CpuUser` | > 60% sustained | Broker under CPU pressure |
| `KafkaDataLogsDiskUsed` | > 75% | Storage running low — expand or add tiered storage |

---

## MSK Replicator: Cross-Region Replication

MSK Replicator replicates topics and consumer group offsets between MSK clusters, enabling active-passive DR or geo-distributed architectures:

```bash
aws kafka create-replicator \
  --replicator-name prod-to-dr \
  --kafka-clusters '[
    {"amazonMskCluster": {"mskClusterArn": "arn:aws:kafka:us-east-1:...:cluster/prod-kafka"}},
    {"amazonMskCluster": {"mskClusterArn": "arn:aws:kafka:us-west-2:...:cluster/dr-kafka"}}
  ]' \
  --replication-info-list '[{
    "sourceKafkaClusterArn": "arn:aws:kafka:us-east-1:...",
    "targetKafkaClusterArn": "arn:aws:kafka:us-west-2:...",
    "topicReplication": {
      "topicsToReplicate": ["orders", "payments"],
      "copyAccessControlListsForTopics": true
    },
    "consumerGroupReplication": {
      "consumerGroupsToReplicate": ["orders-processor"]
    }
  }]'
```

---

## Cost Optimisation on MSK

- **Right-size broker instances** — start with `kafka.m5.large` or `kafka.m5.xlarge` and scale up based on actual CPU and network metrics, not guesses
- **Use MSK Serverless for non-prod** — development and staging clusters on serverless cost almost nothing at low volume
- **Enable tiered storage** — for topics with long retention, tiered storage moves old log segments to S3 at a fraction of EBS cost
- **Delete unused topics** — empty topics still consume partition metadata, monitoring, and replication overhead
- **Lower replication factor for non-critical topics** — internal, ephemeral, or low-value topics can use `replication.factor=2` to reduce storage cost by 33%
