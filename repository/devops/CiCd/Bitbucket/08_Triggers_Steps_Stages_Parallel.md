# 08 — Triggers, steps, stages, and parallel

[← Previous](./07_Variables_Secrets_And_OIDC.md) · [README](./README.md) · [Next: Caches →](./09_Caches_Artifacts_And_Services.md)

---

## 1. Concepts

### Pipeline start conditions

| Trigger | Use |
|---------|-----|
| `default` / `branches` | Push CI |
| `pull-requests` | PR validation |
| `tags` | Release builds |
| `custom` | Manual / API-triggered pipelines |
| Schedules | Cron audits and nightlies |

Path filters and condition keywords keep monorepos from rebuilding everything ([CiCd/14](../14_Monorepo_And_Multi_Repo_CI.md)).

### Steps, stages, parallel

- **Step** — one container of work (`script`, optional `pipe`)  
- **Parallel** — sibling steps at once  
- **Stage** — ordered group; deployment stages can wrap multi-step deploys  

Host-neutral schedule/manual/promote jobs: [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md).

### Template shapes (copy and adapt)

These are the common skeletons Atlassian’s start-conditions model uses. Replace `echo` with real test/build commands. A fuller PR → staging → manual prod lab is in [16](./16_Worked_Example_Build_And_Deploy.md).

**Branches + default** — push CI; `default` covers branches without a specific rule:

```yaml
image: node:20

pipelines:
  default:
    - step:
        name: Test (other branches)
        script:
          - npm ci
          - npm test
  branches:
    main:
      - step:
          name: Build main
          script:
            - npm ci
            - npm run build
    feature/*:
      - step:
          name: Feature checks
          script:
            - npm ci
            - npm test
```

**Pull requests** — validate the merge result (Bitbucket merges the destination into the working tree for the run):

```yaml
pipelines:
  pull-requests:
    '**':
      - step:
          name: PR checks
          script:
            - npm ci
            - npm test
```

**Tags** — release/build when you push a version tag:

```yaml
pipelines:
  tags:
    'v*':
      - step:
          name: Release build
          script:
            - npm ci
            - npm run build
            - echo "push image@digest"
```

**Custom** — run from the Pipelines UI (or API); also what schedules attach to:

```yaml
pipelines:
  custom:
    nightly-audit:
      - step:
          name: Audit
          script:
            - npm ci
            - npm audit
```

**Parallel steps** — siblings at once (each step’s minutes count separately):

```yaml
pipelines:
  default:
    - parallel:
        - step:
            name: Unit
            script:
              - npm test
        - step:
            name: Lint
            script:
              - npm run lint
```

---

## 2. Advanced concepts

### Manual steps

Mark steps manual so humans promote deliberately (Continuous Delivery). Pair with deployment environments ([11](./11_Deployments_And_Environments.md)).

### Fail-fast vs soft fail

Know which step options fail the pipeline vs allow continuation — don’t soft-fail security scans by accident.

### Max time / size

Step duration limits exist. Use `size:` for heavier jobs (minutes scale with size; **`4x+` needs Standard or Premium**). Parallel steps each consume their own minutes. Split long work; don’t upload whole `node_modules` as artifacts.

---

## 3. Applications and use cases

| Goal | Shape |
|------|-------|
| PR CI | `pull-requests` template above |
| Tag release | `tags` template above |
| Nightly | Schedule a `custom` pipeline in the UI |
| Promote | Custom/manual deployment ([16](./16_Worked_Example_Build_And_Deploy.md)) |

**Good:** fail-fast test before expensive deploy. **Bad:** one mega-step that always deploys.

---

## References

- [Pipeline start conditions](https://support.atlassian.com/bitbucket-cloud/docs/pipeline-start-conditions/)  
- [Scheduled and manually triggered pipelines](https://support.atlassian.com/bitbucket-cloud/docs/scheduled-and-manually-triggered-pipelines/)  
- [Parallel steps](https://support.atlassian.com/bitbucket-cloud/docs/use-parallel-steps/)  
- [Stages](https://support.atlassian.com/bitbucket-cloud/docs/stage-options/)  
- [Step options (including size)](https://support.atlassian.com/bitbucket-cloud/docs/step-options/)  
