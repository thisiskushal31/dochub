# Consistency

CAP, consistency patterns, idempotency, and consensus in distributed systems.

## Topics

| Topic | File |
|--------|------|
| Availability vs consistency trade-off | [1-availability-vs-consistency.md](1-availability-vs-consistency.md) |
| CAP theorem (CP vs AP) | [2-cap-theorem.md](2-cap-theorem.md) |
| Strong, eventual, and weak consistency | [3-consistency-patterns.md](3-consistency-patterns.md) |
| Idempotent operations | [4-idempotency.md](4-idempotency.md) |
| Consensus algorithms (Paxos, Raft) | [5-consensus-algorithms.md](5-consensus-algorithms.md) |
| Compensating transactions (sagas) | [6-compensating-transactions.md](6-compensating-transactions.md) |

## Quick reference

- **CAP:** Choose two of Consistency, Availability, Partition tolerance; in practice, CP vs AP.
- **Patterns:** Strong (sync replication), eventual (async, converges), weak (no guarantee).
- **Idempotency:** Same effect when run once or many times; essential for queues and retries.
- **Consensus:** Agreement among nodes (e.g. Paxos, Raft) for replicated state and leader election.
- **Compensating transactions:** Undo or reverse a step in a distributed workflow when a later step fails; core of the saga pattern.
