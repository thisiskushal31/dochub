# Security Monitoring

## What it is

**Security monitoring** focuses on detecting **malicious or suspicious behavior** and **security-relevant events**. It uses logs, metrics, and alerts to spot attacks, misuse, and policy violations.

## What to capture

- **Authentication** — Failed and successful logins; password changes; MFA events. Many failed logins may indicate brute force.
- **Authorization** — Access to sensitive resources; privilege escalation; denied requests. Unexpected access patterns may indicate compromise.
- **Network and requests** — Unusual volume (e.g. DDoS), strange URLs or payloads, traffic from unexpected regions or IPs.
- **Data access** — Bulk exports, access to PII or secrets, or anomalous read/write patterns.

## What to do with it

- **Log** — Store security events in a dedicated, protected log store with retention for compliance and forensics.
- **Alert** — Trigger on anomalies (e.g. spike in failed logins, first access from a new country, or access to sensitive data at odd hours).
- **Investigate** — Use logs and traces to understand scope and impact of an incident.

**Use case:** Any system with authentication or sensitive data. Combine with [Security — Overview](../security/1-security-overview.md) and general [Monitoring](1-monitoring-overview.md). Ensure monitoring itself is secured (access control, integrity of logs).
