# Data loss and durability gaps

[← failure-modes](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Async replication lag → lost commits on failover
- Missing WAL/fsync assumptions; object storage eventual consistency
- Backup RPO/RTO vs design (how much data loss acceptable)
- Multi-region: write path and conflict resolution
- Case links: [Google Drive](../cases/1-google-drive-file-sync.md), [Stripe](../cases/9-stripe-payments.md) (stub)
- Validation: failover drill; measure data loss window

## Cross-references

- [storage/3-wal-and-durability.md](../storage/3-wal-and-durability.md) · [security/5-data-backup-and-disaster-recovery.md](../security/5-data-backup-and-disaster-recovery.md) · [databases/5-database-replication.md](../databases/5-database-replication.md)

## Checklist before marking done

- [ ] Table: sync vs async replication → RPO
- [ ] Link Databases-Deep-Dive backup/CDC topics
