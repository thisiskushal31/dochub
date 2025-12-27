# Database Replication

### What is Replication?

Making and keeping duplicate copies of a database on other servers is known as database replication. It is essential for improving modern systems' scalability, reliability, and data availability.

**Key Benefits:**
- By distributing their data across multiple servers, organizations can guarantee that it will remain accessible even in the case of a server failure
- This redundancy also improves data reliability because many copies are available to recover data in the case of corruption or loss
- Database replication can help in workload distribution among servers, boosting scalability and performance

### Importance of Database Replication

Database replication is important for several reasons:

1. **High Availability**: Data availability is guaranteed by replication, even in the event that one or more servers fail. Applications can continue to run uninterrupted by keeping copies of their data on several servers.

2. **Disaster Recovery**: In the case of a disaster, replication offers a way to restore data. After a disaster, businesses can quickly resume operations by keeping copies of their data in many locations.

3. **Load Balancing**: It allows for distributing read queries across multiple servers, reducing the load on any single server and improving performance.

4. **Fault Tolerance**: It improves fault tolerance by ensuring that if one server fails, another can take over with minimal disruption.

5. **Scalability**: It can improve scalability by allowing for the distribution of write operations across multiple servers, reducing the load on any single server.

6. **Data Locality**: It can be used to bring data closer to users, reducing latency and improving the user experience.

### How Does Database Replication Work?

Here are the steps explaining how database replication works:

1. **Step 1: Identify the Primary Database (Source)**: A primary (or master) database is chosen as the main source of truth where data changes originate.

2. **Step 2: Set Up Replica Databases (Targets)**: One or more replicas (or secondary databases) are configured to receive data from the primary database.

3. **Step 3: Data Changes Captured**: Any updates, inserts, or deletes in the primary database are recorded, typically through a transaction log or change data capture mechanism.

4. **Step 4: Transmit Changes to Replicas**: The captured changes are sent to replica databases over the network in real-time or at scheduled intervals.

5. **Step 5: Apply Changes on Replicas**: The replicas apply these updates to keep their data in sync with the primary database.

6. **Step 6: Monitor and Maintain Synchronization**: The system ensures replicas stay up-to-date and handles issues like delays or conflicts during synchronization.

7. **Step 7: Read or Write Operations**: Applications can read data from replicas (to reduce load on the primary) and may write to the primary, depending on the replication model (e.g., Master-Slave, Master-Master).

### Types of Database Replication

#### 1. Master-Slave Replication (Primary-Replica)

The process of copying and synchronizing data from a primary database (the master) to one or more secondary databases (the slaves) is known as master-slave replication.

**Characteristics:**
- In this configuration, all write operations, including inserts, updates, and deletions, must be received by the master database
- The slave databases keep a duplicate of the data and replicate the modifications made to the master database
- Slaves typically handle read operations to distribute the load

**Advantages:**
- Simple to implement and understand
- Read operations can be distributed across multiple slaves
- Provides redundancy for disaster recovery

**Disadvantages:**
- Master can become a bottleneck for writes
- If master fails, manual intervention may be required to promote a slave

#### 2. Master-Master Replication (Multi-Master Replication)

Master-master replication, also known as bidirectional replication, is a setup in which two or more databases are configured as master databases, and each master can accept write operations.

**Characteristics:**
- This means that changes made to any master database are replicated to all other master databases in the configuration
- Each master can handle both reads and writes
- Requires conflict resolution mechanisms

**Advantages:**
- No single point of failure for writes
- Can improve write performance by distributing writes
- Better availability as any master can handle requests

**Disadvantages:**
- Complex conflict resolution required
- Potential for write conflicts
- More complex to manage and maintain

#### 3. Snapshot Replication

Creating a copy of the whole database at a certain moment in time and then replicating that snapshot to one or more destination servers is known as snapshot replication.

**Characteristics:**
- Creates a point-in-time copy of the database
- Typically used for initial synchronization or periodic backups
- Not suitable for real-time synchronization

**Use Cases:**
- Initial data synchronization
- Periodic backups
- Data distribution to remote locations

#### 4. Transactional Replication

One way to maintain several copies of a database synchronized in real-time is through transactional replication.

**Characteristics:**
- This means any modifications made to a particular table (or group of tables) in one database—referred to as the publisher—are instantly copied to other databases—referred to as subscribers
- Changes are replicated in the same order they occurred
- Provides near real-time synchronization

**Use Cases:**
- Real-time reporting databases
- Data warehousing
- High-availability systems

#### 5. Merge Replication

Merge replication is a database synchronization method allowing both the central server (publisher) and its connected devices (subscribers) to make changes to the data, resolving conflicts when necessary.

**Characteristics:**
- Both publisher and subscribers can make changes
- Changes are merged periodically
- Requires conflict resolution strategies

**Use Cases:**
- Mobile applications
- Distributed systems with intermittent connectivity
- Systems where multiple locations need to make changes

