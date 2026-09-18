# 06 — Jobs, needs, concurrency, and matrix

[← Previous](./05_Events_And_Triggers.md) · [README](./README.md) · [Next: Contexts →](./07_Contexts_Expressions_And_Variables.md)

## 1. Concepts

### `needs` — the job graph

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: […]
  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      digest: ${{ steps.push.outputs.digest }}
    steps: […]
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps: […]
```

Downstream jobs read upstream `outputs`. Prefer passing an image **digest** into promote ([17](./17_Deploy_Environments_And_Promote.md)).

### Concurrency

```yaml
concurrency:
  group: deploy-${{ github.event.repository.name }}
  cancel-in-progress: true
```

One group → control parallel runs for the same app/ref. Use cancel for PR CI; for prod deploys you often **queue** instead of cancel.

`queue: max` (when used) caps how many runs wait in a concurrency group — excess can be rejected. Confirm syntax/limits live.

### Matrix

```yaml
strategy:
  fail-fast: false
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [20, 22]
```

Expands to many jobs. Hard product limit: **256 jobs per workflow run** from a matrix (hosted and self-hosted). Design matrices with that ceiling in mind.

## 2. Advanced concepts

### Conditionals

`if:` on jobs/steps uses expressions ([07](./07_Contexts_Expressions_And_Variables.md)). Skipped jobs vs failed jobs behave differently for required checks — know which you need.

### `continue-on-error` / timeouts

Use sparingly. Prefer isolating flaky suites. Set `timeout-minutes` so hung jobs die (hosted jobs also have a **6 hour** execution ceiling; self-hosted **5 days** — confirm [limits](https://docs.github.com/en/actions/reference/limits)).

### Fan-out patterns

| Pattern | Shape |
|---------|-------|
| Test then build | `needs` chain |
| OS/language matrix | `strategy.matrix` |
| Dynamic matrix | Job outputs JSON → next job matrix (advanced) |

### Hosted concurrency ceilings

Plan-dependent concurrent job caps exist for standard vs larger runners (and separate macOS/GPU caps). Treat numbers as **plan facts to confirm**, not folklore.

## 3. Applications and use cases

| Goal | Knob |
|------|------|
| Cheap PR CI | concurrency cancel + small matrix |
| Multi-OS library | matrix OS |
| Safe prod | concurrency without cancel; environment gate |

**Good:** matrix dimensions you actually support. **Bad:** 12×12 matrices that burn minutes and hit 256.

## References

- [Using jobs in a workflow](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs)  
- [Concurrency](https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency)  
- [Running variations of jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations)  
- [Actions limits](https://docs.github.com/en/actions/reference/limits)  
