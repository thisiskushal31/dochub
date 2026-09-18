# 5 — Amazon Web Services (AWS) literacy

[← Previous](./4_GCP_Literacy.md) · [README](./README.md) · [Next: Azure →](./6_Azure_Literacy.md) · [Full catalog](./Catalogs/AWS_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md) · [LB](./23_Load_Balancing_Ingress_And_TLS.md)

## Mental map — Floor 1 jobs on AWS

| Job | AWS wiring | Depth |
|-----|------------|-------|
| Isolation | Organization → OU → **account** | [15](./15_Org_IAM_And_Identity_Federation.md), [29](./29_Landing_Zones_And_Org_Guardrails.md) |
| Identity | IAM Identity Center; IAM roles; IRSA | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | Regional VPC; SG (+ optional NACL) | [16](./16_VPC_And_Network_Constructs.md) |
| LB / TLS | ALB (L7) / NLB (L4); ACM | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| DNS / CDN | Route 53; CloudFront | [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| Compute | EC2 + ASG; ECS; EKS; Lambda; Fargate | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Storage | S3; EBS; EFS/FSx | [24](./24_Object_Block_And_File_Storage.md) |
| Secrets / KMS | Secrets Manager / SSM; KMS | [26](./26_Secrets_KMS_And_Encryption.md) |
| Registry | ECR | [27](./27_Container_Registries_And_Artifacts.md) |
| Audit | CloudTrail | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Metrics / logs / traces | CloudWatch + X-Ray; AMP + Managed Grafana optional | [30](./30_Cloud_Observability_And_Audit_Doors.md) |

## 1. Concepts

AWS’s isolation unit is the **account**, grouped under an **organization** (OUs). Many teams use **one account per environment** (or per product+env) because IAM and blast radius are account-scoped. Resources live in a **region**; some (IAM, Route 53, CloudFront) are global-ish.

### Identity and permissions

| Principal | Use |
|-----------|-----|
| IAM user | Avoid for humans; SSO via IAM Identity Center |
| **IAM role** | Workloads, CI, cross-account |
| Instance / task / **IRSA** | EC2 / ECS / EKS pod identities |

Policies attach to identities or resources. Prefer roles with **sts:AssumeRole** and tight trust (OIDC `sub` for CI). Long-lived access keys in pipelines are the anti-pattern ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)). **SCPs** are the outer fence ([29](./29_Landing_Zones_And_Org_Guardrails.md)).

### Compute — when which

| Product | Job |
|---------|-----|
| **EC2** | VMs; **Auto Scaling groups** for fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **ECS** | AWS-native orchestrator (EC2 or Fargate tasks) — not Kubernetes |
| **EKS** | Managed Kubernetes control plane ([3](./3_Managed_Kubernetes.md)) |
| **ROSA** | Managed **OpenShift** on AWS — not EKS |
| **EC2 + kubeadm / kops / CAPI** | Self-managed Kubernetes on AWS VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |
| **Lambda** | Event/function grain |
| **Fargate / App Runner** | Serverless containers without nodes |

ECS vs EKS is an org choice ([28](./28_Deployment_Shapes_On_Cloud.md)). If you need the Kubernetes API, EKS or unmanaged K8s. If you only need tasks on AWS, ECS is less API surface.

### Data and glue (names)

| Job | Product |
|-----|---------|
| Object storage | S3 |
| Images | ECR |
| Secrets | Secrets Manager (or SSM Parameter Store) |
| Logs / metrics | CloudWatch |
| SQL / warehouse doors | RDS, DynamoDB, Redshift — [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) |

## 2. Advanced concepts

### Network and entry

**VPC** is regional. Subnets are AZ-scoped. **ALB** (L7) vs **NLB** (L4) vs Gateway Load Balancer — pick by job ([23](./23_Load_Balancing_Ingress_And_TLS.md)). **NAT Gateway** is easy to overspend ([20](./20_FinOps_And_Cost_Controls.md)). **Route 53** for DNS; **CloudFront** for CDN ([25](./25_DNS_CDN_And_Edge_HTTP.md)). Security groups are stateful allow-lists; NACLs are optional extra fences.

