# Visualization and Alerts

## Visualization

**Dashboards** present metrics and logs so operators can quickly see **trends** and **anomalies**. Good dashboards are focused (e.g. per service, per SLO), use the right chart types (time series for latency, counters for throughput), and are available where incidents are handled.

- **Real-time** — Current state and last few minutes/hours for live debugging.
- **Historical** — Trends over days or weeks for capacity and post-incident review.
- **SLO and error budget** — Track burn rate and remaining budget so you know when to slow releases or add capacity.

## Alerts

**Alerts** notify the team when something **requires attention** (e.g. SLO breach, error spike, or security event). Alerts should be actionable and not noisy.

- **Symptom-based** — Alert on user-visible impact (e.g. "error rate > 1%" or "p99 latency > 500 ms") rather than every internal failure. Reduces noise and focuses on what matters.
- **Clear ownership** — Each alert should have a runbook or owner so the responder knows what to do.
- **Tuning** — Use thresholds, windows, and hysteresis to avoid flapping; review and disable alerts that don’t lead to action.
- **Channels** — Route critical alerts to paging; use chat or email for lower severity. Avoid alert fatigue.

**Use case:** Runbooks and dashboards should be next to alerts so that when something fires, the team can quickly understand and act. Combine with [Instrumentation](7-instrumentation.md) so the data behind the dashboard is complete and accurate.
