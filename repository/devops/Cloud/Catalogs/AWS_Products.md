# AWS — product catalog (what / when / why not)

[← Catalogs](./README.md) · [AWS literacy →](../5_AWS_Literacy.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for AWS. Deeper API: [AWS docs](https://docs.aws.amazon.com/).*

## Compute

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **EC2** | VMs you control | Lift/shift, custom OS, steady fleets, GPU boxes | You only need a function or a container API → Lambda / App Runner / Fargate |
| **EC2 Auto Scaling** | Scale EC2 fleets | Stateless fleets behind LB | Stateful single instance without design |
| **Lightsail** | Simple VPS-like bundles | Tiny sites, learning, fixed price comfort | Complex VPC/IAM estates → EC2/VPC |
| **Lambda** | Event-driven functions | Glue, webhooks, short jobs, API backends with API GW | >timeout, long sockets, huge custom runtime → Fargate / EC2 |
| **Fargate** | Containers without nodes | Services/tasks that need a full image, longer run | Need Kubernetes API → EKS; tiny glue → Lambda |
| **App Runner** | Easy HTTP container service | Simple web/API from image/source | Complex networking/mesh → EKS/ECS |
| **ECS** | AWS-native container orchestrator | Want tasks/services without kube API | Team standardized on Kubernetes → EKS |
| **EKS** | Managed Kubernetes control plane | Need K8s API, Helm, operators | No kube skills / simple API → App Runner/Fargate/Lambda |
| **ROSA** | Managed OpenShift on AWS | OpenShift API required | Vanilla K8s is enough → EKS |
| **Batch** | Queue of compute jobs | HPC-ish / batch arrays | Simple cron → Lambda/EventBridge |
| **Elastic Beanstalk** | PaaS-ish app deploy | Teams that want upload-and-run | Need explicit infra → ECS/EKS/EC2 + IaC |
| **Outposts / Wavelength / Local Zones** | AWS hardware near you / edge | Latency or data residency at edge | Default regions suffice |

## Storage

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **S3** | Object storage | Artifacts, lakes, backups, static sites | Need POSIX shared FS → EFS/FSx; block for DB → EBS |
| **S3 Glacier / Deep Archive** | Cold object tiers | Compliance archives | Hot reads → standard S3 classes |
| **EBS** | Block disks for EC2 | DB/data on VMs | Multi-AZ shared file → EFS/FSx |
| **EFS** | NFS shared file | Lift shared home/CMS | Extreme perf / SMB Windows → FSx |
| **FSx** | Managed specialty FS (Windows, Lustre, NetApp, OpenZFS) | Those protocols/perf needs | Simple NFS → EFS |
| **Storage Gateway** | Hybrid file/volume/tape to S3 | On-prem bridge | Pure cloud → S3/EFS direct |
| **AWS Backup** | Central backup policies | Fleet-wide backup governance | Single-service snapshots only for tiny estates |
| **Elastic Disaster Recovery (DRS)** | Block-level DR | Lift DR to AWS | App-level DB replica may be enough |

## Database & analytics (recognize; engines → Databases-Deep-Dive)

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **RDS** | Managed MySQL/Postgres/Maria/SQL Server/Oracle/… | Standard OLTP with provider patches | Need Aurora features / extreme scale → Aurora; exotic engine → EC2 |
| **Aurora** | Cloud-native MySQL/Postgres-compatible | Higher availability / storage scaling | Cost-sensitive tiny DB → RDS |
| **DynamoDB** | Managed key-value / document | Massive scale, serverless access patterns | Relational queries → RDS; need joins everywhere |
| **ElastiCache / MemoryDB** | Managed Redis/Memcached | Cache / session / hot KV | App-local cache only for single instance |
| **DocumentDB** | MongoDB-compatible managed | Mongo API with AWS ops | True Mongo Atlas elsewhere by policy |
| **Neptune** | Graph DB | Graph queries | Relational is enough |
| **Keyspaces** | Cassandra-compatible | CQL at AWS | Self-managed Cassandra on EC2 only if you must |
| **Timestream** | Time series | IoT/metrics TSDB | CloudWatch/Prometheus may suffice |
| **QLDB** | Ledger | Cryptographically verifiable history | Normal audit logs enough → CloudTrail + DB |
| **Redshift** | Warehouse | BI/SQL analytics at scale | Ad-hoc small → Athena on S3 |
| **Athena** | SQL on S3 | Serverless query on lakes | Heavy ETL warehouse → Redshift/EMR |
| **Glue** | ETL / catalog | Pipelines + Data Catalog | Simple copy → DMS/scripts |
| **EMR** | Managed Hadoop/Spark | Big data frameworks | Prefer Spark elsewhere / Glue jobs |
| **Kinesis Data Streams / Firehose / Data Analytics** | Streaming ingest | Real-time pipelines | Low volume → SQS/EventBridge |
| **OpenSearch Service** | Search/logs analytics | Full-text / log UI | Cheap logs → CloudWatch Logs Insights |
| **QuickSight** | BI dashboards | AWS-native BI | Org standard is Looker/Power BI/etc. |
| **MSK** | Managed Kafka | Kafka protocol on AWS | SQS/Kinesis enough for simpler needs |

## Networking & edge

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **VPC** | Private network | Always for prod | — |
| **ELB (ALB/NLB/GWLB)** | Load balancing | HTTP(S) / TCP / appliances | Single instance public IP forever |
| **API Gateway** | HTTP/WebSocket/REST front for APIs | External API + auth throttling | Internal only mesh → service connect/mesh |
| **CloudFront** | CDN | Global HTTP cache/edge | Internal-only apps |
| **Route 53** | DNS + health routing | Public/private zones, failover | Corporate DNS elsewhere with care |
| **Global Accelerator** | Anycast entry to regions | Static IPs / global TCP/UDP entry | CloudFront enough for HTTP |
| **Direct Connect** | Private circuit to AWS | Stable hybrid bandwidth | VPN OK for non-critical |
| **Site-to-Site / Client VPN** | IPsec / remote access | Bootstrap hybrid, admin access | Prod data plane → DX diversity |
| **Transit Gateway** | Hub for many VPCs/VPN/DX | Large multi-VPC | Few VPCs → peering |
| **PrivateLink** | Private SaaS/endpoints | Keep traffic off public internet | Public endpoints acceptable |
| **VPC Lattice / App Mesh / Cloud Map** | Service networking / mesh | Microservices discovery | Simple ALB enough |

## Security, identity, compliance

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **IAM + Identity Center** | AuthZ / SSO | Always | Long-lived IAM users for humans |
| **Cognito** | App user directories | Customer-facing auth | Workforce → Identity Center/Entra |
| **KMS** | Keys / CMK | Encryption control | Platform keys OK only if policy allows |
| **Secrets Manager / SSM Parameter Store** | Secrets / config | Runtime secrets | Secrets in git/images |
| **WAF / Shield** | Edge protect / DDoS | Public HTTP | Internal-only |
| **GuardDuty / Inspector / Macie / Security Hub** | Detection / findings | Security program | Ignoring trails |
| **CloudTrail** | API audit | Always org-wide | — |
| **Config** | Resource compliance drift | Guardrails as code | Tiny sandbox |
| **Certificate Manager (ACM)** | Public TLS certs | ALB/CloudFront certs | Private PKI elsewhere |

## Integration & frontends

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **SQS** | Queue | Decouple workers | Need ordering/stream → Kinesis; pub-sub fanout → SNS |
| **SNS** | Pub/sub fanout | Alerts, fanout | Complex routing → EventBridge |
| **EventBridge** | Event bus | SaaS/AWS events, schedules | Simple cron → EventBridge Scheduler alone still OK |
| **Step Functions** | Workflows | Multi-step orchestration | Single Lambda enough |
| **MQ** | Managed brokers (ActiveMQ/Rabbit) | Classic broker protocols | SQS/Kafka preferred greenfield |
| **AppSync** | GraphQL API | GraphQL managed | REST + API GW enough |
| **Amplify** | Front-end hosting + helpers | Web/mobile jumpstart | Full custom front on S3/CloudFront/ECS |

## Developer / delivery

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **CodePipeline / CodeBuild / CodeDeploy** | CI/CD on AWS | AWS-native pipelines | GitHub Actions/GitLab already paved |
| **CodeCatalyst** | Unified DevOps spaces | New AWS-centric teams | Existing CI home |
| **ECR** | Container registry | Images for ECS/EKS/Lambda | — |
| **CloudFormation / CDK / Service Catalog** | IaC / products | AWS-native IaC | Terraform/OpenTofu estate → IAC folder |

## Management, observability, cost

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **CloudWatch** | Metrics/logs/alarms | Default platform signals | Multi-cloud APM only → still keep CW for AWS SKUs |
| **X-Ray** | Traces | Distributed tracing AWS-native | OTel→backend already chosen |
| **AMP / Managed Grafana** | Prom + Grafana managed | Prom culture without ops | Tiny estate → CloudWatch only |
| **Systems Manager** | Patch/session/ops | Fleet ops without SSH sprawl | — |
| **Organizations / Control Tower** | Multi-account | Landing zones | Single account forever |
| **Cost Explorer / Budgets / Compute Optimizer** | FinOps | Always for prod | — |

## AI / ML

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Bedrock** | Hosted foundation models / agents | GenAI features fast | Custom train/serve control → SageMaker |
| **SageMaker AI** | Train/tune/deploy custom ML | Proprietary models, ModelOps | Simple FM call → Bedrock |
| **Rekognition / Comprehend / Textract / Polly / Transcribe / Translate** | Vertical AI APIs | That modality without training | Custom model needed |
| **Personalize / Forecast / Fraud Detector / Kendra** | Specialized ML products | Those domains | Generic Bedrock/SageMaker enough |
| **Bedrock Agents / AgentCore patterns** | Agentic apps | Tool-using agents on AWS | DIY agent on EKS when you outgrow |

## Migration / hybrid / other (short)

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **DMS** | DB migration/replication | Move/replicate DBs | App rewrite migration |
| **MGN** | Lift-and-shift servers | Rehost VMs | Replatform to containers first |
| **Transfer Family** | SFTP/FTPS/AS2 into S3 | Partner file drop | Simple S3 pre-signed |
| **IoT Core / Greengrass** | Device fleets | IoT | Not IoT |
| **Media Services / Elemental** | Video pipelines | Streaming media | Simple files → S3+CloudFront |
| **WorkSpaces / AppStream** | VDI / streamed apps | Managed desktops | Laptop fleet OK |
| **GameLift** | Game servers | Multiplayer hosting | Custom EC2/EKS |

## How to use this page

1. Find the **job** (compute, data, AI…).  
2. Read **When / Why not**.  
3. Open [5 AWS literacy](../5_AWS_Literacy.md) for IAM/VPC wiring.  
4. Click [AWS docs](https://docs.aws.amazon.com/) only for API/limits.

## References

- [AWS products](https://aws.amazon.com/products/) · [Decision guides](https://docs.aws.amazon.com/decision-guides/) · [docs.aws.amazon.com](https://docs.aws.amazon.com/)  
