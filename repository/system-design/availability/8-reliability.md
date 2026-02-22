# Reliability in System Design

## What it is

**Reliability** is the extent to which a system **performs its intended function** correctly and consistently over time. It encompasses **correctness** (right results), **availability** (up when needed), and **durability** (data not lost when failures occur).

## Why we need it

- **User trust** — Systems that fail often or lose data lose users.
- **Business** — Downtime and errors have direct cost (revenue, compliance, reputation).

## Key aspects

- **Availability** — Percentage of time the system is up and serving. See [Availability in numbers](4-availability-in-numbers.md).
- **Fault tolerance** — System continues or degrades gracefully when components fail. See [Fault tolerance](7-fault-tolerance.md).
- **Durability** — Data is not lost on failure; achieved via replication, WAL, and backups. See [Replication](3-replication.md), [WAL](../storage/3-wal-and-durability.md).
- **Correctness** — Consistency and integrity; no silent corruption. See [Consistency](../consistency/1-availability-vs-consistency.md).
- **Recoverability** — Ability to recover from failures (restore from backup, replay logs, failover).

## Improving reliability

- **Redundancy and failover** — Remove single points of failure.
- **Testing** — Unit, integration, chaos/failure testing.
- **Monitoring and alerting** — Detect and respond to failures quickly.
- **Operational practices** — Runbooks, incident response, post-mortems.

**When to use:** Reliability is a core requirement for production; balance it with cost and complexity via SLIs/SLOs and error budgets.
