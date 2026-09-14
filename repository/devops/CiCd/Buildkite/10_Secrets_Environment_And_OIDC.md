# 10 — Secrets, environment variables, and OIDC

[← Previous](./09_Plugins_Artifacts_Cache_And_Annotations.md) · [README](./README.md) · [Next: Dynamic pipelines →](./11_Dynamic_Pipelines_And_Pipeline_Upload.md)

---

## 1. Concepts

Pipelines need credentials for registries, clouds, and deploy targets. Buildkite documents several patterns:

| Approach | Notes |
|----------|-------|
| **Agent environment / hooks** | Common on self-hosted — secrets never leave your estate |
| **Buildkite secrets** | Encrypted store usable with hosted or self-hosted agents |
| **OIDC** | Agent requests short-lived tokens with job claims for cloud federation |
| **Pipeline env vars** | Convenient; watch precedence and leakage in logs |

Environment variables can be set in many layers — learn **precedence** so a UI var does not silently override agent policy.

---

## 2. Advanced concepts

### OIDC

`buildkite-agent oidc request` yields a short-lived token asserting org/pipeline/job/branch/commit claims. Federate to AWS/GCP/Azure (and Package Registries) instead of long-lived access keys. Subject claim can be tuned for broader/narrower trust.

### Risk basics

Don’t `echo` secrets; don’t put prod credentials on PR pipelines from forks; rotate agent tokens; prefer job-scoped cloud roles ([CiCd/7](../7_Secrets_OIDC_And_Pipeline_Identity.md) sister literacy).

### Deploy allowlists

Agent hooks can restrict which pipelines may run deploy commands — pair with dedicated deploy pipelines ([12](./12_Deployments_And_Environments.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| AWS deploy | OIDC → role assume |
| npm private registry | Agent-side auth or Buildkite secrets |
| Open-source PRs | No prod secrets on those agents |

**Good:** short-lived federation. **Bad:** org-wide AWS key in every agent.

---

## References

- [Secrets overview](https://buildkite.com/docs/pipelines/security/secrets)  
- [Managing pipeline secrets](https://buildkite.com/docs/pipelines/security/secrets/managing)  
- [Buildkite secrets](https://buildkite.com/docs/pipelines/security/secrets/buildkite-secrets)  
- [OIDC in Pipelines](https://buildkite.com/docs/pipelines/security/oidc)  
- [Environment variables](https://buildkite.com/docs/pipelines/configure/environment-variables)  
