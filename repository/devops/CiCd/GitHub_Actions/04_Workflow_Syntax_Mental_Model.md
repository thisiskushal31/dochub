# 04 — Workflow syntax mental model

[← Previous](./03_First_Workflow_And_Actions_UI.md) · [README](./README.md) · [Next: Events →](./05_Events_And_Triggers.md)

---

## 1. Concepts

A workflow file is YAML. Core keys:

| Key | Role |
|-----|------|
| `name` | Display name |
| `on` | Events / filters |
| `permissions` | `GITHUB_TOKEN` scopes (workflow or job) |
| `env` | Env vars (workflow / job / step) |
| `defaults` | Default `run` shell / working-directory |
| `concurrency` | Cancel/queue overlapping runs |
| `jobs` | Map of job id → definition |
| `jobs.<id>.runs-on` | Runner labels / group |
| `jobs.<id>.needs` | Upstream jobs |
| `jobs.<id>.if` | Conditional |
| `jobs.<id>.strategy` | Matrix |
| `jobs.<id>.container` / `services` | Containerized job / sidecars |
| `jobs.<id>.environment` | Deployment environment gate |
| `jobs.<id>.outputs` | Values for downstream jobs |
| `jobs.<id>.steps` | `uses` / `run` / `with` / `env` |
| `jobs.<id>.timeout-minutes` | Job timeout |

```yaml
name: ci
on:
  pull_request:
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: make test
        env:
          CI: true
```

Full field encyclopedia: [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). This chapter is the map, not the dump.

**File size gate:** each workflow file must be **≤ 500 KB** or it will not start. Push shared logic into reusable workflows or composites when YAML grows.

---

## 2. Advanced concepts

### Permissions

Org/repo defaults for `GITHUB_TOKEN` vary. Prefer explicit least privilege at workflow top; widen only on jobs that need write ([16](./16_Security_Hardening_Permissions_And_Forks.md)).

### Workflow commands & environment files

From `run:` steps you can set outputs, env, PATH, masks, notices, and job summaries via [workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands) / `$GITHUB_OUTPUT`, `$GITHUB_ENV`, `$GITHUB_PATH`, `$GITHUB_STEP_SUMMARY`.

### Calling other workflows

A job may be only:

```yaml
jobs:
  call:
    uses: org/workflows/.github/workflows/ci.yaml@v1
    with: { … }
    secrets: inherit
```

That is the paved-road shape ([13](./13_Reusable_Workflows_And_Composites.md)).

### YAML anchors

Within a file, YAML anchors/aliases can reduce duplication — also documented under reusing configurations. Prefer reusable workflows for **cross-repo** standards.

---

## 3. Applications and use cases

| Goal | Syntax focus |
|------|----------------|
| Least privilege | Top-level `permissions` |
| Fast PR CI | `concurrency` + path filters on `on` |
| Promote lane | `environment` + job `outputs` (digest) |
| Controlled toolchain | `container:` / `services:` |

**Good:** explicit permissions + small files. **Bad:** `permissions: write-all` and 2,000-line workflows.

---

## References

- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)  
- [Workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands)  
- [Actions limits](https://docs.github.com/en/actions/reference/limits)  
