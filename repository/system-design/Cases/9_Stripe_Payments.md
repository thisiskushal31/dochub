# Stripe — payments API design

Design a **payments API** like Stripe: charge, refund, idempotent requests, ledger accuracy, high correctness over raw QPS.

*(Stub — fill this case when you write it.)*

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

- [Consistency/4_Idempotency.md](../Consistency/4_Idempotency.md), [Messaging/5_Dlq_and_Reliability.md](../Messaging/5_Dlq_and_Reliability.md), [Security/](../Security/README.md)

### Failure modes (to fill)

- Double charge, duplicate webhook, partition during settlement → [Failure-Modes/4_Data_Loss_and_Durability_Gaps.md](../Failure-Modes/4_Data_Loss_and_Durability_Gaps.md)

### Further reading

- [Stripe — Payment API design](https://stripe.com/blog/payment-api-design)
- [Companies index](./0_Companies_and_Products.md)

## Checklist before marking done

- [ ] Idempotency flow diagram
- [ ] Security-Tradeoffs/ threat notes for payment boundary
