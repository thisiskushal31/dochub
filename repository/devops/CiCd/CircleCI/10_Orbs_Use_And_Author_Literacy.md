# 10 — Orbs: use and author literacy

[← Previous](./09_Caches_Workspaces_And_Artifacts.md) · [README](./README.md) · [Next: Reusable config →](./11_Reusable_Config_Commands_Executors_Parameters.md)

## 1. Concepts

**Orbs** are shareable packages of reusable config: **jobs**, **commands**, and **executors**.

Orb types (Cloud/Server as documented):

| Type | Meaning |
|------|---------|
| **Registry orbs** | Published to Orb Registry (e.g. `circleci/node@x.y`) |
| **Inline orbs** | Defined inside your `config.yml` |
| **URL orbs** | Fetched from a URL (allowlists apply) |

```yaml
version: 2.1

orbs:
  node: circleci/node@5.2.0

workflows:
  main:
    jobs:
      - node/test
```

**Pin versions.** Review orb source before production use ([CiCd/6](../6_Supply_Chain_And_Signing.md)).

## 2. Advanced concepts

### Authoring

Registry orbs use pack/publish flows and the Orb Development Kit. Inline orbs teach concepts without publishing. URL orbs need org allowlisting.

### Server

Private orb registries / import rules differ on CircleCI Server — confirm Server docs for your version ([18](./18_Server_CLI_API_And_Toolkit.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Standard Node test | Certified `node` orb, pinned |
| Org standard deploy | Private/registry orb owned by platform |
| Learn reuse | Inline orb first |

**Good:** pin majors; read changelogs. **Bad:** floating tags on prod deploy orbs.

## References

- [Orbs introduction](https://circleci.com/docs/orbs/use/orb-intro/)  
- [Orb concepts](https://circleci.com/docs/orbs/use/orb-concepts/)  
- [Orb registry](https://circleci.com/developer/orbs)  
- [Authoring orbs](https://circleci.com/docs/orbs/author/orb-author/)  
