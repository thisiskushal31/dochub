# Availability

High availability, failover, replication, fault tolerance, reliability, maintainability, and background processing.

## Topics

| Topic | File |
|--------|------|
| Availability patterns (redundancy, fault tolerance) | [1-availability-patterns.md](1-availability-patterns.md) |
| Failover (active-passive, active-active) | [2-failover.md](2-failover.md) |
| Replication for availability (master-slave, master-master) | [3-replication.md](3-replication.md) |
| Availability in numbers (nines, sequence vs parallel) | [4-availability-in-numbers.md](4-availability-in-numbers.md) |
| Background jobs (event-driven, schedule-driven) | [5-background-jobs.md](5-background-jobs.md) |
| Load balancing vs failover | [6-load-balancing-vs-failover.md](6-load-balancing-vs-failover.md) |
| Fault tolerance in system design | [7-fault-tolerance.md](7-fault-tolerance.md) |
| Reliability in system design | [8-reliability.md](8-reliability.md) |
| Maintainability in system design | [9-maintainability.md](9-maintainability.md) |

## Quick reference

- **Failover:** Primary + standby; switch on failure. Active-active = both serve traffic. **LB vs failover:** LB spreads load; failover switches on failure.
- **Replication:** Multiple copies for availability and read scale; master-slave vs multi-master.
- **Fault tolerance:** Redundancy, failover, health checks, circuit breakers, graceful degradation.
- **Reliability:** Correctness, availability, durability, recoverability.
- **Maintainability:** Modularity, observability, documentation, operability.
- **Nines:** 99.9% ≈ three nines; sequence reduces availability, parallel increases it.
- **Background jobs:** Event-driven (queue, webhook) or schedule-driven (cron); design for idempotency.
