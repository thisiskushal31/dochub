# 37 — Client RUM, coverage inventory, and eBPF amplifiers

[← Previous](./36_Classical_Monolith_And_Distributed_Estates.md) · [README](./README.md)

## 1. Concepts — three gaps teams discover late

After metrics/logs/traces are “in,” production still surprises people with: **browser reality**, **uninstrumented corners**, and **kernel-level visibility**. Treat them as amplifiers—not replacements—for the core track.

### A. Real User Monitoring (RUM) vs synthetics

| | **Synthetics** ([5](./5_Black_Box_White_Box_And_Synthetics.md)) | **RUM** |
|---|----------------------------------|---------|
| Who | Scripted probe | Real browsers / apps |
| Strength | Always-on path check; deploy gates; off-hours | Device, geo, network, extension mess; Web Vitals |
| Weakness | Not real diversity | Needs traffic; privacy/consent; sampling |

Use **both**: synthetics for “is the journey up?”; RUM for “are *users* happy?” Propagate trace context from client → edge → backend when you can (OpenTelemetry browser work is evolving; vendor RUM is common).

### B. Coverage inventory (service × signal matrix)

List every production dependency and journey hop. Mark metrics / logs / traces / runtime / owner. Legacy, batch, and acquired services are usual holes. Re-run after major launches—coverage **rots**.

```text
service | metrics | logs | traces | runtime | owner | notes
checkout| RED+SLO | JSON  | yes    | Node EL | team-a | 
billing | partial | text  | no     | JVM GC  | team-b | next quarter
```

### C. eBPF / kernel amplifiers

**eBPF**-based agents can derive RED/traces from Linux with little code change—great for brownfield and unknown binaries. They do **not** replace business attributes, careful SLIs, or audit trails ([31](./31_Cloud_Managed_Sinks_And_Audit_Door.md)). Prefer them as coverage accelerators beside OTel where you own code.

**Disconfirm:** RUM alone ≠ backend observability. eBPF alone ≠ product SLIs. A green mesh with three uninstrumented money paths ≠ coverage.

**Confirm:** Do you have RUM or only synthetics? Which critical service lacks traces *or* runtime signals? Where would eBPF help most?

## 2. Advanced — privacy, AI/LLM telemetry, and CI telemetry

**Privacy / consent:** RUM and session replay are personal-data adjacent—legal + redaction before “turn it all on.”

**Frontend ↔ backend join:** without `traceparent` (or vendor equivalent) across CORS/gateways, you debug two halves forever ([19](./19_Context_Propagation_And_Async.md)).

**Emerging: LLM / AI feature telemetry** — latency, error/refusal rates, token/cost, retrieval quality. Same jobs (SLI, dig, cost); different metrics. Do not invent a parallel religion; extend label contracts and budgets ([30](./30_Telemetry_Cost_And_FinOps.md)).

**CI/CD system telemetry:** pipeline duration/fail rates are *delivery* monitoring—door to CiCd; still useful change events on app dashboards ([23](./23_Continuous_Profiling_And_Events.md)).

**Failure mode:** Sampling away the only RUM sessions from the broken geo; or eBPF everywhere with no owner for alert noise.

## 3. Applications

**Staff checklist**

- Synthetics + (where web UX matters) RUM decision documented  
- Coverage matrix for top journeys updated this quarter  
- eBPF/auto-instr evaluated for brownfield gaps—not as SLO substitute  
- Scorecard ([28](./28_Shape_Scorecard_Drills_And_Maturity.md)) includes coverage + client signals  

**Exercise:** Pick one paying journey. Can you go browser (or synthetic) → edge → service → DB in one join key?

## References

- [MDN — RUM vs synthetic](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Rum-vs-Synthetic)  
- [OpenTelemetry — Browser getting started](https://opentelemetry.io/docs/languages/js/getting-started/browser/)  
- [OpenTelemetry — Roadmap (client / profiling / eBPF themes)](https://opentelemetry.io/community/roadmap/)  
- [5 Synthetics](./5_Black_Box_White_Box_And_Synthetics.md) · [28 Scorecard](./28_Shape_Scorecard_Drills_And_Maturity.md) · [36 Estate shapes](./36_Classical_Monolith_And_Distributed_Estates.md)
