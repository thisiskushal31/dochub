# 35 — Runtime and language-specific signals

[← Previous](./34_Reference_Topologies_End_To_End.md) · [README](./README.md) · [Next →](./36_Classical_Monolith_And_Distributed_Estates.md)

## 1. Concepts — same RED, different saturation story

User-facing **RED/SLI** is portable across languages ([4](./4_Golden_Signals_RED_And_USE.md), [12](./12_Application_And_Service_Monitoring.md)). **Runtime saturation** is not. A Node service can look “fine” on CPU while the **event loop** is blocked; a JVM service can look fine on request rate while **GC pause** destroys p99; Go can thrash on **goroutine** leaks; Python can stall on **GIL / asyncio loop** or worker process exhaustion.

| Runtime family | First-class white-box signals (examples) | Common false comfort |
|----------------|------------------------------------------|----------------------|
| **Node.js / JS on server** | Event-loop delay (p50/p90/p99), event-loop utilization, active/idle loop time; heap / V8 where available | Host CPU low while sync JSON/bcrypt blocks *all* requests |
| **JVM (Java / Kotlin / Scala / …)** | Heap, GC pause/throughput, thread states, metaspace; pool waits | “CPU OK” during long stop-the-world or thread-pool exhaustion |
| **Go** | Goroutine count, GC stats, scheduler latency (where exposed) | Growing goroutines with flat CPU until memory/latency cliff |
| **Python** | Process RSS, GC, asyncio lag / blocked loop; worker counts for WSGI/ASGI | One blocked worker looks like “slow DB” forever |
| **.NET** | GC heaps, thread-pool queue, exceptions/sec | Thread-pool starvation with healthy machine USE |

```text
User SLI burn
  → service RED
  → runtime-specific saturation   ← this chapter
  → host USE / peers              ← [11](./11_Infrastructure_And_Host_Monitoring.md), [13](./13_Dependency_And_Peer_Monitoring.md)
```

**Door to Languages:** *why* the event loop or GIL behaves that way is taught under [`Languages/`](../Languages/) (e.g. TypeScript **13** runtime performance, Python concurrency / observability chapters). This folder owns **what to monitor and page on** in production—not language tutorials.

**Disconfirm:** One “CPU + RSS” dashboard for every language ≠ enough. Copy-paste JVM GC panels onto Node ≠ literacy. Ignoring runtime metrics because “we have traces” ≠ catching loop block before users scream.

**Confirm:** For each language in your estate, name 2–3 runtime signals you would put next to RED. For Node: what pages on event-loop delay vs on error ratio?

## 2. Advanced — instrumentation shape and production traps

### Node.js (the production trap you named)

Node is largely **one JS thread + libuv**. Sync work (big JSON parse, crypto, tight CPU loops, `*Sync` I/O on hot paths) delays *everyone*. OpenTelemetry semantic conventions expose `nodejs.eventloop.delay.*`, `nodejs.eventloop.utilization`, and `nodejs.eventloop.time` (with `active`/`idle` states)—pair them with request latency histograms.

| Symptom | Likely dig |
|---------|------------|
| Latency up, CPU modest, error rate flat | Event-loop delay ↑ → find sync hot path / profile |
| Latency + CPU up | Real compute or too little cluster workers |
| Event loop OK, latency up | Peer/downstream ([13](./13_Dependency_And_Peer_Monitoring.md)) |

Workers / `cluster` / multiple processes: monitor **per process** then aggregate; one blocked worker is a partial outage.

### JVM / Go / Python / .NET (portable habits)

- Prefer **runtime metrics from the same pipeline** as app RED (OTel runtime instrumentations / agents)—not a separate forgotten exporter.  
- Alert **symptom-first** (SLI burn); use runtime gauges for dig and *predictive* tickets (heap growth, goroutine climb).  
- Profiles ([23](./23_Continuous_Profiling_And_Events.md)) often finish what runtime metrics start.

### Polyglot estates

Do **not** force identical panel sets. Force identical **jobs**: RED + SLI + dig path + *runtime appendix for that process model*. Label `runtime` / `language` (bounded) on series so on-call opens the right row.

**Failure mode:** Auto-instrument HTTP only; never enable runtime metrics → classic “Node is slow, CPU is fine” war room.

## 3. Applications

**Staff checklist**

- Inventory: language/runtime per critical service  
- Runtime panel next to RED on each overview dashboard  
- Node services: event-loop delay/utilization collected and understood by on-call  
- Language depth questions → [`Languages/`](../Languages/); production signal questions stay here  

**Exercise:** Break a staging Node app with a sync `while` or large sync parse on a route. Did event-loop metrics move before or with p99?

## References

- [OpenTelemetry — Node.js runtime metrics (semconv)](https://opentelemetry.io/docs/specs/semconv/runtime/nodejs-metrics/)  
- [Node.js — Performance measurement APIs (`perf_hooks`)](https://nodejs.org/api/perf_hooks.html)  
- [OpenTelemetry — Runtime metrics overview](https://opentelemetry.io/docs/specs/semconv/runtime/)  
- [12 App monitoring](./12_Application_And_Service_Monitoring.md) · [23 Profiling](./23_Continuous_Profiling_And_Events.md) · [Languages/](../Languages/)
