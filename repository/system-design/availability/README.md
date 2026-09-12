# Availability

High availability, failover, replication, fault tolerance, reliability, maintainability, and background processing.

## Topics

| Topic | File |
|--------|------|
| Availability patterns (redundancy, fault tolerance) | [1_Availability_Patterns.md](1_Availability_Patterns.md) |
| Failover (active-passive, active-active) | [2_Failover.md](2_Failover.md) |
| Replication for availability (master-slave, master-master) | [3_Replication.md](3_Replication.md) |
| Availability in numbers (nines, sequence vs parallel) | [4_Availability_in_Numbers.md](4_Availability_in_Numbers.md) |
| Background jobs (event-driven, schedule-driven) | [5_Background_Jobs.md](5_Background_Jobs.md) |
| Load balancing vs failover | [6_Load_Balancing_vs_Failover.md](6_Load_Balancing_vs_Failover.md) |
| Fault tolerance in system design | [7_Fault_Tolerance.md](7_Fault_Tolerance.md) |
| Reliability in system design | [8_Reliability.md](8_Reliability.md) |
| Maintainability in system design | [9_Maintainability.md](9_Maintainability.md) |

## Quick reference

- **Failover:** Primary + standby; switch on failure. Active-active = both serve traffic. **LB vs failover:** LB spreads load; failover switches on failure.
- **Replication:** Multiple copies for availability and read scale; master-slave vs multi-master.
- **Fault tolerance:** Redundancy, failover, health checks, circuit breakers, graceful degradation.
- **Reliability:** Correctness, availability, durability, recoverability.
- **Maintainability:** Modularity, observability, documentation, operability.
- **Nines:** 99.9% ≈ three nines; sequence reduces availability, parallel increases it.
- **Background jobs:** Event-driven (queue, webhook) or schedule-driven (cron); design for idempotency.
