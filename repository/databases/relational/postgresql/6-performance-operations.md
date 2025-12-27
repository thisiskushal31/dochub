# PostgreSQL Performance & Operations

[← Back to PostgreSQL Deep Dive](../README.md)

## Backup & Recovery

### pg_dump / pg_restore

```bash
# Logical backup
pg_dump -h localhost -U postgres -d mydb -F c -f backup.dump

# Restore
pg_restore -h localhost -U postgres -d mydb -c backup.dump
```

### pg_basebackup

```bash
# Physical backup
pg_basebackup -h primary.example.com -D /var/lib/postgresql/backup -U replicator -v -P -W
```

### Continuous Archiving

```ini
# postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

### Point-in-Time Recovery (PITR)

```ini
# recovery.conf or postgresql.auto.conf
restore_command = 'cp /path/to/archive/%f %p'
recovery_target_time = '2024-01-01 12:00:00'
```

### Backup Tools

- **pgBackRest**: Enterprise-grade backup and restore tool
- **WAL-G**: Cloud-native backup tool supporting multiple cloud storage backends
- **pg_probackup**: PostgreSQL backup and recovery manager

## Monitoring

### Key Metrics

- **Replication Lag**: Monitor using `pg_stat_replication` view
- **Connection Count**: `pg_stat_activity`
- **Database Size**: `pg_database_size()`
- **Table Bloat**: `pg_stat_user_tables`
- **Index Usage**: `pg_stat_user_indexes`

### Monitoring Queries

```sql
-- Replication lag
SELECT 
    client_addr,
    state,
    sync_state,
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS sent_lag,
    pg_wal_lsn_diff(sent_lsn, write_lsn) AS write_lag,
    pg_wal_lsn_diff(write_lsn, flush_lsn) AS flush_lag,
    pg_wal_lsn_diff(flush_lsn, replay_lsn) AS replay_lag
FROM pg_stat_replication;

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Database sizes
SELECT 
    datname,
    pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;
```

### Logging

```ini
# postgresql.conf
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

## Performance Optimization

### Query Optimization

Query optimization is crucial for PostgreSQL performance. Use the following techniques:

1. **Use EXPLAIN and EXPLAIN ANALYZE**: Analyze query execution plans
2. **Create appropriate indexes**: Based on query patterns
3. **Update statistics**: Run `ANALYZE` regularly
4. **Monitor slow queries**: Use `pg_stat_statements` extension
5. **Optimize joins**: Ensure proper indexes on join columns
6. **Use prepared statements**: For repeated queries

### EXPLAIN and Query Plans

**EXPLAIN:**
```sql
-- Basic explain
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Explain with costs
EXPLAIN (FORMAT TEXT) SELECT * FROM users WHERE email = 'john@example.com';

-- Explain with actual execution
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- Explain with buffers
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE email = 'john@example.com';

-- Explain in JSON format
EXPLAIN (FORMAT JSON) SELECT * FROM users WHERE email = 'john@example.com';
```

**Understanding Query Plans:**
- **Seq Scan**: Sequential scan (slow for large tables)
- **Index Scan**: Uses index to find rows
- **Index Only Scan**: Retrieves data from index only
- **Bitmap Heap Scan**: Uses bitmap index scan
- **Nested Loop**: Joins tables using nested loops
- **Hash Join**: Joins tables using hash table
- **Merge Join**: Joins sorted tables

**Query Plan Example:**
```sql
EXPLAIN ANALYZE SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';
-- Output shows execution time, cost estimates, actual rows, index usage
```

### Indexing

**B-tree Index (Default):**
```sql
-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Partial index (index subset of rows)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Composite index (order matters!)
CREATE INDEX idx_users_name_email ON users(last_name, first_name, email);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Concurrent index creation (doesn't lock table)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

**Index Types:**
- **B-tree**: Default, good for most queries
- **Hash**: Fast equality lookups (limited use cases)
- **GIN**: Generalized Inverted Index (JSONB, arrays, full-text)
- **GiST**: Generalized Search Tree (geometric, full-text)
- **SP-GiST**: Space-partitioned GiST
- **BRIN**: Block Range Index (large sorted tables)

**Index Best Practices:**
- Index columns used in WHERE, JOIN, and ORDER BY clauses
- Composite index column order matters (most selective first)
- Use partial indexes for filtered queries
- Monitor index usage with `pg_stat_user_indexes`
- Remove unused indexes (they slow down writes)

**Monitor Index Usage:**
```sql
-- View index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE 'pg_toast%';
```

### pg_stat_statements

Enable query statistics tracking:

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View top slow queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    stddev_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Reset statistics
SELECT pg_stat_statements_reset();
```

**Configuration (postgresql.conf):**
```ini
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = all
pg_stat_statements.max = 10000
```

### Vacuum and Analyze

```sql
-- Manual vacuum
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE users;

-- Aggressive vacuum (locks table)
VACUUM FULL users;

-- Vacuum with options
VACUUM VERBOSE ANALYZE users;

-- Auto-vacuum configuration
ALTER TABLE users SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05
);
```

**Vacuum Best Practices:**
- Run `VACUUM` regularly to reclaim space
- Use `VACUUM ANALYZE` to update statistics
- Avoid `VACUUM FULL` in production (locks table)
- Monitor `pg_stat_user_tables` for vacuum needs


---

**Previous**: [PostgreSQL High Availability](./5-high-availability.md)

**Next**: [PostgreSQL Advanced Topics](./7-advanced-topics.md) | [Back to PostgreSQL Deep Dive](../README.md)