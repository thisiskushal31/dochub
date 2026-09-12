# Serverless Architecture

## What it is

**Serverless** (in the common cloud sense) means running **code without managing servers**: you deploy **functions** (or units of work), and the **platform** provisions, scales, and runs them. You pay per execution (and resources used), not for idle capacity. "Serverless" can also mean backend-as-a-service (BaaS) such as managed DB, auth, or storage.

## Why we need it

- **No server ops** — No SSH, patches, or capacity planning for the compute layer.
- **Auto-scaling** — Platform scales to zero and up with load; good for variable or sporadic traffic.
- **Cost** — Pay per use; no cost when there are no requests (for true scale-to-zero).

## How it works

1. You deploy **functions** (e.g. AWS Lambda, Google Cloud Functions) triggered by **events** (HTTP, queue message, schedule, storage event).
2. On each trigger, the platform runs one or more **invocations**; you only write the handler code.
3. Platform manages execution environment, scaling, and (usually) high availability.

## Key characteristics

- **Event-driven** — Invocations are triggered by events (API Gateway, SQS, cron, etc.).
- **Stateless** — Each invocation is independent; any state must be in external storage (DB, cache, object store).
- **Limits** — Timeout, memory, and concurrency limits per function and per account; cold starts can add latency.

## Trade-offs

- **Advantages:** No server management, automatic scaling, pay-per-use, fast to ship small units of work.
- **Disadvantages:** Cold starts, vendor lock-in, limits on execution time and resources, debugging and observability across many small functions.

**When to use:** Event-driven workloads (webhooks, file processing, scheduled jobs), APIs with spiky traffic, and glue code between services. Less suitable for long-running or stateful workloads and very low-latency requirements.
