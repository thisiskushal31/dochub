# 20 — Best practices and when not CircleCI

[← Previous](./19_Worked_Example_Build_And_Deploy.md) · [README](./README.md) · [Next: Coverage map →](./21_Feature_And_Configuration_Coverage_Map.md)

---

## 1. Concepts — management checklist

- `.circleci/config.yml` in Git; pin orbs and images  
- Contexts least-privileged; OIDC for cloud  
- Approval (or separate pipeline) for production  
- Promote by digest; right-size resource_class  
- Runners patched and class-isolated if used  
- SSO/roles for enterprise; config policies when available  
- Cloud vs Server choice explicit  

---

## 2. Advanced concepts — spectrum

| Job | CircleCI angle | Elsewhere if needed |
|-----|----------------|---------------------|
| Host/VM deploy | SSH/orb jobs | [CiCd/18](../18_VM_MIG_And_Host_Based_Deploy.md) |
| K8s progressive | Deploy + release agent / Argo | [Argo_Rollouts/](../Argo_Rollouts/README.md) |
| Agent-first hybrid | Runners or | [Buildkite/](../Buildkite/README.md) |
| Classical Jenkins | Don’t force rewrite | [Jenkins/](../Jenkins/README.md) |

---

## 3. Applications and use cases — when not

| Situation | Prefer |
|-----------|--------|
| Tiny GitHub-only OSS | GitHub Actions may be simpler |
| Must own control plane offline | Server or Jenkins |
| Already standardized elsewhere | Don’t add a second CI without cause |

Staff review: walk [21](./21_Feature_And_Configuration_Coverage_Map.md).

---

## References

- [Optimizations](https://circleci.com/docs/guides/optimize/optimizations/)  
- [Security recommendations](https://circleci.com/docs/guides/security/security-recommendations/)  
- [Orbs best practices](https://circleci.com/docs/orbs/use/orbs-best-practices/)  
