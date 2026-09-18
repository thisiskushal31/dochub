# 12 — Contexts, environment variables, and secrets

[← Previous](./11_Reusable_Config_Commands_Executors_Parameters.md) · [README](./README.md) · [Next: OIDC →](./13_OIDC_And_Cloud_Federation.md)

## 1. Concepts

| Layer | Scope |
|-------|-------|
| **Project env vars** | One project (UI or API) |
| **Context** | Org-level named secret bundles; attached per job in workflows |
| **Config `environment`** | Non-secret defaults in YAML |
| **Job runtime** | Injected by CircleCI / OIDC tokens |

Attach contexts in the **workflow** job entry:

```yaml
workflows:
  main:
    jobs:
      - deploy:
          context:
            - org-global
            - prod-deploy
```

Create context → add env vars → reference by name. Restrict which teams/projects can use sensitive contexts ([16](./16_Security_Permissions_SSO_And_Policies.md)).

## 2. Advanced concepts

### Precedence

Many layers can set variables — learn documented precedence so UI secrets aren’t overridden unexpectedly.

### Forks

Passing secrets to forked PRs is a project setting — default deny for public OSS.

### Prefer OIDC for cloud

Long-lived cloud keys in contexts are worse than OIDC federation ([13](./13_OIDC_And_Cloud_Federation.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Shared npm token | context `npm-publish` |
| Prod-only AWS | restricted context + OIDC |
| Non-secret flags | config `environment` |

**Good:** separate staging vs prod contexts. **Bad:** one `org-global` with production keys for every job.

## References

- [Contexts](https://circleci.com/docs/guides/security/contexts/)  
- [Environment variables](https://circleci.com/docs/guides/security/env-vars/)  
- [Set environment variable](https://circleci.com/docs/guides/security/set-environment-variable/)  
- [Security recommendations](https://circleci.com/docs/guides/security/security-recommendations/)  
