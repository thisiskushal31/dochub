# DLQ and Reliability

## Dead-letter queue (DLQ)

A **dead-letter queue (DLQ)** holds messages that could not be processed successfully. Move messages to the DLQ when:
- They **fail processing** repeatedly (e.g. after N retries),
- They **cannot be delivered** to any consumer,
- They **exceed TTL** or max delivery attempts, or
- They have **content or format errors** that make processing impossible.

That way:

- The main queue doesn’t get stuck on a poison message.
- You can **inspect and fix** bad messages (e.g. fix data and republish, or discard).
- You can **alert** on DLQ depth to detect systematic failures.

## Reliability patterns

- **Retries with backoff** — Retry failed consumption with exponential backoff; limit max retries before sending to DLQ.
- **Idempotent handlers** — So at-least-once delivery doesn’t cause duplicate side effects.
- **Poison-pill handling** — Detect messages that always fail (e.g. invalid payload) and move to DLQ or drop so one bad message doesn’t block the queue.
- **Ordering** — If order matters, use a single partition per key or accept reordering within a partition; DLQ can break order for failed messages unless you republish in order.

## At-least-once and exactly-once

- **At-least-once** — Consumer acks only after processing. If the consumer crashes after processing but before ack, the message is redelivered. Idempotency is required.
- **Exactly-once** — Achieved via idempotency keys, transactional outbox, or broker-supported exactly-once semantics; more complex to implement and operate.

**Use case:** Any production queue or stream; always plan for failures and poison messages. Use DLQ + monitoring and define a process for replay or discard.
