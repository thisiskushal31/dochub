# Inference libraries

[← Data-ML](../README.md)

Hello-world for **running** a model. Serving *concepts* (memory, patterns, cluster scale, KV, KServe/KEDA-class ops) → [DS-AI Inference-And-Serving](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive/tree/main/Inference-And-Serving) — start at [cluster serving stop](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive/blob/main/Inference-And-Serving/5_Cluster_Serving_Scaling_And_Ops.md).

| Folder | Job |
|--------|-----|
| [vLLM](./vLLM/README.md) | High-throughput LLM serving engine |
| [Ollama](./Ollama/README.md) | Local / laptop model runner |

**Related platform tools** (install stubs later — concepts already mapped in DS-AI note 5): **Helm** (package), **KServe** (K8s inference / GPU autoscale), **KEDA** (event/queue scale-to-zero), queue (**Redis** or peer). Orchestration depth stays under Kubernetes homes, not duplicated per cloud vendor.
