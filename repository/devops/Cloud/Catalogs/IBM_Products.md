# IBM Cloud — product catalog (what / when / why not)

[← Catalogs](./README.md) · [IBM literacy →](../8_IBM_Cloud.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for IBM Cloud. Deeper API: [cloud.ibm.com/docs](https://cloud.ibm.com/docs).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Virtual Servers (VPC)** | VMs in VPC | Lift/shift, custom images | Containers → Code Engine / IKS |
| **Bare Metal** | Dedicated servers | Performance / licensing | VPC VMs enough |
| **Power / Z / SAP certified shapes** | Specialty platforms | Those workloads | x86 VPC |
| **IBM Cloud Code Engine** | Serverless containers/jobs | Request/batch containers without cluster | Need kube API → IKS/ROKS |
| **Functions (Cloud Functions)** | FaaS | Short glue | Prefer Code Engine for containers |
| **IKS** | Managed Kubernetes | Vanilla K8s | OpenShift required → ROKS |
| **ROKS** | Managed OpenShift | OpenShift API | Vanilla → IKS |
| **Satellite** | Run IBM services on your locations | Hybrid control | Pure public VPC |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Object Storage** | Object | Artifacts, backups | Block → Block Storage; file → File Storage |
| **Block Storage** | Block for VMs | DB disks | Shared file → File |
| **File Storage** | NFS | Shared file | Object workflows |
| **Backup / COS lifecycle** | Protect / tier | Estate backup | App-only for tiny |

## Database & data

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Databases for PostgreSQL / MySQL / MongoDB / Redis / Elasticsearch / …** | Managed DBs | Standard OLTP/cache/search | DIY on VMs when mandated |
| **Db2 / Db2 Warehouse** | IBM relational / warehouse | Db2 estates | Postgres when free choice |
| **Cloudant** | Document (CouchDB-family) | Document apps | Relational |
| **Event Streams (Kafka)** | Streaming | Event bus | Tiny queue |
| **watsonx.data / Data Engine patterns** | Lakehouse / analytics | Analytics on IBM | OLTP DB as warehouse |

## Networking

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Network | Always for new estates | Classic infra only if stuck |
| **Load Balancer / ALB / NLB** | Entry | HTTP/TCP | — |
| **CIS (Internet Services)** | DNS/CDN/WAF edge | Public edge | Internal only |
| **Direct Link** | Private circuit | Hybrid | VPN labs |
| **Transit Gateway / VPN** | Hub / IPsec | Multi-VPC / hybrid | — |
| **API Connect** | API platform | Enterprise APIs | Simple LB |

## Identity & security

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IAM + Access Groups / Trusted Profiles** | AuthZ | Always | Long-lived API keys for humans |
| **App ID / SSO federation** | App / workforce identity | Those jobs | — |
| **Key Protect / Secrets Manager / HPCS** | Keys / secrets / HSM | Runtime secrets | Secrets in repos |
| **Security and Compliance Center / Guardium doors** | Posture / data security | Regulated | — |

## Observability & AI

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IBM Cloud Monitoring / Log Analysis / Activity Tracker** | Signals + audit | Default | — |
| **watsonx / Watson services** | AI platform + vertical | GenAI/ML on IBM | Pure open models on IKS only when needed |
| **Schematics / Terraform / toolchain** | IaC / delivery | IBM-centric | External CI paved |

## How to use

1. Job → When / Why not.  
2. Wire IAM/VPC in [8](../8_IBM_Cloud.md).  
3. [IBM docs](https://cloud.ibm.com/docs) for API/limits.

## References

- [IBM Cloud products](https://www.ibm.com/cloud/products)  
