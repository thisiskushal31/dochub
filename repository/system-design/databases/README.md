# Databases in System Design

System design concepts and patterns for database selection, architecture, and scaling strategies. This section covers database design decisions, SQL vs NoSQL selection, storage systems, sharding, replication, and related system design patterns.

> **For database fundamentals and technical deep dives, see [Databases Deep Dive](https://github.com/thisiskushal31/Databases-Deep-Dive).**

## Overview

This section provides comprehensive coverage of database design concepts in system design, including:

- **Database Design Fundamentals**: Understanding databases, types, and design patterns
- **SQL vs NoSQL Selection**: When to choose relational vs non-relational databases
- **Storage Systems**: File storage, database storage, block, object, and file storage types
- **Database Sharding**: Horizontal scaling techniques and sharding strategies
- **Database Replication**: Replication types, strategies, and configurations
- **CAP Theorem**: Understanding consistency, availability, and partition tolerance trade-offs
- **Database Selection Guide**: Factors to consider when choosing a database
- **Common Challenges**: Problems and solutions in database design
- **Best Practices**: Guidelines for effective database design

## Database Types & Use Cases

This section uses **10 database/storage types** as the standard taxonomy. Each type has a clear role; use the table and details below to choose the right one. Technical deep dives for specific engines (including planned coverage for Cassandra, SQLite, Neo4j, InfluxDB, TimescaleDB, and others) live in [Databases Deep Dive](https://github.com/thisiskushal31/Databases-Deep-Dive).

### Category → databases (what comes within what)

Databases we have in mind under each category. **Not covered here** — this section is system design concepts (types, use cases, when to choose). Coverage of each database lives **elsewhere** (e.g. [Databases Deep Dive](https://github.com/thisiskushal31/Databases-Deep-Dive)).

| # | Category | Databases (covered elsewhere, not here) |
|---|----------|----------------------------------------|
| 1 | Relational | MySQL, PostgreSQL, Oracle, SQL Server, SQLite |
| 2 | Document Store | MongoDB, CouchDB, Firestore |
| 3 | Key-Value | Redis, DynamoDB, Aerospike, Memcached |
| 4 | Wide-Column | Cassandra, HBase, ScyllaDB, Bigtable |
| 5 | Graph | Neo4j, Neptune, ArangoDB |
| 6 | Time-Series | InfluxDB, TimescaleDB, Prometheus |
| 7 | Search Engine | Elasticsearch, Solr, Meilisearch |
| 8 | In-Memory Cache | Redis, Memcached, Hazelcast |
| 9 | Blob/Object Storage | S3, GCS, Azure Blob, MinIO |
| 10 | Vector | Pinecone, Weaviate, Milvus, pgvector |

### Quick reference

| # | Type | Why you use it (use cases) | Examples |
|---|------|----------------------------|----------|
| 1 | **Relational** | Transactions, ACID, complex SQL, reporting, data integrity | PostgreSQL, MySQL, Oracle, SQLite |
| 2 | **Document Store** | Flexible schema, document-centric data, rapid iteration | MongoDB, CouchDB |
| 3 | **Key-Value** | Fast lookups by key, high throughput, simple get/put | Redis, DynamoDB, Aerospike |
| 4 | **Wide-Column** | Massive reads/writes, large partitions, scale-out | Cassandra, HBase, ScyllaDB |
| 5 | **Graph** | Relationships, traversals, recommendations, fraud | Neo4j, Neptune, ArangoDB |
| 6 | **Time-Series** | Timestamped data, metrics, IoT, retention/aggregation | InfluxDB, TimescaleDB, Prometheus |
| 7 | **Search Engine** | Full-text search, facets, log/search analytics | Elasticsearch, Solr, Meilisearch |
| 8 | **In-Memory Cache** | Sub-ms latency, reduce DB load, sessions, counters | Redis, Memcached, Hazelcast |
| 9 | **Blob/Object Storage** | Files, media, backups, data lakes | S3, GCS, MinIO, Azure Blob |
| 10 | **Vector** | Similarity search, semantic search, RAG, AI retrieval | Pinecone, Weaviate, Milvus |

### 1. Relational Database

**What it is:** Structured tables with rows and columns; SQL; ACID and strict consistency.

**Examples:** PostgreSQL, MySQL, Oracle, SQL Server, **SQLite** (embedded, file-based, ideal for local/mobile/edge). *Deep dives: MySQL, PostgreSQL today; SQLite and others in scope.*

**Why you use it:** Transactional apps (banking, e-commerce, inventory), structured reporting, complex queries and joins, data integrity, legacy/enterprise systems; SQLite for embedded, single-file, or local-first apps.  
**Deep dive:** [Databases Deep Dive – Relational](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/relational)

### 2. Document Store

**What it is:** Flexible JSON-like documents; no rigid schema; each document can have a different structure.

**Examples:** MongoDB, CouchDB, Firestore

**Why you use it:** Flexible/evolving schemas, document-centric workloads, rapid iteration, horizontal scaling, semi-structured data.  
**Deep dive:** [Databases Deep Dive – MongoDB](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/mongodb)

### 3. Key-Value Store

**What it is:** Store and retrieve by a unique key; very fast lookups; no complex queries.

**Examples:** Redis, Memcached, DynamoDB, Aerospike

**Why you use it:** Fast lookups by key, high throughput, simple access pattern, distributed systems (leaderboards, rate limiters), serverless/auto-scaling.  
**Deep dive:** [Databases Deep Dive – Redis, Aerospike](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql)

### 4. Wide-Column Store

**What it is:** Table-like model where each row can have a different set of columns; built for massive-scale reads/writes.

**Examples:** **Cassandra**, HBase, ScyllaDB, Google Cloud Bigtable. *Deep dive: Cassandra / ScyllaDB planned.*

**Why you use it:** Massive write throughput, very large partitions, multi-datacenter replication, sparse columns, no single point of failure.  
**Deep dive:** [Databases Deep Dive – Wide-Column](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/wide-column)

### 5. Graph Database

**What it is:** Data as nodes (entities) and edges (relationships); optimized for traversing relationships.

**Examples:** **Neo4j**, Amazon Neptune, ArangoDB. *Deep dive: Neo4j / Neptune planned.*

**Why you use it:** Relationship-heavy data, recommendations, fraud/identity, knowledge graphs, network/dependency analysis.  
**Deep dive:** [Databases Deep Dive – Graph](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/graph)

### 6. Time-Series Database

**What it is:** Optimized for timestamped data; high-volume ingestion and time-range queries; retention and rollups.

**Examples:** **InfluxDB**, **TimescaleDB**, Prometheus. *Deep dive: InfluxDB / TimescaleDB planned.*

**Why you use it:** Metrics/monitoring, IoT/sensors, financial tick data, event streams, retention and aggregation.  
**Deep dive:** [Databases Deep Dive – Time-Series](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/time-series)

### 7. Search Engine

**What it is:** Inverted indexes for full-text search; maps terms to documents; ranking, facets, aggregations.

**Examples:** Elasticsearch, Apache Solr, Meilisearch

**Why you use it:** Full-text search, fuzzy/faceted search, log and security analytics, relevance tuning.  
**Deep dive:** [Databases Deep Dive – Elasticsearch](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/elasticsearch)

### 8. In-Memory Cache

**What it is:** Data in RAM for sub-millisecond latency; layer in front of slower databases or services.

**Examples:** Redis, Memcached, Hazelcast

**Why you use it:** Reduce latency, lower load on primary store, session/state, rate limiting/counters, pub/sub and queues.  
**Deep dive:** [Databases Deep Dive – Redis](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/redis)

### 9. Blob / Object Storage

**What it is:** Unstructured files (images, videos, backups) in flat buckets/containers; scales to petabytes.

**Examples:** Amazon S3, Google Cloud Storage, Azure Blob Storage, MinIO

**Why you use it:** Media/static assets, backups/archives, data lakes, durability and availability at scale.  
**Deep dive:** [Databases Deep Dive – Blob/Object](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/blob-object)

### 10. Vector Database

**What it is:** High-dimensional vectors (embeddings) and similarity search (k-NN, ANN); backbone of semantic search and AI retrieval.

**Examples:** Pinecone, Weaviate, Milvus, pgvector

**Why you use it:** Semantic search, recommendations, RAG/AI, deduplication/clustering, image/audio similarity.  
**Deep dive:** [Databases Deep Dive – Vector](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/nosql/vector)

---

## Learning Path

1. **[Database Design Overview](1-database-design-overview.md)**: Start here to understand what databases are, their types, importance in system design, and common database patterns.

2. **[SQL vs NoSQL Selection](2-sql-vs-nosql-selection.md)**: Learn when to choose SQL vs NoSQL databases, their features, scalability approaches, and detailed comparison.

3. **[Storage Systems](3-storage-systems.md)**: Understand file-based vs database storage systems, and explore block, object, and file storage types.

4. **[Database Sharding](4-database-sharding.md)**: Learn about horizontal scaling through sharding, different sharding methods, optimization strategies, and alternatives.

5. **[Database Replication](5-database-replication.md)**: Understand replication types, strategies, configurations, and how replication works in distributed systems.

6. **[CAP Theorem](6-cap-theorem.md)**: Explore the CAP theorem, CP/AP/CA databases, and trade-offs in distributed database systems.

7. **[Database Selection Guide](7-database-selection-guide.md)**: Learn factors to consider when selecting a database, including data structure, scalability, consistency, and cost.

8. **[Common Challenges](8-common-challenges.md)**: Understand common problems in database design and their solutions.

9. **[Best Practices](9-best-practices.md)**: Learn best practices for database design, including normalization, indexing, security, and scalability planning.

10. **[Denormalization](10-denormalization.md)**: When and how to introduce redundancy for read performance; trade-offs with normalization.

11. **[Federation](11-federation.md)**: Single logical interface over multiple databases; when to use and trade-offs.

12. **[SQL Tuning](12-sql-tuning.md)**: Query optimization, indexing, and tuning for performance.

## Status

Coverage for this section: learning path (1–12) and the 10-type taxonomy. All system-design database content lives here in the README and the numbered topic files.

| What | Status | Where |
|------|--------|--------|
| **Learning path (12 topics)** | ✅ Done | [Learning Path](#learning-path) above (1–12). |
| **10-type taxonomy & use cases** | ✅ Done | [Database Types & Use Cases](#database-types--use-cases) above (flowchart + table + per-type details). |

---

## Quick Reference

### Database Types & Use Cases
See **[Database Types & Use Cases](#database-types--use-cases)** above for the full taxonomy (10 types: Relational, Document, Key-Value, Wide-Column, Graph, Time-Series, Search Engine, In-Memory Cache, Blob/Object, Vector) with examples and when to use each.

### Key Concepts
- **Sharding**: Horizontal partitioning for scalability
- **Replication**: Data redundancy and availability
- **CAP Theorem**: Consistency, Availability, Partition Tolerance trade-offs
- **Storage Types**: Block, Object, File storage

## References

All content in this section is based on and adapted from the following GeeksforGeeks articles:

1. [Complete Guide to Database Design - System Design](https://www.geeksforgeeks.org/system-design/complete-reference-to-databases-in-designing-systems/)
2. [SQL vs. NoSQL - Which Database to Choose in System Design?](https://www.geeksforgeeks.org/system-design/which-database-to-choose-while-designing-a-system-sql-or-nosql/)
3. [File and Database Storage Systems in System Design](https://www.geeksforgeeks.org/system-design/file-and-database-storage-systems-in-system-design/)
4. [Block, Object, and File Storage in System Design](https://www.geeksforgeeks.org/system-design/block-object-and-file-storage-in-cloud-with-difference/)
5. [Database Sharding - System Design](https://www.geeksforgeeks.org/system-design/database-sharding-a-system-design-concept/)
6. [Database Replication in System Design](https://www.geeksforgeeks.org/system-design/database-replication-and-their-types-in-system-design/)

---

## Related Content

- **[System Design Concepts](../README.md)**: Main index for all system design concepts
- **[Storage Systems](../storage/README.md)**: General storage concepts and patterns
- **[Consistency Patterns](../consistency/README.md)**: CAP theorem, consistency models
- **[Databases Deep Dive](https://github.com/thisiskushal31/Databases-Deep-Dive)**: Technical deep dives for specific databases
