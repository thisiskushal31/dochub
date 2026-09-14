# 01 — What is Buildkite

[← README](./README.md) · [Next: Organization →](./02_Organization_Teams_And_Clusters.md)

---

## 1. Concepts

If you are new to delivery tools: **CI/CD** means automating build, test, and deploy when code changes ([CiCd/1](../1_Pipelines_Build_Test_Deploy.md)). **Buildkite** runs that loop with a split:

```text
Buildkite control plane (SaaS): pipelines, UI, scheduling, APIs
        ↕
Agents (build runners): execute jobs — on your infra or Buildkite-hosted
```

### Product surface

| Area | Job |
|------|-----|
| **Pipelines** | Define steps in YAML; builds → jobs on agents |
| **Agents** | Poll for work; run commands; upload logs/artifacts |
| **Queues / clusters** | Group and isolate agents; assign pipelines |
| **Package Registries** | Store packages/images (sibling product) |
| **Test Engine** | Collect/analyze test results (sibling / Pipelines testing layer) |
| **Platform** | Org, teams, SSO, APIs, Terraform, audit |
| **Governance** | Templates, build exports, log archiving |
| **Integrations / insights** | Plugins, notifications, waterfall, metrics |
| **Source control connections** | GitHub/GitLab/Bitbucket/… (forge stays external) |

### Two architectures

| | **Self-hosted (hybrid)** | **Buildkite hosted** |
|--|--------------------------|----------------------|
| Control plane | Buildkite SaaS | Buildkite SaaS |
| Compute | **You** run agents | Buildkite runs ephemeral agents |
| Why | Private network, custom hardware, strict code residency | Fast start; less agent ops |

Hybrid is the classic Buildkite pitch: orchestration in SaaS; source and secrets stay in **your** environment when you self-host agents. Hosted agents are the managed alternative when you do not want to run the fleet.

### When teams choose it

| Fit | Why |
|-----|-----|
| Need agents inside VPC / on-prem | Hybrid agents |
| Large parallel CI on your metal/cloud | Elastic CI Stack / Agent Stack K8s |
| Want Buildkite UI without agent ops | Hosted agents |

### When not to force it

| Situation | Prefer |
|-----------|--------|
| Forge-native CI is enough | [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [Bitbucket/](../Bitbucket/README.md) |
| Fully self-managed control plane | [Jenkins/](../Jenkins/README.md) (or similar) |
| Already Azure DevOps–centric | [Azure_DevOps/](../Azure_DevOps/README.md) |

---

## 2. Advanced concepts

Plan tiers and Enterprise-only capabilities (e.g. some hosted Docker builder features, cluster insights) change — name the **capability** and confirm on [pricing](https://buildkite.com/pricing) / docs; do not invent gates.

Coding-agent / assisted pipeline features appear in current docs as product experiments — treat them as assisted automation on the same gated loop, not a replacement for human ownership of production.

---

## 3. Applications and use cases

| Role | How Buildkite shows up |
|------|------------------------|
| App engineer | Push → build page → logs |
| Platform | Agent fleets, queues, OIDC, cluster policy |
| Security | Hybrid residency; secrets; SSO |
| SE learning delivery | Agent-centric CI mapped to the universal loop |

**Good:** pipeline YAML in Git; agents least-privileged. **Bad:** one eternal agent with standing prod credentials.

---

## References

- [Buildkite docs](https://buildkite.com/docs)  
- [Pipelines architecture](https://buildkite.com/docs/pipelines/architecture)  
- [Getting started with Pipelines](https://buildkite.com/docs/pipelines/getting-started)  
- [Agent overview](https://buildkite.com/docs/agent)  
