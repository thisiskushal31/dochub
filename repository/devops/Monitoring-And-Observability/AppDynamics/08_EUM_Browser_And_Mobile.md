# 08 — EUM browser and mobile

[← Previous](./07_Infrastructure_And_Machine_Agents.md) · [README](./README.md) · [Next →](./09_Database_Visibility_Literacy.md)

## 1. Concepts — End User Monitoring literacy

**End User Monitoring (EUM)** tracks performance from the **user’s viewpoint**—browser apps, mobile apps, and related client surfaces—then helps you troubleshoot client-side and network-request issues ([End User Monitoring](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0)).

APM measures from the app-server entry point; EUM extends visibility to browser rendering, device, carrier, and client-side errors ([Overview of EUM](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/end-user-monitoring/overview-of-end-user-monitoring)).

| Surface | What you learn |
|---------|----------------|
| **Browser RUM** | Page load / Ajax / JS errors from real browsers |
| **Mobile RUM** | Crashes, network requests, mobile UX metrics |
| **IoT monitoring** (literacy) | Device/edge request visibility when in scope |
| **Synthetic Monitoring** | Scripted outside-in probes (separate from RUM) |
| **BT correlation** | Tie EUM network-request events to APM business transactions / snapshots |

**Where data shows up.** EUM appears under the Controller UI **User Experience** tab (browser, mobile, IoT), plus Metric Browser and Analytics surfaces when licensed. EUM data is distinct from app-server APM metrics until you correlate them.

**Correlation.** You can correlate EUM network-request beacons with business-transaction instances (snapshots). Needs APM + EUM licensing, a supported app-server agent on the business app, and EUM instrumentation on the client ([Correlate Business Transactions for EUM](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/end-user-monitoring/correlate-business-transactions-for-eum)).

**Enable correlation (UI path).** Automatic where the agent supports it. Manual path: **Applications → (app) → Settings → Configuration → User Experience App Integration → Enable Business Transaction Correlation**, then on the tier/node **Actions → Configure App Server Agent** set boolean properties `enable-eum` and `enable-eum-cookie` to `true`, apply to all nodes in the tier ([Manually enable](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/end-user-monitoring/correlate-business-transactions-for-eum/manually-enable-business-transaction-correlation)).

**Naming collision rule.** EUM application names and business application names must be **unique across types**—you cannot reuse `E-Commerce` for both a business app and a browser app.

