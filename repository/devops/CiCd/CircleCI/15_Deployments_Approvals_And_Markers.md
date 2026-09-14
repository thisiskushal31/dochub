# 15 — Deployments, approvals, markers, and Smart Deployments

[← Previous](./14_Dynamic_Config_And_Continuation.md) · [README](./README.md) · [Next: Security →](./16_Security_Permissions_SSO_And_Policies.md)

---

## 1. Concepts

Deploy by adding a **job** that runs your promote scripts/orbs. Gate production with a workflow **approval** (hold) job so a human continues the graph (Continuous Delivery).

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

### Deploy markers

**Deploy markers** (`circleci run release …` style steps in current docs) record when deploys start/finish so the Deploys UI can list versions and support rollback navigation. Markers work across VCS types; some rollback/deploy-pipeline automations require the **CircleCI GitHub App** — confirm the capability table in setup docs.

### Smart Deployments (release validation)

**Smart Deployments** is CircleCI’s continuous **release validation** feature: after deploy, an evaluation window listens for monitoring signals (Datadog, Prometheus/Alertmanager, or custom webhooks). If failure criteria match, the release can be marked failed and — when a **rollback pipeline** is configured — rolled back automatically.

- Configured with a `validation` block on a **release** job (`type: release` tied to a release plan).  
- Needs **no** Kubernetes cluster and **no** CircleCI release agent.  
- Guided setup exists in the web app; manual YAML path is documented.

Do **not** invent field lists — use the release-validation reference when implementing (`evaluation_time`, `auto_rollback_on_failure`, webhook checks, …).

### Release agent (different path)

The **CircleCI release agent** is for teams that want **Kubernetes-native** controls (scale/restart from the UI) or progressive delivery with [Argo_Rollouts/](../Argo_Rollouts/README.md). Docs warn **not** to use Smart Deployments and the release agent together on the same release path — pick one model.

---

## 2. Advanced concepts

### Target spectrum (official how-tos)

AWS, GCP, Azure, Heroku, Firebase, ECS/ECR, SSH, npm/PyPI, mobile stores, Capistrano, Cloud Foundry, Artifactory, … — pick the guide for your target; prefer orbs when they exist. Promote **digests**, not `latest` ([CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)).

### Environment hierarchy

Docs describe version promotion across environments — align with [CiCd/8](../8_Environments_Promotion_And_Approvals.md).

### IP ranges

Restrict egress for deploy jobs when policy requires ([16](./16_Security_Permissions_SSO_And_Policies.md)).

### GitHub App gates

Release validation itself can work without GitHub App; **automatic rollback pipelines** and some deploy-pipeline features need GitHub App per current docs — check before promising auto-rollback on GitLab/Bitbucket-only orgs.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging auto | Deploy job on `main` without approval |
| Prod gated (human) | `type: approval` then deploy |
| Track releases | Deploy markers |
| Monitor-gated release | Smart Deployments + rollback pipeline |
| K8s progressive UI | Release agent (+ Argo Rollouts if needed) |

**Good:** same artifact digest staging→prod; one release-gating model. **Bad:** rebuild for production; mixing Smart Deployments and release agent on one path.

---

## References

- [Deployment overview](https://circleci.com/docs/guides/deploy/deployment-overview/)  
- [Smart Deployments overview](https://circleci.com/docs/guides/deploy/smart-deployments-overview/)  
- [Set up release validation manually](https://circleci.com/docs/guides/deploy/set-up-release-validation-manually/)  
- [Release validation reference](https://circleci.com/docs/guides/deploy/release-validation-reference/)  
- [Configure deploy markers](https://circleci.com/docs/guides/deploy/configure-deploy-markers/)  
- [Release agent overview](https://circleci.com/docs/guides/deploy/release-agent-overview/)  
- [Workflows (approval jobs)](https://circleci.com/docs/guides/orchestrate/workflows/)  
