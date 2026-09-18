# 05 — Configure a pipeline and see it run

[← Previous](./04_Pipelines_Mental_Model_And_YAML.md) · [README](./README.md) · [Next: Runners →](./06_Runners_Cloud_And_Self_Hosted.md)

## 1. Concepts

This chapter is the hands-on path: **turn Pipelines on**, **write YAML**, **watch the run**, **read logs**.

### A. Enable Pipelines

1. Open the repository in Bitbucket Cloud.  
2. Go to **Pipelines** (left nav).  
3. Enable Pipelines if prompted (repository admin).  
4. Add **`bitbucket-pipelines.yml`** at the **repository root** on a branch Bitbucket will build (often the default branch).  

Until that file exists and Pipelines is enabled, CI will not run.

You can start from Bitbucket’s **template** picker (language templates) or write YAML yourself. Either way, the source of truth is the file in Git.

### B. Minimal configuration

```yaml
image: atlassian/default-image:4

pipelines:
  default:
    - step:
        name: Test
        script:
          - echo "CI alive"
```

- `image` — Docker image for the step  
- `pipelines.default` — runs for branches that do not match a more specific rule  
- `step.script` — shell commands  

Commit and push. Prefer pinned language images (`node:20`, etc.) for real apps.

**First real CI (language-shaped)** — same enablement path; Bitbucket’s template picker produces something like this:

```yaml
image: node:20

pipelines:
  default:
    - step:
        name: Install and test
        caches:
          - node
        script:
          - npm ci
          - npm test
```

More trigger shapes (PR, tags, custom, parallel): [08](./08_Triggers_Steps_Stages_Parallel.md). End-to-end deploy lab: [16](./16_Worked_Example_Build_And_Deploy.md).

### C. See a pipeline (UI)

1. Open **Pipelines** in the repository.  
2. **History** lists runs — filter by branch, status, pipeline type, trigger.  
3. Select a run → **result** view: overall status (**pending**, **in progress**, **successful**, **failed**, **stopped**, **paused**, **error**, **system error**).  
4. Select a **step** → **logs** on the right (commands expandable). Extra tabs may appear for **services**, **tests**, or **artifacts** when configured.  
5. Download step logs as text when you need to share a failure.  
6. If you **rerun** failed steps, use the runs dropdown in the log view to compare attempts.

That is “seeing a pipeline”: history → one run → step logs.

### D. What you can do after it runs

| Outcome | Next |
|---------|------|
| Green on PR | Merge checks can require this build ([03](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md)) |
| Artifacts produced | Later steps or download ([09](./09_Caches_Artifacts_And_Services.md)) |
| Deployment step | Shows on **Deployments** dashboard ([11](./11_Deployments_And_Environments.md)) |
| Red build | Fix code/YAML; push again or rerun |

## 2. Advanced concepts

### Branch and PR pipelines

Use `pipelines.pull-requests` and `pipelines.branches` so PRs test without deploying, and `main` builds/deploys ([08](./08_Triggers_Steps_Stages_Parallel.md)). Path filters save minutes on monorepos.

### First secrets

Repository **variables** (mark **secured** for secrets). Do not put production cloud keys on PR pipelines — use **deployment** variables and environments ([07](./07_Variables_Secrets_And_OIDC.md), [11](./11_Deployments_And_Environments.md)).

### Validate YAML

Atlassian provides a Pipelines YAML validator (online) — use it when editors disagree with Bitbucket’s parser.

### Minutes and step size

Each run consumes **build minutes**. Larger `size:` multiplies minutes used; **`4x` and above** need a paid plan (Standard or Premium) ([08](./08_Triggers_Steps_Stages_Parallel.md), plan docs).

## 3. Applications and use cases

| Goal | Milestone |
|------|-----------|
| Prove Pipelines works | Echo step green; logs visible |
| App CI | Tests green on every PR |
| Path to prod | Artifact → staging deployment → manual production |

**Verify:** PR shows pipeline status; required merge check blocks red builds; secured variables do not appear in plain log text.

## References

- [Get started with Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/)  
- [Configure your first pipeline](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-first-pipeline/)  
- [View your pipeline](https://support.atlassian.com/bitbucket-cloud/docs/view-your-pipeline/)  
- [Configure bitbucket-pipelines.yml](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-pipeline-with-a-yml-file/)  
