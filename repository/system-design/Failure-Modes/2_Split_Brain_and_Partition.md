# Split brain and partition

[← failure-modes](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Network partition → dual primaries, divergent writes
- Quorum reads/writes, leader election, fencing tokens
- CAP trade-off in real systems (not textbook only)
- Split brain in Redis, MongoDB, Kafka — **design-level**; ops detail → Databases-Deep-Dive
- Validation: chaos partition injection; assert single writer invariant

## Cross-references

- [Consistency/2_CAP_Theorem.md](../Consistency/2_CAP_Theorem.md) · [Patterns/3_Leader_Election.md](../Patterns/3_Leader_Election.md) · [Availability/2_Failover.md](../Availability/2_Failover.md)

## Checklist before marking done

- [ ] Mermaid: partition → split brain → data divergence
- [ ] Link Databases replication deep dive for engine-specific behavior
