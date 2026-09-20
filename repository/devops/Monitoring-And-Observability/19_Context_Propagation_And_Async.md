# 19 — Context propagation and async

[← Previous](./18_Distributed_Tracing.md) · [README](./README.md) · [Next →](./20_Sampling_Strategies.md)

## 1. Concepts — keep the story across hops

**Context propagation** carries trace/span identifiers (and optional baggage) across process and thread boundaries so spans stitch into one trace.

| Boundary | Typical mechanism |
|----------|-------------------|
| HTTP / gRPC | W3C Trace Context / vendor headers |
| Messaging | Trace context in message headers/metadata |
| Threads / async tasks | Context captured when scheduling work |
| Jobs / cron | Create a root span per run; pass into children |

```text
HTTP inbound (extract)
  → process
  → HTTP outbound (inject)
  → queue publish (inject)
       → consumer (extract) → continue trace OR link
```

**Async choices:** *continue* the producer trace in the consumer (one user journey) vs **span links** (separate consumer traces linked to the publish). Pick deliberately; document it.

**Disconfirm:** Generating a new random trace ID on every consumer message ≠ one journey. Logging `request_id` without wire propagation ≠ traces. Instrumenting only HTTP ≠ async coverage.

**Confirm:** Do queue messages carry trace headers? Do workers extract them? What about scheduled jobs?

## 2. Advanced — baggage, multi-hop, and breakage

**Baggage:** useful for tenant/route class; dangerous if large or PII-laden—bound it.

**Broken instrumentation:** middleware order, reverse proxies stripping headers, and custom clients that rebuild requests without inject.

**Fan-out / fan-in:** ensure child spans attach correctly; watch for “orphan” spans.

**Failure mode:** Sampling decision not propagated → inconsistent child drops mid-trace ([20](./20_Sampling_Strategies.md)).

## 3. Applications

**Staff checklist**

- HTTP and messaging libraries use standard propagation  
- Header allowlists on proxies include trace context  
- Worker services included in instrumentation coverage reviews  

**Exercise:** Publish a message; confirm consumer spans share `trace_id` (or intentional link).

## References

- [W3C Trace Context](https://www.w3.org/TR/trace-context/)  
- [OpenTelemetry — Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)  
- [18 Tracing](./18_Distributed_Tracing.md) · [14 Async monitoring](./14_Batch_Cron_And_Async_Monitoring.md)
