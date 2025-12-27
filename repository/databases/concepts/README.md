# Database Concepts (Cross-Cutting)

Fundamental database concepts that apply across all database systems, regardless of type or vendor. This section provides technical deep dives on cross-cutting database concerns including replication mechanisms, sharding techniques, consistency models, transactions, durability, performance optimization, and operational patterns.

> **For system design concepts related to databases (database selection, CAP theorem, design patterns), see [Databases in System Design](https://github.com/thisiskushal31/System-Design-Concepts/blob/main/databases/README.md).**
>
> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series), [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series), [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series), [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series), and [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide).**

## Deep Dive Documentation

### Replication & Consistency

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: Master-slave replication, Group Replication, consistency levels, replication lag monitoring
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Replica sets, read preferences, write concerns, eventual consistency patterns
- **[Redis Deep Dive](../nosql/2-redis.md)**: Master-replica replication, Redis Sentinel, Redis Cluster, persistence strategies
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: Cross-datacenter replication (XDR), strong consistency, rack awareness

**Key Concepts:**
- **Quorum-Based Replication**: Read quorum (R), Write quorum (W), Replication factor (N) - R + W > N ensures strong consistency
- **Leader/Follower (Primary-Replica)**: Leader handles writes, followers replicate and handle reads
- **Multi-Leader Replication**: Multiple leaders accept writes, requires conflict resolution
- **Eventual Consistency**: System becomes consistent over time, lower latency, higher availability
- **Strong Consistency**: All reads return most recent write, requires coordination, higher latency

### Sharding & Partitioning

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: Horizontal partitioning, sharding strategies, partition management
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Sharding architecture, shard key selection, chunk balancing, zone sharding
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: Data distribution, partition management, automatic rebalancing
- **[Elasticsearch Deep Dive](../nosql/3-elasticsearch.md)**: Index sharding, replica shards, shard allocation, rebalancing

**Key Concepts:**
- **Range Sharding**: Partition by value ranges - efficient range queries, potential hotspots
- **Hash Sharding**: Distribute using hash function - even distribution, inefficient range queries
- **Directory-Based**: Lookup table for partition mapping - flexible, single point of failure
- **Shard Key Selection**: High cardinality, even distribution, align with query patterns
- **Rebalancing**: Automatic or manual redistribution of data across nodes

### Transactions & Durability

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: ACID transactions, isolation levels, WAL, redo logs, binlog
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Multi-document transactions, write concerns, journaling
- **[Redis Deep Dive](../nosql/2-redis.md)**: Transactions (MULTI/EXEC), persistence (RDB/AOF), durability guarantees
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: ACID transactions, strong consistency, durable deletes

**Key Concepts:**
- **WAL (Write-Ahead Log)**: Write to log before updating data for durability and crash recovery
- **Redo Logs**: Replay committed transactions after crash
- **Checkpoints**: Flush dirty pages to reduce recovery time
- **Fsync Strategies**: Balance between durability and performance

### Storage & Indexing

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: B-tree indexes, InnoDB storage engine, index types, query optimization
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Index types, compound indexes, text indexes, geospatial indexes
- **[Redis Deep Dive](../nosql/2-redis.md)**: In-memory storage, data structures, persistence options
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: Hybrid Memory Architecture (HMA), primary index, secondary indexes
- **[Elasticsearch Deep Dive](../nosql/3-elasticsearch.md)**: Inverted indices, mapping, analysis, index templates

**Key Concepts:**
- **Row vs Columnar Storage**: Row-oriented for OLTP, columnar for OLAP workloads
- **LSM vs B-Tree**: B-tree for consistent performance, LSM for write-optimized workloads
- **Compression**: Snappy, LZ4, Gzip, Zstd - trade-offs between CPU, storage, and I/O

### Performance & Optimization

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: Query optimization, index tuning, connection pooling, caching
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Query optimization, index strategies, aggregation pipeline optimization
- **[Redis Deep Dive](../nosql/2-redis.md)**: Memory optimization, pipelining, connection pooling, eviction policies
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: HMA optimization, index configuration, service threads tuning
- **[Elasticsearch Deep Dive](../nosql/3-elasticsearch.md)**: Query optimization, shard sizing, index optimization, caching

**Key Concepts:**
- **Connection Management**: Connection pooling, pool sizing, timeout settings
- **Caching Strategies**: Application cache, query cache, buffer pool, cache invalidation
- **Query Planning**: Query optimizer, statistics, index usage, execution plans
- **Latency SLIs**: P50 (median), P95, P99, P999 percentiles

### Backup & Recovery

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: mysqldump, binary logs, point-in-time recovery, backup strategies
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: mongodump/mongorestore, oplog replay, backup strategies
- **[Redis Deep Dive](../nosql/2-redis.md)**: RDB snapshots, AOF persistence, backup and restore procedures
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: asbackup/asrestore, backup strategies, recovery procedures

**Key Concepts:**
- **Backup Types**: Full backup, incremental backup, differential backup
- **Point-in-Time Recovery (PITR)**: Full backup + transaction logs, replay to target time
- **Backup Verification**: Test restores, integrity checks, automated testing

### Observability

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: Performance Schema, slow query log, monitoring tools
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Profiling, explain plans, monitoring tools
- **[Redis Deep Dive](../nosql/2-redis.md)**: INFO command, slow log, latency monitoring
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: asinfo, asadm, monitoring metrics
- **[Elasticsearch Deep Dive](../nosql/3-elasticsearch.md)**: Cluster health API, query profiling, monitoring

**Key Concepts:**
- **Logging**: Query logs, slow query logs, error logs, audit logs
- **Metrics**: Throughput, latency percentiles, error rates, resource usage, replication lag
- **Tracing**: Distributed tracing, query tracing, performance profiling
- **Slow Query Analysis**: Enable slow query log, analyze patterns, optimize queries