EKS and self-managed clusters need private subnets for nodes, a path for the API (public or private endpoint), and the **AWS cloud controller** so `LoadBalancer` Services and volumes work.

### IRSA and OIDC

**IAM Roles for Service Accounts** map a Kubernetes SA to an IAM role via the cluster OIDC issuer. Same idea as CI OIDC: constrain `sub` (namespace and SA name), not “any pod in the cluster” ([15](./15_Org_IAM_And_Identity_Federation.md)).

### Organizations and SCPs

Service Control Policies cap what even account admins can do (deny leaving the org, deny unencrypted S3, region allow-lists).

### Quirks vs other majors

| Quirk | Meaning |
|-------|---------|
| Account = blast radius | Heavier multi-account culture than single-project shops |
| ALB vs NLB settings | Health checks, idle timeout, sticky — job knobs differ from GCP HTTP LB UI |
| Global services | IAM/R53/CloudFront mental model ≠ regional VPC |

### How you grant permission on AWS (quick)

1. Humans via **IAM Identity Center** (SSO) — not IAM users with keys.  
2. Create an **IAM role** + least-privilege **policies**.  
3. Trust policy: who may `AssumeRole` (account, service, **OIDC**).  
4. CI: OIDC IdP → deploy role.  
5. EKS pods: **IRSA**.  
6. Outer fence: **SCPs**.  

Full job: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on AWS

| Need | Product | See |
|------|---------|-----|
| Single/group VMs | EC2 (+ ASG) | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Event function | Lambda | [31](./31_Serverless_Functions_And_Containers.md) |
| Serverless container | Fargate / App Runner | [31](./31_Serverless_Functions_And_Containers.md) |
| AWS-native orchestrator | ECS | [28](./28_Deployment_Shapes_On_Cloud.md) |
| Kubernetes API | EKS (OpenShift: ROSA) | [3](./3_Managed_Kubernetes.md) |
| Managed relational | RDS / Aurora | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| DB you patch | EC2 + EBS | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| GenAI hosted FM | **Amazon Bedrock** | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Custom train/serve | **SageMaker AI** | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Distributed GPU | EC2/EKS GPU; HyperPod-class | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Platform metrics/logs/traces | CloudWatch + X-Ray; CloudTrail for audit | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Managed Prometheus / Grafana | AMP + Amazon Managed Grafana | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Full N-tier system | Wire [34](./34_Multi_Tier_And_Reference_Topologies.md) | |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| HTTP API | ALB + ECS/Fargate or EKS + Ingress |
| Classic fleet | ASG + ALB + immutable AMIs |
| CI deploy | GitHub/GitLab OIDC → IAM role |
| K8s without EKS | kops / kubeadm / CAPI on EC2 |

**Staff checklist**

- Account strategy (env vs blast radius) written down  
- No static IAM keys in CI  
- IRSA (or equivalent) for in-cluster AWS calls  
- NAT/egress cost visible; nodes private  
- SCPs on for outer fence  

**Good:** org + Identity Center + OIDC roles. **Bad:** root keys, one account, `AdministratorAccess` on the node instance profile.

## References

- **Choose surface:** [AWS product catalog (what / when / why not)](./Catalogs/AWS_Products.md)  
- [AWS documentation](https://docs.aws.amazon.com/) *(API depth after you chose)*  
- [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/) · [Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/)  
- [EKS](https://docs.aws.amazon.com/eks/latest/userguide/) · [ROSA](https://docs.openshift.com/rosa/welcome/index.html)  
- [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/) · [ELB](https://docs.aws.amazon.com/elasticloadbalancing/)  
- [OIDC with AWS (Actions)](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)  
