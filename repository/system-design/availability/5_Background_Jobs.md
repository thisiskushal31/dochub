# Background Jobs

## What they are

Tasks that run **outside** the main request path: the system (or a scheduler) starts them, and they execute asynchronously. Typical uses:

- Maintenance (cleanup, backups, reports).
- Bulk processing (import/export, transformations).
- Notifications (email, push).
- Long-running work (ML, analytics).

## Event-driven

Jobs are **triggered by events**:

- A message is put in a queue; a worker consumes it and runs the job.
- A change in storage (e.g. new object) triggers a handler.
- An HTTP/webhook call triggers the job.

**Use when:** Work is tied to something that just happened (order placed, file uploaded).

## Schedule-driven

Jobs run on a **timer** (cron, scheduler, or delayed job):

- Run every N minutes, or at a fixed time.
- Another system (e.g. workflow engine) calls your API on a schedule.

**Use when:** Periodic maintenance, reports, or batch aggregation.

## Returning results

Background jobs usually don’t block the caller. To expose progress or results:

- **Polling** — Client polls a status endpoint or job ID.
- **Webhooks / callbacks** — System calls back when done.
- **Store result** — Write to DB or blob; client reads when ready.

Design for at-least-once execution and idempotent handlers so retries are safe.
