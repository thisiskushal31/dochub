# Patterns

Architectural and resilience patterns: CQRS, event sourcing, leader election, circuit breaker, bulkhead, retry, event-driven architecture, serverless, event sourcing vs streaming.

## Topics

| Topic | File |
|--------|------|
| Event sourcing | [1-event-sourcing.md](1-event-sourcing.md) |
| CQRS | [2-cqrs.md](2-cqrs.md) |
| Leader election | [3-leader-election.md](3-leader-election.md) |
| Circuit breaker | [4-circuit-breaker.md](4-circuit-breaker.md) |
| Bulkhead and retry | [5-bulkhead-and-retry.md](5-bulkhead-and-retry.md) |
| Event-driven architecture (EDA) | [6-event-driven-architecture.md](6-event-driven-architecture.md) |
| Serverless architecture | [7-serverless.md](7-serverless.md) |
| Event sourcing vs event streaming | [8-event-sourcing-vs-event-streaming.md](8-event-sourcing-vs-event-streaming.md) |

## Quick reference

- **Event sourcing** — Store events as the source of truth; derive state by replay or projections.
- **CQRS** — Separate command (write) and query (read) models; scale and optimize each.
- **Leader election** — One active coordinator; use leases or consensus; fence stale leaders.
- **Circuit breaker** — Stop calling a failing dependency; fail fast; try again after timeout.
- **Bulkhead** — Isolate resources so one failure doesn’t exhaust the system. **Retry** — Retry with backoff and jitter; keep operations idempotent.
- **Event-driven architecture** — Components communicate via events; loose coupling; pub/sub or streams.
- **Serverless** — Run code without managing servers; scale to zero; pay per execution.
- **Event sourcing vs streaming** — Sourcing = state model and audit; streaming = transport and replay at scale.
