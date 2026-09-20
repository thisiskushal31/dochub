# 20 — Security products

[← Previous](./19_Incident_Workflows_And_Collaboration.md) · [README](./README.md) · [Next →](./21_CI_Visibility_Testing_And_Delivery_Gates.md)

## 1. Concepts — security on the same telemetry plane

**Datadog Security** uses the Agent, logs, traces, and cloud integrations you already run for observability — then adds detection, posture, and protection. It is not a free substitute for **cloud provider audit logs** you must retain for compliance ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

| Product | What it does | Typical owner |
|---------|----------------|---------------|
| **Cloud SIEM** | Real-time threat detection from logs/signals (attack patterns, suspicious identity/IP activity) | SecOps |
| **Cloud Security** | CSPM-style posture + cloud threat/misconfig continuous audit | Cloud security / platform |
| **Workload Protection** | Host/container runtime threats | SecOps / platform |
| **App and API Protection (AAP)** | In-app attacks (SQLi, SSRF, XSS, Log4Shell-class) with Agent + APM context | App sec + service owners |
| **Code Security** | SAST on first-party code + **SCA** on OSS deps (repos and running services); IAST/runtime where offered | App sec / eng |
| **AI Guard** | Inline protections for AI apps/agents (prompt injection, tool abuse, sensitive data) | App sec + AI eng |
| **Sensitive Data Scanner (SDS)** | Discover/classify/redact sensitive data in logs, spans, RUM, events, and optionally cloud storage | Platform + security |

**When to enable what:** SDS early (before broad log ingest). Cloud Security on the primary cloud account. AAP on internet-facing services that already have APM. SIEM when you centralize security log detection in Datadog. AI Guard when LLM/agent apps take untrusted input ([23](./23_LLM_Observability_Bits_AI_And_MCP.md)).

**Disconfirm:** Security products ≠ replacement for cloud audit retention. SRE on-call ≠ automatic owner of every SIEM signal. “CSPM green” ≠ runtime safe.

**Confirm:** Security team owns severity and response playbooks? SDS rules before indexing everything? Availability Sev vs security Sev separated ([19](./19_Incident_Workflows_And_Collaboration.md))?

## 2. Advanced — CNAPP narrative, routing, failure modes

**CNAPP-style combination.** Posture (Cloud Security) + runtime (Workload / AAP) + detection (SIEM) tell a fuller story than any single tile. Identity/entitlement modules under Security evolve — follow current Security docs rather than memorizing SKU names.

**AAP + APM.** Protection needs request context from tracing libraries/Agent. Enable on services with real traffic patterns in staging first; tune to reduce false blocks. Library CVEs from Code Security SCA should feed the same backlog as AAP runtime hits on those packages.

**SDS first.** Finding API keys and PAN in logs after a year of indexing is the expensive failure. Scan pipelines, spans, and RUM; redact or hash; block high-risk patterns from leaving the edge when possible ([05](./05_Logs_Pipelines_And_Indexes.md), [22](./22_Observability_Pipelines.md)).

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| SIEM alert fatigue | Every integration → detection without triage tiers |
| AAP false positives | Untuned rules on noisy endpoints; no staging soak |
| SDS misses | Only one index scanned; RUM/spans skipped |
| Findings with no owner | Not wired to Teams/IDP/Jira |

**Cost / keys.** Security SKUs and scanned GB add up — scope critical accounts/services first ([11](./11_Cost_Governance_And_Account_Hygiene.md)). App keys for security automation need tight RBAC ([26](./26_API_Terraform_CLI_And_Account_Admin.md)).

**Routing.** Findings → Workflow Actions → ticket/Slack for SecOps; critical runtime blocks page security on-call, not every availability engineer. Keep evidence export paths for audits that still need cloud-native logs.

## 3. Applications — use cases and staff checklist

**Use case 1 — SDS on day zero.** Enable Sensitive Data Scanner on log pipelines (and spans if APM is on); fix top findings; make SDS a gate for new indexes.

**Use case 2 — Cloud posture weekly.** Cloud Security on prod account; triage critical misconfigs every week; track reopen rate.

**Use case 3 — Internet API hardening.** AAP on public `checkout`/`login` services with APM; review attacks weekly; link Code Security SCA issues on the same repos.

**Use case 4 — AI app launch.** AI Guard rules + SDS on LLM spans/logs before public traffic; SIEM rule for anomalous token/tool abuse if logs support it.

**Staff checklist**

- [ ] SDS on primary log pipelines before large ingest growth  
- [ ] Cloud Security enabled; critical findings have owners  
- [ ] AAP on at least one internet-facing APM service  
- [ ] Security vs availability paging paths separated  
- [ ] Code Security/SCA backlog owned by eng, not ignored in Datadog UI  
- [ ] Cloud audit retention still satisfied outside Datadog where required  

**Good:** detect + posture + runtime with named security owners. **Bad:** enable every Security tile, page SRE for all of it, skip SDS.

## References

- [Datadog Security](https://docs.datadoghq.com/security/) · [Cloud SIEM](https://docs.datadoghq.com/security/cloud_siem/) · [Cloud Security](https://docs.datadoghq.com/security/cloud_security_management/)  
- [Workload Protection](https://docs.datadoghq.com/security/workload_protection/) · [App and API Protection](https://docs.datadoghq.com/security/application_security/)  
- [Code Security](https://docs.datadoghq.com/security/code_security/) · [Sensitive Data Scanner](https://docs.datadoghq.com/security/sensitive_data_scanner/) · [AI Guard](https://docs.datadoghq.com/security/ai_guard/)  
- [21 CI / testing](./21_CI_Visibility_Testing_And_Delivery_Gates.md)
