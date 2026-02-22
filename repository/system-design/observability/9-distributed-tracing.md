# Distributed Tracing

## What it is

**Distributed tracing** tracks a **request** as it flows through **multiple services**. Each service contributes a **span** (name, timing, metadata); spans are linked by a **trace id** (and optionally parent span id) so you see one **trace** = one request’s path across the system.

## Why we need it

- **Latency** — When a request is slow, trace shows **which service or span** took the time (e.g. DB call, external API).
- **Debugging** — See the full path of a request; correlate logs and metrics by trace id.
- **Dependencies** — Understand which services call which; find bottlenecks and unnecessary calls.

## How it works

1. **Root span** is created at the entry point (e.g. API Gateway, web server); a **trace id** is generated.
2. When the request calls another service (or DB), a **child span** is created and linked to the parent; **trace id** (and span id) are passed (e.g. via headers).
3. Each service **records spans** (start, end, attributes) and sends them to a **tracing backend** (e.g. Jaeger, Zipkin, Tempo).
4. The backend **assembles** spans by trace id so you can view the full request flow and timings.

## Key concepts

- **Trace** — The full journey of one request (all spans with the same trace id).
- **Span** — One unit of work (e.g. HTTP call, DB query); has name, start/end time, attributes, and optional parent.
- **Context propagation** — Trace id and span id are passed across service boundaries (e.g. HTTP headers, gRPC metadata) so the backend can link spans.

## Trade-offs

- **Advantages:** Visibility into latency and dependency graph; better debugging and performance tuning.
- **Disadvantages:** Instrumentation in every service; sampling needed at high volume; storage and query cost for trace data.

**When to use:** Use in **microservices** and **multi-tier** systems to understand request flow and latency. Combine with metrics and logs (trace id in logs). See [Instrumentation](7-instrumentation.md) and [Monitoring overview](1-monitoring-overview.md).
