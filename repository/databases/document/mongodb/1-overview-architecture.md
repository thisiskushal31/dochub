# MongoDB Overview & Architecture

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Table of Contents

- [Overview](#overview)
  - [What is NoSQL?](#what-is-nosql)
  - [JSON and BSON](#json-and-bson)
- [RDBMS vs NoSQL](#rdbms-vs-nosql)
  - [Non-Technical Criteria](#non-technical-criteria)
  - [Technical Criteria](#technical-criteria)
  - [Key Features](#key-features)
- [Architecture](#architecture)
  - [Components](#components)
  - [Data Model](#data-model)
- [Installation & Configuration](#installation-configuration)
  - [Installation](#installation)
  - [Connecting to MongoDB](#connecting-to-mongodb)
  - [Configuration](#configuration)

## Overview

MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents called BSON (Binary JSON). It's designed for scalability and developer productivity.

According to the [MongoDB Documentation](https://docs.mongodb.com/), "MongoDB is a general-purpose, document-based, distributed database built for modern application developers and for the cloud era." MongoDB's flexible schema and horizontal scaling capabilities make it ideal for modern applications with evolving data requirements.

### What is NoSQL?

NoSQL stands for "Not only SQL". NoSQL is a category of databases that stores data in non-relational fashion, meaning NoSQL generally doesn't store data in tables. The name NoSQL is given because in most NoSQL databases, we don't write SQL-like queries for inserting, deleting, updating, and fetching data.

**Types of NoSQL Databases:**
- **Graph Databases**: Neo4j
- **Key-Value Databases**: Redis
- **Document Database**: MongoDB
- **Wide-Column Stores**: Cassandra
- **Time-Series Databases**: InfluxDB

### JSON and BSON

**JSON (JavaScript Object Notation):**
JSON stands for JavaScript Object Notation. It is not actually related to JavaScript - if you make a JSON file, JavaScript can't do much with it directly.

**BSON (Binary JSON):**
MongoDB is a document-based database that internally stores data in the form of BSON (Binary JSON). As developers, we can send or receive data in the form of JSON, and MongoDB automatically manages the conversion between JSON and BSON.

## RDBMS vs NoSQL

When choosing a database for a product, consider both technical and non-technical criteria.

### Non-Technical Criteria

**Querying Interface:**
Every database provides different ways to query data:
- **SQL** in MySQL or PostgreSQL
- **JavaScript object-like syntax** in MongoDB
- **KQL** in Elasticsearch
- **CQL** in Cassandra

**Bulk Processing Support:**
This refers to how easy it is to import/export data or process multiple records together. MongoDB provides tools like `mongoimport` and `mongoexport` for bulk operations.

### Technical Criteria

**Transaction Support:**
- **RDBMS**: Provides excellent transaction support with ACID properties
- **NoSQL**: Transaction support varies (MongoDB supports ACID transactions since version 4.0)

**ACID Support:**

**RDBMS ACID:**
- **A (Atomicity)**: Either the transaction completes all steps, or if something goes wrong, none of them are applied. MySQL achieves this using undo logs.
- **C (Consistency)**: Before and after transaction, data is consistent. Achieved using double write buffer.
- **I (Isolation)**: Transactions execute independently using locks and isolation levels.
- **D (Durability)**: Committed transactions persist using REDO logs.

**NoSQL ACID (Alternative Interpretation):**
- **A (Associative)**: Allows parallel processing by enabling operations to be applied independently.
- **C (Commutative)**: If multiple operations are applied in different orders, the result should be the same.
- **I (Idempotent)**: If an operation is applied multiple times, its effect is only applied once.
- **D (Distributed)**: NoSQL databases support distributed architecture.

**Scaling:**
- **RDBMS**: Vertical scaling (increase server resources)
- **NoSQL**: Horizontal scaling (add more servers)

**Normalization:**
- **RDBMS**: Handles normalization better with joins and relationships
- **NoSQL**: Doesn't have joins, so doesn't handle normalization as well. Uses denormalization for performance.

**Use Case Examples:**

**MongoDB (NoSQL) - Good for:**
- Chat applications (flexible schema, scalable, easy backup using import-export, no strict ACID required)
- Content management systems
- Real-time analytics
- Applications with evolving schemas

**RDBMS (MySQL/PostgreSQL) - Good for:**
- Payment systems (high ACID requirement, transaction capabilities)
- Financial applications
- Applications requiring strict schema
- Systems requiring complex joins and normalization

### Key Features
- **Document Model**: Flexible schema, easy to work with
- **Horizontal Scaling**: Built-in sharding
- **High Availability**: Replica sets with automatic failover
- **Rich Query Language**: Powerful querying and aggregation
- **Indexing**: Secondary indexes for fast queries
- **Transactions**: ACID transactions (since 4.0)

## Architecture

### Components
- **Mongod**: Database server process
- **Mongos**: Query router for sharded clusters
- **Config Servers**: Store metadata for sharded clusters
- **Replica Set**: Group of mongod instances with same data

### Data Model

**MongoDB vs RDBMS Terminology:**

| RDBMS | MongoDB |
|-------|---------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Key (from key-value pair) |
| Primary Key | _id (ObjectId) |
| Foreign Key | Reference (manual) |
| Join | $lookup (aggregation) or application-level |

**How Data is Stored:**

In RDBMS (e.g., MySQL), data is stored in tables. Tables represent real-life entities. Inside a table, we have many rows. Rows represent one data record. Columns inside a table represent properties of the entity.

In MongoDB, we store data in the form of documents (JSON-like). A real-life entity is represented by **Collections**. What a table is for RDBMS, a collection is for MongoDB. In simple terms, collections are groups of JSON documents. One record in a collection is called a **Document**. What a row is for RDBMS, a document is for MongoDB. A document is nothing but a JSON (internally BSON), and a JSON has multiple key-value pairs. The key of JSON represents the property of the entity. So what a column is for RDBMS, a key (from key-value pair) is for MongoDB.

**Document Structure:**
```javascript
// Document structure
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  },
  tags: ["developer", "mongodb"],
  created_at: ISODate("2024-01-01T00:00:00Z")
}
```

**Flexible Schema:**
Unlike RDBMS where you must define table columns before inserting data, MongoDB doesn't restrict you. Two documents in the same collection can have different properties. This flexibility allows for schema evolution without migrations.

## Installation & Configuration

### Installation

Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/installation/) to set up MongoDB on your system.

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Docker:**
```bash
docker run --name mongodb -d -p 27017:27017 mongo:7.0
```

### Connecting to MongoDB

To connect to MongoDB from your application, you can use the MongoDB Node.js driver or an Object Data Modeling (ODM) library like Mongoose.

#### Using the MongoDB Node.js Driver

```javascript
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("mydatabase");
    const collection = db.collection("users");
    // Perform operations
  } catch (error) {
    console.error("Connection failed!", error);
  } finally {
    await client.close();
  }
}

connectToMongoDB();
```

#### Using Mongoose

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model your application data.

**Installation:**
```bash
npm install mongoose
```

**Connection:**
```javascript
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/mydatabase";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB database!");
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });
```

**Defining a Schema:**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String }
    },
    phoneNumber: { type: String },
    isActive: { type: Boolean, default: true },
    registrationDate: { type: Date, default: Date.now }
});

const Users = mongoose.model('users', userSchema);
module.exports = Users;
```

**Using the Model:**
```javascript
const Users = require('./models/users');

// Create user
const newUser = await Users.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    age: 30
});

// Find users with pagination
const page = 1;
const pageSize = 10;
const users = await Users.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize);

// Find by ID
const user = await Users.findOne({ _id: userId });

// Update user
const updatedUser = await Users.findOneAndUpdate(
    { _id: userId },
    { age: 31 },
    { new: true }
);

// Delete user
const deletedUser = await Users.findOneAndDelete({ _id: userId });
```

### Configuration
```yaml
# /etc/mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid

replication:
  replSetName: rs0

sharding:
  clusterRole: shardsvr
```


---

**Next**: [MongoDB Data Management](./2-data-management.md) | [Back to MongoDB Deep Dive](../README.md)