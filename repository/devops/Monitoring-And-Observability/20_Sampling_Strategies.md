# 20 — Sampling strategies

[← Previous](./19_Context_Propagation_And_Async.md) · [README](./README.md) · [Next →](./21_Correlation_And_Dig_Methodology.md)

## 1. Concepts — fidelity versus cost

You rarely keep **100%** of traces (or debug logs) forever. **Sampling** chooses which telemetry to keep.

| Strategy | When decided | Strength | Risk |
|----------|--------------|----------|------|
| **Head** | At start of trace | Simple, low buffer cost | May drop the interesting rare failure |
| **Tail** | After trace completes | Keep errors / slow traces | Needs collector buffering |
| **Probabilistic** | Fixed % | Predictable volume | May miss rare bugs |
| **Rate-limiting** | Cap per second | Protect backends | Bias under load |
| **Rules** | By route/tenant/status | Business-aware | Complexity |

```text
All spans observed
   → sample decision (head or tail)
   → export kept traces
   → metrics often still full fidelity
```

**Bias toward pain:** keep errors and high latency at much higher rates than healthy short traces.

**Disconfirm:** 1% everywhere ≠ enough for a 0.1% bug. Sampling metrics the same way as traces ≠ usual (metrics stay cheap aggregates). “No sampling” at scale ≠ free ([30](./30_Telemetry_Cost_And_FinOps.md)).

**Confirm:** What is your default trace sample rate? Are errors forced keep? Who owns the policy?

## 2. Advanced — consistency and multi-tier

**Consistent decisions:** propagate sampling state so children are not dropped mid-trace inconsistently ([19](./19_Context_Propagation_And_Async.md)).

**Multi-tier:** edge samples differently from batch—document.

**Logs:** sample debug; keep errors; never sample away audit when compliance requires completeness (separate plane).

**Failure mode:** Tail sampling OOM under traffic spikes → lose the incident evidence you needed most.

## 3. Applications

**Staff checklist**

- Written sampling policy (happy vs error vs slow)  
- Backend SLOs for collector lag under peak  
- Cost review tied to sample rate changes  

**Exercise:** Estimate traces/sec at 100% vs policy; pick a rate that preserves error forensics within budget.

## References

- [OpenTelemetry — Sampling](https://opentelemetry.io/docs/concepts/sampling/)  
- [18 Tracing](./18_Distributed_Tracing.md) · [30 FinOps](./30_Telemetry_Cost_And_FinOps.md)
