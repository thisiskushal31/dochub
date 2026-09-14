# 19 — Worked example: CI, build, and promote

[← Previous](./18_Monitor_Metrics_And_Billing_Literacy.md) · [README](./README.md) · [Next: Best practices →](./20_Best_Practices_And_When_Not_Actions.md)

---

## 1. Concepts — lab goal

Prove the paved-road loop on a real GitHub repo (personal or org sandbox).

1. Add `.github/workflows/ci.yml` on PRs — checkout, test, **pin actions**, least-privilege `permissions`.  
2. Make the check **required** on `main` (ruleset / branch protection).  
3. Add build on `main` / tags: **OIDC** login → build image → push → job output **digest** (optional: artifact attestation).  
4. Add `workflow_dispatch` promote job with `environment: production` that promotes **that digest** (retag, or open a GitOps PR).  
5. Optional: one `schedule` audit workflow with a named owner.  
6. Optional: move CI/build into `org/workflows` reusable files and pin `@v1`; cloud trust on `job_workflow_ref`.

Do not skip the digest — rebuilding on the release tag without comparing digests teaches the wrong lesson.

Language-specific build tutorials (Node, Go, Java, …) are upstream cookbooks; the lab is about the **delivery shape**.

---

## 2. Advanced — stretch goals

| Stretch | Chapter |
|---------|---------|
| Matrix OS/language | [06](./06_Jobs_Needs_Concurrency_And_Matrix.md) |
| Cache dependencies | [12](./12_Caches_And_Artifacts.md) |
| Environment reviewers + custom protection App | [14](./14_Secrets_Variables_And_Environments.md), [17](./17_Deploy_Environments_And_Promote.md) |
| Fork-PR hardening | [16](./16_Security_Hardening_Permissions_And_Forks.md) |
| Attestations verify before promote | [16](./16_Security_Hardening_Permissions_And_Forks.md) |
| GitOps write (Flux/Argo) | [17](./17_Deploy_Environments_And_Promote.md) |
| Service containers for integration tests | [24](./24_Migrate_Packages_And_Extras.md) |

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| CI | Red/green on PRs; required check |
| Build | Image in registry **by digest** |
| Promote | Prod points at staging’s digest |
| Reuse | Service repo only calls pinned reusable workflows |
| Ops | Failed schedule pages a human |

**Good:** lab notes become the team template. **Bad:** only green CI with `:latest` in prod.

---

## References

- [Quickstart](https://docs.github.com/en/actions/get-started/quickstart)  
- [Reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)  
- [OIDC](https://docs.github.com/en/actions/concepts/security/openid-connect)  
- [Publishing Docker images](https://docs.github.com/en/actions/tutorials/publish-packages/publishing-docker-images)  
