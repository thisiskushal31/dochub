# 8 — SLI, SLO, SLA, and error budgets

[← Previous](./7_Cardinality_And_Label_Contracts.md) · [README](./README.md) · [Next →](./9_Dashboards_Alerts_And_Pages.md)

## 1. Concepts — define “good” before you graph

| Term | Meaning | Audience |
|------|---------|----------|
| **SLI** (service level indicator) | The measurement of user happiness you chose | Eng + SRE |
| **SLO** (service level objective) | Target for that SLI over a window (e.g. 99.9% / 30d) | Eng + product |
| **SLA** (service level agreement) | External/contractual promise (often looser than SLO) | Legal / customers |
| **Error budget** | Allowed unreliability ≈ 1 − SLO | Shared decision fuel |

```text
SLI = good_events / valid_events
SLO = SLI ≥ target over window
Budget = 1 − target  (spent by bad_events)
```

**Sketch:** SLI = successful HTTP requests / valid requests; SLO = 99.9% over 30 days; fast burn → page; slow burn → reliability work instead of features.

**Exclusions matter:** health checks, known bot abuse, 401s from bad clients—document what is *valid*.

**Disconfirm:** Green CPU graphs ≠ SLO. Hitting SLO while checkout users suffer = wrong SLI. SLA marketing number ≠ internal SLO.

**Confirm:** Draft one SLI and SLO for an HTTP API. What consumes budget? What pages on fast burn?

## 2. Advanced — windows, multi-SLO, and culture

**Windows:** rolling 30d is common; shorter windows catch recent pain; multi-window burn rates pair short+long ([10](./10_Alert_Hygiene_And_Burn_Rates.md)).

**Availability vs latency:** separate SLOs (e.g. success ratio and fraction of requests faster than 300ms). One number cannot express both.

**Dependency budgets:** if payment peer burns, decide whether it spends *your* budget (usually yes for user-visible) and how you classify external dependency SLOs ([13](./13_Dependency_And_Peer_Monitoring.md)).

**Culture:** budgets only work if burning them changes roadmap priority. Door for team practice: [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md) via [32](./32_On_Call_And_Human_Loop_Door.md).

**Failure mode:** 99.99% SLO with no measurement fidelity or with tiny traffic → meaningless burn alerts.

## 3. Applications

**Staff checklist**

- Critical user journey has a written SLI/SLO (not only “three nines” folklore)  
- Exclusions documented  
- Burn alerts exist; feature vs reliability trade-off named when budget is spent  

**Exercise:** Compute how many bad requests a 99.9% / 30d SLO allows at your QPS. Does that match intuition?

## References

- [Google SRE — Service level objectives](https://sre.google/sre-book/service-level-objectives/)  
- [10 Alert hygiene / burn](./10_Alert_Hygiene_And_Burn_Rates.md) · [9 Dashboards / pages](./9_Dashboards_Alerts_And_Pages.md)
