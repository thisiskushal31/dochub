# 13 — Self-hosted stacks: AWS Elastic CI and Kubernetes

[← Previous](./12_Deployments_And_Environments.md) · [README](./README.md) · [Next: Packages & Test Engine →](./14_Package_Registries_And_Test_Engine.md)

---

## 1. Concepts

Running one agent by hand does not scale. Buildkite’s mainstream self-host patterns:

| Stack | Role |
|-------|------|
| **Elastic CI Stack for AWS** | Autoscaling agents in your AWS VPC (CloudFormation / Terraform variants) |
| **Agent Stack for Kubernetes** (`agent-stack-k8s`) | Controller watches Agent API; runs jobs as Pods |
| **GCP / Azure self-hosted** | Cloud install guides for agents on those clouds |

Both still use the same Pipelines control plane and YAML — only how agents appear changes. Manual install OS matrix and hooks: [22](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md).

---

## 2. Advanced concepts

### Elastic CI Stack (AWS)

Private, autoscaling Linux/Windows agents; deep AWS integration (ASG, secrets patterns). Prefer immutable images and short-lived credentials.

### Agent Stack for Kubernetes

Helm install with cluster agent token and queue. Checkout and command may run in **separate containers** — hooks and env sharing differ from single-process EC2 agents. Migration docs cover secrets, Docker, ECR, and hook differences.

### When hosted is enough

If you do not need VPC residency, prefer Buildkite hosted queues and skip this ops surface ([04](./04_Agents_Self_Hosted_And_Hosted.md)).

Related ops depth for K8s/AWS lives in Containerization / Cloud folders — this chapter is Buildkite literacy only.

---

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| AWS-native company | Elastic CI Stack |
| Already on K8s | agent-stack-k8s |
| Mixed | Separate queues per stack |

**Good:** capacity alarms; drain before upgrades. **Bad:** undocumented golden AMI nobody can rebuild.

---

## References

- [Elastic CI Stack for AWS](https://buildkite.com/docs/agent/self-hosted/aws/elastic-ci-stack)  
- [Agent Stack for Kubernetes](https://buildkite.com/docs/agent/v3/agent-stack-k8s)  
- [GitHub: elastic-ci-stack-for-aws](https://github.com/buildkite/elastic-ci-stack-for-aws)  
- [GitHub: agent-stack-k8s](https://github.com/buildkite/agent-stack-k8s)  
- [Self-hosted on GCP](https://buildkite.com/docs/agent/self-hosted/gcp)  
- [Self-hosted on Azure](https://buildkite.com/docs/agent/self-hosted/azure)  
