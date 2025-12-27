# PostgreSQL High Availability

[← Back to PostgreSQL Deep Dive](../README.md)

## Table of Contents

- [High Availability Overview](#high-availability-overview)
  - [When to Consider HA Architecture](#when-to-consider-ha-architecture)
  - [HA Requirements Assessment](#ha-requirements-assessment)
- [HA Architectures](#ha-architectures)
  - [Patroni-based HA](#patroni-based-ha)
  - [pg_auto_failover](#pg_auto_failover)
  - [Stateful MIGs with Regional Persistent Disk](#stateful-migs-with-regional-persistent-disk)
- [Replication](#replication)
  - [Streaming Replication](#streaming-replication)
  - [Logical Replication](#logical-replication)
  - [Synchronous vs Asynchronous](#synchronous-vs-asynchronous)
- [Failover & Recovery](#failover-recovery)
  - [Recovery Time Objective (RTO)](#recovery-time-objective-rto)
  - [Recovery Point Objective (RPO)](#recovery-point-objective-rpo)
  - [Failover Process](#failover-process)
  - [Switchover](#switchover)
  - [Fallback](#fallback)

## High Availability Overview

High availability (HA) ensures that your PostgreSQL database remains operational and accessible, even in the event of component failures. HA is the measure of system resiliency in response to underlying infrastructure failure.

### When to Consider HA Architecture

Use an HA architecture when you want to provide increased data-tier uptime to meet the reliability requirements for your workloads and services. Consider HA when:

- Your service level objectives (SLOs) require high uptime
- You need protection against single zone or regional failures
- Your business cannot tolerate extended downtime
- You require automated failover capabilities

### HA Requirements Assessment

Before selecting an HA architecture, consider:

1. **Availability Level**: Do you require protection against single zone or complete regional failure?
2. **Business Impact**: What is the cost to your business if there is downtime?
3. **Operational Budget**: HA increases infrastructure and storage costs
4. **Recovery Time Objective (RTO)**: How quickly do you need to failover?
5. **Recovery Point Objective (RPO)**: Can you afford to lose data as a result of failover?

## HA Architectures

This section describes three primary HA architectures for PostgreSQL on Compute Engine (or similar infrastructure):

1. **Patroni-based HA**: Mature, feature-rich solution using Patroni and a distributed configuration store
2. **pg_auto_failover**: Simpler solution with built-in monitor service
3. **Stateful MIGs with Regional Persistent Disk**: Google Cloud-native approach using regional persistent disks

### Patroni-based HA

[Patroni](https://github.com/zalando/patroni) is a mature and actively maintained, open-source (MIT licensed) software template that provides tools to configure, deploy, and operate a PostgreSQL HA architecture.

#### Architecture Components

- **Patroni Agent**: Runs on each PostgreSQL node, manages PostgreSQL process and configuration
- **Distributed Configuration Store (DCS)**: Stores cluster state and configuration
  - Options: etcd, Consul, Apache ZooKeeper, or Kubernetes
- **Load Balancer**: Routes traffic to primary and replica nodes (HAProxy or internal passthrough Network Load Balancer)

![Patroni Cluster Components](../assets/postgresql/patroni-components.png)

*Figure 1: Patroni cluster components showing interaction between PostgreSQL nodes, the DCS, and Patroni agents. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

![Patroni Healthy Cluster](../assets/postgresql/patroni-leader-lock.png)

*Figure 2: Healthy cluster leader updates the leader lock while leader candidates watch. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

#### How Patroni Works

1. **Leader Election**: The primary node regularly updates a leader key in the DCS with a TTL. If the TTL elapses without an update, leader election begins.

2. **Failure Detection**: 
   - Patroni agent continuously updates its health status in the DCS
   - Validates PostgreSQL health
   - Self-fences or demotes if issues detected
   - OS-level watchdog prevents split-brain conditions

![Patroni Impaired Cluster](../assets/postgresql/patroni-impaired-cluster.png)

*Figure 3: Impaired cluster elects a new leader after the existing leader key expires. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

3. **Failover Process**:
   - When leader lock expires, replica nodes check their WAL positions
   - Most up-to-date node attempts to acquire leader lock
   - First node to successfully create leader key becomes new primary
   - Other nodes serve as replicas

![Patroni WAL Log Positions](../assets/postgresql/patroni-wal-log-positions.png)

*Figure 4: During the Patroni failover process, replicas check their position in the WAL log. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

![Patroni Leader Race](../assets/postgresql/patroni-leader-race.png)

*Figure 5: A node creates a leader key in the DCS and becomes the new primary. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

4. **Query Routing**: 
   - Patroni exposes REST API endpoints (`/primary`, `/replica`)
   - Load balancer uses these endpoints for health checks
   - Primary: `/primary` returns 200, `/replica` returns 503
   - Replica: `/primary` returns 503, `/replica` returns 200

5. **Fallback**: When a failed node restarts, it detects it doesn't have the leader lock and automatically demotes itself to a replica.

#### Advantages

- Extremely configurable: supports both synchronous and asynchronous replication
- Allows multiple zone and multi-region HA setups
- Feature-rich: hooks, different DCS options, cascaded replicas
- Mature: Used in production by large companies like Zalando and GitLab since 2015

#### Disadvantages

- Requires separate DCS cluster (etcd, Consul, etc.)
- Higher cost due to multiple replicas and DCS infrastructure
- More complex setup and maintenance

#### Patroni Deployment Types

The [PostgreSQL High-Availability Cluster (gecio/postgresql_cluster)](https://github.com/gecio/postgresql_cluster) repository provides Ansible playbooks for deploying Patroni-based HA clusters. The repository includes three deployment architecture types:

![Patroni Type A Architecture](../assets/postgresql/patroni-type-a.png)

*Figure 10: Patroni Type A deployment architecture. Image credit: [PostgreSQL High-Availability Cluster (gecio/postgresql_cluster) - GitHub](https://github.com/gecio/postgresql_cluster)*

![Patroni Type B Architecture](../assets/postgresql/patroni-type-b.png)

*Figure 11: Patroni Type B deployment architecture. Image credit: [PostgreSQL High-Availability Cluster (gecio/postgresql_cluster) - GitHub](https://github.com/gecio/postgresql_cluster)*

![Patroni Type C Architecture](../assets/postgresql/patroni-type-c.png)

*Figure 12: Patroni Type C deployment architecture. Image credit: [PostgreSQL High-Availability Cluster (gecio/postgresql_cluster) - GitHub](https://github.com/gecio/postgresql_cluster)*

![Load Balancing Configuration](../assets/postgresql/load-balancing.jpg)

*Figure 13: Load balancing configuration for PostgreSQL HA clusters. Image credit: [PostgreSQL High-Availability Cluster (gecio/postgresql_cluster) - GitHub](https://github.com/gecio/postgresql_cluster)*

### pg_auto_failover

[pg_auto_failover](https://github.com/citusdata/pg_auto_failover) is an actively developed, open-source (PostgreSQL license) PostgreSQL extension that configures HA by extending existing PostgreSQL capabilities.

#### Architecture Components

- **Monitor Service**: PostgreSQL instance with pg_auto_failover extension that maintains global state
- **Keeper Agent**: Process on each data node that observes and manages PostgreSQL service
- **Formation**: Collection of nodes managed by pg_auto_failover (minimum 3 nodes)

![pg_auto_failover Architecture](../assets/postgresql/pg-auto-failover-architecture.png)

*Figure 6: pg_auto_failover architecture containing a formation of nodes. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

#### How pg_auto_failover Works

1. **Monitor Service**: 
   - Maintains global state for the formation
   - Obtains health check status from member nodes
   - Orchestrates group using finite state machine (FSM) rules

2. **Keeper Agent**: 
   - Observes and manages PostgreSQL service on each node
   - Sends status updates to Monitor
   - Receives and executes actions from Monitor

3. **Failure Detection**:
   - Keeper agents periodically connect to Monitor
   - Monitor performs health checks using PostgreSQL protocol
   - If neither action succeeds after 30 seconds (default), failure detected

![pg_auto_failover Failure Scenarios](../assets/postgresql/pg-auto-failover-failure-scenarios.png)

*Figure 7: pg_auto_failover failure scenarios for primary, secondary, and monitor node failures. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

4. **Failover Process**:
   - Secondary nodes considered for promotion based on:
     - Highest `candidate_priority` (0-100, default 50)
     - Most advanced WAL log position
     - Random selection as tie-breaker
   - Lagging candidates fetch missing WAL from most advanced standby

5. **Query Routing**: 
   - Requires client library support for multiple hosts
   - Uses libpq with multiple host definitions
   - Not easily fronted with a load balancer

#### Advantages

- No external dependencies other than PostgreSQL
- Simpler than Patroni
- Automatic node initialization
- Similar configurability to Patroni

#### Disadvantages

- Monitor node is a single point of failure (requires HA/DR planning)
- Requires client-side query routing (not transparent)
- Relatively new project (announced early 2019)
- Limited to single Monitor instance

### Stateful MIGs with Regional Persistent Disk

This approach uses Google Cloud components exclusively, providing a simpler HA solution for cloud-native deployments.

#### Architecture Components

- **Regional Persistent Disk**: Synchronously replicates data between two zones in a region
- **Stateful Managed Instance Groups (MIGs)**: Pair of MIGs keep one primary node running
- **Cloud Storage**: Stores configuration indicating which MIG is running primary
- **MIG Health Checks**: Monitor instance health and trigger autohealing
- **Cloud Run Functions**: Event-driven functions triggered by Pub/Sub for failover
- **Internal Passthrough Network Load Balancer**: Routes clients to running instance

![Stateful MIG with Regional Persistent Disk](../assets/postgresql/stateful-mig-regional-pd.svg)

*Figure 8: HA using stateful MIGs and regional persistent disks. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

#### How It Works

1. **Regional Persistent Disk**: 
   - Data synchronously replicated between two zones
   - Only one active PostgreSQL node at a time
   - Force-attach operation completes in < 1 minute

2. **Failure Detection & Failover**:
   - Health check monitors node health
   - Failed health check stops unhealthy instance
   - Logging exports entry to Pub/Sub
   - Cloud Run function reads config from Cloud Storage
   - Function creates replacement instance in alternate zone
   - Regional persistent disk attached to new instance

![Zonal Failure Replacement](../assets/postgresql/zonal-failure-replacement.svg)

*Figure 9: During a zonal failure, a replacement instance is started. Image credit: [Architectures for high availability of PostgreSQL clusters on Compute Engine - Google Cloud](https://docs.cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine)*

3. **Query Routing**: 
   - Load balancer routes to running instance
   - Uses same health check as instance group
   - Connections fail during recreation, resume after instance is up

#### Advantages

- Composed entirely of Google Cloud products
- Low cost: only one active node at a time
- Transparent to client (connects to load balancer)
- Simple architecture

#### Disadvantages

- Limited to two zones in a single region
- Limited scalability (only one active node)
- No read scaling (no read-only replicas)
- Not applicable for multi-region setups

## Replication

### Streaming Replication

Streaming replication is a replication approach where the replica connects to the primary and continuously receives a stream of WAL records. This keeps replicas more up-to-date compared to log-shipping replication.

PostgreSQL offers built-in streaming replication beginning in version 9. Many PostgreSQL HA solutions use this built-in streaming replication to keep multiple replica nodes in sync with the primary.

#### How Streaming Replication Works

1. **WAL Records**: Transactions create WAL records appended to the WAL file
2. **Replication Connection**: Replica connects to primary using replication protocol
3. **WAL Streaming**: Primary streams WAL records to replica in real-time
4. **Apply Changes**: Replica applies WAL records to its database files

#### Configuration

**Primary (postgresql.conf)**:
```ini
wal_level = replica              # or 'logical' for logical replication
max_wal_senders = 3              # number of replicas
wal_keep_segments = 32           # or use replication slots
```

**Primary (pg_hba.conf)**:
```
host replication replicator 192.168.1.0/24 md5
```

**Replica (recovery.conf or postgresql.auto.conf)**:
```ini
primary_conninfo = 'host=primary.example.com port=5432 user=replicator'
primary_slot_name = 'replica1'  # optional, for replication slots
```

### Logical Replication

Logical replication replicates data changes based on replication identity (typically primary key), allowing more control than physical replication.

**Use Cases:**
- Replicating specific tables or databases
- Upgrading PostgreSQL versions
- Cross-version replication
- Selective replication

**Setup Logical Replication:**

**Primary (postgresql.conf):**
```ini
wal_level = logical
max_replication_slots = 10
max_wal_senders = 10
```

**Create Publication (Primary):**
```sql
-- Create publication for all tables
CREATE PUBLICATION my_publication FOR ALL TABLES;

-- Or for specific tables
CREATE PUBLICATION my_publication FOR TABLE users, orders;

-- Add tables to publication
ALTER PUBLICATION my_publication ADD TABLE products;
```

**Create Subscription (Replica):**
```sql
-- Create subscription
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=primary.example.com port=5432 user=replicator dbname=mydb'
PUBLICATION my_publication;

-- View subscription status
SELECT * FROM pg_subscription;
SELECT * FROM pg_stat_subscription;
```

### Synchronous vs Asynchronous

#### Asynchronous Replication (Default)

- Primary doesn't wait for replica confirmation before committing
- Lower latency
- Risk of data loss if primary crashes before replica receives transaction

#### Synchronous Replication

- Primary waits for replica confirmation before committing
- Higher durability
- Higher transaction latency
- Configurable with `synchronous_commit` and `synchronous_standby_names`

**synchronous_commit Options**:

- `local`: No standby involvement (default for async)
- `on`: Standby writes WAL before acknowledgment (default for sync)
- `remote_write`: Standby acknowledges at OS level (lower durability)
- `remote_apply`: Standby applies transaction before acknowledgment (highest consistency)

**Configuration**:
```ini
# postgresql.conf on primary
synchronous_commit = on
synchronous_standby_names = 'ANY 1 (replica1, replica2)'
```

## Failover & Recovery

### Recovery Time Objective (RTO)

The elapsed, real-time duration for the data tier failover process to complete. RTO depends on the amount of time acceptable from a business perspective.

### Recovery Point Objective (RPO)

The amount of data loss (in elapsed real time) the data tier can sustain as a result of failover. RPO depends on the amount of data loss acceptable from a business perspective.

### Failover Process

The process of promoting a backup or standby infrastructure (replica node) to become the primary infrastructure. During failover, the replica node becomes the primary node.

### Switchover

A manual failover on a production system, either to test the system or to take the current primary node out of the cluster for maintenance.

### Fallback

The process of reinstating the former primary node after the condition that caused a failover is remedied.


---

**Previous**: [PostgreSQL Transactions & Concurrency](./4-transactions-concurrency.md)

**Next**: [PostgreSQL Performance & Operations](./6-performance-operations.md) | [Back to PostgreSQL Deep Dive](../README.md)