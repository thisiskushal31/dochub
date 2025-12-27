# Basics of DBMS

Fundamental concepts and introduction to Database Management Systems (DBMS), including history, architecture, and comparison with file systems.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Topics

### Introduction of DBMS

[Introduction of DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/)

A Database Management System (DBMS) is software that manages databases. It provides an interface for users and applications to interact with data, ensuring data integrity, security, and efficient data management.

**Key Concepts:**
- Data vs Information
- Database vs DBMS
- Advantages of DBMS over file systems
- Database users (Administrators, Designers, End Users, Application Programmers)

### History of DBMS

[History of DBMS](https://www.geeksforgeeks.org/history-of-dbms/)

The evolution of database systems from flat files to modern distributed databases.

**Timeline:**
- 1960s: File-based systems
- 1970s: Relational model (Codd's rules)
- 1980s: Commercial RDBMS (Oracle, IBM DB2)
- 1990s: Object-oriented databases
- 2000s: NoSQL databases
- 2010s: Cloud databases and distributed systems

### DBMS Architecture

[DBMS Architecture 1-level, 2-Level, 3-Level](https://www.geeksforgeeks.org/dbms-architecture-1-level-2-level-3-level/)

Database architecture defines how data is stored, managed, and accessed in a database system.

**Types of Architecture:**

1. **1-Tier Architecture (Single Tier)**
   - Database and application on same machine
   - Direct access to database
   - Simple but not scalable

2. **2-Tier Architecture (Client-Server)**
   - Client application communicates directly with database server
   - Better separation of concerns
   - Common in desktop applications

3. **3-Tier Architecture (Multi-Tier)**
   - Presentation layer (Client)
   - Application layer (Business logic)
   - Data layer (Database)
   - Most scalable and secure

![DBMS 1-Tier Architecture](../../assets/dbms-fundamentals/dbms-1-tier-architecture.webp)

*Image Source: [DBMS Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/dbms-architecture-2-level-3-level/)*

![DBMS 2-Tier Architecture](../../assets/dbms-fundamentals/dbms-2-tier-architecture.webp)

*Image Source: [DBMS Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/dbms-architecture-2-level-3-level/)*

![DBMS 3-Tier Architecture](../../assets/dbms-fundamentals/dbms-3-tier-architecture.webp)

*Image Source: [DBMS Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/dbms-architecture-2-level-3-level/)*

### File System vs DBMS

[Difference between File System and DBMS](https://www.geeksforgeeks.org/difference-between-file-system-and-dbms/)

Comparison between traditional file systems and modern database management systems.

| Aspect | File System | DBMS |
|--------|-------------|------|
| **Data Redundancy** | High redundancy | Low redundancy |
| **Data Consistency** | Difficult to maintain | Enforced through constraints |
| **Data Sharing** | Limited | Concurrent access |
| **Security** | File-level security | User-level security |
| **Backup & Recovery** | Manual | Automatic |
| **Data Integrity** | No enforcement | ACID properties |
| **Query Processing** | Not supported | SQL queries |
| **Concurrency Control** | Not available | Transaction management |

**When to use File System:**
- Simple data storage needs
- No complex relationships
- Single-user applications
- Small-scale applications

**When to use DBMS:**
- Complex data relationships
- Multi-user applications
- Need for data integrity
- Large-scale applications
- Transaction processing

## Related Topics

- **[ER & Relational Model](./2-er-relational-model.md)**: Entity-Relationship modeling and relational database concepts
- **[Relational Algebra](./3-relational-algebra.md)**: Query operations and joins
- **[Transactions & Concurrency Control](./5-transactions-concurrency-control.md)**: ACID properties and transaction management

## References

- [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)
- [Introduction of DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/)
- [History of DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/history-of-dbms/)
- [DBMS Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/dbms-architecture-1-level-2-level-3-level/)
- [Difference between File System and DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/difference-between-file-system-and-dbms/)

---

[← Back to Database Concepts](../README.md) | [DBMS Fundamentals Overview](./README.md)

