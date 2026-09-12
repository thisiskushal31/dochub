# Data loss and durability gaps

[← failure-modes](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Async replication lag → lost commits on failover
- Missing WAL/fsync assumptions; object storage eventual consistency
- Backup RPO/RTO vs design (how much data loss acceptable)
- Multi-region: write path and conflict resolution
- Case links: [Google Drive](../Cases/1_Google_Drive_File_Sync.md), [Stripe](../Cases/9_Stripe_Payments.md) (stub)
- Validation: failover drill; measure data loss window

## Cross-references

- [Storage/3_WAL_and_Durability.md](../Storage/3_WAL_and_Durability.md) · [Security/5_Data_Backup_and_Disaster_Recovery.md](../Security/5_Data_Backup_and_Disaster_Recovery.md) · [Databases/5_Database_Replication.md](../Databases/5_Database_Replication.md)

## Checklist before marking done

- [ ] Table: sync vs async replication → RPO
- [ ] Link Databases-Deep-Dive backup/CDC topics
