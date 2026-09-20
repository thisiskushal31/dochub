# 1 — Paired practice — monitoring and observability

[← Previous](./0_How_To_Read.md) · [README](./README.md) · [Next →](./2_Mindset_And_Anti_Patterns.md)

## 1. Concepts — one practice, two jobs

**Monitoring** answers: *Is something we already care about outside bounds?* It watches known signals and fires when thresholds or symptoms match.

**Observability** answers: *Why is this happening, including questions we did not pre-write dashboards for?* It depends on rich telemetry (metrics, logs, traces, and sometimes profiles/events) that you can slice after the fact.

They are **paired**. Detection without explanation leaves you paging into mystery. Explanation without detection leaves you explaining after users already left.

```text
Define good (SLI/SLO)
  → Instrument
  → MONITOR (detect) → Page
  → OBSERVE (metric → trace → log) → Fix / improve signals
  → …
```

| Job | Typical artifacts | Failure if missing |
|-----|-------------------|--------------------|
| Detect | SLOs, alerts, black-box checks, host USE | Silent outages; “we found out on Twitter” |
| Explain | Structured logs, traces, correlation IDs | Long MTTD→MTTR; guesswork war rooms |
| Govern | Label contracts, retention, cost budgets | Cardinality melt; invoice shock |

### Mental map

```text
User pain ──► SLI/SLO ──► alert/page ──► dig path
                │                        │
                ▼                        ▼
           dashboards              traces + logs
```

**Disconfirm:** Buying APM ≠ finishing monitoring. High-volume logs ≠ observability if you cannot join them to a request. “We have Grafana” ≠ we have a practice.

**Confirm:** For your critical user path, what detects failure? What explains a novel failure mode next Tuesday?

## 2. Advanced — boundaries and brownfield

**Monitoring is not only infrastructure.** Application RED, dependency health, batch last-success, and capacity headroom are all detect-layer work ([3](./3_Monitoring_Program_Anatomy.md)–[15](./15_Capacity_And_Saturation.md)).

**Observability is not only traces.** Logs without fields, metrics without exemplars, and traces without propagation are incomplete explain paths ([16](./16_Structured_Logging.md)–[21](./21_Correlation_And_Dig_Methodology.md)).

**Brownfield reality:** Many estates have metrics-first Prometheus, log-first Elastic, and “we’ll add traces later.” The paired practice still holds—name the gap; do not pretend one pillar is the whole story.

**Security / audit is adjacent, not identical.** Audit trails answer *who changed IAM*; APM answers *why checkout is slow*. Door: [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md) via [31](./31_Cloud_Managed_Sinks_And_Audit_Door.md).

**Failure mode:** Pretty green dashboards while synthetics fail from the customer region → you measured the wrong boundary ([5](./5_Black_Box_White_Box_And_Synthetics.md)).

## 3. Applications

**Staff checklist**

- Written one-sentence definitions for monitoring and observability on the team wiki  
- Named the critical path and its detect + explain owners  
- Listed gaps (e.g. “no traces on async workers”) as backlog, not vibes  

**Drill:** Pick last week’s incident. Was the first alert a *symptom* users felt, or a *cause* you guessed? How long to join metric → request → log line?

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [2 Mindset](./2_Mindset_And_Anti_Patterns.md) · [21 Dig methodology](./21_Correlation_And_Dig_Methodology.md)
