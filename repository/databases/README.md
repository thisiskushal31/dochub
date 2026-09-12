# Databases Deep Dive

Comprehensive technical documentation for databases—relational, NoSQL, analytical, and cloud-managed services. This repository contains hands-on notes, design patterns, operational procedures, and troubleshooting checklists to help you master database concepts across different engines.

This repo is **data at rest** — store *types*, then engines under each type. Pipeline authoring lives in [Data-Engineering-Deep-Dive](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive). SQL vs NoSQL *selection* lives in [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts). Clients (`psql`, DBeaver, `bq`) live in [Tooling Database-Clients](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Database-Clients).

New to databases? Start at [Concepts/DBMS-Fundamentals](./Concepts/DBMS-Fundamentals/README.md).

## Overview

This deep dive documentation provides detailed technical information for database administrators, engineers, and architects who need in-depth knowledge beyond high-level overviews. Each section includes configuration examples, operational procedures, performance tuning guides, and real-world best practices.

**For high-level overviews and deployment strategies, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) and other database blog series.**

## Database Types & Use Cases

This repository is aligned around **10 database/storage types**. Each type has a clear role; use the overview below and the full reference to choose the right one.

| # | Type | Why you use it (use cases) | In this repo |
|---|------|----------------------------|--------------|
| 1 | **Relational** | Transactions, ACID, complex SQL, reporting, data integrity | [Relational/](./Relational/README.md) — MySQL, PostgreSQL, [DuckDB](./Relational/DuckDB/README.md) (embedded OLAP) |
| 2 | **Document Store** | Flexible schema, document-centric data, rapid iteration | [Document/MongoDB](./Document/MongoDB/README.md) |
| 3 | **Key-Value** | Fast lookups by key, high throughput, simple get/put | [Key-Value/Redis](./Key-Value/Redis/README.md), [Key-Value/Aerospike](./Key-Value/Aerospike/README.md) |
| 4 | **Wide-Column** | Massive reads/writes, large partitions, scale-out | [Wide-Column/](./Wide-Column/README.md) |
| 5 | **Graph** | Relationships, traversals, recommendations, fraud | [Graph/](./Graph/README.md) |
| 6 | **Time-Series** | Timestamped data, metrics, IoT, retention/aggregation | [Time-Series/](./Time-Series/README.md) |
| 7 | **Search Engine** | Full-text search, facets, log/search analytics | [Search-Engine/Elasticsearch](./Search-Engine/Elasticsearch/README.md) |
| 8 | **In-Memory Cache** | Sub-ms latency, reduce DB load, sessions, counters | [Cache/](./Cache/README.md) → [Key-Value/Redis](./Key-Value/Redis/README.md) |
| 9 | **Blob/Object Storage** | Files, media, backups, data lakes | [Blob-Object/](./Blob-Object/README.md) |
| 10 | **Vector** | Similarity search, semantic search, RAG, AI retrieval | [Vector/](./Vector/README.md) — **📁 stubs** (fill pgvector first) |

#### Use cases by type (why you use each)

1. **Relational** — Transactional applications (banking, e-commerce, inventory); structured reporting and dashboards; complex queries with joins; data integrity and referential constraints; legacy/enterprise systems. *SQLite:* embedded, single-file, or local-first apps (mobile, edge). *DuckDB:* embedded **analytical** SQL (scan files / local OLAP), not the app’s OLTP store.
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

### [`Relational/`](./Relational/README.md)
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
- [`README.md`](./Relational/README.md) - Relational database fundamentals
- [`MySQL/README.md`](./Relational/MySQL/README.md) - Complete MySQL technical deep dive (organized into focused topics)
- [`PostgreSQL/README.md`](./Relational/PostgreSQL/README.md) - Complete PostgreSQL technical deep dive (organized into focused topics)

### Folder layout (10-type bifurcation)

The repo is organized by the **10 database/storage types**. Each type has its own folder; deep dives for specific engines live under that type.

