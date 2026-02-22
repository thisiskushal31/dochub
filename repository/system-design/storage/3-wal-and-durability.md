# WAL and Durability

## Write-ahead log (WAL)

Before applying changes to the main data structures (tables, indexes), the system writes a **sequential log** of those changes. On crash, recovery **replays** the log to restore state. WAL ensures **durability**: once a write is acknowledged, it can be recovered.

## Why WAL

- **Order** — Sequential disk writes are much faster than random writes. Batching and ordering improve throughput.
- **Crash recovery** — Replay log from last checkpoint to restore committed state.
- **Replication** — Many systems ship WAL (or logical log) to replicas for streaming replication.

## Checkpoints

Periodically the system **flushes** dirty pages to data files and records a checkpoint in the log. Recovery starts from the latest checkpoint and replays only subsequent log records, reducing replay time.

## Backups and PITR

- **Full backups** — Snapshot or copy of data at a point in time.
- **Incremental / continuous** — Back up WAL or change stream so you can restore to any point (PITR — point-in-time recovery).
- **Verification** — Restore tests and checksums to ensure backups are usable.

**Use case:** Any durable database or storage system; define RPO (how much data loss is acceptable) and use WAL + backups to meet it.
