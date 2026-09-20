# 18 — Distributed tracing

[← Previous](./17_Log_Planes_Retention_And_Volume.md) · [README](./README.md) · [Next →](./19_Context_Propagation_And_Async.md)

## 1. Concepts — one request across many services

A **trace** is the tree/DAG of **spans** for one unit of work (usually a request). Each span has a name, timing, attributes, and parent links. Tracing answers *where time went* and *which peer failed* across process boundaries.

```text
trace_id
  ├─ span: gateway
  │    └─ span: checkout
  │         ├─ span: db.query
  │         └─ span: payments.http
```

| Idea | Meaning |
|------|---------|
| Span | Timed operation |
| Trace | Causal set of spans |
| Attributes | Bounded key/value context |
| Status | OK / error |
| Baggage / propagation | Context across services ([19](./19_Context_Propagation_And_Async.md)) |

**Disconfirm:** Traces without propagation across hops ≠ distributed tracing. 100% sampling forever ≠ free ([20](./20_Sampling_Strategies.md)). Spans named `handler` everywhere ≠ actionable.

**Confirm:** Can you open a trace from a slow request and name the slowest child? Are DB and outbound HTTP spanned?

## 2. Advanced — backends, exemplars, and product shapes

**Backends:** Tempo, Jaeger, X-Ray, vendor APM—same job, different ops ([25](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md), tool folders later).

**Exemplars:** metric → exemplar trace ID bridges detect to explain ([21](./21_Correlation_And_Dig_Methodology.md)).

**Span metrics:** derive RED from spans carefully; do not double-count with separate metrics without a plan.

**Tail vs head sampling:** decide fidelity for errors and slow traces ([20](./20_Sampling_Strategies.md)).

**Failure mode:** Missing instrumentation on the async consumer → HTTP traces look fine while the worker path is blind ([19](./19_Context_Propagation_And_Async.md)).

## 3. Applications

**Staff checklist**

- Critical path services emit spans with stable names  
- Trace UI linked from service overview  
- Errors and high latency over-sampled vs happy path  

**Exercise:** Reproduce a slow endpoint; find the critical span in under five minutes.

## References

- [OpenTelemetry — Traces](https://opentelemetry.io/docs/concepts/signals/traces/)  
- [19 Propagation](./19_Context_Propagation_And_Async.md) · [20 Sampling](./20_Sampling_Strategies.md)
