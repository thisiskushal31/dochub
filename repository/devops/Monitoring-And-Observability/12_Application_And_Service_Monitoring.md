# 12 — Application and service monitoring

[← Previous](./11_Infrastructure_And_Host_Monitoring.md) · [README](./README.md) · [Next →](./13_Dependency_And_Peer_Monitoring.md)

## 1. Concepts — owned user paths

**Application / service monitoring** watches *your* code’s user-visible work: RED/golden on owned routes, business-critical workflows, and service-level saturation (thread pools, connection pools).

| Focus | Examples |
|-------|----------|
| Traffic | QPS by route_class |
| Errors | 5xx ratio; handled business errors separately |
| Latency | p95/p99 per critical route |
| Saturation | Pool wait, queue in-process, GC thrash |
| Releases | Error/latency delta after deploy |

This is the **primary** detect layer for product teams. Host USE ([11](./11_Infrastructure_And_Host_Monitoring.md)) and peers ([13](./13_Dependency_And_Peer_Monitoring.md)) support it.

```text
Client → edge → your service (RED + SLI)
                 ├─ pools / runtime saturation
                 └─ calls to peers (separate peer SLIs)
```

**Disconfirm:** Framework default metrics with no critical-route breakout ≠ enough. Equating “pod ready” with “users succeeding” ≠ service monitoring.

**Confirm:** Name critical route classes. Which SLI covers them? Where does a deploy show up on the dashboard?

## 2. Advanced — instrumentation quality and multi-service

**Instrumentation:** prefer OpenTelemetry-class spans/metrics with stable names ([22](./22_Instrumentation_Collectors_And_Backends.md)); avoid per-PR metric invention.

**Service meshes / gateways:** edge RED is complementary—do not double-page identical symptoms without inhibition.

**Version labels:** bounded `version` or `revision` helps canary comparison; do not explode with commit SHA high cardinality if series volume hurts ([7](./7_Cardinality_And_Label_Contracts.md)).

**Runtime specifics:** Node event-loop, JVM GC, Go goroutines, Python workers, .NET thread pool—**first-class** white-box aids beside RED. Depth: [35](./35_Runtime_And_Language_Specific_Signals.md). Pair with SLIs; do not replace them.

**Failure mode:** Health checks included in success ratio → SLO lies ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)).

## 3. Applications

**Staff checklist**

- Critical routes have RED + SLI  
- Overview dashboard + burn page exist  
- Deploy annotation or event visible  

**Exercise:** After a canary, compare RED for canary vs baseline revision. Can you see it in under two minutes?

## References

- [OpenTelemetry metrics concepts](https://opentelemetry.io/docs/concepts/signals/metrics/)  
- [4 Golden signals](./4_Golden_Signals_RED_And_USE.md) · [8 SLI/SLO](./8_SLI_SLO_SLA_And_Error_Budgets.md)
