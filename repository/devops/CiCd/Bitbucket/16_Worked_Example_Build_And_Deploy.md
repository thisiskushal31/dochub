# 16 — Worked example: build and deploy

[← Previous](./15_Security_Access_And_Workspace_Hardening.md) · [README](./README.md) · [Next: Best practices →](./17_Best_Practices_And_Cloud_Vs_Data_Center.md)

---

## 1. Concepts

Narrative for a small web service on Bitbucket Cloud:

**Goal:** PR tests → `main` builds artifact/image → staging auto-deploy → production manual deploy of the **same digest**.

### Prerequisites

- Repo with Pipelines enabled  
- Merge checks: approvals + successful build  
- Environments `staging` and `production` (prod deployers restricted)  
- OIDC or scoped credentials for the target cloud  

---

## 2. Advanced concepts — pipeline shape

```yaml
image: node:20

definitions:
  caches:
    npm: ~/.npm

pipelines:
  pull-requests:
    '**':
      - step:
          name: Test
          caches: [npm]
          script:
            - npm ci
            - npm test

  branches:
    main:
      - step:
          name: Build
          caches: [npm]
          script:
            - npm ci
            - npm run build
            - echo "docker build && push image@digest"
          artifacts:
            - dist/**
      - step:
          name: Deploy staging
          deployment: staging
          script:
            - echo "deploy digest to staging"
      - step:
          name: Deploy production
          deployment: production
          trigger: manual
          script:
            - echo "deploy same digest to production"
```

Replace echoes with real build/push/deploy (pipes or scripts). Pin pipe versions.

### Verify

- Red PR cannot merge.  
- Staging updates on `main`.  
- Production waits for a human with permission.  
- Jira issue key on the PR links the change ([14](./14_Jira_And_Atlassian_Integrations.md)).

---

## 3. Applications and use cases

Reuse this shape for S3, K8s, or SSH targets ([12](./12_Deploy_Targets_And_Pipes_Catalog.md)) — only the deploy script/pipe changes.

---

## References

- [Get started with Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/)  
- [Deployments](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-monitor-deployments/)  
