# MongoDB Advanced Features

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Text Search

MongoDB supports full-text search capabilities using text indexes.

**Create Text Index:**
```javascript
// Single field text index
db.articles.createIndex({ content: "text" });

// Multiple fields text index
db.articles.createIndex({ title: "text", content: "text" });
```

**Perform Text Search:**
```javascript
// Search for documents containing the search term
db.articles.find({ $text: { $search: "searchQuery" } });

// Search with language specification
db.articles.find({ $text: { $search: "searchQuery", $language: "en" } });

// Sort by text score
db.articles.find(
  { $text: { $search: "mongodb tutorial" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });
```

**Text Search Operators:**
- **$search**: The text string to search for
- **$language**: Language for stemming and stop words
- **$caseSensitive**: Case-sensitive search (default: false)
- **$diacriticSensitive**: Diacritic-sensitive search (default: false)

## Geospatial Queries

MongoDB has built-in support for geospatial queries, allowing you to query documents based on their geographical location.

**Create Geospatial Index:**
```javascript
// 2dsphere index (for GeoJSON data)
db.places.createIndex({ location: "2dsphere" });

// 2d index (for legacy coordinate pairs)
db.places.createIndex({ location: "2d" });
```

**Geospatial Query Operators:**
```javascript
// $near - Find documents near a point
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [longitude, latitude] },
      $maxDistance: 1000  // in meters
    }
  }
});

// $geoWithin - Find documents within a shape
db.places.find({
  location: {
    $geoWithin: {
      $centerSphere: [[longitude, latitude], radiusInRadians]
    }
  }
});

// $geoIntersects - Find documents that intersect with a shape
db.places.find({
  location: {
    $geoIntersects: {
      $geometry: {
        type: "Polygon",
        coordinates: [[[lng1, lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1]]]
      }
    }
  }
});
```

**Example Document:**
```javascript
{
  _id: ObjectId("..."),
  name: "Central Park",
  location: {
    type: "Point",
    coordinates: [-73.965355, 40.782865]  // [longitude, latitude]
  }
}
```

## Transactions

MongoDB supports multi-document transactions (since version 4.0), allowing multiple operations to be executed atomically.

### Basic Transactions
```javascript
// Start session
const session = db.getMongo().startSession();

// Start transaction
session.startTransaction();

try {
  // Operations within transaction
  db.users.insertOne({ name: "John" }, { session });
  db.orders.insertOne({ user_id: "...", total: 100 }, { session });
  
  // Commit transaction
  session.commitTransaction();
} catch (error) {
  // Rollback on error
  session.abortTransaction();
} finally {
  session.endSession();
}
```

**Transaction in mongosh:**
```javascript
session = db.getMongo().startSession();
session.startTransaction();
try {
  db.collection1.updateOne({ field: value1 }, { $set: { updateField1: newValue1 } }, { session });
  db.collection2.updateOne({ field: value2 }, { $set: { updateField2: newValue2 } }, { session });
  session.commitTransaction();
} catch (error) {
  print("Transaction failed. Aborting...");
  session.abortTransaction();
} finally {
  session.endSession();
}
```

**Transaction Requirements:**
- MongoDB 4.0+ for replica sets
- MongoDB 4.2+ for sharded clusters
- WiredTiger storage engine
- All operations must be on the same session

## Replication

### Replica Set Setup
```javascript
// Initialize replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { id: 1, host: "localhost:27018" },
    { id: 2, host: "localhost:27019" }
  ]
});

// Check status
rs.status();

// Add member
rs.add("localhost:27020");

// Remove member
rs.remove("localhost:27020");
```

### Read Preferences
```javascript
// Primary (default)
db.users.find().readPref("primary");

// Secondary
db.users.find().readPref("secondary");

// Nearest
db.users.find().readPref("nearest");
```

## Sharding

### Sharded Cluster Setup
```javascript
// Enable sharding
sh.enableSharding("mydb");

// Create shard key
sh.shardCollection("mydb.users", { user_id: 1 });

// Add shard
sh.addShard("rs0/localhost:27017");

// Check shard status
sh.status();
```

### Shard Key Selection
- **High cardinality**: Many unique values
- **Even distribution**: Avoid hotspots
- **Query patterns**: Align with common queries
- **Avoid**: Low cardinality, sequential keys


---

**Previous**: [MongoDB Aggregation](./4-aggregation.md)

**Next**: [MongoDB Performance & Security](./6-performance-security.md) | [Back to MongoDB Deep Dive](../README.md)