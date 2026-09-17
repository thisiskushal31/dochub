# Unleash

[← Back to CI/CD](../README.md)

**Unleash** is an open-source **feature management** platform: you ship binaries on your deploy schedule, then control **who sees what behavior** at runtime via **feature flags** (toggles), activation strategies, and SDKs. Evaluation is designed to happen **locally in the SDK** (or at **Edge**), not as a synchronous call to the Unleash server on every request.

This folder is a **standalone deep dive** into what Unleash offers and how you operate it — not a second progressive-delivery controller course (that lives in [Argo_Rollouts/](../Argo_Rollouts/README.md)) and not Kubernetes internals ([Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive)). Vendor-neutral app API door: [OpenFeature](https://openfeature.dev/). Concepts: [3](../3_Deployment_Strategies.md), [9](../9_Progressive_Delivery_Controllers.md), [Methodologies/2](../../Methodologies/2_Practices_And_Workflows.md).

Someone who knows nothing about Unleash should leave able to:

- Explain **deploy ≠ release** and when flags beat (or pair with) canary controllers  
- Install or adopt hosted Unleash; create a first flag and SDK loop  
- Model projects, environments, strategies, context, segments, variants  
- Choose backend vs frontend SDKs, Edge vs Proxy, OpenFeature providers  
- Wire tokens, SSO/RBAC/SCIM, change requests, and integrations  
- Name compliance, scale, AI/MCP literacy, and find them in the [coverage map](./21_Feature_And_Offering_Coverage_Map.md)  
- Look up **SDK methods** ([09](./09_SDKs_Backend_Frontend_And_OpenFeature.md)) and **every Admin/Client/Frontend/Edge endpoint** ([23](./23_Admin_Client_Frontend_And_Edge_APIs.md)) without installing first  
- Run gradual rollout / kill-switch patterns with CI/CD  
- Know when **not** to use flags (permanent debt, secrets, unfinished migrations alone)  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Unleash_And_Feature_Flags.md)–[04](./04_First_Flag_SDK_And_Toggle_Loop.md) | Product; architecture; install; first loop |
| Authoring | [05](./05_Projects_Environments_And_Applications.md)–[08](./08_Context_Constraints_And_Segments.md) | Organize; flags; strategies; targeting |
| Clients & edge | [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md)–[11](./11_API_Tokens_Keys_And_Service_Accounts.md) | SDKs; Edge; tokens |
| Govern & integrate | [12](./12_SSO_RBAC_SCIM_And_Provisioning.md)–[16](./16_AI_Assistants_MCP_And_Assisted_Delivery.md) | Identity; CR; analytics; integrations; AI |
| Operate & craft | [17](./17_Security_Privacy_And_Compliance.md)–[23](./23_Admin_Client_Frontend_And_Edge_APIs.md) | Security; ops; lab; judgment; inventory; spectrum; HTTP APIs |

Suggested order: **01 → 23**. After **04**, jump to **19** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Unleash](./01_What_Is_Unleash_And_Feature_Flags.md) | Flags; deploy≠release |
| 02 | [Architecture](./02_Architecture_Server_SDK_Edge_And_APIs.md) | Server, SDKs, Edge, APIs |
| 03 | [Install and hosting](./03_Install_Hosting_And_Configuration.md) | Docker; Cloud; config |
| 04 | [First flag and SDK](./04_First_Flag_SDK_And_Toggle_Loop.md) | First lab loop |
| 05 | [Projects and environments](./05_Projects_Environments_And_Applications.md) | Organize |
| 06 | [Flags and variants](./06_Feature_Flags_Variants_And_Strategy_Variants.md) | Types; variants |
| 07 | [Activation strategies](./07_Activation_Strategies_Stickiness_And_Custom.md) | Rollout rules |
| 08 | [Context and segments](./08_Context_Constraints_And_Segments.md) | Targeting |
| 09 | [SDKs and OpenFeature](./09_SDKs_Backend_Frontend_And_OpenFeature.md) | Every official method family |
| 10 | [Edge and Proxy](./10_Edge_Proxy_And_Streaming.md) | Topology |
| 11 | [Tokens and keys](./11_API_Tokens_Keys_And_Service_Accounts.md) | API access |
| 12 | [SSO, RBAC, SCIM](./12_SSO_RBAC_SCIM_And_Provisioning.md) | Identity |
| 13 | [Change requests and release mgmt](./13_Change_Requests_Release_Management_And_Governance.md) | Governance |
| 14 | [Impression and analytics](./14_Impression_Analytics_Impact_And_Playground.md) | Measure flags |
| 15 | [Integrations](./15_Integrations_Terraform_Webhooks_And_Chatops.md) | Terraform; chatops |
| 16 | [AI assistants and MCP](./16_AI_Assistants_MCP_And_Assisted_Delivery.md) | Assisted delivery |
| 17 | [Security and compliance](./17_Security_Privacy_And_Compliance.md) | Privacy; compliance |
| 18 | [Operate and scale](./18_Scale_Upgrade_Operate_And_Troubleshoot.md) | Day-2 |
| 19 | [Worked example](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md) | Gradual rollout lab |
| 20 | [Best practices](./20_Best_Practices_And_When_Not_Unleash.md) | Judgment |
| 21 | [Coverage map](./21_Feature_And_Offering_Coverage_Map.md) | Full offering inventory |
| 22 | [Catalog, migrate, spectrum](./22_Config_Catalog_Migrate_And_Spectrum.md) | Config index; doors |
| 23 | [Admin, Client, Frontend, Edge APIs](./23_Admin_Client_Frontend_And_Edge_APIs.md) | Every documented HTTP endpoint |

Start: [01](./01_What_Is_Unleash_And_Feature_Flags.md).

---

## Pipeline relationship

```text
CI deploys digest with flag default off
  → verify smoke
  → open flag to 5% → 50% → 100% (strategies / change requests)
  → or kill switch off on incident
```

Combine with canary controllers when **binary** risk and **behavior** risk both matter ([9](../9_Progressive_Delivery_Controllers.md), [Argo_Rollouts/](../Argo_Rollouts/README.md)).

## Further reading

- [Unleash documentation](https://docs.getunleash.io/)  
- [OpenFeature](https://openfeature.dev/)  
