# 11 — Deployments and environments

[← Previous](./10_Pipes_Anchors_And_Reuse.md) · [README](./README.md) · [Next: Deploy targets →](./12_Deploy_Targets_And_Pipes_Catalog.md)

---

## 1. Concepts

Bitbucket **deployment environments** (commonly `test`, `staging`, `production`, plus custom) track what is live where. Mark a step or stage with `deployment: production` to record history on the **Deployments** dashboard.

```yaml
- step:
    name: Deploy prod
    deployment: production
    trigger: manual
    script:
      - ./deploy.sh
```

Align with [CiCd/8](../8_Environments_Promotion_And_Approvals.md).

---

## 2. Advanced concepts

### Ordering

When using multiple environments in one pipeline, Pipelines expects a sensible promotion order in YAML (test → staging → production patterns).

### Deployment variables and permissions

Environment-scoped variables + **deployment permissions** (Premium) limit who can run or see prod secrets — stronger than repo-wide variables ([07](./07_Variables_Secrets_And_OIDC.md)).

### Dashboard and rollback

Deployments UI shows history, commits, diffs, linked Jira issues. You can roll back a deployment step without re-running the entire pipeline when Bitbucket supports that path for your setup — still prefer immutable digests and forward fixes when safer.

### Manual gates

Manual steps on production encode Continuous Delivery (human promote), not Continuous Deployment.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Auto to staging | `deployment: staging` on main |
| Human prod | Manual step + production permissions |
| Audit | Dashboard + Jira links |

**Good:** same digest promoted. **Bad:** rebuild for prod “to be safe.”

---

## References

- [Set up and monitor deployments](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-monitor-deployments/)  
- [Deployments](https://support.atlassian.com/bitbucket-cloud/docs/deployments/)  
