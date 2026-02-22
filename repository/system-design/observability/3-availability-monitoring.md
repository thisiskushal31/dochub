# Availability Monitoring

## What it is

**Availability monitoring** tracks whether the system (and its parts) are **up and reachable** over time. It produces **uptime** statistics and supports SLOs like "99.9% available." It’s related to health monitoring but focused on **historical** availability and reporting, not just current state.

## What to measure

- **Uptime** — Fraction of time the service (or critical path) was available. Often expressed as "nines" (e.g. 99.99%).
- **Downtime** — Incidents and duration; planned vs unplanned.
- **Success rate** — Percentage of requests that succeed (e.g. HTTP 2xx or non-5xx). Can be sliced by endpoint, region, or client.

## How to do it

- **Probes** — Synthetic requests from multiple locations at a defined interval; record success/failure and latency.
- **Real traffic** — From your own metrics (e.g. success count / total count over a window). Complements probes with actual user experience.
- **Aggregation** — Per-component and end-to-end; report by service, region, or dependency so you know what failed.

**Use case:** Report on SLOs, error budgets, and incident impact. Combine with [Health monitoring](2-health-monitoring.md) (current state) and [Performance monitoring](4-performance-monitoring.md) (how well it ran when up).
