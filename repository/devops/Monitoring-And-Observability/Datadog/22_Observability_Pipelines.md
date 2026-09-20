# 22 — Observability Pipelines

[← Previous](./21_CI_Visibility_Testing_And_Delivery_Gates.md) · [README](./README.md) · [Next →](./23_LLM_Observability_Bits_AI_And_MCP.md)

## 1. Concepts — control telemetry before the sink

**Observability Pipelines** collect, transform, and **route** logs (and often metrics/traces) **before** they land in Datadog, a SIEM, or a data lake. Goals: cut cost and noise, standardize formats (OTel, OCSF, vendor schemas), dual-ship for compliance, and keep investigation fidelity where it matters.

Use when Agent-side scrubbing isn’t enough, multiple sinks are mandatory, FinOps demands reduce-before-index, or network policy blocks direct Agent→SaaS for some estates (BYOC / worker patterns — see current docs).

| Stage | Examples |
|-------|----------|
| **Collect** | Agent, Fluent, cloud log sources, OTel |
| **Process** | Parse, remap, sample, redact, enrich, route by attribute |
| **Route** | Datadog indexes, S3/GCS, Splunk/Sentinel/SecOps, Kafka |

**Capabilities to know (per product docs):** templates and Packs; Live Capture / simulation before prod changes; AI-assisted parsing; Terraform export; Security Packs shaped for Microsoft Sentinel / Google SecOps; OTel-compatible pipelines.

**Vs Agent pipelines / exclusion filters.** Intake pipelines and index exclusion ([05](./05_Logs_Pipelines_And_Indexes.md)) still matter. Observability Pipelines are the **multi-sink control plane** when you outgrow “everything to Datadog then drop.”

**Disconfirm:** Pipelines as a second unowned platform. Dropping fields security still needs for SIEM. “We route to the lake so Datadog hygiene doesn’t matter.”

**Confirm:** Who on-calls the pipeline workers? Dual-ship retention policy written? SDS / redaction still applied ([20](./20_Security_Products.md))?

## 2. Advanced — simulation, dual-ship, failure modes

**Change safely.** Use simulation / Live Capture against sample traffic before promoting transforms. Export to Terraform once stable ([26](./26_API_Terraform_CLI_And_Account_Admin.md)) so pipeline edits get review like app code.

**Dual-ship patterns.** Hot path → Datadog (short retention, high query); cold path → object storage / SIEM (long retention). Don’t send full debug to both forever — sample or tier by `env`/`service`.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Silent drop of security fields | Aggressive remap without SecOps sign-off |
| Pipeline lag / backpressure | Undersized workers; bursty sources; slow sink |
| Duplicate events in Datadog | Dual route + Agent still shipping same source |
| Parse rot | Vendor log format changed; no canary alerts |

**Ops like production.** Monitor worker CPU, lag, error rate, and bytes routed. Page on pipeline health — a dead worker is an observability outage. Capacity-plan before Black Friday log floods.

**Cost.** Pipelines themselves and egress to multiple sinks cost money; the win is **indexed** volume reduction in Datadog ([11](./11_Cost_Governance_And_Account_Hygiene.md)). Measure before/after indexed GB and investigate query success.

**Security.** Redact in-pipeline **and** keep SDS as defense in depth. Workers hold credentials for sinks — treat as tier-0 secrets. Network isolation for workers that see auth logs.

**BYOC / constrained networks.** When Agent cannot speak to SaaS directly, workers in-VPC forward allowed subsets — document which signals never leave the boundary for compliance.

## 3. Applications — use cases and staff checklist

**Use case 1 — Noisy debug source.** One verbose microservice: sample/drop debug before index; keep errors+warnings 100%; verify dig path still works for Sev1.

**Use case 2 — Dual-ship for audit.** Route auth logs to SIEM Pack + Datadog; lake retention N years; Datadog 15 days for digs.

**Use case 3 — Format standardization.** Remap vendor logs to a common schema; fewer grok nightmares in investigators’ notebooks ([19](./19_Incident_Workflows_And_Collaboration.md)).

**Use case 4 — Terraform promotion.** Simulate → review → Terraform apply; alert if worker version skews across envs.

**Staff checklist**

- [ ] Named owner / on-call for pipeline workers  
- [ ] Simulation used before prod transform changes  
- [ ] Dual-ship retention policy written with SecOps/FinOps  
- [ ] Pipeline health dashboards and monitors live  
- [ ] No unintentional duplicate Agent + pipeline shipping  
- [ ] Redaction/SDS still on; secrets for sinks rotated  

**Good:** reduce and route with ownership and simulation. **Bad:** unowned workers dropping fields that audits need.

## References

- [Observability Pipelines](https://docs.datadoghq.com/observability_pipelines/) · [Pipelines setup](https://docs.datadoghq.com/observability_pipelines/setup/)  
- [Product overview](https://www.datadoghq.com/product/observability-pipelines/)  
- [23 LLM / Bits AI](./23_LLM_Observability_Bits_AI_And_MCP.md)
