# Open Telekom Cloud (OTC) — product catalog (what / when / why not)

[← Catalogs](./README.md) · [Telekom literacy →](../13_Deutsche_Telekom.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Open Telekom Cloud (T-Systems / Deutsche Telekom). Sovereign/EU positioning matters. Deeper API: [docs.otc.t-systems.com](https://docs.otc.t-systems.com/).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Elastic Cloud Server (ECS)** | VMs | Lift/shift on OTC | CCE for kube; FunctionGraph for glue |
| **Auto Scaling** | Scale ECS | Stateless fleets | Pet VM |
| **Bare Metal / Dedicated** | Metal | Perf / isolation | ECS enough |
| **Cloud Container Engine (CCE)** | Managed Kubernetes | Helm/operators | Simple → ECS |
| **FunctionGraph** | FaaS | Short events | Long → CCE |
| **Image Management / IMS** | Images | Golden images | — |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Object Storage Service (OBS)** | Object | Artifacts, backups | EVS for block; SFS for file |
| **Elastic Volume Service (EVS)** | Block | DB disks | Shared → SFS |
| **Scalable File Service (SFS)** | File | Shared NFS | Object → OBS |
| **Cloud Backup / CBR** | Backup | Fleet | — |

## Database & middleware

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **RDS** | Managed MySQL/Postgres/… | Standard OLTP | DIY VM when mandated |
| **Distributed / NoSQL / cache SKUs (DDS, DCS, …)** | Document / Redis-class | Those engines | — |
| **DMS / Kafka / RabbitMQ** | Messaging | Event bus | — |
| **DCS / CSS** | Cache / search | Those jobs | — |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Network | Always | — |
| **ELB** | Load balancing | Entry | — |
| **NAT / EIP / VPN / Direct Connect** | Egress / public / hybrid | Hybrid | VPN labs |
| **DNS / WAF / Anti-DDoS** | DNS / edge | Public | Internal |
| **VPC Endpoint / Private access** | Private to services | Keep off public | — |

## Identity, ops, sovereign notes

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IAM (+ agencies / projects)** | AuthZ | Always | Shared root |
| **Cloud Trace / CTS / CES / LTS** | Audit / metrics / logs | Always for audit | — |
| **KMS / DEW / SSL** | Keys / secrets / certs | Runtime secrets | Secrets in git |
| **SWR** | Registry | CCE images | — |
| **T-Systems managed / private offers** | Contracted private | Sovereign contracts | Self-serve OTC enough |

**When OTC vs hyperscaler:** EU/sovereign procurement, Telekom relationship, or existing OTC landing zone. **Why not:** team already deep on AWS/Azure/GCP *and* no residency constraint—don't dual-stack for sport.

## How to use

1. Confirm OTC region + contract model (self-serve vs T-Systems managed).  
2. Job → When / Why not.  
3. Wire IAM/VPC in [13](../13_Deutsche_Telekom.md).  
4. [OTC docs](https://docs.otc.t-systems.com/) for API/limits.

## References

- [Open Telekom Cloud](https://open-telekom-cloud.com/)  
