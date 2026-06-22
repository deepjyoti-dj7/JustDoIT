---
title: Storage
description: S3 object storage, EBS block storage, EFS managed NFS, RDS and Aurora for relational databases, and DynamoDB for key-value at scale — with Azure and GCP equivalents.
---

# Storage

Storage is where your data lives, and the choice of storage type has enormous implications for cost, performance, durability, and how your application is architected. AWS offers purpose-built storage services for every access pattern: object blobs, block devices, shared file systems, relational databases, and key-value stores. Using the right tool for each job is one of the clearest marks of a mature cloud architecture.

---

## S3 — Simple Storage Service

S3 is probably the most influential AWS service. It stores objects (files) in buckets with effectively unlimited capacity, eleven nines of durability ($99.999999999\%$), and a simple HTTP API. Modern data architectures revolve around S3 as the universal storage layer — the data lake, the artifact store, the static website host, the backup target.

### Buckets and objects

A **bucket** is a globally-named container. An **object** is a file plus its metadata, addressed by a key (path). Object size ranges from 0 bytes to 5 TB, though anything over 100 MB should use multipart upload.

```bash
# Create a bucket (bucket names are globally unique)
aws s3api create-bucket \
  --bucket my-app-data-prod \
  --region us-east-1

# Upload an object
aws s3 cp build/app.jar s3://my-app-data-prod/releases/app-2026.jar

# Presigned URL — temporary access without requiring AWS credentials
aws s3 presign s3://my-app-data-prod/reports/june.pdf --expires-in 3600
```

### Storage classes: matching cost to access frequency

S3 is not one-size-fits-all storage. You choose a storage class per object (or set lifecycle rules to migrate automatically):

| Storage class | Availability | Retrieval | Best for | Approx monthly cost |
|---|---|---|---|---|
| **S3 Standard** | 99.99% | Immediate | Frequently accessed data | ~$0.023/GB |
| **S3 Standard-IA** | 99.9% | Immediate | Infrequent access but needs fast retrieval | ~$0.0125/GB + retrieval fee |
| **S3 One Zone-IA** | 99.5% (single AZ) | Immediate | Re-creatable infrequent data | ~$0.01/GB |
| **S3 Glacier Instant Retrieval** | 99.9% | Milliseconds | Long-term archive with occasional instant access | ~$0.004/GB |
| **S3 Glacier Flexible Retrieval** | 99.99% | Minutes to hours | Long-term archive, 1–5 min expedited or 3–5 hr standard | ~$0.0036/GB |
| **S3 Glacier Deep Archive** | 99.99% | 12–48 hours | Compliance archive, rarely accessed | ~$0.00099/GB |
| **S3 Intelligent-Tiering** | 99.9% | Varies by tier | Unknown or changing access patterns — auto-tiers objects | Monitoring fee + tier pricing |

### Lifecycle rules

Automate the migration between storage classes:

```json
{
  "Rules": [{
    "ID": "archive-old-logs",
    "Status": "Enabled",
    "Filter": {"Prefix": "logs/"},
    "Transitions": [
      {"Days": 30,  "StorageClass": "STANDARD_IA"},
      {"Days": 90,  "StorageClass": "GLACIER_IR"},
      {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
    ],
    "Expiration": {"Days": 2555}
  }]
}
```

### Versioning, replication, and event notifications

- **Versioning** preserves every version of an object — protects against accidental overwrites and deletes. Once enabled, cannot be fully disabled (only suspended).
- **Cross-Region Replication (CRR)** automatically copies objects to a bucket in another region — for compliance, lower-latency reads, or disaster recovery.
- **Event notifications** can trigger Lambda, SQS, or SNS when objects are created, deleted, or modified — the foundation of event-driven data pipelines.

### Security: bucket policies vs ACLs

Bucket policies are IAM-style JSON policies attached to the bucket — the modern, recommended approach. ACLs are legacy object-level permissions. AWS now recommends **disabling ACLs** and using bucket policies exclusively. The most important security setting:

