# 23 — LLM Observability, Bits AI, and MCP

[← Previous](./22_Observability_Pipelines.md) · [README](./README.md) · [Next →](./24_Feature_Flags_Experiments_And_Product_Analytics.md)

## 1. Concepts — observe AI apps and use AI inside Datadog

Two related jobs: **instrument the LLM/agent products you ship**, and **use Datadog’s own agentic helpers** without handing them the keys to production.

### LLM / Agent Observability

Tracing and evaluation for **LLM and agent** applications: spans across model calls and tools, datasets, experiments, evaluations, prompt workflows, annotations, and production monitors. Correlate with APM, infra, RUM, and GPU signals ([17](./17_Network_USM_And_GPU_Monitoring.md)).

Instrument via Datadog SDKs, OpenTelemetry, or HTTP. Framework coverage includes major providers and agent stacks (OpenAI, Anthropic, Bedrock, LangChain, CrewAI, and others — verify current list). Pair with **AI Guard** ([20](./20_Security_Products.md)) for inline prompt-injection / tool-abuse / sensitive-data protections.

| Signal | Job |
|--------|-----|
| LLM spans / traces | Latency, errors, tool calls per request |
| Token / cost metrics | FinOps SLIs for AI features |
| Evaluations | Quality gates before/after prompt changes |
| Monitors | Error rate, latency, eval regressions in prod |

**When:** any user-facing or revenue LLM path. **When not:** one-off internal notebooks with no SLO — still scrub secrets.

### Bits AI

Agentic teammate inside Datadog for development, security, and ops workflows (chat, delegated tasks such as alert investigation). Usage often ties to **AI Credits** — treat as a cost dimension ([11](./11_Cost_Governance_And_Account_Hygiene.md)). Bits **assists**; humans still own pages and incident close ([19](./19_Incident_Workflows_And_Collaboration.md)).

### MCP server & AI Agents console

**Model Context Protocol (MCP)** and agent-console surfaces connect coding agents to Datadog context (metrics, monitors, catalogs). Enable with the same secrets and RBAC discipline as API/application keys ([26](./26_API_Terraform_CLI_And_Account_Admin.md)) — an MCP connection is remote power over your telemetry and config.

**Disconfirm:** LLM traces without prompt/PII policy. Bits auto-closing incidents. MCP with org-admin keys in a laptop agent.

**Confirm:** Eval gates before prod prompt changes? SDS on LLM spans/logs? Who can authorize Bits/MCP actions that mutate monitors?

## 2. Advanced — instrumentation choice, evals, failure modes

**One instrumentation story.** Prefer either Datadog LLM libs **or** OTel export to Datadog ([10](./10_OpenTelemetry_To_Datadog.md)) — dual full export doubles spans and cost. Propagate `env`/`service`/`version` like any APM service so digs cross AI and classical tiers.

**Evals as quality SLOs.** Define failure modes you fear (hallucinated policy, bad tool args, refusal quality). Run offline evals on prompt/model changes; monitor online proxies (user thumbs-down, tool error rate) in prod. Don’t ship prompt edits on vibes alone.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Traces without prompts | Privacy stripping too aggressive — or not instrumented |
| Cost shock | Token metrics unmonitored; unbounded agent loops |
| Bits wrong dig | Missing tags/Catalog ownership; treat as hint not truth |
| MCP leak | Over-scoped app key; no allowlist of tools |

**Cost / security.** Token spend + Datadog LLM ingest + AI Credits stack. Cap agent tool loops; sample high-volume embeddings jobs. Scrub secrets from prompts/completions (SDS + AI Guard). GPU idle still burns cloud cash even when LLM Observability looks fine.

**RBAC.** Separate who can read LLM traces (may contain user content) from who can manage Bits/MCP. Audit Trail for config changes initiated via agents.

## 3. Applications — use cases and staff checklist

**Use case 1 — Support chatbot.** Instrument model + retrieval + tool spans; dashboard latency/error/token cost; monitor tool failure rate; AI Guard on untrusted user text.

**Use case 2 — Prompt change gate.** Dataset + eval for the top failure mode; block prod prompt promote on eval regression; Event on release for correlation ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)).

**Use case 3 — Bits for triage.** On-call uses Bits to summarize a monitor; human verifies against Trace Explorer before mitigation; no auto-close.

**Use case 4 — MCP for eng agents.** Scoped app key (read metrics/monitors only); no mutate permissions until a reviewed workflow exists.

**Staff checklist**

- [ ] One production LLM endpoint traced end-to-end  
- [ ] Token/cost metrics on dashboards and at least one monitor  
- [ ] Eval or online quality signal before prompt/model changes  
- [ ] AI Guard + SDS on LLM telemetry for public apps  
- [ ] Bits/MCP keys scoped; AI Credits watched  
- [ ] Instrumentation choice (DD vs OTel) documented  

**Good:** traces + evals + guardrails + human ownership. **Bad:** prompt PII in traces and Bits closing Sev1s alone.

## References

- [LLM Observability](https://docs.datadoghq.com/llm_observability/) · [LLM Observability setup](https://docs.datadoghq.com/llm_observability/setup/)  
- [Bits AI](https://docs.datadoghq.com/bits_ai/) · [MCP](https://docs.datadoghq.com/bits_ai/mcp_server/) · [AI Guard](https://docs.datadoghq.com/security/ai_guard/)  
- [24 Feature flags / analytics](./24_Feature_Flags_Experiments_And_Product_Analytics.md)
