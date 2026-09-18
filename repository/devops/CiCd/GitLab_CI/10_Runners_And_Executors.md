# 10 — Runners and executors

[← Previous](./09_Needs_DAG_And_Downstream_Pipelines.md) · [README](./README.md) · [Next: Images and Docker →](./11_Images_Services_And_Docker_Build.md)

## 1. Concepts

A **runner** is the agent (GitLab Runner application) that executes jobs.

Flow:

1. Register runner with GitLab (instance / group / project).  
2. Pipeline creates jobs.  
3. Matching runners (tags, type, capacity) pick jobs.  
4. Runner prepares environment, runs `script`, streams logs/status back.

```yaml
job:
  tags: [docker, linux]
  script: ["make test"]
```

### Runner classes

| Class | Plain meaning |
|-------|----------------|
| Instance (shared) | Available broadly (e.g. GitLab.com hosted runners) |
| Group | Shared within a group |
| Project | Locked to one project |

**Executors** (shell, docker, kubernetes, machine, custom, …) decide *how* the job isolation looks — see Runner docs.

## 2. Advanced concepts

### Hygiene for self-managed runners

| Risk | Mitigation |
|------|------------|
| Dirty workspace | Ephemeral environments / cleanup |
| Privileged DinD | Isolate; prefer rootless/Buildah patterns where possible ([11](./11_Images_Services_And_Docker_Build.md)) |
| Secret residue | Protected variables; don’t log secrets |
| Tag sprawl | Naming convention + docs |

### SaaS compute minutes

Jobs on instance runners consume compute minutes — confirm current docs for your plan. Dedicated hosted runner minute docs exist separately.

### Autoscaling & fleets

Docker Machine (legacy patterns), **Kubernetes executor**, and **Fleeting**-based autoscaling plugins grow and shrink runner capacity. Treat fleets as a platform product with owners; deep Helm/plugin values stay upstream.

### Interactive web terminal

Jobs can expose an **interactive web terminal** for live debugging on supported executors — useful in break-glass; lock down who can use it on shared runners.

## 3. Applications and use cases

| Need | Choice |
|------|--------|
| Default GitLab.com CI | Shared runners |
| Private net / special hardware | Self-managed tagged runners |
| Kube-native elastic CI | Kubernetes executor |

**Good:** tags match capability, not team nicknames only. **Bad:** one privileged shared runner for every project including forks/untrusted MRs.

## References

- [Runners](https://docs.gitlab.com/ci/runners/)  
- [GitLab Runner](https://docs.gitlab.com/runner/)  
- [Register runners](https://docs.gitlab.com/runner/register/)  
- [Executors](https://docs.gitlab.com/runner/executors/)  
