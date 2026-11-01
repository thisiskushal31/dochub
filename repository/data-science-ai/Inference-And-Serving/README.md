# Inference and serving

[← README](../README.md)

Turning a trained (or prompted) model into a **reliable service** under memory, latency, and cost constraints. Runtimes and product names will change; the constraints will not.

This folder is the **AI infrastructure stop** for serving: local runners → high-throughput engines → cluster replicas/routing → GPU scale-up / scale-to-zero → ops signals. Fill topic files in depth later; the map below is the bookmark.

Security of models/APIs/agents lives in [Security-Deep-Dive AI-Security](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/AI-Security) — do not duplicate threat content here. Delivery gates: [DevOps-Handbook CiCd/22](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/CiCd/22_MLOps_And_AI_System_Delivery.md). Kubernetes primitives: [DevOps-Handbook Cloud-Native](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Cloud-Native) / [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive). Library hello-worlds: [Tooling Data-ML Inference](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Inference).

```text
Local runner (dev)     →  Serving engine (throughput)
        ↓                         ↓
   Cluster deploy (K8s)  →  Replicas + routing + KV awareness
        ↓                         ↓
   GPU autoscaling       →  Queue / scale-to-zero + cold start
        ↓
   Observability / AIOps signals (latency, cache, saturation)
```

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Memory and compute](./1_Memory_And_Compute.md) | stub (KV / prefill–decode) |
| 2 | [Serving patterns](./2_Serving_Patterns.md) | stub (batching, gateways, engines) |
| 3 | [Cost and resources](./3_Cost_And_Resources.md) | stub |
| 4 | [Lifecycle and registry](./4_Lifecycle_And_Registry.md) | stub |
| 5 | [Cluster serving, scaling, and ops](./5_Cluster_Serving_Scaling_And_Ops.md) | **map / deepen-later stop** |

## Concept map (platform-agnostic)

| Concern | Idea | Typical tools (instances — replaceable) |
|---------|------|----------------------------------------|
| Local / laptop serving | Run open-weight models without a cluster | **Ollama**, Python + Hugging Face weights |
| High-throughput LLM engine | Continuous batching, efficient GPU decode | **vLLM** (also TGI / others as peers) |
| Cluster packaging | Deploy engine replicas on Kubernetes | Deployments/Services, **Helm** |
| Production stack behaviors | Multi-replica serving, observability, model-/prefix-aware routing, **KV-cache** management/offload/share | vLLM + production-stack patterns / LMCache-class offload |
| GPU inference autoscaling | Scale replicas from concurrent load | **KServe** (+ K8s HPA/GPU node pools) |
| Scale-to-zero / queue-driven | Idle → 0; wake on work; accept cold start | **KEDA**, queue (**Redis** or equivalent), GPU nodes |
| Ops / AIOps | Detect saturation, latency, cache miss, automate response | Metrics/logs/traces + runbooks (see Observability homes) |

Managed clouds (GKE, EKS, AKS, …) are **Kubernetes distributions** — deepen cluster behavior once under K8s; do not fork this map per vendor.

## Ownership split

| Slice | Home |
|-------|------|
| Memory, KV, serving patterns, cluster scaling concepts | **This folder** |
| Named engine install (vLLM, Ollama) | [Tooling Inference](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Data-ML/Inference) |
| K8s / Helm / operators | Cloud-Native / Containerization |
| Model CD, registry promote | [CiCd/22 MLOps](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/CiCd/22_MLOps_And_AI_System_Delivery.md) |
| LLM latency/token/GPU dashboards | Monitoring-And-Observability (e.g. Datadog LLM / GPU notes) |
| Prompt/agent/model security | [AI-Security](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/AI-Security) |

## Checklist before marking section done

- [ ] Notes 1–4 filled (no TBD)  
- [ ] Note 5 deepened beyond the map (replicas, routing, KV, KServe, KEDA, cold start)  
- [ ] Tool examples dated in [Instances](../Instances/README.md) when they rot  
- [ ] Cross-links to Tooling vLLM/Ollama still accurate  
