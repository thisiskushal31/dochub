# Monitoring and observability

**One track for both.** Monitoring *detects* known bad states; observability *explains* new questions from telemetry. They usually ship together.

**Concept staircase `0–37` first** (jobs, mindset, stacks, runtime/estate shapes, shape checks). **Tool folders later** (Prometheus, Grafana, …)—open them only after the gate below.

| Door | Home |
|------|------|
| Cloud managed sinks + audit | [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md) |
| On-call practice | [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md) |
| Packets / NetOps | [Networks Observability](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Synthetic / e2e in CI | CiCd verify |

Start: [0 — How to read](./0_How_To_Read.md).

### The loop

```text
Define good (SLI/SLO) → Instrument → MONITOR (detect) → Page
  → OBSERVE (metric → trace → log) → Fix / improve signals → …
```

### Staircase

```text
Floor −1   0        How to read
Floor 0    1–2      Paired practice + mindset
Floor 1    3–15     Monitoring / detect craft (program → capacity)
Floor 2    16–23    Observability / explain craft (logs → profiling)
Floor 3    24–30    Assemble & govern (APM shape → FinOps)
Floor 4    31–32    Doors (cloud audit; on-call)
Floor 5    33–34    K8s patterns + end-to-end topologies
Floor 6    35–37    Runtime/language; classical↔distributed; RUM/coverage/eBPF
Floor 7    tools/   Product literacy (after gate)
```

**Suggested first stretch:** 0 → 1 → 3 → 4 → 8 → 9 → 16 → 18 → 21 → 25 → 28 → 34 → 35 → 36 → 37, then fill remaining numbers, then tools.

## Before any tool folder

| # | Ready? |
|---|--------|
| 1 | Monitoring vs observability in one sentence each ([1](./1_Paired_Practice_Monitoring_And_Observability.md)) |
| 2 | Draft SLI/SLO ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)) |
| 3 | Page vs dashboard ([9](./9_Dashboards_Alerts_And_Pages.md)) |
| 4 | Dig path metric→trace→log ([21](./21_Correlation_And_Dig_Methodology.md)) |
| 5 | Named stack + commercial model ([25](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md), [26](./26_OSS_Managed_SaaS_And_Hybrid.md)) |
| 6 | Scorecard attempt ([28](./28_Shape_Scorecard_Drills_And_Maturity.md)) |
| 7 | Runtime signals named for your languages ([35](./35_Runtime_And_Language_Specific_Signals.md)) |
| 8 | Estate shape + coverage honesty ([36](./36_Classical_Monolith_And_Distributed_Estates.md), [37](./37_Client_RUM_Coverage_And_EBPF_Amplifiers.md)) |

## Concept chapters (0–37)

