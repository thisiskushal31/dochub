# 23 — LLM Observability, Bits AI, and MCP

[← Previous](./22_Observability_Pipelines.md) · [README](./README.md) · [Next →](./24_Feature_Flags_Experiments_And_Product_Analytics.md)

## 1. Concepts

### LLM / Agent Observability

Tracing and evaluation for **LLM and agent** applications: spans across model calls and tools, datasets, experiments, evaluations, prompt workflows, annotations, production monitors. Correlate with APM, infra, and RUM. Instrument via Datadog SDKs, OTel, or HTTP; supports major model/agent frameworks (OpenAI, Anthropic, Bedrock, LangChain, CrewAI, …—verify current list).

Pair with **AI Guard** ([20](./20_Security_Products.md)) and **GPU Monitoring** ([17](./17_Network_USM_And_GPU_Monitoring.md)) when cost/security matter.

### Bits AI

Agentic teammate inside Datadog for development, security, and ops workflows (chat, delegated tasks such as alert investigation). Usage often ties to **AI Credits** billing—treat as a cost dimension ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

### MCP server & AI Agents console

Model Context Protocol / agent console surfaces for connecting coding agents to Datadog context—enable with the same secrets and RBAC discipline as API keys ([26](./26_API_Terraform_CLI_And_Account_Admin.md)).

**Disconfirm:** LLM traces without prompt/PII policy. Bits auto-closing incidents without humans.

**Confirm:** Eval gates before prod prompts? SDS on LLM spans/logs?

## 2. Advanced

Track token/cost metrics as first-class SLIs for AI features. Keep one instrumentation story (OTel vs Datadog) consistent with [10](./10_OpenTelemetry_To_Datadog.md).

## 3. Applications — what to do

1. Instrument one LLM endpoint; view traces + latency/cost.  
2. Add an evaluation for the failure mode you fear (hallucination / tool error).  
3. Turn on AI Guard rules for that app before public traffic.

## References

- [LLM Observability](https://docs.datadoghq.com/llm_observability/) · [Bits AI](https://docs.datadoghq.com/bits_ai/) · [AI Guard](https://docs.datadoghq.com/security/)  
- [24 Flags / analytics](./24_Feature_Flags_Experiments_And_Product_Analytics.md)
