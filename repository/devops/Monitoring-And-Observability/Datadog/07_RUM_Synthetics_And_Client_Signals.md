# 07 — RUM, synthetics, and client signals

[← Previous](./06_APM_Tracing_And_Correlation.md) · [README](./README.md) · [Next →](./08_Monitors_SLOs_And_Dashboards.md)

## 1. Concepts — users and probes

### Real User Monitoring (RUM)

Sees **real** browser/mobile sessions: performance, errors, usage, and support digs. A session bundles views, actions, resources, and errors. Official limits include max session length **4 hours**, idle timeout **15 minutes**, and intake size caps—over-limit events are dropped.

**Session Replay** plays back web sessions. Mask passwords and PII before wide enablement.

### Synthetics

**Simulated** checks: API, browser, mobile, network-path tests from managed or **private locations**. Use for SLO probes and CI gates. Link failures to APM traces when configured.

| Question | Use |
|----------|-----|
| What are users experiencing? | RUM |
| Is the critical journey up from region X? | Synthetics |
| Concept jobs | [5](../5_Black_Box_White_Box_And_Synthetics.md), [37](../37_Client_RUM_Coverage_And_EBPF_Amplifiers.md) |

**Product Analytics** and **Journey Monitoring** build on client events for funnels and adoption ([24](./24_Feature_Flags_Experiments_And_Product_Analytics.md))—often share RUM SDK setup.

**Disconfirm:** Synthetics green ⇒ users happy. Replay without a privacy review. RUM as a substitute for APM.

**Confirm:** Which journeys are synthetic SLOs? Is RUM sampling/privacy approved by legal?

## 2. Advanced — private locations, CI, correlation

**Private locations** run synthetics against internal apps. Size capacity like any worker fleet.

**CI batches** run Continuous Testing suites in pipelines ([21](./21_CI_Visibility_Testing_And_Delivery_Gates.md)). Flaky browser tests need ownership or they train people to ignore red.

**Correlation.** Browser tests ↔ APM header injection; RUM ↔ backend traces with matching `service`/`env`. Session Replay storage and retention are cost and privacy dimensions—treat like logs.

Mobile RUM (iOS/Android) has its own SDK setup and mapping-file limits—follow current mobile docs.

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| Outside-in SLO | Synthetic API check on `/health` or login from two regions |
| Checkout UX | Browser synthetic + RUM on staging; mask PII; link to APM |
| Support ticket | RUM session + Replay for one user; then backend trace |
| Privacy rollout | Staging Replay with masking → legal sign-off → prod sample rate |

**Staff checklist:** mask sensitive inputs; private location capacity; synthetic failure → monitor sparingly; RUM `service`/`env` aligned with APM.

## References

- [RUM](https://docs.datadoghq.com/real_user_monitoring/) · [Session Replay](https://docs.datadoghq.com/real_user_monitoring/session_replay/) · [Synthetics](https://docs.datadoghq.com/synthetics/)  
- [08 Monitors](./08_Monitors_SLOs_And_Dashboards.md)
