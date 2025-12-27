# MongoDB Best Practices

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Table of Contents

- [Advanced Features](#advanced-features)
  - [Capped Collections](#capped-collections)
  - [Change Streams](#change-streams)
  - [Storage Engines](#storage-engines)
  - [Write Concern and Read Concern](#write-concern-and-read-concern)
  - [Covered Queries](#covered-queries)
- [Best Practices](#best-practices)
- [MongoDB Interview Questions](#mongodb-interview-questions)
- [Resources](#resources)

## Advanced Features

### Capped Collections

A capped collection is a fixed-size collection that automatically overwrites the oldest documents when it reaches its size limit. It is useful for logging and caching scenarios.

**Create Capped Collection:**
```javascript
db.createCollection("logs", {
  capped: true,
  size: 100000,  // Maximum size in bytes
  max: 1000      // Maximum number of documents
});
```

**Characteristics:**
- Fixed size (cannot grow beyond specified size)
- Maintains insertion order
- Automatically removes oldest documents when full
- High performance for insert operations
- No indexes needed (except _id)

**Use Cases:**
- Logging systems
- Real-time analytics
- Caching recent data
- Session storage

### Change Streams

Change streams allow applications to access real-time data changes in a collection, database, or entire deployment. They use the `watch()` method to listen for changes and provide a stream of change events.

**Watch a Collection:**
```javascript
const changeStream = db.collection.watch();

changeStream.on('change', (change) => {
  console.log('Change detected:', change);
  // Handle the change event
});
```

**Change Event Types:**
- **insert**: New document inserted
- **update**: Document updated
- **replace**: Document replaced
- **delete**: Document deleted
- **invalidate**: Change stream invalidated

**Example:**
```javascript
const pipeline = [
  { $match: { 'fullDocument.status': 'active' } }
];

const changeStream = db.users.watch(pipeline);

changeStream.on('change', (change) => {
  if (change.operationType === 'insert') {
    console.log('New user:', change.fullDocument);
  } else if (change.operationType === 'update') {
    console.log('Updated user:', change.documentKey);
  }
});
```

### Storage Engines

**WiredTiger (Default):**
- Default storage engine since MongoDB 3.2
- Better compression, concurrency, and performance
- Uses B-tree and LSM tree structure
- Document-level concurrency control
- Compression reduces storage requirements
- Checkpointing for crash recovery

**MMAPv1 (Deprecated):**
- Older storage engine (removed in MongoDB 4.2)
- Used memory-mapped files
- Collection-level locking
- Less efficient than WiredTiger

**Comparison:**
| Feature | WiredTiger | MMAPv1 |
|---------|------------|--------|
| Concurrency | Document-level | Collection-level |
| Compression | Yes | No |
| Performance | Better | Good |
| Storage | More efficient | Less efficient |

### Write Concern and Read Concern

**Write Concern:**
Write concern specifies the level of acknowledgment requested from MongoDB for write operations. It determines how many members of a replica set must acknowledge a write before it's considered successful.

```javascript
// Acknowledgment from primary only (default)
db.users.insertOne({ name: "John" }, { writeConcern: { w: 1 } });

// Acknowledgment from majority of replica set
db.users.insertOne({ name: "John" }, { writeConcern: { w: "majority" } });

// Acknowledgment from specific number of members
db.users.insertOne({ name: "John" }, { writeConcern: { w: 2 } });

// With timeout
db.users.insertOne({ name: "John" }, { 
  writeConcern: { w: "majority", wtimeout: 5000 } 
});
```

**Read Concern:**
Read concern specifies the consistency and isolation properties of the data read from the database.

```javascript
// Local (default) - Read from primary, may return uncommitted data
db.users.find().readConcern("local");

// Majority - Read only data that has been acknowledged by majority
db.users.find().readConcern("majority");

// Linearizable - Read data that reflects all successful majority-acknowledged writes
db.users.find().readConcern("linearizable");

// Snapshot - Read from a snapshot of majority-committed data
db.users.find().readConcern("snapshot");
```

### Covered Queries

A covered query is a query where all the fields in the query and the returned results are part of an index. It improves performance by avoiding the need to read documents from disk.

**Example:**
```javascript
// Create index
db.users.createIndex({ email: 1, name: 1 });

// Covered query - only uses index, doesn't read documents
db.users.find(
  { email: "john@example.com" },
  { email: 1, name: 1, _id: 0 }  // All fields in index
);

// Not covered - needs to read document for 'age' field
db.users.find(
  { email: "john@example.com" },
  { email: 1, name: 1, age: 1 }  // 'age' not in index
);
```

**Benefits:**
- Faster query execution
- Less I/O (no document reads)
- Lower memory usage
- Better performance for read-heavy workloads

## Best Practices

1. **Schema Design**: Design for access patterns
2. **Indexes**: Create indexes for common queries, monitor index usage
3. **Embed vs Reference**: Embed for 1:few, reference for 1:many
4. **Shard Key**: Choose high cardinality, even distribution
5. **Write Concerns**: Use appropriate write concern for durability
6. **Read Concerns**: Use appropriate read concern for consistency requirements
7. **Connection Pooling**: Use connection pooling in applications
8. **Monitoring**: Monitor performance and resource usage
9. **Backups**: Regular automated backups
10. **Security**: Enable authentication and authorization
11. **Version Control**: Use version control for schema changes
12. **Query Optimization**: Use explain() to analyze queries, use projections
13. **Covered Queries**: Design indexes to support covered queries when possible

## MongoDB Interview Questions

Common MongoDB interview questions and answers:

1. **What is MongoDB? How is it different from SQL databases?**
   - MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. Unlike SQL databases, it does not require a predefined schema and supports horizontal scaling.

2. **What are the key features of MongoDB?**
   - Schema-less, high performance, scalability, flexible data model, rich query language, and support for replication and sharding.

3. **Explain the concept of a document and collection in MongoDB.**
   - A document is a record in MongoDB, stored in BSON format. A collection is a group of documents, similar to a table in SQL databases.

4. **What is BSON in MongoDB?**
   - BSON (Binary JSON) is a binary representation of JSON-like documents, used internally by MongoDB for data storage and transfer.

5. **What is the difference between `find()` and `findOne()`?**
   - `find()` retrieves all documents matching the query, while `findOne()` retrieves only the first matching document.

6. **What are indexes in MongoDB? How do they improve performance?**
   - Indexes are special data structures that store a small portion of the collection's data set in an easy-to-traverse form. They improve query performance by allowing the database to quickly locate and retrieve data.

7. **What is the purpose of the `_id` field in MongoDB?**
   - The `_id` field is a unique identifier for each document in a collection. It ensures that each document can be uniquely identified and retrieved.

8. **Explain the difference between `db.collection.drop()` and `db.collection.remove()`.**
   - `db.collection.drop()` deletes the entire collection, including all documents and indexes. `db.collection.remove()` deletes documents matching the query but keeps the collection and indexes.

9. **What is sharding in MongoDB? Why is it important?**
   - Sharding is the process of distributing data across multiple servers to support horizontal scaling. It is important for handling large datasets and high-throughput applications.

10. **Explain the aggregation framework in MongoDB.**
    - The aggregation framework is a powerful tool for data transformation and analysis. It uses a pipeline of stages, such as `$match`, `$group`, and `$project`, to process and aggregate data.

11. **What are replica sets in MongoDB? How do they ensure high availability?**
    - Replica sets are groups of MongoDB servers that maintain the same data set. They ensure high availability by automatically failing over to a secondary server if the primary server goes down.

12. **What is the difference between embedded and referenced documents?**
    - Embedded documents store related data within a single document, while referenced documents store related data in separate documents and reference them using ObjectIds.

13. **What is a capped collection? When would you use it?**
    - A capped collection is a fixed-size collection that automatically overwrites the oldest documents when it reaches its size limit. It is useful for logging and caching scenarios.

14. **Explain the `$lookup` operator in MongoDB. How does it work?**
    - The `$lookup` operator performs a left outer join to another collection in the same database. It allows you to combine data from multiple collections in a single query.

15. **What is a covered query in MongoDB?**
    - A covered query is a query where all the fields in the query and the returned results are part of an index. It improves performance by avoiding the need to read documents from disk.

16. **Describe MongoDB's internal storage architecture.**
    - MongoDB uses a storage engine (e.g., WiredTiger) to manage data storage. Data is stored in collections, which are composed of documents. Indexes are used to improve query performance.

17. **What are the differences between MongoDB and other NoSQL databases like Cassandra or CouchDB?**
    - MongoDB uses a document-oriented model, while Cassandra uses a wide-column model and CouchDB uses a document model with a focus on replication and synchronization. MongoDB supports rich queries and indexing, while Cassandra excels in write-heavy workloads and CouchDB focuses on offline-first applications.

18. **Explain the write concern and read concern levels in MongoDB.**
    - Write concern specifies the level of acknowledgment requested from MongoDB for write operations. Read concern specifies the consistency and isolation properties of the data read from the database.

19. **What are MongoDB change streams, and how do they work?**
    - Change streams allow applications to access real-time data changes in a collection. They use the `watch()` method to listen for changes and provide a stream of change events.

20. **Describe the WiredTiger storage engine. How does it differ from MMAPv1?**
    - WiredTiger is the default storage engine in MongoDB, offering better compression, concurrency, and performance compared to the older MMAPv1 storage engine. WiredTiger uses a B-tree and LSM tree structure, while MMAPv1 uses memory-mapped files.

21. **How would you secure a MongoDB deployment in production?**
    - Enable authentication, use role-based access control, encrypt data at rest and in transit, configure firewalls, and regularly update MongoDB to the latest version.

22. **What is the difference between `findAndModify()` and `update()`? When would you use one over the other?**
    - `findAndModify()` atomically modifies and returns a single document, while `update()` modifies documents without returning them. Use `findAndModify()` when you need the modified document, and `update()` for bulk updates.

23. **Explain how MongoDB handles concurrency.**
    - MongoDB uses a combination of optimistic and pessimistic concurrency control. It employs document-level locking and supports multi-document transactions to ensure data consistency and isolation.

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Blog](https://www.mongodb.com/blog)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud-based MongoDB service



---

**Previous**: [MongoDB Performance & Security](./6-performance-security.md)

[Back to MongoDB Deep Dive](../README.md)