# CAP Theorem in Database Design

## Table of Contents

  - [CAP Theorem](#cap-theorem)
  - [CP Database (Consistency + Partition Tolerance)](#cp-database-consistency-partition-tolerance)
  - [AP Database (Availability + Partition Tolerance)](#ap-database-availability-partition-tolerance)
  - [CA Database (Consistency + Availability)](#ca-database-consistency-availability)

### CAP Theorem

The CAP theorem states that it is not possible to guarantee all three of the desirable properties – **Consistency**, **Availability**, and **Partition Tolerance** – at the same time in a distributed system with data replication.

**Understanding the Three Properties:**

1. **Consistency**: All users see the same data, even after updates. If one user updates the database, everyone else will see the updated value immediately.

2. **Availability**: The database ensures that every request (read or write) gets a response, even if some parts of the system are down.

3. **Partition Tolerance**: The database continues to work even if there is a network failure or a part of the system is unreachable.

**The Trade-off**: In a distributed system, you can only guarantee two out of these three properties at any given time. This is a fundamental limitation of distributed systems.

### CP Database (Consistency + Partition Tolerance)

A CP database prioritizes Consistency and Partition Tolerance from the CAP theorem.

**Characteristics:**
- **Consistency**: All users see the same data, even after updates. If one user updates the database, everyone else will see the updated value immediately
- **Partition Tolerance**: The database continues to work even if there is a network failure or a part of the system is unreachable

**Sacrifices**: Availability - the system might not respond during network issues to maintain data accuracy.

**Example**: Banking systems use CP databases because ensuring accurate account balances is more critical than being always available. Financial transactions must be consistent and accurate, even if it means the system might be temporarily unavailable during network partitions.

**Use Cases:**
- Financial systems
- Payment processing
- Systems where data accuracy is critical
- Applications requiring strong consistency guarantees

### AP Database (Availability + Partition Tolerance)

An AP database is a type of database that prioritizes Availability and Partition Tolerance from the CAP theorem.

**Characteristics:**
- **Availability**: The database ensures that every request (read or write) gets a response, even if some parts of the system are down
- **Partition Tolerance**: The database continues to work and provide responses even if there is a network partition (communication break between different parts of the system)

**Sacrifices**: Consistency - AP databases may not guarantee Consistency (in the strictest sense), meaning different nodes might have slightly different data for a short time.

**Example**: Cassandra is an AP database. In this system, the focus is on ensuring that the database can always respond to requests, even if some parts of the system are temporarily unavailable or can't communicate with each other.

**Use Cases:**
- Social media platforms
- Content delivery systems
- Systems where availability is more important than strict consistency
- Applications that can tolerate eventual consistency

### CA Database (Consistency + Availability)

A CA database is a type of database that prioritizes Consistency and Availability but does not guarantee Partition Tolerance.

**Characteristics:**
- **Consistency**: Every read from the database returns the most recent write. All users see the same data at the same time
- **Availability**: The database is always available to respond to queries, even if some parts of the system fail

**Sacrifices**: Partition Tolerance - if there is a network issue, the database might stop functioning rather than returning inconsistent or unavailable data.

**Example**: CA databases are ideal when network partitioning is not a common concern, such as in smaller, local systems where quick, consistent access to data is more important than handling major network failures.

**Use Cases:**
- Single-server applications
- Local systems
- Systems where network partitioning is unlikely
- Applications that don't require distributed architecture

**Note**: In practice, true CA databases are rare in distributed systems because network partitions are inevitable in distributed environments. Most real-world distributed databases choose between CP and AP.

---

**Reference**: [Complete Guide to Database Design - System Design](https://www.geeksforgeeks.org/system-design/complete-reference-to-databases-in-designing-systems/)

**Previous**: [Database Replication](5-database-replication.md) | **Next**: [Database Selection Guide](7-database-selection-guide.md)

