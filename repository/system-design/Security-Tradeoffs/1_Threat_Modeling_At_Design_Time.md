# Threat modeling at design time

[← security-tradeoffs](./README.md)

Run a threat model when you add a **trust boundary**, a **new data class**, or a **new public/partner flow** — not only after the first incident.

## When to threat-model

| Trigger | Example |
|---------|---------|
| New service | Greenfield API behind a gateway |
| New data flow | Analytics export of PII |
| New trust boundary | Vendor webhook, mobile client, admin console |
| Major redesign | Split monolith; multi-tenant |

Light STRIDE vocabulary: [Security-Deep-Dive Foundations/2](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Foundations/2_STRIDE_And_Threat_Modeling.md). This page is the **HLD habit**.

## STRIDE on common components

| Component | Spoof | Tamper | Repudiate | Info disc. | DoS | EoP |
|-----------|-------|--------|-----------|------------|-----|-----|
| API gateway | Fake clients | Rewrite routes | Missing access logs | Verbose errors | Cheap floods | Admin API exposure |
| App service | Stolen tokens | Patch binaries / configs | No audit of writes | Over-fetch | Hot endpoints | Confused deputy |
| Queue | Spoof producers | Poison messages | No producer ID | Payload leaks in DLQ | Flood queue | Consumer privilege |
| Cache | — | Poison cache | — | Sensitive keys in Redis | Eviction storms | Shared tenant keys |
| DB | Stolen creds | Unauthorized writes | Missing row audit | Broad SELECT | Expensive queries | Over-privileged role |

Annotate the HLD: **trust boundaries** and **data classification** on each arrow.

## Abuse cases beyond “hackers”

Fraud, scrapers, angry insiders, misbehaving partners, and automation bugs. Capture them as misuse cases next to user stories.

## Worked sketch — URL shortener

| Threat | Mitigation |
|--------|------------|
| Open redirect via short link | Allowlist destinations; malware URL checks |
| Enumeration of codes | Long unguessable IDs; rate limit resolve |
| Defacement of landing metadata | AuthZ on update; audit log |
| DoS on resolve path | Cache; rate limit; CDN |

Output: prioritized mitigations → [Security/](../Security/README.md) patterns + pipeline gates in DevOps-Handbook.

## Validation checklist (pre-launch)

- [ ] Data class labeled on stores and egress  
- [ ] Authn/z called out on every external edge  
- [ ] Logging/audit on privileged actions  
- [ ] Rate limits / quotas on expensive paths  
- [ ] Secrets not in the diagram as “config files in git”  

## Cross-references

- [Fundamentals/13_API_Gateway.md](../Fundamentals/13_API_Gateway.md) · [Cases/](../Cases/README.md)
