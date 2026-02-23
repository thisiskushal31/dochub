# Databases Deep Dive

Comprehensive technical documentation for databases—relational, NoSQL, analytical, and cloud-managed services. This repository contains hands-on notes, design patterns, operational procedures, and troubleshooting checklists to help you master database concepts across different engines.

## Overview

This deep dive documentation provides detailed technical information for database administrators, engineers, and architects who need in-depth knowledge beyond high-level overviews. Each section includes configuration examples, operational procedures, performance tuning guides, and real-world best practices.

**For high-level overviews and deployment strategies, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) and other database blog series.**

## Database Types & Use Cases

This repository is aligned around **10 database/storage types**. Each type has a clear role; use the overview below and the full reference to choose the right one.

| # | Type | Why you use it (use cases) | In this repo |
|---|------|----------------------------|--------------|
| 1 | **Relational** | Transactions, ACID, complex SQL, reporting, data integrity | [relational/](./relational/README.md) — MySQL, PostgreSQL |
| 2 | **Document Store** | Flexible schema, document-centric data, rapid iteration | [document/mongodb](./document/mongodb/README.md) |
| 3 | **Key-Value** | Fast lookups by key, high throughput, simple get/put | [key-value/redis](./key-value/redis/README.md), [key-value/aerospike](./key-value/aerospike/README.md) |
| 4 | **Wide-Column** | Massive reads/writes, large partitions, scale-out | [wide-column/](./wide-column/README.md) |
| 5 | **Graph** | Relationships, traversals, recommendations, fraud | [graph/](./graph/README.md) |
| 6 | **Time-Series** | Timestamped data, metrics, IoT, retention/aggregation | [time-series/](./time-series/README.md) |
| 7 | **Search Engine** | Full-text search, facets, log/search analytics | [search-engine/elasticsearch](./search-engine/elasticsearch/README.md) |
| 8 | **In-Memory Cache** | Sub-ms latency, reduce DB load, sessions, counters | [cache/](./cache/README.md) → [key-value/redis](./key-value/redis/README.md) |
| 9 | **Blob/Object Storage** | Files, media, backups, data lakes | [blob-object/](./blob-object/README.md) |
| 10 | **Vector** | Similarity search, semantic search, RAG, AI retrieval | [vector/](./vector/README.md) |

#### Use cases by type (why you use each)

1. **Relational** — Transactional applications (banking, e-commerce, inventory); structured reporting and dashboards; complex queries with joins; data integrity and referential constraints; legacy/enterprise systems. *SQLite:* embedded, single-file, or local-first apps (mobile, edge).
2. **Document Store** — Flexible or evolving schemas; document-centric workloads (catalogs, content, configs); rapid iteration without migrations; horizontal scaling; semi-structured data (forms, API payloads).
3. **Key-Value** — Fast lookups by key (sessions, preferences, feature flags); high throughput and simple get/put; leaderboards, counters, rate limiters; serverless/auto-scaling (e.g. DynamoDB).
4. **Wide-Column** — Massive write throughput (events, IoT, clickstreams); very large partitions; multi-datacenter replication; sparse columns; no single point of failure, linear scale-out.
5. **Graph** — Relationship-heavy data (social, followers); recommendations and “similar to”; fraud/identity and connected-account analysis; knowledge graphs; network/dependency analysis.
6. **Time-Series** — Metrics and monitoring; IoT/sensor telemetry; financial tick data; event streams and audits; efficient retention, downsampling, and time-range aggregation.
7. **Search Engine** — Full-text and fuzzy search; faceted search and autocomplete; log and security analytics (SIEM); relevance tuning and highlighting.
8. **In-Memory Cache** — Reduce latency and load on primary store; cache DB/API results; session and short-lived state; rate limiting and counters; pub/sub and lightweight queues.
9. **Blob/Object Storage** — Media and static assets; backups and archives; data lakes; unstructured data at scale; high durability and optional versioning.
10. **Vector** — Semantic search (by meaning, not just keywords); RAG and AI retrieval; “similar items”/recommendations; deduplication and clustering; image/audio similarity.

## Structure

