# Artifacts and container/package registries

[← Back to CI/CD](./README.md)

An **artifact** is the deployable output of a build: container image, binary, package, Helm chart, etc. Continuous Delivery assumes you can deploy **the thing you tested** — not a cousin rebuilt later.

Industry practice (MinimumCD immutable-artifact guidance; OCI/container CD norms): **build once**, name every build with a **real changing tag**, and **promote by SemVer tag** into staging/prod — never `:latest`. See [12](./12_Release_Versioning_And_Changelogs.md) and [semver.org](https://semver.org/).

## Immutable artifacts

| Rule | Meaning |
|------|---------|
| Build once | One pipeline build produces the candidate |
| Store centrally | Registry / artifact repository is the source for deploys |
| Tag every lane | DEV uses **snapshot tags**; staging/prod use **SemVer** (RC → release) — never `:latest` |
| Promote, don’t rebuild | Staging and prod run the **same bytes** as the soaked candidate |
| Promote by SemVer tag | Move those bytes `:1.4.0-rc.1` → `:1.4.0` (human release identity) |
| Identify by content (digest) | Digests (`@sha256:…`) are content addresses — keep them for pin/verify/audit alongside tags |
| Traceability | Link tag → digest → commit → pipeline run → (ideally) provenance ([6](./6_Supply_Chain_And_Signing.md)) |

Anti-pattern: “works in staging” after a **second** production build with different dependency resolution or base layers.

## Tag lanes (DEV snapshot vs SemVer)

Informal talk sometimes calls DEV builds “untagged” because they are **not** SemVer release tags. They are still **real tags** — a different format — so every environment can name and debug what it runs.

| Lane | Typical trigger | Tag shape (example) | Role |
|------|-----------------|---------------------|------|
| **DEV / integration** | Push/merge to `main` | `YYYY.MM.DD.run-00042.sha-3cf6d5d` (sortable snapshot; CI run padded so Image Updater can order builds) | Continuous integration lane — **not** a release |
| **Staging / beta** | Git tag `vX.Y.Z-rc.N` | `X.Y.Z-rc.N` (SemVer pre-release) | Soak the release candidate |
| **Production** | Git tag `vX.Y.Z` | `X.Y.Z` (SemVer release) | What you ship |

Alternate DEV snapshot shapes used in the wild (same idea): `YYYY.MM.DD.dev-sha-<shortsha>`. Pick one scheme and stick to it in CI + Image Updater allow-lists.

```text
main push ──► build once ──► :2026.03.25.run-00042.sha-3cf6d5d  ──► DEV (shared or ephemeral)
git tag v1.4.0-rc.1 ──► same pipeline ──► :1.4.0-rc.1  ──► staging
git tag v1.4.0      ──► same pipeline ──► :1.4.0       ──► prod
```

**Promote** means: soak an RC SemVer, then apply the release SemVer to the **same** bytes ([12](./12_Release_Versioning_And_Changelogs.md)). DEV snapshots stay on the snapshot format — do not “promote” by renaming a DEV snapshot to `:latest`.

## Diagram: build → registry → environments

```text
                  ┌─────────────────┐
  git commit ───► │ CI: build+test  │
                  └────────┬────────┘
                           │ push once (named tag — never :latest)
                           ▼
                  ┌─────────────────┐
                  │ Artifact        │  DEV: snapshot tag
                  │ registry        │  staging: SemVer RC
                  └────────┬────────┘  prod: SemVer release (+ digest)
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
     DEV (snapshot)   staging (RC)      prod (release)
```

Digests (`@sha256:…`) are the registry’s **content address** for those same bytes — useful for verify, GitOps pins, and “prove this tag still points here.” Desired state usually holds the **changing tag** (snapshot or SemVer); record the digest in release metadata. Do **not** treat floating channel tags like `:latest` as any environment’s identity.

## Registry types (literacy)

| Kind | Examples (names change; role doesn’t) | Used for |
|------|----------------------------------------|----------|
| **Container / OCI** | GHCR, Amazon ECR, Google Artifact Registry, Harbor, Docker Hub, JFrog Artifactory (OCI), Sonatype Nexus | Images, often OCI Helm/charts |
| **Language packages** | npm, PyPI, Maven Central / private Maven, Go module proxy, NuGet | Libraries — still version+lock for reproducible builds |
| **Generic / binary** | Object storage + checksums, Artifactory/Nexus generic repos | Zips, native binaries |

Language package deep-dives: [Languages/](../Languages/README.md). Container runtime depth: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

## Promotion pattern (build once → named tag → SemVer promote)

1. CI builds **once** and pushes a **lane tag**: DEV **snapshot** on `main` (e.g. `registry/app:2026.03.25.run-00042.sha-3cf6d5d`); RC/release **SemVer** on matching git tags. Optionally record the **digest**.  
2. Deploy / soak that named tag (DEV snapshot or SemVer RC).  
3. Run verify ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)).  
4. Promote to prod: apply the **release SemVer tag** (`:1.4.0`) to the **same** artifact (retag / promote job / Image Updater) — or point GitOps at that release tag. Same bytes; new SemVer name.  
5. Optionally require signature/provenance verify before cluster pull ([6](./6_Supply_Chain_And_Signing.md)).

