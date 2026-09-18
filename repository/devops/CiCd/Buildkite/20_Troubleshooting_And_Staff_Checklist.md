# 20 — Troubleshooting and staff checklist

[← Previous](./19_YAML_And_Configuration_Catalog.md) · [README](./README.md) · [Next: Source control →](./21_Source_Control_Providers_And_Code_Access.md)

## 1. Concepts — frequent failures

| Symptom | Likely cause | Where |
|---------|--------------|-------|
| Build stuck waiting for agent | Wrong queue/tags; no agents; paused queue | [04](./04_Agents_Self_Hosted_And_Hosted.md), [05](./05_Queues_Clusters_And_Targeting.md) |
| Pipeline never triggers | Webhooks / Build Triggers | [03](./03_Create_Pipeline_Connect_Git_And_View_Builds.md) |
| Upload step fails | Missing `.buildkite/pipeline.yml`; agent PATH | [11](./11_Dynamic_Pipelines_And_Pipeline_Upload.md) |
| Secret empty / leaked concern | Wrong layer; echo in script | [10](./10_Secrets_Environment_And_OIDC.md) |
| OIDC rejected | Audience/sub claim / cloud trust | [10](./10_Secrets_Environment_And_OIDC.md) |
| Deploy races | Missing concurrency_group | [12](./12_Deployments_And_Environments.md) |
| K8s hook surprises | Checkout/command container split | [13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md), [22](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md) |
| Cannot clone private repo | Provider/code-access mismatch | [21](./21_Source_Control_Providers_And_Code_Access.md) |
| Slow build unclear where | Need waterfall / queue wait | [24](./24_Integrations_Notifications_Observability_And_Insights.md) |

## 2. Advanced concepts — debug moves

- Open build → failing job → full log.  
- Confirm which agent/queue ran the job.  
- Re-run failed job after fixing agent capacity.  
- For dynamic pipelines, inspect uploaded steps on the build page.  
- Verify cluster assignment matches the agents you expect.

## 3. Applications and use cases — staff checklist

- Pipeline YAML in Git; plugins version-pinned  
- Cluster/queue design matches trust boundaries  
- Hosted vs self-hosted choice explicit; stacks owned if used  
- OIDC or short-lived creds; no prod keys on untrusted PR agents  
- Promote by digest; block or dedicated deploy pipeline for prod  
- Teams + SSO considered for enterprise  
- Package Registries / Test Engine adopted deliberately or deferred  
- Source-control + clone credentials documented per agent type  
- Hooks/images owned; permissions/teams on deploy pipelines  
- Rollback / previous digest path known  

## References

- [Build page](https://buildkite.com/docs/pipelines/build-page)  
- [Agent](https://buildkite.com/docs/agent)  
- [Best practices](https://buildkite.com/docs/pipelines/best-practices)  
