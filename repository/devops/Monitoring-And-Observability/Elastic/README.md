# Elastic (ELK / Elastic Stack)

[← Back to Monitoring & observability](../README.md) · [Structured logging](../16_Structured_Logging.md) · [Loki](../Loki/README.md) · [Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)

## 1. Concepts

**Elastic Stack** (historically **ELK**: Elasticsearch, Logstash, Kibana; Beats/Elastic Agent for ship) is a **search-centric** observability platform: full-text logs, dashboards in Kibana, plus Elastic APM/metrics offerings depending on license.

**Plain language:** The searchable filing cabinet—powerful queries over log bodies, heavier ops/cost model than label-cheap Loki.

| Piece | Job |
|-------|-----|
| **Elasticsearch** | Index and search |
| **Kibana** | UI / dashboards / alerting |
| **Logstash / Beats / Elastic Agent** | Ingest and ship |
| **Elastic APM** | Traces/APM in the Elastic world |
| **ILM** | Index lifecycle / retention |

**What for:** Rich log search, security/SIEM-adjacent log analytics, teams already on Elastic.  
**When:** You need full-text and complex log analytics; existing Elastic skills or SKUs.  
**Why not:** You only need K8s log streams with Prom-like labels → [Loki](../Loki/README.md); metrics-first SLO → [Prometheus](../Prometheus/README.md); want turnkey SaaS without Elastic ops → Datadog/New Relic.

**Disconfirm:** Elastic is **not** interchangeable with Loki’s cost model. “We have ELK” is **not** structured logging by itself.

**Confirm:** What is indexed vs filtered? Who owns ILM/retention?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **Mapping / cardinality** | Exploding fields = cluster pain |
| **Hot-warm-cold** | Cost vs query speed |
| **OTel → Elastic** | Prefer OTel instrumentation even in Elastic estates |
| **Vs Loki** | Search power vs cheap label streams ([3](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Unbounded fields | Red cluster, reject maps |
| No ILM | Disk full |
| Dual ELK + Loki forever | Split investigations |

## 3. Applications

| Goal | Pattern |
|------|---------|
| Central logs | Agent → ingest → data stream → Kibana |
| APM | Elastic APM or OTel → Elastic |
| Security logs | Often Elastic; don’t confuse with app SLO metrics |

**Staff checklist:** ILM policy; PII; capacity alerts on the cluster itself; one primary log plane per env.

## References

- [Elastic Observability docs](https://www.elastic.co/guide/en/observability/current/index.html)  
- [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)  
- [Loki](../Loki/README.md) (alternative log shape)  
