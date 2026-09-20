# 20 — Security products

[← Previous](./19_Incident_Workflows_And_Collaboration.md) · [README](./README.md) · [Next →](./21_CI_Visibility_Testing_And_Delivery_Gates.md)

## 1. Concepts

**Datadog Security** sits on the same telemetry plane as observability: threat detection and configuration audits across apps, hosts, containers, and cloud—with runtime context.

| Product | What it does |
|---------|----------------|
| **Cloud SIEM** | Real-time threat detection from logs/signals (attack patterns, suspicious IPs, …) |
| **Cloud Security** | CSPM-style posture + cloud threat detection / misconfig continuous audit |
| **Workload Protection** | Host/container runtime threats |
| **App and API Protection (AAP)** | In-app attacks (SQLi, SSRF, XSS, Log4Shell-class) using Agent + APM context |
| **Code Security** | SAST on first-party code + **SCA** on OSS deps in repos and running services; IAST/runtime analysis where offered |
| **AI Guard** | Inline protections for AI apps/agents (prompt injection, tool abuse, sensitive data) |
| **Sensitive Data Scanner** | Discover/classify/redact sensitive data in logs, spans, RUM, events, and optionally cloud storage |

**Disconfirm:** Security products ≠ replacement for cloud provider audit logs you must retain ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)). SRE on-call ≠ automatic owner of every SIEM signal.

**Confirm:** Security team owns severity and response? SDS rules before broad log ingest?

## 2. Advanced

CNAPP-style narratives combine posture + runtime. Route findings into developer workflows (IDP/Actions). Identity/entitlement features appear under the Security umbrella—follow current Security docs for IAM-related modules.

## 3. Applications — what to do

1. Enable Sensitive Data Scanner on log pipelines early.  
2. Cloud Security on the primary cloud account; triage critical misconfigs weekly.  
3. AAP on internet-facing services that already have APM.  
4. Keep paging: security Sev vs availability Sev separated.

## References

- [Datadog Security](https://docs.datadoghq.com/security/) · [Cloud SIEM](https://docs.datadoghq.com/security/cloud_siem/) · [Code Security](https://docs.datadoghq.com/security/code_security/) · [AAP](https://docs.datadoghq.com/security/application_security/)  
- [21 CI / testing](./21_CI_Visibility_Testing_And_Delivery_Gates.md)