### Operational Patterns

**Database-Specific Guides:**
- **[MySQL Deep Dive](../relational/1-mysql.md)**: High availability, failover procedures, maintenance operations
- **[MongoDB Deep Dive](../nosql/1-mongodb.md)**: Replica set management, shard management, maintenance windows
- **[Redis Deep Dive](../nosql/2-redis.md)**: Sentinel configuration, cluster management, failover procedures
- **[Aerospike Deep Dive](../nosql/4-aerospike.md)**: Cluster management, node maintenance, XDR configuration
- **[Elasticsearch Deep Dive](../nosql/3-elasticsearch.md)**: Cluster management, index management, node operations

**Key Concepts:**
- **Blue-Green Deployments**: Two environments, instant switchover, easy rollback
- **Canary Deployments**: Gradual rollout, monitor, expand, quick rollback
- **Circuit Breakers**: Prevent cascade failures, fail fast, automatic recovery
- **Rate Limiting**: Protect from overload, token bucket, sliding window

## Quick Reference

### Consistency Models

| Model | Description | Use Cases | Trade-offs |
|-------|-------------|-----------|------------|
| **Strong Consistency** | All reads return most recent write | Financial data, critical transactions | Higher latency, lower availability |
| **Eventual Consistency** | System becomes consistent over time | Social feeds, recommendations | Lower latency, possible stale reads |
| **Read Your Writes** | Read after write returns your write | User profiles, session data | Requires session affinity |
| **Monotonic Reads** | Never see older data after seeing newer | User activity feeds | Requires session affinity |

### Sharding Strategies

| Strategy | Pros | Cons | Best For |
|----------|------|------|----------|
| **Range Sharding** | Easy to understand, efficient range queries | Potential hotspots, uneven distribution | Sequential data, time-series |
| **Hash Sharding** | Even distribution, no hotspots | Inefficient range queries | Random access patterns |
| **Directory-Based** | Flexible, easy to rebalance | Single point of failure, lookup overhead | Dynamic partitioning needs |

### Backup Strategies

| Strategy | Pros | Cons | Use When |
|----------|------|------|----------|
| **Full Backup** | Simple restore, complete data | Large size, slow | Weekly/monthly backups |
| **Incremental Backup** | Smaller size, faster | Complex restore, requires full backup | Daily backups |
| **Differential Backup** | Simpler restore than incremental | Larger than incremental | Daily backups with weekly full |

## Best Practices

### Design Principles
- **Normalize for consistency**: Relational databases
- **Denormalize for performance**: NoSQL databases
- **Design for access patterns**: Optimize for queries
- **Plan for scale**: Consider sharding from start

### Operational Excellence
- **Automate everything**: Backups, monitoring, alerts
- **Document procedures**: Runbooks, playbooks
- **Test regularly**: Backup restores, failover tests
- **Monitor proactively**: Set up alerts before issues

### Security
- **Encryption at rest**: Encrypt data on disk
- **Encryption in transit**: TLS for connections
- **Access control**: Role-based access control
- **Audit logging**: Track all access and changes

## Related Content

- **[Databases Deep Dive Overview](../README.md)**: Main index with all database categories
- **[Relational Databases](../relational/README.md)**: MySQL and PostgreSQL guides
- **[NoSQL Databases](../nosql/README.md)**: MongoDB, Redis, Aerospike, Elasticsearch guides
- **[Cloud-Managed Databases](../cloud-managed/README.md)**: Managed services across AWS, GCP, Azure
- **[Databases in System Design](https://github.com/thisiskushal31/System-Design-Concepts/blob/main/databases/README.md)**: System design concepts for database selection, CAP theorem, sharding, replication patterns

## DBMS Fundamentals

Comprehensive resources for Database Management System (DBMS) fundamentals, covering design principles, data modeling, normalization, transactions, and advanced concepts.

**Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

### Topics

- **[Basics of DBMS](./dbms-fundamentals/1-basics-of-dbms.md)**: Introduction, history, architecture, and file system comparison
- **[ER & Relational Model](./dbms-fundamentals/2-er-relational-model.md)**: Entity-Relationship modeling, relational model, keys, and schema design
- **[Relational Algebra](./dbms-fundamentals/3-relational-algebra.md)**: Query operations, SQL joins, and relational calculus
- **[Functional Dependencies & Normalisation](./dbms-fundamentals/4-functional-dependencies-normalisation.md)**: Normalization forms, redundancy elimination, and denormalization
- **[Transactions & Concurrency Control](./dbms-fundamentals/5-transactions-concurrency-control.md)**: ACID properties, schedules, concurrency control, and recovery
- **[Advanced DBMS](./dbms-fundamentals/6-advanced-dbms.md)**: Indexing, B-tree, B+ tree, bitmap indexing, and file organization
- **[Practice Questions](./dbms-fundamentals/7-practice-questions.md)**: Interview questions, exam preparation, and practice resources

**See [DBMS Fundamentals Overview](./dbms-fundamentals/README.md) for complete learning path and topic details.**

## Resources

- [Designing Data-Intensive Applications](https://dataintensive.net/) - Comprehensive guide to distributed systems
- [High Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781449332471/) - MySQL optimization and operations
- [MongoDB: The Definitive Guide](https://www.oreilly.com/library/view/mongodb-the-definitive/9781491954454/) - MongoDB architecture and operations
- [Redis Documentation](https://redis.io/docs/latest/) - Official Redis documentation
- [Aerospike Documentation](https://aerospike.com/docs/) - Official Aerospike documentation
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - Official Elasticsearch documentation
