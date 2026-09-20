# 21 — CI Visibility, continuous testing, and delivery gates

[← Previous](./20_Security_Products.md) · [README](./README.md) · [Next →](./22_Observability_Pipelines.md)

## 1. Concepts — pipelines, tests, and release brakes

Delivery health belongs next to production digs: flaky CI and untested checkouts become Sev1s. Datadog’s CI/testing products connect **build truth** to **runtime truth**.

### CI Visibility (Pipeline + Test Visibility)

Unified view of **pipeline** results, duration, flakiness, and reliability across CI providers (GitHub Actions, GitLab, Jenkins, CircleCI, …). Trace which commit broke the build; correlate failed jobs with code owners. The **`datadog-ci`** CLI adds custom tags/measures and command-level traces inside jobs.

**When:** main branch is a bottleneck; flaky tests burn engineer hours; you need DORA-adjacent delivery literacy. **When not:** as proof production is healthy — green CI ≠ SLO.

### Continuous Testing

Codeless / resilient **Synthetic-style** tests (browser recorder, API, mobile, parallel, multi-location) run as **CI batches** against pre-prod. Supports modern protocols (gRPC/WebSocket) and cross-browser where configured. Complements always-on Synthetics ([07](./07_RUM_Synthetics_And_Client_Signals.md)): Continuous Testing gates **before** promote; Synthetics watch **after**.

### Related delivery controls

| Capability | Job |
|------------|-----|
| **Test Optimization / Test Impact Analysis** | Run the tests that matter for a change; cut CI minutes |
| **PR Gates / Deployment Gates** | Block merge/deploy using Datadog signals (tests, security, SLOs) |
| **Continuous Delivery surfaces** | Delivery performance literacy (lead time, fail rate — DORA-adjacent) |
| **Code coverage** | Coverage insights where enabled |
| **IDE plugins** | Shift failures into the editor |

**Disconfirm:** Green CI Visibility ≠ production SLO. Gates without fast feedback ⇒ shadow merges and force-pushes. Test Optimization without a trusted coverage/impact model ⇒ skipped critical tests.

**Confirm:** Which pipelines are instrumented? Who owns flaky-test burn-down? Which signals fail closed vs warn?

## 2. Advanced — correlation, gates, failure modes

**Deploy correlation.** Emit deploy events with `service`/`env`/`version` so APM Deployment Tracking and Watchdog faulty deploys ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)) share identity with CI. Same tags as runtime — or digs lie.

**Quality Gates.** Fail closed only on **proven** signals (critical Continuous Testing suite, known-bad CVE policy). Start warn-only; measure false-block rate; then enforce. PR Gates that take 40 minutes get bypassed — keep gated suites fast.

**Test Optimization.** Requires stable test inventory and good change detection. Exclude flaky tests from “impact skip” until quarantined. Track skipped-vs-failed carefully so optimization doesn’t hide regressions.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Missing pipelines | Provider webhook/API token wrong; only one org instrumented |
| Flake noise | No quarantine process; CI Visibility used as blame tool only |
| Gate bypass culture | Slow suites; unclear owners; no exception policy |
| Double billing | Synthetics + Continuous Testing same journeys without plan |

**Security.** `datadog-ci` and provider tokens are secrets — store in CI secret stores; rotate ([26](./26_API_Terraform_CLI_And_Account_Admin.md)). Don’t put API keys in repo variables unencrypted.

**Cost.** Pipeline spans, test runs, and synthetic CI batches all usage-bill. Instrument main + release pipelines first; sample noisy matrix jobs ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

## 3. Applications — use cases and staff checklist

**Use case 1 — Main pipeline visibility.** Enable Pipeline Visibility on the primary CI; dashboard: duration, fail rate, flake rate; weekly flake triage owned by platform + team leads.

**Use case 2 — Staging checkout gate.** Continuous Testing suite on critical checkout in staging; PR/Deployment Gate warn → then fail closed after two weeks of green.

**Use case 3 — Deploy correlation.** CI job posts deploy event; on-call opens Deployment Tracking when pages fire; Watchdog faulty deploy matches the same `version`.

**Use case 4 — CI minutes cut.** Test Impact Analysis on a large monorepo suite; measure minutes saved vs escaped defects for one quarter before expanding.

**Staff checklist**

- [ ] Pipeline Visibility on the system that ships prod  
- [ ] Flaky tests have a quarantine + owner process  
- [ ] At least one Continuous Testing suite on a critical pre-prod journey  
- [ ] Deploy events with unified tags from CI  
- [ ] Gates: warn-first policy documented; fail-closed list short  
- [ ] `datadog-ci` / provider tokens in secrets manager  

**Good:** CI health + pre-prod tests + correlated deploys. **Bad:** gates that everyone skips; green builds as the only production signal.

## References

- [CI Visibility](https://docs.datadoghq.com/continuous_integration/) · [Testing Visibility](https://docs.datadoghq.com/tests/) · [datadog-ci](https://docs.datadoghq.com/continuous_integration/guides/)  
- [Continuous Testing](https://docs.datadoghq.com/continuous_testing/) · [Synthetic Monitoring](https://docs.datadoghq.com/synthetics/)  
- [Quality Gates](https://docs.datadoghq.com/quality_gates/) · [Test Optimization](https://docs.datadoghq.com/tests/test_impact_analysis/)  
- [22 Observability Pipelines](./22_Observability_Pipelines.md)
