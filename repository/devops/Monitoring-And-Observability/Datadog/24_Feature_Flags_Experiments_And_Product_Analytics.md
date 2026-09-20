# 24 — Feature flags, experiments, and product analytics

[← Previous](./23_LLM_Observability_Bits_AI_And_MCP.md) · [README](./README.md) · [Next →](./25_Cloud_Cost_IDP_And_Platform_Services.md)

## 1. Concepts

### Feature Flags

Manage progressive delivery and targeting inside Datadog’s platform, with hooks into observability (flag changes as context for APM/RUM). If another flag system is already the org standard, keep one primary plane and still emit change events Datadog can correlate.

### Experiments

Experimentation / exposure analysis surfaces for measuring change impact (pair with flags and analytics).

### Product Analytics

Product adoption, conversion, and behavior patterns from client SDK events (often shares instrumentation with RUM). Server-side events via API when needed.

### Journey Monitoring

User-journey oriented monitoring across digital experiences—use when multi-step funnels matter beyond single synthetic checks ([07](./07_RUM_Synthetics_And_Client_Signals.md)).

**Disconfirm:** Flags without kill-switch ownership. Product Analytics as the only APM.

**Confirm:** Flag → monitor correlation on releases? Privacy review for analytics events?

## 2. Advanced

Tie flag `version`/variant to unified service tagging and Deployment Tracking. Use experiments with Error Tracking to catch bad cohorts early.

## 3. Applications — what to do

1. If Datadog is your flag store: migrate one low-risk flag; wire change events.  
2. Enable Product Analytics on the same RUM app as staging.  
3. Dashboard: conversion + error rate by flag variant.

## References

- [Feature Flags](https://docs.datadoghq.com/feature_flags/) · [Experiments](https://docs.datadoghq.com/experiments/) · [Product Analytics](https://docs.datadoghq.com/product_analytics/) · [Journey Monitoring](https://docs.datadoghq.com/journey_monitoring/)  
- [25 Cost / IDP](./25_Cloud_Cost_IDP_And_Platform_Services.md)
