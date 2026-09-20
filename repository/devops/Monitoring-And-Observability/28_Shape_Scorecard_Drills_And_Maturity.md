# 28 — Shape scorecard, drills, and maturity

[← Previous](./27_Tool_Kinds_By_Job.md) · [README](./README.md) · [Next →](./29_Multi_Env_And_Multi_Tenant_Patterns.md)

## 1. Concepts — is the practice healthy?

A **shape scorecard** checks whether the *practice* works—independent of vendor NPS. **Drills** prove dig paths under stress. **Maturity** is honest staging, not a vanity level badge.

### Scorecard (score 0–2 each: missing / partial / solid)

| Check | Looks at |
|-------|----------|
| SLIs/SLOs on critical paths | [8](./8_SLI_SLO_SLA_And_Error_Budgets.md) |
| Symptom pages + hygiene | [9](./9_Dashboards_Alerts_And_Pages.md)–[10](./10_Alert_Hygiene_And_Burn_Rates.md) |
| Black-box coverage | [5](./5_Black_Box_White_Box_And_Synthetics.md) |
| Label / field contracts | [7](./7_Cardinality_And_Label_Contracts.md) |
| Dig path metric→trace→log | [21](./21_Correlation_And_Dig_Methodology.md) |
| Peer + async coverage | [13](./13_Dependency_And_Peer_Monitoring.md)–[14](./14_Batch_Cron_And_Async_Monitoring.md) |
| Cost owner + retention | [17](./17_Log_Planes_Retention_And_Volume.md), [30](./30_Telemetry_Cost_And_FinOps.md) |
| Observability plane owned | [26](./26_OSS_Managed_SaaS_And_Hybrid.md) |

### Drills

Game day: inject latency/error in staging; time detection and dig; note signal gaps.

**Disconfirm:** High tool spend with low scorecard ≠ mature. “We do chaos” without pages ≠ monitoring maturity.

**Confirm:** Score your estate once. What is the lowest check?

## 2. Advanced — maturity stages (descriptive)

| Stage | Portrait |
|-------|----------|
| 0 | Users report first; no SLOs |
| 1 | Metrics + some pages; noisy |
| 2 | SLOs + dig path; peers/async gaps |
| 3 | Drills; cost control; plane owned |
| 4 | Budgets drive roadmap; rare flappy pages |

Do not weaponize stages in performance review—use them for backlog.

**Failure mode:** Scorecard theater (all 2s on paper) without a timed drill.

## 3. Applications

**Staff checklist**

- Scorecard run per quarter for critical services  
- At least one dig drill per quarter  
- Gaps filed as work, not folklore  

**Exercise:** Run the scorecard in a 30-minute team meeting. Agree on one gap to close this sprint.

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [2 Mindset](./2_Mindset_And_Anti_Patterns.md) · [34 Topologies](./34_Reference_Topologies_End_To_End.md)
