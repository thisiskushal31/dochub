# 12 — Operations, pitfalls, and staff checklist

[← Previous](./11_Cost_Governance_And_Account_Hygiene.md) · [README](./README.md) · [Next →](./13_Worked_Example_First_Service.md)

## 1. Concepts — failure modes you’ll actually hit

| Failure | What you see | What to do |
|---------|--------------|------------|
| Wrong `site` | API key invalid / no data | Align Agent `site` / `DD_SITE` with the app URL region |
| Stale Agents | Missing features, hard support | Fleet Automation / monthly upgrades (Agent 7 line) |
| Tag explosion | Custom metrics bill spike | Allowlist; remove high-card tags |
| Dual instrumentation | Double traces/metrics | One path: Datadog SDK/SSI **or** OTel |
| Monitor spam | On-call ignores pages | Symptom-first; owners; mutes |
| Logs without scrubbing | PII incident | Scrub at Agent / pipeline |
| No unified tags | Can’t dig across products | Enforce `env`/`service`/`version` |
| Every product on day 1 | Cost + noise | Phase: metrics → APM → logs → RUM/synthetics |
| Datadog as only audit | Compliance gap | Keep cloud audit trails |

**Disconfirm:** More dashboards ⇒ more reliability.

## 2. Advanced

Use Agent flares and status output when opening support tickets. Document expected RPO with the vendor if multi-site DR matters to you—most teams are single-site.

## 3. Applications — staff checklist

- [ ] API keys in a secrets manager; rotation owner named  
- [ ] Agent version policy (and Cluster Agent matched on K8s)  
- [ ] Tag taxonomy + weekly custom-metrics review  
- [ ] Log scrubbing + index retention  
- [ ] Monitor ownership + page route  
- [ ] SLO list matches real user journeys  
- [ ] SDK vs OTel decision written down  
- [ ] Cloud audit / IAM logs still enabled  

## References

- [Agent troubleshooting](https://docs.datadoghq.com/agent/troubleshooting/) · [Account management](https://docs.datadoghq.com/account_management/)  
- [13 Worked example](./13_Worked_Example_First_Service.md)
