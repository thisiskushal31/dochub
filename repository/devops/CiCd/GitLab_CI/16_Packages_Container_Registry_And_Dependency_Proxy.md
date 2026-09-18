# 16 — Packages, container registry, and dependency proxy

[← Previous](./15_Environments_Deployments_And_Release.md) · [README](./README.md) · [Next: Security →](./17_Security_Scanning_And_Compliance_Literacy.md)

## 1. Concepts

GitLab ships artifact stores next to the project:

| Surface | Use |
|---------|-----|
| **Container registry** | OCI images (`$CI_REGISTRY_IMAGE`) |
| **Package registry** | npm, Maven, PyPI, NuGet, … |
| **Terraform module registry** | Module packages |
| **Dependency Proxy** | Cache/proxy upstream images (rate-limit relief) |
| **Generic packages** | Arbitrary files |

CI jobs authenticate with job tokens / deploy tokens / OIDC-adjacent patterns per docs.

## 2. Advanced concepts

### Immutable promote

Push by digest; retag for environments; record digest in release notes / GitOps repo.

### Cleanup policies

Registry cleanup and retention — cost and compliance; platform should own policies.

### Virtual registries / proxies

Higher-tier or evolving features for dependency management — confirm current docs; don’t invent SKU details.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| App image | Build → registry → env deploy |
| Library publish | Package registry from tag pipeline |
| Hub pull limits | Dependency Proxy for base images |

**Good:** registry as release truth. **Bad:** only CI job artifacts as the long-term distribution channel.

## References

- [Packages and registries](https://docs.gitlab.com/user/packages/)  
- [GitLab container registry](https://docs.gitlab.com/user/packages/container_registry/)  
- [Dependency Proxy](https://docs.gitlab.com/user/packages/dependency_proxy/)  
