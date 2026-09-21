# 27 — Tool kinds by job

[← Previous](./26_OSS_Managed_SaaS_And_Hybrid.md) · [README](./README.md) · [Next →](./28_Shape_Scorecard_Drills_And_Maturity.md)

## 1. Concepts — kinds before logos

Before opening tool folders, name the **kind** of tool you need. Logos implement kinds.

| Kind | Job | Examples (literacy, not endorsement) |
|------|-----|--------------------------------------|
| Metrics TSDB / Prom-compatible | Store/query metrics | Prometheus, Mimir, AMP, Cortex |
| Visualization / explore | Dashboards, Explore | Grafana, Kibana, cloud consoles |
| Log store / search | Logs | Loki, Elasticsearch, Cloud Logging |
| Trace store | Traces | Tempo, Jaeger, X-Ray |
| Collector / agent | Pipeline | OTel Collector, Beats, vendor agents |
| Alertmanager / routing | Group/inhibit/route | Alertmanager, cloud alert routers |
| Incident / paging | Wake humans | PagerDuty, Opsgenie, … |
| Synthetic | Outside-in checks | Provider synthetics, scripted probes |
| APM suite | Bundled app obs | Datadog, New Relic, AppDynamics, Elastic APM |

**Map to folders in this repo:** [Prometheus](./Prometheus/README.md), [Grafana](./Grafana/README.md), [Loki](./Loki/README.md), [Tempo](./Tempo/README.md), [Jaeger](./Jaeger/README.md), [OpenTelemetry](./OpenTelemetry/README.md), [Elastic](./Elastic/README.md) (**01–23**), [Datadog](./Datadog/README.md) (**01–26**), [New Relic](./New_Relic/README.md), [AppDynamics](./AppDynamics/README.md) (**01–16**), [PagerDuty](./PagerDuty/README.md).

**Disconfirm:** Picking Grafana before knowing metrics backend ≠ a plan. Paging tool as metrics DB ≠ kind literacy.

**Confirm:** For each kind above, do you have a chosen product or an explicit “none yet”?

## 2. Advanced — substitution and overlap

**Overlap:** APM includes kinds you may already own—draw boundaries ([24](./24_APM_As_A_Product_Shape.md)).

**Substitution:** Managed Prometheus substitutes self-hosted TSDB ops, not SLO design.

**Failure mode:** Five overlapping visualize tools → no canonical overview ([9](./9_Dashboards_Alerts_And_Pages.md)).

## 3. Applications

**Staff checklist**

- Kind→product table for the org  
- Canonical UI for dig path named  
- Tool folder study gated on README checklist  

**Exercise:** Fill the kind table for your team in one page.

## References

- [README tool folders](./README.md)  
- [25 Stack shapes](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [28 Scorecard](./28_Shape_Scorecard_Drills_And_Maturity.md)
