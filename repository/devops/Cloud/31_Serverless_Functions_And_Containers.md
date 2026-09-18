# 31 — Serverless compute — functions vs containers (when which)

[← README](./README.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md) · [AI platforms →](./33_AI_And_ML_Platforms_On_Cloud.md)

## Mental map

```text
Event / HTTP request
    ├─► Function (FaaS)     — code zip / small image; short-lived; event model
    ├─► Serverless container — full container; request/revision; scale-to-zero common
    └─► Not serverless      — VM fleet / managed K8s when you need the control plane
```

*What to notice: “serverless” is a **billing and ops shape**, not a religion. Pick by unit of deploy, timeout, and identity—not by fashion.*

## 1. Concepts

| Shape | Unit you ship | Typical products |
|-------|---------------|------------------|
| **Function (FaaS)** | Handler + trigger | AWS Lambda; GCP Cloud Functions / Cloud Run functions; Azure Functions; OCI Functions; Aliyun FC; Tencent SCF |
| **Serverless container** | Container image as a service | AWS Fargate / App Runner; GCP Cloud Run; Azure Container Apps; similar regional SKUs |
| **Managed containers on nodes** | Tasks on a cluster you still feel | ECS on EC2; GKE/EKS/AKS ([3](./3_Managed_Kubernetes.md)) |

### When which (durable decision table)

| If you need… | Prefer | Avoid |
|--------------|--------|-------|
| Event glue, webhooks, short jobs (seconds–minutes) | **Function** | Running a full K8s cluster for one cron |
| HTTP API as a container, scale-to-zero, custom runtime | **Serverless container** | Forcing FaaS when you need long sockets / big image |
| Long-running process, WebSocket farm, >FaaS timeout | Fargate-class / Cloud Run with min instances / **K8s or VMs** | Stretching Lambda past limits |
| Kubernetes API, operators, complex networking | **Managed K8s** | Pretending Cloud Run is GKE |
| Classic lift of systemd apps | **VM fleets** ([18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md)) | Rewrite to Lambda on day one |

**Disconfirm:** Cloud Run / Container Apps / Fargate are **not** “tiny Kubernetes.” Lambda is **not** a general app server.

**Confirm:** What is the max execution time? Is the unit a function handler or a container? Who holds the runtime identity ([15](./15_Org_IAM_And_Identity_Federation.md))?

Official decision framing examples: [AWS choosing serverless](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-serverless-service.html) · [GCP Cloud Run vs GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/gke-and-cloud-run) · [Azure container options](https://learn.microsoft.com/azure/container-apps/compare-options).

## 2. Advanced concepts

### Cross-cloud name map

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| FaaS | Lambda | Cloud Functions (gen2 often on Run under the hood) | Azure Functions | OCI Functions; Aliyun FC; Tencent SCF; IBM Cloud Functions |
| Serverless container | Fargate, App Runner | Cloud Run | Container Apps | Regional equivalents |
| Orchestrate steps | Step Functions | Workflows | Logic Apps / Durable Functions | Provider workflow SKUs |

### Identity and deploy

| Concern | Pattern |
|---------|---------|
| Runtime cloud API calls | Function/service role or runtime SA — not keys in env ([15](./15_Org_IAM_And_Identity_Federation.md)) |
| CI publish | OIDC → role that can update function/service only |
| Secrets | Inject from secrets manager ([26](./26_Secrets_KMS_And_Encryption.md)) |
| Networking | VPC connector / private integration when talking to private DB ([16](./16_VPC_And_Network_Constructs.md)) |

### Failure modes

| Failure | Impact |
|---------|--------|
| Timeout surprises | Partial work; retries amplify load |
| Cold start ignored | Latency SLOs broken |
| Giant “one Lambda does everything” | Untestable ball of mud |
| Public function URL + over-broad role | Instant compromise |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| S3/GCS upload → thumbnail | Function trigger |
| Public API, container already exists | Cloud Run / Container Apps / App Runner |
| AI glue calling a model API | Function or Run in front of Bedrock/Vertex/Azure AI ([33](./33_AI_And_ML_Platforms_On_Cloud.md)) |
| Always-on microservice with sidecars | K8s or Container Apps/GKE — not FaaS |

**Staff checklist**

- Shape named (FaaS vs serverless container vs K8s vs VM)  
- Timeout and concurrency documented  
- Runtime identity least-privilege  
- Observability on invocations ([30](./30_Cloud_Observability_And_Audit_Doors.md))  

**Good:** event-sized functions; container services for APIs. **Bad:** Lambda as the entire monolith; keys in environment variables.

## References

- [AWS Lambda](https://docs.aws.amazon.com/lambda/) · [Choosing AWS serverless](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-serverless-service.html)  
- [Cloud Functions](https://cloud.google.com/functions/docs) · [Cloud Run](https://cloud.google.com/run/docs) · [GKE and Cloud Run](https://cloud.google.com/kubernetes-engine/docs/concepts/gke-and-cloud-run)  
- [Azure Functions](https://learn.microsoft.com/azure/azure-functions/) · [Container Apps compare](https://learn.microsoft.com/azure/container-apps/compare-options)  
