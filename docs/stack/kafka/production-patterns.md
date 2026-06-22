---
title: Production Patterns
description: Kafka cluster sizing, security (TLS, SASL, ACLs), performance tuning for producers and consumers, and the failure modes that bite you in production.
---

# Production Patterns

This page covers what you learn from running Kafka at scale: how to size a cluster, how to secure it, which knobs to tune for performance, and which failure modes to debug before they become incidents.

---

## Cluster Sizing

### Broker count

Start with: `max(replication_factor, throughput_brokers)` where `throughput_brokers = total_inbound_MB_per_sec ÷ per_broker_throughput_MB_per_sec`.

A single broker sustains roughly **50–200 MB/s** depending on disk speed, replication load, and consumer pressure. The minimum viable production cluster is **3 brokers** — required to achieve `replication.factor=3`.

| Cluster size | Typical use case |
|---|---|
| 3 brokers | Up to ~300 MB/s total; tolerates 1 broker failure |
| 6 brokers | ~600 MB/s; tolerates 1 failure with headroom for maintenance |
| 12+ brokers | Multi-GB/s; large-scale pipelines with many high-volume topics |

### Disk

Kafka is **sequential-write optimised**. Use dedicated disks for the Kafka log directory — do not share with the OS or other services. XFS or ext4 with `noatime` mount option.

**Disk sizing formula:**

```
retention_hours × peak_inbound_MB_per_s × 3600 × replication_factor × 1.2 (overhead)
```

### Memory

Kafka relies heavily on the **OS page cache**. Keep the JVM heap small (6–8 GB is standard) and leave the remaining RAM for the OS to use as page cache.

```bash
# JVM heap — do NOT make this large
export KAFKA_HEAP_OPTS="-Xmx6g -Xms6g"
```

A machine with 64 GB RAM typically has 8 GB JVM heap and 56 GB page cache. This is intentional.

### Rack awareness

Spread replicas across racks (or AWS Availability Zones) so that a single rack failure never takes down all replicas of a partition:

```properties
# Set the broker's rack in server.properties
broker.rack=us-east-1a
```

When creating topics, Kafka automatically spreads replicas across distinct `broker.rack` values.

---

## Security

An unsecured Kafka cluster accepts connections from any client. Production requires three layers: encryption, authentication, and authorisation.

### Layer 1: Encryption with TLS

```properties
# Broker — expose a TLS listener alongside PLAINTEXT
listeners=PLAINTEXT://0.0.0.0:9092,SSL://0.0.0.0:9093
advertised.listeners=PLAINTEXT://kafka1:9092,SSL://kafka1:9093

ssl.keystore.location=/etc/kafka/ssl/kafka.keystore.jks
ssl.keystore.password=keystore_password
ssl.key.password=key_password
ssl.truststore.location=/etc/kafka/ssl/kafka.truststore.jks
ssl.truststore.password=truststore_password
ssl.client.auth=required    # require mutual TLS for broker-to-broker and client connections
```

```properties
# Client — connect via TLS
security.protocol=SSL
ssl.truststore.location=/etc/kafka/ssl/client.truststore.jks
ssl.truststore.password=truststore_password
ssl.keystore.location=/etc/kafka/ssl/client.keystore.jks
ssl.keystore.password=keystore_password
```

### Layer 2: Authentication with SASL

| Mechanism | Use case |
|---|---|
| `SASL/PLAIN` | Username and password — only use over TLS |
| `SASL/SCRAM-SHA-256` | Password hashing — safer than PLAIN |
| `SASL/GSSAPI (Kerberos)` | Enterprise / on-premise with existing Kerberos |
| `SASL/OAUTHBEARER` | Cloud-native — integrates with OAuth2 / OIDC (AWS IAM, Okta) |

```properties
# Broker: SASL/SCRAM-SHA-256 over TLS
listeners=SASL_SSL://0.0.0.0:9093
sasl.enabled.mechanisms=SCRAM-SHA-256
sasl.mechanism.inter.broker.protocol=SCRAM-SHA-256
```

```bash
# Add a SCRAM user
kafka-configs.sh --bootstrap-server kafka1:9092 \
  --alter \
  --add-config 'SCRAM-SHA-256=[password=secret]' \
  --entity-type users \
  --entity-name alice
```

### Layer 3: Authorisation with ACLs

```bash
# Grant alice producer access to the orders topic
kafka-acls.sh --bootstrap-server kafka1:9092 \
  --add \
  --allow-principal User:alice \
  --operation Write \
  --topic orders

# Grant bob consumer group access
kafka-acls.sh --bootstrap-server kafka1:9092 \
  --add \
  --allow-principal User:bob \
  --operation Read \
  --topic orders

kafka-acls.sh --bootstrap-server kafka1:9092 \
  --add \
  --allow-principal User:bob \
  --operation Read \
  --group orders-processor

# List all ACLs for a topic
kafka-acls.sh --bootstrap-server kafka1:9092 --list --topic orders
```

---

## Performance Tuning

### Producer-side

| Problem | Solution |
|---|---|
| Low throughput | Increase `batch.size` (64 KB – 1 MB); increase `linger.ms` (5 – 50 ms) |
| High end-to-end latency | Decrease `linger.ms` to 0; decrease `batch.size` |
| Network bottleneck | Enable `compression.type=zstd`; increase `buffer.memory` |
| Partitions filling unevenly | Ensure keys are well-distributed; use sticky partitioner for null-key records |

