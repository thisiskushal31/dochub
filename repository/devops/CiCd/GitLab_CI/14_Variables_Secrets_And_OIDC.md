# 14 — Variables, secrets, and OIDC

[← Previous](./13_Includes_Components_And_CI_Catalog.md) · [README](./README.md) · [Next: Environments →](./15_Environments_Deployments_And_Release.md)

---

## 1. Concepts

**CI/CD variables** are environment variables for jobs — config and secrets.

| Scope | Use |
|-------|-----|
| Project / group / instance | Inheritance down the hierarchy |
| YAML `variables:` | Non-secret defaults in config |
| Protected | Only on protected branches/tags |
| Masked | Redacted in logs (with limits) |
| File type | Value written to a temp file path |

Always quote values that must stay strings (`"012345"`) — unquoted numbers can be parsed oddly.

### OIDC / ID tokens

Prefer **ID tokens** (OIDC) to exchange for short-lived cloud credentials (AWS, Azure, GCP, Vault, …). Legacy `CI_JOB_JWT` / `CI_JOB_JWT_V2` were **removed in GitLab 17.0** — use ID tokens.

```yaml
deploy:
  id_tokens:
    GITLAB_OIDC_TOKEN:
      aud: https://sts.amazonaws.com
  script:
    - # exchange token with cloud — follow provider how-to
```

---

## 2. Advanced concepts

### Secrets management

| Approach | Note |
|----------|------|
| Masked/protected vars | Baseline |
| External secret stores | Vault and others via ID tokens / integrations |
| Secure Files | Project files for certs/profiles (mobile etc.) |
| Pipeline security | Don’t expose secrets to fork/MR untrusted contexts |

### Cloud services how-tos

Official pages cover AWS/Azure/GCP OIDC setup — cookbooks stay upstream; trust design stays here.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging vs prod | Environment-scoped vars ([15](./15_Environments_Deployments_And_Release.md)) |
| Cloud deploy | ID token → role assumption |
| Org defaults | Group variables (non-secret) + project secrets |

**Good:** protected + masked + OIDC. **Bad:** long-lived cloud keys in unprotected variables on a public fork-friendly project.

---

## References

- [CI/CD variables](https://docs.gitlab.com/ci/variables/)  
- [Connect to cloud services (OIDC)](https://docs.gitlab.com/ci/cloud_services/)  
- [ID token authentication](https://docs.gitlab.com/ci/secrets/id_token_authentication/)  
- [Secure Files](https://docs.gitlab.com/ci/secure_files/)  
