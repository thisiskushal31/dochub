# 21 — CI Visibility, continuous testing, and delivery gates

[← Previous](./20_Security_Products.md) · [README](./README.md) · [Next →](./22_Observability_Pipelines.md)

## 1. Concepts

### CI Visibility (Pipeline + Testing Visibility)

Unified view of **pipeline** results, duration, flakiness, and reliability across CI providers. Trace pipelines/commits that broke the build; `datadog-ci` CLI adds custom tags/measures and command traces.

### Continuous Testing

Codeless / resilient **Synthetic-style** tests (web recorder, mobile, parallel, multi-location) run in CI batches against pre-prod—gRPC/WebSocket and cross-browser where configured ([07](./07_RUM_Synthetics_And_Client_Signals.md)).

### Related delivery controls

| Capability | Job |
|------------|-----|
| **Test Optimization / Test Impact Analysis** | Run the tests that matter; cut CI cost |
| **PR Gates / Deployment Gates** | Block bad changes using Datadog signals |
| **Continuous Delivery** surfaces | Delivery performance literacy (DORA-adjacent) |
| **Code coverage** | Coverage insights where enabled |
| **IDE plugins** | Shift signals into the editor |

**Disconfirm:** Green CI Visibility ≠ production SLO. Gates without fast feedback ⇒ shadow merges.

**Confirm:** Which pipelines are instrumented? Who owns flaky-test burn?

## 2. Advanced

Correlate deploy events with APM Deployment Tracking and Watchdog faulty deploys ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)). Use Quality Gates thoughtfully—fail closed only on proven signals.

## 3. Applications — what to do

1. Enable Pipeline Visibility on the main CI system.  
2. Add one Continuous Testing suite on critical checkout in staging.  
3. Emit deploy events Datadog can correlate with `version`.

## References

- [CI Visibility](https://docs.datadoghq.com/continuous_integration/) · [Continuous Testing](https://docs.datadoghq.com/continuous_testing/) · [Synthetic Monitoring](https://docs.datadoghq.com/synthetics/)  
- [22 Pipelines](./22_Observability_Pipelines.md)
