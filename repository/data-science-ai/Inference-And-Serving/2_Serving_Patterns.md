# Serving patterns

[← Inference and serving](./README.md)

*(Content TBD — stub; deepen later.)*

Batching, quantization, caching, gateways, fallbacks. A named server (**vLLM**, TGI, a cloud endpoint, **Ollama** locally) is an **instance** of a pattern — keep the pattern here; hello-world installs in Tooling.

## Planned coverage

- Online vs batch inference  
- Continuous / dynamic batching vs naive one-at-a-time  
- Gateway / router in front of engines ([System-Design LLM gateway](https://github.com/thisiskushal31/System-Design-Concepts/blob/main/Primer-Gaps/12_RAG_and_LLM_Gateway_Design.md) when relevant)  
- Fallback, timeout, shedding under overload  
- Local runner pattern (Ollama) vs cluster engine (vLLM) — when each fits  
- Hand off multi-replica, routing, KV-aware, autoscaling to [5](./5_Cluster_Serving_Scaling_And_Ops.md)

## Checklist before marking done

- [ ] Link System Design gateway primer  
- [ ] Do not make the folder named after a runtime  
- [ ] Point Tooling vLLM / Ollama as install homes  
