# 12 — Deploy: VMs, VMSS, and host patterns

[← Previous](./11_Deploy_App_Service_Functions_And_Static_Web.md) · [README](./README.md) · [Next: Containers →](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md)

## 1. Concepts

Not everything is App Service. Azure still runs **IaaS** fleets — and Pipelines must reach them.

| Target | Pattern |
|--------|---------|
| **Azure VM** | WinRM / SSH / Azure CLI Run Command / custom script extension |
| **VM Scale Sets (VMSS)** | `AzureVmssDeployment@1` (update image or app package patterns) |
| **Availability Sets / fault domains** | Capacity design in Azure — Pipelines deploys onto VMs already placed correctly |
| **IIS on Windows** | MSDeploy / sync scripts from self-hosted Windows agents |
| **On-prem VM behind hybrid** | Self-hosted agent in the network ([05](./05_Agents_Hosted_And_Self_Hosted.md)) |

Host-neutral framing: [CiCd/18](../18_VM_MIG_And_Host_Based_Deploy.md). Azure Load Balancer / availability is cloud literacy ([Cloud/4](../../Cloud/4_Azure_Literacy.md)) — Pipelines assumes the LB already fronts healthy instances.

## 2. Advanced concepts

### Rolling vs recreate on VMSS

VMSS deployments can roll instance updates (new image/version) or push app bits. Prefer **immutable images** (Packer/image builder → new image → roll) over snowflake SSH mutates when you can. Image building craft → [IAC/](../../IAC/README.md).

### Environment VM resources

Pipelines environments can register VM resources for rolling/canary **deployment strategies** across machines. Use when you need orchestrated per-VM steps with health gates.

### Classic copy/FTP/WinRM estates

Brownfield: copy files, stop service, start service. Encode as scripts/tasks with clear rollback (previous package kept). Don’t pretend it’s Kubernetes.

### Availability Sets vs Zones

Pipelines does not “configure HA” by itself — IaC creates the HA shape; Pipelines ships bits to instances. Know the difference so you don’t “fix HA” by deploying twice to one VM.

## 3. Applications and use cases

| Estate | Approach |
|--------|----------|
| Legacy .NET on IIS in Azure VMs | Self-hosted Windows agent + WebDeploy |
| Scale-out API on VMSS | Image-based roll via VMSS task |
| Hybrid DC + Azure | Agent in DC; same YAML stages |

**Good:** golden image + roll. **Bad:** manual RDP as the release process.

## References

- [VMSS deployment task](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-vmss-deployment-v1)  
- [Environments — VMs](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments-virtual-machines)  
- [CiCd VM/MIG patterns](../18_VM_MIG_And_Host_Based_Deploy.md)  
