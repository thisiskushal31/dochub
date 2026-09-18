# 02 — Core model: workflows, jobs, steps, runners

[← Previous](./01_What_Is_GitHub_Actions.md) · [README](./README.md) · [Next: First workflow →](./03_First_Workflow_And_Actions_UI.md)

## 1. Concepts

| Term | Plain meaning |
|------|----------------|
| **Workflow** | One YAML file under `.github/workflows/` — what can run and when |
| **Event** | Why a run started (`push`, `pull_request`, `schedule`, …) |
| **Run** | One execution instance of a workflow |
| **Job** | Unit of work on **one** runner; jobs can depend on each other (`needs`) |
| **Step** | Ordered command or action inside a job |
| **Action** | Reusable packaged step (`uses: owner/repo@ref`) |
| **Runner** | Machine that executes the job (hosted, larger, self-hosted, ARC) |
| **`GITHUB_TOKEN`** | Built-in short-lived token for the run’s API access |

```text
event
  └─ workflow run
       ├─ job A (runner) → steps…
       └─ job B needs A (runner) → steps…
```

Jobs in one workflow share the run’s context (commit SHA, actor, event payload) but **not** a filesystem unless you pass **artifacts**, **caches**, or job **outputs**.

## 2. Advanced concepts

### Job graph

`needs` builds a DAG. Skipped upstream jobs can cascade. Status checks map to job names — rename carefully if branch protection requires them.

### Runner choice is a product decision

| Runner class | Ops burden | Typical use |
|--------------|------------|-------------|
| Standard hosted | Low | Default CI |
| Larger hosted | Low–medium | Heavy builds, static IP / VNet |
| Self-hosted | High | Special hardware, private nets, licensed tools |
| ARC scale sets | Medium–high | Elastic self-hosted on Kubernetes |

### Actions vs scripts

Prefer small `run:` scripts you own for business logic; use well-known actions for checkout, setup-*, cache, OIDC login. Every third-party `uses:` is supply-chain surface ([11](./11_Actions_Marketplace_And_Pinning.md), [16](./16_Security_Hardening_Permissions_And_Forks.md)).

### Workflow commands

Steps can talk to the runner via stdout commands / environment files (`::warning::`, `$GITHUB_ENV`, `$GITHUB_OUTPUT`, job summaries). Details: [04](./04_Workflow_Syntax_Mental_Model.md) and the workflow-commands reference.

## 3. Applications and use cases

| Goal | Model focus |
|------|-------------|
| Fast PR feedback | Few jobs, path filters, concurrency cancel |
| Release | Separate build job → outputs digest → gated deploy job |
| Org standard | Caller workflows thin; reusable workflows thick |

**Good:** one clear graph per delivery lane. **Bad:** one giant job that mixes test, publish, and prod apply with write-all permissions.

## References

- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)  
- [Workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows)  
- [About custom actions](https://docs.github.com/en/actions/concepts/workflows-and-actions/custom-actions)  
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token)  
