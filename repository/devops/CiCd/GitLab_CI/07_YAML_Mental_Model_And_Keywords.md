# 07 — YAML mental model and keywords

[← Previous](./06_First_Pipeline_And_CI_UI.md) · [README](./README.md) · [Next: Rules →](./08_Rules_Workflow_And_Pipeline_Types.md)

## 1. Concepts

`.gitlab-ci.yml` is YAML. Order of most keywords does not matter unless documented otherwise. Mental map:

| Area | Examples |
|------|----------|
| Global | `stages`, `workflow`, `default`, `include`, `variables` |
| Job identity | job name, `stage`, `script` / `trigger` |
| When | `rules`, `only`/`except` (legacy), `needs` |
| Where | `image`, `services`, `tags`, `runner` selection |
| Fan-out | `parallel`, `parallel:matrix` (many jobs from one definition) |
| Data | `variables`, `cache`, `artifacts` |
| Deploy | `environment`, `resource_group` |
| Reuse | `include`, `extends`, components / inputs |

```yaml
stages: [test, build]
default:
  image: python:3.12

unit:
  stage: test
  script: ["pytest -q"]

build:
  stage: build
  script: ["docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA ."]
```

Use the [CI/CD YAML reference](https://docs.gitlab.com/ci/yaml/) when implementing — this chapter is the map, not the dump. Expressions exist for dynamic config ([08](./08_Rules_Workflow_And_Pipeline_Types.md)).

## 2. Advanced concepts

### `default:` and `extends`

Share common job fragments; prefer **components** for cross-project paved roads ([13](./13_Includes_Components_And_CI_Catalog.md)).

### YAML gotchas that bite CI

| Trap | Better |
|------|--------|
| Unquoted `012345` variable | Quote strings — Psych may parse octals ([14](./14_Variables_Secrets_And_OIDC.md)) |
| Huge nested YAML | `include` / components |
| Deprecated keywords | Check deprecated list in YAML docs |

### `parallel` / matrix

```yaml
rspec:
  script: ["bundle exec rspec"]
  parallel: 5

test:
  script: ["make test"]
  parallel:
    matrix:
      - PROVIDER: [aws, gcp]
        STACK: [monitoring, app]
```

Use for OS/version/provider fan-out. Prefer `needs` + matrix over giant serial stages ([09](./09_Needs_DAG_And_Downstream_Pipelines.md)).

### Expressions & functions

CI/CD **expressions** (and related dynamic helpers under `ci/functions` docs) make `rules`/`inputs` more programmable — literacy in YAML/expressions references; don’t invent DSLs.

### Optimization

YAML optimization docs cover anchors, `!reference`, and related techniques — use for readability, not cleverness.

## 3. Applications and use cases

| Goal | Focus |
|------|-------|
| Readable CI | Small jobs; named stages; lint in MR |
| Speed | `needs` + sensible `rules` |
| Safety | Explicit `rules`; protected vars |

**Good:** linted YAML with boring structure. **Bad:** copy-pasting a 2,000-line enterprise YAML without knowing which keywords you rely on.

## References

- [CI/CD YAML reference](https://docs.gitlab.com/ci/yaml/)  
- [CI/CD expressions](https://docs.gitlab.com/ci/yaml/expressions/)  
- [`parallel` / matrix](https://docs.gitlab.com/ci/yaml/#parallel)  
- [YAML optimization](https://docs.gitlab.com/ci/yaml/yaml_optimization/)  
- [Deprecated keywords](https://docs.gitlab.com/ci/yaml/deprecated_keywords/)  
