# 06 — Pipeline YAML and step types

[← Previous](./05_Queues_Clusters_And_Targeting.md) · [README](./README.md) · [Next: Templates →](./07_Templates_And_First_Pipeline_Yml.md)

---

## 1. Concepts

Steps live in YAML — in the Buildkite UI editor and/or in the repo (commonly `.buildkite/pipeline.yml`).

```text
steps:
  → command | wait | block | input | trigger | group
```

Jobs from different steps may run on **different agents**. Install dependencies in the same step that needs them.

### Step types

| Type | Role |
|------|------|
| **command** | Run shell commands / scripts |
| **wait** | Barrier — continue when prior jobs finish |
| **block** | Manual continue (approval-style) |
| **input** | Collect values before continuing |
| **trigger** | Start another pipeline’s build |
| **group** | Nest/label related steps |

### Command step (minimum)

```yml
steps:
  - command: "npm test"
```

Multiple commands in one step (same agent):

```yml
steps:
  - commands:
      - "npm ci"
      - "npm test"
```

### Defaults

Top-level `agents:` and `env:` apply to command steps unless overridden.

---

## 2. Advanced concepts

### Pipeline upload

A common pattern: UI (or a tiny bootstrap YAML) runs `buildkite-agent pipeline upload` to load `.buildkite/pipeline.yml` from the checkout ([11](./11_Dynamic_Pipelines_And_Pipeline_Upload.md)).

### Attributes you will use often

`label`, `key`, `depends_on`, `if` / conditionals, `artifact_paths`, `plugins`, `concurrency` / `concurrency_group`, `soft_fail`, `retry`, `timeout_in_minutes`.

Exact schema: configuration docs for your agent/docs version.

---

## 3. Applications and use cases

| Estate | Shape |
|--------|-------|
| Tiny service | Few command steps + wait |
| Multi-pipeline | trigger steps between test and deploy pipelines |
| Human gate | block before production |

**Good:** YAML in Git reviewed in PRs. **Bad:** only UI YAML with no repo history.

---

## References

- [Defining steps](https://buildkite.com/docs/pipelines/configure/defining-steps)  
- [Step types](https://buildkite.com/docs/pipelines/configure/step-types)  
- [Command step](https://buildkite.com/docs/pipelines/configure/step-types/command-step)  
