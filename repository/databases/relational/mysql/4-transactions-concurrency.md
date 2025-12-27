# MySQL Transactions & Concurrency

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Transactions and Concurrency Control

Transactions ensure data integrity and maintain consistency in multi-user database environments. Understanding transactions and concurrency control is vital when dealing with concurrent database operations.

### Transactions and ACID Properties

According to the [MySQL Transaction documentation](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html), a transaction is a logical unit of work that consists of one or more database operations. Transactions adhere to the ACID properties:

**ACID Properties:**
- **Atomicity**: A transaction is treated as a single, indivisible unit of work. Either all operations within a transaction are committed, or none of them are.
- **Consistency**: Transactions bring the database from one consistent state to another consistent state. The integrity of the data is maintained.
- **Isolation**: Concurrently executing transactions are isolated from each other, ensuring that the intermediate states of transactions are not visible to other transactions.
- **Durability**: Once a transaction is committed, its changes are permanently saved and can survive system failures.

### TCL Commands (Transaction Control Language)

TCL commands are used to manage transactions in the database.

#### COMMIT

The COMMIT command saves all the transactions to the database since the last COMMIT or ROLLBACK command.

**Syntax:**
```sql
COMMIT;
```

**Example:**
```sql
DELETE FROM Student WHERE AGE = 20;
COMMIT;
```

#### ROLLBACK

If any error occurs with any of the SQL grouped statements, all changes need to be aborted. The process of reversing changes is called rollback.

**Syntax:**
```sql
ROLLBACK;
```

**Example:**
```sql
DELETE FROM Student WHERE AGE = 20;
ROLLBACK;
```

#### SAVEPOINT

SAVEPOINT allows you to set a point within a transaction to which you can later roll back.

**Syntax:**
```sql
SAVEPOINT savepoint_name;
ROLLBACK TO savepoint_name;
```

**Basic Transaction:**
```sql
-- Start transaction
START TRANSACTION;

-- Perform operations
INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET last_order_date = NOW() WHERE id = 1;

-- Commit transaction
COMMIT;

-- Or rollback on error
ROLLBACK;
```

**Transaction with Error Handling:**
```sql
START TRANSACTION;

INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET last_order_date = NOW() WHERE id = 1;

-- Check for errors
IF @@ERROR <> 0 THEN
    ROLLBACK;
ELSE
    COMMIT;
END IF;
```

### Isolation Levels

Isolation levels define the degree of isolation and concurrency control in database transactions. According to the [MySQL Isolation Levels documentation](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html), MySQL supports four isolation levels:

**Isolation Levels:**
1. **READ UNCOMMITTED**: Lowest isolation level
   - Allows dirty reads (reading uncommitted data)
   - No locks on reads
   - Fastest but least safe

2. **READ COMMITTED**: Default in some databases
   - Prevents dirty reads
   - Non-repeatable reads and phantom reads possible
   - Each read gets a fresh snapshot

3. **REPEATABLE READ**: MySQL InnoDB default
   - Prevents dirty reads and non-repeatable reads
   - Phantom reads may occur
   - Consistent reads within transaction

4. **SERIALIZABLE**: Highest isolation level
   - Prevents all concurrency issues
   - Transactions executed sequentially
   - Slowest but safest

**Setting Isolation Level:**
```sql
-- Set isolation level for current session
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Set isolation level globally
SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Check current isolation level
SELECT @@transaction_isolation;
```

**Isolation Level Comparison:**

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|----------------|------------|---------------------|--------------|
| READ UNCOMMITTED | Yes | Yes | Yes |
| READ COMMITTED | No | Yes | Yes |
| REPEATABLE READ | No | No | Yes |
| SERIALIZABLE | No | No | No |

### Locking

MySQL uses locks to control concurrent access to data.

**Lock Types:**
- **Shared Lock (S Lock)**: Allows reading, prevents writing
- **Exclusive Lock (X Lock)**: Prevents both reading and writing
- **Intention Lock**: Indicates intention to lock at a finer granularity

**Explicit Locking:**
```sql
-- Lock table for read
LOCK TABLES users READ;

-- Lock table for write
LOCK TABLES users WRITE;

-- Unlock tables
UNLOCK TABLES;

-- Row-level locking (InnoDB)
SELECT * FROM users WHERE id = 1 FOR UPDATE;  -- Exclusive lock
SELECT * FROM users WHERE id = 1 LOCK IN SHARE MODE;  -- Shared lock
```

**Deadlocks:**

A deadlock occurs when two or more transactions are waiting for each other's locks, creating a circular dependency. MySQL automatically detects deadlocks and rolls back one of the transactions.

**Prevention:**
- Always acquire locks in the same order across all transactions
- Keep transactions short to minimize lock duration
- Use appropriate isolation levels

**Detection:**
```sql
-- Check for deadlocks
SHOW ENGINE INNODB STATUS\G

-- Deadlock information
SELECT * FROM information_schema.INNODB_LOCKS;
SELECT * FROM information_schema.INNODB_LOCK_WAITS;
```

**Lock Contention:**

Lock contention occurs when multiple transactions try to access the same data simultaneously.

**Types of Locks:**
- **Row-level locks**: Most granular, best concurrency (InnoDB default)
- **Table-level locks**: Coarse-grained, can block all operations (MyISAM)
- **Lock timeouts**: Set appropriate timeout values to prevent indefinite waits
- **Lock escalation**: Monitor automatic lock escalation from row to table level

**Monitoring:**
```sql
-- Check current locks
SELECT * FROM information_schema.INNODB_LOCKS;
SELECT * FROM information_schema.INNODB_LOCK_WAITS;

-- Check lock wait time
SHOW ENGINE INNODB STATUS\G
```

### Concurrency Control Best Practices

1. **Keep transactions short**: Minimize lock duration
2. **Access tables in same order**: Prevents deadlocks
3. **Use appropriate isolation level**: Balance consistency and performance
4. **Monitor lock contention**: Use SHOW ENGINE INNODB STATUS
5. **Use row-level locking**: More granular than table locks (InnoDB provides this)
6. **Set lock timeouts**: Prevent indefinite waits
7. **Avoid long-running transactions**: They hold locks longer

---

**Previous**: [MySQL SQL Fundamentals](./3-sql-fundamentals.md)

**Next**: [MySQL Performance & Operations](./5-performance-operations.md) | [Back to MySQL Deep Dive](../README.md)