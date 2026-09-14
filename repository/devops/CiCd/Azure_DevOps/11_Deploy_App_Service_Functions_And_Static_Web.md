# 11 — Deploy: App Service, Functions, and Static Web Apps

[← Previous](./10_Artifacts_Feeds_And_Packages.md) · [README](./README.md) · [Next: VMs →](./12_Deploy_VMs_VMSS_And_Host_Patterns.md)

---

## 1. Concepts

This chapter covers **PaaS web** targets you drive from Azure Pipelines — the most common “deploy to Azure” path for websites and APIs.

| Target | Typical task / mechanism |
|--------|--------------------------|
| **Azure App Service** (Windows/Linux web) | `AzureWebApp@1` / `AzureRmWebAppDeployment@5` |
| **App Service slots** | Deploy to staging slot → swap |
| **Azure Functions** | `AzureFunctionApp@2` / container variant |
| **Static Web Apps** | `AzureStaticWebApp@0` |
| **WebDeploy / zip / Run From Package** | Options inside App Service deploy tasks |
| **Web App for Containers** | Deploy container image to App Service |

Durable pattern: build → publish zip or image **digest** → deploy task with ARM **service connection** → smoke → (optional) swap.

Platform internals (SKU, ASE, networking): [Cloud/4](../../Cloud/4_Azure_Literacy.md). Here: **how Pipelines ships**.

---

## 2. Advanced concepts

### Slots and safe promote

Deploy to a **staging slot**, warm up, validate, then **swap** to production. Swap is the PaaS cousin of blue-green. Keep slot-sticky settings understood (what swaps vs what stays).

### Deployment methods

App Service deploy supports Web Deploy, zip deploy, Run From Package, containers — choose based on runtime and downtime tolerance. Legacy IIS muscle memory maps to Web Deploy; Linux apps often zip/package.

### Functions

Separate Function App tasks exist; don’t force the generic web task when Function-specific tasks fit. Consumption vs Premium vs Dedicated affects cold start and networking — pick SKU in Azure, wire identity in Pipelines.

### Static Web Apps

SWA pipelines build frontend and deploy to Azure’s static hosting + optional managed functions. Token/auth differs from ARM web deploy — follow SWA task inputs carefully.

### Config vs artifact

App settings / Key Vault references belong in Azure config, not baked into the zip when avoidable ([CiCd/13](../13_Config_Secrets_And_Env_Parity.md)).

---

## 3. Applications and use cases

| App shape | Path |
|-----------|------|
| ASP.NET / Node / Python website | App Service + slots |
| Event-driven API | Functions |
| Marketing / SPA | Static Web Apps or storage+CDN ([CiCd/17](../17_Static_Sites_And_CDN_Deploy.md)) |
| Containerized web without K8s | Web App for Containers or [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) |

**Good:** staging slot + approval environment. **Bad:** FTP deploy as the paved road.

---

## References

- [Deploy to App Service with Azure Pipelines](https://learn.microsoft.com/en-us/azure/app-service/deploy-azure-pipelines)  
- [Azure App Service deploy task](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v5)  
- [Azure Functions deploy](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-function-app-v2)  
- [Static Web Apps task](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-static-web-app-v0)  
