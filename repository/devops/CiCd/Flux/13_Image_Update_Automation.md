# 13 — Image update automation: registry → Git → cluster

[← Previous](./12_Security_Identity_And_Air_Gap.md) · [README](./README.md) · [Next: Notifications →](./14_Notifications_Alerts_And_Receivers.md)

## 1. Concepts

Typing new image digests into YAML by hand does not scale. Flux can:

1. **Scan** a container registry for tags  
2. **Pick** the right tag with a policy (semver, filter, …)  
3. **Commit** the change to Git  
4. Let normal Flux reconcile **deploy** it  

This needs optional controllers: **image-reflector** + **image-automation**. Enable at bootstrap with `--components-extra=image-reflector-controller,image-automation-controller` (and a deploy key that can **push**).

| Object | Job |
|--------|-----|
| **ImageRepository** | “Watch this registry repo” |
| **ImagePolicy** | “Which tag wins?” |
| **ImageUpdateAutomation** | “Rewrite these files and push” |

```text
CI pushes myapp:v1.0.1
  → policy selects v1.0.1
  → automation commits deploy.yaml
  → GitRepository updates
  → Kustomization/HelmRelease rolls out
```

Official guide: **production** often tracks patch/CVE tags with full Git history; **staging** may track latest branch builds with sortable tags.

## 2. Advanced concepts

### Markers in YAML

Automations find images via documented markers/comments — copy from the current image-update guide; don’t invent syntax.

### Main vs PR

Staging may commit straight to the sync branch. Production often pushes a **branch for human PR review** ([10](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md)).

### Sortable tags

Policies need tags they can order — see the sortable tags guide. Staging often uses `branch-sha-timestamp` style tags.

### CI still tests

Only automate tags that already passed CI. Image automation is not a test suite.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Always-fresh staging | Policy commits to staging path |
| Gated production | Automation opens a PR |
| Fully manual digests | Don’t install image components |

**Good:** every deploy is a Git commit of a **new named tag** (SemVer / filter-matched build tag). **Bad:** automate `:latest` into any environment — including staging/DEV.

## References

- [Automate image updates](https://fluxcd.io/flux/guides/image-update/)  
- [Image controllers](https://fluxcd.io/flux/components/image/)  
- [Sortable image tags](https://fluxcd.io/flux/guides/sortable-image-tags/)  
