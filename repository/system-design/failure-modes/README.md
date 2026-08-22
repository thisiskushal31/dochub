# Failure modes at design time

What breaks in production **before** you ship — complements [availability/](../availability/README.md) and [performance/](../performance/README.md). Each topic: symptom → root cause → design mitigation → validation.

*(New section — stubs August 2026)*

## Topics

| # | File | Focus |
|---|------|--------|
| 1 | [Cache stampede and hot keys](./1-cache-stampede-and-hot-keys.md) | Thundering herd, single hot shard, mitigation |
| 2 | [Split brain and partition](./2-split-brain-and-partition.md) | CAP in practice, quorum, fencing |
| 3 | [Cascading failures and timeout storms](./3-cascading-failures-and-timeout-storms.md) | Bulkhead, circuit breaker, retry budgets |
| 4 | [Data loss and durability gaps](./4-data-loss-and-durability-gaps.md) | WAL, async replication, backup RPO/RTO |

## Learning path

After [consistency/1-availability-vs-consistency.md](../consistency/1-availability-vs-consistency.md) and [patterns/4-circuit-breaker.md](../patterns/4-circuit-breaker.md): 1 → 2 → 3 → 4

## Use in case studies

Add a **Failure modes** section in each [cases/](../cases/README.md) file linking relevant topics above.

## Cross-references

- [DevOps-Handbook](../DevOps-Handbook/CONTENT_WRITE_ORDER.md) — incident response ops
- [Networks-Deep-Dive](../Networks-Deep-Dive/failure-modes/) — *(future)* network-specific failures
