# 20 — Feature coverage map

[← Previous](./19_Best_Practices_And_When_Not_Flux.md) · [README](./README.md) · [Next: CRD & CLI catalog →](./21_CRD_And_CLI_Catalog.md)

---

## 1. Concepts

Use this page as a **map**: “does Flux have X, and where did we teach it?”  
Full field encyclopedias and every mesh/VCS cookbook stay on official docs.

---

## 2. Advanced — inventory

### Platform & install

| Feature | Chapter |
|---------|---------|
| What / why GitOps | [01](./01_What_Is_Flux_And_GitOps_Toolkit.md) |
| CLI bootstrap & Flux Operator | [04](./04_Install_Bootstrap_And_CLI.md) |
| Day-1 loop | [05](./05_First_Reconcile_And_Day1_Loop.md) |
| Security, WI, air-gap | [12](./12_Security_Identity_And_Air_Gap.md) |
| Tenancy & scale | [16](./16_Scale_Multitenancy_And_Platform_Config.md) |
| Monitoring & upgrade | [15](./15_Monitoring_Events_Metrics_And_Upgrade.md) |

### Sources & delivery

| Feature | Chapter |
|---------|---------|
| Mental model | [02](./02_Core_Concepts_Sources_And_Reconciliation.md) |
| Controllers | [03](./03_Architecture_And_Controllers.md) |
| Git / OCI / Bucket / Helm sources | [06](./06_Sources_Git_OCI_Bucket_Helm.md) |
| ArtifactGenerator | [07](./07_ExternalArtifact_And_ArtifactGenerator.md) |
| Kustomization knobs | [08](./08_Kustomization_Controller.md) |
| HelmRelease knobs | [09](./09_HelmRelease_And_Helm_Delivery.md) |

### Estate & automation

| Feature | Chapter |
|---------|---------|
| Repo / multi-cluster / Jobs | [10](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md) |
| Secrets | [11](./11_Secrets_SOPS_And_Sealed_Secrets.md) |
| Image automation | [13](./13_Image_Update_Automation.md) |
| Alerts & Receivers | [14](./14_Notifications_Alerts_And_Receivers.md) |
| Flagger | [17](./17_Flagger_Progressive_Delivery.md) |

### Craft

| Feature | Chapter |
|---------|---------|
| Lab | [18](./18_Worked_Example_Bootstrap_And_App.md) |
| Judgment | [19](./19_Best_Practices_And_When_Not_Flux.md) |
| Catalog / troubleshoot | [21](./21_CRD_And_CLI_Catalog.md), [22](./22_Troubleshooting_And_Staff_Checklist.md) |

### Leave upstream on purpose

CRD OpenAPI · every bootstrap VCS page · cloud cookbooks · every Flagger mesh tutorial · Flux v1 migration · Go SDK · Operator CRD encyclopedia · AI agent-skills page.

---

## 3. Applications and use cases

For your estate, mark each row: **use / later / N/A**.

---

## References

- [Flux docs](https://fluxcd.io/flux/)  
- [Components](https://fluxcd.io/flux/components/)  