Vulnerability scan **before** promote (Trivy and friends): [Security/Trivy](../Security/Trivy/README.md).

### Release-candidate SemVer → release SemVer

Tags are labels humans use for lanes; **digests** remain the content address when you need exact-byte proof. A common SemVer lane map ([12](./12_Release_Versioning_And_Changelogs.md)):

```text
main → :2026.03.14.run-….sha-…   (dev snapshot — not a release)
v1.4.0-rc.1 → :1.4.0-rc.1        (staging soak)
                 │
                 └── same artifact / digest ──► :1.4.0   (prod release SemVer)
```

- **Do:** soak an RC SemVer tag → promote by adding the release SemVer tag on those same bytes (resolve tag → digest if you need proof).  
- **Do not:** rebuild from `main` and call it “the same release.”  
- **Do not:** use `:latest` in **any** environment — not prod, not staging, not shared DEV (see below).  

Often: shared **build** pipeline on git tags + GitOps image automation / promote job — see [24](./24_Workflow_Automation_Beyond_PR_CI.md), [Flux image update](./Flux/13_Image_Update_Automation.md), Argo CD Image Updater. Wire it on your host (GitHub Actions, GitLab CI, Bitbucket Pipelines, Azure Pipelines, Jenkins, CircleCI, Buildkite, Tekton, …).

### Never use `:latest` (any environment — including DEV)

`:latest` is a **moving pointer**. Ban it as a **deploy identity** everywhere — **including DEV**. Every environment points at a **named, changing tag** (DEV snapshot or SemVer). When you ship a new build, push a **new** tag and update desired state to that tag (CI, Argo CD Image Updater, Flux Image Automation, or a small bot).

If CI also pushes a `:latest` **alias** for convenience, Image Updater / GitOps must **ignore** it and track only the snapshot/SemVer allow-list. Desired state (Helm values, Kustomize, Compose) must never say `tag: latest`.

| What goes wrong | Why |
|-----------------|-----|
| Debugging is painful | “What’s running?” — `:latest` does not name a build; tickets and rollbacks cannot pin the break |
| DEV lies to you | Two pods both on `:latest` can be different bytes |
| Staging ≠ prod races | Someone else pushed `:latest` between soak and deploy |
| Rollback is guesswork | Yesterday’s `:latest` already moved |
| Helm / chart stalls | Values stay `image.tag: latest` — the **string never changes**, so Helm (and common `IfNotPresent` pulls) may **not refresh** the image when you need it |
| GitOps “Synced” is empty | Desired state says `:latest`; registry moved; reproduce fails |

