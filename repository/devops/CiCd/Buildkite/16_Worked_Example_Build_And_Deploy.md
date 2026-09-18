# 16 — Worked example: build and deploy

[← Previous](./15_Platform_Teams_SSO_And_Governance.md) · [README](./README.md) · [Next: Best practices →](./17_Best_Practices_And_When_Not_Buildkite.md)

## 1. Concepts

Narrative for a small service:

**Goal:** push/PR tests → `main` builds artifact → staging deploy → **block** → production deploy of the **same digest**.

### Prerequisites

- Pipeline connected to the repo; agents online (hosted or self-hosted)  
- `.buildkite/pipeline.yml` uploaded from Git  
- Cloud identity via OIDC or scoped secrets  
- Team that can unblock production  

## 2. Advanced concepts — pipeline shape

```yml
agents:
  queue: "default"

steps:
  - label: ":jest: Test"
    key: "test"
    command: "npm ci && npm test"

  - label: ":package: Build"
    key: "build"
    depends_on: "test"
    command: "npm ci && npm run build && echo 'docker build && push image@digest'"
    artifact_paths:
      - "dist/**/*"

  - wait

  - label: ":rocket: Staging"
    key: "staging"
    depends_on: "build"
    if: build.branch == "main"
    command: "echo 'deploy digest to staging'"

  - block: ":rocket: Promote to production?"
    if: build.branch == "main"

  - label: ":rocket: Production"
    depends_on: "staging"
    if: build.branch == "main"
    concurrency: 1
    concurrency_group: "my-app-prod"
    command: "echo 'deploy same digest to production'"
```

Replace echoes with real build/push/deploy (scripts or plugins). Prefer OIDC for cloud deploy.

### Verify

- Red test fails the build.  
- Staging only on `main`.  
- Production waits for unblock.  
- Logs and artifacts visible on the build page.

## 3. Applications and use cases

Split into test + deploy pipelines with a `trigger` step when teams or permissions differ ([12](./12_Deployments_And_Environments.md)).

## References

- [Deployments](https://buildkite.com/docs/pipelines/deployments)  
- [Getting started](https://buildkite.com/docs/pipelines/getting-started)  
