# Performance Monitoring

## What it is

**Performance monitoring** tracks how **fast** and **efficient** the system is: latency, throughput, error rate, and resource usage. It helps you spot degradation before it becomes an outage and find bottlenecks.

## What to measure

- **Latency** — Response time (e.g. p50, p95, p99) per endpoint or operation. Often broken down by service or dependency (e.g. DB time vs total).
- **Throughput** — Requests per second (QPS), messages per second, or transactions per second.
- **Error rate** — Percentage of failed requests or non-2xx responses; by endpoint, status code, or error type.
- **Resource utilization** — CPU, memory, disk I/O, network; per host, pod, or service. Helps correlate slowness with saturation.

## How to use it

- **Dashboards** — Real-time and historical views of key metrics; slice by service, region, or client.
- **Alerting** — When latency or error rate exceeds a threshold (e.g. p99 > 500 ms or error rate > 1%), page or notify. Prefer **symptom-based** alerts (user impact) and use **tracing** to find the cause.
- **SLOs** — Define targets (e.g. "99% of requests under 200 ms") and track error budget; use for prioritization and release decisions.

**Use case:** Maintain latency and throughput SLOs; debug slowdowns and outages. Combine with [Instrumentation](7-instrumentation.md) (what to collect) and [Visualization and alerts](8-visualization-and-alerts.md).
