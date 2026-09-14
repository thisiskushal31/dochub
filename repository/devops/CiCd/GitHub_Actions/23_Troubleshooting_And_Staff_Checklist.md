# 23 — Troubleshooting and staff checklist

[← Previous](./22_YAML_And_Configuration_Catalog.md) · [README](./README.md) · [Next: Extras →](./24_Migrate_Packages_And_Extras.md)

---

## 1. Concepts — playbook

| Symptom | Likely cause | Look at |
|---------|--------------|---------|
| Workflow never runs | `on:` mismatch / wrong branch / path filters / disabled | Events; default-branch schedule rules |
| Job queued forever | No runners / group access / concurrency / plan caps | Labels; groups; billing limits |
| Secret empty | Wrong scope / fork PR / env not set | Secrets level; environment name |
| OIDC fails | Trust claims / missing `id-token` / wrong issuer | Cloud trust JSON; permissions |
| Action fails oddly | Unpinned major tag moved | Pin SHA; changelog |
| Matrix “flaky” / huge | Race / shared cache / near **256** job cap | Isolation; fail-fast; matrix size |
| Deploy not gated | Missing `environment` / protection rule | Environment settings |
| Fork PR insecure | `pull_request_target` misuse | Secure-use guide |
| Cache miss always | Bad key / OS mismatch / rate limit | hashFiles; runner.os; limits |
| File won’t run | Workflow YAML **> 500 KB** | Split to reusable/composite |
| Concurrency rejects | `queue: max` overflow | Concurrency settings |

Enable debug logging when stuck ([18](./18_Monitor_Metrics_And_Billing_Literacy.md)). Use the run visualization graph and condition-expression logs for `if:` mysteries.

---

## 2. Advanced — ordered questions

1. Did the **event** match (and is the workflow file on that ref)?  
2. Are **permissions** / **secrets** available to this actor?  
3. Is a **runner** listening with those labels / group policy?  
4. Did we pin the **action** / reusable workflow we think we did?  
5. Are we under **limits** (minutes, concurrency, matrix, API)?  

---

## 3. Applications — staff checklist

- Required checks on protected branches / rulesets
- Actions and reusable workflows pinned (SHA on critical paths)
- Explicit least-privilege `permissions`
- OIDC for cloud; no static keys where avoidable; trust claims reviewed (`job_workflow_ref` when paved)
- Environments + reviewers (and custom protection rules if needed) for production
- Promote-by-digest documented; attestations policy decided
- Fork PR / `pull_request_target` policy set
- Runner groups isolate privileged hardware; ARC/self-hosted have owners
- Scheduled workflows have owners and alert routes
- Paved road versioning CODEOWNED by platform
- Limits and billing watched before they page Finance

**Good:** fix in Git. **Bad:** “re-run until green” without root cause.

---

## References

- [Troubleshoot workflows](https://docs.github.com/en/actions/how-tos/monitor-workflows/troubleshoot-workflows)  
- [Secure use](https://docs.github.com/en/actions/reference/security/secure-use)  
- [Actions limits](https://docs.github.com/en/actions/reference/limits)  
