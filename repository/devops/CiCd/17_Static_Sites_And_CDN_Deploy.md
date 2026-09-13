# Static sites and CDN deployment

[← Back to CI/CD](./README.md)

Many “apps” you will ship are **static**: HTML/CSS/JS (or a SSG output). The deployment pipeline still follows [1](./1_Pipelines_Build_Test_Deploy.md) — build an artifact, promote immutable bytes, verify — but the **runtime** is object storage + CDN (or a static host), not a long-lived app process.

Spectrum context: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md). Servers/CDN doors: [Servers/](../Servers/README.md), [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).

---

## Durable job (timeless)

```text
Source → build static tree → store versioned artifact
  → publish to origin (bucket / static host)
  → CDN serves edge copies
  → verify (HTTP checks) → optional cache invalidation
```

Vendors change (S3, GCS, Azure Blob, GitHub Pages, Netlify, Cloudflare Pages, …). The **jobs** do not: produce a directory of files, put them on an origin, control cache, prove the URL works.

---

## Pipeline stages

| Stage | What happens |
|-------|----------------|
| **Build** | `npm run build`, Hugo, Jekyll, MkDocs, plain copy — output e.g. `dist/` |
| **Test** | Link check, Lighthouse/a11y smoke, unit tests for JS if any |
| **Publish artifact** | Zip/tarball of `dist/` **or** sync to a versioned prefix; record commit SHA |
| **Deploy** | Upload to bucket/host for that environment |
| **CDN** | Edge caches responses; new deploys must account for cache |
| **Verify** | `curl` homepage + critical paths ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)) |

**Build once:** the same `dist/` (or tarball digest) goes to staging and prod origins — do not rebuild “for production” with different flags unless that is an explicit, tested matrix ([4](./4_Artifacts_And_Registries.md)).

---

## Cache strategy (the hard part)

| Approach | When |
|----------|------|
| **Content-hashed asset names** (`app.a1b2c3.js`) | Preferred — new deploy = new URLs; old cached assets stay valid |
| **Short TTL / `Cache-Control` on HTML** | HTML points at new hashed assets without purge storms |
| **Cache invalidation / purge** | Mistake recovery or unversioned paths — rate-limited on many CDNs; do not make “purge `/*` every deploy” the happy path |

Cloud CDN-style systems document that invalidation is eventually consistent and rate-limited; prefer versioning over blanket purge ([Google Cloud CDN invalidation overview](https://cloud.google.com/cdn/docs/cache-invalidation-overview) as one vendor’s rules — others rhyme).

---

## Origins and front doors (examples, not fashion)

| Pattern | Meaning |
|---------|---------|
| **Object storage as origin** | Bucket website or backend-bucket behind HTTPS load balancer + CDN |
| **Static host product** | Host builds from Git; still keep CI tests before promote |
| **Hybrid** | Static assets on CDN; API on VMs/containers ([18](./18_VM_MIG_And_Host_Based_Deploy.md), K8s chapters) |

TLS, DNS, and WAF sit in Networks / Security / Servers — CI’s job is to publish the right files and fail if smoke fails.

---

## Illustrative deploy shape

```bash
# After CI built ./dist and tests passed
ARTIFACT="site-${GIT_SHA}.tgz"
tar -czf "$ARTIFACT" -C dist .
# Store artifact (registry, generic package, or object version)
# Deploy same tree to staging bucket, smoke, then prod bucket
aws s3 sync ./dist "s3://${BUCKET}/" --delete   # or gsutil -m rsync, az storage blob upload-batch, …
# Prefer hashed assets; invalidate only if you must:
# gcloud compute url-maps invalidate-cdn-cache … --path=/index.html
```

Use OIDC to the cloud — not immortal access keys ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

---

## Preview environments

PR → ephemeral bucket/subdomain or host “deploy preview” is Continuous Delivery for frontends: review the **same build pipeline** before merging. Tear down on PR close.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Purge entire CDN every commit | Hash assets; short HTML cache |
| Different build for prod | Same artifact / same `dist` digest |
| No smoke after upload | Curl critical paths in the pipeline |
| Secrets in client JS | Public site ≠ private config ([13](./13_Config_Secrets_And_Env_Parity.md)) |

## Next

- Host/VM targets: [18](./18_VM_MIG_And_Host_Based_Deploy.md)  
- Full spectrum: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md)

## Further reading

- [Cloud CDN — cache invalidation](https://cloud.google.com/cdn/docs/cache-invalidation-overview) (pattern reference)  
- [Backend buckets](https://cloud.google.com/load-balancing/docs/backend-bucket) (static origin pattern)  
- Your static host / object-store “static website” docs  