**On-prem note.** Self-hosted Controllers may need a separate **EUM Server** (and Events Service capacity) for EUM data—plan that as platform work, not a browser-snippet-only change ([03](./03_SaaS_Vs_On_Prem_Controller.md), [On-premises](https://help.splunk.com/en/appdynamics-on-premises)). SaaS uses hosted EUM/Events services; still allowlist regional EUM domains.

**Plain language:** APM answers server-side path health; EUM answers “did the human’s browser/app feel slow or broken?” Link them before arguing frontend vs backend.

### Vs synthetics elsewhere

| Approach | Job |
|----------|-----|
| **EUM (RUM)** | Real users, real devices/networks, production truth |
| **AppDynamics Synthetic Monitoring** | Scripted outside-in probes (separate EUM/synthetic plane) |
| **Datadog Synthetics / Elastic Synthetics** | Peer products for probe-based uptime ([Datadog 07](../Datadog/07_RUM_Synthetics_And_Client_Signals.md), [Elastic 08](../Elastic/08_Synthetics_And_Uptime.md)) |

RUM ≠ synthetics. Synthetics catch “region X is down” without users; RUM catches “Safari on flaky mobile networks is sad.” Many estates need both—do not skip APM golden BTs to chase JS widgets first ([15](./15_What_To_Enable_Next_And_When_Not.md)).

**Disconfirm:** Enabling EUM before any APM BT hygiene. Equating a synthetic green check with real-user happiness. Assuming correlation is on without checking User Experience App Integration. Reusing the same name for EUM and business applications.

**Confirm:** EUM app keys / licenses owned? Which web/mobile apps map to which business applications? Correlation tested on one journey?

## 2. Advanced — accounts, keys, injection, and dig order

**EUM accounts, licenses, and app keys.** Client agents need the correct app key for the EUM application; treat keys like secrets. License modules are separate from core APM—budget explicitly ([13](./13_Operations_License_And_Pitfalls.md)).

**Injection literacy (browser).** App-server agents can **automatically** or **assist** inject the JavaScript agent into pages served by instrumented tiers—reducing manual snippet work when correlation/injection is configured. Manual snippet injection remains valid for CDNs/static hosts outside those tiers.

**Experience Journey Map (literacy).** Higher-level user-journey visualization sits on EUM data—enable after basic RUM beacons and BT correlation work.

**ThousandEyes / Accedian integrations (literacy).** Adjacent network-experience products appear in EUM docs; adopt only when network owns the incident class.

**Analytics dependency.** Browser Analyze / Crash Analyze / Network Request Analyze lean on the Events Service; Analytics licensing is separate from EUM except IoT nuances. On-prem: custom metrics for EUM Analytics are **not** supported the same way as SaaS—read current notes before promising parity.

**Dig order under page.** User complaint → **User Experience** page/network timings → correlated BT → snapshot/call graph ([06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)) → infra if the box is sick ([07](./07_Infrastructure_And_Machine_Agents.md)). Skipping correlation produces frontend vs backend blame storms ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

**Privacy / PII.** RUM can capture URLs, headers, and user identifiers depending on config—scrub and retention policy belong in the enable checklist, not a post-incident surprise.

**SaaS egress for EUM.** Browser/mobile agents talk to regional EUM collector/API hosts (`*.eum-appdynamics.com` and related), not only the Controller Tenant URL. Locked-down networks that allowlisted only the Controller often see “APM works, RUM blank” ([03](./03_SaaS_Vs_On_Prem_Controller.md)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| EUM license / app key wrong | No beacons in User Experience |
| Correlation disabled on serving tier | Client slow, no linked BT/snapshot |
| Name collision EUM vs business app | Create/link fails or confuses ownership |
| On-prem EUM Server missing | Snippet “works” locally; Controller never shows RUM |
| SaaS EUM domain blocked | APM fine; RUM silent |
| Auto-injection expected on CDN-only pages | No JS agent; origin APM never injects |

## 3. Applications — when to turn EUM on

| Goal | Pattern |
|------|---------|
| Public web app | Browser RUM after APM BTs stable; enable BT correlation |
| Native mobile | Mobile RUM + crash digs; correlate API calls to BTs |
| SLO for UX | Pair RUM percentiles with golden BT SLIs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)) |
| Probe-only need | Prefer synthetics (AppD or peer) without claiming RUM coverage |
| CDN-fronted site | Manual JS agent on edge assets + correlation on origin tiers |
| Blame-storm prevention | One practiced dig: User Experience → correlated BT → snapshot |

**Staff checklist**

1. Finish app-server agent + golden BTs first ([04](./04_Install_App_Server_Agents.md), [05](./05_Business_Transactions.md)).  
2. Confirm EUM license and create/link the EUM application (unique name).  
3. Inject browser snippet or mobile agent; verify beacons under **User Experience**.  
4. Enable / verify BT correlation on the serving tier (`enable-eum` / cookie props if manual).  
5. Practice one user-complaint dig: EUM → BT → snapshot.  
6. Decide synthetics ownership separately; do not confuse dashboards.  
7. Document PII scrubbing and key rotation for EUM app keys.  
8. Confirm EUM domains allowlisted if SaaS egress is locked down.

## References

- [End User Monitoring 26.8.0](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0) · [Overview of End User Monitoring](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/end-user-monitoring/overview-of-end-user-monitoring) · [Correlate Business Transactions for EUM](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/end-user-monitoring/correlate-business-transactions-for-eum) · [Manually Enable Business Transaction Correlation](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/end-user-monitoring/correlate-business-transactions-for-eum/manually-enable-business-transaction-correlation) · [Browser Monitoring](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/browser-monitoring) · [Mobile Real User Monitoring](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0/mobile-real-user-monitoring)  
- [README](./README.md) · [Datadog RUM/synthetics peer](../Datadog/07_RUM_Synthetics_And_Client_Signals.md) · [09 Database Visibility](./09_Database_Visibility_Literacy.md)
