# 11 — Actions, Marketplace, and pinning

[← Previous](./10_Actions_Runner_Controller_ARC.md) · [README](./README.md) · [Next: Caches →](./12_Caches_And_Artifacts.md)

## 1. Concepts

An **action** is a reusable packaged unit invoked with `uses:`:

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: '22'
```

Sources: official `actions/*`, Marketplace, your org’s actions, or a path in the same repo (composite).

### Pinning

| Pin | Trade-off |
|-----|-----------|
| `@v4` (major tag) | Convenient; tag can move |
| `@v4.2.1` | Better; still a mutable tag unless immutable releases used |
| `@<full SHA>` | Strongest supply-chain posture |

Prefer SHA pins for high-trust paths; automate updates (Dependabot/Renovate) with review.

## 2. Advanced concepts

### Action types

| Type | Shape |
|------|-------|
| JavaScript | Runs on the runner with Node |
| Composite | Bundles steps; great for internal helpers |
| Docker | Containerized action |

Authoring/publishing (Marketplace, immutable releases/tags, exit codes) is platform literacy when you **maintain** actions ([24](./24_Migrate_Packages_And_Extras.md)).

### Trust

Read the action’s source, permissions it requests, and whether it shells out to untrusted input. Third-party actions are dependencies — treat them like libraries ([16](./16_Security_Hardening_Permissions_And_Forks.md)).

### Version channels

Some actions document breaking changes across majors. Pinning `@main` is almost always wrong for production workflows.

## 3. Applications and use cases

| Goal | Practice |
|------|----------|
| Baseline CI | Official checkout/setup/cache |
| Org helper | Internal composite action |
| High assurance | SHA pin + CODEOWNERS on workflows |

**Good:** small allowlist of actions. **Bad:** random Marketplace action with `permissions: write-all` copied from a blog.

**Upstream-only:** Marketplace encyclopedia.

## References

- [Using pre-written building blocks](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/find-and-customize-actions)  
- [About custom actions](https://docs.github.com/en/actions/concepts/workflows-and-actions/custom-actions)  
- [Metadata syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)  
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)  