| Type | Folder | Databases (folder each; ✅ covered, 📁 planned) |
|------|--------|--------------------------------------------------|
| 1. Relational | [`Relational/`](./Relational/README.md) | [MySQL/](./Relational/MySQL/README.md) ✅, [PostgreSQL/](./Relational/PostgreSQL/README.md) ✅, [DuckDB/](./Relational/DuckDB/README.md) ✅ (embedded OLAP), [Oracle/](./Relational/Oracle/README.md), [SQL-Server/](./Relational/SQL-Server/README.md), [SQLite/](./Relational/SQLite/README.md) 📁 |
| 2. Document Store | [`Document/`](./Document/README.md) | [MongoDB/](./Document/MongoDB/README.md) ✅, [CouchDB/](./Document/CouchDB/README.md), [Firestore/](./Document/Firestore/README.md) 📁 |
| 3. Key-Value | [`Key-Value/`](./Key-Value/README.md) | [Redis/](./Key-Value/Redis/README.md) ✅, [Aerospike/](./Key-Value/Aerospike/README.md) ✅, [DynamoDB/](./Key-Value/DynamoDB/README.md) 📁 |
| 4. Wide-Column | [`Wide-Column/`](./Wide-Column/README.md) | [Cassandra/](./Wide-Column/Cassandra/README.md), [HBase/](./Wide-Column/HBase/README.md), [ScyllaDB/](./Wide-Column/ScyllaDB/README.md), [Bigtable/](./Wide-Column/Bigtable/README.md) 📁 |
| 5. Graph | [`Graph/`](./Graph/README.md) | [Neo4j/](./Graph/Neo4j/README.md), [Neptune/](./Graph/Neptune/README.md), [ArangoDB/](./Graph/ArangoDB/README.md) 📁 |
| 6. Time-Series | [`Time-Series/`](./Time-Series/README.md) | [InfluxDB/](./Time-Series/InfluxDB/README.md), [TimescaleDB/](./Time-Series/TimescaleDB/README.md), [Prometheus/](./Time-Series/Prometheus/README.md) 📁 |
| 7. Search Engine | [`Search-Engine/`](./Search-Engine/README.md) | [Elasticsearch/](./Search-Engine/Elasticsearch/README.md) ✅, [Solr/](./Search-Engine/Solr/README.md), [Meilisearch/](./Search-Engine/Meilisearch/README.md) 📁 |
| 8. In-Memory Cache | [`Cache/`](./Cache/README.md) | [Redis](./Key-Value/Redis/README.md) ✅ (engine lives in Key-Value), [Memcached/](./Cache/Memcached/README.md) 📁, [Hazelcast/](./Cache/Hazelcast/README.md) 📁 |
| 9. Blob/Object | [`Blob-Object/`](./Blob-Object/README.md) | [S3/](./Blob-Object/S3/README.md), [GCS/](./Blob-Object/GCS/README.md), [Azure-Blob/](./Blob-Object/Azure-Blob/README.md), [MinIO/](./Blob-Object/MinIO/README.md) 📁 |
| 10. Vector | [`Vector/`](./Vector/README.md) | [Pinecone/](./Vector/Pinecone/README.md), [Weaviate/](./Vector/Weaviate/README.md), [Milvus/](./Vector/Milvus/README.md), [Pgvector/](./Vector/Pgvector/README.md) 📁 |

**Also:** [`NoSQL/README.md`](./NoSQL/README.md) — index and redirect to the type folders above.

### [`Concepts/`](./Concepts/README.md)
Fundamental concepts that apply across all database systems, regardless of type or vendor.

**Contents:**
- Storage & indexing: row vs columnar, LSM vs B-tree, compression
- Consistency & replication: quorum, leader/follower, multi-leader, eventual
- Sharding & partitioning: keys, rebalancing, hotspots, locality
- Transactions & durability: WAL/redo logs, checkpoints, fsync strategies
- Backup & restore: full/incremental, PITR, validation, drills
- Performance: connection management, caching, query planning, latency SLIs
- Observability: logs, metrics, traces, slow-query analysis

### [`Data-Platform/`](./Data-Platform/README.md) *(new — stubs)*
Backups to object storage, CDC/replication for analytics, schema migrations — links [Data-Engineering-Deep-Dive](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive) without duplicating pipeline authoring.

Sister repos: [Data-Engineering-Deep-Dive](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive) · [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive) · [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) · [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook).

### [`Cloud-Managed/`](./Cloud-Managed/README.md)
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

**MySQL** — [Deep Dive](./Relational/MySQL/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series)  
**PostgreSQL** — [Deep Dive](./Relational/PostgreSQL/README.md)  
**DuckDB** — [Deep Dive](./Relational/DuckDB/README.md) (in-process OLAP SQL; pipeline pointer → [DE Systems/DuckDB](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/DuckDB))  
**Also:** Oracle, SQL Server, **SQLite** (embedded OLTP; deep dive planned)

### 2. Document Store
*Use when: flexible schema, document-centric data, rapid iteration, horizontal scaling.*

