# 05 — CI core model: pipelines, jobs, stages

[← Previous](./04_Planning_And_Work_Items_Literacy.md) · [README](./README.md) · [Next: First pipeline →](./06_First_Pipeline_And_CI_UI.md)

## 1. Concepts

GitLab CI/CD is configured mainly by **`.gitlab-ci.yml`** at the project root (custom CI config path is possible).

| Term | Plain meaning |
|------|----------------|
| **Pipeline** | One run graph for an event (push, MR, schedule, API, …) |
| **Job** | Script (and settings) executed by a **runner** |
| **Stage** | Ordered group; stages run in sequence; jobs in a stage run in parallel (by default) |
| **Runner** | Agent that picks up matching jobs and executes them |
| **CI/CD variable** | Config/secret injected into jobs |

```text
event → pipeline
          ├─ stage build → jobs…
          ├─ stage test  → jobs…
          └─ stage deploy → jobs…
```

Jobs are independent units with their own logs. Prefer **`needs:`** when you want a DAG faster than “wait for whole stage” ([09](./09_Needs_DAG_And_Downstream_Pipelines.md)).

## 2. Advanced concepts

### Global vs job keywords

Global keywords shape all pipelines (e.g. `stages`, `workflow`, default `image`). Job keywords shape one job (`script`, `rules`, `cache`, `artifacts`, `environment`, …). Full encyclopedia: YAML reference — map in [07](./07_YAML_Mental_Model_And_Keywords.md).

### What starts a pipeline

Pushes, tags, MRs, schedules, API/triggers, web UI “Run pipeline”, parent/child pipelines — filtered by `workflow:rules` and job `rules` ([08](./08_Rules_Workflow_And_Pipeline_Types.md)).

### Failure behavior

If a job fails, later stages usually don’t run (unless `allow_failure` / specific rules). Know which jobs are **required** for merge checks.

## 3. Applications and use cases

| Goal | Model focus |
|------|-------------|
| PR/MR feedback | Early test stage; fail fast |
| Release | Build → publish digest → gated deploy job |
| Org standard | Thin project YAML + components ([13](./13_Includes_Components_And_CI_Catalog.md)) |

**Good:** small clear stages + `needs` where parallelism helps. **Bad:** one giant job that builds, tests, and prod-deploys with write-all credentials.

## References

- [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/)  
- [CI/CD pipelines](https://docs.gitlab.com/ci/pipelines/)  
- [CI/CD jobs](https://docs.gitlab.com/ci/jobs/)  
- [CI/CD YAML](https://docs.gitlab.com/ci/yaml/)  
