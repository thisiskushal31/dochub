# 33 — AI and ML platforms on cloud (when which)

[← README](./README.md) · [Serverless →](./31_Serverless_Functions_And_Containers.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md) · [CiCd/22 MLOps](../CiCd/22_MLOps_And_AI_System_Delivery.md)

## Mental map

```text
AI workload spectrum (same as delivery spectrum, different artifacts)
  Legacy / classical ML     → train+serve your model (SageMaker / Vertex training / Azure ML)
  Mainstream app + API      → call a managed foundation-model API (Bedrock / Vertex Gemini / Azure OpenAI)
  Distributed training/serve→ GPU fleets, HyperPod / GKE / VMSS GPU ([Datacenter Accelerators](../Datacenter/Accelerators/README.md) for metal)
  Agentic / RAG apps        → model API + your orchestration (Functions/Run/K8s) + retrieval store
```

*What to notice: Cloud literacy is **which product family**. Model science → [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive). Delivery loop → [CiCd/22](../CiCd/22_MLOps_And_AI_System_Delivery.md).*

## 1. Concepts — product families

| Family | Job | AWS | GCP | Azure |
|--------|-----|-----|-----|-------|
| **Managed foundation-model API** | Prompt / chat / embeddings / agents with provider-hosted models | **Amazon Bedrock** | **Vertex AI** (Gemini + Model Garden APIs) | **Azure OpenAI** / **Microsoft Foundry** model deploy |
| **ML platform (train/tune/deploy custom)** | Notebooks, training jobs, endpoints, ModelOps | **SageMaker AI** | **Vertex AI** (training, prediction, pipelines) | **Azure Machine Learning** |
| **GPU compute you operate** | Full control of containers/drivers | EC2 GPU + EKS; SageMaker HyperPod | GCE GPU; **GKE** | GPU VMs; **AKS** |
| **App glue in front of models** | Auth, tools, RAG, business logic | Lambda / Fargate / EKS | Cloud Run / Functions / GKE | Functions / Container Apps / AKS |

### When which (hot-path decisions)

| If you need… | Prefer | Official framing |
|--------------|--------|------------------|
| Fast GenAI feature; provider models; minimal infra | **Bedrock / Vertex GenAI / Azure OpenAI (Foundry)** | [Bedrock vs SageMaker](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/bedrock-or-sagemaker.html); [GCP GenAI infra](https://cloud.google.com/docs/generative-ai/choose-models-infra-for-ai) |
| Custom/proprietary model; fine-tune; control latency/cost knobs on endpoints | **SageMaker / Vertex training+endpoints / Azure ML** | Same guides |
| Large-scale distributed train/serve on GPUs you tune | **GPU on GKE/EKS/AKS or HyperPod-class** | Ops-heavy; need GPU quotas ([18](./18_Compute_Instances_And_Autoscaling.md)) |
| Thin API that calls a model | **Function or Cloud Run / Container Apps** in front ([31](./31_Serverless_Functions_And_Containers.md)) | Don’t stand up K8s for a proxy |
| Hosted agent runtime | Bedrock Agents / Vertex Agent Engine / Foundry Hosted Agents | Move to your container/K8s when you outgrow |

**Disconfirm:** “We use AI” is **not** a platform choice. Bedrock is **not** SageMaker. Calling OpenAI from a VM is **not** Azure OpenAI governance.

**Confirm:** Are you consuming a **hosted FM API** or **operating training/serving infra**? Where do prompts, tools, and PII go (IAM + network)?

## 2. Advanced concepts

### Spectrum aligned to CiCd/22

| Band | Cloud pattern |
|------|---------------|
| **Legacy / classical** | Train sklearn/XGBoost-class on managed training jobs or a GPU VM; deploy endpoint or batch |
| **Mainstream GenAI app** | App on Run/Functions/K8s → Bedrock/Vertex/Azure OpenAI; RAG over object/vector store |
| **Distributed** | Multi-GPU training; multi-replica inference; queues between stages |
| **Assisted / agentic** | Agents + tools + policy; still need identity, audit, budgets ([15](./15_Org_IAM_And_Identity_Federation.md), [20](./20_FinOps_And_Cost_Controls.md), [30](./30_Cloud_Observability_And_Audit_Doors.md)) |

### IAM and data for AI

| Concern | Pattern |
|---------|---------|
| Who may invoke the model API | Least-privilege role on Bedrock/Vertex/Azure OpenAI deployment |
| Training data buckets | Private object + CMK ([24](./24_Object_Block_And_File_Storage.md), [26](./26_Secrets_KMS_And_Encryption.md)) |
| Egress of prompts | Private networking / VPC endpoints where required ([16](./16_VPC_And_Network_Constructs.md), [17](./17_Private_Connectivity_And_On_Ramps.md)) |
| Cost | Token + GPU spend; budgets mandatory ([20](./20_FinOps_And_Cost_Controls.md)) |

### Other providers (recognize)

| Cloud | Typical AI literacy names |
|-------|---------------------------|
| OCI | OCI Generative AI / Data Science services (read current docs) |
| IBM | watsonx |
| Aliyun / Tencent / Huawei | Regional PAI / TI / ModelArts-class platforms — China residency often drives choice |
| OVH / OTC | Smaller catalogs — often DIY on GPU instances + open models |

### Failure modes

| Failure | Impact |
|---------|--------|
| GPU quota ignored | Launch-day failure |
| Public training buckets | Data incident |
| One huge prompt with secrets | Leak via logs/providers |
| K8s for a single Chat Completions proxy | Ops tax without benefit |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Chat feature in existing SaaS | App → managed FM API; store transcripts per policy |
| Fine-tuned domain model | SageMaker/Vertex/Azure ML train → managed endpoint |
| High-QPS custom inference | GKE/EKS/AKS GPU pool |
| Batch scoring | Training platform batch transform / Vertex batch / Azure ML batch |
| Delivery gates | Model registry + promote ([CiCd/22](../CiCd/22_MLOps_And_AI_System_Delivery.md)) |

**Staff checklist**

- FM API vs custom train/serve named  
- IAM on model invoke + data buckets  
- Quotas and $ budgets set  
- Eval/rollback story for prompts and models  
- Door to DS/AI and CiCd/22 for depth  

**Good:** managed FM for product features; platform for custom models; K8s GPU when needed. **Bad:** ungoverned keys to a public model API; GPU nodes with Owner role.

## References

- [Bedrock or SageMaker](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/bedrock-or-sagemaker.html) · [Bedrock](https://docs.aws.amazon.com/bedrock/) · [SageMaker](https://docs.aws.amazon.com/sagemaker/)  
- [GCP choose GenAI infra](https://cloud.google.com/docs/generative-ai/choose-models-infra-for-ai) · [Vertex AI](https://cloud.google.com/vertex-ai/docs)  
- [Azure OpenAI](https://learn.microsoft.com/azure/ai-services/openai/) · [Azure ML](https://learn.microsoft.com/azure/machine-learning/) · [Microsoft Foundry agents](https://learn.microsoft.com/azure/ai-foundry/)  
- [CiCd/22](../CiCd/22_MLOps_And_AI_System_Delivery.md) · [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive)  
