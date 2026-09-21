# 16 — What to enable next and when not

[← Previous](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md) · [README](./README.md)

## 1. Concepts — finish the loop, then one enable

Finish the **core reliability loop** first ([12](./12_Worked_Example_First_Grafana_Dig.md)): Alloy → backends → Explore → one dashboard → one alert → dig. Then enable **one** adjacent capability at a time with an owner, a cost/ingest baseline, and **kill criteria**.

### Core track (01–15)

| Need | Chapter |
|------|---------|
| What / when / LGTM | [01](./01_What_Is_Grafana_And_When.md)–[03](./03_LGTM_Stack_And_Collector_Generations.md) |
| Alloy / Agent / topologies / dig / alert-access | [04](./04_Grafana_Alloy_Concepts.md)–[08](./08_Alerting_Boundaries_And_Access_Model.md) |
| Deploy → wire → board/alert → lab | [09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md)–[12](./12_Worked_Example_First_Grafana_Dig.md) |
| Scale/migrate · as-code · IRM/SSO/RBAC | [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)–[15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md) |

### Named extras (enable later)

| Capability | Enable when |
|------------|-------------|
| **Cloud backends / SLO UI** | Self-managed ops dominate; Cloud is chosen plane |
| **IRM (if not done in 15)** | Pages actionable; need human routing ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)) |
| **Grafana Assistant** | Core dig works; PII policy; scoped RBAC |
| **Enterprise features** | OSS limits block a named compliance/ops need |
| **Beyla** (`beyla.ebpf`) | Zero-code RED; SDK still preferred for deep traces |
| **Pyroscope / profiles** | Latency digs stall on “hot method unknown” |
| **LBAC** | Multi-team Explore on one shared DS |
| **Cloud Migration Assistant** | Only after Cloud is the chosen ops plane |

**Disconfirm:** IRM + Assistant + Beyla + Enterprise in one week. This map instead of finishing [12](./12_Worked_Example_First_Grafana_Dig.md). Dual Datadog + Grafana panes without an ADR.

**Confirm:** Core loop green? Named owner + kill criteria before the next enable?

## 2. Advanced — order, kill criteria, when not

**Suggested order after the lab:** (1) label + retention hygiene, (2) Tempo↔Loki↔Prom correlation, (3) provisioning as code ([14](./14_Provisioning_As_Code_And_GitOps.md)), (4) IRM or [PagerDuty](../PagerDuty/README.md)—not both as primary ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)), (5) RBAC/LBAC when the org grows, (6) Assistant with RBAC, (7) Beyla for uncovered services, (8) Enterprise with a license owner, (9) profiles when digs need CPU truth.

**Kill criteria (write before enable).** Pain hypothesis, owner, baseline cost/ingest, dated kill line (“disable in two weeks if digs do not improve / if dual UI begins / if no on-call uses it”). Example: “Enable Beyla on staging `checkout` for RED; kill by DATE if no Sev dig used Beyla panels or series cost exceeds budget.”

**When NOT to grow Grafana sprawl**

| Situation | Prefer |
|-----------|--------|
| Core loop red | Fix [12](./12_Worked_Example_First_Grafana_Dig.md)—no extras |
| Second full APM/UI “for coverage” | Banned without ADR—pick primary ([Datadog](../Datadog/README.md), [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |
| Cheap high-volume logs only | [Loki](../Loki/README.md) depth—not every Cloud app plugin |
| PromQL/Alertmanager already excellent | Keep pages in [Prometheus](../Prometheus/README.md); Grafana stays glass |
| Thin team, no Alloy owner | Do not add Beyla + Assistant + IRM the same week |
| Dual Datadog + Grafana paging same SLI | One page path; ADR if dual UI must exist |

**Dual UI ban.** Running Datadog and Grafana as equal dig panes for the same services without an ADR splits on-call and doubles cardinality. ADR must name **primary** glass, page path, and sunset or split-by-signal rule.

**Beyla placement.** Prefer Alloy `beyla.ebpf` for zero-code RED; keep OTel SDKs for deep spans. Do not run Beyla tracing and SDK tracing in parallel on the same service without verification.

**Backend depth stays in sibling tracks.** More Grafana plugins do not replace [Mimir](../Mimir/README.md) / [Loki](../Loki/README.md) / [Tempo](../Tempo/README.md) ops when ingest or query latency is the pain ([21](../21_Correlation_And_Dig_Methodology.md), [8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

## 3. Applications — use-case picks and queue

| If this is your pain… | Enable next | Notes |
|-----------------------|-------------|--------|
| Nobody wakes for real pages | IRM or [PagerDuty](../PagerDuty/README.md) | After alert hygiene ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md), [10](../10_Alert_Hygiene_And_Burn_Rates.md)) |
| Click-ops drift | Provisioning / Terraform | [14](./14_Provisioning_As_Code_And_GitOps.md) |
| Multi-team Explore leaks | RBAC + DS permissions / LBAC | [15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md) |
| Slow PromQL authorship | Assistant (scoped RBAC) | Not a substitute for SLIs ([8](../8_SLI_SLO_SLA_And_Error_Budgets.md)) |
| No SDK capacity, need RED | Beyla via Alloy | Avoid unverified dual traces |
| Hot method unknown | Pyroscope | After metrics/traces exist |
| OSS permission ceiling | Enterprise features | License owner + rollout |
| Agent still in prod | Finish migrate | [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md) |
| “Is LGTM still the shape?” | Re-read stack choice | [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md) |

**Queue discipline.** Backlog ≤3 enables with owners and kill dates. If longer, you are shopping—pause.

| Extra | Kill / do not if |
|-------|------------------|
| IRM | No schedules; flappy alerts; duplicate PD primary |
| Assistant | No PII rules; digs still broken |
| Beyla | Caps unmet; dual SDK traces unverified |
| Enterprise | Feature unused after 30 days |
| Profiles | Nobody reads profile panels in Sevs |
| LBAC | Rules untested as team user |

**Staff checklist**

- Core loop Done-when from [12](./12_Worked_Example_First_Grafana_Dig.md) green  
- One enable per week max; ingest/cost before/after  
- Kill criteria written and dated  
- Dual Datadog/Grafana UI banned without ADR  
- IRM/PD: single primary pager  
- Assistant/Beyla/Enterprise: named owner before flip  
- Every enable links back to the Explore dig path  

## References

- [Grafana docs](https://grafana.com/docs/grafana/latest/) · [Alerting and IRM](https://grafana.com/docs/grafana-cloud/alerting-and-irm/) · [Grafana Assistant](https://grafana.com/docs/grafana-cloud/machine-learning/assistant/) · [Beyla](https://grafana.com/docs/beyla/latest/)  
- [12 Worked example](./12_Worked_Example_First_Grafana_Dig.md) · [PagerDuty](../PagerDuty/README.md) · [Datadog](../Datadog/README.md) · [25 Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
