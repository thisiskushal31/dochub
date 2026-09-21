# 12 — Worked example — first Grafana dig

[← Previous](./11_Dashboards_Variables_And_First_Alert.md) · [README](./README.md) · [Next →](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)

## 1. Concepts — one thin vertical slice

Ship one service end-to-end. Prefer **path A** (greenfield Alloy). Use **path B** only if you inherit Grafana Agent ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)).

```text
App /metrics + logs (+ optional OTLP traces)
        → Grafana Alloy
        → Mimir/Prometheus + Loki (+ Tempo)
        → Grafana Explore → one dashboard → one alert
```

**Done when:** you can break staging, see the signal in Explore, open the overview board, and get **one** test notification—without guessing label names. Time-box the dig to about fifteen minutes ([21](../21_Correlation_And_Dig_Methodology.md)).

**Disconfirm:** Enabling IRM/Assistant/Beyla before Explore works ([16](./16_What_To_Enable_Next_And_When_Not.md)). Dual Agent + Alloy scrape. Pages to an unnamed channel.

**Confirm:** Shared `service`/`env` on metrics and logs? Alloy owns collection when Done? Staging contact point proven?

## 2. Advanced — pitfalls during the lab

| Pitfall | Fix |
|---------|-----|
| Convert Agent with `--bypass-errors` to prod | Review report; staging first ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)) |
| Datasource UID drift | Pin UIDs in provisioning ([14](./14_Provisioning_As_Code_And_GitOps.md)) |
| Label mismatch metrics vs logs | Fix contract before more panels ([06](./06_Topologies_And_Signal_Pipelines.md)) |
| Alert before Explore works | Finish dig drill; then one rule ([11](./11_Dashboards_Variables_And_First_Alert.md)) |
| Flappy staging page | Widen threshold; lengthen pending ([10](../10_Alert_Hygiene_And_Burn_Rates.md)) |
| Empty Tempo jump | Wire derived fields / exemplars after metrics+logs work ([07](./07_Explore_Correlation_And_Dashboard_Model.md)) |

**Stop conditions.** Abort growth if: (1) labels differ across signals, (2) dig exceeds fifteen minutes twice, (3) Agent still scrapes the same targets as Alloy, (4) pages hit an unnamed channel.

## 3. Applications — lab steps

### Shared path (after collector is Alloy)

1. **Glass + backends** — Grafana Cloud **or** self-managed Grafana + Mimir/Prom + Loki (+ Tempo) ([09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md), [Mimir](../Mimir/README.md), [Loki](../Loki/README.md), [Tempo](../Tempo/README.md)).  
2. **Collector** — Path A: install Alloy. Path B: migrate Agent → Alloy, stop Agent ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)).  
3. **Metrics** — scrape app + node → relabel (`service`, `env`, `cluster`) → `prometheus.remote_write` ([Prometheus](../Prometheus/README.md)).  
4. **Logs** — tail pods/journal → process → `loki.write`.  
5. **Traces (optional week one)** — OTLP → Alloy → Tempo; enable Loki↔Tempo links.  
6. **Datasources** — Prometheus/Mimir, Loki, Tempo with stable UIDs ([10](./10_Implement_Alloy_Datasources_And_Explore.md)).  
7. **Explore** — PromQL `up` or error ratio; LogQL by `service`/`env`; confirm labels match.  
8. **One dashboard** — overview RED panels with `$service`/`$env` ([11](./11_Dashboards_Variables_And_First_Alert.md)).  
9. **One alert** — single page path; contact point = staging Slack ([08](./08_Alerting_Boundaries_And_Access_Model.md)).  
10. **Dig drill** — inject failure → Explore → board → notification.  
11. **SLO literacy** — name the SLI this board/alert protects; formal SLO can wait a week ([8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).  
12. **Teach-back** — second engineer repeats hops without the first in the room.

### Path B detail (Agent → Alloy)

1. Inventory: Static YAML vs Flow River vs Operator.  
2. Convert or live-migrate per [Alloy migrate](https://grafana.com/docs/alloy/latest/set-up/migrate/).  
3. Diff flags (`--storage.path`, HTTP listen, stability, classic modules → `import.*`).  
4. Cut traffic: stop Agent; confirm Alloy export healthy.  
5. Continue shared steps 3–12.

### Prove it

| Inject | Expect |
|--------|--------|
| Stop app | `up` gap; logs show restart |
| Force 5xx | Explore error ratio; optional trace |
| Break Alloy egress | Collector meta-metrics show export failures—not silent success |

**Prod cutover gate.** Staging dig green; Agent dual-scrape gone; retention sane; real on-call only after staging contact point proven; 7-day ingest review on the calendar—then promote. Skip IRM/Assistant/Beyla until week two ([16](./16_What_To_Enable_Next_And_When_Not.md)). Link the lab in onboarding.


**Teach-back script (10 minutes).** Second engineer: open the test notification → Explore the firing series → jump to logs with the same `service`/`env` → name the Alloy component that remote_writes. If any hop is tribal knowledge, the lab is not done ([21](../21_Correlation_And_Dig_Methodology.md)).

**Retro (15 minutes).** What broke (auth, labels, dual-scrape)? Owner names for glass, collector, backends, pages. Next enable only from [16](./16_What_To_Enable_Next_And_When_Not.md)—not feature sprawl the same afternoon.

**Parent framing.** Boards and pages exist to protect SLIs ([8](../8_SLI_SLO_SLA_And_Error_Budgets.md), [9](../9_Dashboards_Alerts_And_Pages.md)); alert hygiene after the first page ([10](../10_Alert_Hygiene_And_Burn_Rates.md)).

**Staff checklist**

- Path A or B chosen and drawn  
- Alloy owns collection when Done  
- Metrics + logs in Explore with shared labels  
- One overview dashboard + one tested alert path  
- Teach-back done; next enable from [16](./16_What_To_Enable_Next_And_When_Not.md) only after Done  
- Agent freeze documented if any Agent remains ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md))  
- Join keys written in the runbook  

## References

- [Alloy](https://grafana.com/docs/alloy/latest/) · [Migrate to Alloy](https://grafana.com/docs/alloy/latest/set-up/migrate/) · [Grafana Explore](https://grafana.com/docs/grafana/latest/explore/)  
- [10 Implement](./10_Implement_Alloy_Datasources_And_Explore.md) · [11 Boards/alerts](./11_Dashboards_Variables_And_First_Alert.md) · [21 Dig methodology](../21_Correlation_And_Dig_Methodology.md) · [25 Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
