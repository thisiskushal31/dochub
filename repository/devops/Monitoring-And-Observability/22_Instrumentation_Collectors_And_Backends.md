# 22 — Instrumentation, collectors, and backends

[← Previous](./21_Correlation_And_Dig_Methodology.md) · [README](./README.md) · [Next →](./23_Continuous_Profiling_And_Events.md)

## 1. Concepts — create vs move vs store

Separate three jobs or you will buy the wrong product:

| Job | Meaning | Examples |
|-----|---------|----------|
| **Instrumentation** | Create telemetry in code/runtime | OTel SDK, agents, auto-instr |
| **Collection** | Receive, process, export | OTel Collector, agents, sidecars |
| **Backend** | Store and query | Prometheus, Loki, Tempo, Elastic, SaaS, cloud native |

```text
App / system ──► instrumentation
                  ↓
               collector (sample, redact, route)
                  ↓
         metrics / logs / traces backends
                  ↓
              UI + alerts
```

**OpenTelemetry** is the common *lingua franca* for instrumentation and collector pipelines; it is not itself your long-term database.

**Disconfirm:** Installing a SaaS agent ≠ understanding these layers. Pointing apps straight at five backends without a collector ≠ operable at scale. Collector as “dumb pipe” with no redaction ≠ safe.

**Confirm:** Where are spans created? Where is sampling enforced? Which backend owns metrics vs logs vs traces?

## 2. Advanced — agents, dual-write, and ownership

**Auto vs manual instrumentation:** auto gets you coverage; manual spans mark business-critical operations.

**Dual export:** temporary bridge during migrations; avoid forever dual-write cost.

**Platform ownership:** collector pool, processors (attributes, filter), and exporters are platform; span names and SLIs are service teams.

**Failure mode:** App blocks on telemetry export → user latency tied to observability backend health—use async export and backpressure policies.

## 3. Applications

**Staff checklist**

- Diagram for your estate: instrument → collect → backends  
- Redaction/sampling processors documented  
- Service onboarding guide for new instrumentation  

**Exercise:** Trace one attribute from code to UI. Where could you drop PII?

## References

- [OpenTelemetry docs](https://opentelemetry.io/docs/)  
- [25 Stack shapes](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [27 Tool kinds](./27_Tool_Kinds_By_Job.md)
