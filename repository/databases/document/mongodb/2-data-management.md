# MongoDB Data Management

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Table of Contents

- [Data Types](#data-types)
  - [Basic Types](#basic-types)
  - [Complex Types](#complex-types)
- [Schema Design](#schema-design)
  - [Collections & Documents](#collections-documents)
  - [Data Modeling Patterns](#data-modeling-patterns)
- [Indexing](#indexing)
  - [Index Types](#index-types)
  - [Index Management](#index-management)
  - [Analyzing Indexes](#analyzing-indexes)

## Data Types

### Basic Types
- **String**: UTF-8 strings
- **Integer**: 32-bit or 64-bit integers
- **Double**: 64-bit floating point
- **Boolean**: true/false
- **Date**: Date and time
- **ObjectId**: Unique identifier
- **Null**: Null value

### Complex Types
- **Array**: Ordered list of values
- **Embedded Document**: Nested objects
- **Binary Data**: Binary data (BSON)
- **Regular Expression**: Regex patterns
- **JavaScript**: JavaScript code

## Schema Design

### Collections & Documents
```javascript
// Create collection (implicit)
db.users.insertOne({ name: "John", email: "john@example.com" });

// Explicit collection creation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+$" }
      }
    }
  }
});
```

### Data Modeling Patterns

#### Embedded Documents (1:few)
```javascript
// Good for: Small, related data that's always accessed together
{
  _id: "user123",
  name: "John",
  addresses: [
    { street: "123 Main", city: "NYC" },
    { street: "456 Oak", city: "LA" }
  ]
}
```

#### References (1:many)
```javascript
// Good for: Large documents, many relationships
// User document
{
  _id: "user123",
  name: "John",
  order_ids: ["order1", "order2"]
}

// Order document
{
  _id: "order1",
  user_id: "user123",
  total: 100.00
}
```

## Indexing

Indexing is a mechanism using which a database prepares data structures to store data in a particular order based on particular keys, for faster search.

### Index Types

**Single Field Index:**
```javascript
db.users.createIndex({ email: 1 });  // 1 for ascending, -1 for descending
```

**Compound Index (order matters!):**
```javascript
db.orders.createIndex({ user_id: 1, created_at: -1 });
```

**Text Index:**
```javascript
db.articles.createIndex({ title: "text", content: "text" });
```

**Geospatial Index:**
```javascript
db.places.createIndex({ location: "2dsphere" });
```

**TTL Index (auto-delete after time):**
```javascript
db.sessions.createIndex({ created_at: 1 }, { expireAfterSeconds: 3600 });
```

**Unique Index:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
```

**Partial Index:**
```javascript
db.users.createIndex({ email: 1 }, { partialFilterExpression: { status: "active" } });
```

### Index Management

**List all indexes:**
```javascript
db.collection_name.getIndexes();
```

**Create an index:**
```javascript
db.collection_name.createIndex({ field: 1 });
```

**Drop an index:**
```javascript
db.collection_name.dropIndex("index_name");
// or
db.collection_name.dropIndex({ field: 1 });
```

**Rebuild indexes:**
```javascript
db.users.reIndex();
```

### Analyzing Indexes

**Using explain() to analyze queries:**

The `explain()` function helps analyze query performance. Pass `"executionStats"` as an argument to get detailed execution statistics.

```javascript
db.collection_name.find({ filter }).explain("executionStats");
```

**Key metrics to check:**
- **executionTimeMillis**: Time taken to execute query
- **totalKeysExamined**: Number of index keys examined
- **totalDocsExamined**: Number of documents examined
- **nReturned**: Number of documents returned
- **stage**: Query execution stage (COLLSCAN = collection scan, IXSCAN = index scan, FETCH = fetch documents)

**Example - Before Index:**
```javascript
db.weather_data.find({ elevation: { $lt: 8000 } }).explain("executionStats");
// Result: totalDocsExamined: 9991 (scans all documents)
```

**Example - After Index:**
```javascript
// Create index
db.weather_data.createIndex({ elevation: 1 });

// Query again
db.weather_data.find({ elevation: { $lt: 8000 } }).explain("executionStats");
// Result: totalKeysExamined: 6, totalDocsExamined: 6 (uses index efficiently)
```

**Performance Improvement:**
- **Before index**: `docsExamined: 9991` (full collection scan)
- **After index**: `docsExamined: 6` (index scan)
- **Time improvement**: From ~27ms to ~2ms

**Best Practices:**
- Create indexes on fields frequently used in queries
- Monitor `docsExamined` vs `nReturned` ratio (should be close to 1:1)
- Use compound indexes for queries with multiple filter conditions
- Order matters in compound indexes (most selective field first)


---

**Previous**: [MongoDB Overview & Architecture](./1-overview-architecture.md)

**Next**: [MongoDB Operations](./3-operations.md) | [Back to MongoDB Deep Dive](../README.md)