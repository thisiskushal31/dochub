# Tencent Cloud — product catalog (what / when / why not)

[← Catalogs](./README.md) · [Tencent literacy →](../10_Tencent_Cloud.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Tencent Cloud. Deeper API: [tencentcloud.com/document](https://www.tencentcloud.com/document/product). China vs intl partitions matter.*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **CVM** | VMs | Lift/shift, GPU | SCF for glue; TKE for kube |
| **Auto Scaling** | Scale CVM | Stateless fleets | Pet VM |
| **SCF (Serverless Cloud Function)** | FaaS | Events / short HTTP | Long containers → TKE / TI |
| **TKE** | Managed Kubernetes | Helm/operators | Simple → SCF / Web app PaaS |
| **EKS (Serverless TKE variant)** | Serverless K8s | Burst without node ops | Need node control → TKE |
| **TencentCloud Lighthouse** | Simple VPS | Tiny sites | Estate → CVM/VPC |
| **Batch / TI-ONE compute** | Batch / ML jobs | Arrays / training | Tiny cron → SCF |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **COS** | Object | Artifacts, static, lakes | CBS for block; CFS for file |
| **CBS** | Block | DB disks | Shared → CFS |
| **CFS** | File | Shared NFS | Object → COS |
| **Archive / cold COS** | Cold | Archives | Hot → standard COS |

## Database & messaging

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **TencentDB (MySQL/Postgres/SQL Server/…)** | Managed OLTP | Standard DB | Distributed → TDSQL |
| **TDSQL / CynosDB** | Distributed / cloud-native DB | Scale / cloud-native | Simple → TencentDB |
| **Redis / MongoDB / Elasticsearch** | Cache / document / search | Those engines | — |
| **TDMQ / CKafka / CMQ** | Messaging | Event bus | Pick protocol |
| **CDW / EMR / Oceanus** | Warehouse / Hadoop / Flink | Analytics / stream | OLTP as warehouse |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Network | Always | — |
| **CLB** | Load balancing | Entry | — |
| **CDN / EO (EdgeOne)** | CDN / edge security | Public edge | Internal |
| **WAF / Anti-DDoS** | Edge security | Public HTTP | — |
| **Direct Connect / VPN / CCN** | Hybrid / multi-region | Hybrid | VPN labs |
| **NAT / EIP / Private Link** | Egress / public / private | Those jobs | — |
| **API Gateway / DNSPod** | API / DNS | Those jobs | — |

## Identity, ops, AI

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **CAM (+ SSO / role federation)** | AuthZ | Always | Root for daily |
| **Organization / CloudAudit** | Multi-account / audit | Landing zone + trail | — |
| **KMS / SSM / SSL** | Keys / secrets / certs | Runtime secrets | Secrets in git |
| **CLS / Cloud Monitor / APM** | Logs / metrics / traces | Default | — |
| **TCR** | Container registry | TKE images | — |
| **TI Platform / Hunyuan APIs** | ML / FM | GenAI + train | DIY TKE only when needed |

## How to use

1. Confirm region partition.  
2. Job → When / Why not.  
3. Wire CAM/VPC in [10](../10_Tencent_Cloud.md).  
4. [Docs](https://www.tencentcloud.com/document/product) for API/limits.

## References

- [Tencent Cloud products](https://www.tencentcloud.com/products)  
