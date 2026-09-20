# 22 — Observability Pipelines

[← Previous](./21_CI_Visibility_Testing_And_Delivery_Gates.md) · [README](./README.md) · [Next →](./23_LLM_Observability_Bits_AI_And_MCP.md)

## 1. Concepts

**Observability Pipelines** control, transform, and **route** logs (and metrics/traces) **before** they land in Datadog, a SIEM, or a data lake. Goals: cut cost/noise, standardize formats (OTel, OCSF, vendor schemas), dual-ship, and keep investigation fidelity.

Typical capabilities (per current product docs):

- Collect → process → route with templates/Packs  
- Live Capture, simulation before prod changes  
- AI-assisted parsing; Terraform export  
- Security Packs (e.g. Microsoft Sentinel / Google SecOps shaped output)  
- OTel-compatible pipelines  

**BYOC / bring-your-own** log patterns and on-prem collection variants exist for constrained networks—see BYOC logs docs when Agent→SaaS direct isn’t allowed.

**Disconfirm:** Pipelines as a second unowned platform. Dropping fields that security still needs for SIEM.

**Confirm:** Who on-calls the pipeline workers? Dual-ship retention policy written?

## 2. Advanced

Use pipelines when Agent-side scrubbing isn’t enough, when multiple sinks are mandatory, or when FinOps demands aggressive reduce-before-index. Still apply Sensitive Data Scanner / scrubbing ([20](./20_Security_Products.md)).

## 3. Applications — what to do

1. Start with one noisy log source; reduce volume before indexing.  
2. Simulate transforms; then Terraform the pipeline.  
3. Monitor pipeline health dashboards like any other production tier.

## References

- [Observability Pipelines](https://docs.datadoghq.com/observability_pipelines/) · [Product page](https://www.datadoghq.com/product/observability-pipelines/)  
- [23 LLM / Bits](./23_LLM_Observability_Bits_AI_And_MCP.md)
