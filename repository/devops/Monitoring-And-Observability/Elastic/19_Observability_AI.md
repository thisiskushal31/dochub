# 19 — Observability AI (assist vs product LLM telemetry)

[← Previous](./18_Security_SIEM_Literacy.md) · [README](./README.md) · [Next →](./20_API_Fleet_Automation_And_RBAC.md)

## 1. Concepts — three different “AI” stories

Elastic Observability has **assistive** AI for diggers, **autonomous triage** experiments, and **product telemetry for LLM/agent apps** you ship. Mixing them is how teams either skip SLOs or skip PII policy.

| Capability | Job | Status literacy |
|------------|-----|-----------------|
| **AI Assistant** (legacy chat) | Chat + contextual insights; ES\|QL help; explain errors | Deprecated toward Agent Builder—version-pin runbooks |
| **Agent Builder** for Observability | Default chat/agent experience; skills/tools; optional Workflows | Prefer this going forward (GA on newer Stack/serverless) |
| **Automatic Import** | Draft custom integrations from sample data | Review mappings before Fleet prod |
| **Nightshift** | Significant Events → auto investigations → memory | **Experimental** (Stack 9.5+ / serverless experimental); Enterprise + Streams + GenAI |
| **LLM / agentic observability** | Metrics/logs for LLM *platforms* + APM traces for *your* LLM apps | Product reliability for AI features—not dig assist |

**Assist (good use):** “Explain this stack trace,” “draft ES|QL for checkout 5xx,” “summarize alert context.”  
**Assist (bad use):** “AI will page us if users are unhappy” with no SLO.  
**Product LLM obs (good use):** token/latency/error dashboards + prompt/response traces for `checkout-assistant`.  
**Product LLM obs (bad use):** treating Azure OpenAI integration metrics as proof the user journey SLO is met without APM.

**Data handling.** Customer data is processed by third-party LLM providers per connector; Elastic states it does not train on your customer data—but **prompts are not anonymized by default** (alerts, logs, configs). Use anonymization pipelines and GenAI settings to restrict connectors/features.

**Disconfirm:** Enabling AI day one before the core dig works ([13](./13_Worked_Example_First_Service.md)). AI answers ⇒ ground truth without checking Discover/APM ([21](./21_Discover_ESQL_And_Kibana_Digs.md)). Nightshift ⇒ owned burn-rate alerts. Same caution as [Datadog Bits AI / LLM Observability](../Datadog/23_LLM_Observability_Bits_AI_And_MCP.md)—assistive and product telemetry are different bills.

**Confirm:** LLM connector approved by security? Privileges scoped? PII policy written? Nightshift experimental accepted by leadership?

## 2. Advanced — Agent Builder, Nightshift, LLM product obs

### Agent Builder vs AI Assistant

Agent Builder is Elastic’s AI platform (chat, built-in/custom agents and tools). On current docs it becomes the **default** Observability chat (e.g. Stack 9.4+ / serverless GA paths); older 9.3 may require opt-in. Built-in Observability skills (investigation, etc.) use the page time picker and can attach Synthetics monitor context. Pair with **Workflows** for deterministic automation (notify, case, isolate)—still not a substitute for SLIs ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

Permission context: searches run as the **current user**—RBAC still applies. Over-privileged chat users pull sensitive indices; under-privileged users get empty answers.

### Nightshift (**experimental**)

Path: **Streams → Significant Events → Nightshift**. Requires Enterprise (or trial), Streams-organized data, GenAI connector.

1. Extracts **Knowledge Indicators** (services, infra, tech) from streams.  
2. Generates/runs ES|QL detection rules; promotes **Significant Events**.  
3. For `critical`/`high`, auto-runs **investigations** (memory read → targeted queries → external tools → hypotheses + remediation *suggestions*—no auto remediations).  
4. Writes findings to **memory** for future investigations.  
5. **Open in chat** attaches event context to the AI Agent.

UI literacy: **Streams → Significant Events → Nightshift**; panels for Needs action / Resolved / Blast radius. Operator impact: rule generation and LLM calls are cost drivers—name an owner and a kill switch ([14](./14_What_To_Enable_Next_And_When_Not.md), [16](./16_Streams_Processors_And_Data_Quality.md)).

