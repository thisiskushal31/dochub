# 07 — Variables, secrets, and OIDC

[← Previous](./06_Runners_Cloud_And_Self_Hosted.md) · [README](./README.md) · [Next: Triggers →](./08_Triggers_Steps_Stages_Parallel.md)

---

## 1. Concepts

| Surface | Use |
|---------|-----|
| **Workspace variables** | Shared across repos |
| **Repository variables** | One repo; mark **secured** to mask in logs |
| **Deployment variables** | Per environment; often permission-gated |
| **OIDC** | Federate to AWS/GCP/Azure without long-lived cloud keys |
| **Third-party secret providers** | Inject from external vaults at step runtime (when enabled) |

Never commit secrets to YAML. Prefer OIDC/roles for cloud deploys ([Security/5](../../Security/5_OIDC_CI_And_Least_Privilege.md)).

---

## 2. Advanced concepts

### Secured variables

Secured values are masked in logs but still available to the step — anyone who can edit the pipeline YAML or run arbitrary script on that context can potentially exfiltrate. Combine with deployment permissions and branch restrictions.

### SSH keys

Pipelines supports SSH keys for private module fetch and host deploys — manage as carefully as variables.

### OIDC setup

Configure OIDC in Bitbucket and trust Bitbucket’s issuer in the cloud IAM provider. Scope roles to deploy actions only.

### External secret providers

When using provider middleware, secrets never rest in Bitbucket storage — validate JWTs and least-privilege paths.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| npm token for CI | Secured repo variable |
| Prod cloud deploy | OIDC + deployment environment |
| Shared org registry auth | Workspace variable |

**Good:** prod secrets only on production deployments. **Bad:** prod cloud keys available to every PR pipeline.

---

## References

- [Variables and secrets](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/)  
- [Integrate Pipelines with resource servers using OIDC](https://support.atlassian.com/bitbucket-cloud/docs/integrate-pipelines-with-resource-servers-using-oidc/)  
- [Using SSH keys in Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/using-ssh-keys-in-bitbucket-pipelines/)  
