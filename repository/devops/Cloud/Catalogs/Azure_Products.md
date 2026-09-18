# Azure — product catalog (what / when / why not)

[← Catalogs](./README.md) · [Azure literacy →](../6_Azure_Literacy.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Microsoft Azure. Deeper API: [learn.microsoft.com/azure](https://learn.microsoft.com/azure/).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Virtual Machines** | VMs | Lift/shift, custom images, GPU | Event glue → Functions; container API → Container Apps |
| **Virtual Machine Scale Sets** | Autoscale VM fleets | Stateless fleets + LB | Single pet VM |
| **Azure Functions** | FaaS | Events, bindings, short work | Long containers → Container Apps; kube → AKS |
| **Container Apps** | Serverless containers (KEDA/Dapr-friendly) | Microservices without full K8s ops | Need raw kube API → AKS |
| **App Service** | PaaS web/API | Classic web apps, slots | Containers-first → Container Apps |
| **AKS** | Managed Kubernetes | Helm/operators | Simple apps → Container Apps/App Service |
| **ARO** | Managed OpenShift | OpenShift required | Vanilla K8s → AKS |
| **Azure Batch** | Large parallel jobs | HPC/batch | Simple timer → Functions |
| **Azure Spring Apps / Red Hat OpenShift** | Specialty app platforms | Those stacks | General AKS |
| **Azure Arc / Azure Local / Stack** | Hybrid / on-prem Azure control | Regulated edge | Pure public cloud |
| **Cloud PC / Virtual Desktop** | VDI | Managed desktops | Laptop fleet OK |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Blob Storage** | Object | Artifacts, lakes, backups, static | POSIX share → Azure Files; block → Managed Disks |
| **Managed Disks** | Block for VMs | DB/data on VMs | Shared files → Files/NetApp |
| **Azure Files** | SMB/NFS shares | Lift file servers | Object → Blob |
| **Azure NetApp Files** | High-perf NFS/SMB | Demanding file | Simple Files enough |
| **Data Box / Import-Export** | Bulk physical ingest | Petabyte moves | Network transfer OK |
| **Azure Backup / Site Recovery** | Backup / DR | Estate protection | App-only backups for tiny |

## Database & analytics

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Azure SQL / SQL MI / SQL VM** | SQL Server family | SQL Server estates | Postgres → Flexible Server |
| **Azure Database for PostgreSQL/MySQL/MariaDB** | Managed OSS DB | Standard OLTP | Hyperscale specialty → Cosmos |
| **Cosmos DB** | Multi-model globally distributed | Global document/KV | Simple relational → Azure SQL/Postgres |
| **Azure Cache for Redis** | Cache | Sessions/hot data | — |
| **Azure Database for… Flexible Server** | Preferred managed OSS shape | New deployments | Single-server legacy SKUs |
| **Synapse / Fabric / HDInsight / Databricks (on Azure)** | Analytics / lakehouse | BI + big data | OLTP DB as warehouse |
| **Data Factory** | ETL orchestration | Pipelines | Simple copy |
| **Event Hubs / Service Bus / Queue Storage** | Streaming / messaging | Ingest vs enterprise messaging | Pick by protocol (Kafka-ish → Event Hubs) |
| **Azure Data Explorer (Kusto)** | Telemetry/logs analytics | Large log/TS analytics | Log Analytics enough |
| **Power BI** | BI | Org dashboards | — |
| **Purview** | Data governance | Catalog/lineage | Tiny estate |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Virtual Network** | Network | Always | — |
| **Load Balancer** | L4 | TCP/UDP | HTTP routing → App Gateway/Front Door |
| **Application Gateway** | Regional L7 + WAF option | HTTP(S) apps | Global entry → Front Door |
| **Front Door** | Global HTTP entry/CDN-ish | Global web | Regional only → App Gateway |
| **Azure CDN** | CDN | Static/cache | Front Door covers many cases |
| **Azure DNS / Traffic Manager** | DNS / DNS-based routing | Zones / failover | — |
| **ExpressRoute** | Private circuit | Hybrid prod | VPN for non-critical |
| **VPN Gateway** | IPsec | Bootstrap | — |
| **Private Link / Private Endpoint / Service Endpoints** | Private PaaS | Keep off public | — |
| **NAT Gateway** | Egress | Private subnets | — |
| **Azure Firewall / WAF / DDoS Protection** | Network security | Perimeter | NSG-only for tiny labs |
| **API Management** | API platform | Enterprise APIs | Simple App Gateway enough |
| **Virtual WAN** | Large hub networking | Many branches/VNets | Few VNets → peering |

## Identity & security

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Entra ID** | Workforce identity | Always for Azure | — |
| **Entra External ID / B2C patterns** | Customer identity | App users | Workforce Entra |
| **Azure RBAC / PIM** | AuthZ / just-in-time admin | Always | Standing Owner |
| **Key Vault** | Secrets/keys/certs | Runtime secrets | Secrets in config files |
| **Managed identities** | Workload identity | VMs/Functions/AKS | Client secrets in CI |
| **Microsoft Defender for Cloud / Sentinel** | Posture / SIEM | Security program | — |
| **Microsoft Purview / Compliance** | Compliance | Regulated | — |
| **App Configuration / Key Vault references** | Dynamic config | 12-factor apps | — |

## Developer / delivery

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Azure DevOps** | Boards/repos/pipelines | Microsoft-centric delivery | GitHub already paved |
| **GitHub (Microsoft)** | SCM + Actions | Common CI | — |
| **ACR** | Container registry | Images for ACA/AKS | — |
| **ARM / Bicep / Template Specs** | Azure-native IaC | Azure-first IaC | Terraform estate → IAC |
| **Deployment Environments / Dev Box** | Dev workstations/envs | Inner loop | — |

## Observability

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Azure Monitor / Log Analytics / Metrics** | Platform signals | Default | — |
| **Application Insights** | App APM/traces | Apps on Azure | Multi-cloud SaaS — still keep Activity Log |
| **Activity Log** | Control-plane audit | Always | — |
| **Managed Prometheus / Managed Grafana** | Prom stack | K8s Prom culture | Tiny → Monitor only |
| **Network Watcher** | Network diagnostics | VPC troubleshooting | — |

## AI / ML

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Azure OpenAI / Microsoft Foundry models** | Hosted FM | GenAI features with Azure governance | Unmanaged public keys |
| **Foundry Hosted Agents / Agent Service** | Managed agents | Containerized agents without full AKS | Outgrown → ACA/AKS |
| **Azure Machine Learning** | Train/deploy custom ML | ModelOps | Simple FM call → Azure OpenAI |
| **Cognitive Services (Vision, Speech, Language, Document Intelligence, …)** | Vertical AI APIs | Those modalities | Custom AML |
| **Bot Service / Copilot Studio patterns** | Conversational | Those products | Custom app + OpenAI |
| **GPU on VMSS/AKS** | Accelerators | Custom train/serve | FM API enough |

## Integration & other (short)

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Logic Apps / Power Automate** | Low-code workflows | SaaS glue | Code-heavy → Functions |
| **Event Grid** | Reactive events | Fanout from Azure resources | — |
| **Service Fabric** | Legacy microservices platform | Existing SF | New → ACA/AKS |
| **IoT Hub / Central / Edge** | Devices | IoT | — |
| **Media Services** | Video | Streaming | Blob+CDN |
| **Migration tools (Migrate, DMS, …)** | Move to Azure | Migrations | Rewrite |

## How to use

1. Job → When / Why not.  
2. Wire Entra/RBAC/VNet in [6](../6_Azure_Literacy.md).  
3. [Learn Azure](https://learn.microsoft.com/azure/) for API/limits.

## References

- [Azure products](https://azure.microsoft.com/products/) · [Architecture Center](https://learn.microsoft.com/azure/architecture/)  
