# 06 — APM, tracing, and correlation

[← Previous](./05_Logs_Pipelines_And_Indexes.md) · [README](./README.md) · [Next →](./07_RUM_Synthetics_And_Client_Signals.md)

## 1. Concepts — how to get traces

APM needs an **Agent** that accepts traces **and** **instrumentation** in the app.

| Approach | When |
|----------|------|
| **Single Step Instrumentation (SSI)** | Fastest path—install/configure libraries with Agent install flags; little or no code change |
| **Language tracing libraries** (`ddtrace`, etc.) | Need control, custom spans, or SSI not available |
| **OpenTelemetry** | Vendor-neutral SDKs; export OTLP to Datadog ([10](./10_OpenTelemetry_To_Datadog.md)) |
| **Dynamic Instrumentation** | Add spans from the UI without redeploy—use carefully in prod |

### Minimal host flow (official getting-started shape)

1. Agent 7 with APM instrumentation enabled for your language (SSI install script sets `DD_APM_INSTRUMENTATION_*` and API key/site).  
2. Set `DD_SERVICE` (and `DD_ENV` / `DD_VERSION`).  
3. Generate traffic.  
4. **APM → Services** then **APM → Traces**; open a flame graph.

Custom spans: install the language SDK, create spans/tags in code, run under the tracer launcher when required (e.g. `ddtrace-run` for Python).

Control cost with **ingestion sampling** and **retention filters**—100% forever is a choice, not a default ([parent 20](../20_Sampling_Strategies.md)).

**Disconfirm:** Agent installed, zero library/SSI ⇒ empty APM. Full Datadog SDK **and** full OTel export with no plan ⇒ double spans and double cost.

**Confirm:** Same `service`/`env`/`version` on metrics, logs, and traces?

## 2. Advanced

Service Catalog / ownership metadata (`service.datadog.yaml`, tags) helps on-call. Continuous Profiler sits beside APM for CPU/memory hotspots. Error Tracking aggregates exceptions across signals.

## 3. Applications — dig path

Page → monitor → dashboard → **trace** → **log** / error ([parent 21](../21_Correlation_And_Dig_Methodology.md)). Practice once in staging before you need it at 3am.

## References

- [APM / tracing](https://docs.datadoghq.com/tracing/) · [Getting started with APM](https://docs.datadoghq.com/getting_started/tracing/) · [Trace collection](https://docs.datadoghq.com/tracing/trace_collection/)  
- [07 RUM / Synthetics](./07_RUM_Synthetics_And_Client_Signals.md)