### LLM / agentic application observability (product telemetry)

Two delivery methods:

1. **Integrations** — metrics/logs for platforms: Amazon Bedrock (+ AgentCore), Anthropic, Azure AI Foundry, Azure OpenAI, GCP Vertex AI, OpenAI (coverage varies metrics vs logs).  
2. **APM / EDOT tracing** — OTLP traces for apps calling Bedrock, OpenAI, Azure OpenAI, Vertex: model, duration, errors, tokens, prompt/response interaction. Instrument with EDOT SDKs (Python, Node.js, Java, …).

Use OOTB dashboards for performance, usage, and cost. This is **your product’s** LLM reliability—not the Observability AI Assistant chatting about logs.

### Failure modes

| Symptom | Likely cause |
|---------|----------------|
| Hallucinated root cause | Model guessed; verify on trace/log |
| Empty or refused answers | Missing privilege, connector, or index access |
| Nightshift empty | No Streams / KI still warming / wrong license |
| Compliance incident | Logs with secrets sent to LLM |
| Cost spike | Unbounded chat + ML autoscaling + Nightshift rules |
| “LLM dashboard green, users unhappy” | Platform metrics without journey SLO / APM |

Knowledge base / ML nodes (where required) incur cost—treat like any billable add-on ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)). Streams AI processor suggestions share the GenAI connector story—review before prod ([16](./16_Streams_Processors_And_Data_Quality.md)). Prompt text forever is a retention/PII bomb—sample, hash, or drop bodies.

## 3. Applications — use cases and staff checklist

| Use case | Moves |
|----------|-------|
| New engineer on-call | Agent Builder explains alert; human follows dig path ([parent 21](../21_Correlation_And_Dig_Methodology.md), [21](./21_Discover_ESQL_And_Kibana_Digs.md)) |
| ES\|QL fluency gap | Draft query → validate in Discover → save |
| No integration for vendor log | Automatic Import draft → review → Fleet |
| LLM feature launch | EDOT traces + provider integration dashboards + SDS/PII policy |
| Autopilot triage experiment | Nightshift on staging streams first; experimental callout in runbook |
| Prod lockdown | Disable GenAI in prod space; allow in staging |

**Staff checklist:** connector allowlist; GenAI settings reviewed; PII/anonymization policy; AI never sole paging path; version note for Assistant vs Agent Builder; Nightshift marked **experimental** with Enterprise + Streams prerequisites; LLM **product** telemetry owned by the service team separately from dig-assist; cost owner for LLM/ML usage; Significant Events noise reviewed before trusting Nightshift pages.


### Separation cheat-sheet

| Question | Surface |
|----------|---------|
| “Help me write ES\|QL for checkout 5xx” | Agent Builder / Assist |
| “Page me when Significant Events look critical” | Nightshift (**experimental**) — still verify |
| “Is our GPT feature burning tokens / slow?” | LLM app observability (integrations + EDOT) |
| “Is checkout SLO burning?” | SLOs / rules ([09](./09_Alerting_SLOs_And_Incident_Management.md)) — not AI |

If a runbook says only “ask the AI,” rewrite it before the next Sev1.

## References

- [AI for Observability](https://www.elastic.co/docs/solutions/observability/ai/observability-ai) · [Agent Builder](https://www.elastic.co/docs/solutions/observability/ai/agent-builder-observability) · [AI Assistant](https://www.elastic.co/docs/solutions/observability/ai/observability-ai-assistant)  
- [Nightshift](https://www.elastic.co/docs/solutions/observability/nightshift/nightshift) · [Investigations](https://www.elastic.co/docs/solutions/observability/nightshift/investigations) · [Memory](https://www.elastic.co/docs/solutions/observability/nightshift/memory)  
- [LLM observability](https://www.elastic.co/docs/solutions/observability/applications/llm-observability) · [20 API / Fleet / RBAC](./20_API_Fleet_Automation_And_RBAC.md)