### [`relational/`](./relational/README.md)
Comprehensive guide to relational database management systems (RDBMS), focusing on SQL fundamentals, schema design, performance optimization, and operational best practices.

**Contents:**
- Core concepts: ACID properties, normalization, schema design, constraints
- Querying: SQL basics, joins, aggregates, window functions
- Indexing: B-tree, covering indexes, composite keys, partial indexes
- Transactions & locking: isolation levels, deadlocks, contention
- HA/DR: replication, failover, backups, PITR, verification
- Performance: execution plans, vacuum/analyze, connection pooling
- MySQL-specific guide: Complete MySQL architecture, configuration, and operations
- PostgreSQL-specific guide: Advanced features and optimization

**Key Files:**
- [`README.md`](./relational/README.md) - Relational database fundamentals
- [`mysql/README.md`](./relational/mysql/README.md) - Complete MySQL technical deep dive (organized into focused topics)
- [`postgresql/README.md`](./relational/postgresql/README.md) - Complete PostgreSQL technical deep dive (organized into focused topics)

### Folder layout (10-type bifurcation)

The repo is organized by the **10 database/storage types**. Each type has its own folder; deep dives for specific engines live under that type.

| Type | Folder | Databases (folder each; ✅ covered, 📁 planned) |
|------|--------|--------------------------------------------------|
| 1. Relational | [`relational/`](./relational/README.md) | [mysql/](./relational/mysql/README.md) ✅, [postgresql/](./relational/postgresql/README.md) ✅, [oracle/](./relational/oracle/README.md), [sql-server/](./relational/sql-server/README.md), [sqlite/](./relational/sqlite/README.md) 📁 |
| 2. Document Store | [`document/`](./document/README.md) | [mongodb/](./document/mongodb/README.md) ✅, [couchdb/](./document/couchdb/README.md), [firestore/](./document/firestore/README.md) 📁 |
| 3. Key-Value | [`key-value/`](./key-value/README.md) | [redis/](./key-value/redis/README.md) ✅, [aerospike/](./key-value/aerospike/README.md) ✅, [dynamodb/](./key-value/dynamodb/README.md), [memcached/](./key-value/memcached/README.md) 📁 |
| 4. Wide-Column | [`wide-column/`](./wide-column/README.md) | [cassandra/](./wide-column/cassandra/README.md), [hbase/](./wide-column/hbase/README.md), [scylladb/](./wide-column/scylladb/README.md), [bigtable/](./wide-column/bigtable/README.md) 📁 |
| 5. Graph | [`graph/`](./graph/README.md) | [neo4j/](./graph/neo4j/README.md), [neptune/](./graph/neptune/README.md), [arangodb/](./graph/arangodb/README.md) 📁 |
| 6. Time-Series | [`time-series/`](./time-series/README.md) | [influxdb/](./time-series/influxdb/README.md), [timescaledb/](./time-series/timescaledb/README.md), [prometheus/](./time-series/prometheus/README.md) 📁 |
| 7. Search Engine | [`search-engine/`](./search-engine/README.md) | [elasticsearch/](./search-engine/elasticsearch/README.md) ✅, [solr/](./search-engine/solr/README.md), [meilisearch/](./search-engine/meilisearch/README.md) 📁 |
| 8. In-Memory Cache | [`cache/`](./cache/README.md) | [redis](./key-value/redis/README.md) ✅, [memcached/](./cache/memcached/README.md), [hazelcast/](./cache/hazelcast/README.md) 📁 |
| 9. Blob/Object | [`blob-object/`](./blob-object/README.md) | [s3/](./blob-object/s3/README.md), [gcs/](./blob-object/gcs/README.md), [azure-blob/](./blob-object/azure-blob/README.md), [minio/](./blob-object/minio/README.md) 📁 |
| 10. Vector | [`vector/`](./vector/README.md) | [pinecone/](./vector/pinecone/README.md), [weaviate/](./vector/weaviate/README.md), [milvus/](./vector/milvus/README.md), [pgvector/](./vector/pgvector/README.md) 📁 |

