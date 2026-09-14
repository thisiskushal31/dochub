# 22 — YAML and configuration catalog

[← Previous](./21_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./23_Troubleshooting_And_Staff_Checklist.md)

---

## 1. Concepts — surfaces you edit

| Surface | Where |
|---------|--------|
| Workflow files | `.github/workflows/*.yml` (≤ **500 KB** each) |
| Composite actions | `.github/actions/<name>/action.yml` |
| Reusable workflows | `.github/workflows/*` with `on: workflow_call` |
| Repo/org variables & secrets | Settings UI / API |
| Environments + protection rules | Settings → Environments |
| Runner groups / larger / ARC | Org/enterprise settings + cluster |
| Branch rules / required checks | Rulesets / branch protection |
| Custom properties (OIDC claims) | Org/enterprise metadata |

---

## 2. Advanced — workflow keys (index)

**Workflow:** `name`, `run-name`, `on` (+ filters/types/inputs), `permissions`, `env`, `defaults`, `concurrency` (incl. queue behavior), `jobs`.

**Job:** `runs-on`, `needs`, `if`, `strategy.matrix` (≤ **256** jobs/run), `container`, `services`, `environment`, `outputs`, `permissions`, `timeout-minutes`, `continue-on-error`, `concurrency`, `secrets` / `secrets: inherit` (callable), `uses` (reusable).

**Step:** `id`, `if`, `uses`, `run`, `shell`, `with`, `env`, `working-directory`, `timeout-minutes`, `continue-on-error`.

**Workflow commands / files:** `$GITHUB_ENV`, `$GITHUB_OUTPUT`, `$GITHUB_PATH`, `$GITHUB_STEP_SUMMARY`, mask/notice/error commands.

Event catalog and every subkey: [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) + [events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) + [workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands).

---

## 3. Applications and use cases

| Task | Start |
|------|-------|
| Author CI | [04](./04_Workflow_Syntax_Mental_Model.md) + syntax ref |
| Paved road | [13](./13_Reusable_Workflows_And_Composites.md) |
| OIDC job | [15](./15_OIDC_And_Cloud_Federation.md) |
| Hit a ceiling | [18](./18_Monitor_Metrics_And_Billing_Literacy.md) + [limits](https://docs.github.com/en/actions/reference/limits) |

---

## References

- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)  
- [Contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)  
- [Metadata syntax (actions)](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)  
- [Variables reference](https://docs.github.com/en/actions/reference/workflows-and-actions/variables)  
