# 16 — Security, permissions, SSO, and config policies

[← Previous](./15_Deployments_Approvals_And_Markers.md) · [README](./README.md) · [Next: Insights →](./17_Insights_Test_Splitting_And_Optimize.md)

---

## 1. Concepts

| Surface | Job |
|---------|-----|
| **Security overview / recommendations** | Baseline hardening |
| **Contexts / env vars** | Secret storage ([12](./12_Contexts_Env_Vars_And_Secrets.md)) |
| **IP ranges** | Restrict job egress to known ranges |
| **Audit logs** | Who changed what |
| **Roles & permissions** | Project/org capabilities |
| **SSO / MFA** | Enterprise login |
| **Config policies** | Enforce required config shapes (plan-gated) |
| **Supply chain** | Orb/image trust |

---

## 2. Advanced concepts

### SSO

Set up SSO and group mapping so IdP groups become CircleCI access. MFA for users where required.

### Config policies

Policy-as-code over configs and sometimes runners/contexts — confirm which plan includes it before promising.

### Site-to-site / networking

Hybrid connectivity docs exist for private network patterns — use with runners when needed.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Company IdP | SSO + roles |
| Regulated deploy | IP ranges + approval + restricted contexts |
| Enforce “must scan” | Config policies |

**Good:** least privilege on contexts and OIDC roles. **Bad:** secrets in config YAML.

---

## References

- [Security overview](https://circleci.com/docs/guides/security/security-overview/)  
- [Security recommendations](https://circleci.com/docs/guides/security/security-recommendations/)  
- [IP ranges](https://circleci.com/docs/guides/security/ip-ranges/)  
- [Roles and permissions](https://circleci.com/docs/guides/permissions-authentication/roles-and-permissions-overview/)  
- [SSO overview](https://circleci.com/docs/guides/permissions-authentication/sso-overview/)  
- [Config policies overview](https://circleci.com/docs/guides/config-policies/config-policy-management-overview/)  