### Strategies for Database Replication

Database replication strategies determine how to select data, copy and distribute it between databases to gain specific goals such as scalability, availability, and efficiency.

#### 1. Full Replication

Also referred to as full database replication, this is a technique in which the whole database is replicated to one or more destination servers. All the tables, rows, and columns in the database are copied to the destination servers. The replicas thus obtain an exact copy of the original database.

**Use Cases:**
- Complete backup and disaster recovery
- High availability requirements
- When all data needs to be available at all locations

#### 2. Partial Replication

This method involves not replicating the entire database, but merely a subset of it, such as particular tables, rows, or columns. This method can be useful when only specific data has to be reproduced for reporting, analysis, or other reasons, and it enables a more effective use of resources.

**Use Cases:**
- Reporting databases
- Data warehouses
- When only specific tables need replication

#### 3. Selective Replication

It is a database replication strategy that involves replicating data based on predefined criteria or conditions. Unlike full replication, which replicates the entire database, or partial replication, which replicates a subset of the database, selective replication allows for more granular control over which data is replicated.

**Use Cases:**
- Conditional data distribution
- Region-specific data replication
- Compliance and data residency requirements

#### 4. Sharding with Replication

It is a database scaling technique that involves partitioning data across multiple database instances (shards) based on a key. This approach allows for distributing the workload and data storage across multiple servers, improving scalability and performance.

**Use Cases:**
- Large-scale distributed systems
- When both horizontal scaling and redundancy are needed

#### 5. Hybrid Replication

It is a database replication strategy that combines multiple replication techniques to achieve specific goals. This approach allows for the customization of replication methods based on the requirements of different parts of the database or application.

**Use Cases:**
- Complex systems with varying requirements
- Multi-tier applications
- Systems with mixed consistency requirements

### Configurations of Database Replication

To accomplish particular objectives related to data consistency, availability, and performance, database replication can be set up and run in a variety of ways:

#### 1. Synchronous Replication Configuration

It is a database replication technique that replicates data changes in real-time to one or more replicas. Until at least one copy acknowledges receiving the changes, the transaction isn't considered committed.

**Characteristics:**
- This technique offers a high degree of data consistency by guaranteeing that the main database and replicas of it are constantly in sync
- Higher latency as writes must wait for replica confirmation
- Lower availability if replicas are slow or unavailable

**Use Cases:**
- Financial systems requiring strong consistency
- Critical applications where data loss is unacceptable

#### 2. Asynchronous Replication Configuration

Data changes performed on the primary database are replicated to one or more replicas using this database replication technique, which does not wait for the clones to acknowledge them.

**Characteristics:**
- Faster transaction processing on the primary database is possible with this approach
- There may be a small lag in data consistency between the primary and replica(s)
- Higher availability as writes don't wait for replicas

**Use Cases:**
- High-performance applications
- Systems where eventual consistency is acceptable
- Geographically distributed systems

#### 3. Semi-Synchronous Replication Configuration

A database replication technique called semi-synchronous replication combines elements of synchronous and asynchronous replication.

**Characteristics:**
- While other copies are updated asynchronously for improved efficiency, semi-synchronous replication ensures excellent data consistency for essential data by replicating changes to at least one replica synchronously
- Balances consistency and performance

**Use Cases:**
- Systems requiring a balance between consistency and performance
- Applications with mixed consistency requirements

### Challenges with Database Replication

Some of the challenges with Database Replication are:

1. **Data Consistency**: It can be difficult to maintain consistency among replicas, particularly in asynchronous replication situations where data replication may be delayed.

2. **Complexity**: System complexity is increased by database replication, which requires thorough setup and administration to guarantee accurate and effective data replication.

3. **Cost**: Setting up and maintaining a replicated database environment can be costly, especially for large-scale deployments with multiple replicas.

4. **Conflict Resolution**: When the same data is changed on multiple replicas at once in multi-master replication environments, conflicts might arise that require conflict resolution techniques.

5. **Latency**: Synchronous replication, which requires acknowledgment from replicas before committing transactions, can introduce latency and impact the performance of the primary database.

### PostgreSQL High Availability Patterns

For PostgreSQL-specific high availability implementations, see:

- **Patroni**: Mature HA solution using distributed configuration stores (etcd, Consul, ZooKeeper) for automatic failover
- **pg_auto_failover**: Simpler HA solution with built-in monitor service
- **Stateful MIGs with Regional Persistent Disk**: Cloud-native approach using regional persistent disks for synchronous replication

> **For detailed PostgreSQL HA architectures and implementation guides, see [PostgreSQL Deep Dive - High Availability](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/relational/2-postgresql.md#high-availability-overview).**

---

**Reference**: [Database Replication in System Design](https://www.geeksforgeeks.org/system-design/database-replication-and-their-types-in-system-design/)

**Previous**: [Database Sharding](4-database-sharding.md) | **Next**: [CAP Theorem](6-cap-theorem.md)