**Also:** [`nosql/README.md`](./nosql/README.md) — index and redirect to the type folders above.

### [`concepts/`](./concepts/README.md)
Fundamental concepts that apply across all database systems, regardless of type or vendor.

**Contents:**
- Storage & indexing: row vs columnar, LSM vs B-tree, compression
- Consistency & replication: quorum, leader/follower, multi-leader, eventual
- Sharding & partitioning: keys, rebalancing, hotspots, locality
- Transactions & durability: WAL/redo logs, checkpoints, fsync strategies
- Backup & restore: full/incremental, PITR, validation, drills
- Performance: connection management, caching, query planning, latency SLIs
- Observability: logs, metrics, traces, slow-query analysis

### [`cloud-managed/`](./cloud-managed/README.md)
Guide to managed database services across major cloud providers, covering provisioning, operations, migrations, and cost optimization.

**Contents:**
- AWS services: RDS, Aurora, DynamoDB, ElastiCache, DocumentDB, Neptune
- Google Cloud services: Cloud SQL, Spanner, Bigtable, Firestore, Memorystore
- Azure services: Azure SQL Database, Cosmos DB, Azure Database for MySQL/PostgreSQL, Azure Cache for Redis
- Provisioning: sizing, storage classes, HA/DR settings, parameter groups
- Networking & security: VPC, IAM/roles, encryption, secrets management
- Migrations: dump/restore, DMS/Dataflow/Datastream, cutover strategies
- Operations: backups/PITR, maintenance windows, upgrades, monitoring/alerts
- Cost: storage vs IOPS, autoscaling, reserved vs on-demand vs serverless

## Database Categories (aligned with 10 types)

### 1. Relational Database
*Use when: transactional data, ACID, complex queries, reporting, strict consistency.*

**MySQL** — [Deep Dive](./relational/mysql/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series)  
**PostgreSQL** — [Deep Dive](./relational/postgresql/README.md)  
**Also:** Oracle, SQL Server, **SQLite** (embedded, local; deep dive planned)

### 2. Document Store
*Use when: flexible schema, document-centric data, rapid iteration, horizontal scaling.*

**MongoDB** — [Deep Dive](./document/mongodb/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)  
**Also:** CouchDB, Firestore

### 3. Key-Value Store
*Use when: fast lookups by key, high throughput, simple get/put, no complex queries.*

**Redis** — [Deep Dive](./key-value/redis/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)  
**Aerospike** — [Deep Dive](./key-value/aerospike/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)  
**Also:** DynamoDB, Memcached

### 4. Wide-Column Store
*Use when: massive-scale reads/writes, large partitions, multi-datacenter, sparse columns.*

**Covered in:** [wide-column/](./wide-column/README.md)  
**Examples:** Cassandra, HBase, ScyllaDB, Bigtable

### 5. Graph Database
*Use when: relationship-heavy data, traversals, recommendations, fraud, knowledge graphs.*

**Covered in:** [graph/](./graph/README.md)  
**Examples:** Neo4j, Amazon Neptune, ArangoDB

### 6. Time-Series Database
*Use when: timestamped data, metrics, IoT, retention, time-range queries.*

**Covered in:** [time-series/](./time-series/README.md)  
**Examples:** InfluxDB, TimescaleDB, Prometheus

### 7. Search Engine
*Use when: full-text search, facets, log/search analytics, relevance tuning.*

**Elasticsearch** — [Deep Dive](./search-engine/elasticsearch/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)  
**Also:** Apache Solr, Meilisearch

### 8. In-Memory Cache
*Use when: sub-millisecond latency, reduce DB load, sessions, rate limiting, pub/sub.*

**Covered in:** [cache/](./cache/README.md) → [key-value/redis](./key-value/redis/README.md)  
**Also:** Memcached, Hazelcast

### 9. Blob / Object Storage
*Use when: unstructured files, media, backups, data lakes, durability at scale.*

**Covered in:** [blob-object/](./blob-object/README.md)  
**Examples:** Amazon S3, Google Cloud Storage, MinIO, Azure Blob

### 10. Vector Database
*Use when: similarity search, semantic search, RAG, AI-powered retrieval.*

