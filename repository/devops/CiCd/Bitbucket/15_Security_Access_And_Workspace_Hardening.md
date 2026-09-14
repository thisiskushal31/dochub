# 15 — Security, Access, and workspace hardening

[← Previous](./14_Jira_And_Atlassian_Integrations.md) · [README](./README.md) · [Next: Worked example →](./16_Worked_Example_Build_And_Deploy.md)

---

## 1. Concepts

Harden Bitbucket on three planes:

| Plane | Controls |
|-------|----------|
| **People** | Workspace/project/repo permissions; SSO; 2FA |
| **Network** | IP allowlisting (plan-gated); private networking for runners |
| **Pipelines** | Secured/deployment variables; OIDC; runner isolation; pipe supply chain |

---

## 2. Advanced concepts

### Atlassian Access / Guard

Centralize SSO, enforced authentication policies, and user lifecycle with the Atlassian organization. Prefer IdP groups → Bitbucket groups.

### IP allowlisting and session controls

**Premium** can restrict Cloud access (view/push/clone, etc.) to allowlisted IPs — use when policy requires.

### Required two-step verification (Premium)

Workspace can require 2SV for members — combine with Access/SSO for enterprise login.

### Pipelines security

- No long-lived cloud keys when OIDC works ([07](./07_Variables_Secrets_And_OIDC.md))  
- Production secrets only on production deployments ([11](./11_Deployments_And_Environments.md))  
- Review third-party pipes ([10](./10_Pipes_Anchors_And_Reuse.md))  
- Self-hosted runners patched and scoped ([06](./06_Runners_Cloud_And_Self_Hosted.md))  

### Audit and apps

Know who can install Marketplace apps; review tokens/App passwords; rotate when people leave.

### Data Center

You own the perimeter (reverse proxy, SSO, upgrades). Do not assume Cloud Premium controls exist identically.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Enterprise login | Access + SSO + enforced 2FA |
| Prod deploy | Deployment permissions + OIDC |
| Contractor access | Read-only groups; no workspace admin |

**Good:** least privilege + merge checks. **Bad:** workspace admin for everyone; prod keys on PR pipelines.

---

## References

- [Security best practices for Bitbucket Cloud](https://support.atlassian.com/bitbucket-cloud/docs/keep-your-workspace-secure/)  
- [IP allowlisting](https://support.atlassian.com/bitbucket-cloud/docs/control-access-to-your-private-content/)  
- [OIDC](https://support.atlassian.com/bitbucket-cloud/docs/integrate-pipelines-with-resource-servers-using-oidc/)  
