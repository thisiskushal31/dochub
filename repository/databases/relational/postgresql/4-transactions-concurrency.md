# PostgreSQL Transactions & Concurrency

[← Back to PostgreSQL Deep Dive](../README.md)

## Transactions & Concurrency

### Transactions and ACID Properties

PostgreSQL ensures ACID (Atomicity, Consistency, Isolation, Durability) properties:

- **Atomicity**: All operations in a transaction succeed or fail together
- **Consistency**: Database remains in a valid state
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Committed changes persist even after system failure

### Transaction Control

```sql
-- Begin transaction
BEGIN;

-- Or
BEGIN TRANSACTION;

-- Commit transaction
COMMIT;

-- Rollback transaction
ROLLBACK;

-- Savepoint
BEGIN;
SAVEPOINT my_savepoint;
-- ... some operations ...
ROLLBACK TO SAVEPOINT my_savepoint;
COMMIT;
```

### Isolation Levels

PostgreSQL supports four isolation levels (from least to most strict):

1. **READ UNCOMMITTED**: Not supported (treated as READ COMMITTED)
2. **READ COMMITTED**: Default level, sees only committed data
3. **REPEATABLE READ**: Sees snapshot of data at transaction start
4. **SERIALIZABLE**: Highest isolation, prevents all anomalies

```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Or in transaction
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

### MVCC (Multi-Version Concurrency Control)

PostgreSQL uses MVCC to provide concurrent access:

- Each transaction sees a snapshot of the database
- No read locks required
- Writers don't block readers
- Readers don't block writers

### Locking

```sql
-- Table-level locks
LOCK TABLE users IN SHARE MODE;
LOCK TABLE users IN EXCLUSIVE MODE;

-- Row-level locks (automatic in UPDATE/DELETE)
SELECT * FROM users WHERE id = 1 FOR UPDATE;
SELECT * FROM users WHERE id = 1 FOR SHARE;

-- Advisory locks
SELECT pg_advisory_lock(123);
SELECT pg_advisory_unlock(123);
```

### Deadlocks

PostgreSQL automatically detects and resolves deadlocks:

```sql
-- Monitor locks
SELECT * FROM pg_locks;

-- Check for blocking queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```


---

**Previous**: [PostgreSQL SQL Fundamentals](./3-sql-fundamentals.md)

**Next**: [PostgreSQL High Availability](./5-high-availability.md) | [Back to PostgreSQL Deep Dive](../README.md)