```properties
# High-throughput producer config
batch.size=131072        # 128 KB
linger.ms=20             # wait 20 ms to fill batches
buffer.memory=134217728  # 128 MB total buffer
compression.type=zstd
```

### Consumer-side

| Problem | Solution |
|---|---|
| Low throughput | Increase `fetch.min.bytes`; increase `max.partition.fetch.bytes` |
| Frequent rebalance storms | Use `CooperativeStickyAssignor`; set `group.instance.id` for static membership |
| Processing timeout kicks consumer | Increase `max.poll.interval.ms`; reduce `max.poll.records`; offload processing to a thread pool |
| Too many tiny fetches | Increase `fetch.max.wait.ms` to 500 ms – 1 s |

```properties
# High-throughput consumer config
fetch.min.bytes=65536           # wait for at least 64 KB
fetch.max.wait.ms=1000          # wait up to 1 s for data
max.partition.fetch.bytes=2097152   # 2 MB per partition per fetch
max.poll.records=1000
```

### Broker-side

```properties
# More I/O threads — tune based on CPU core count
num.io.threads=16
num.network.threads=8
num.replica.fetchers=4

# Larger socket buffers
socket.send.buffer.bytes=1048576
socket.receive.buffer.bytes=1048576

# Background threads
background.threads=10
```

### OS-level tuning

```bash
# Increase max open file descriptors (each partition = at least 1 file handle)
ulimit -n 100000
echo "kafka soft nofile 100000" >> /etc/security/limits.conf
echo "kafka hard nofile 100000" >> /etc/security/limits.conf

# Minimise swapping — Kafka relies on page cache, not swap
echo "vm.swappiness=1" >> /etc/sysctl.conf

# Use deadline or none I/O scheduler for Kafka data disks
echo deadline > /sys/block/nvme0n1/queue/scheduler
```

---

## Common Failure Modes

### 1. Consumer lag accumulation

**Symptom:** `LAG` in `kafka-consumer-groups.sh --describe` keeps growing.

**Causes:**
- Consumer processing is CPU-bound or blocked on slow downstream I/O
- Consumer group rebalancing too frequently, causing stop-the-world pauses
- Downstream dependency (database, HTTP service) is degraded

**Fixes:**
- Profile the consumer loop and find the slow step
- Add consumer instances up to the partition count
- Move expensive processing to an async thread pool; keep `poll()` fast
- Enable cooperative incremental rebalancing to reduce pause duration

### 2. UnderReplicatedPartitions > 0

**Symptom:** JMX metric `kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions` is non-zero.

**Causes:**
- A broker is down or unreachable from other brokers
- A follower cannot keep up — ISR shrinks
- Disk full on a follower broker

**Fixes:**

```bash
# Find which partitions are under-replicated
kafka-topics.sh --bootstrap-server kafka1:9092 --describe --under-replicated-partitions
```

- Check broker logs for disk errors or network issues
- Clear disk space or expand EBS/NVMe on the lagging broker
- If broker is permanently gone, replace it with the same `broker.id`

### 3. Partition leader imbalance

**Symptom:** All traffic concentrates on one or two brokers.

**Cause:** Leader elections triggered by broker restarts can leave the preferred leader unrestored.

```bash
# Trigger preferred leader election for all topics
kafka-leader-election.sh \
  --bootstrap-server kafka1:9092 \
  --election-type PREFERRED \
  --all-topic-partitions
```

### 4. Unclean leader election — data loss

**Symptom:** After a broker failure, a partition starts serving data that is missing the most recent messages.

**Cause:** `unclean.leader.election.enable=true` allowed an out-of-sync follower to become leader, discarding writes that were not replicated.

**Fix:**

```properties
# Set globally in broker config — prevents data loss
unclean.leader.election.enable=false
```

Only set `true` on a per-topic basis for topics where availability matters more than durability (transient metrics, debug logs).

### 5. CommitFailedException — consumer timeout mid-processing

**Symptom:** `CommitFailedException: Offset commit cannot be completed since the consumer is not part of an active group`

**Cause:** Processing a batch took longer than `max.poll.interval.ms`. Kafka assumed the consumer was dead, removed it from the group, and rebalanced.

**Fixes:**

```properties
# Option 1: Increase the allowed processing time
max.poll.interval.ms=600000    # 10 minutes

# Option 2: Process fewer records per poll
max.poll.records=50
```

The best fix is **Option 3**: keep `poll()` fast by offloading processing to a thread pool. Only call `commit()` after the pool confirms completion.

### 6. RecordTooLargeException

**Symptom:** Producer throws `RecordTooLargeException`.

**Cause:** Message exceeds `max.message.bytes` (broker default: 1 MB).

```bash
# Increase limit for a specific topic
kafka-configs.sh --bootstrap-server kafka1:9092 \
  --entity-type topics \
  --entity-name orders \
  --alter \
  --add-config max.message.bytes=10485760    # 10 MB
```

Also update `fetch.message.max.bytes` on consumers and `replica.fetch.max.bytes` on broker config to match.
