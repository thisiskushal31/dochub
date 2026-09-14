# 06 — Runners: Cloud and self-hosted

[← Previous](./05_First_Pipeline_And_Enablement.md) · [README](./README.md) · [Next: Secrets →](./07_Variables_Secrets_And_OIDC.md)

---

## 1. Concepts

By default, steps run on **Atlassian-hosted** infrastructure as Docker containers. **Self-hosted runners** execute steps on your machines/VMs when you need private network access, special hardware, or OS options (Linux Docker/shell, Windows, macOS — as supported).

```yaml
- step:
    runs-on:
      - self.hosted
      - linux
    script:
      - ./build.sh
```

Labels must match a registered runner.

---

## 2. Advanced concepts

### When to leave Cloud-hosted

| Need | Choice |
|------|--------|
| Standard Linux CI | Atlassian-hosted |
| Reach private VPC / on-prem | Self-hosted runner |
| Larger memory / Docker-in-Docker quirks | Size runners; know Cloud limits |
| macOS / Windows builds | Self-hosted where Cloud does not fit |

### Hygiene

Treat runners like CI agents: patch OS, rotate credentials, isolate prod-capable runners, don’t share dirty caches across trust boundaries ([CiCd/6](../6_Supply_Chain_And_Signing.md)).

### Workspace vs repo runners

Register at workspace scale for shared capacity; restrict which repos can use sensitive runners.

---

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| SaaS-only app | Hosted only |
| Hybrid DB migrate | Self-hosted in the VPC |
| iOS | macOS runner (where offered) |

**Good:** labeled pools with clear owners. **Bad:** one privileged runner for all PR forks without isolation.

---

## References

- [Runners](https://support.atlassian.com/bitbucket-cloud/docs/runners/)  
- [Configure runners](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-use-runners-for-linux/)  
