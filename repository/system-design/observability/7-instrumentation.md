# Instrumentation

## What it is

**Instrumentation** is the code and configuration that **produce** the data monitoring needs: metrics, logs, and traces. Without it, you can’t make good decisions about health, performance, or security.

## What to emit

- **Metrics** — Counters (e.g. requests, errors), gauges (e.g. queue depth, active connections), histograms (e.g. latency). Export to a metrics backend (Prometheus, StatsD, vendor).
- **Logs** — Structured events (request id, user, duration, status). Send to a log aggregation pipeline; avoid logging sensitive data.
- **Traces** — Spans for each unit of work (e.g. HTTP request, DB call), with parent-child relationship and timing. Use a shared trace id across services so you can follow a request end-to-end (e.g. OpenTelemetry, Jaeger).

## Good practices

- **Structured data** — Logs and spans with consistent fields (timestamp, level, message, context) so you can query and correlate.
- **Sampling** — For high-volume systems, sample traces or logs to control cost while keeping visibility on errors and slow requests.
- **Low overhead** — Instrumentation should add minimal latency and resource use; use async export and batching where possible.
- **Standards** — OpenTelemetry, OpenCensus, or vendor SDKs help with portability and automatic instrumentation (e.g. HTTP, DB drivers).

**Use case:** Add instrumentation early; include trace ids in logs so you can jump from metric to trace to log. See [Visualization and alerts](8-visualization-and-alerts.md) for consuming this data.
