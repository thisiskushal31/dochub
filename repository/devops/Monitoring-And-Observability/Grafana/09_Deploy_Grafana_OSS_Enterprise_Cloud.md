# 09 — Deploy Grafana: OSS, Enterprise, and Cloud

[← Previous](./08_Alerting_Boundaries_And_Access_Model.md) · [README](./README.md) · [Next →](./10_Implement_Alloy_Datasources_And_Explore.md)

## 1. Concepts — stand up the glass

This chapter is the Grafana **server** (UI, proxy, alert engine, optional renderer)—not Mimir/Loki/Tempo sizing. Choose **who hosts the glass** and **how durable the config DB is** before inviting the org ([02](./02_Architecture_UI_Datasources_And_Plugins.md), [03](./03_LGTM_Stack_And_Collector_Generations.md)).

| Shape | You get | You own |
|-------|---------|---------|
| **Grafana Cloud** | Hosted Grafana (+ optional hosted LGTM) | Tenancy, SSO, usage, dig culture |
| **OSS package / binary** | Full control on VM | OS, upgrades, TLS, backup |
| **Docker** | Fast parity with docs images | Named volume; not “set and forget” |
| **Kubernetes + Helm** | Ops-native rollouts | Chart values, ingress, PDB, DB |
| **Enterprise on self-managed** | Enterprise plugins/support on *your* HA | Same ops as OSS + license literacy |

**sqlite vs MySQL/PostgreSQL.** SQLite = eval / tiny demos. MySQL 8+ or PostgreSQL 12+ = production and **required** for HA. Grafana stores users, boards, datasources, alert rules here—not your Prom series. Migrating sqlite → Postgres later is customer pain; choose early.

**Disconfirm:** Docker without a volume ≠ durable. sqlite + two replicas ≠ HA. Cloud free tier ≠ unlimited LGTM forever.

**Confirm:** Cloud or self-managed? Which config DB? Who upgrades? HA yes/no? Where do datasource secrets live?

## 2. Advanced — HA, sizing, Enterprise vs Cloud

**Sizing drivers (Grafana process only):** concurrent users, alert-rule count/interval, proxied SQL datasources, panel count × refresh. Official Small/Medium/Large tiers start ~2 cores / 2–4 GB and scale to multi-instance with dedicated renderers—validate with *your* boards.

**HA shape:** 2+ Grafana instances behind a load balancer, **shared** MySQL/Postgres, sticky sessions **or** Redis session store. Alerting HA needs extra steps so notifications are not duplicated—read current Alerting HA docs before flipping the LB.

**Enterprise vs Cloud.** Enterprise = self-managed commercial edition. Cloud = SaaS. Many Enterprise features appear on paid Cloud; do not buy both without a reason ([01](./01_What_Is_Grafana_And_When.md)).

**Image rendering.** Heavy; often a separate renderer service (~1 GB RAM per worker). Isolate before blaming “Grafana is slow.”

**Brownfield → Cloud.** Export boards / use migration tooling; remap datasource UIDs; freeze self-managed writes; cut DNS/SSO last. Keep a rollback window ([14](./14_Provisioning_As_Code_And_GitOps.md)).

## 3. Applications — concrete first paths

**Path A — Grafana Cloud (fastest glass)**

1. Create stack / instance in Grafana Cloud.  
2. Note Prometheus/Loki/Tempo endpoints + API keys ([Mimir](../Mimir/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md)).  
3. Point Alloy at Cloud (or follow Cloud agent instructions) ([10](./10_Implement_Alloy_Datasources_And_Explore.md)).  
4. Open Explore; confirm series.  
5. Configure SSO before inviting the org ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)).

**Path B — Self-managed single node (lab → small prod)**

1. Install via official package or Docker with a **named volume** for `/var/lib/grafana`.  
2. Set `GF_SECURITY_ADMIN_PASSWORD` (or change admin immediately).  
3. Beyond eval: configure `[database]` to Postgres/MySQL in `grafana.ini` / env.  
4. TLS at ingress or Grafana HTTPS settings.  
5. Add datasources; backup the DB before the first real dig ([10](./10_Implement_Alloy_Datasources_And_Explore.md)).

**Path C — Kubernetes**

1. Official Helm chart; pin image tag explicitly.  
2. External Postgres (or Cloud SQL) via values—not emptyDir sqlite.  
3. Ingress + cert-manager; resource requests matching tier.  
4. PDB + multiple replicas only after shared DB + session strategy.  
5. Separate renderer Deployment when boards need PNG/Slack images.

| Failure mode | Mitigation |
|--------------|------------|
| Ephemeral container DB | Volume + external DB |
| sqlite under load | Postgres/MySQL |
| HA without shared DB | One DB; LB; Redis/sticky sessions |
| Renderer on same pod | Split renderer fleet |
| Blind upgrade | Stage; pin plugins; changelog |


**Ops notes after first boot.** Change the default admin password (or disable local admin after SSO). Restrict anonymous access. Confirm the Grafana version and plugin allow-list match what you pinned in Git. Schedule a restore drill of the config DB within the first week—boards and alert rules live there, not in Mimir ([14](./14_Provisioning_As_Code_And_GitOps.md)).

**When to stop.** Do not invite the whole company until Explore returns data from Alloy ([10](./10_Implement_Alloy_Datasources_And_Explore.md)). A pretty empty Grafana trains bad dig habits.

**Cross-links.** Stack shape and collector generations: [03](./03_LGTM_Stack_And_Collector_Generations.md) · [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md). Parent SLO framing once boards exist: [8](../8_SLI_SLO_SLA_And_Error_Budgets.md).

**Staff checklist**

- Deploy shape chosen (Cloud vs self-managed)  
- Config DB chosen (not sqlite for prod)  
- Backup/restore tested for Grafana DB  
- Admin auth hardened; SSO plan  
- HA written or explicitly single-node  
- Renderer strategy decided; upgrade owner named  
- Next step booked: Alloy + datasources ([10](./10_Implement_Alloy_Datasources_And_Explore.md))—not inviting the company yet  


Docs hubs stay current; prefer `latest` links in References and re-check HA/SSO details before prod cutover.

## References

- [Install Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) · [Docker](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/) · [Helm](https://grafana.com/docs/grafana/latest/setup-grafana/installation/helm/) · [High availability](https://grafana.com/docs/grafana/latest/setup-grafana/set-up-for-high-availability/) · [Grafana Cloud](https://grafana.com/docs/grafana-cloud/)  
- [02 Architecture](./02_Architecture_UI_Datasources_And_Plugins.md) · [10 Alloy + datasources](./10_Implement_Alloy_Datasources_And_Explore.md) · [25 Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