| # | File | Focus |
|---|------|--------|
| 0 | [How to read](./0_How_To_Read.md) | Mindset; staircase; doors; readiness |
| 1 | [Paired practice](./1_Paired_Practice_Monitoring_And_Observability.md) | Detect + explain together |
| 2 | [Mindset and anti-patterns](./2_Mindset_And_Anti_Patterns.md) | Habits that survive tools |
| 3 | [Monitoring program anatomy](./3_Monitoring_Program_Anatomy.md) | Complete detect layer |
| 4 | [Golden signals, RED, USE](./4_Golden_Signals_RED_And_USE.md) | Core service/resource signals |
| 5 | [Black-box, white-box, synthetics](./5_Black_Box_White_Box_And_Synthetics.md) | Outside-in vs inside-out |
| 6 | [Metric types and aggregation](./6_Metric_Types_And_Aggregation.md) | Counter/gauge/histogram; rates |
| 7 | [Cardinality and label contracts](./7_Cardinality_And_Label_Contracts.md) | Taxonomy; explosion risk |
| 8 | [SLI, SLO, SLA, error budgets](./8_SLI_SLO_SLA_And_Error_Budgets.md) | Define “good”; burn |
| 9 | [Dashboards, alerts, pages](./9_Dashboards_Alerts_And_Pages.md) | Explore vs wake humans |
| 10 | [Alert hygiene and burn rates](./10_Alert_Hygiene_And_Burn_Rates.md) | Symptom-first; noise |
| 11 | [Infrastructure and host monitoring](./11_Infrastructure_And_Host_Monitoring.md) | USE on nodes/VMs |
| 12 | [Application and service monitoring](./12_Application_And_Service_Monitoring.md) | Owned user paths |
| 13 | [Dependency and peer monitoring](./13_Dependency_And_Peer_Monitoring.md) | DB/queue/payment peers |
| 14 | [Batch, cron, and async monitoring](./14_Batch_Cron_And_Async_Monitoring.md) | Last-success; lag |
| 15 | [Capacity and saturation](./15_Capacity_And_Saturation.md) | Headroom; planning |
| 16 | [Structured logging](./16_Structured_Logging.md) | Fields; levels; PII |
| 17 | [Log planes, retention, volume](./17_Log_Planes_Retention_And_Volume.md) | Centralize; cost |
| 18 | [Distributed tracing](./18_Distributed_Tracing.md) | Spans; traces |
| 19 | [Context propagation and async](./19_Context_Propagation_And_Async.md) | HTTP + queues |
| 20 | [Sampling strategies](./20_Sampling_Strategies.md) | Head/tail; fidelity |
| 21 | [Correlation and dig methodology](./21_Correlation_And_Dig_Methodology.md) | metric→trace→log |
| 22 | [Instrumentation, collectors, backends](./22_Instrumentation_Collectors_And_Backends.md) | Create vs store |
| 23 | [Continuous profiling and events](./23_Continuous_Profiling_And_Events.md) | Profiles; change events |
| 24 | [APM as a product shape](./24_APM_As_A_Product_Shape.md) | Bundle ≠ fourth pillar |
| 25 | [Named stack shapes](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md) | ELK / PLG / LGTM / SaaS / cloud |
| 26 | [OSS, managed, SaaS, hybrid](./26_OSS_Managed_SaaS_And_Hybrid.md) | Commercial models |
| 27 | [Tool kinds by job](./27_Tool_Kinds_By_Job.md) | Kinds before logos |
| 28 | [Shape scorecard, drills, maturity](./28_Shape_Scorecard_Drills_And_Maturity.md) | Is the practice healthy? |
| 29 | [Multi-env and multi-tenant](./29_Multi_Env_And_Multi_Tenant_Patterns.md) | Isolation patterns |
| 30 | [Telemetry cost and FinOps](./30_Telemetry_Cost_And_FinOps.md) | Budgets |
| 31 | [Cloud managed sinks and audit door](./31_Cloud_Managed_Sinks_And_Audit_Door.md) | → Cloud/30 |
| 32 | [On-call and human loop door](./32_On_Call_And_Human_Loop_Door.md) | → Methodologies/3 |
| 33 | [Kubernetes workload patterns](./33_Kubernetes_Workload_Observability_Patterns.md) | Workload/node/control plane jobs |
| 34 | [Reference topologies end-to-end](./34_Reference_Topologies_End_To_End.md) | Put it together |
| 35 | [Runtime and language-specific signals](./35_Runtime_And_Language_Specific_Signals.md) | Node event loop, JVM GC, Go, Python, .NET |
| 36 | [Classical, monolith, and distributed estates](./36_Classical_Monolith_And_Distributed_Estates.md) | Same jobs; different wiring |
| 37 | [Client RUM, coverage, eBPF amplifiers](./37_Client_RUM_Coverage_And_EBPF_Amplifiers.md) | Browser reality; inventory; kernel aids |

Each chapter: **Concepts → Disconfirm/Confirm → Advanced → Applications → References** (syllabus / handbook quality bar). Official docs only for API depth.

## Tool folders

Concept gate first ([README checklist](#before-any-tool-folder)). Tool folders teach **products** (what / when / why not / how).

| Tool | Status | Job |
|------|--------|-----|
| [Prometheus](./Prometheus/README.md) | **Deep track 01–13** | Metrics / PromQL / Alertmanager / Operator / **exporter ecosystem** |
| [Grafana](./Grafana/README.md) | **Deep track 01–08** | UI + **Alloy** + LGTM modern setup |
| [OpenTelemetry](./OpenTelemetry/README.md) | Primer → deepen next | Instrumentation |
| [Loki](./Loki/README.md) / [Tempo](./Tempo/README.md) / [Jaeger](./Jaeger/README.md) | Primers | Logs / traces |
| [Elastic](./Elastic/README.md) | Primer | Search-centric logs |
| [Datadog](./Datadog/README.md) / [New Relic](./New_Relic/README.md) | Primers | SaaS APM |
| [PagerDuty](./PagerDuty/README.md) | Primer + first-use | Page routing |

## Further reading

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [Google SRE — Service level objectives](https://sre.google/sre-book/service-level-objectives/)  
- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/)  