```bash
# Block all public access — do this on every bucket unless serving a static website
aws s3api put-public-access-block \
  --bucket my-app-data-prod \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### S3 vs Azure Blob Storage vs GCS

All three are comparable object stores with global durability. Key differences:
- **Naming:** S3 uses globally unique bucket names; Azure Blob uses storage account + container; GCS uses globally unique bucket names like S3
- **Transfer acceleration:** S3 Transfer Acceleration uses CloudFront PoPs to speed uploads from distant clients; GCS has a similar feature
- **Consistency:** All three now offer strong read-after-write consistency

---

## EBS and EFS — Block and File Storage

S3 stores objects, but EC2 instances need block devices (like hard drives) and sometimes shared file systems. EBS and EFS serve these needs.

### EBS — Elastic Block Store

EBS volumes are persistent block storage attached to EC2 instances. Think of them as SSD or HDD drives you can attach, detach, snapshot, and resize without stopping the instance.

| Volume type | Performance | IOPS limit | Best for |
|---|---|---|---|
| **gp3** (SSD) | Baseline 3,000 IOPS, burst to 16,000 | Up to 16,000 IOPS | General purpose — default for most workloads |
| **io2 Block Express** (SSD) | Sub-millisecond latency | Up to 256,000 IOPS | Databases requiring consistent high IOPS (Oracle, SQL Server) |
| **st1** (HDD) | Throughput-optimised | Max 500 MB/s throughput | Big data, log processing, sequential reads |
| **sc1** (HDD) | Cold HDD | Max 250 MB/s throughput | Infrequently accessed, cost-optimised |

**Key properties:**
- An EBS volume is tied to one AZ — you cannot attach a `us-east-1a` volume to an instance in `us-east-1b`
- One volume can attach to one instance (except io2 multi-attach, limited use cases)
- Snapshots are incremental, stored in S3, and can be copied across regions
- **EBS-optimised instances** have dedicated network bandwidth for EBS — always enable it for database workloads

### EFS — Elastic File System

EFS provides a managed NFS (Network File System) that multiple EC2 instances can mount simultaneously. It scales automatically — no capacity to provision.

```bash
# Mount EFS on EC2
sudo mount -t efs -o tls fs-0123456789abcdef0:/ /mnt/efs
```

| | EBS | EFS |
|---|---|---|
| **Type** | Block storage (like a local disk) | Shared file system (NFS) |
| **Access** | Single instance (usually) | Thousands of instances simultaneously |
| **Scaling** | Manual resize | Automatic, elastic |
| **Cost** | Lower per GB | Higher per GB (but only for data stored) |
| **Latency** | Sub-ms | Low single-digit ms |
| **Best for** | OS root volumes, databases, single-instance data | Shared content, ML training data, CMS media |

**Azure/GCP equivalents:** Azure Files (SMB/NFS), GCP Filestore.

---

## RDS and Aurora — Managed Relational Databases

Running a relational database on EC2 is tedious: you install, patch, configure high availability, manage backups, and handle failover yourself. RDS automates all of that.

### RDS

RDS supports MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server. For each, AWS handles:
- OS and database engine patching
- Automated daily backups (retained 0–35 days)
- Point-in-time recovery to any second in the retention window
- Multi-AZ deployments (synchronous standby replica in another AZ, automatic failover in ~1–2 minutes)
- Read replicas (asynchronous, for read-heavy workloads, can be promoted)

```bash
# Create a PostgreSQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier prod-postgres \
  --db-instance-class db.r7g.xlarge \
  --engine postgres \
  --engine-version 16.2 \
  --master-username admin \
  --master-user-password <from-secrets-manager> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --no-publicly-accessible \
  --vpc-security-group-ids sg-xxxxx