**MongoDB** — [Deep Dive](./Document/MongoDB/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)  
**Also:** CouchDB, Firestore

### 3. Key-Value Store
*Use when: fast lookups by key, high throughput, simple get/put, no complex queries.*

**Redis** — [Deep Dive](./Key-Value/Redis/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)  
**Aerospike** — [Deep Dive](./Key-Value/Aerospike/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)  
**Also:** DynamoDB. Memcached → [Cache/memcached](./Cache/Memcached/README.md).

### 4. Wide-Column Store
*Use when: massive-scale reads/writes, large partitions, multi-datacenter, sparse columns.*

**Covered in:** [Wide-Column/](./Wide-Column/README.md)  
**Examples:** Cassandra, HBase, ScyllaDB, Bigtable

### 5. Graph Database
*Use when: relationship-heavy data, traversals, recommendations, fraud, knowledge graphs.*

**Covered in:** [Graph/](./Graph/README.md)  
**Examples:** Neo4j, Amazon Neptune, ArangoDB

### 6. Time-Series Database
*Use when: timestamped data, metrics, IoT, retention, time-range queries.*

**Covered in:** [Time-Series/](./Time-Series/README.md)  
**Examples:** InfluxDB, TimescaleDB, Prometheus

### 7. Search Engine
*Use when: full-text search, facets, log/search analytics, relevance tuning.*

**Elasticsearch** — [Deep Dive](./Search-Engine/Elasticsearch/README.md) · [Blog Series](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)  
**Also:** Apache Solr, Meilisearch

### 8. In-Memory Cache
*Use when: sub-millisecond latency, reduce DB load, sessions, rate limiting, pub/sub.*

**Covered in:** [Cache/](./Cache/README.md) → [Key-Value/redis](./Key-Value/Redis/README.md)  
**Also:** Memcached, Hazelcast

### 9. Blob / Object Storage
*Use when: unstructured files, media, backups, data lakes, durability at scale.*

**Covered in:** [Blob-Object/](./Blob-Object/README.md)  
**Examples:** Amazon S3, Google Cloud Storage, MinIO, Azure Blob

### 10. Vector Database
*Use when: similarity search, semantic search, RAG, AI-powered retrieval.*

**Covered in:** [Vector/](./Vector/README.md)  
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
1. Start with [`Concepts/DBMS-Fundamentals/`](./Concepts/DBMS-Fundamentals/README.md)
2. Choose a type folder from the [10-type table](#database-types--use-cases) above
3. Open that engine’s README — stubs are marked in the folder layout
4. Refer to [`Cloud-Managed/`](./Cloud-Managed/README.md) if using managed services

### For Experienced Practitioners
1. Jump directly to specific database guides for advanced topics
2. Use [`Concepts/`](./Concepts/README.md) as a reference for cross-cutting concerns
3. Refer to [`Cloud-Managed/`](./Cloud-Managed/README.md) for cloud-specific optimizations
4. Use operational checklists for day-to-day tasks

### For Architects
1. Review [`Concepts/`](./Concepts/README.md) for architectural patterns
2. Compare database options in respective sections
3. Evaluate cloud-managed vs self-managed in [`Cloud-Managed/`](./Cloud-Managed/README.md)
4. Consider blog series for deployment strategies and decision frameworks

## Blog Series Integration

This deep dive documentation complements the comprehensive blog series:

### MySQL Mastery Series
- **Hub:** [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series)
- **Deep Dive:** [`Relational/MySQL/README.md`](./Relational/MySQL/README.md)
- **Coverage:** Strategic decisions, cloud-managed, self-managed, Docker, Kubernetes, performance optimization

### MongoDB Mastery Series
- **Hub:** [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)
- **Deep Dive:** [`Document/MongoDB/README.md`](./Document/MongoDB/README.md)
- **Coverage:** Deployment strategies, optimization, operations

### Redis Mastery Series
- **Hub:** [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)
- **Deep Dive:** [`Key-Value/Redis/README.md`](./Key-Value/Redis/README.md)
- **Coverage:** Caching strategies, data structures, performance

### Aerospike Mastery Series
- **Hub:** [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)
- **Deep Dive:** [`Key-Value/Aerospike/README.md`](./Key-Value/Aerospike/README.md)
- **Coverage:** High-performance deployments, hybrid memory architecture

### Elasticsearch Deployment Guide
- **Hub:** [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)
- **Deep Dive:** [`Search-Engine/Elasticsearch/README.md`](./Search-Engine/Elasticsearch/README.md)
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
