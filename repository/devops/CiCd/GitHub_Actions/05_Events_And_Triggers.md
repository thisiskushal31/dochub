# 05 — Events and triggers

[← Previous](./04_Workflow_Syntax_Mental_Model.md) · [README](./README.md) · [Next: Jobs →](./06_Jobs_Needs_Concurrency_And_Matrix.md)

---

## 1. Concepts

`on:` decides **when** a workflow can start. Common families:

| Family | Examples | Typical use |
|--------|----------|-------------|
| Git | `push`, `pull_request`, `pull_request_target` | CI / careful base-privileged automation |
| Manual | `workflow_dispatch` | Promote, break-glass, parameterized runs |
| Schedule | `schedule` (cron) | Audits, drift checks |
| Workflow | `workflow_call`, `workflow_run` | Paved road; “after CI” hooks |
| External | `repository_dispatch` | Outside systems poke GitHub |
| Meta | `release`, `issue_comment`, … | Release automation / bot chores |

```yaml
on:
  pull_request:
    paths: ['src/**', '.github/workflows/**']
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
  schedule:
    - cron: '0 6 * * 1'
```

Activity `types:` (opened, synchronize, …) and branch/tag/path filters refine noise. Full catalog: [events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

---

## 2. Advanced concepts

### `pull_request` vs `pull_request_target`

| Event | Checkout default | Privilege posture |
|-------|------------------|-------------------|
| `pull_request` | PR merge ref | Safer default for untrusted PR code |
| `pull_request_target` | Base branch context | **Base-repo privileges** — dangerous if you then run untrusted PR code |

Treat `pull_request_target` as a staff-only tool; read the secure-use page before shipping ([16](./16_Security_Hardening_Permissions_And_Forks.md)).

### Cron realities

Scheduled workflows run on the **default branch** version of the file. Crons can delay under load. Always give schedules an **owner** and alert path ([18](./18_Monitor_Metrics_And_Billing_Literacy.md)).

### `workflow_run` and loops

Chaining via `workflow_run` is powerful and easy to recurse. Prefer explicit `workflow_call` paved roads when you control both sides.

### Rate / queue limits

Repos storms can hit trigger and queue limits (per-repo event rates, runs queued per 10s). Confirm [limits](https://docs.github.com/en/actions/reference/limits) when automating bursts.

---

## 3. Applications and use cases

| Goal | Trigger |
|------|---------|
| PR CI | `pull_request` (+ paths) |
| Build on main | `push` to protected branch |
| Promote | `workflow_dispatch` + environment |
| Weekly audit | `schedule` |
| Org standard | caller `pull_request` → `uses:` reusable |

**Good:** filters match intent. **Bad:** every push to every branch runs a 30-minute matrix.

---

## References

- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)  
- [Triggering a workflow](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)  
- [Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)  
