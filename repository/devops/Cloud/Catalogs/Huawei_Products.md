# Huawei Cloud — product catalog (what / when / why not)

[← Catalogs](./README.md) · [Huawei literacy →](../11_Huawei_Cloud.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for Huawei Cloud (and Cloud Stack / HCS patterns where noted). Deeper API: [huaweicloud.com](https://support.huaweicloud.com/intl/en-us/index.html).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **ECS** | VMs | Lift/shift, GPU | FunctionGraph for glue; CCE for kube |
| **AS (Auto Scaling)** | Scale ECS | Stateless fleets | Pet VM |
| **FunctionGraph** | FaaS | Events / short work | Long containers → CCE / CCI |
| **CCI** | Serverless containers | Containers without cluster | Need kube → CCE |
| **CCE** | Managed Kubernetes | Helm/operators | Simple → CCI/FunctionGraph |
| **BMS / DeH** | Bare metal / dedicated hosts | Performance / isolation | ECS enough |
| **Cloud Stack / HCS** | Private / hybrid Huawei cloud | On-prem Huawei stack | Pure public ECS/CCE |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **OBS** | Object | Artifacts, lakes, backups | EVS block; SFS file |
| **EVS** | Block | DB disks | Shared → SFS |
| **SFS / SFS Turbo** | File | Shared / turbo file | Object → OBS |
| **CBR** | Backup | Fleet backup | — |

## Database & data

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **RDS** | Managed MySQL/Postgres/SQL Server/… | Standard OLTP | GaussDB for distributed/Huawei DB |
| **GaussDB / GaussDB(DWS)** | Distributed / warehouse | Huawei DB / analytics | Simple → RDS |
| **DDS / GeminiDB / Redis / Elasticsearch** | Document / NoSQL / cache / search | Those engines | — |
| **DMS / Kafka / RabbitMQ** | Messaging | Event bus | — |
| **MRS / DLI / DataArts** | Hadoop / serverless SQL / data ops | Big data | Tiny → Function + OBS |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Network | Always | — |
| **ELB** | Load balancing | Entry | — |
| **CDN / WAF / Anti-DDoS** | Edge | Public HTTP | Internal |
| **Direct Connect / VPN / Enterprise Router / Cloud Connect** | Hybrid / hub | Hybrid / multi-VPC | VPN labs |
| **NAT / EIP / Private Link / VPC Endpoint** | Egress / public / private | Those jobs | — |
| **API Gateway / DNS** | API / DNS | Those jobs | — |

## Identity, ops, AI

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IAM (+ agencies / federation)** | AuthZ | Always | Long-lived AK/SK for humans |
| **Organizations / CTS (Cloud Trace)** | Multi-account / audit | Landing zone + trail | — |
| **DEW / KMS / CSMS / CCM** | Keys / secrets / certs | Runtime secrets | Secrets in code |
| **CES / LTS / APM** | Metrics / logs / APM | Default | — |
| **SWR** | Container registry | CCE images | — |
| **ModelArts / Pangu / AI APIs** | ML / FM | GenAI + train | DIY CCE when constrained |

## How to use

1. Public Huawei Cloud vs **Cloud Stack/HCS** — different control planes.  
2. Job → When / Why not.  
3. Wire IAM/VPC in [11](../11_Huawei_Cloud.md).  
4. [Support docs](https://support.huaweicloud.com/intl/en-us/index.html) for API/limits.

## References

- [Huawei Cloud products](https://www.huaweicloud.com/intl/en-us/product/)  
