# Stripe — payments API design

Design a **payments API** like Stripe: charge, refund, idempotent requests, ledger accuracy, high correctness over raw QPS.

*(Content TBD — stub created August 2026 — priority v2 in [PLANNED_CASES.md](../PLANNED_CASES.md))*

## Planned coverage

### Requirements

- Create payment, idempotent retries, webhooks, reconciliation
- Strong consistency for money movement; audit trail

### High-level design

- Idempotency keys; exactly-once semantics at API layer
- Ledger / double-entry storage; state machine per payment
- PCI scope minimization (tokenization, no raw PAN in app DB)
- Async webhooks with signing and retry

### Key concepts

- [consistency/4-idempotency.md](../consistency/4-idempotency.md), [messaging/5-dlq-and-reliability.md](../messaging/5-dlq-and-reliability.md), [security/](../security/README.md)

### Failure modes (to fill)

- Double charge, duplicate webhook, partition during settlement → [failure-modes/4-data-loss-and-durability-gaps.md](../failure-modes/4-data-loss-and-durability-gaps.md)

### Further reading

- [Stripe — Payment API design](https://stripe.com/blog/payment-api-design)
- [Companies index](./0-companies-and-products.md)

## Checklist before marking done

- [ ] Idempotency flow diagram
- [ ] security-tradeoffs/ threat notes for payment boundary
