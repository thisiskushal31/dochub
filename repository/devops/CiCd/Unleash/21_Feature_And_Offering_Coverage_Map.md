# 21 — Feature and offering coverage map

[← Previous](./20_Best_Practices_And_When_Not_Unleash.md) · [README](./README.md) · [Next: Catalog & spectrum →](./22_Config_Catalog_Migrate_And_Spectrum.md)

---

## 1. Concepts

Inventory of **offering classes** Unleash documents → this track. Use it in reviews: every major surface should map to a chapter.

```mermaid
flowchart TB
  UI[Admin UI]
  API[Admin / Client / Frontend / Edge APIs]
  SDK[Backend + Frontend SDKs]
  EDGE[Edge / Proxy]
  GOV[SSO RBAC SCIM CR]
  INT[Terraform Webhooks Chatops]
  AI[MCP / assistants]
  UI --> API
  SDK --> API
  EDGE --> API
  GOV --> UI
```

---

## 2. Advanced concepts

### A. Core product

| Offering | Track |
|----------|-------|
| Feature flags / types / lifecycle | [01](./01_What_Is_Unleash_And_Feature_Flags.md), [06](./06_Feature_Flags_Variants_And_Strategy_Variants.md) |
| Projects / environments / applications | [05](./05_Projects_Environments_And_Applications.md) |
| Activation strategies / stickiness / custom | [07](./07_Activation_Strategies_Stickiness_And_Custom.md) |
| Context / constraints / segments | [08](./08_Context_Constraints_And_Segments.md) |
| Strategy variants / A/B | [06](./06_Feature_Flags_Variants_And_Strategy_Variants.md) |

### B. Architecture and clients

| Offering | Track |
|----------|-------|
| Server / Admin UI / evaluation model | [02](./02_Architecture_Server_SDK_Edge_And_APIs.md) |
| Admin / Client / Frontend / Edge APIs | [02](./02_Architecture_Server_SDK_Edge_And_APIs.md) |
| Backend vs frontend SDKs / OpenFeature | [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md) |
| Edge, Proxy migration, streaming | [10](./10_Edge_Proxy_And_Streaming.md) |
| API tokens / service accounts | [11](./11_API_Tokens_Keys_And_Service_Accounts.md) |

### C. Deploy and operate

| Offering | Track |
|----------|-------|
| Hosting / Docker / Cloud / HTTPS / config | [03](./03_Install_Hosting_And_Configuration.md) |
| Scale / upgrade / sync / troubleshoot | [18](./18_Scale_Upgrade_Operate_And_Troubleshoot.md) |
| First loop / gradual rollout lab | [04](./04_First_Flag_SDK_And_Toggle_Loop.md), [19](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md) |

### D. Identity and governance

| Offering | Track |
|----------|-------|
| SSO / RBAC / SCIM / provisioning | [12](./12_SSO_RBAC_SCIM_And_Provisioning.md) |
| Change requests / release templates / signals / actions | [13](./13_Change_Requests_Release_Management_And_Governance.md) |
| Impression / insights / impact / playground | [14](./14_Impression_Analytics_Impact_And_Playground.md) |

### E. Integrate, AI, compliance

| Offering | Track |
|----------|-------|
| Terraform / webhooks / Slack / Jira / Datadog / toolbar | [15](./15_Integrations_Terraform_Webhooks_And_Chatops.md) |
| MCP / coding assistants / AI feature flags | [16](./16_AI_Assistants_MCP_And_Assisted_Delivery.md) |
| Privacy / SOC2 / ISO / FedRAMP literacy | [17](./17_Security_Privacy_And_Compliance.md) |
| Judgment / debt / when not | [20](./20_Best_Practices_And_When_Not_Unleash.md) |
| Migrate / OSS vs Ent / spectrum doors | [22](./22_Config_Catalog_Migrate_And_Spectrum.md) |

### F. Intentionally upstream

| Surface | Why |
|---------|-----|
| Every per-language SDK reference page | Pin and read the language you ship |
| Language-specific tutorial encyclopedias | Upstream guides; model in [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md) |
| Learning Lab marketing paths | Optional training UX |
| Contribute / Fern internals | Contributor path |
| Enterprise-only click-path encyclopedias | Edition + vendor UI drift |
| Exact OpenAPI dumps per release | Generated; version-specific |

---

## 3. Applications and use cases

Walk **A–E** for your estate: **use / later / N/A**. Gaps in tokens (B), governance (D), and Edge (B) beat collecting more SDK languages.

**Staff checklist**

- Coverage map reviewed at platform design time  
- Upstream exceptions understood (F)  

**Good:** every prod surface has a chapter owner. **Bad:** “we use Unleash” with no Edge/token/CR story.

---

## References

- [Docs home](https://docs.getunleash.io/)  
- [Concepts](https://docs.getunleash.io/concepts)  
- [OSS comparison](https://docs.getunleash.io/support/oss-comparison)  
