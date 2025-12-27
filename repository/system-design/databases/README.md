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

## Quick Reference

### Database Types
- **Relational (SQL)**: MySQL, PostgreSQL, Oracle, SQL Server
- **NoSQL**: MongoDB, Cassandra, Redis, DynamoDB

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
