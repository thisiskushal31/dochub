# Cascading failures and timeout storms

[← failure-modes](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Retry amplification when downstream is slow
- Timeout mismatch (client > server > DB)
- Circuit breaker, bulkhead, load shedding, graceful degradation
- Retry budgets and jittered backoff
- Case: one slow dependency takes down entire API
- Validation: fault injection on dependency; observe error rate propagation

## Cross-references

- [patterns/4-circuit-breaker.md](../patterns/4-circuit-breaker.md) · [patterns/5-bulkhead-and-retry.md](../patterns/5-bulkhead-and-retry.md) · [performance/2-rate-limiting.md](../performance/2-rate-limiting.md)

## Checklist before marking done

- [ ] ASCII: cascade across 3 services
- [ ] When **not** to retry (non-idempotent writes)
