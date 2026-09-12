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

- [Patterns/4_Circuit_Breaker.md](../Patterns/4_Circuit_Breaker.md) · [Patterns/5_Bulkhead_and_Retry.md](../Patterns/5_Bulkhead_and_Retry.md) · [Performance/2_Rate_Limiting.md](../Performance/2_Rate_Limiting.md)

## Checklist before marking done

- [ ] ASCII: cascade across 3 services
- [ ] When **not** to retry (non-idempotent writes)
