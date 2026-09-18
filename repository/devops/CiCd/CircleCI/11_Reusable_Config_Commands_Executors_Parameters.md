# 11 — Reusable config: commands, executors, parameters

[← Previous](./10_Orbs_Use_And_Author_Literacy.md) · [README](./README.md) · [Next: Contexts →](./12_Contexts_Env_Vars_And_Secrets.md)

## 1. Concepts

`version: 2.1` lets you define reusable elements **inside** one project (without a published orb):

| Key | Role |
|-----|------|
| **commands** | Named step bundles (parameterizable) |
| **executors** | Named execution environments |
| **jobs** | Can be parameterized and reused |
| **parameters** | Pipeline/job/command parameters |

```yaml
version: 2.1

commands:
  sayhello:
    parameters:
      to:
        type: string
        default: "world"
    steps:
      - run: echo "Hello << parameters.to >>"

jobs:
  greeter:
    docker:
      - image: cimg/base:current
    steps:
      - sayhello:
          to: CircleCI
```

Use `circleci config process` to see expanded YAML ([18](./18_Server_CLI_API_And_Toolkit.md)).

## 2. Advanced concepts

Naming rules: start with a letter; lowercase, digits, `_`, `-` only (per reusable config reference).

Pipeline parameters enable selecting workflows ([08](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md)).

When reuse crosses many repos, prefer **orbs** ([10](./10_Orbs_Use_And_Author_Literacy.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| DRY within one repo | commands + executors |
| Parameterized nightly | pipeline parameters |
| Multi-repo standard | orb |

**Good:** processed config reviewed in PRs when complex. **Bad:** deep nesting nobody can expand mentally.

## References

- [Reusable config reference](https://circleci.com/docs/reference/reusing-config/)  
- [Configuration reference](https://circleci.com/docs/reference/configuration-reference/)  
