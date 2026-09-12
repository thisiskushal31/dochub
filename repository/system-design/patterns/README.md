# Patterns

Architectural and resilience patterns: CQRS, event sourcing, leader election, circuit breaker, bulkhead, retry, event-driven architecture, serverless, event sourcing vs streaming.

## Topics

| Topic | File |
|--------|------|
| Event sourcing | [1_Event_Sourcing.md](1_Event_Sourcing.md) |
| CQRS | [2_Cqrs.md](2_Cqrs.md) |
| Leader election | [3_Leader_Election.md](3_Leader_Election.md) |
| Circuit breaker | [4_Circuit_Breaker.md](4_Circuit_Breaker.md) |
| Bulkhead and retry | [5_Bulkhead_and_Retry.md](5_Bulkhead_and_Retry.md) |
| Event-driven architecture (EDA) | [6_Event_Driven_Architecture.md](6_Event_Driven_Architecture.md) |
| Serverless architecture | [7_Serverless.md](7_Serverless.md) |
| Event sourcing vs event streaming | [8_Event_Sourcing_vs_Event_Streaming.md](8_Event_Sourcing_vs_Event_Streaming.md) |

## Quick reference

- **Event sourcing** — Store events as the source of truth; derive state by replay or projections.
- **CQRS** — Separate command (write) and query (read) models; scale and optimize each.
- **Leader election** — One active coordinator; use leases or consensus; fence stale leaders.
- **Circuit breaker** — Stop calling a failing dependency; fail fast; try again after timeout.
- **Bulkhead** — Isolate resources so one failure doesn’t exhaust the system. **Retry** — Retry with backoff and jitter; keep operations idempotent.
- **Event-driven architecture** — Components communicate via events; loose coupling; pub/sub or streams.
- **Serverless** — Run code without managing servers; scale to zero; pay per execution.
- **Event sourcing vs streaming** — Sourcing = state model and audit; streaming = transport and replay at scale.
