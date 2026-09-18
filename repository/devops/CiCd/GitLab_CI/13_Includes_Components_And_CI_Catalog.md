# 13 — Includes, components, and CI Catalog

[← Previous](./12_Caching_Artifacts_And_Job_Tokens.md) · [README](./README.md) · [Next: Variables →](./14_Variables_Secrets_And_OIDC.md)

## 1. Concepts

Stop copy-pasting CI into every project.

| Mechanism | Role |
|-----------|------|
| **`include`** | Pull YAML (local, project, remote, template) |
| **`extends`** | Inherit/merge job keys |
| **CI/CD components** | Versioned, input-parameterized reusable units |
| **CI/CD Catalog** | Discover/publish components |

```yaml
include:
  - component: gitlab.com/my-org/ci-components/go-test@1.2.0
    inputs:
      go_version: "1.22"
```

Pin component versions. Bumping is a platform change.

## 2. Advanced concepts

### Components vs templates

Older **templates** (`include: template:`) still appear; **components** are the modern paved-road unit with inputs and Catalog listing. Migration guides exist.

### Inputs

Typed inputs make components configurable without forking YAML ([inputs docs](https://docs.gitlab.com/ci/inputs/)).

### Org strategy

Central components project + Catalog (where available) + CODEOWNERS on the components repo.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Standard test/lint | Component `go-test` / `node-test` |
| Standard build/push | Component with OIDC + registry |
| Break glass | Temporary local job — then delete |

**Good:** versioned components. **Bad:** `@main` style moving targets for production pipelines.

## References

- [CI/CD components](https://docs.gitlab.com/ci/components/)  
- [Include](https://docs.gitlab.com/ci/yaml/includes/)  
- [CI/CD inputs](https://docs.gitlab.com/ci/inputs/)  
