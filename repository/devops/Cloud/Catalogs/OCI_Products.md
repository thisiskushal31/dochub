# OCI — product catalog (what / when / why not)

[← Catalogs](./README.md) · [OCI literacy →](../7_Oracle_Cloud.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Oracle Cloud Infrastructure. Deeper API: [docs.oracle.com/iaas](https://docs.oracle.com/en-us/iaas/).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Compute (instances)** | VMs | Lift/shift, custom images, GPU shapes | Event glue → Functions; containers → OKE/Container Instances |
| **Instance pools / Autoscaling** | Scale fleets | Stateless fleets + LB | Pet VM |
| **Functions** | FaaS | Short event work | Long containers → Container Instances / OKE |
| **Container Instances** | Run containers without cluster | Simple container jobs | Need kube API → OKE |
| **OKE** | Managed Kubernetes | Helm/operators | Simple container → Container Instances |
| **Bare metal / HPC / GPU shapes** | Dedicated / accel | HPC, Oracle DB metal, ML train | Standard VM enough |
| **Dedicated VM Hosts / Capacity reservations** | Isolation / capacity | Compliance / launch guarantees | On-demand OK |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Object Storage** | Object | Artifacts, backups, lakes | Block for DB → Block Volumes; NFS → File Storage |
| **Block Volumes** | Block for compute | DB/data disks | Shared file → FSS |
| **File Storage** | NFS | Shared file lift | Object → Object Storage |
| **Archive Storage** | Cold object | Compliance archives | Hot reads → standard Object |
| **Data Transfer / FastConnect Appliance patterns** | Bulk ingest | Large moves | Small → Object API |

## Database

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Autonomous Database (ATP/ADW)** | Self-driving Oracle | Oracle OLTP/warehouse without DBA toil | Non-Oracle → MySQL/Postgres HeatWave/Base DB |
| **Base Database / Exadata Cloud** | Oracle on OCI | Full Oracle control / Exadata | Autonomous when you can |
| **MySQL HeatWave** | MySQL + analytics | MySQL estates / HeatWave analytics | Postgres → PostgreSQL |
| **PostgreSQL / SQL Server** | Managed OSS/MS | Those engines | Oracle-first → Autonomous |
| **NoSQL Database** | Managed NoSQL | Document/KV on OCI | Relational → above |
| **GoldenGate / Data Guard patterns** | Replication / DR | Oracle estates | App-level replica |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VCN** | Network | Always | — |
| **Load Balancer / Network Load Balancer** | L7 / L4 | HTTP vs TCP | Public IP only |
| **DNS / Traffic Management** | DNS / steering | Zones | — |
| **WAF / Edge / CDN (OCI + partners)** | Edge security/cache | Public HTTP | Internal |
| **FastConnect** | Private circuit | Hybrid prod | VPN for labs |
| **Site-to-Site VPN** | IPsec | Bootstrap | — |
| **Service Gateway / Private Access / NAT** | Private egress / services | Private subnets | — |
| **API Gateway** | API front | Manage APIs | Full mesh when needed |

## Identity & security

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IAM (tenancy / compartments / policies)** | AuthZ | Always — compartments are the blast fence | Flat tenancy for prod |
| **Identity Domains / Federation** | Workforce / SSO | SSO, federation | Local users for humans long-term |
| **Vault / KMS** | Secrets/keys | Runtime secrets | Secrets in Terraform state plaintext |
| **Cloud Guard / Security Zones / Vulnerability Scanning** | Posture | Security program | — |
| **Certificates / Bastion** | TLS / break-glass access | Managed entry | Open SSH everywhere |

## Observability & delivery

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Monitoring / Logging / Logging Analytics** | Signals | Default | — |
| **Audit** | Control-plane trail | Always | — |
| **Notifications / Events / Connector Hub** | Fanout / pipeline | Glue between services | — |
| **DevOps / Container Registry / Resource Manager** | Delivery / images / Stacks | OCI-native CI/IaC | External CI already paved |
| **Streaming** | Kafka-compatible ingest | Event bus | Tiny → Notifications/Queues |

## AI / other

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **OCI Generative AI / Data Science / AI Services** | FM + ML + vertical AI | GenAI/ML on OCI | Pure DIY OKE when required |
| **Oracle SaaS / Fusion integration** | ERP/apps | Oracle app estates | Pure greenfield IaaS |

## How to use

1. Job → When / Why not.  
2. Wire compartments/IAM/VCN in [7](../7_Oracle_Cloud.md).  
3. [OCI docs](https://docs.oracle.com/en-us/iaas/) for API/limits.

## References

- [OCI products](https://www.oracle.com/cloud/) · [Architecture Center](https://docs.oracle.com/en/solutions/)  
