# 13 — Pipelines-as-Code

[← Previous](./12_Triggers_EventListeners_And_Interceptors.md) · [README](./README.md) · [Next: Catalog →](./14_Catalog_Hub_And_Reusable_Tasks.md)

---

## 1. Concepts

**Pipelines-as-Code (PAC)** runs Tekton from **Git events** with pipeline definitions in the repo (typically `.tekton/`).

| Piece | Role |
|-------|------|
| PAC controller | Watches SCM events; creates PipelineRuns |
| `.tekton/*.yaml` | PipelineRun templates / pipelines in-repo |
| **Repository** CR | Per-repo settings (concurrency, GitHub token scope, …) |
| Providers | GitHub App / GitHub Webhook, GitLab, Bitbucket Cloud/Data Center, Forgejo, … |
| Event matching | Path filters, CEL, comments/labels, skip-ci |
| Ops settings | Concurrency, token scoping, metrics, tracing, multi-controller literacy |

```yaml
# .tekton/pull-request.yaml — illustrative shape
apiVersion: tekton.dev/v1
kind: PipelineRun
metadata:
  name: pr-ci
  annotations:
    pipelinesascode.tekton.dev/on-event: "[pull_request]"
    pipelinesascode.tekton.dev/on-target-branch: "[main]"
spec:
  pipelineSpec:
    tasks:
      - name: test
        taskSpec:
          steps:
            - name: test
              image: alpine:3.20
              script: "echo CI"
```

Use annotations/CEL for event matching (paths, comments, labels) per current PAC guides.

---

## 2. Advanced concepts

### GitHub App vs webhook

App is preferred for GitHub at scale. Token scoping and concurrency live on Repository CR / global settings.

### Remote pipelines

Resolve shared pipelines from another repo ([11](./11_Resolvers_Bundles_And_Remote_Resources.md)).

### Providers and matching

Configure the SCM provider integration first, then Repository CR per repo. Use path matching / CEL / comment triggers so monorepos do not rebuild everything. **Incoming** / gitops-style comment commands exist — treat as privileged.

### Statuses and running Pipelines

PAC reports commit/PR **statuses** back to the SCM; understand success/failure mapping and required checks on protected branches. Guides cover running pipelines, comment/label triggers, and skip-ci conventions.

### Operations literacy

Global and per-repo settings: concurrency limits, GitHub token scoping, certificates, logging/metrics/**tracing**, **profiling**, **informer-cache**, multi-controller. Optional LLM-analysis guides are experimental literacy — not a default.

### Trust

Fork PRs: no prod credentials; use separate SA and pull policies. Operator / OpenShift PAC docs cover distro installs ([19](./19_Operator_Platform_Config.md)).

### CLI: `tkn pac` (plugin)

PAC ships a **`tkn-pac`** plugin (`tkn pac …`): bootstrap, Repository create/delete/list/describe, `generate` / `resolve`, logs, CEL eval, webhook helpers. Full pre-install command map lives in [15](./15_CLI_tkn.md) — learn what it does before installing the plugin.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| PR checks | on-event pull_request PipelineRuns |
| Push to main | build-push + Chains ([17](./17_Chains_Supply_Chain_Security.md)) |
| Monorepo | path matching annotations |
| Scaffold / resolve locally | `tkn pac generate` / `resolve` ([15](./15_CLI_tkn.md)) |

**Staff checklist**

- Provider App/webhook configured before Repository CRs  
- Path/CEL filters for monorepos  
- Fork PRs isolated from prod credentials  
- Concurrency limits set  
- Engineers know `tkn pac` surface before first plugin install ([15](./15_CLI_tkn.md)) 

**Good:** pipelines reviewed in the same PR. **Bad:** PAC with cluster-admin and secrets on all fork PRs.

---

## References

- [Pipelines-as-Code](https://tekton.dev/docs/pipelines-as-code/)  
- [PAC getting started](https://tekton.dev/docs/pipelines-as-code/)  
