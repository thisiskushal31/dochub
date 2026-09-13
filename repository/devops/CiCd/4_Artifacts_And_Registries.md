# Artifacts and container/package registries

[← Back to CI/CD](./README.md)

An **artifact** is the deployable output of a build: container image, binary, package, Helm chart, etc. Continuous Delivery assumes you can deploy **the thing you tested** — not a cousin rebuilt later.

Industry practice (MinimumCD immutable-artifact guidance; OCI/container CD norms): **build once, promote the same immutable identifier** through environments.

---

## Immutable artifacts

| Rule | Meaning |
|------|---------|
| Build once | One pipeline build produces the candidate |
| Store centrally | Registry / artifact repository is the source for deploys |
| Identify by content | Prefer **digest** (`@sha256:…`) over mutable tags alone |
| Promote, don’t rebuild | Staging and prod run the same bytes |
| Traceability | Link digest → commit → pipeline run → (ideally) provenance ([6](./6_Supply_Chain_And_Signing.md)) |

Anti-pattern: “works in staging” after a **second** production build with different dependency resolution or base layers.

---

## Diagram: build → registry → environments

```text
                  ┌─────────────────┐
  git commit ───► │ CI: build+test  │
                  └────────┬────────┘
                           │ push once
                           ▼
                  ┌─────────────────┐
                  │ Artifact        │  image@sha256:abc…
                  │ registry        │  (+ SBOM/signature refs)
                  └────────┬────────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
        preview         staging          prod
     (same digest)   (same digest)   (same digest)
```

Tags (`:v1.2.3`, `:staging`) are **pointers**. Digests are **content addresses**. Pin deploys to digests; use tags for humans and promotion metadata.

---

## Registry types (literacy)

| Kind | Examples (names change; role doesn’t) | Used for |
|------|----------------------------------------|----------|
| **Container / OCI** | GHCR, Amazon ECR, Google Artifact Registry, Harbor, Docker Hub, JFrog Artifactory (OCI), Sonatype Nexus | Images, often OCI Helm/charts |
| **Language packages** | npm, PyPI, Maven Central / private Maven, Go module proxy, NuGet | Libraries — still version+lock for reproducible builds |
| **Generic / binary** | Object storage + checksums, Artifactory/Nexus generic repos | Zips, native binaries |

Language package deep-dives: [Languages/](../Languages/README.md). Container runtime depth: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

---

## Promotion pattern

1. CI builds and pushes `registry/app@sha256:…` (and maybe tag `app:git-sha` or `app:rc-<id>`).  
2. Deploy that digest to test/staging.  
3. Run verify ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)).  
4. Promote: retag or copy **same digest** to the release/prod **pointer** (or update GitOps desired state to that digest).  
5. Optionally require signature/provenance verify before cluster pull ([6](./6_Supply_Chain_And_Signing.md)).

Vulnerability scan **before** promote (Trivy and friends): [Security/Trivy](../Security/Trivy/README.md).

### Release-candidate tag → production tag (SemVer)

Tags are labels humans use; **digests** are what you trust. A common SemVer lane map ([12](./12_Release_Versioning_And_Changelogs.md)):

```text
main → :2026.03.14.run-….sha-…   (dev snapshot)
v1.4.0-rc.1 → :1.4.0-rc.1        (staging soak)
                 │
                 └── same digest ──► :1.4.0   (prod release)
                                   └► :prod  (optional channel)
```

- **Do:** resolve RC (or tested) tag → digest → create release SemVer on that digest (registry metadata), then point GitOps at it.  
- **Do not:** rebuild from `main` and call it “the same release.”  

Often: shared **build** pipeline on git tags + Image Updater / promote job — see [24](./24_Workflow_Automation_Beyond_PR_CI.md). Wire it on your host (GitHub Actions, GitLab CI, Bitbucket Pipelines, Azure Pipelines, Jenkins, CircleCI, Buildkite, Tekton, …).

---

## Auth in CI (prefer OIDC)

Prefer **OIDC federated login** from the CI provider to the cloud/registry (short-lived tokens) over long-lived robot passwords in secrets. Exact wiring is vendor-specific; the durable rule is: **no immortal registry keys in pipeline YAML**.

---

## Retention and garbage collection

- Keep digests needed for **rollback** and audit.  
- GC untagged/ephemeral builds on a policy.  
- Do not delete the digest still referenced by prod GitOps or the last known-good release record.

---

## Copy-paste shape (illustrative)

Digest-oriented push + record (tool names are examples):

```bash
# After build: capture immutable reference
DIGEST=$(crane digest "$REGISTRY/$IMAGE:$TAG")
echo "Deploy this: $REGISTRY/$IMAGE@$DIGEST"

# Prefer deploying by digest in manifests / GitOps:
# image: ghcr.io/org/app@sha256:…
```

OIDC login examples differ by cloud (AWS, GCP, Azure, GHCR). Follow current provider docs when you implement a specific stack.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Deploy `:latest` | Digest pin |
| Rebuild for prod “to be safe” | Promote tested digest |
| Only floating tags in GitOps | Desired state includes digest or immutable tag + verify |
| No retention for old digests | Keep N known-good releases for rollback |

## Next

- Sign and attest what you publish: [6](./6_Supply_Chain_And_Signing.md)  
- Full loop: [1](./1_Pipelines_Build_Test_Deploy.md)

## Further reading

- [MinimumCD — Immutable artifacts](https://beyond.minimumcd.org/docs/migrate-to-cd/pipeline/immutable-artifacts/)  
- OCI / registry docs for your chosen registry (digest and promotion APIs)  
