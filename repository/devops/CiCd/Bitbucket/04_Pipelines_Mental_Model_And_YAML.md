# 04 — Pipelines mental model and YAML

[← Previous](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md) · [README](./README.md) · [Next: First pipeline →](./05_First_Pipeline_And_Enablement.md)

---

## 1. Concepts

Pipelines config lives in **`bitbucket-pipelines.yml`** at the repo root.

| Object | Role |
|--------|------|
| **Pipeline** | Named workflow triggered by branch, PR, tag, custom, or schedule |
| **Step** | Unit of work in a Docker container (script + optional pipes) |
| **Stage** | Group of steps (including multi-step deployments) |
| **Parallel** | Concurrent steps |
| **Definitions** | Reusable caches, services, pipes helpers |
| **Image** | Docker image for steps (default Atlassian image or custom) |
| **Deployment** | Ties a step/stage to a named environment ([11](./11_Deployments_And_Environments.md)) |

```text
pipelines:
  default / branches / pull-requests / tags / custom
    → steps / stages / parallel
      → script | pipe
```

---

## 2. Advanced concepts

### Start conditions

Pipelines can start on pushes to branches, pull requests, tags, **custom** (manual) pipelines, and **schedules**. Configure conditions and path filters carefully for monorepos.

### YAML anchors

Anchors reuse step fragments without pipes — keep DRY, but prefer pipes/shared definitions when reuse crosses repos ([10](./10_Pipes_Anchors_And_Reuse.md)).

### Child pipelines

A step can trigger another pipeline — useful for fan-out. Authorize and observe blast radius.

### Runtime / Docker service

Steps often need a Docker service for `docker build`. Memory and runtime options (including Runtime v3) affect what fits on Cloud vs runners ([06](./06_Runners_Cloud_And_Self_Hosted.md)).

### Step size

`size: 1x` (default) through larger sizes (`2x`, `4x`, `8x`, … up to the documented max) allocate more CPU/memory/disk and consume **proportionally more build minutes** (a `4x` step that runs 1 wall-clock minute uses 4 build minutes). Values **`4x` and above** require a **paid** Cloud plan (Standard or Premium). Confirm the current size table in step options docs before promising capacity.

### Share pipeline configurations (Premium)

Premium can **share** pipeline definitions across repositories in a workspace so teams do not copy-paste YAML — pair with [10](./10_Pipes_Anchors_And_Reuse.md).

---

## 3. Applications and use cases

| Estate | Shape |
|--------|-------|
| Simple service | `default` + PR pipeline |
| Multi-env promote | Custom/manual deploy pipelines + deployment envs |
| Shared platform | Pipes + anchors + child pipelines |

**Good:** one YAML reviewed in PRs. **Bad:** UI-only secrets with no documented owners.

---

## References

- [Pipelines configuration reference](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/)  
- [Configure bitbucket-pipelines.yml](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-pipeline-with-a-yml-file/)  
