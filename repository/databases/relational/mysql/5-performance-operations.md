# MySQL Performance & Operations

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Table of Contents

- [Performance Optimization](#performance-optimization)
  - [Query Optimization](#query-optimization)
  - [Index Optimization](#index-optimization)
  - [Connection Pooling](#connection-pooling)
- [Replication](#replication)
  - [Master-Slave Setup](#master-slave-setup)
  - [MySQL Group Replication](#mysql-group-replication)
- [High Availability](#high-availability)
  - [MySQL InnoDB Cluster](#mysql-innodb-cluster)
  - [Failover Strategies](#failover-strategies)
- [Backup & Recovery](#backup-recovery)
  - [mysqldump](#mysqldump)
  - [Restore](#restore)
  - [Binary Log Backup](#binary-log-backup)
  - [Point-in-Time Recovery](#point-in-time-recovery)
- [Monitoring](#monitoring)
  - [Performance Schema](#performance-schema)
  - [Slow Query Log](#slow-query-log)
  - [Status Variables](#status-variables)

## Performance Optimization

### Query Optimization
```sql
-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Analyze table statistics
ANALYZE TABLE users;

-- Optimize table
OPTIMIZE TABLE users;

-- Check table status
SHOW TABLE STATUS LIKE 'users';
```

### Index Optimization
- **Covering indexes**: Include all columns needed for query
- **Composite indexes**: Order matters (most selective first)
- **Partial indexes**: Index subset of rows
- **Monitor index usage**: Remove unused indexes

### Connection Pooling
```python
# Python example with mysql-connector-pool
import mysql.connector
from mysql.connector import pooling

config = {
    'user': 'root',
    'password': 'password',
    'host': 'localhost',
    'database': 'mydb',
    'pool_name': 'mypool',
    'pool_size': 10
}

pool = mysql.connector.pooling.MySQLConnectionPool(**config)
connection = pool.get_connection()
```

## Replication

### Master-Slave Setup

#### Master Configuration
```ini
[mysqld]
server-id=1
log_bin=mysql-bin
binlog_format=ROW
```

#### Create Replication User
```sql
CREATE USER 'replicator'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
```

#### Slave Configuration
```ini
[mysqld]
server-id=2
relay_log=mysql-relay-bin
read_only=1
```

#### Setup Replication
```sql
-- On slave
CHANGE MASTER TO
    MASTER_HOST='master_host',
    MASTER_USER='replicator',
    MASTER_PASSWORD='password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=154;

START SLAVE;
SHOW SLAVE STATUS\G
```

### MySQL Group Replication
- **Multi-master**: All nodes can accept writes
- **Automatic failover**: Automatic member management
- **Consensus**: Paxos-based consensus protocol
- **Use cases**: High availability, automatic failover

## High Availability

### MySQL InnoDB Cluster
- **MySQL Shell**: Administration interface
- **MySQL Router**: Connection routing
- **Group Replication**: Multi-master replication
- **Automatic failover**: Seamless failover

### Failover Strategies
- **Automatic**: MySQL Router handles failover
- **Manual**: Admin-initiated failover
- **Testing**: Regularly test failover procedures

## Backup & Recovery

### mysqldump
```bash
# Full backup
mysqldump -u root -p --single-transaction --routines --triggers \
  --all-databases > backup_$(date +%Y%m%d).sql

# Single database
mysqldump -u root -p --single-transaction mydb > mydb_backup.sql

# Specific tables
mysqldump -u root -p mydb table1 table2 > tables_backup.sql

# With compression
mysqldump -u root -p --all-databases | gzip > backup.sql.gz
```

### Restore
```bash
# Restore from backup
mysql -u root -p < backup.sql

# Restore specific database
mysql -u root -p mydb < mydb_backup.sql

# Restore compressed backup
gunzip < backup.sql.gz | mysql -u root -p
```

### Binary Log Backup
```bash
# Enable binary logging
# Backup binary logs
mysqlbinlog --start-datetime="2024-01-01 00:00:00" \
  /var/log/mysql/mysql-bin.000001 > binlog_backup.sql
```

### Point-in-Time Recovery
```bash
# 1. Restore full backup
mysql -u root -p < full_backup.sql

# 2. Apply binary logs
mysqlbinlog --start-datetime="2024-01-01 00:00:00" \
  --stop-datetime="2024-01-01 12:00:00" \
  mysql-bin.000001 | mysql -u root -p
```

## Monitoring

### Performance Schema
```sql
-- Enable performance schema
-- Check enabled instruments
SELECT * FROM performance_schema.setup_instruments 
WHERE name LIKE 'statement%';

-- Top queries by execution time
SELECT 
    digest_text,
    count_star,
    sum_timer_wait/1000000000000 as total_time_sec,
    avg_timer_wait/1000000000000 as avg_time_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY sum_timer_wait DESC
LIMIT 10;
```

### Slow Query Log
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- Analyze slow queries
mysqldumpslow /var/log/mysql/slow.log
```

### Status Variables
```sql
-- Show status
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Slow_queries';

-- Show process list
SHOW PROCESSLIST;

-- Show engine status
SHOW ENGINE INNODB STATUS\G
```

---

**Previous**: [MySQL Transactions & Concurrency](./4-transactions-concurrency.md)

**Next**: [MySQL Security & Maintenance](./6-security-maintenance.md) | [Back to MySQL Deep Dive](../README.md)