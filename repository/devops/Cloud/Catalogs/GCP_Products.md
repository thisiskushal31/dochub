# GCP — product catalog (what / when / why not)

[← Catalogs](./README.md) · [GCP literacy →](../4_GCP_Literacy.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Google Cloud. Deeper API: [cloud.google.com/docs](https://cloud.google.com/docs).*

---

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Compute Engine** | VMs | Lift/shift, custom images, GPU VMs, MIGs | Only need HTTP container → Cloud Run; event glue → Functions |
| **Managed Instance Groups** | Autoscale GCE fleets | Stateless fleets + LB | Single pet VM |
| **Cloud Run** | Serverless containers | Request/event containers, scale-to-zero | Need Kubernetes API → GKE; multi-hour batch → Batch/GCE |
| **Cloud Functions** | FaaS | Event glue, lightweight HTTP | Full container deps → Cloud Run |
| **GKE** | Managed Kubernetes | Helm/operators/kube API | Simple service → Cloud Run |
| **GKE Autopilot** | GKE with Google-managed nodes | Want K8s with less node ops | Need node/SSH control → Standard |
| **Batch** | Batch jobs | HPC/array jobs | Tiny cron → Cloud Scheduler + Run/Functions |
| **App Engine** | PaaS apps | Legacy/simple PaaS | Greenfield containers → Run/GKE |
| **Bare Metal Solution** | Dedicated metal in Google locations | Oracle/special metal | Normal GCE enough |
| **Google Distributed Cloud / Anthos patterns** | Extend GKE/cloud controls to edge/on-prem | Hybrid control plane | Pure public cloud |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Cloud Storage (GCS)** | Object storage | Artifacts, lakes, backups, static | Need filestore POSIX → Filestore; block → Persistent Disk |
| **Persistent Disk** | Block for GCE/GKE | Databases on VMs/PVs | Shared multi-writer file → Filestore |
| **Filestore** | Managed NFS | Shared file lift | Object workflows → GCS |
| **Local SSD** | Ephemeral fast disk | Scratch/cache | Durable data |
| **Transfer / Storage Transfer / Transfer Appliance** | Move data in | Bulk ingest | Small copies → gsutil/Storage API |
| **Backup for GCE / Agent** | VM backup | Fleet backup | App-level only for tiny |

## Database & analytics

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Cloud SQL** | Managed MySQL/Postgres/SQL Server | Standard OLTP | Global relational → Spanner; extreme Postgres → AlloyDB |
| **AlloyDB** | Postgres-compatible, performance-oriented | Demanding Postgres | Simple → Cloud SQL |
| **Spanner** | Globally distributed relational | Global consistency needs | Single-region OLTP → Cloud SQL |
| **Firestore / Datastore** | Document / serverless DB | Mobile/realtime document | Relational → Cloud SQL |
| **Bigtable** | Wide-column | Large time-series/analytics KV | Small KV → Firestore/Memorystore |
| **Memorystore** | Redis/Memcached | Cache/session | — |
| **BigQuery** | Warehouse / SQL lakehouse | Analytics | OLTP → Cloud SQL |
| **BigQuery Omni / BI Engine** | Multi-cloud query / accel | Those patterns | Stay in BQ |
| **Dataflow** | Managed Beam | Streaming/batch ETL | Simple → Dataform/Workflows |
| **Dataproc** | Managed Spark/Hadoop | Existing Spark jobs | Prefer Dataflow/BigQuery |
| **Pub/Sub** | Messaging | Event bus / fanout | Tiny → Cloud Tasks |
| **Dataflow / Pub/Sub / Dataflow SQL** | Stream pipelines | Real-time | Batch BigQuery load enough |
| **Composer** | Managed Airflow | Orchestration | Cloud Workflows for simpler |
| **Dataform / Dataplex / Data Catalog** | ELT/governance | Analytics engineering | Ad-hoc only |
| **Looker / Looker Studio** | BI | Dashboards | Other BI standard |
| **Cloud Bigtable / Spanner / BQ** as above | — | — | — |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Network (global VPC, regional subnets) | Always | — |
| **Cloud Load Balancing** | HTTP(S)/TCP/UDP/internal | Global/regional entry | Single VM IP |
| **Cloud CDN** | CDN | Cache at edge | Internal only |
| **Cloud DNS** | DNS | Zones | — |
| **Cloud Armor** | WAF/DDoS policies | Public HTTP | Internal |
| **Cloud NAT** | Egress NAT | Private GCE/GKE egress | Public IPs on nodes |
| **Cloud Interconnect / Partner Interconnect** | Private on-ramp | Hybrid | VPN for non-critical |
| **Cloud VPN** | IPsec | Bootstrap hybrid | Prod → Interconnect diversity |
| **Private Service Connect / Private Google Access** | Private to APIs/SaaS | Keep off public | — |
| **Traffic Director / GKE Gateway / Mesh** | Service mesh / gateway | Advanced microservices | Simple LB enough |
| **Apigee** | API platform | Enterprise API management | API Gateway-lite needs → Cloud Endpoints/LB |
| **Cloud Endpoints / API Gateway** | API front | Manage APIs | Full Apigee when needed |

## Security & identity

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Cloud IAM + Cloud Identity** | AuthZ / workforce | Always | SA JSON keys for humans |
| **Identity Platform / Firebase Auth** | App users | Customer auth | Workforce SSO |
| **Secret Manager / Cloud KMS / Cloud HSM** | Secrets / keys | Runtime secrets, CMK | Secrets in source |
| **Chronicle / Security Command Center** | SecOps / posture | Security program | — |
| **reCAPTCHA Enterprise / Identity-Aware Proxy** | Bot / beyond-corp access | Public abuse / IAP to apps | — |
| **Certificate Manager** | TLS certs | LB certs | — |
| **VPC Service Controls** | Data perimeter | Sensitive data exfil control | Overkill for public blog |

## Operations & observability

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Cloud Monitoring / Logging / Trace / Profiler / Error Reporting** | Native observability | Default for GCP SKUs | Multi-cloud SaaS only — still keep audit |
| **Cloud Audit Logs** | Who changed what | Always | — |
| **Managed Service for Prometheus** | Prom metrics | Prom/Grafana culture | Tiny → Cloud Monitoring |
| **Cloud Deploy / Cloud Build / Artifact Registry** | Delivery + images | GCP-native CI | External CI already paved |
| **Deploy / Config Connector / Infra Manager** | GitOps/IaC helpers | GCP-centric IaC | Terraform estate → IAC |
| **Cloud Scheduler / Tasks / Workflows** | Cron / queues / workflows | Orchestration | Complex → Composer |

## AI / ML

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Vertex AI (Gemini / Model Garden APIs)** | Hosted FM + ML platform | GenAI + train/deploy custom | Pure DIY on GKE only when needed |
| **Vertex Agent Engine / agents** | Managed agents | Fast agent hosting | Custom container/K8s when constrained |
| **Document AI / Vision / Speech / Translation / Natural Language** | Vertical AI APIs | Those modalities | Custom Vertex training |
| **Recommendations AI / Contact Center AI / …** | Vertical solutions | Those domains | Generic Vertex |
| **TPUs / GPU on GCE/GKE** | Accelerators | Train/serve at scale | FM API enough |

## Collaboration / other (short)

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Firebase** | App backend suite | Mobile/web jumpstart | Full GCP VPC estate |
| **Workspace APIs** | Docs/mail integration | Those apps | — |
| **Anthos/GDC** | Hybrid | Regulated edge | Pure SaaS |
| **Migrate to Virtual Machines / Containers** | Migration | Rehost/replatform | Rewrite |

---

## How to use

1. Pick job → read When / Why not.  
2. Wire IAM/VPC in [4](../4_GCP_Literacy.md).  
3. [Docs](https://cloud.google.com/docs) for API/limits.

## References

- [Google Cloud products](https://cloud.google.com/products) · [Architecture Center](https://cloud.google.com/architecture)  