**Rule:** never use `:latest` as an image identity in Compose, manifests, Helm values, or GitOps — not “just for DEV.” Use **DEV snapshot tags** on the integration lane and **SemVer** from RC upward.

**How tags keep moving (out-of-box / in-box)**

| Approach | Idea |
|----------|------|
| **CI writes the tag** | Build pushes the snapshot or SemVer; optional job opens a GitOps PR |
| **Argo CD Image Updater** | Watches the registry; allow-list snapshot regexp on DEV, SemVer on staging/prod; writes the new tag into Helm values in Git |
| **Flux Image Automation** | Same idea: policy picks tag → commit → reconcile ([Flux/13](./Flux/13_Image_Update_Automation.md)) |
| **Homegrown** | Renovate-style bumps, registry webhook → MR |

Under every path: **new build → new tag → Git points at that tag**.

**Helm note:** bump `image.tag` (snapshot or SemVer) on every release. `:latest` + unchanged values is how “Helm upgrade did nothing” shows up.

**DEV environments (shared + optional ephemerals):** point every DEV stack at the **same snapshot tag format**. One shared DEV is the default; a small **TTL ephemeral** pool is optional when contention is real — see [8](./8_Environments_Promotion_And_Approvals.md).

## Auth in CI (prefer OIDC)

Prefer **OIDC federated login** from the CI provider to the cloud/registry (short-lived tokens) over long-lived robot passwords in secrets. Exact wiring is vendor-specific; the durable rule is: **no immortal registry keys in pipeline YAML**.

## Retention and garbage collection

- Keep digests needed for **rollback** and audit.  
- GC untagged/ephemeral builds on a policy.  
- Do not delete the digest still referenced by prod GitOps or the last known-good release record.

## Copy-paste shape (illustrative)

SemVer-oriented push + promote (tool names are examples):

```bash
# DEV (main): snapshot tag — still a real tag, not SemVer release
#   registry/app:2026.03.25.run-00042.sha-3cf6d5d
#
# Staging: SemVer RC
#   registry/app:1.4.0-rc.1
#
# Optional: record digest for audit / GitOps pin
DIGEST=$(crane digest "$REGISTRY/$IMAGE:1.4.0-rc.1")
echo "RC SemVer: $REGISTRY/$IMAGE:1.4.0-rc.1  ($DIGEST)"
#
# After soak: promote SAME bytes to release SemVer (retag — do not rebuild)
#   crane copy "$REGISTRY/$IMAGE:1.4.0-rc.1" "$REGISTRY/$IMAGE:1.4.0"
#
# Never deploy with :latest (any env). If CI pushes a latest alias, ignore it in GitOps.
```

OIDC login examples differ by cloud (AWS, GCP, Azure, GHCR). Follow current provider docs when you implement a specific stack.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| `:latest` in any env (incl. DEV) | **DEV snapshot** or **SemVer** tag; update desired state when the tag changes |
| Calling DEV “untagged” and skipping a tag | Use a **snapshot tag** format — unique per build, sortable for Image Updater |
| Helm `image.tag: latest` | Explicit snapshot/SemVer in values; bump the tag so Helm actually rolls the image |
| Rebuild for prod “to be safe” | Promote the tested SemVer (same artifact) |
| One shared DEV that blocks everyone | Keep one sticky DEV + small pool of **TTL ephemeral DEVs** on the same snapshot tags ([8](./8_Environments_Promotion_And_Approvals.md)) |
| No retention for old releases | Keep N known-good SemVer tags (and digests) for rollback |

## Next

- Sign and attest what you publish: [6](./6_Supply_Chain_And_Signing.md)  
- Full loop: [1](./1_Pipelines_Build_Test_Deploy.md)

## Further reading

- [MinimumCD — Immutable artifacts](https://beyond.minimumcd.org/docs/migrate-to-cd/pipeline/immutable-artifacts/)  
- OCI / registry docs for your chosen registry (digest and promotion APIs)  
