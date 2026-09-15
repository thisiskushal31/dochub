# 12 — Triggers: EventListeners and interceptors

[← Previous](./11_Resolvers_Bundles_And_Remote_Resources.md) · [README](./README.md) · [Next: PAC →](./13_Pipelines_As_Code.md)

---

## 1. Concepts

**Tekton Triggers** turn events (usually webhooks) into PipelineRuns/TaskRuns.

| Object | Role |
|--------|------|
| **EventListener** | HTTP endpoint receiving events |
| **Trigger** | Matches event → template |
| **TriggerBinding** | Map event fields → params |
| **TriggerTemplate** | Blueprint for the Run |
| **Interceptor** | Validate/filter/transform (webhook secret, CEL, GitHub, …) |
| **ClusterInterceptor** / namespaced | Shared vs tenant interceptor implementations |
| **TriggerBinding** / **ClusterTriggerBinding** | Event → params |
| **TriggerTemplate** | Run blueprint |

```yaml
# Conceptual chain
EventListener → Interceptor(s) → TriggerBinding → TriggerTemplate → PipelineRun
```

Install Triggers after Pipelines. Expose EventListener via Ingress/Service (`serviceType`, TLS); validate payloads. **CEL** interceptors are common for path/branch filters.

---

## 2. Advanced concepts

### CEL expressions

Powerful matching/filtering — keep expressions reviewed and tested ([CEL](https://tekton.dev/docs/triggers/cel-expressions/)).

### Cluster vs namespaced interceptors

**ClusterInterceptor** (cluster-scoped) vs namespaced interceptors — prefer least privilege; don’t install untrusted interceptor images.

### Vs Pipelines-as-Code

Triggers are generic event → Run. PAC adds Git-provider opinionation and `.tekton/` in-repo ([13](./13_Pipelines_As_Code.md)). Many platforms use PAC for SCM CI and Triggers for non-Git events.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| GitHub push/PR | Interceptor + binding + template **or** PAC |
| Image updated | Custom webhook → rebuild |
| Cron-like | Prefer Kubernetes CronJob creating PipelineRun |

**Staff checklist**

- TLS on EventListener ingress  
- Interceptor validates SCM signatures/secrets  
- Template SA is least privilege  
- `tkn eventlistener` used for day-2 inspect ([15](./15_CLI_tkn.md))  

**Good:** authenticated listeners. **Bad:** public EventListener with no interceptor creating privileged Runs.

---

## References

- [Triggers](https://tekton.dev/docs/triggers/)  
- [EventListeners](https://tekton.dev/docs/triggers/eventlisteners/)  
- [Interceptors](https://tekton.dev/docs/triggers/interceptors/)  
