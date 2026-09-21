# Splunk (Enterprise / Cloud)

[← Back to Monitoring & observability](../README.md) · [Named stacks](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [Elastic](../Elastic/README.md) · [Loki](../Loki/README.md) · [AppDynamics](../AppDynamics/README.md) · [PagerDuty](../PagerDuty/README.md)

**Status:** Primer / stub track — classic **Splunk Enterprise** and **Splunk Cloud** (search + SPL). Full chapter deepen comes later when you drive this tool.

## 1. Concepts

**Splunk Enterprise** (self-managed) and **Splunk Cloud** (Splunk-hosted) are the industry-default meaning of “we use Splunk”: ship machine data with **Universal Forwarders** (and Heavy Forwarders / HTTP Event Collector), store it in **indexes**, dig with **SPL** (Search Processing Language) on a **Search Head**, and often layer **apps** (including SIEM / Security).

```text
Sources → UF / HF / HEC → Indexers (Enterprise) or Cloud ingest
                              │
                              ▼
                     Search Head · SPL · dashboards / alerts
                              │
                              ▼
                     Dig · alert → page ([PagerDuty](../PagerDuty/README.md))
```

**Plain language:** Search-first log and event platform with its own query culture (SPL)—not AppDynamics, and not Loki’s label streams.

| | |
|--|--|
| **What for** | Full-text / field extraction digs on logs and events; enterprise search culture; often compliance / SIEM-adjacent estates |
| **When** | Org standard is Splunk; need SPL skills and indexer/forwarder literacy; Cloud SKU fits ops capacity |
| **Why not** | Primary stack is already [Elastic](../Elastic/README.md) or [Loki](../Loki/README.md)+Grafana; thin team that will not own license/ingest volume; never drop cloud audit ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |

**Not this folder (yet):**

| Product | Relation |
|---------|----------|
| [AppDynamics](../AppDynamics/README.md) | Separate APM product (docs on help.splunk.com)—BT/Controller, not classic SPL indexes |
| Splunk Observability Cloud | SaaS metrics/APM/RUM lineage (SignalFx)—peer to Datadog/NR; stub later if needed |
| Splunk ITSI / SOAR | Service analytics / security automation—after core Enterprise/Cloud literacy |

**Disconfirm:** “We have Splunk” ≠ SLOs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)). Splunk ≠ [PagerDuty](../PagerDuty/README.md). Splunk ≠ [AppDynamics](../AppDynamics/README.md). Unlimited indexes ≠ cheap.

**Confirm:** Enterprise vs Cloud? Who owns forwarders, indexes, and license/ingest? Primary log plane vs Elastic/Loki? Where do pages go?

## 2. Advanced

| Topic | Judgment |
|-------|----------|
| **UF vs HF vs HEC** | UF at edges; HF for parse/route; HEC for apps/HTTP |
| **Indexes + retention** | Cost and dig speed live here—name owners |
| **SPL literacy** | `index=…` → filter → stats/timechart; avoid unbounded `*` |
| **Alerts** | Symptom-first searches → action; page via PagerDuty |
| **Vs Elastic** | Both search-centric; pick one primary log glass ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |
| **Vs Loki** | Labels/chunks vs indexed search—different skills |

### Failure modes

| Failure | What you see |
|---------|----------------|
| High-volume unfiltered indexes | License burn; slow searches |
| No sourcetype / field contract | Unusable digs |
| Alert on every noisy keyword | Fatigue |
| Dual primary Splunk + Elastic digs | Split runbooks |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First source | UF → one index → SPL proves events → one alert |
| Brownfield | Inventory indexes / apps; freeze “no second search primary” |
| Hybrid | Splunk for logs/search; metrics elsewhere (Prom/Datadog)—document dig keys ([21](../21_Correlation_And_Dig_Methodology.md)) |
| Pages | Saved search / alert → [PagerDuty](../PagerDuty/README.md) |

**Staff checklist:** Enterprise vs Cloud written; forwarder + index owners; ingest budget; primary vs Elastic/Loki decided; pages owned.

## Planned chapters (stub)

| # | Working title | Focus |
|---|---------------|--------|
| 01 | What is Splunk and when | Fit; vs Elastic / Loki / AppD / Observability Cloud |
| 02 | Architecture — forwarders, indexers, search | Enterprise data plane |
| 03 | Splunk Cloud vs Enterprise | Deploy shapes |
| 04 | Ingest — UF, HF, HEC | Getting data in |
| 05 | Indexes, sourcetypes, retention | Cost and dig hygiene |
| 06 | SPL dig literacy | Search → stats → timechart |
| 07 | Dashboards, alerts, paging | Detect → page |
| 08 | Worked example — first source | UF → index → alert |
| 09 | What to enable next / when not | Apps, SIEM literacy, Observability Cloud boundary |

## References

- [Splunk Docs](https://docs.splunk.com/) · [Splunk Cloud Platform](https://docs.splunk.com/Documentation/SplunkCloud) · [Splunk Enterprise](https://docs.splunk.com/Documentation/Splunk)  
- [Elastic](../Elastic/README.md) · [Loki](../Loki/README.md) · [AppDynamics](../AppDynamics/README.md) · [PagerDuty](../PagerDuty/README.md)
