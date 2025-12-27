# Databases Deep Dive

Comprehensive technical documentation for databases—relational, NoSQL, analytical, and cloud-managed services. This repository contains hands-on notes, design patterns, operational procedures, and troubleshooting checklists to help you master database concepts across different engines.

## Overview

This deep dive documentation provides detailed technical information for database administrators, engineers, and architects who need in-depth knowledge beyond high-level overviews. Each section includes configuration examples, operational procedures, performance tuning guides, and real-world best practices.

**For high-level overviews and deployment strategies, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) and other database blog series.**

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

### [`nosql/`](./nosql/README.md)
Comprehensive guide to NoSQL database systems, covering data models, consistency models, partitioning strategies, and operational patterns.

**Contents:**
- Data models: key-value, document, wide-column, graph, time-series
- Consistency models: strong, eventual, quorum-based
- Partitioning & sharding: strategies, rebalancing, hotspots
- Data modeling: denormalization, access-pattern driven schemas
- Querying: primary vs secondary indexes, scans, aggregations
- Operations: capacity planning, hot partitions, backups, TTL/compaction
- Performance: caching layers, pagination strategies, workload isolation
- MongoDB guide: Document database architecture, querying, replication, sharding
- Redis guide: In-memory data structures, caching strategies, persistence
- Aerospike guide: High-performance key-value database architecture
- Elasticsearch guide: Search and analytics engine configuration

**Key Files:**
- [`README.md`](./nosql/README.md) - NoSQL database fundamentals
- [`mongodb/README.md`](./nosql/mongodb/README.md) - Complete MongoDB technical deep dive (organized into focused topics)
- [`redis/README.md`](./nosql/redis/README.md) - Complete Redis technical deep dive (organized into focused topics)
- [`elasticsearch/README.md`](./nosql/elasticsearch/README.md) - Complete Elasticsearch technical deep dive (organized into focused topics)
- [`aerospike/README.md`](./nosql/aerospike/README.md) - Complete Aerospike technical deep dive (organized into focused topics)

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

## Database Categories

### Relational Databases (SQL)

**MySQL**
- Most popular open-source RDBMS
- Widely used in web applications
- Excellent performance and reliability
- Strong community support
- **Deep Dive:** [`relational/mysql/README.md`](./relational/mysql/README.md)
- **Blog Series:** [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series)

**PostgreSQL**
- Advanced open-source RDBMS with rich feature set
- Excellent for complex queries and analytics
- Strong ACID compliance
- Extensible with custom functions and types
- **Deep Dive:** [`relational/postgresql/README.md`](./relational/postgresql/README.md)

**SQL Server**
- Microsoft's enterprise RDBMS
- Strong integration with Microsoft ecosystem
- Advanced business intelligence features
- Excellent for Windows-based environments

**Oracle**
- Enterprise-grade RDBMS with advanced features
- Strong performance and scalability
- Comprehensive tooling and support
- Industry standard for large enterprises

### NoSQL Databases

#### Document Stores

**MongoDB**
- Flexible document database with rich querying capabilities
- Horizontal scaling with sharding
- High availability with replica sets
- **Deep Dive:** [`nosql/mongodb/README.md`](./nosql/mongodb/README.md)
- **Blog Series:** [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)

**CouchDB**
- Document database with multi-master replication
- RESTful API
- Built-in conflict resolution

#### Key-Value Stores

**Redis**
- In-memory data structure store
- Used as cache, message broker, and database
- Rich data structures (strings, hashes, lists, sets, sorted sets)
- **Deep Dive:** [`nosql/redis/README.md`](./nosql/redis/README.md)
- **Blog Series:** [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)

**Aerospike**
- High-performance, distributed key-value NoSQL database
- Sub-millisecond latency
- Hybrid memory architecture
- **Deep Dive:** [`nosql/aerospike/README.md`](./nosql/aerospike/README.md)
- **Blog Series:** [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)

**DynamoDB**
- AWS managed NoSQL database
- Serverless and auto-scaling
- Global tables for multi-region deployments

#### Search & Analytics

**Elasticsearch**
- Distributed search and analytics engine
- Built on Apache Lucene
- Real-time search and analytics
- **Deep Dive:** [`nosql/elasticsearch/README.md`](./nosql/elasticsearch/README.md)
- **Blog Series:** [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)

#### Wide-Column Stores

**Cassandra**
- Distributed wide-column store
- Designed for high availability
- Linear scalability
- No single point of failure

**HBase**
- Hadoop-based wide-column store
- Strong consistency
- Integrated with Hadoop ecosystem

#### Graph Databases

**Neo4j**
- Graph database for relationship-heavy data
- Cypher query language
- Excellent for social networks and recommendations

**Amazon Neptune**
- Managed graph database service
- Supports Gremlin and SPARQL
- High availability and durability

## Quick Reference

### When to Use Relational Databases
- Structured data with clear relationships
- ACID transactions are critical
- Complex queries with joins
- Data integrity and consistency requirements
- Traditional business applications
- Reporting and analytics with SQL

### When to Use NoSQL Databases
- Flexible schema requirements
- High write throughput
- Horizontal scaling needs
- Document or key-value data models
- Real-time analytics and search
- Caching and session storage
- High availability requirements

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
- **Deep Dive:** [`nosql/mongodb/README.md`](./nosql/mongodb/README.md)
- **Coverage:** Deployment strategies, optimization, operations

### Redis Mastery Series
- **Hub:** [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)
- **Deep Dive:** [`nosql/redis/README.md`](./nosql/redis/README.md)
- **Coverage:** Caching strategies, data structures, performance

### Aerospike Mastery Series
- **Hub:** [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)
- **Deep Dive:** [`nosql/aerospike/README.md`](./nosql/aerospike/README.md)
- **Coverage:** High-performance deployments, hybrid memory architecture

### Elasticsearch Deployment Guide
- **Hub:** [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)
- **Deep Dive:** [`nosql/elasticsearch/README.md`](./nosql/elasticsearch/README.md)
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
