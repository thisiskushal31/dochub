# Bulkhead and Retry

## Bulkhead

**Bulkhead** isolates parts of the application into **pools** (thread pools, connection pools, or process boundaries) so that a failure or overload in one pool doesn’t exhaust resources for others. Named after ship bulkheads: one flooded section doesn’t sink the whole hull.

- **Use case:** Limit concurrent calls to a single backend (e.g. per service or per user tier). When the pool is full, new requests queue or fail instead of consuming all threads. Protects the rest of the system from one noisy or failing dependency.

## Retry

**Retry** repeats a failed operation (e.g. a remote call) in the hope that the failure was **transient** (network blip, temporary overload). Improves resilience when dependencies are eventually consistent or briefly unavailable.

- **Exponential backoff** — Wait longer after each attempt (e.g. 1s, 2s, 4s) to avoid hammering the dependency.
- **Jitter** — Add randomness to backoff so many clients don’t retry at the same time.
- **Limit** — Max attempts or max time; then fail or hand off to a circuit breaker.

**Use case:** Transient failures; avoid retry storms by combining with backoff, jitter, and circuit breakers. Make operations **idempotent** so retries don’t double-apply side effects.
