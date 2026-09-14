# 06 — First pipeline and the CI UI

[← Previous](./05_CI_Core_Model_Pipelines_Jobs_Stages.md) · [README](./README.md) · [Next: YAML mental model →](./07_YAML_Mental_Model_And_Keywords.md)

---

## 1. Concepts

1. Ensure a **runner** is available (shared on GitLab.com, or register your own).  
2. Add `.gitlab-ci.yml` on the default branch (or via MR).  
3. Push / open an MR.  
4. Open **Build → Pipelines** (UI labels evolve) → open the pipeline → job log.  
5. Turn on merge checks that require pipeline success when ready.

Minimal example:

```yaml
stages: [test]

unit:
  stage: test
  image: node:22
  script:
    - npm ci
    - npm test
```

### UI surfaces

| Place | Use |
|-------|-----|
| Pipelines / jobs | Status, retry, cancel, job log |
| Pipeline editor | Edit + validate (CI Lint) |
| MR widget | Pipeline status before merge |
| Environments | Deploy history ([15](./15_Environments_Deployments_And_Release.md)) |
| CI/CD settings | Variables, runners, auto-DevOps toggles |

---

## 2. Advanced concepts

### CI Lint

Validate YAML before you burn runner minutes — in the pipeline editor / lint tool ([07](./07_YAML_Mental_Model_And_Keywords.md)).

### Manual jobs & schedules

`when: manual` for gated promote; **pipeline schedules** for cron-like work — give schedules an owner ([08](./08_Rules_Workflow_And_Pipeline_Types.md)).

### Compute minutes (SaaS)

GitLab.com instance runners consume compute minutes by plan — confirm current billing docs; optimize with `rules:changes` and efficient images ([10](./10_Runners_And_Executors.md)).

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| First green pipeline | Job log + MR status |
| Merge gate | “Pipelines must succeed” (or equivalent) |
| Operability | Team finds logs without asking platform |

**Good:** stable job names used in merge checks. **Bad:** merging while ignoring a failed allowed job you thought was required.

---

## References

- [CI/CD quick start](https://docs.gitlab.com/ci/quick_start/)  
- [Pipeline editor](https://docs.gitlab.com/ci/pipeline_editor/)  
- [CI Lint](https://docs.gitlab.com/ci/yaml/lint/)  
