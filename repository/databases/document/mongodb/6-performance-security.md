# MongoDB Performance & Security

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MongoDB Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mongodb-mastery-series) blog posts.**

[← Back to MongoDB Deep Dive](../README.md)

## Table of Contents

- [Performance Optimization](#performance-optimization)
  - [Query Optimization](#query-optimization)
  - [Monitoring](#monitoring)
- [Backup & Recovery](#backup-recovery)
  - [mongodump](#mongodump)
  - [mongorestore](#mongorestore)
- [Security](#security)
  - [Authentication](#authentication)
  - [Authorization](#authorization)

## Performance Optimization

### Query Optimization
```javascript
// Use explain
db.users.find({ email: "john@example.com" }).explain("executionStats");

// Use indexes
db.users.find({ email: "john@example.com" }).hint({ email: 1 });

// Limit results
db.users.find().limit(100);

// Project only needed fields
db.users.find({}, { name: 1, email: 1 });
```

### Monitoring
```javascript
// Server status
db.serverStatus();

// Current operations
db.currentOp();

// Database stats
db.stats();

// Collection stats
db.users.stats();
```

## Backup & Recovery

### mongodump
```bash
# Full backup
mongodump --uri="mongodb://localhost:27017" --out=/backup

# Single database
mongodump --uri="mongodb://localhost:27017" --db=mydb --out=/backup

# Single collection
mongodump --uri="mongodb://localhost:27017" --db=mydb --collection=users --out=/backup

# With compression
mongodump --uri="mongodb://localhost:27017" --archive=/backup/backup.gz --gzip
```

### mongorestore
```bash
# Restore full backup
mongorestore --uri="mongodb://localhost:27017" /backup

# Restore single database
mongorestore --uri="mongodb://localhost:27017" --db=mydb /backup/mydb

# Restore compressed backup
mongorestore --uri="mongodb://localhost:27017" --archive=/backup/backup.gz --gzip
```

## Security

### Authentication
```javascript
// Create user
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["root"]
});

// Authenticate
db.auth("admin", "password");
```

### Authorization
```javascript
// Create read-only user
db.createUser({
  user: "readonly",
  pwd: "password",
  roles: [{ role: "read", db: "mydb" }]
});

// Create application user
db.createUser({
  user: "app",
  pwd: "password",
  roles: [
    { role: "readWrite", db: "mydb" }
  ]
});
```


---

**Previous**: [MongoDB Advanced Features](./5-advanced-features.md)

**Next**: [MongoDB Best Practices](./7-best-practices.md) | [Back to MongoDB Deep Dive](../README.md)