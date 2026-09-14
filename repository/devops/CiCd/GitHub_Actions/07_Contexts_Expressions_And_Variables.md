# 07 — Contexts, expressions, and variables

[← Previous](./06_Jobs_Needs_Concurrency_And_Matrix.md) · [README](./README.md) · [Next: Hosted runners →](./08_GitHub_Hosted_Runners.md)

---

## 1. Concepts

**Contexts** are objects you read in `${{ }}` expressions: `github`, `env`, `vars`, `secrets`, `needs`, `steps`, `runner`, `job`, `matrix`, `inputs`, …

```yaml
if: github.event_name == 'pull_request'
env:
  APP: ${{ vars.APP_NAME }}
steps:
  - run: echo "sha=${{ github.sha }}"
  - id: build
    run: echo "digest=$DIGEST" >> "$GITHUB_OUTPUT"
  - run: echo "${{ steps.build.outputs.digest }}"
```

**Variables (`vars`)** — non-secret configuration at repo/org/environment.  
**Secrets** — sensitive values; masked in logs; different scopes ([14](./14_Secrets_Variables_And_Environments.md)).  
**Default env vars** — `GITHUB_*`, `RUNNER_*`, etc. (variables reference).

Expressions support operators, functions (`contains`, `startsWith`, `hashFiles`, `success()`, `always()`, …).

---

## 2. Advanced concepts

### Context availability

Not every context exists in every spot (e.g. `secrets` not available in some `if` positions the way people expect; `env` context timing). When an expression misbehaves, check the [contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts) for **where** it is allowed.

### Interpolation hazards

Never splice untrusted PR titles/bodies/branch names into `run:` scripts — that is **script injection**. Pass via `env:` and quote inside the shell, or use validated inputs ([16](./16_Security_Hardening_Permissions_And_Forks.md)).

### Job outputs chain

```yaml
jobs:
  a:
    outputs: { image: ${{ steps.x.outputs.image }} }
    steps: […]
  b:
    needs: a
    steps:
      - run: echo "${{ needs.a.outputs.image }}"
```

### `hashFiles` for caches

Cache keys commonly use `hashFiles('**/lockfile')` ([12](./12_Caches_And_Artifacts.md)).

---

## 3. Applications and use cases

| Goal | Tool |
|------|------|
| Feature flags for CI | `vars` |
| Digest promote | job outputs + `needs` |
| Conditional deploy | `if:` on environment job |
| Matrix values | `matrix.*` in `runs-on` / steps |

**Good:** typed reusable-workflow `inputs`. **Bad:** secret values in `vars` or plaintext logs.

---

## References

- [Contexts](https://docs.github.com/en/actions/concepts/workflows-and-actions/contexts)  
- [Expressions](https://docs.github.com/en/actions/concepts/workflows-and-actions/expressions)  
- [Variables](https://docs.github.com/en/actions/concepts/workflows-and-actions/variables)  
- [Contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)  
- [Evaluate expressions](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions)  
