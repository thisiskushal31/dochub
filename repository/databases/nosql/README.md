# NoSQL Databases

NoSQL (Not Only SQL) databases provide flexible data models for unstructured and semi-structured data. They offer horizontal scalability, high performance, and schema flexibility, making them ideal for modern applications with varying data requirements.

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series), [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series), [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series), and [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide).**

## Deep Dive Documentation

### MongoDB

**Complete Technical Guide:**
- **[MongoDB Deep Dive](./mongodb/README.md)**: Comprehensive guide organized into focused topics covering overview & architecture, data management, operations, aggregation, advanced features, performance & security, and best practices.

**Blog Series:**
- **[MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series)**: Complete 8-part series covering deployment strategies, cloud-managed vs self-managed, Docker, Kubernetes, performance optimization, and decision frameworks.

### Redis

**Complete Technical Guide:**
- **[Redis Deep Dive](./redis/README.md)**: Comprehensive guide organized into focused topics covering overview & architecture, data structures, advanced features, persistence & replication, modules, operations & management, and use cases & best practices.

**Blog Series:**
- **[Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series)**: Complete 8-part series covering deployment strategies, cloud-managed Redis services, data structures, persistence, high availability, and performance optimization.

### Elasticsearch

**Complete Technical Guide:**
- **[Elasticsearch Deep Dive](./elasticsearch/README.md)**: Comprehensive guide organized into focused topics covering overview & getting started, mapping & analysis, searching, joining queries, controlling query results, aggregations, and improving search results.

**Blog Series:**
- **[Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide)**: Complete series covering deployment strategies, cloud-managed vs self-managed, Docker, Kubernetes, and decision frameworks.

### Aerospike

**Complete Technical Guide:**
- **[Aerospike Deep Dive](./aerospike/README.md)**: Comprehensive guide organized into focused topics covering overview & architecture, operations, advanced features, clustering & replication, tools, operations & management, and deployment & best practices.

**Blog Series:**
- **[Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series)**: Complete 8-part series covering deployment strategies, hybrid memory architecture, cross-datacenter replication, and performance optimization.

## Cross-Cutting Concepts

For fundamental concepts that apply across all NoSQL databases, see:

- **[Database Concepts](../concepts/README.md)**: 
  - **Consistency Models**: Strong vs eventual consistency, quorum-based replication
  - **Sharding & Partitioning**: Range, hash, directory-based strategies, rebalancing
  - **Data Modeling**: Denormalization, access-pattern driven design
  - **Performance Optimization**: Connection management, caching, query planning
  - **Operations**: Backup strategies, monitoring, operational patterns
  - **Transactions & Durability**: WAL, redo logs, persistence strategies

- **[System Design: Databases](https://github.com/thisiskushal31/System-Design-Concepts/blob/main/databases/README.md)**:
  - **Data Models**: Key-value, document, wide-column, graph, time-series stores
  - **Database Selection**: SQL vs NoSQL decision framework
  - **CAP Theorem**: Consistency, availability, partition tolerance trade-offs
  - **Sharding Strategies**: Detailed sharding patterns and best practices
  - **Replication Patterns**: Master-slave, multi-leader, consistency levels

## Related Content

- **[Databases Deep Dive Overview](../README.md)**: Main index with all database categories
- **[Database Concepts](../concepts/README.md)**: Cross-cutting topics like replication, sharding, consistency
- **[Cloud-Managed Databases](../cloud-managed/README.md)**: Managed services across AWS, GCP, Azure
