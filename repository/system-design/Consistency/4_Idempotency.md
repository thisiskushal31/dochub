# Idempotent Operations

## Definition

An operation is **idempotent** if applying it multiple times has the same effect as applying it once. Executing it once or many times does not change the result beyond the first application.

## Why it matters

- **At-least-once delivery** — Many queues and RPC systems guarantee *at least once*, not *exactly once*. The same message or request can be processed more than once. Idempotent handlers avoid duplicate side effects (e.g. double charge, double insert).
- **Retries** — Safe to retry on timeout or failure without corrupting state.
- **Cross-region / async** — When systems are not fully synchronized, idempotency keys or tokens help deduplicate.

## How to achieve it

- **Idempotency keys** — Client sends a unique key per logical operation; server deduplicates by key within a time window.
- **Natural idempotency** — Design operations so that repeating them is safe (e.g. “set balance to 100” vs “add 10 to balance”).
- **Fences / tokens** — Reject outdated requests (e.g. sequence numbers, timestamps) so only the latest wins.

**Use case:** Payment APIs, inventory updates, and any handler behind a queue or at-least-once transport should be idempotent.
