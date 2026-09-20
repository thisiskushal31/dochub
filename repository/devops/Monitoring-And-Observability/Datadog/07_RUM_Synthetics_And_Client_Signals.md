# 07 — RUM, synthetics, and client signals

[← Previous](./06_APM_Tracing_And_Correlation.md) · [README](./README.md) · [Next →](./08_Monitors_SLOs_And_Dashboards.md)

## 1. Concepts

### Real User Monitoring (RUM)

Sees **real** browser/mobile sessions: performance, errors, usage, and support digs (what one user did). A session bundles views, actions, resources, and errors. Official limits include max session length **4 hours**, idle timeout **15 minutes**, and intake size caps—over-limit events are dropped.

**Session Replay** plays back web sessions; mask passwords and PII before you enable it widely.

### Synthetics

**Simulated** checks: API, browser, mobile, network-path tests from managed or **private locations**. Use for SLO probes and CI gates. Link failures to APM traces when configured.

| Question | Use |
|----------|-----|
| What are users experiencing? | RUM |
| Is the critical journey up from region X? | Synthetics |
| Concept jobs | [5](../5_Black_Box_White_Box_And_Synthetics.md), [37](../37_Client_RUM_Coverage_And_EBPF_Amplifiers.md) |

**Disconfirm:** Synthetics green ⇒ users happy. Replay without a privacy review.

**Confirm:** Which journeys are synthetic SLOs? Is RUM sampling approved?

## 2. Advanced

Private locations for internal apps. Browser tests ↔ APM header injection for end-to-end digs. Organize tests into suites; run batches in CI when Continuous Testing is in scope ([14](./14_What_To_Enable_Next_And_When_Not.md)).

## 3. Applications — what to do

1. Add one synthetic API check on the health/login endpoint.  
2. Add RUM to staging with masking defaults.  
3. Wire synthetic failure → monitor → page sparingly.

## References

- [RUM](https://docs.datadoghq.com/real_user_monitoring/) · [Synthetics](https://docs.datadoghq.com/synthetics/)  
- [08 Monitors](./08_Monitors_SLOs_And_Dashboards.md)
