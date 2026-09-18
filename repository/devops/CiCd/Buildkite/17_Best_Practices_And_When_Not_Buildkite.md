# 17 — Best practices and when not Buildkite

[← Previous](./16_Worked_Example_Build_And_Deploy.md) · [README](./README.md) · [Next: Coverage map →](./18_Feature_And_Configuration_Coverage_Map.md)

## 1. Concepts — management checklist

- Pipeline YAML in Git; pin plugins  
- Cluster + queue design matches trust boundaries  
- OIDC / short-lived creds; no prod secrets on untrusted PR agents  
- Ephemeral or frequently rotated agents; patched images  
- Promote by digest; block or separate pipeline for prod  
- Teams + SSO for enterprise access  
- Know hosted vs self-hosted ops cost  

## 2. Advanced concepts — spectrum

| Job | Buildkite angle | Elsewhere if needed |
|-----|-----------------|---------------------|
| Host/VM deploy | Deploy scripts on agents | [CiCd/18](../18_VM_MIG_And_Host_Based_Deploy.md) |
| K8s ship | Agents + kubectl/helm | Containerization / Argo |
| Classical Jenkins estate | Don’t force rewrite | [Jenkins/](../Jenkins/README.md) |
| Forge-native only | Prefer forge CI | GitHub/GitLab/Bitbucket tracks |

## 3. Applications and use cases — when not

| Situation | Prefer |
|-----------|--------|
| Tiny open-source on GitHub alone | GitHub Actions |
| Need fully offline control plane | Self-managed CI |
| Team already standardized elsewhere | Don’t add a second control plane without cause |

Staff review: walk [18](./18_Feature_And_Configuration_Coverage_Map.md); mark use / defer / N/A.

## References

- [Pipelines best practices](https://buildkite.com/docs/pipelines/best-practices)  
- [Architecture](https://buildkite.com/docs/pipelines/architecture)  
