# 16 — Security hardening: permissions, forks, injections

[← Previous](./15_OIDC_And_Cloud_Federation.md) · [README](./README.md) · [Next: Deploy →](./17_Deploy_Environments_And_Promote.md)

---

## 1. Concepts

| Risk | Practice |
|------|----------|
| Over-powered `GITHUB_TOKEN` | Explicit least-privilege `permissions` |
| Malicious PR / fork | No secrets on untrusted code; approval gates |
| Script injection | Don’t interpolate untrusted input into `run:` |
| Compromised action | Pin SHAs; review publishers; allowlists |
| Compromised runner | Ephemeral runners; segment networks; rotate |
| Long-lived cloud keys | OIDC ([15](./15_OIDC_And_Cloud_Federation.md)) |

```yaml
permissions:
  contents: read
  pull-requests: read
```

Widen write scopes only on jobs that need them (separate jobs beat one god-job).

---

## 2. Advanced concepts

### `pull_request_target`

Runs in a **base-privileged** context. Easy foot-gun: checkout PR code and execute it with secrets. Read [securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target) before any use.

### Script injection

Untrusted `github.event.issue.title` (and friends) inside `run: echo ${{ … }}` is command injection. Pass through `env:` and quote; or use trusted parsed outputs only.

### Artifact attestations & SLSA

**Artifact attestations** record how/where software was built (provenance). Docs map attestations toward **SLSA** levels (including patterns that combine reusable workflows + attestations toward higher build levels). Verify online or offline; optional **Kubernetes admissions controller** can enforce attestations at admit time. Field how-tos stay upstream; treat provenance as part of promote policy ([17](./17_Deploy_Environments_And_Promote.md), [CiCd/6](../6_Supply_Chain_And_Signing.md)).

### Fork workflow approvals

Org settings can require approval before first-time contributor workflows run — essential for public repos.

### Secure-use reference themes

Writing workflows safely, mitigating untrusted checkouts, third-party actions, and GitHub security features — staff should skim the [secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) once end-to-end.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Public OSS | Restrict forks; pin actions; no secrets on `pull_request` |
| Internal monorepo | CODEOWNERS on `.github/`; least privilege |
| Release | Narrow perms + OIDC + environment + attestations |

**Good:** workflow changes reviewed like app code. **Bad:** `permissions: write-all` + unpinned actions + `pull_request_target` “because caching was easier.”

---

## References

- [Secure your work](https://docs.github.com/en/actions/how-tos/secure-your-work)  
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)  
- [Script injections](https://docs.github.com/en/actions/concepts/security/script-injections)  
- [Compromised runners](https://docs.github.com/en/actions/concepts/security/compromised-runners)  
- [Artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)  
