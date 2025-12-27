# MongoDB Aggregation

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Aggregation Pipeline

MongoDB's Aggregation Framework is a powerful tool for data transformation and analysis. It uses a pipeline of stages to process and aggregate data.

### Pipeline Stages

**Basic Aggregation:**
```javascript
// Basic aggregation
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { 
      _id: "$user_id", 
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    } 
  },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

**Lookup (Join):**
```javascript
// Lookup (join) - performs left outer join
db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" }
]);
```

**Project and Reshape:**
```javascript
// Project and reshape
db.orders.aggregate([
  { $project: {
      user_id: 1,
      total: 1,
      year: { $year: "$created_at" },
      month: { $month: "$created_at" }
    }
  }
]);
```

**Pagination using Aggregation:**
```javascript
// Simple pagination
db.users.aggregate([
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize }
]);

// Pagination with metadata using $facet
db.users.aggregate([
  {
    $facet: {
      metadata: [{ $count: 'totalCount' }],
      data: [
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ],
    },
  },
]);
```

**Common Aggregation Stages:**
- **$match**: Filter documents (like WHERE in SQL)
- **$group**: Group documents by field and perform aggregations
- **$project**: Reshape documents, add/remove fields
- **$sort**: Sort documents
- **$limit**: Limit number of documents
- **$skip**: Skip documents
- **$lookup**: Join with another collection
- **$unwind**: Deconstruct array fields
- **$facet**: Process multiple pipelines in parallel

**Common Aggregation Stages:**
- **$match**: Filter documents (like WHERE in SQL)
- **$group**: Group documents by field and perform aggregations
- **$project**: Reshape documents, add/remove fields
- **$sort**: Sort documents
- **$limit**: Limit number of documents
- **$skip**: Skip documents
- **$lookup**: Join with another collection
- **$unwind**: Deconstruct array fields
- **$facet**: Process multiple pipelines in parallel

**Pagination using Aggregation:**
```javascript
// Simple pagination
db.users.aggregate([
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize }
]);

// Pagination with metadata using $facet
db.users.aggregate([
  {
    $facet: {
      metadata: [{ $count: 'totalCount' }],
      data: [
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ],
    },
  },
]);
```

### Aggregation Operators
```javascript
// Arithmetic
{ $add: [ "$price", "$tax" ] }
{ $subtract: [ "$total", "$discount" ] }
{ $multiply: [ "$quantity", "$price" ] }
{ $divide: [ "$total", "$quantity" ] }

// String
{ $concat: [ "$first_name", " ", "$last_name" ] }
{ $toUpper: "$status" }
{ $toLower: "$email" }

// Date
{ $year: "$created_at" }
{ $month: "$created_at" }
{ $dayOfMonth: "$created_at" }

// Conditional
{ $cond: { if: "$is_active", then: "Active", else: "Inactive" } }
```


---

**Previous**: [MongoDB Operations](./3-operations.md)

**Next**: [MongoDB Advanced Features](./5-advanced-features.md) | [Back to MongoDB Deep Dive](../README.md)