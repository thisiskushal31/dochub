# 05 — Agents: Microsoft-hosted and self-hosted

[← Previous](./04_First_Pipeline_And_Project_Setup.md) · [README](./README.md) · [Next: Variables →](./06_Variables_Secrets_And_Library.md)

## 1. Concepts

Jobs run on **agents** from an **agent pool**.

| Kind | Meaning |
|------|---------|
| **Microsoft-hosted** | Ephemeral VM images (`ubuntu-latest`, `windows-latest`, `macOS-latest`, …). Microsoft patches the image. |
| **Self-hosted** | Your VM/container registered to a pool — VPC access, licensed software, air-gap, special SDKs. |
| **Scale set agents** | Azure VMSS-backed elastic self-hosted pools. |

```yaml
pool:
  vmImage: ubuntu-latest   # hosted

# or
pool: MyPrivatePool        # self-hosted pool name
```

Parallelism is a billing/capacity concern on Services; self-hosted needs you to size machines and keep them healthy.

## 2. Advanced concepts

### When to leave hosted

| Need | Choice |
|------|--------|
| Standard Linux/Windows CI | Microsoft-hosted |
| Reach private VNet / on-prem IIS | Self-hosted in that network |
| Heavy caches / huge SDKs every run | Self-hosted or larger hosted (cost) |
| Regulated build network | Self-hosted; harden like prod jump hosts |

### Demands and capabilities

Self-hosted agents advertise **capabilities**; jobs can **demand** them (e.g. specific Visual Studio version). Prefer explicit demands over tribal “use agent X”.

### Hygiene

Self-hosted: patch OS, rotate credentials, don’t leave build artifacts world-readable, isolate prod-deploy agents if policy requires. Treat agent machines as part of the supply chain ([CiCd/6](../6_Supply_Chain_And_Signing.md)).

### Container jobs

Jobs can run inside a container on the agent (`container:`). Useful for reproducible toolchains; networking and Docker-in-Docker caveats apply.

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| Startup on Azure | Hosted only |
| Bank with on-prem SQL deploy | Self-hosted Windows agents |
| Bursty load | VMSS agent pools |

**Good:** prod deploy agents scoped and monitored. **Bad:** shared dirty self-hosted agent used for untrusted PR forks without isolation.

## References

- [Microsoft-hosted agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/hosted)  
- [Self-hosted agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents)  
- [Azure virtual machine scale set agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/scale-set-agents)  
