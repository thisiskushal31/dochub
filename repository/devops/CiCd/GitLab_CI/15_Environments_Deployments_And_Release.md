# 15 — Environments, deployments, and release

[← Previous](./14_Variables_Secrets_And_OIDC.md) · [README](./README.md) · [Next: Packages →](./16_Packages_Container_Registry_And_Dependency_Proxy.md)

---

## 1. Concepts

An **environment** is a deployment target (staging, production, …) with history, variables, and optional protection.

```yaml
deploy_prod:
  stage: deploy
  script: ["./deploy.sh"]
  environment:
    name: production
    url: https://app.example.com
  when: manual
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

**Promote by digest:** build once, deploy the same image digest through environments — don’t rebuild “for prod” ([22](./22_Worked_Example_CI_Build_And_Promote.md), [CiCd/8](../8_Environments_Promotion_And_Approvals.md)).

**Review apps** spin ephemeral environments per MR — powerful and costly; own cleanup.

---

## 2. Advanced concepts

### Protection & serialization

| Feature | Role |
|---------|------|
| Protected environments | Role/user gates for deploy |
| `resource_group` | One deploy at a time to a target |
| Deployment approvals | Tier-aware approval flows where licensed |
| GitLab Releases | Tag + release evidence / assets |

### GitOps handoff

Many teams stop at “write digest into Git/OCI and let Flux/Argo reconcile” ([Flux/](../Flux/README.md), [Argo_CD/](../Argo_CD/README.md)). GitLab Agent can bridge cluster access ([18](./18_Agent_Auto_DevOps_And_Infrastructure.md)).

### Feature flags

Feature flag tooling exists in GitLab — literacy door; deep flag product comparison stays with [Unleash/](../Unleash/README.md) etc. when that’s the system of record.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging auto | Weak protection; auto deploy on default branch |
| Production | Manual/approvals + protected env + digest |
| MR demos | Review apps with TTL/cleanup |

**Good:** same bits in staging and prod. **Bad:** `latest` tag race as a release process.

---

## References

- [Environments](https://docs.gitlab.com/ci/environments/)  
- [Protected environments](https://docs.gitlab.com/ci/environments/protected_environments/)  
- [Review apps](https://docs.gitlab.com/ci/review_apps/)  
- [Releases](https://docs.gitlab.com/user/project/releases/)  