```

### Aurora — AWS's reimagined relational database

Aurora is AWS's own relational database engine, compatible with MySQL and PostgreSQL. Its storage layer is fundamentally different from standard RDS:

- **Storage is shared** across up to 15 read replicas — data is stored once in a distributed, fault-tolerant volume across 3 AZs, not replicated separately to each replica
- **Failover in ~30 seconds** — significantly faster than RDS Multi-AZ (~1–2 minutes)
- **Auto-scaling storage** from 10 GB to 128 TB automatically — no `--allocated-storage` to manage
- **Aurora Global Database** — primary cluster in one region, read-only replica clusters in up to 5 others with <1s replication lag

**Aurora Serverless v2** scales the compute tier (ACUs — Aurora Capacity Units) within seconds based on actual load. You define a minimum and maximum ACU range — perfect for databases with unpredictable or spiky workloads.

### RDS vs Aurora: when to choose which

| | RDS | Aurora |
|---|---|---|
| **Engine** | MySQL, PostgreSQL, MariaDB, Oracle, SQL Server | MySQL-compatible, PostgreSQL-compatible |
| **Failover** | ~1–2 minutes | ~30 seconds |
| **Read replicas** | 5 max, separate storage | 15 max, shared storage |
| **Cost** | Lower | ~20% higher compute + cheaper storage at scale |
| **Best for** | Oracle/SQL Server (no Aurora option), cost-sensitive, simple setups | New PostgreSQL/MySQL workloads requiring HA, read scale, or global distribution |

**Azure/GCP equivalents:** Azure Database for PostgreSQL / MySQL / SQL, GCP Cloud SQL and Cloud Spanner.

---

## DynamoDB — Key-Value at Scale

DynamoDB is AWS's fully managed NoSQL database. There are no servers to provision, no OS to manage, no connection pools to tune. You define a table, set a partition key, and DynamoDB scales to millions of reads and writes per second automatically.

### Data model

Every DynamoDB table has:
- **Partition key (PK)** — required; determines which physical partition holds the item
- **Sort key (SK)** — optional; enables range queries within a partition
- **Attributes** — any additional data; schema-less (items can have different attributes)

```bash
# Create a table with partition + sort key
aws dynamodb create-table \
  --table-name Orders \
  --attribute-definitions \
    AttributeName=user_id,AttributeType=S \
    AttributeName=order_id,AttributeType=S \
  --key-schema \
    AttributeName=user_id,KeyType=HASH \
    AttributeName=order_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### Partition key design — the make-or-break decision

DynamoDB distributes items across partitions based on the partition key hash. A poor partition key creates **hot partitions** — one partition receiving most of the traffic while others sit idle.

**Anti-pattern:** using `status` (values: `pending`, `complete`, `failed`) as a partition key — nearly all new orders are `pending`, one partition gets all writes.

**Good pattern:** `user_id` as partition key — distributes writes across all users naturally.

For high-write tables where a single entity (user, product) would still be hot, use **write sharding**: append a random suffix (`user:123:1`, `user:123:2`, ...) and aggregate on read.

### GSI and LSI: query flexibility without table scans

DynamoDB does not support arbitrary `WHERE` queries. You can only query by primary key (PK + optional SK). For other access patterns, create secondary indexes:

- **GSI (Global Secondary Index)** — a separate partition with a different PK/SK — supports any query pattern but adds storage and write cost
- **LSI (Local Secondary Index)** — same PK as table, different SK — only for sort-key queries on the same partition, must be defined at table creation

```bash
# Add a GSI to query orders by email
aws dynamodb update-table \
  --table-name Orders \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --global-secondary-index-updates '[{
    "Create": {
      "IndexName": "email-index",
      "KeySchema": [{"AttributeName":"email","KeyType":"HASH"}],
      "Projection": {"ProjectionType":"ALL"}
    }
  }]' \
  --billing-mode PAY_PER_REQUEST
```

### DynamoDB Streams and TTL

**Streams** publish a change feed of every table mutation (INSERT, MODIFY, REMOVE) to an event stream. Lambda can consume this stream to build derived views, send notifications, or replicate data elsewhere.

**TTL** automatically deletes items after a timestamp attribute passes — at no additional cost. Perfect for session data, short-lived tokens, and rate-limit counters.

### DynamoDB vs Azure Cosmos DB vs GCP Firestore

| | DynamoDB | Azure Cosmos DB | GCP Firestore |
|---|---|---|---|
| **Data model** | Key-value + document | Multi-model (key-value, document, graph, column, table) | Document |
| **Global distribution** | DynamoDB Global Tables (active-active) | Native multi-region write everywhere | Multi-region writes in Native mode |
| **Pricing** | Per request (on-demand) or provisioned | Request units (RUs) — similar concept | Per operation |
| **SQL-like queries** | PartiQL (limited) | Rich SQL via Cosmos DB API | Collection queries, limited |

---

## ElastiCache

ElastiCache is covered in depth in the [Redis section](/stack/redis/aws-elasticache). Use it as a managed caching layer in front of any of the databases above — it dramatically reduces read latency and database load for frequently accessed data.
