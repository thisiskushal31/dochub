# MLOps and AI system delivery

[← Back to CI/CD](./README.md)

Shipping **models and AI systems** uses the same delivery jobs as apps — artifact, promote, verify, rollback — with extra stages for **data, training, evaluation, and serving**. Covers **single-node** (one GPU/CPU box) and **distributed** training/inference. This is the DevOps/CiCd view; ML science depth lives in [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive); feature/table pipelines in [Data-Engineering](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive).

Primary pattern reference: [Google — MLOps: Continuous delivery and automation pipelines in machine learning](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning). Assisted-coding in app CI is separate: [Methodologies/19](../Methodologies/19_Durable_Mindsets_And_Evolving_Toolsets.md), [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md).

## Two pipelines (do not conflate)

| Pipeline | Produces | Deploys |
|----------|----------|---------|
| **ML training / CT pipeline** | Evaluated **model artifact** (+ metrics) into a **model registry** | Not always user traffic |
| **Model serving CD** | Prediction **service** (online API) or **batch** job using a registered version | User-facing or downstream jobs |
| **App CI/CD** | Application that *calls* the model | Same as [1](./1_Pipelines_Build_Test_Deploy.md) |

Level-2 MLOps (Google’s framing) continuously delivers **pipeline code** that retrains and can redeploy serving when data or code changes.

## Durable ML delivery loop

```text
Data validation → train (single or distributed) → evaluate
  → register model version (metrics + lineage)
  → approval / policy gate
  → deploy serving (online endpoint and/or batch)
  → monitor quality (drift, latency, error) → retrain trigger
```

App gates still apply to training code and serving images: tests, SCA, sign, SBOM ([15](./15_Pipeline_Security_And_Gates.md), [6](./6_Supply_Chain_And_Signing.md)).

## Artifacts (AI-specific)

| Artifact | Role |
|----------|------|
| **Dataset / feature snapshot** | Reproducible train/eval (versioned) |
| **Model binary / weights** | Version in **model registry** (like an app registry for models) |
| **Serving image** | Runtime that loads a model version (digest-pinned) |
| **Pipeline definition** | Training DAG (orchestrator) — version like app code |

Promote **model version IDs** the way you promote image digests ([4](./4_Artifacts_And_Registries.md)). Never “overwrite prod weights in place” without a version.

## Single-node vs distributed

| Mode | Delivery implications |
|------|------------------------|
| **Single-node train/serve** | One machine/GPU; simpler CI runner or VM ([18](./18_VM_MIG_And_Host_Based_Deploy.md)); still registry + smoke |
| **Distributed training** | Multi-worker/GPU jobs; orchestrator (K8s Job/operators, cloud training); artifact is still one registered model |
| **Distributed inference** | Replicas behind LB / MIG / K8s; same progressive strategies ([3](./3_Deployment_Strategies.md), [9](./9_Progressive_Delivery_Controllers.md)); watch **tail latency** and GPU saturation |
| **Batch inference** | Scheduled job reads inputs (object store/warehouse), writes predictions; CD = job definition + model version |

Scalable AI **is** a distributed systems problem: partitioning, retries, backpressure, observability — System Design + Observability doors apply.

## Online vs batch serving

| Mode | Verify in CD |
|------|----------------|
| **Online** | Deploy endpoint → latency/error smoke + canary on traffic |
| **Batch** | Run job on holdout slice → compare metrics to threshold → promote schedule |

Feature stores (when used) need **training/serving skew** checks — same features offline and online ([Google MLOps feature store notes](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)).

## Classical through modern hosting for models

| Host | Notes |
|------|-------|
| **VM / MIG** | TorchServe/TF Serving/custom systemd — [18](./18_VM_MIG_And_Host_Based_Deploy.md), [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| **Compose / Swarm** | Small stacks — [21](./21_Compose_And_Swarm_Delivery.md) |
| **Kubernetes** | Deployments/Rollouts + GPU operators — Containerization |
| **Managed endpoints** | Cloud model services — still pin model version + app contract tests |

## Gates that differ from pure app CD

| Gate | Why |
|------|-----|
| **Data validation** | Bad data → silent model damage |
| **Eval thresholds** | Block register/deploy if metrics regress |
| **Training/serving skew** | Feature mismatch |
| **Drift / quality monitors** | Trigger retrain or rollback ([5](./5_Verify_Rollback_And_Synthetic_Tests.md), Observability) |
| **Cost / quota** | Distributed train can burn budget — FinOps literacy ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)) |

## Assisted / agentic tooling vs model CD

- **Assistants writing app/ML code** → still pass CI gates; small batches ([Methodologies/19](../Methodologies/19_Durable_Mindsets_And_Evolving_Toolsets.md))  
- **Models as production dependencies** → this chapter (registry, serving CD, monitor)  

Do not skip model CD because “we use an API vendor model” — still version prompts/configs, monitor quality, and gate app deploys that change model wiring.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Only notebook → prod copy | Pipeline + registry + digest/version |
| One `:latest` model file on a VM | Immutable versions + rollback |
| Distributed train without artifact identity | Register one evaluated artifact |
| No monitoring after deploy | Drift/latency/error budgets |
| Treating MLOps as unrelated to CiCd | Same promote/verify mindset |

## Next

- App loop: [1](./1_Pipelines_Build_Test_Deploy.md)  
- Spectrum map: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md)  
- Science depth: Data-Science-AI Deep Dive  

## Further reading

- [MLOps continuous delivery (Google Cloud Architecture Center)](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)  
- [DORA AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model)  
