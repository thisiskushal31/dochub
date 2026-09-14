# 03 — First workflow and the Actions UI

[← Previous](./02_Core_Model_Workflows_Jobs_Steps_Runners.md) · [README](./README.md) · [Next: Syntax →](./04_Workflow_Syntax_Mental_Model.md)

---

## 1. Concepts

1. Add `.github/workflows/ci.yml` on the default branch (or open a PR that adds it).  
2. Push / open a PR that matches `on:`.  
3. Open the repo **Actions** tab → select the workflow → open the run.  
4. Expand jobs/steps; download logs if needed.  
5. On a PR, confirm the **check** appears and (when ready) make it **required**.

Minimal CI:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: make test
```

### UI surfaces

| Place | Use |
|-------|-----|
| Actions tab | Runs, re-run, cancel, enable/disable workflow |
| PR Checks | Merge gate signal |
| Workflow file editor / templates | Scaffold from language templates |
| Deployment environments | Approvals and history ([14](./14_Secrets_Variables_And_Environments.md), [17](./17_Deploy_Environments_And_Promote.md)) |
| Run graph | Visualize `needs` / matrix |

---

## 2. Advanced concepts

### Templates

GitHub and orgs ship **workflow templates**. Prefer templates as a starting point, then pin actions and tighten `permissions`. Org templates live in a special `.github` repo pattern — see org sharing docs.

### Operating a run

| Action | Notes |
|--------|-------|
| Re-run failed / all jobs | Limited re-runs per run (see [limits](https://docs.github.com/en/actions/reference/limits)) |
| Cancel | Sends cancellation; jobs should handle signals where possible |
| Skip on push/PR | Commit message directives documented upstream |
| Disable workflow | Stops triggers without deleting YAML |
| Debug logging | Secrets/vars to enable runner + step debug ([18](./18_Monitor_Metrics_And_Billing_Literacy.md)) |

### Status badges

Optional README badge for a workflow — useful for public repos; not a substitute for required checks.

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| First green CI | Actions run + PR check |
| Gate | Required check on protected branch / ruleset |
| Operability | Team can find logs without asking platform |

**Good:** required check named stably. **Bad:** merge without reading why a job was skipped.

---

## References

- [Quickstart](https://docs.github.com/en/actions/get-started/quickstart)  
- [Using workflow templates](https://docs.github.com/en/actions/how-tos/write-workflows/use-workflow-templates)  
- [Manually running a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)  
- [Re-running workflows and jobs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs)  
