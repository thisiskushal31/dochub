# 14 — Secrets, variables, and environments

[← Previous](./13_Reusable_Workflows_And_Composites.md) · [README](./README.md) · [Next: OIDC →](./15_OIDC_And_Cloud_Federation.md)

## 1. Concepts

| Kind | Use for | Scopes |
|------|---------|--------|
| **Secret** | Credentials, tokens | Repo, org, environment |
| **Variable (`vars`)** | Non-secret config | Repo, org, environment |
| **`GITHUB_TOKEN`** | API access for *this* run | Automatic; permission-scoped |
| **Environment** | Named deploy target with protection rules + env-scoped secrets/vars | Repo settings |

```yaml
jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: echo "app=${{ vars.APP_NAME }}"
      # prefer OIDC over long-lived cloud secrets
```

Org secrets can be restricted to selected repositories. Environment secrets only exist for jobs that declare that `environment:`.

## 2. Advanced concepts

### `GITHUB_TOKEN`

Injected automatically; permissions from workflow/`permissions` and org defaults. It can trigger *other* workflows depending on settings — understand recursion. Prefer least privilege ([16](./16_Security_Hardening_Permissions_And_Forks.md)). Rate limits for API calls via `GITHUB_TOKEN` are documented separately from user PATs ([limits](https://docs.github.com/en/actions/reference/limits)).

### Environment protection

| Rule family | Effect |
|-------------|--------|
| Required reviewers | Humans approve before job proceeds |
| Wait timer | Delay |
| Deployment branches/tags | Only certain refs |
| Custom deployment protection rules | GitHub Apps as external gates |

Gate approval wait has an upper bound (docs cite **30 days** — confirm live).

### Forks and secrets

`pull_request` from forks generally must **not** see secrets. Approvals for fork workflow runs are an org control ([16](./16_Security_Hardening_Permissions_And_Forks.md)).

### Inheritance on reusable workflows

`secrets: inherit` vs explicit secret mapping — be intentional so service repos don’t silently gain prod secrets.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging auto / prod gated | Two environments |
| Shared non-secret config | Org `vars` |
| Cloud auth | OIDC ([15](./15_OIDC_And_Cloud_Federation.md)) |

**Good:** env-scoped secrets + reviewers on production. **Bad:** one repo secret used for every environment with no gate.

## References

- [Secrets](https://docs.github.com/en/actions/concepts/security/secrets)  
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token)  
- [Deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)  
- [Using secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)  
- [Managing environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)  
