# 06 — APM, tracing, and correlation

[← Previous](./05_Logs_Pipelines_And_Indexes.md) · [README](./README.md) · [Next →](./07_RUM_Synthetics_And_Client_Signals.md)

## 1. Concepts — how to get traces

APM needs an **Agent** that accepts traces **and** **instrumentation** in the app.

| Approach | When |
|----------|------|
| **Single Step Instrumentation (SSI)** | Fastest path—install/configure libraries with Agent install; little or no code change |
| **Language tracing libraries** (`ddtrace`, etc.) | Need control, custom spans, or SSI not available |
| **OpenTelemetry** | Vendor-neutral SDKs; export to Datadog ([10](./10_OpenTelemetry_To_Datadog.md)) |
| **Dynamic Instrumentation** | Add spans from the UI without redeploy—gate who can use it |

### Minimal flow

1. Agent 7 with APM enabled (SSI install sets `DD_APM_INSTRUMENTATION_*` plus API key/site).  
2. Set `DD_SERVICE` (and `DD_ENV` / `DD_VERSION`).  
3. Generate traffic.  
4. **APM → Services** then **APM → Traces**; open a flame graph.

Custom spans: install the language SDK, create spans/tags in code, run under the tracer launcher when required (e.g. `ddtrace-run` for Python). Control cost with **ingestion sampling** and **retention filters**—100% forever is a choice ([parent 20](../20_Sampling_Strategies.md)).

**Disconfirm:** Agent installed, zero library/SSI ⇒ empty APM. Full Datadog SDK **and** full OTel export with no plan ⇒ double spans and double cost.

**Confirm:** Same `service`/`env`/`version` on metrics, logs, and traces? Sampling policy written?

## 2. Advanced — catalog, sampling, correlation

**Service Catalog / ownership** metadata (`service.datadog.yaml`, tags) helps on-call. Continuous Profiler sits beside APM for CPU/memory hotspots ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)). Error Tracking aggregates exceptions across APM/logs/RUM.

**Ingestion vs retention.** Agent/SDK sampling decides what is sent; retention filters decide what stays searchable. Tune both or FinOps and engineers fight.

**Correlation.** Unified tags + log injection + RUM/Synthetics link headers make metric→trace→log→user digs possible ([parent 21](../21_Correlation_And_Dig_Methodology.md)). Database and cache spans may omit host on purpose—do not “fix” that away blindly.

**Universal Service Monitoring** can show golden signals without code ([17](./17_Network_USM_And_GPU_Monitoring.md))—use as a bridge to real APM, not a permanent substitute for critical paths.

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| First traced service | SSI or SDK on staging; confirm Service Catalog entry ([13](./13_Worked_Example_First_Service.md)) |
| Custom business span | Code instrumentation + meaningful span tags (bounded) |
| Latency regression | Compare by `version`; Watchdog faulty deploy ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)) |
| On-call dig | Page → monitor → dashboard → trace → log |

**Staff checklist:** one instrumentation path per runtime; sampling/retention documented; exemplars/trace links from RED monitors; practice dig in staging.

## References

- [APM / tracing](https://docs.datadoghq.com/tracing/) · [Getting started with APM](https://docs.datadoghq.com/getting_started/tracing/) · [Trace collection](https://docs.datadoghq.com/tracing/trace_collection/)  
- [07 RUM / Synthetics](./07_RUM_Synthetics_And_Client_Signals.md)
