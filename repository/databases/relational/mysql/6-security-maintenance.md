# MySQL Security & Maintenance

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Table of Contents

- [Security](#security)
  - [User Management](#user-management)
  - [Encryption](#encryption)
- [Operational Checklists](#operational-checklists)
  - [Daily Operations](#daily-operations)
  - [Weekly Operations](#weekly-operations)
  - [Monthly Operations](#monthly-operations)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debugging](#debugging)

## Security

### User Management
```sql
-- Create user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

-- Revoke privileges
REVOKE DELETE ON mydb.* FROM 'app_user'@'localhost';

-- Show grants
SHOW GRANTS FOR 'app_user'@'localhost';
```

### Encryption
```sql
-- Encrypt at rest (MySQL 8.0+)
ALTER INSTANCE ROTATE INNODB MASTER KEY;

-- Encrypt in transit (TLS)
-- Configure SSL certificates in my.cnf
```

## Operational Checklists

### Daily Operations
- [ ] Monitor slow query log
- [ ] Check replication lag
- [ ] Review connection pool usage
- [ ] Monitor disk space
- [ ] Check backup completion
- [ ] Review error logs for critical issues
- [ ] Monitor database performance metrics

### Weekly Operations
- [ ] Analyze table statistics
- [ ] Review and optimize slow queries
- [ ] Check index usage and remove unused indexes
- [ ] Review error logs comprehensively
- [ ] Verify backup restores (test restore procedure)
- [ ] Review connection patterns and adjust pool sizes if needed
- [ ] Check for table fragmentation

### Monthly Operations
- [ ] Review and update indexes based on query patterns
- [ ] Analyze growth trends and capacity planning
- [ ] Security audit (user privileges, access logs)
- [ ] Performance baseline comparison
- [ ] Review and update backup strategies
- [ ] Document any schema changes or optimizations
- [ ] Review replication configuration and performance

## Troubleshooting

### Common Issues
1. **Too many connections**: Increase max_connections or use connection pooling
2. **Slow queries**: Analyze with EXPLAIN, add indexes
3. **Lock contention**: Review isolation levels, optimize queries
4. **Replication lag**: Check network, replica performance
5. **Disk space**: Monitor growth, plan expansion

### Debugging
```sql
-- Check locks
SELECT * FROM information_schema.INNODB_LOCKS;
SELECT * FROM information_schema.INNODB_LOCK_WAITS;

-- Check replication status
SHOW SLAVE STATUS\G

-- Check table corruption
CHECK TABLE users;
REPAIR TABLE users;

-- Find slow queries
SELECT * FROM mysql.slow_log
ORDER BY query_time DESC
LIMIT 10;
```

---

**Previous**: [MySQL Performance & Operations](./5-performance-operations.md)

**Next**: [MySQL Advanced Topics](./7-advanced-topics.md) | [Back to MySQL Deep Dive](../README.md)