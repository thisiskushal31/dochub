# 08 — Alerting rules and Alertmanager

[← Previous](./07_Recording_Rules_And_SLIs.md) · [README](./README.md) · [Next: Storage / HA →](./09_Storage_Remote_Write_Federation_And_HA.md)

## 1. Concepts

Prometheus splits alerting on purpose:

| Layer | Owns | Does not own |
|-------|------|--------------|
| **Alerting rules** (in Prometheus) | *What* is wrong — PromQL, `for:`, labels, annotations | Email storms, silences UI, chat routing |
| **Alertmanager** | *How humans hear* — group, dedupe, inhibit, silence, route | Deciding the PromQL truth |

```text
expr true ──► pending (during for:) ──► firing
                                         │
                                         ▼
                                   Alertmanager
                                      ├─ group
                                      ├─ inhibit / silence
                                      └─ route → PagerDuty / Slack / email
```

**Staff confuse this constantly:** “Prometheus alerted me” usually means **Alertmanager notified you** after a Prometheus rule fired. Debugging the wrong half wastes hours.

### Anatomy of an alerting rule

```yaml
groups:
  - name: api.alerts
    rules:
      - alert: APIHighErrorRatio
        expr: path:request_failures_per_requests:ratio_rate5m{job="api"} > 0.05
        for: 10m
        labels:
          severity: page
          service: api
        annotations:
          summary: "High error ratio on {{ $labels.job }}"
          description: "ratio={{ $value | humanizePercentage }}"
          runbook_url: "https://wiki.example/runbooks/api-errors"
```

| Field | Role |
|-------|------|
| `expr` | Prefer **recorded** symptom/SLI series ([07](./07_Recording_Rules_And_SLIs.md)) |
| `for` | Must stay active this long before **firing** (pending first)—beats scrape flaps |
| `keep_firing_for` | Optional: survive brief clears (version-dependent) |
| `labels` | Routing food (`severity`, `team`, `service`) |
| `annotations` | Human text + **runbook_url** — not identity |

Prefer **symptoms users feel** (error ratio, burn, latency SLO breach) over raw CPU ([parent 9](../9_Dashboards_Alerts_And_Pages.md)–[10](../10_Alert_Hygiene_And_Burn_Rates.md)).

### What Alertmanager adds

| Behavior | Why you need it |
|----------|-----------------|
| **Grouping** | One disk-outage shouldn’t send 500 pages—one notification with many instances |
| **Inhibition** | If `InstanceDown`, mute “disk almost full” on that instance |
| **Silences** | Maintenance windows without deleting rules |
| **Routing tree** | `severity=page` → PagerDuty; `severity=ticket` → Slack |
| **repeat_interval / group_*** | Control nag vs spam |

Prometheus detects “broken now”; Alertmanager is the notification product (rate limits, dedupe, integrations).

**Disconfirm:** Grafana-only alerts with no ownership model ≠ replacing this design. Ungrouped email per timeseries ≠ operable. `severity=page` on everything ≠ urgency.

**Confirm:** Where is grouping configured? Pending vs firing? Does every page alert carry a runbook link?

## 2. Advanced concepts — HA (official)

Alertmanager HA uses **gossip** (Memberlist):

- Each peer receives alerts from Prometheus  
- **Silences** and the **notification log** replicate  
- Dedup aims for at-least-once notification under partitions (duplicates preferred over silence)

**Critical official rule:** do **not** put a load balancer between Prometheus and Alertmanagers that fans each alert to *one* random peer. Configure Prometheus with a **list of all Alertmanager addresses**. Wrong LB topology breaks clustering assumptions.

Pair with ≥2 Prometheus replicas evaluating the same rules → both send → AM cluster dedupes.

**Inhibition:** test so independent faults aren’t hidden.  
**Per-alertname limits** (newer AM): flood protection when one alertname explodes.

**Failure mode:** “HA VIP” in front of AM + two Prometheuses → missed or duplicated pages under failover; on-call loses trust.

## 3. Applications and use cases

| Scenario | Move |
|----------|------|
| First real page | Symptom ratio + `for: 10m` + AM → staging Slack |
| Cascade outage | Group by `alertname`/`service`; inhibit children |
| Maintenance | Silence matchers—not deleting rules |
| Prod pages | Receiver → [PagerDuty](../PagerDuty/README.md); test quarterly |

**Staff checklist**

- `alerting.alertmanagers` lists **all** peers (no sneaky single LB)  
- Page alerts: symptom-first, `for:`, `runbook_url`  
- Routing + inhibit reviewed; silence ACL owned  
- Staging notification path proven before prod  

**Good:** few page-worthy rules on recorded SLIs; quiet nights.  
**Bad:** 200 cause-based alerts; AM as an afterthought.

## References

- [Alerting overview](https://prometheus.io/docs/alerting/latest/overview/)  
- [Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)  
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)  
- [Alertmanager HA](https://prometheus.io/docs/alerting/latest/high_availability/)  
- [09 Storage / scrape HA](./09_Storage_Remote_Write_Federation_And_HA.md)
