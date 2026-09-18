# OVHcloud — product catalog (what / when / why not)

[← Catalogs](./README.md) · [OVH literacy →](../12_OVHcloud.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for OVHcloud. Deeper API: [help.ovhcloud.com](https://help.ovhcloud.com/) · [api.ovh.com](https://api.ovh.com/).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Public Cloud Instances** | OpenStack-ish VMs | Elastic VMs, project quotas | Need metal → Bare Metal; kube → Managed K8s |
| **Bare Metal / Dedicated Servers** | Dedicated hardware | Perf, licensing, predictable | Public Cloud VM enough |
| **VPS** | Cheap fixed VMs | Tiny sites / labs | Estate → Public Cloud + network |
| **Managed Kubernetes (MKS)** | Managed K8s | Helm/operators on OVH | Simple VM/container enough |
| **Managed Private Registry** | Images | MKS/workloads | — |
| **AI Notebooks / Training / Deploy (OVH AI)** | Managed ML shapes | Train/serve without DIY metal | Pure inference API elsewhere |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Object Storage (S3-compatible)** | Object | Artifacts, backups, static | Block/instance disk for DB |
| **Block Storage** | Volumes for instances | Persistent disks | Object for artifacts |
| **Cloud Archive / Cold** | Cold object | Archives | Hot object |
| **NAS-HA / Enterprise File** | Shared file | File lift | Object workflows |
| **Backup / Veeam / snapshots** | Protect | Estate backup | App-only tiny |

## Database & platform

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Managed Databases (Postgres/MySQL/Redis/Kafka/…)** | Managed data | Standard OLTP/cache/stream | DIY on Bare Metal when mandated |
| **Data Platform / logs** | Analytics/logs patterns | Those products | — |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **vRack / Private Network / VPC patterns** | Private L2/L3 | Multi-service private | Public-only labs |
| **Load Balancer** | Entry | HTTP/TCP | Single public IP |
| **Anti-DDoS (included culture) / CDN / DNS** | Edge | Public services | — |
| **OVHcloud Connect / VPN** | Hybrid | On-ramp | — |
| **Floating IPs / Gateway** | Public / egress | Those jobs | — |

## Identity & ops

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IAM / users / projects / roles** | AuthZ | Always — project isolation | Shared root for teams |
| **API keys / OAuth tokens** | Automation | IaC/CI | Human daily root |
| **Logs / Metrics / Activity** | Signals | Default | Pair with Observability stack |
| **Horizon / Manager / Terraform provider** | Control planes | Day-2 | — |

## Adjacent OVH products (short)

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Web Hosting / Email / Domains** | Classic hosting | Simple sites | App platform → Public Cloud |
| **Hosted Private Cloud (VMware)** | VMware as a service | VMware estates | Pure public instances |
| **US / EU / CA regions** | Data residency | Compliance pick | Ignore locality |

## How to use

1. Decide **Public Cloud vs Bare Metal vs Hosted Private Cloud**.  
2. Job → When / Why not.  
3. Wire projects/IAM/vRack in [12](../12_OVHcloud.md).  
4. [Help](https://help.ovhcloud.com/) for API/limits.

## References

- [OVHcloud products](https://www.ovhcloud.com/en/public-cloud/)  
