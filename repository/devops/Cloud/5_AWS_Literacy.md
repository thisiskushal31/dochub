# 5 — Amazon Web Services (AWS) literacy

[← Previous](./4_GCP_Literacy.md) · [README](./README.md) · [Next: Azure →](./6_Azure_Literacy.md)

---

## 1. Concepts

AWS’s isolation unit is the **account**, grouped under an **organization** (OUs). Many teams use **one account per environment** (or per product+env) because IAM and blast radius are account-scoped. Resources live in a **region**; some (IAM, Route 53, CloudFront) are global-ish.

### Identity

| Principal | Use |
|-----------|-----|
| IAM user | Avoid for humans; SSO via IAM Identity Center |
| **IAM role** | Workloads, CI, cross-account |
| Instance / task / **IRSA** | EC2 / ECS / EKS pod identities |

Policies attach to identities or resources. Prefer roles with **sts:AssumeRole** and tight trust (OIDC `sub` for CI). Long-lived access keys in pipelines are the anti-pattern ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

### Compute — when which

| Product | Job |
|---------|-----|
| **EC2** | VMs; **Auto Scaling groups** for fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **ECS** | AWS-native orchestrator (EC2 or Fargate tasks) — not Kubernetes |
| **EKS** | Managed Kubernetes control plane ([3](./3_Managed_Kubernetes.md)) |
| **ROSA** | Managed **OpenShift** on AWS ([OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift)) — not EKS |
| **EC2 + kubeadm / kops / CAPI** | Self-managed Kubernetes on AWS VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |
| **Lambda** | Event/function grain |
| **Fargate / App Runner** | Serverless containers without nodes |

ECS vs EKS is an org choice, not a default. If you need the Kubernetes API (Helm, operators, multi-cloud skills), EKS or unmanaged K8s. If you only need tasks on AWS, ECS is less API surface.

### Data and glue (names)

| Job | Product |
|-----|---------|
| Object storage | S3 |
| Images | ECR |
| Secrets | Secrets Manager (or SSM Parameter Store) |
| Logs / metrics | CloudWatch |
| SQL / warehouse doors | RDS, DynamoDB, Redshift — [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) |

---

## 2. Advanced concepts

### Network

**VPC** is regional. Subnets are AZ-scoped. **ALB** (L7) vs **NLB** (L4). **NAT Gateway** is easy to overspend. **Route 53** for DNS; **CloudFront** for CDN. Security groups are stateful allow-lists; NACLs are stateless extra fences — most estates live on SGs.

EKS and self-managed clusters need private subnets for nodes, a path for the API (public or private endpoint), and the **AWS cloud controller** so `LoadBalancer` Services and volumes work.

### IRSA and OIDC

**IAM Roles for Service Accounts** map a Kubernetes SA to an IAM role via the cluster OIDC issuer. Same idea as CI OIDC: the trust policy must constrain `sub` (namespace and SA name), not “any pod in the cluster.”

### Organizations and SCPs

Service Control Policies cap what even account admins can do (e.g. deny leaving the org, deny unencrypted S3). Use them as the outer fence.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| HTTP API | ALB + ECS/Fargate or EKS + Ingress |
| Classic fleet | ASG + ALB + immutable AMIs |
| CI deploy | GitHub/GitLab OIDC → IAM role |
| K8s without EKS | kops / kubeadm / CAPI on EC2 ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |

**Staff checklist**

- Account strategy (env vs blast radius) written down  
- No static IAM keys in CI  
- IRSA (or equivalent) for in-cluster AWS calls  
- NAT/egress cost visible; nodes private  

**Good:** org + Identity Center + OIDC roles. **Bad:** root keys, one account, `AdministratorAccess` on the node instance profile.

---

## References

- [AWS documentation](https://docs.aws.amazon.com/)  
- [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/)  
- [IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/)  
- [EKS user guide](https://docs.aws.amazon.com/eks/latest/userguide/)  
- [ROSA](https://docs.openshift.com/rosa/welcome/index.html)  
- [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/)  
- [OIDC with AWS (Actions)](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)  
