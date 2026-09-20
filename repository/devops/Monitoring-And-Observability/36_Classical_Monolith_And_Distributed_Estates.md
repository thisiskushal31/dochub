# 36 — Classical, monolith, and distributed estates

[← Previous](./35_Runtime_And_Language_Specific_Signals.md) · [README](./README.md) · [Next →](./37_Client_RUM_Coverage_And_EBPF_Amplifiers.md)

## 1. Concepts — one practice, many topologies

Monitoring and observability jobs do **not** require microservices. A classical host (reverse proxy + app process + DB on VMs), a modular **monolith**, a few large SOA services, and a mesh of microservices all need: define good → detect → dig → improve signals. What changes is **where signals live** and **how deep tracing must go**.

| Estate shape | Detect emphasis | Explain emphasis | Typical blind spot |
|--------------|-----------------|------------------|--------------------|
| **Classical host / VM** | Black-box URL, process up, host USE, log files, cron | SSH + logs; optional local APM | “App up” while dependency DNS/cert fails ([5](./5_Black_Box_White_Box_And_Synthetics.md)) |
| **Monolith (one deployable)** | RED on critical routes; runtime ([35](./35_Runtime_And_Language_Specific_Signals.md)); DB peer | Logs + profiles; traces *inside* process still help | Treating monolith as “no need for correlation IDs” |
| **Few large services** | Per-service SLI + peer RED | Short traces across 3–5 hops | Shared DB as silent single point |
| **Many microservices** | SLO per journey; burn; golden signals | Propagation + sampling mandatory ([18](./18_Distributed_Tracing.md)–[20](./20_Sampling_Strategies.md)) | Missing one hop → useless traces |
| **Batch / data plane heavy** | Freshness, lag, last-success ([14](./14_Batch_Cron_And_Async_Monitoring.md)) | Job run IDs; queue traces | HTTP dashboards only |
| **Brownfield mix** | Inventory coverage ([37](./37_Client_RUM_Coverage_And_EBPF_Amplifiers.md)) | Dig path that tolerates partial telemetry | Assuming uniform OTel everywhere |

```text
Same jobs:  SLI → page → dig
Different wiring:  how many hops, where logs live, how much auto-instr you can afford
```

**Classical delivery still exists** (host deploys, Jenkins-era estates, Compose-ish stacks). Methodologies/CiCd cover *how it ships*; here you cover *how you see it when it breaks*. Do not skip SLOs because the architecture is “old.”

**Disconfirm:** “Observability is only for Kubernetes microservices” ≠ true. Monolith ≠ zero instrumentation. Distributed traces without a journey SLO ≠ done. Copying a 40-service Grafana folder onto a two-VM estate ≠ maturity.

**Confirm:** Draw your estate in one of the rows above. What is the minimum dig path that works *today*? What is the next coverage gap?

## 2. Advanced — progressive enrichment (brownfield)

**Order that usually works:**

1. Black-box + logs with correlation ID on the edge.  
2. RED metrics + SLI/SLO on the critical journey.  
3. Runtime signals for the process model you run ([35](./35_Runtime_And_Language_Specific_Signals.md)).  
4. Traces where hops or fan-out hurt (even 2–3 services).  
5. Profiles / eBPF / RUM as amplifiers ([23](./23_Continuous_Profiling_And_Events.md), [37](./37_Client_RUM_Coverage_And_EBPF_Amplifiers.md)).

**Monolith tracing** still marks handlers, DB, and outbound HTTP—digs become “which function / query,” not “which repo.”

**Distributed without culture** (no label contracts, no owners) fails harder than a well-monitored monolith—fix shape first ([2](./2_Mindset_And_Anti_Patterns.md), [28](./28_Shape_Scorecard_Drills_And_Maturity.md)).

**Failure mode:** Rewriting to microservices “for observability” while pages remain cause-based CPU alerts.

## 3. Applications

**Staff checklist**

- Estate shape named for each product (classical / monolith / hybrid / distributed)  
- Coverage matrix: service × metrics/logs/traces/runtime (honest partials)  
- Dig runbook matches the shape (SSH+logs vs Explore+trace)—not a fantasy mesh UI  

**Exercise:** Take last incident on a non-K8s or monolith path. Which chapter jobs were missing—not which logo?

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [CiCd classical / spectrum doors](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md) (how it ships)  
- [34 Topologies](./34_Reference_Topologies_End_To_End.md) · [28 Scorecard](./28_Shape_Scorecard_Drills_And_Maturity.md)
