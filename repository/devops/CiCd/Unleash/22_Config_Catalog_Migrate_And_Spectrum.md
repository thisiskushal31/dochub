# 22 — Config catalog, migrate, and spectrum

[← Previous](./21_Feature_And_Offering_Coverage_Map.md) · [README](./README.md)

---

## 1. Concepts

This chapter is the **index + doors** page: where settings live, how migrations feel, and how Unleash sits beside the rest of delivery.

### Config catalog (operator index)

| Concern | Where |
|---------|-------|
| Hosting / URL / DB / HTTPS | [03](./03_Install_Hosting_And_Configuration.md) |
| Projects / environments | [05](./05_Projects_Environments_And_Applications.md) |
| Flag + strategies + variants | [06](./06_Feature_Flags_Variants_And_Strategy_Variants.md)–[07](./07_Activation_Strategies_Stickiness_And_Custom.md) |
| Context / segments | [08](./08_Context_Constraints_And_Segments.md) |
| SDK ↔ API choice | [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md)–[11](./11_API_Tokens_Keys_And_Service_Accounts.md) |
| Edge | [10](./10_Edge_Proxy_And_Streaming.md) |
| SSO / RBAC / SCIM | [12](./12_SSO_RBAC_SCIM_And_Provisioning.md) |
| Change requests / release mgmt | [13](./13_Change_Requests_Release_Management_And_Governance.md) |
| Integrations / Terraform | [15](./15_Integrations_Terraform_Webhooks_And_Chatops.md) |
| Compliance | [17](./17_Security_Privacy_And_Compliance.md) |

### OSS vs Enterprise (literacy)

Open Source covers the flag core. Enterprise adds multi-project depth, SSO/SCIM maturity, change requests, advanced Edge, and governance features teams expect at scale. Design process substitutes if you stay OSS ([support comparison](https://docs.getunleash.io/support/oss-comparison)).

---

## 2. Advanced concepts

### Migrating *to* Unleash

From LaunchDarkly / custom toggles / config JSON:

1. Inventory flags and owners  
2. Map environments and targeting to projects/strategies  
3. Dual-run: read old + new, compare evaluations  
4. Cut SDK traffic; retire old  
5. Clean debt immediately  

See official migration guides for checklists.

### Spectrum doors (full delivery)

| Need | Door |
|------|------|
| Behavior release | **Unleash** (this track) |
| Pod / traffic progressive delivery | [Argo_Rollouts/](../Argo_Rollouts/README.md), [9](../9_Progressive_Delivery_Controllers.md) |
| Deploy strategies vocabulary | [3](../3_Deployment_Strategies.md) |
| Forge CI | [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [Jenkins/](../Jenkins/README.md) |
| K8s-native CI | [Tekton/](../Tekton/README.md) |
| GitOps CD | [Argo_CD/](../Argo_CD/README.md), [Flux/](../Flux/README.md) |
| Vendor-neutral flag API | [OpenFeature](https://openfeature.dev/) |
| Classical host deploys | [19](../19_Delivery_Spectrum_Legacy_Through_Modern.md) |

Unleash does not replace CI or GitOps — it sits **after** the binary is (or will be) deployed.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Platform landing zone | Cloud or self-host + Edge + SSO + CR |
| Brownfield flags | Migration dual-run |
| “Which tool?” | Behavior → Unleash; binary → Rollouts |

**Staff checklist**

- SoR for flag definitions clear  
- Edition features matched to process  
- Spectrum doors linked from team runbooks  

**Good:** Unleash + Rollouts + GitOps each with one job. **Bad:** expecting flags to canary pods.

---

## References

- [Feature flag migration](https://docs.getunleash.io/guides/feature-flag-migration-best-practices)  
- [OSS comparison](https://docs.getunleash.io/support/oss-comparison)  
- [Hosting options](https://docs.getunleash.io/deploy/hosting-options)  
- [OpenFeature](https://openfeature.dev/)  
