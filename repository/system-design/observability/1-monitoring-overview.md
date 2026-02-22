# Monitoring Overview

## Why monitor

Distributed systems have many components and failure modes. **Monitoring** lets you track how the system behaves, how users use it, and whether it’s healthy. You use it to detect and diagnose issues, meet SLOs, and plan capacity.

## What to monitor

- **Health** — Are components up and able to serve traffic? (See [Health monitoring](2-health-monitoring.md).)
- **Availability** — Uptime and success rate over time; are we within SLO? (See [Availability monitoring](3-availability-monitoring.md).)
- **Performance** — Latency, throughput, error rate; where are the bottlenecks? (See [Performance monitoring](4-performance-monitoring.md).)
- **Security** — Failed logins, access to sensitive resources, anomalies. (See [Security monitoring](5-security-monitoring.md).)
- **Usage** — Which features are used, by whom, and at what volume; quotas and capacity. (See [Usage monitoring](6-usage-monitoring.md).)

## Pillars

Often described as three pillars (with overlap):

- **Logs** — Discrete events and messages (request logs, errors, audit). Good for debugging and audit.
- **Metrics** — Numeric aggregates over time (counters, gauges, histograms). Good for dashboards and alerts.
- **Traces** — Request flow across services (spans with timing). Good for understanding latency and dependencies.

**Use case:** Instrument from day one; define SLOs and error budgets; alert on symptoms and use metrics and traces to find cause. See [Instrumentation](7-instrumentation.md) and [Visualization and alerts](8-visualization-and-alerts.md).
