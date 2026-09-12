# Task Queues

## What they do

**Task queues** accept **tasks** (and their input data), run them (often in worker processes), and optionally deliver **results**. They often support **scheduling** (run at a time or after a delay) and are used for background or batch work.

## Message queue vs task queue

- **Message queue** — Carries messages; consumer does whatever the app defines (could be a task, an event handler, or a notification). Generic.
- **Task queue** — Explicit notion of a "task" and often of "result." May sit on top of a message broker (e.g. Celery uses RabbitMQ/Redis). Often has built-in scheduling, retries, and result backends.

## Typical features

- **Schedule** — Run at a specific time or after a delay (e.g. "send reminder in 1 hour").
- **Result** — Store or return the result of the task (e.g. poll by task id, or callback).
- **Retries** — Retry failed tasks with backoff.
- **Concurrency** — Many workers consume from the queue; scale by adding workers.

**Use case:** CPU- or I/O-intensive jobs (video encoding, report generation, batch imports), scheduled jobs (daily digest, cleanup), or any work that should not run inside the request path. Design tasks to be **idempotent** when the broker gives at-least-once delivery.
