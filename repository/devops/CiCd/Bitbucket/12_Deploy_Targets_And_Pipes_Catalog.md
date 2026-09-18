# 12 — Deploy targets and pipes catalog

[← Previous](./11_Deployments_And_Environments.md) · [README](./README.md) · [Next: Dynamic pipelines →](./13_Dynamic_Pipelines_And_Advanced_YAML.md)

## 1. Concepts

Pipelines deploys through **scripts** and **pipes** to many targets. Bitbucket is not Azure — but the **spectrum** of destinations is the same durable set:

| Spectrum | Typical Bitbucket approach |
|----------|----------------------------|
| Static / object storage | S3 / GCS / Azure Blob pipes or CLI |
| PaaS | Heroku, cloud app services via pipes/CLI |
| Containers | Build/push image; deploy to ECS/GKE/AKS/K8s |
| VMs / SSH | SSH pipe or self-hosted runner in the network |
| Serverless | Provider CLIs / pipes |
| GitOps handoff | Push image + update manifest repo; CD elsewhere ([Argo_CD/](../Argo_CD/README.md)) |

Atlassian publishes deployment guides per platform — treat them as task recipes; keep promote-by-digest rules from [CiCd/4](../4_Artifacts_And_Registries.md).

## 2. Advanced concepts

### Prefer OIDC over static cloud keys

Configure cloud roles for Pipelines OIDC ([07](./07_Variables_Secrets_And_OIDC.md)).

### Self-hosted for private targets

If the API is not on the public internet, use runners ([06](./06_Runners_Cloud_And_Self_Hosted.md)).

### Progressive delivery

Bitbucket does not replace Argo Rollouts/Flagger — Pipelines builds and may call kubectl/helm; progressive traffic lives in those controllers ([CiCd/9](../9_Progressive_Delivery_Controllers.md)).

## 3. Applications and use cases

| App | Path |
|-----|------|
| Static site | Build → S3/CloudFront pipe |
| Container API | Build → registry → K8s/ECS |
| Legacy VM | Runner + SSH |

**Good:** environment-scoped credentials. **Bad:** FTP as the paved road.

## References

- [Pipelines deployment guides](https://support.atlassian.com/bitbucket-cloud/docs/deploy-to-amazon-web-services/)  
- [Integrations / pipes](https://support.atlassian.com/bitbucket-cloud/docs/integrations/)  
- [CiCd delivery spectrum](../19_Delivery_Spectrum_Legacy_Through_Modern.md)  
