# MongoDB Operations

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Table of Contents

- [Using MongoDB](#using-mongodb)
  - [Opening MongoDB Console](#opening-mongodb-console)
  - [Database Operations](#database-operations)
  - [Collection Operations](#collection-operations)
  - [Inserting Data](#inserting-data)
  - [Importing Data](#importing-data)
- [Querying](#querying)
  - [Basic Queries](#basic-queries)
  - [Projections](#projections)
  - [Sorting, Limit, and Skip](#sorting-limit-and-skip)
  - [Get Distinct Values](#get-distinct-values)
  - [Query Operators](#query-operators)
  - [Updates](#updates)
  - [Deletes](#deletes)

## Using MongoDB

### Opening MongoDB Console

**Using mongosh (MongoDB Shell):**
```bash
mongosh
```

**Using MongoDB Compass:**
MongoDB Compass is a GUI tool that provides a visual interface to MongoDB, including the same terminal functionality.

### Database Operations

**List all databases:**
```javascript
show databases;
// or
show dbs;
```

**Select a database:**
```javascript
use database_name;
```

**Note:** The `use` command creates a new database if no database with that name exists, otherwise it selects the existing database. However, if a database is empty (has no collections), it won't appear in `show dbs` output.

**View current database:**
```javascript
db;
```

**Delete database:**
```javascript
db.dropDatabase();
```

**Warning:** This permanently deletes the current database and all its collections!

**List all collections in current database:**
```javascript
show collections;
```

**Note:** Make sure to run `use database_name` first, otherwise no database will be selected.

### Collection Operations

**Create a collection:**
```javascript
db.createCollection("collection_name");
```

**Note:** In MongoDB, you don't need to define the schema (columns) when creating a collection. MongoDB doesn't restrict you - two documents in the same collection can have different properties. This is different from RDBMS where you must define table columns.

**Drop a collection:**
```javascript
db.collection_name.drop();
```

**Warning:** This permanently deletes the collection, all its documents, and all indexes!

**Print all documents in a collection:**
```javascript
db.collection_name.find();

// Prettified output (formatted for readability)
db.collection_name.find().pretty();
```

**Note:** If you have a large amount of data (e.g., 10,000+ documents), `find()` won't print all records at once. It will print some data and then give you a prompt "Type 'it' for more". Type `it` and press Enter to get the next group of data.

**Get count of documents:**
```javascript
// Note: cursor.count() is deprecated
db.collection_name.find().count();

// Use instead:
db.collection_name.estimatedDocumentCount();
// or
db.collection_name.countDocuments({ filter });
```

**Handle large result sets:**
```javascript
// Limit number of documents
db.collection_name.find().limit(10);

// Skip documents (offset)
db.collection_name.find().skip(5).limit(3);
```

### Inserting Data

**Insert a single document:**
```javascript
db.collection_name.insertOne({
    key1: value1,
    key2: value2,
    ...
});
```

**Legacy insert() method (deprecated):**
```javascript
// Note: insert() is deprecated, use insertOne() or insertMany() instead
db.collection_name.insert({
    key1: value1,
    key2: value2
});
```

**Insert multiple documents:**
```javascript
db.collection_name.insertMany([
    {
        key1: value1,
        key2: value2
    },
    {
        key1: value1,
        key2: value2,
        key3: value3
    },
    {
        key5: value5,
        key7: value7
    }
]);
```

**Arrays in documents:**
You can simply use `[]` to add arrays in JSON documents:
```javascript
db.users.insertOne({
    name: "John",
    tags: ["developer", "mongodb", "nodejs"]
});
```

### Importing Data

**Using MongoDB Compass:**
1. Create a new database (can be done directly in Compass)
2. Click "Add Data"
3. Choose "Import JSON or CSV file"
4. Select your JSON file
5. Click "Import"

**Using mongoimport (Command Line):**
```bash
mongoimport --db db_name --collection collection_name --file data.json
```

**Sample datasets:**
You can find free sample MongoDB datasets at: https://github.com/neelabalan/mongodb-sample-dataset

## Querying

### Basic Queries
```javascript
// Find all documents
db.users.find();

// Find with filter
db.users.find({ age: { $gte: 18 } });

// Find one document
db.users.findOne({ email: "john@example.com" });

// Filter records based on condition
db.collection_name.find({ key1: value1, key2: value2 });
```

### Projections

Projections allow you to select specific fields instead of getting all properties. In SQL, this is like using `SELECT name, address FROM TABLE` instead of `SELECT * FROM TABLE`.

**Include specific fields:**
```javascript
// First argument: filter criteria (can be empty object {})
// Second argument: fields to include (set to true)
db.collection_name.find({ filter1: value1 }, { property1: true, property2: true });
```

**Exclude specific fields:**
```javascript
// Exclude fields by setting them to false
db.collection_name.find({}, { property1: false, property2: false });
```

**Example:**
```javascript
// Get only position and visibility fields
db.weather_data.find({}, { position: true, visibility: true });

// Get everything except pastWeatherObservationManual and skyConditionObservation
db.weather_data.find({}, { pastWeatherObservationManual: false, skyConditionObservation: false });
```

### Sorting, Limit, and Skip
```javascript
// Sort
db.users.find().sort({ created_at: -1 });  // -1 for descending, 1 for ascending

// Limit number of documents
db.users.find().limit(10);

// Skip documents (pagination)
db.users.find().skip(20).limit(10);
```

### Get Distinct Values

**Get all distinct values of a particular key:**
```javascript
db.collection_name.distinct("key");
```

**Example:**
```javascript
db.weather_data.distinct("type");
// Returns: ['FM-13', 'SAO']
```

### Query Operators

MongoDB provides different comparison, logical, bitwise, and other operators. To use these operators, instead of directly assigning a key-value pair for filters, put your key and assign it an object. Inside that object, put the operator as the key and the value as the value.

**Syntax:**
```javascript
db.collection_name.find({ property: { $operator: value } });
```

**Commonly Used Operators:**

**Comparison Operators:**
```javascript
// Not equals
db.collection_name.find({ property: { $ne: value } });

// Equals (implicit, but can be explicit)
db.collection_name.find({ property: { $eq: value } });

// Less than
db.collection_name.find({ property: { $lt: value } });

// Less than or equal to
db.collection_name.find({ property: { $lte: value } });

// Greater than
db.collection_name.find({ property: { $gt: value } });

// Greater than or equal to
db.collection_name.find({ property: { $gte: value } });
```

**Logical Operators:**
```javascript
// AND
db.collection_name.find({ $and: [{ key1: value1 }, { key2: value2 }] });

// OR
db.collection_name.find({ $or: [{ key1: value1 }, { key2: value2 }] });

// NOT
db.collection_name.find({ $not: { key: value } });

// NOR (neither condition true)
db.collection_name.find({ $nor: [{ key1: value1 }, { key2: value2 }] });
```

**Array Operators:**
```javascript
// In array - check if property equals any value in array
db.collection_name.find({ property: { $in: [value1, value2, value3] } });

// Not in array
db.collection_name.find({ property: { $nin: [value1, value2] } });

// All - array contains all specified values
db.users.find({ tags: { $all: ["developer", "mongodb"] } });

// Size - array has specific size
db.users.find({ tags: { $size: 3 } });
```

**Element Operators:**
```javascript
// Field exists
db.users.find({ email: { $exists: true } });

// Field type
db.users.find({ tags: { $type: "array" } });
```

**String Operators:**
```javascript
// Regular expression
db.users.find({ email: { $regex: /@gmail\.com$/ } });
```

**Embedded Document Queries:**
```javascript
// Query nested fields using dot notation
db.users.find({ "address.city": "New York" });
```

**Examples:**
```javascript
// Find documents where type is not 'FM-13'
db.weather_data.find({ type: { $ne: 'FM-13' } });

// Find documents where callLetters is in array
db.weather_data.find({ callLetters: { $in: ['VC81', 'VCSZ'] } });

// Complex query with multiple conditions
db.users.find({
    $and: [
        { age: { $gte: 18 } },
        { status: { $in: ["active", "pending"] } }
    ]
});
```

### Updates

Update functions take two arguments:
1. **Filtration criteria**: How to filter what data to update
2. **Update value**: What value to update with

**Update One Document:**
```javascript
db.collection_name.updateOne(
  { filter1: value1 },
  { $operator: { key1: value1, key2: value2 } }
);
```

**Update Many Documents:**
```javascript
db.collection_name.updateMany(
  { filter1: value1 },
  { $operator: { key1: value1, key2: value2 } }
);
```

**Update Operators:**

**$set**: Allocates the value to the key directly
```javascript
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { status: "active" } }
);
```

**$inc**: Increments the value in the key
```javascript
// Increment
db.weather_data.updateOne(
  { _id: ObjectId("...") },
  { $inc: { elevation: 1 } }
);

// Decrement (use negative value)
db.weather_data.updateOne(
  { _id: ObjectId("...") },
  { $inc: { elevation: -1 } }
);
```

**Other Update Operators:**
```javascript
// $push: Add to array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { tags: "new_tag" } }
);

// $pull: Remove from array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $pull: { tags: "old_tag" } }
);

// $unset: Remove field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $unset: { old_field: "" } }
);

// $rename: Rename a field
db.comments.updateOne(
  { name: 'Manthan' },
  { $rename: { mem_since: 'member' } }
);

// Multiple operators
db.users.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { status: "active" },
    $inc: { login_count: 1 },
    $push: { tags: "new_tag" }
  }
);
```

**findAndModify vs updateOne:**

- **findAndModify()**: Atomically modifies and returns a single document. Use when you need the modified document returned.
- **updateOne()**: Modifies documents without returning them. Use for bulk updates when you don't need the modified document.

**Example:**
```javascript
// findAndModify - returns the modified document
const modified = db.users.findAndModify({
  query: { name: "John" },
  update: { $set: { status: "active" } },
  new: true  // Return the modified document
});

// updateOne - doesn't return the document
db.users.updateOne(
  { name: "John" },
  { $set: { status: "active" } }
);
```

**Replace Document:**
```javascript
db.users.replaceOne(
  { email: "john@example.com" },
  { name: "John", email: "john@example.com", status: "active" }
);
```

**Upsert Option:**
Upsert means "update if exists, insert if not". Use the `upsert: true` option to create a document if no document matches the filter.

```javascript
// Update if exists, insert if not
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { name: "John", email: "john@example.com", status: "active" } },
  { upsert: true }
);

// Example with upsert
db.comments.updateOne(
  { name: 'Manthan' },
  { $set: { name: 'Manthan', lang: 'JavaScript', mem_since: 1 } },
  { upsert: true }
);
```

**Note:** If you use `updateMany`, all records that match the filtration criteria will be updated.

### Deletes

**Delete One Document:**
```javascript
db.collection_name.deleteOne({ filter1: value1, filter2: value2 });
```

**Delete Many Documents:**
```javascript
db.collection_name.deleteMany({ filter1: value1, filter2: value2 });
```

**Find and Delete:**
```javascript
// Find one document matching criteria and delete it
db.collection_name.findOneAndDelete({ filter1: value1 });
```

**Legacy remove() method (deprecated):**
```javascript
// Note: remove() is deprecated, use deleteOne() or deleteMany() instead
db.collection_name.remove({ filter1: value1 });  // Removes all matching documents
db.collection_name.remove({ filter1: value1 }, { justOne: true });  // Removes one document
```

**Difference between drop() and remove():**
- **`db.collection.drop()`**: Deletes the entire collection, including all documents and indexes. The collection no longer exists.
- **`db.collection.remove()`**: Deletes documents matching the query but keeps the collection and indexes. The collection structure remains.

**Examples:**
```javascript
// Delete one document
db.weather_data.deleteOne({ st: 'x-19300+060300' });

// Delete by ObjectId
db.weather_data.deleteOne({ _id: ObjectId("5553a998e4b02cf7151190b9") });

// Delete many documents
db.weather_data.deleteMany({ callLetters: 'FNPG' });
```


---

**Previous**: [MongoDB Data Management](./2-data-management.md)

**Next**: [MongoDB Aggregation](./4-aggregation.md) | [Back to MongoDB Deep Dive](../README.md)