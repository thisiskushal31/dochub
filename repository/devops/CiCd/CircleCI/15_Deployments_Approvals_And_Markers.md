# 15 — Deployments, approvals, and markers

[← Previous](./14_Dynamic_Config_And_Continuation.md) · [README](./README.md) · [Next: Security →](./16_Security_Permissions_SSO_And_Policies.md)

---

## 1. Concepts

Deploy by adding a **job** that runs your promote scripts/orbs. Gate production with a workflow **approval** (hold) job so a human continues the graph (Continuous Delivery).

**Deploy markers** record deployments in the CircleCI UI for visibility and rollback navigation. **Smart Deployments** / release validation can check monitoring signals and roll back when configured — confirm current product name/requirements in deploy docs.

Kubernetes progressive delivery may use CircleCI’s **release agent** plus related tools like [Argo_Rollouts/](../Argo_Rollouts/README.md) — don’t duplicate those textbooks here.

```yaml
workflows:
  deploy:
    jobs:
      - test
      - hold-prod:
          type: approval
          requires:
            - test
          filters:
            branches:
              only: main
      - deploy-prod:
          requires:
            - hold-prod
          context: prod-deploy
```

---

## 2. Advanced concepts

### Target spectrum (official how-tos)

AWS, GCP, Azure, Heroku, Firebase, ECS/ECR, SSH, npm/PyPI, mobile stores, Capistrano, Cloud Foundry, Artifactory, … — pick the guide for your target; prefer orbs when they exist. Promote **digests**, not `latest` ([CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)).

### Environment hierarchy

Docs describe version promotion across environments — align with [CiCd/8](../8_Environments_Promotion_And_Approvals.md).

### IP ranges

Restrict egress for deploy jobs when policy requires ([16](./16_Security_Permissions_SSO_And_Policies.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging auto | Deploy job on `main` without approval |
| Prod gated | `type: approval` then deploy |
| Track releases | Deploy markers |

**Good:** same artifact digest staging→prod. **Bad:** rebuild for production.

---

## References

- [Deployment overview](https://circleci.com/docs/guides/deploy/deployment-overview/)  
- [Configure deploy markers](https://circleci.com/docs/guides/deploy/configure-deploy-markers/)  
- [Workflows (approval jobs)](https://circleci.com/docs/guides/orchestrate/workflows/)  
