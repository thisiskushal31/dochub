# Consistency

CAP, consistency patterns, idempotency, and consensus in distributed systems.

## Topics

| Topic | File |
|--------|------|
| Availability vs consistency trade-off | [1_Availability_vs_Consistency.md](1_Availability_vs_Consistency.md) |
| CAP theorem (CP vs AP) | [2_CAP_Theorem.md](2_CAP_Theorem.md) |
| Strong, eventual, and weak consistency | [3_Consistency_Patterns.md](3_Consistency_Patterns.md) |
| Idempotent operations | [4_Idempotency.md](4_Idempotency.md) |
| Consensus algorithms (Paxos, Raft) | [5_Consensus_Algorithms.md](5_Consensus_Algorithms.md) |
| Compensating transactions (sagas) | [6_Compensating_Transactions.md](6_Compensating_Transactions.md) |

## Quick reference

- **CAP:** Choose two of Consistency, Availability, Partition tolerance; in practice, CP vs AP.
- **Patterns:** Strong (sync replication), eventual (async, converges), weak (no guarantee).
- **Idempotency:** Same effect when run once or many times; essential for queues and retries.
- **Consensus:** Agreement among nodes (e.g. Paxos, Raft) for replicated state and leader election.
- **Compensating transactions:** Undo or reverse a step in a distributed workflow when a later step fails; core of the saga pattern.
