# 04 — Agents: self-hosted and Buildkite hosted

[← Previous](./03_Create_Pipeline_Connect_Git_And_View_Builds.md) · [README](./README.md) · [Next: Queues →](./05_Queues_Clusters_And_Targeting.md)

## 1. Concepts

The **agent** polls Buildkite for jobs, runs them, streams logs, and uploads artifacts.

| | **Self-hosted** | **Buildkite hosted** |
|--|-----------------|----------------------|
| Who provisions | You | Buildkite |
| Lifecycle | Persistent or ephemeral (your choice) | Always ephemeral (destroyed after job) |
| Platforms | Linux, macOS, Windows, Docker, … | Linux, macOS, Windows (hosted shapes) |
| Scaling | Manual / Elastic CI Stack / Agent Stack K8s | Automatic |
| Hooks | Full agent + job lifecycle hooks | Job hooks via custom base images |

New-user tutorials often start on **hosted** agents so a first build works without installing anything. Move to self-hosted when you need VPC access, custom images, or policy residency.

## 2. Advanced concepts

### How it works

Agent authenticates with an **agent token** (cluster-scoped). It accepts jobs matching its **tags** / queue. Different steps in one build can run on different agents.

### Hooks and install depth

Customization via **hooks**, full **install OS/cloud spectrum**, and agent CLI: [22](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md). Hosted-only ops (cache volumes, network, custom images): [23](./23_Hosted_Agent_Operations.md).

### Hygiene (self-hosted)

Patch OS/images; rotate tokens; prefer ephemeral agents for untrusted code; never bake standing prod cloud keys into the AMI ([10](./10_Secrets_Environment_And_OIDC.md)).

### Hosted extras

Hosted queues offer instance shapes (CPU/RAM) and, on some plans, cache volumes / remote Docker builders. Confirm current OS and plan gates in hosted-agent docs.

## 3. Applications and use cases

| Need | Choice |
|------|--------|
| Tutorial / small team | Hosted |
| Private dependency mirrors / VPC | Self-hosted |
| Thousands of parallel tests | Self-hosted autoscaling stacks ([13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md)) |

**Good:** agents as cattle. **Bad:** one shared laptop agent for production deploys.

## References

- [The Buildkite agent](https://buildkite.com/docs/agent)  
- [Buildkite hosted agents](https://buildkite.com/docs/agent/buildkite-hosted)  
- [Self-hosted agents](https://buildkite.com/docs/agent/self-hosted)  
