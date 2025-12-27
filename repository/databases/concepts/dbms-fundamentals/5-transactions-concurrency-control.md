# Transactions & Concurrency Control

## Table of Contents

- [Topics](#topics)
  - [ACID Properties](#acid-properties)
  - [Types of Schedules](#types-of-schedules)
  - [Concurrency Control](#concurrency-control)
  - [Graph Based Concurrency Control](#graph-based-concurrency-control)
  - [Multiple Granularity Locking](#multiple-granularity-locking)
  - [Database Recovery Techniques](#database-recovery-techniques)
  - [Deadlock](#deadlock)
- [Related Topics](#related-topics)
- [References](#references)
ACID properties, transaction schedules, concurrency control protocols, locking mechanisms, and database recovery techniques.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Topics

### ACID Properties

[ACID Properties in DBMS](https://www.geeksforgeeks.org/acid-properties-in-dbms/)

ACID properties ensure reliable transaction processing in databases.

![ACID Properties Overview](../../assets/dbms-fundamentals/acid-properties.webp)

*Image Source: [ACID Properties in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/acid-properties-in-dbms/)*

**Atomicity:**
- All-or-nothing execution
- Either all operations succeed or all fail
- Implemented using transaction logs

![Atomicity Example](../../assets/dbms-fundamentals/acid-atomicity.webp)

*Image Source: [ACID Properties in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/acid-properties-in-dbms/)*

**Consistency:**
- Database remains in valid state before and after transaction
- All integrity constraints maintained
- No violation of database rules

**Isolation:**
- Concurrent transactions don't interfere
- Each transaction sees consistent data
- Implemented using locking or timestamping

![Isolation and Consistency Example](../../assets/dbms-fundamentals/acid-isolation.webp)

*Image Source: [ACID Properties in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/acid-properties-in-dbms/)*

![ACID Properties Diagram](../../assets/dbms-fundamentals/acid-diagram.webp)

*Image Source: [ACID Properties in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/acid-properties-in-dbms/)*

**Durability:**
- Committed changes persist even after system failure
- Data written to non-volatile storage
- Implemented using write-ahead logging (WAL)

### Types of Schedules

[Types of Schedules in DBMS](https://www.geeksforgeeks.org/types-of-schedules-in-dbms/)

A schedule is the sequence of operations from multiple transactions.

**Serial Schedule:**
- Transactions execute one after another
- No interleaving of operations
- Always correct but inefficient

**Serializable Schedule:**
- Equivalent to some serial schedule
- Correct and allows concurrency
- Conflict serializable or view serializable

**Non-Serializable Schedule:**
- Not equivalent to any serial schedule
- May cause inconsistency
- Should be avoided

**Recoverable Schedule:**
- Transaction commits only after all transactions it read from have committed
- Prevents dirty read problems

**Cascade-less Schedule:**
- No cascading rollbacks
- Transaction reads only committed data

### Concurrency Control

[Concurrency Control in DBMS](https://www.geeksforgeeks.org/concurrency-control-in-dbms/)

Concurrency control manages simultaneous access to database to maintain consistency.

**Problems without Concurrency Control:**
- **Lost Update**: Two transactions update same data, one overwrites
- **Dirty Read**: Reading uncommitted data
- **Unrepeatable Read**: Different values on re-read
- **Phantom Read**: New rows appear in re-read

**Methods:**
- **Locking**: Prevent access to data items
- **Timestamp Ordering**: Order transactions by timestamp
- **Optimistic Concurrency Control**: Validate at commit time
- **Multi-version Concurrency Control (MVCC)**: Maintain multiple versions

### Graph Based Concurrency Control

[Graph Based Concurrency Control Protocol in DBMS](https://www.geeksforgeeks.org/graph-based-concurrency-control-protocol-in-dbms/)

Uses a precedence graph to determine if a schedule is serializable.

**Precedence Graph:**
- Nodes represent transactions
- Edge T₁ → T₂ if T₁ conflicts with T₂
- Acyclic graph = serializable schedule
- Cycle = non-serializable schedule

**Conflict Serializability:**
- Two operations conflict if:
  - They belong to different transactions
  - They access same data item
  - At least one is a write

### Multiple Granularity Locking

[Multiple Granularity Locking in DBMS](https://www.geeksforgeeks.org/multiple-granularity-locking-in-dbms/)

Allows locking at different levels of granularity (database, table, page, row).

**Lock Modes:**
- **Shared Lock (S)**: Read access, multiple transactions can hold
- **Exclusive Lock (X)**: Write access, only one transaction can hold
- **Intention Shared (IS)**: Intention to acquire S lock at lower level
- **Intention Exclusive (IX)**: Intention to acquire X lock at lower level
- **Shared Intention Exclusive (SIX)**: S lock at current level, IX at lower levels

**Lock Compatibility Matrix:**
- S and IS: Compatible
- X and anything: Incompatible
- IS and IX: Compatible
- SIX and S: Compatible
- SIX and X: Incompatible

### Database Recovery Techniques

[Database Recovery Techniques in DBMS](https://www.geeksforgeeks.org/database-recovery-techniques-in-dbms/)

Recovery techniques restore database to consistent state after failure.

**Types of Failures:**
- **Transaction Failure**: Logical errors, system errors
- **System Failure**: Power loss, OS crash
- **Media Failure**: Disk crash, data corruption

**Recovery Techniques:**

1. **Log-Based Recovery**
   - Write-ahead logging (WAL)
   - Undo: Rollback uncommitted transactions
   - Redo: Replay committed transactions

2. **Checkpoint**
   - Periodically save database state
   - Reduces recovery time
   - Only redo transactions after checkpoint

3. **Shadow Paging**
   - Maintain shadow pages
   - Atomic commit by switching page tables
   - No log needed

**Recovery Process:**
1. Identify failed transactions
2. Undo uncommitted transactions
3. Redo committed transactions
4. Restore database to consistent state

### Deadlock

[Deadlock in DBMS](https://www.geeksforgeeks.org/deadlock-in-dbms/)

Deadlock occurs when two or more transactions wait indefinitely for each other to release locks.

**Example:**
- Transaction T₁ holds lock on A, waits for B
- Transaction T₂ holds lock on B, waits for A
- Both wait forever → Deadlock

**Deadlock Prevention:**
- **Wait-Die**: Older transaction waits, younger dies
- **Wound-Wait**: Older transaction wounds younger, younger waits
- **Timeout**: Abort transaction after timeout

**Deadlock Detection:**
- Build wait-for graph
- Check for cycles
- If cycle exists, abort one transaction

**Deadlock Avoidance:**
- Order resources
- Acquire locks in same order
- Prevents circular wait

## Related Topics

- **[Functional Dependencies & Normalisation](./4-functional-dependencies-normalisation.md)**: Database design principles
- **[Advanced DBMS](./6-advanced-dbms.md)**: Indexing and optimization
- **[Basics of DBMS](./1-basics-of-dbms.md)**: Database fundamentals

## References

- [ACID Properties in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/acid-properties-in-dbms/)
- [Types of Schedules in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/types-of-schedules-in-dbms/)
- [Concurrency Control in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/concurrency-control-in-dbms/)
- [Graph Based Concurrency Control Protocol in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/graph-based-concurrency-control-protocol-in-dbms/)
- [Multiple Granularity Locking in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/multiple-granularity-locking-in-dbms/)
- [Database Recovery Techniques in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/database-recovery-techniques-in-dbms/)
- [Deadlock in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/deadlock-in-dbms/)

---

[← Back to Database Concepts](../README.md) | [DBMS Fundamentals Overview](./README.md)

