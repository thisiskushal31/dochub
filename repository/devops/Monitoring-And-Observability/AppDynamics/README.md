# AppDynamics (AppD)

[← Back to Monitoring & observability](../README.md) · [APM shape](../24_APM_As_A_Product_Shape.md) · [OSS/SaaS](../26_OSS_Managed_SaaS_And_Hybrid.md) · [Datadog](../Datadog/README.md) · [New Relic](../New_Relic/README.md)

## 1. Concepts

**AppDynamics** (often **AppD**, now under Cisco) is a commercial **APM / application observability** platform: business-transaction-centric app performance, infrastructure correlation, end-user experience, and alerting—typically via language agents into a Controller (SaaS or on-prem).

**Plain language:** Classic enterprise APM cockpit—strong on “business transactions” and app topology; treat it as one primary dig plane, not a second Datadog/New Relic beside it.

**What for:** Application performance and business-transaction visibility in estates standardized on AppD/Cisco.  
**When:** Org already owns AppDynamics; need APM without standing up Tempo/Jaeger; hybrid Controller (SaaS or self-hosted) fits policy.  
**Why not:** Already all-in on [Datadog](../Datadog/README.md), [New Relic](../New_Relic/README.md), or OSS LGTM; thin team that won’t own agent/Controller hygiene; never drop cloud audit ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

**Disconfirm:** Two SaaS APMs on one service is **not** “redundancy.” AppDynamics is **not** [PagerDuty](../PagerDuty/README.md). “We have AppD” ≠ having SLOs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

**Confirm:** SaaS vs on-prem Controller? Who owns agents and license tiers? Primary vs secondary vs [OpenTelemetry](../OpenTelemetry/README.md) exit path?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **Business transactions** | AppD’s unit of dig—map them to user journeys / SLIs deliberately |
| **Agent vs OTel** | Prefer one instrument path; OTel helps exit/migrate ([10 mindset](../OpenTelemetry/README.md)) |
| **Controller ops** | On-prem Controllers need capacity, upgrade, and backup like any critical DB |
| **Vs Datadog / New Relic** | Same SaaS-APM job family—pick **one** primary ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |
| **Cardinality / custom metrics** | Unbounded BT/metrics names = cost and UI noise |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Over-instrumented BTs | Noise, license pressure, slow digs |
| Dual AppD + Datadog agents | Double cost, split RCA |
| Pages without ownership | Fatigue; AppD ≠ incident router |
| Controller neglect (on-prem) | Blind APM when the box is sick |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First service | Language agent → Controller; define golden BTs / SLIs |
| Migrate / coexist briefly | OTel dual-export in staging; cut to one primary |
| Pages | AppD alert → [PagerDuty](../PagerDuty/README.md) / chat with runbook |
| Enterprise brownfield | Keep AppD if skills exist; don’t add a second SaaS APM |

**Staff checklist:** one primary APM; agent install owners; BT naming contract; alert → page path tested; cloud audit stays in cloud; OTel preference written if exit matters.

### Track status

Primer only. Full chapter track (install → dig → page → Controller/admin) when you drive sources → scrape → deepen, same pattern as Datadog/Elastic.

## References

- [AppDynamics documentation](https://docs.appdynamics.com/) · [Cisco AppDynamics](https://www.appdynamics.com/)  
- [OpenTelemetry](../OpenTelemetry/README.md) · [Datadog](../Datadog/README.md) · [New Relic](../New_Relic/README.md) · [PagerDuty](../PagerDuty/README.md) · [APM as a product shape](../24_APM_As_A_Product_Shape.md)
