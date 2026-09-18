# Alibaba Cloud — product catalog (what / when / why not)

[← Catalogs](./README.md) · [Alibaba literacy →](../9_Alibaba_Cloud.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Alibaba Cloud (Aliyun). Deeper API: [alibabacloud.com/help](https://www.alibabacloud.com/help). China vs intl accounts/regions differ—pick the right partition first.*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **ECS** | VMs | Lift/shift, GPU, custom images | Function → FC; container API → ACK/SAE |
| **Auto Scaling / ESS** | Scale ECS | Stateless fleets | Pet VM |
| **Function Compute (FC)** | FaaS | Event glue, short HTTP | Long containers → SAE / ACK |
| **SAE / Serverless App Engine** | Serverless apps/containers | Easy microservice deploy | Need kube → ACK |
| **ACK** | Managed Kubernetes | Helm/operators | Simple → SAE/FC |
| **ACK Serverless / Edge** | Serverless / edge K8s variants | Those patterns | Standard ACK |
| **Elastic Container Instance (ECI)** | Pods without nodes | Burst containers | Full cluster control → ACK |
| **Batch Compute / EHPC** | Batch / HPC | Arrays / HPC | Tiny cron → FC |
| **Simple Application Server** | VPS-like | Tiny sites | Estate → ECS/VPC |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **OSS** | Object | Artifacts, lakes, static | NAS for POSIX; disks for block |
| **Cloud Disk (ESSD/…)** | Block for ECS | DB disks | Shared → NAS |
| **NAS / CPFS** | File / parallel FS | Shared / HPC file | Object → OSS |
| **OSS Archive / Cold** | Cold object | Archives | Hot → standard OSS |
| **Hybrid Backup / HBR** | Backup | Fleet backup | — |

## Database & analytics

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **RDS** | Managed MySQL/Postgres/SQL Server/… | Standard OLTP | Distributed → PolarDB/Distributed DB |
| **PolarDB** | Cloud-native relational | Demanding MySQL/Postgres-compatible | Simple → RDS |
| **PolarDB-X / Distributed DB** | Sharded relational | Huge scale | Mid-size → PolarDB/RDS |
| **MongoDB / Redis / Tair / Elasticsearch** | Document / cache / search | Those engines | — |
| **Table Store (OTS)** | Wide-column / serverless table | Large KV/TS | Small → Redis/RDS |
| **MaxCompute / Hologres / AnalyticDB** | Warehouse / analytics | Analytics | OLTP RDS |
| **DataWorks / DataHub / Flink** | Data platform / stream | Pipelines | Tiny → Function + OSS |
| **Message Queue (RocketMQ / Kafka / RabbitMQ)** | Messaging | Event bus | Pick protocol deliberately |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Network | Always | — |
| **SLB / ALB / NLB** | Load balancing | L4/L7 | — |
| **CDN / DCDN / Edge Security** | CDN / edge | Public content | Internal |
| **WAF / Anti-DDoS** | Edge security | Public HTTP | — |
| **Express Connect / VPN / CEN** | Hybrid / multi-region hub | Hybrid / global VPC | VPN for labs |
| **PrivateLink / NAT / EIP** | Private / egress / public IP | Those jobs | — |
| **API Gateway** | API front | Manage APIs | — |
| **DNS (DNS / PrivateZone)** | DNS | Zones | — |

## Identity & security

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **RAM (+ STS / SSO)** | AuthZ | Always | Root keys for daily use |
| **Resource Directory / CloudSSO** | Multi-account | Landing zone | Single account forever |
| **KMS / Secrets Manager / SSL Certificates** | Keys / secrets / TLS | Runtime secrets | Secrets in code |
| **ActionTrail / Config / Security Center** | Audit / posture | Always for audit | — |
| **IDaaS** | Identity as a service | Customer/workforce IdP | — |

## Observability & AI

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **CloudMonitor / SLS / ARMS / Tracing** | Metrics / logs / APM | Default | — |
| **Container Registry (ACR)** | Images | ACK/SAE | — |
| **ROS / Terraform** | IaC | Aliyun-native | External Terraform estate |
| **Platform for AI (PAI) / Model Studio / DashScope** | ML / FM | GenAI + train on Aliyun | DIY ACK only when needed |

## How to use

1. Confirm **China vs international** account/region.  
2. Job → When / Why not.  
3. Wire RAM/VPC in [9](../9_Alibaba_Cloud.md).  
4. [Help](https://www.alibabacloud.com/help) for API/limits.

## References

- [Alibaba Cloud products](https://www.alibabacloud.com/product)  
