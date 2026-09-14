# 15 — OIDC and cloud federation

[← Previous](./14_Secrets_Variables_And_Environments.md) · [README](./README.md) · [Next: Security →](./16_Security_Hardening_Permissions_And_Forks.md)

---

## 1. Concepts

**OpenID Connect (OIDC)** lets a job request a short-lived token from GitHub’s OIDC provider and exchange it at AWS/Azure/GCP/Vault/… for cloud credentials. No long-lived access key in Actions secrets.

```yaml
permissions:
  id-token: write   # required to request OIDC JWT
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@…  # example pattern
        with:
          role-to-assume: arn:aws:iam::123:role/gha
          aws-region: eu-west-1
```

Cloud side: trust policy matches JWT **claims** (`sub`, `repository`, `aud`, …).

---

## 2. Advanced concepts

### Claims that matter

| Claim / idea | Why |
|--------------|-----|
| `sub` | Subject — often encodes repo + ref + environment |
| `repository` / `repository_owner` | Scope to org/repo |
| `job_workflow_ref` | Trust the **reusable** workflow file, not every caller |
| `environment` | Tie role to Actions environment |
| `repo_property_*` | Org/enterprise **custom properties** as ABAC claims (where supported) |

Immutable default subject formats and enterprise data-residency issuer URLs are version/platform gated — confirm the OIDC concept + reference pages for your host (github.com vs GHE / data residency).

### Official cloud how-tos

Docs include AWS, Azure, GCP, HashiCorp Vault, JFrog, Octopus, PyPI, generic providers, API-gateway patterns, and **OIDC with reusable workflows**. Cookbook steps stay upstream; the **trust design** stays here.

### Dependabot / special actors

OIDC behavior for Dependabot and similar actors has documented nuances — don’t assume every automation identity gets the same claims.

### Custom actions

Actions themselves can authenticate with OIDC when designed for it — useful for private tooling.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Push to ECR/ACR/GCR | OIDC login action + short session |
| Org deploy paved road | Reusable workflow + trust on `job_workflow_ref` |
| Replace static keys | Rotate keys out after OIDC works |

**Good:** least-privilege roles + claim conditions as tight as operations allow. **Bad:** `*` trust on every repo and every ref.

---

## References

- [OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)  
- [OIDC reference](https://docs.github.com/en/actions/reference/security/openid-connect)  
- [Security harden deployments](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments)  
- [OIDC with reusable workflows](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows)  
