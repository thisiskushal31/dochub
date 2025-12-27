# DBMS Fundamentals

Comprehensive resources for Database Management System (DBMS) fundamentals, covering design principles, data modeling, normalization, transactions, and advanced concepts.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Overview

This section provides detailed coverage of DBMS fundamentals organized into focused topics. Each topic includes explanations, examples, and links to comprehensive GeeksforGeeks articles.

### Database Design Lifecycle

![Database Design Lifecycle](../../assets/dbms-fundamentals/db-design.png)

*Image Source: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)*

## Topics

### [Basics of DBMS](./1-basics-of-dbms.md)

Fundamental concepts and introduction to Database Management Systems.

- Introduction of DBMS
- History of DBMS
- DBMS Architecture (1-level, 2-Level, 3-Level)
- Difference between File System and DBMS

### [ER & Relational Model](./2-er-relational-model.md)

Entity-Relationship modeling and Relational Model concepts for database design.

- Introduction of ER Model
- Structural Constraints of Relationships
- Generalization, Specialization and Aggregation
- Relational Model and Codd Rules
- Keys in Relational Model
- Mapping from ER Model to Relational Model
- Strategies for Schema design

### [Relational Algebra](./3-relational-algebra.md)

Relational algebra operations for querying databases.

- Introduction of Relational Algebra
- SQL Joins (Inner, Left, Right and Full Join)
- Join operation Vs Nested query
- Tuple Relational Calculus (TRC)
- Domain Relational Calculus

### [Functional Dependencies & Normalisation](./4-functional-dependencies-normalisation.md)

Functional dependencies, normalization forms, and techniques to eliminate redundancy.

- Attribute Closure
- Armstrong's Axioms
- Canonical Cover
- Normal Forms (1NF, 2NF, 3NF, BCNF, 4NF, 5NF)
- Problem of Redundancy
- Lossless Join and Dependency Preserving Decomposition
- Denormalization

### [Transactions & Concurrency Control](./5-transactions-concurrency-control.md)

ACID properties, transaction schedules, concurrency control protocols, and recovery techniques.

- ACID Properties
- Types of Schedules
- Concurrency Control
- Graph Based Concurrency Control Protocol
- Multiple Granularity Locking
- Database Recovery Techniques
- Deadlock

### [Advanced DBMS](./6-advanced-dbms.md)

Advanced database concepts including indexing and file organization.

- Indexing in Databases
- Introduction of B Tree
- Introduction of B+ Tree
- Bitmap Indexing
- Inverted Index
- SQL Queries on Clustered and Non-Clustered Indexes
- File Organization

### [Practice Questions](./7-practice-questions.md)

Practice resources, interview questions, and exam preparation materials.

- Last Minute Notes - DBMS
- DBMS Interview Questions with Answers
- Commonly asked DBMS Interview Questions | Set 2
- Database Management System - GATE CSE Previous Year Questions

## Learning Path

### Beginner
1. Start with [Basics of DBMS](./1-basics-of-dbms.md)
2. Learn [ER & Relational Model](./2-er-relational-model.md)
3. Understand [Relational Algebra](./3-relational-algebra.md)

### Intermediate
4. Study [Functional Dependencies & Normalisation](./4-functional-dependencies-normalisation.md)
5. Learn [Transactions & Concurrency Control](./5-transactions-concurrency-control.md)

### Advanced
6. Explore [Advanced DBMS](./6-advanced-dbms.md)
7. Practice with [Practice Questions](./7-practice-questions.md)

## Related Content

- **[Database Concepts Overview](../README.md)**: Cross-cutting database concepts
- **[MySQL Deep Dive](../../relational/1-mysql.md)**: MySQL-specific implementation
- **[MongoDB Deep Dive](../../nosql/1-mongodb.md)**: NoSQL database concepts

## References

All content in this section is based on and adapted from GeeksforGeeks articles:

- [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)
- [DBMS Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/)

---

[← Back to Database Concepts](../README.md)

