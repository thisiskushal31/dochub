# 12 — Deployments and environments

[← Previous](./11_Dynamic_Pipelines_And_Pipeline_Upload.md) · [README](./README.md) · [Next: Self-hosted stacks →](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md)

## 1. Concepts

Buildkite supports many deploy shapes. Simplest: a deploy **command** after tests, often behind `wait` / `block`, branch `if`, and a **concurrency group**.

```yml
steps:
  - label: "Test"
    command: "scripts/tests"

  - wait

  - label: "Deploy"
    command: "scripts/deploy"
    if: build.branch == "main"
    concurrency: 1
    concurrency_group: "my-app-deploy"
```

### Dedicated deploy pipelines

Separate **test** and **deploy** pipelines (separate YAML files) so failures, permissions, and reruns stay clear:

```text
.buildkite/tests.pipeline.yml
.buildkite/deploy.pipeline.yml
```

Test pipeline can `trigger` the deploy pipeline after green builds. Align with [CiCd/8](../8_Environments_Promotion_And_Approvals.md).

## 2. Advanced concepts

### Manual vs continuous

`block` encodes Continuous Delivery (human promote). Fully automatic main→prod is Continuous Deployment — choose deliberately.

### Target spectrum

Scripts/plugins deploy to cloud, K8s, hosts, static/CDN — Buildkite does not replace those platforms ([CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)). Promote **digests**, not “latest”.

### Deploy target literacy (official guides)

| Target family | Buildkite docs angle |
|---------------|----------------------|
| AWS Lambda | Dedicated deploy guide |
| Kubernetes | Deploy guide + kubectl/helm on agents |
| Argo CD | Trigger/sync from pipeline (GitOps related track: [Argo_CD/](../Argo_CD/README.md)) |
| Heroku | Deploy plugin/guide |
| Generic | Deployment plugins catalog |

Use the guide that matches your target; keep approvals/OIDC in Buildkite ([10](./10_Secrets_Environment_And_OIDC.md)).

### Team / agent controls

Restrict who can unblock; allowlist deploy pipelines in agent hooks; use OIDC for cloud deploy roles ([10](./10_Secrets_Environment_And_OIDC.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging auto | Deploy step on `main` without block |
| Prod gated | block + concurrency_group |
| Clear ownership | Dedicated deploy pipeline + team |

**Good:** same artifact digest staging→prod. **Bad:** rebuild for production.

## References

- [Deployments with Buildkite](https://buildkite.com/docs/pipelines/deployments)  
- [Block step](https://buildkite.com/docs/pipelines/configure/step-types/block-step)  
- [Trigger step](https://buildkite.com/docs/pipelines/configure/step-types/trigger-step)  
- [Deploy to Kubernetes](https://buildkite.com/docs/pipelines/deployments/to-kubernetes)  
- [Deploy with Argo CD](https://buildkite.com/docs/pipelines/deployments/with-argo-cd)  
- [Deployment plugins](https://buildkite.com/docs/pipelines/deployments/deployment-plugins)  
