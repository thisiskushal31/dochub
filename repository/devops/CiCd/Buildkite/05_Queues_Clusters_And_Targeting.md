# 05 — Queues, clusters, and targeting

[← Previous](./04_Agents_Self_Hosted_And_Hosted.md) · [README](./README.md) · [Next: YAML →](./06_Pipeline_YAML_And_Step_Types.md)

---

## 1. Concepts

| Object | Job |
|--------|-----|
| **Cluster** | Isolation boundary for agents, queues, tokens, pipelines |
| **Queue** | Named agent pool inside a cluster (self-hosted or hosted) |
| **Tags / agent query** | Extra matching rules on steps |

Target a queue from YAML:

```yml
agents:
  queue: "default"

steps:
  - command: "npm test"
  - command: "./build-mac.sh"
    agents:
      queue: "macos-medium"
```

Default org setup creates several queues (including hosted linux/macos shapes). Pipelines run only on agents in their assigned cluster.

---

## 2. Advanced concepts

### Self-hosted vs hosted queues

Create a **self-hosted queue** and register agents with that queue’s token/tags, or create a **Buildkite hosted queue** with an instance shape — Buildkite provisions ephemeral agents.

Do not mix unrelated trust levels on one queue. Prefer separate queues (or clusters) for deploy vs PR CI.

### Pause / metrics

Queues can be paused. Queue wait-time metrics and deeper cluster insights may be plan-gated — confirm docs.

### Agent selection

Within a matching queue, agents that recently finished work are preferred (warm caches). Still treat each job as potentially on a fresh machine.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Linux CI default | `queue: default` or `linux-small` |
| macOS builds | Dedicated macos hosted/self-hosted queue |
| Prod deploy only | Restricted queue + team permissions |

**Good:** step-level `agents:` for special hardware. **Bad:** one mega-queue for everything including prod.

---

## References

- [Queues](https://buildkite.com/docs/agent/queues)  
- [Managing queues](https://buildkite.com/docs/agent/queues/managing)  
- [Clusters](https://buildkite.com/docs/pipelines/security/clusters)  
- [Agent targeting](https://buildkite.com/docs/agent/v3/cli-start#agent-targeting)  
