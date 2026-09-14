# 08 — Workflows: depends_on, matrix, schedules, and blocks

[← Previous](./07_Templates_And_First_Pipeline_Yml.md) · [README](./README.md) · [Next: Plugins →](./09_Plugins_Artifacts_Cache_And_Annotations.md)

---

## 1. Concepts

| Mechanism | Use |
|-----------|-----|
| **depends_on** | Explicit job graph |
| **wait** | Simple barrier |
| **block** / **input** | Human gates and parameters |
| **Build matrix** | Fan-out variants (versions/OS) |
| **Conditionals (`if`)** | Branch/PR/message filters |
| **Schedules** | Cron builds |
| **Concurrency groups** | Serialize deploys / shared resources |

### Manual gate before deploy

```yml
steps:
  - command: "npm test"
  - wait
  - block: ":rocket: Deploy to production?"
  - command: "./scripts/deploy.sh"
    if: build.branch == "main"
    concurrency: 1
    concurrency_group: "my-app-deploy"
```

---

## 2. Advanced concepts

### Soft fail / retry / timeouts

Use deliberately — don’t soft-fail security gates. Retry flaky infra, not broken assertions.

### Job priority

Hosted and busy fleets can use priority so important jobs jump the queue (best-effort). Confirm current support in docs.

### Skipping / canceling

Know branch configs and skip patterns so forks/docs-only commits don’t burn the fleet.

---

## 3. Applications and use cases

| Goal | Shape |
|------|-------|
| PR only | Conditional on PR builds |
| Nightly | Scheduled pipeline |
| Serialize prod | concurrency_group |
| Matrix CI | build matrix docs |

**Good:** fail-fast unit before expensive e2e. **Bad:** block steps nobody owns.

---

## References

- [Depends on](https://buildkite.com/docs/pipelines/configure/depends-on)  
- [Conditionals](https://buildkite.com/docs/pipelines/configure/conditionals)  
- [Build matrix](https://buildkite.com/docs/pipelines/configure/workflows/build-matrix)  
- [Scheduled builds](https://buildkite.com/docs/pipelines/configure/workflows/scheduled-builds)  
- [Controlling concurrency](https://buildkite.com/docs/pipelines/configure/workflows/controlling-concurrency)  
- [Block step](https://buildkite.com/docs/pipelines/configure/step-types/block-step)  
