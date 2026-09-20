# 24 — APM as a product shape

[← Previous](./23_Continuous_Profiling_And_Events.md) · [README](./README.md) · [Next →](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md)

## 1. Concepts — a bundle, not a fourth pillar

**APM** (application performance monitoring) is a **product shape**: one vendor UX that bundles app metrics, traces, sometimes logs, errors, and profiling. It is not a separate telemetry law beside metrics/logs/traces—it is how those jobs are packaged.

| Job inside APM | Map to this track |
|----------------|-------------------|
| Service RED | [12](./12_Application_And_Service_Monitoring.md) |
| Distributed traces | [18](./18_Distributed_Tracing.md) |
| Error digests | [16](./16_Structured_Logging.md) / traces |
| Profiling | [23](./23_Continuous_Profiling_And_Events.md) |
| Alerts | [9](./9_Dashboards_Alerts_And_Pages.md)–[10](./10_Alert_Hygiene_And_Burn_Rates.md) |

**When APM helps:** fast time-to-value, unified UX, multi-language agents, less collector DIY.

**When it hurts:** opaque pricing, weak infra/audit coverage, lock-in of instrumentation, “APM green” while black-box fails.

**Disconfirm:** Buying APM ≠ finishing SLOs or black-box checks. APM ≠ CloudTrail. APM ≠ on-call culture.

**Confirm:** Which jobs does your APM cover? Which jobs stay in Prometheus/cloud/audit?

## 2. Advanced — agents vs OTel, and dual stacks

**Vendor agents vs OpenTelemetry:** agents are convenience; OTel reduces lock-in at the instrumentation layer ([22](./22_Instrumentation_Collectors_And_Backends.md)). Many vendors now ingest OTel.

**Dual stack:** APM for apps + Prometheus for platforms is common—correlate deliberately ([21](./21_Correlation_And_Dig_Methodology.md)).

**Failure mode:** Two overlapping page pipelines (APM + Prometheus) with no inhibition → double pages.

## 3. Applications

**Staff checklist**

- Written “APM covers X; not Y” decision  
- SLO burn still defined independently of vendor widgets  
- Exit/migration note (OTel export) exists if lock-in worries you  

**Exercise:** Map last incident tools used. Was APM necessary or was a thin dig path enough?

## References

- [OpenTelemetry vendor ecosystem](https://opentelemetry.io/ecosystem/vendors/)  
- [25 Named stacks](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [26 Commercial models](./26_OSS_Managed_SaaS_And_Hybrid.md)
