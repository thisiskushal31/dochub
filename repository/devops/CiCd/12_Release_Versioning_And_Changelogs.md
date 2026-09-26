# Release versioning and changelogs

[← Back to CI/CD](./README.md)

CI builds continuously. **Releases** name what customers and operators can pin, roll back to, and discuss. Wire versioning into the pipeline so tags, artifacts, and notes stay consistent.

## Semantic Versioning (SemVer 2.0.0)

**Learn the canonical rules on the official site:** [https://semver.org/](https://semver.org/) (Semantic Versioning 2.0.0). This chapter applies those rules to delivery; the site is the source of truth for MAJOR/MINOR/PATCH, pre-release, and build metadata.

For artifacts with a public API (libraries, many services):

| Increment | When |
|-----------|------|
| **MAJOR** | Breaking API change |
| **MINOR** | Backward-compatible feature |
| **PATCH** | Backward-compatible bugfix |

Pre-release labels (`1.0.0-alpha.1`, `1.0.0-rc.20`) and build metadata are defined in the [SemVer spec](https://semver.org/). Apps that are not libraries still benefit from **immutable, ordered** versions (CalVer or SemVer-like) tied to digests ([4](./4_Artifacts_And_Registries.md)).

CI/CD wiring is **host-neutral**: the same SemVer tags and image digests work on GitHub, GitLab, Bitbucket, Azure DevOps, Jenkins, CircleCI, Buildkite, Tekton, and kin ([2](./2_CI_CD_Tools.md)).

## Git tags and artifacts

```text
pipeline green on release branch
  → decide version (human or conventional-commit automation)
  → git tag vX.Y.Z
  → publish artifact tagged vX.Y.Z and @sha256:…
  → generate/attach notes
```

Deploy every environment (DEV included) by a **changing SemVer or build tag**; keep the digest in the audit trail for exact bytes. **Never** use `:latest` — it breaks debugging, and Helm often will not refresh the image when the tag string stays `latest` ([4](./4_Artifacts_And_Registries.md)).

### Container lanes: snapshot → RC → release (trunk-friendly)

SemVer for **services** is usually **git tags + image tags**, not three long-lived Git env branches ([Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md)):

| Source | Image tag idea | Where it runs |
|--------|----------------|---------------|
| Trunk (`main`) | **DEV snapshot** (not SemVer release) — e.g. `YYYY.MM.DD.run-00042.sha-<sha7>` (sortable for Image Updater). People sometimes call these “untagged” informally; they are still **real tags**. | Sticky DEV + optional TTL ephemeral DEVs ([8](./8_Environments_Promotion_And_Approvals.md)) |
| Tag `vX.Y.Z-rc.N` | Pre-release SemVer `X.Y.Z-rc.N` | Staging soak — **pinned**, immutable |
| Tag `vX.Y.Z` | Release SemVer `X.Y.Z` | Production |

```text
main pushes → many DEV snapshot images (team keeps integrating)
       │
       ▼ when ready for a candidate
tag v1.4.0-rc.20 ── image :1.4.0-rc.20 ── staging pins THIS
       │
       ▼ approve
retag SAME bytes → :1.4.0 (+ git tag v1.4.0) → prod
```

- **RC and prod share one artifact lineage** — prod is the tested RC, not a cousin rebuild.  
- **Never** deploy `:latest` on any lane (including DEV) — see [4](./4_Artifacts_And_Registries.md).  
- Prefer **retag / Image Updater** of the soaked artifact over rebuilding on the release tag ([4](./4_Artifacts_And_Registries.md), [24](./24_Workflow_Automation_Beyond_PR_CI.md)).  

Annotated tags (`git tag -a vX.Y.Z -m "…"`) feed release notes and ChatOps ([16](./16_Notifications_Webhooks_And_ChatOps.md)).

## Changelogs vs release notes

[Keep a Changelog](https://keepachangelog.com/):

- **Changelog** — ongoing record in-repo (`CHANGELOG.md`): Unreleased + dated versions; types Added / Changed / Deprecated / Removed / Fixed / Security  
- **Release notes** — announcement for one version (often derived from the changelog)

Automation (Conventional Commits + tools like semantic-release, release-please, Changesets, git-cliff) can **draft** version bumps and notes from commits. Treat drafts as starting points — commit messages and user-facing changelog entries serve different audiences.

## Conventional Commits (CI use)

Structured commits (`feat:`, `fix:`, `BREAKING CHANGE:`) let CI:

- Infer next SemVer  
- Group notes  
- Trigger releases on main  

Useful when the team agrees on the convention; not mandatory for Continuous Delivery.

## Pipeline responsibilities

| Step | Owner |
|------|-------|
| Version decision | Policy (auto vs human) |
| Tag immutability | Never move a released tag |
| Notes published with artifact | CI release job |
| Link version → digest → commit | Release metadata / provenance ([6](./6_Supply_Chain_And_Signing.md)) |

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Reusing or moving tags | Immutable tags; new version for new bits |
| Version only in a spreadsheet | Tag + registry + digest linkage |
| Empty “bug fixes” notes forever | Keep a Changelog discipline |
| Shipping without a rollback identifier | Always know previous good version/digest ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)) |
| Promote by deleting the RC tag | Add release tag on the **same digest**; keep RC for history |
| Snapshot “untagged” with no handle | Always use a **DEV snapshot tag** (date/run/sha) — not SemVer, still named ([4](./4_Artifacts_And_Registries.md)) |
| `:latest` on DEV “because it’s fine” | Snapshot tags + Image Updater allow-list; never deploy `:latest` |

## Next

- Promotion: [8](./8_Environments_Promotion_And_Approvals.md)  
- Artifacts: [4](./4_Artifacts_And_Registries.md)

## Further reading

- **[Semantic Versioning — semver.org](https://semver.org/)** (read the full 2.0.0 spec)  
- [Keep a Changelog](https://keepachangelog.com/)  
- [Conventional Commits](https://www.conventionalcommits.org/)  
- [semantic-release](https://github.com/semantic-release/semantic-release) (optional automation; forge-agnostic idea)  
- Trunk vs env branches: [Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md)  
