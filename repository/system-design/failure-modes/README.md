# Failure modes at design time

What breaks in production **before** you ship — complements [Availability/](../Availability/README.md) and [Performance/](../Performance/README.md). Each topic: symptom → root cause → design mitigation → validation.

*(New section — stubs August 2026)*

## Topics

| # | File | Focus |
|---|------|--------|
| 1 | [Cache stampede and hot keys](./1_Cache_Stampede_and_Hot_Keys.md) | Thundering herd, single hot shard, mitigation |
| 2 | [Split brain and partition](./2_Split_Brain_and_Partition.md) | CAP in practice, quorum, fencing |
| 3 | [Cascading failures and timeout storms](./3_Cascading_Failures_and_Timeout_Storms.md) | Bulkhead, circuit breaker, retry budgets |
| 4 | [Data loss and durability gaps](./4_Data_Loss_and_Durability_Gaps.md) | WAL, async replication, backup RPO/RTO |

## Learning path

After [Consistency/1_Availability_vs_Consistency.md](../Consistency/1_Availability_vs_Consistency.md) and [Patterns/4_Circuit_Breaker.md](../Patterns/4_Circuit_Breaker.md): 1 → 2 → 3 → 4

## Use in case studies

Add a **Failure modes** section in each [Cases/](../Cases/README.md) file linking relevant topics above.

## Cross-references

- [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook) — incident response ops
- [Networks-Deep-Dive](../Networks-Deep-Dive/Failure-Modes/) — *(future)* network-specific failures
