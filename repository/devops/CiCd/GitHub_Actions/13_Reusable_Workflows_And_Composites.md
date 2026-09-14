# 13 — Reusable workflows and composites (paved road)

[← Previous](./12_Caches_And_Artifacts.md) · [README](./README.md) · [Next: Secrets →](./14_Secrets_Variables_And_Environments.md)

---

## 1. Concepts

Stop copy-pasting CI YAML into every service repo.

### Reusable workflow

A workflow with `on: workflow_call` that other workflows invoke **as a job**:

```yaml
# org/workflows — .github/workflows/reusable-ci.yaml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '22'
    secrets:
      # declare if not using secrets: inherit on caller
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm test
```

```yaml
# service-repo
jobs:
  call-ci:
    uses: org/workflows/.github/workflows/reusable-ci.yaml@v10
    with:
      node-version: '22'
    secrets: inherit
```

**Pin** `@v10` or a SHA. Bumping the paved road is a deliberate platform change.

### Composite actions

Reusable **steps** (often `.github/actions/<name>/action.yml`) when you need a local building block, not a whole job graph.

### Workflow templates & YAML anchors

Orgs can offer **templates** for “new workflow” scaffolding. **YAML anchors/aliases** reduce duplication *inside one file*. Cross-repo standards still belong in `workflow_call`.

---

## 2. Advanced concepts

### Sharing scope

Docs cover sharing actions/workflows from private repos, across an organization, and across an enterprise — access is a product setting, not only a YAML trick.

### Nesting and limits

Reusable workflows can nest within documented limits. Huge call graphs hurt debuggability — prefer a shallow paved road (CI / build / deploy).

### Runner group lock-in

Restrict a runner group so only approved reusable workflows may use privileged hardware — pairs compliance with OIDC ([15](./15_OIDC_And_Cloud_Federation.md)).

### OIDC + reusable workflows

Cloud trust can key off **`job_workflow_ref`** (the *called* reusable workflow ref) so any repo may call the paved deploy workflow while the cloud role still only trusts that workflow file. This is the staff pattern for “org-wide deploy without org-wide cloud admin keys.”

### Typical split

| Reusable | When |
|----------|------|
| `reusable-ci-*.yaml` | PR lint/test/scan |
| `reusable-build-*.yaml` | Build + push + digest output |
| `reusable-deploy-*.yaml` | Environment-gated promote |

Same road for data-plane workers with different inputs ([CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Org standard CI | Central workflows repo + pinned calls |
| Tiny helper | Composite action |
| Compliant deploy | Reusable deploy + OIDC trust on `job_workflow_ref` |

**Good:** versioned paved road with CODEOWNERS. **Bad:** `@main` on reusable workflows; eighty divergent CI files.

---

## References

- [Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)  
- [Reusing workflow configurations](https://docs.github.com/en/actions/concepts/workflows-and-actions/reusing-workflow-configurations)  
- [OIDC with reusable workflows](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows)  
- [Creating a composite action](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action)  
