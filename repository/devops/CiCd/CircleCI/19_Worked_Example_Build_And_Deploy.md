# 19 — Worked example: build and deploy

[← Previous](./18_Server_CLI_API_And_Toolkit.md) · [README](./README.md) · [Next: Best practices →](./20_Best_Practices_And_When_Not_CircleCI.md)

---

## 1. Concepts

Narrative for a small service on CircleCI Cloud:

**Goal:** PR/push tests → `main` builds → approval → production deploy of the **same digest**, using a restricted context and preferably OIDC.

### Prerequisites

- Project connected; `.circleci/config.yml` in Git  
- Context `prod-deploy` limited to deployers  
- Cloud identity via OIDC or scoped secrets  
- Branch protection / required checks on the VCS side  

---

## 2. Advanced concepts — pipeline shape

```yaml
version: 2.1

jobs:
  test:
    docker:
      - image: cimg/node:22.11
    steps:
      - checkout
      - run: npm ci && npm test

  build:
    docker:
      - image: cimg/node:22.11
    steps:
      - checkout
      - run: npm ci && npm run build
      - run: echo "docker build && push image@digest"
      - persist_to_workspace:
          root: .
          paths:
            - dist

  deploy-prod:
    docker:
      - image: cimg/base:current
    steps:
      - attach_workspace:
          at: .
      - run: echo "deploy same digest to production"

workflows:
  build-deploy:
    jobs:
      - test
      - build:
          requires:
            - test
          filters:
            branches:
              only: main
      - hold-prod:
          type: approval
          requires:
            - build
          filters:
            branches:
              only: main
      - deploy-prod:
          requires:
            - hold-prod
          context: prod-deploy
          filters:
            branches:
              only: main
```

Replace echoes with real build/push/deploy (orbs/scripts). Prefer OIDC for cloud.

### Verify

- Red tests fail the pipeline.  
- Deploy does not run without approval on `main`.  
- Job logs and artifacts visible in the UI.

---

## 3. Applications and use cases

Add deploy markers and staging job when you need promotion visibility ([15](./15_Deployments_Approvals_And_Markers.md)).

---

## References

- [Workflows](https://circleci.com/docs/guides/orchestrate/workflows/)  
- [Deployment overview](https://circleci.com/docs/guides/deploy/deployment-overview/)  
- [Hello world](https://circleci.com/docs/guides/getting-started/hello-world/)  
