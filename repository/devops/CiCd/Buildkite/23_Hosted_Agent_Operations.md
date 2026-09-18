# 23 — Hosted agent operations

[← Previous](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md) · [README](./README.md) · [Next: Integrations →](./24_Integrations_Notifications_Observability_And_Insights.md)

## 1. Concepts

**Buildkite hosted agents** run ephemeral VMs/containers Buildkite provisions for each job on a **hosted queue** ([04](./04_Agents_Self_Hosted_And_Hosted.md), [05](./05_Queues_Clusters_And_Targeting.md)).

| Surface | Job |
|---------|-----|
| **Instance shapes** | Linux / macOS / Windows size classes on the queue |
| **Code access** | Via connected GitHub/Origin or secrets/SSH for other providers ([21](./21_Source_Control_Providers_And_Code_Access.md)) |
| **Cache volumes** | NVMe-backed caches documented for hosted (confirm current OS support) |
| **Network security** | Hosted networking / allowlist controls per docs |
| **Internal container registry** | Cluster-local image cache patterns |
| **Custom base images** | Bake tools + job hooks |
| **Terminal / desktop access** | Debug paths for hosted jobs (use sparingly; treat as privileged) |
| **Pipeline migration** | Moving self-hosted pipelines onto hosted queues |

## 2. Advanced concepts

### Plan gates

Some hosted capabilities (e.g. remote Docker builders with layer caching) are documented as **Enterprise** or paid — name the capability; confirm on pricing/docs before promising them.

### Isolation

Hosted queues live in a **cluster**; caches, secrets, and registries for that cluster are not shared with others.

### When hosted is wrong

Private package mirrors only reachable from your VPC, specialized GPUs you own, or strict “code never on vendor compute” policies → self-hosted ([13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Fast macOS CI without Mac fleet | Hosted macOS queue |
| Speed Node/Docker CI | Hosted Linux + cache volumes / custom image |
| Debug flaky hosted job | Terminal access per policy |

**Good:** ephemeral by default; secrets via Buildkite secrets or OIDC. **Bad:** treating hosted debug shells as bastions.

## References

- [Buildkite hosted agents](https://buildkite.com/docs/agent/buildkite-hosted)  
- [Hosted Linux](https://buildkite.com/docs/agent/buildkite-hosted/linux)  
- [Hosted macOS](https://buildkite.com/docs/agent/buildkite-hosted/macos)  
- [Cache volumes](https://buildkite.com/docs/agent/buildkite-hosted/cache-volumes)  
- [Hosted network security](https://buildkite.com/docs/agent/buildkite-hosted/network-security)  
