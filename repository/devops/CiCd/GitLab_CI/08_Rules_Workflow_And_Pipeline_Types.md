# 08 — Rules, workflow, and pipeline types

[← Previous](./07_YAML_Mental_Model_And_Keywords.md) · [README](./README.md) · [Next: Needs →](./09_Needs_DAG_And_Downstream_Pipelines.md)

## 1. Concepts

**`rules:`** (job) and **`workflow:rules`** (pipeline) decide *if* something runs. Prefer `rules` over legacy `only`/`except`.

```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

unit:
  script: ["make test"]
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes: ["src/**/*", ".gitlab-ci.yml"]
```

### Pipeline types you will meet

| Type | Idea |
|------|------|
| Branch pipeline | Push to a branch |
| Tag pipeline | Push a tag |
| Merge request pipeline | Pipelines for MRs |
| Merged results pipeline | Test merge result vs target (when enabled) |
| Merge train | Serialize merges with fresh pipelines (tier/feature) |
| Scheduled | Cron-like |
| API / trigger / web | Manual or external start |
| Downstream | Child or multi-project ([09](./09_Needs_DAG_And_Downstream_Pipelines.md)) |

## 2. Advanced concepts

### `rules` building blocks

`if`, `changes`, `exists`, `when` (`on_success`, `manual`, `never`, …), `allow_failure`, `variables` overrides — compose carefully; first match wins.

### Efficiency

Path `changes` and `workflow:rules` stop duplicate pipelines (e.g. avoid both branch + MR pipelines unless you intend both). See pipeline efficiency docs.

### Schedules

Scheduled pipelines use the **default branch** config version that applies to the schedule’s target — own them like production crons.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| MR-only CI | `workflow:rules` on `merge_request_event` + default branch |
| Monorepo | `rules:changes` per component |
| Prod promote | `when: manual` on deploy job + protected env |

**Good:** one intentional pipeline per event. **Bad:** double pipelines on every MR push burning minutes.

## References

- [Job rules](https://docs.gitlab.com/ci/jobs/job_rules/)  
- [Pipeline types](https://docs.gitlab.com/ci/pipelines/pipeline_types/)  
- [Merge request pipelines](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/)  
- [Pipeline schedules](https://docs.gitlab.com/ci/pipelines/schedules/)  
- [Pipeline efficiency](https://docs.gitlab.com/ci/pipelines/pipeline_efficiency/)  
