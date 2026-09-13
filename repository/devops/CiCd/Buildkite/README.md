# Buildkite

[← Back to CI/CD](../README.md)

CI orchestration where **you run the agents**; Buildkite coordinates pipelines, UI, and secrets delivery. Strong when runners must stay in your network/security boundary.

Install: [1_Install_And_First_Use.md](./1_Install_And_First_Use.md). Concepts: [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md).

---

## What it is

- Pipelines defined in version control (YAML steps)  
- **Agents** poll Buildkite and execute jobs on your hosts/K8s/ASGs  
- You control OS images, network egress, and hardware (GPU, nested virt, …)  
- Buildkite SaaS (or self-hosted control options per current product) coordinates scheduling and UI  

Contrast: GitHub-hosted runners execute on vendor VMs; Buildkite’s default model assumes **your** compute.

---

## Mental model

```text
git push → Buildkite pipeline
  → agent in your VPC picks job
  → build/test/push digest
  → optional deploy steps with your IAM
```

---

## First use

See [1_Install_And_First_Use.md](./1_Install_And_First_Use.md). Docs: [buildkite.com/docs](https://buildkite.com/docs).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Long-lived fat agents with prod creds | Ephemeral agents; job-scoped identity |
| Unpatched agent AMIs | Immutable agent images + rotation |

## Further reading

- [Buildkite pipelines](https://buildkite.com/docs/pipelines)  
- [Agent overview](https://buildkite.com/docs/agent/v3)  
