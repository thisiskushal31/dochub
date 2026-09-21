# 14 — Provisioning, as-code, and GitOps

[← Previous](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md) · [README](./README.md) · [Next →](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)

## 1. Concepts — Git is source of truth

Anything that pages, is shared across teams, or is “source of truth” should not live only as click-ops. **Provisioning** and **as-code** make datasources, dashboards, folders, and alerts **reviewable, repeatable, and recoverable** ([9](../9_Dashboards_Alerts_And_Pages.md)).

| Layer | Typical use |
|-------|-------------|
| **File provisioning** | YAML under `provisioning/` — self-managed OSS/Enterprise |
| **HTTP API + CI** | Upsert by UID with service account tokens |
| **Terraform (Grafana provider)** | Cloud + OSS; broad resource coverage |
| **Grafana Operator** | K8s CRs + Argo CD / Flux |
| **Git Sync / grafanactl** | Cloud-forward or modern CLI sync |
| **Grizzly** | **Removed**—literacy only; do not start new work |

**Plain language:** If Git is not the source of truth, the last person who clicked Save is.

**Disconfirm:** Export JSON once ≠ as-code. Grizzly for greenfield ≠ current path. Three control planes fighting ≠ GitOps.

**Confirm:** Can you recreate prod datasources + paging boards from Git alone? Who approves those PRs?

## 2. Advanced — control planes and drift

**Datasource provisioning.** Fixed UIDs; `$ENV` / `${ENV}` for secrets—never plaintext tokens in Git. `prune` / `deleteDatasources` remove orphans deliberately. Dashboards and correlations key off UIDs ([07](./07_Explore_Correlation_And_Dashboard_Model.md), [10](./10_Implement_Alloy_Datasources_And_Explore.md)).

**Dashboard providers.** Point at folders of JSON (or generated JSON). Provisioned boards are often UI-locked—edits belong in Git. Export once from UI if needed, then stop treating UI as master.

**Terraform.** `grafana_dashboard`, datasource, folder, alert rule, Cloud objects. Store JSON in repo or generate it—review diffs like app code. Prefer when the org already lives in Terraform.

**Operator / GitOps.** Dashboard/Folder/Datasource CRs reconcile continuously. Pair with Argo CD so bad JSON reverts. Fit when Grafana runs on the cluster you already GitOps.

**Alerting as code.** Rules, contact points, and notification policies drift as fast as boards when Grafana Alerting is the page path ([08](./08_Alerting_Boundaries_And_Access_Model.md), [11](./11_Dashboards_Variables_And_First_Alert.md)). Keep them in the same change set as the board they protect.

**RBAC as code.** Provision roles/assignments with Grafana or Terraform so folder permissions do not rot separately ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)).

**Multi-instance promote.** Same UIDs; different URLs/tenants via env substitution. Pin versions on provisioned datasources so older instances do not overwrite newer config.

**Generated dashboards.** Jsonnet / Cue / Foundation SDK-style generators for fleets—still commit reviewable output. Escape literal `$` in secrets as `$$` when env expansion would eat them.

**Failure modes**

| Symptom | Cause |
|---------|-------|
| UI edit vanishes on restart | File-provisioned; change Git |
| Board links break after migrate | Datasource UID changed |
| Terraform fights UI | Dual writers—pick one plane |
| Secret in Git | Value not via env/secret store |

## 3. Applications — pick one plane and apply

### Minimal Git → Grafana loop

```text
Git (datasources.yaml + dashboards/*.json + alerting/)
        → apply (reload | terraform apply | Operator | CI API)
        → Grafana ≈ Git
```

### Starter paths

| Goal | Practical start |
|------|-----------------|
| Stop datasource drift | Provision Prom/Mimir, Loki, Tempo YAML with fixed UIDs |
| Source-of-truth boards | Export overview JSON → repo → provider or Terraform |
| K8s-native GitOps | Grafana Operator CRs in the app/platform repo |
| Cloud-heavy org | Terraform Grafana provider + CI plan on PR |
| Alerting owned | Provision rules + contact points + policies with boards |

### Concrete first as-code week

1. Choose **one** control plane per environment (file provisioning **or** Terraform **or** Operator—not all three).  
2. Export current Prometheus/Loki/Tempo datasources; rewrite with stable UIDs; move secrets to CI/secret store.  
3. Export the service overview dashboard from [12](./12_Worked_Example_First_Grafana_Dig.md); commit JSON; wire provider/Terraform/CR.  
4. Apply to staging; break a panel in Git; confirm reconcile/overwrite behavior.  
5. Add the paging alert + staging contact point to the same PR.  
6. Require PR review for boards/alerts that page or are executive-facing.  
7. Schedule a quarterly “UI-only orphan” audit: import or delete.  
8. Document the apply path (who runs reload / pipeline / Argo).

**Promote:** staging Git tag → prod with same UIDs. A board that only exists in prod is an incident waiting to happen ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

**Staff checklist**

- Datasources + top service dashboards in Git with stable UIDs  
- One control plane per environment  
- Secrets via env/secret store  
- PR review for paging / exec boards  
- Documented apply path; no new Grizzly  
- Drift audit on a schedule  

## References

- [Provision Grafana](https://grafana.com/docs/grafana/latest/administration/provisioning/) · [As code](https://grafana.com/docs/grafana/latest/as-code/) · [Terraform](https://grafana.com/docs/grafana/latest/as-code/infrastructure-as-code/terraform/) · [Grafana Operator](https://grafana.com/docs/grafana/latest/as-code/infrastructure-as-code/grafana-operator/) · [grafanactl](https://grafana.com/docs/grafana/latest/as-code/observability-as-code/grafana-cli/)  
- [11 First alert](./11_Dashboards_Variables_And_First_Alert.md) · [9 Dashboards/alerts/pages](../9_Dashboards_Alerts_And_Pages.md) · [25 Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
