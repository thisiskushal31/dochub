# 13 — OIDC and cloud federation

[← Previous](./12_Contexts_Env_Vars_And_Secrets.md) · [README](./README.md) · [Next: Dynamic config →](./14_Dynamic_Config_And_Continuation.md)

---

## 1. Concepts

CircleCI can inject **OpenID Connect ID tokens** into jobs so you authenticate to AWS, GCP, and other OIDC-capable systems **without** long-lived cloud keys in contexts.

Available env vars (as documented):

- `$CIRCLE_OIDC_TOKEN`
- `$CIRCLE_OIDC_TOKEN_V2` (different `sub` claim format including change source)

One-time: configure the cloud provider to **trust CircleCI** as an IdP for your org. Then jobs exchange the token for short-lived cloud roles.

Advantages: less secret sprawl, automatic rotation story, finer role policies.

---

## 2. Advanced concepts

### Forks

OIDC tokens for forked builds require **Pass secrets to builds from forked pull requests** (project advanced settings). Keep off for public forks unless you accept the risk.

### Custom claims

Docs cover custom claims for tighter cloud trust policies.

### Registry pulls

Guides exist for pulling from AWS ECR / GCP Artifact Registry with OIDC — prefer over static registry passwords.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Deploy to AWS | OIDC → IAM role |
| Pull private images | OIDC to ECR/GAR |
| Least privilege | Role scoped to pipeline/project claims |

**Good:** cloud trust maps to CircleCI org/project. **Bad:** `AdministratorAccess` on the federated role.

---

## References

- [Using OpenID Connect tokens](https://circleci.com/docs/guides/permissions-authentication/openid-connect-tokens/)  
- [OIDC tokens with custom claims](https://circleci.com/docs/guides/permissions-authentication/oidc-tokens-with-custom-claims/)  
- [Pull from AWS ECR with OIDC](https://circleci.com/docs/guides/permissions-authentication/pull-an-image-from-aws-ecr-with-oidc/)  
