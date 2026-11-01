# Cluster serving, scaling, and ops

[← Inference and serving](./README.md)

> **Status:** concept/tool **stop** — deepen later. Not a project walkthrough.

Where **LLM inference** meets **Kubernetes**: engines, replicas, routing, KV-cache awareness, GPU scale-up, scale-to-zero, and ops signals. Platform-agnostic (any conformant cluster). Local runners and single-node engines start in [2](./2_Serving_Patterns.md) / Tooling; memory/KV basics in [1](./1_Memory_And_Compute.md).

```text
Client / gateway
  → Router (model-aware / prefix-aware when used)
  → Serving engine replicas (e.g. vLLM)
       ↳ KV cache on GPU (+ optional CPU/remote offload)
  → Autoscale (load) or scale-to-zero (queue / KEDA)
  → Metrics: TTFT, inter-token latency, throughput, cache hit, GPU util
```

## Concept

### Stack layers (what to learn)

| Layer | Concept | Why it matters |
|-------|---------|----------------|
| **Engine** | High-throughput LLM server (continuous batching, paged attention-class memory) | Tokens/sec and GPU efficiency |
| **KV cache** | Working memory for attention over the context; hit rate drives latency/cost | Prefix reuse, offload, multi-replica share |
| **Routing** | Send traffic to the right model / replica that already holds useful cache | Model-aware + prefix-aware routing |
| **Packaging** | Helm/charts, Deployments, Services, GPU resource requests | Repeatable cluster install |
| **Scale up** | More replicas / GPUs under concurrent load | Tail latency + queue depth |
| **Scale to zero** | Idle GPUs → 0; wake on queued work | Cost; **cold start** is the trade |
| **Ops / AIOps** | Observe engine + cluster; detect and respond | Saturation, cache thrash, runaway cost |

### Tools (instances — replaceable)

| Tool | Job in this map | Deepen home |
|------|-----------------|-------------|
| **Ollama** | Local / laptop open-weight runner | [Tooling Ollama](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Inference/Ollama) |
| **Hugging Face** (+ Python) | Weights / model cards into a runner | [Tooling HuggingFace](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Learning/HuggingFace) |
| **Docker** | Image the engine | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) |
| **vLLM** | Production-oriented LLM serving engine | [Tooling vLLM](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Inference/vLLM) |
| **Helm** | Package/deploy stack on Kubernetes | Cloud-Native Helm |
| **Kubernetes** | Orchestration, GPU nodes, Services | Cloud-Native / Containerization — **not** a separate GKE/EKS fork here |
| **KServe** | K8s-native model inference (incl. GPU autoscaling patterns) | Add Tooling or Cloud-Native stub when you deepen |
| **KEDA** | Event/queue-driven autoscaling, including scale-to-zero | Same |
| **Redis** (or peer queue) | Work queue feeding scale-to-zero inference | Databases / tooling as needed |
| Monitoring stack | TTFT, TBT, throughput, KV hit, GPU util | [Monitoring-And-Observability](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Monitoring-And-Observability) |

Peers to vLLM (TGI, TensorRT-LLM, …) belong in [Instances](../Instances/README.md) when you compare them — keep this note about **jobs**, not brand loyalty.

## Advanced (outline to fill)

### Production LLM serving on Kubernetes

Deepen later:

- [ ] Engine Deployment + Service; GPU `limits`/`requests`; model weight volume/cache  
- [ ] Multi-replica serving; readiness vs long model load  
- [ ] Observability: per-engine and query-level latency (TTFT / inter-token)  
- [ ] Model-aware routing (multiple models) and **prefix-aware** routing (KV reuse)  
- [ ] KV-cache management: on-GPU, CPU offload, shared remote cache across replicas  
- [ ] Helm-based stack install; config as code  

Primary engine docs to return to: [vLLM deployment / Kubernetes](https://docs.vllm.ai/en/stable/deployment/k8s/), [vLLM production-stack](https://docs.vllm.ai/en/stable/deployment/integrations/production-stack/).

### GPU autoscaling inference

Deepen later:

- [ ] Concurrent traffic → scale signals (QPS, queue depth, GPU util, custom metrics)  
- [ ] KServe (or equivalent) inference graph vs raw Deployment+HPA  
- [ ] Node pools / GPU operators (cluster concern — link Containerization)  
- [ ] What breaks: scale lag, thundering herd, partial GPU packing  

### Scale-to-zero (queue + KEDA-class)

Deepen later:

- [ ] Queue-based triggers; scale from 0 → N on backlog  
- [ ] Cold start: model load + CUDA init vs SLO  
- [ ] Pairing KEDA + Redis (or other scaler sources) + GPU nodes  
- [ ] Cost vs latency trade; warmup policies  

### DevOps + AIOps for inference

Deepen later:

- [ ] Golden signals for LLM endpoints (not only HTTP 5xx)  
- [ ] Detect: KV thrash, replica imbalance, GPU idle waste, token-cost spikes  
- [ ] Automate: alert → runbook → scale / shed / rollback model version  
- [ ] Tie to [CiCd/22](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/CiCd/22_MLOps_And_AI_System_Delivery.md) promote/rollback of **model + serving image**  

### Explicit non-goals here

| Out | Why |
|-----|-----|
| GKE/EKS/AKS click-ops | Covered as Kubernetes |
| Full project portfolios / blog challenges | Concepts + tools only |
| Prompt injection, agent abuse, model theft | [AI-Security](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/AI-Security) |
| Exploit / unauthorized load tests against third parties | Lab rules apply |

## Apply (when you deepen)

1. Draw your stack on the layer diagram above; name one tool per layer.  
2. Open Tooling vLLM + Ollama stubs; leave cluster depth in this note.  
3. Pick one: multi-replica+KV **or** KServe autoscale **or** KEDA scale-to-zero — fill that checklist section first.  
4. Add Instance dates when you lock a tool version.  
5. Link one Observability dashboard note for GPU + LLM latency.

### Self-check

- [ ] Separate engine vs orchestrator vs autoscaler vs queue  
- [ ] Explain why KV-cache awareness changes routing  
- [ ] State scale-to-zero cold-start trade  
- [ ] Know where security vs infra notes live  

## Next

- [Serving patterns](./2_Serving_Patterns.md) · [Memory and compute](./1_Memory_And_Compute.md) · [Inference README](./README.md)

## Further reading

- [vLLM — Kubernetes deployment](https://docs.vllm.ai/en/stable/deployment/k8s/)
- [vLLM — production-stack](https://docs.vllm.ai/en/stable/deployment/integrations/production-stack/)
- [KServe](https://kserve.github.io/website/)
- [KEDA](https://keda.sh/)
- [CiCd — MLOps and AI system delivery](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/CiCd/22_MLOps_And_AI_System_Delivery.md)
- [Tooling — vLLM](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Inference/vLLM)
- [Tooling — Ollama](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Inference/Ollama)