**Covered in:** [vector/](./vector/README.md)  
**Examples:** Pinecone, Weaviate, Milvus, pgvector

## Quick Reference (use cases)

Detailed **use cases per database type** are in the [Use cases by type](#use-cases-by-type-why-you-use-each) section above. The [Database Types & Use Cases](#database-types--use-cases) table maps each type to deep dives in this repo.

- **Relational** — Transactions, ACID, joins, reporting, integrity
- **Document** — Flexible schema, document-centric, fast iteration
- **Key-Value** — Fast lookups by key, high throughput
- **Wide-Column** — Massive scale, large partitions
- **Graph** — Relationships, traversals, recommendations
- **Time-Series** — Metrics, IoT, time-range queries
- **Search** — Full-text search, facets, log analytics
- **In-Memory Cache** — Low latency, offload DB, sessions
- **Blob/Object** — Files, media, backups, data lakes
- **Vector** — Similarity search, semantic search, RAG

## How to Use This Guide

### For Beginners
1. Start with [`concepts/`](./concepts/README.md) to understand fundamental database concepts
2. Choose [`relational/`](./relational/README.md) or [`nosql/`](./nosql/README.md) based on your use case
3. Read the specific database guide (e.g., [`mysql/README.md`](./relational/mysql/README.md) or [`mongodb/README.md`](./nosql/mongodb/README.md))
4. Refer to [`cloud-managed/`](./cloud-managed/README.md) if using managed services

### For Experienced Practitioners
1. Jump directly to specific database guides for advanced topics
2. Use [`concepts/`](./concepts/README.md) as a reference for cross-cutting concerns
3. Refer to [`cloud-managed/`](./cloud-managed/README.md) for cloud-specific optimizations
4. Use operational checklists for day-to-day tasks

### For Architects
1. Review [`concepts/`](./concepts/README.md) for architectural patterns
2. Compare database options in respective sections
3. Evaluate cloud-managed vs self-managed in [`cloud-managed/`](./cloud-managed/README.md)
4. Consider blog series for deployment strategies and decision frameworks

## Blog Series Integration

This deep dive documentation complements the comprehensive blog series:

### MySQL Mastery Series
- **Hub:** [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series)
- **Deep Dive:** [`relational/mysql/README.md`](./relational/mysql/README.md)
- **Coverage:** Strategic decisions, cloud-managed, self-managed, Docker, Kubernetes, performance optimization

### MongoDB Mastery Series
- **Hub:** [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)
- **Deep Dive:** [`document/mongodb/README.md`](./document/mongodb/README.md)
- **Coverage:** Deployment strategies, optimization, operations

### Redis Mastery Series
- **Hub:** [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)
- **Deep Dive:** [`key-value/redis/README.md`](./key-value/redis/README.md)
- **Coverage:** Caching strategies, data structures, performance

### Aerospike Mastery Series
- **Hub:** [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)
- **Deep Dive:** [`key-value/aerospike/README.md`](./key-value/aerospike/README.md)
- **Coverage:** High-performance deployments, hybrid memory architecture

### Elasticsearch Deployment Guide
- **Hub:** [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)
- **Deep Dive:** [`search-engine/elasticsearch/README.md`](./search-engine/elasticsearch/README.md)
- **Coverage:** Complete deployment strategies from local to production

## Contributing

- Prefer concise, copy/paste-ready commands and checklists
- Call out trade-offs and defaults that commonly surprise people
- Keep examples minimal and runnable
- Include links to official documentation
- Reference blog series for deployment strategies
- Add diagrams when they clarify concepts

## Resources

### Official Documentation
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Aerospike Documentation](https://docs.aerospike.com/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

### Related Blog Content
- [Relational vs NoSQL Databases](https://thisiskushal31.github.io/blog/#/blog/relational-vs-nosql-databases-complete-guide)
- [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series)
- [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)
- [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)
- [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)

---

*This documentation is maintained alongside the blog series. For deployment strategies and decision frameworks, refer to the respective blog series. For detailed technical implementation, refer to the specific database guides in this repository.*
