# 06 — Variables, secrets, and the Library

[← Previous](./05_Agents_Hosted_And_Self_Hosted.md) · [README](./README.md) · [Next: Triggers →](./07_Triggers_Stages_Jobs_And_Strategies.md)

## 1. Concepts

| Surface | Use |
|---------|-----|
| **Pipeline variables** | Inline YAML `variables:` or UI variables on the pipeline |
| **Runtime parameters** | `parameters:` chosen at queue time ([07](./07_Triggers_Stages_Jobs_And_Strategies.md)) |
| **Variable groups** | Shared sets in **Library**; link to pipelines; can link to Azure Key Vault |
| **Secret variables** | Masked in logs; not expandable in the same way as plain vars — pass carefully into tasks |
| **Secure files** | Certificates, Apple profiles, kubeconfigs stored in Library |
| **Predefined variables** | `Build.SourceBranch`, `Build.BuildId`, `System.AccessToken`, … |

```yaml
variables:
  - name: imageName
    value: myapp
  - group: shared-build-settings
```

Never commit secrets to YAML. Prefer **federated service connections** over storing cloud passwords in variables ([19](./19_Security_Permissions_And_Service_Connections.md)).

## 2. Advanced concepts

### Runtime vs compile-time

Template expressions (`${{ }}`) evaluate at compile time; macro (`$(var)`) and runtime (`$[ ]`) differ — wrong choice causes “empty” values or leaking intent. Prefer documenting which variables are **queue-time** (set when running manually).

### Key Vault-backed groups

Variable groups can synchronize secrets from Azure Key Vault. Still scope who can use the group; Key Vault access policies / RBAC must allow the connection identity.

### `System.AccessToken`

OAuth token for the job identity against Azure DevOps APIs (push packages, script against REST). Limit job permissions; do not echo the token.

### Classic vs YAML

Classic releases had their own variable scopes per stage. YAML maps that to stage/job-level `variables` plus environments.

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Same npm feed auth across pipelines | Variable group + Artifacts auth tasks |
| Per-env connection strings | Key Vault → group; or inject at App Service (prefer app config over pipeline) |
| Signing cert | Secure file + install task |

**Good:** secrets in Key Vault / secret vars; plain config in Git. **Bad:** subscription owner keys in plain pipeline variables.

## References

- [Define variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/variables)  
- [Variable groups](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups)  
- [Secure files](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/secure-files)  
- [Predefined variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables)  
