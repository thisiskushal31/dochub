# 03 — Architecture: controller, agents, executors

[← Previous](./02_Install_Controller_And_LTS.md) · [README](./README.md) · [Next: Configuration surfaces →](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)

## 1. Concepts

| Piece | Role |
|-------|------|
| **Controller** | UI, API, job config, scheduling, credentials store |
| **Agent** | Runs build steps; connected via remoting (or cloud provisioned) |
| **Executor** | Slot on a node — how many concurrent builds that node accepts |
| **Label** | Tag used in `agent { label 'linux && maven' }` / Freestyle restrict-where |
| **Built-in node** | The controller’s own node — do not treat as a general build farm |

```text
Controller
  ├─ built-in node (executors → preferably 0 for builds)
  ├─ static agents (SSH / inbound)
  └─ clouds (Docker, Kubernetes, EC2, …) → ephemeral agents
```

Older docs say “master/slave”; say **controller/agent**.

## 2. Advanced concepts

### Remoting and trust

Agent-to-controller security matters: agents should not get unconstrained controller reach ([16](./16_Security_Folders_RBAC_And_Hardening.md)).

### Executor starvation

Too few executors / wrong labels → queue forever. Handbook covers executor starvation symptoms.

### Architecting for scale / manageability

Separate concerns: controller sizing, agent pools by trust tier, external storage for artifacts when needed ([20](./20_Scaling_HA_Backup_And_Monitoring.md)).

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Dev CI | Docker cloud or small SSH pool |
| Prod deploy jobs | Isolated labeled agents; no shared with untrusted PR builds |
| High fan-out | K8s cloud agents |

**Good:** labels describe capability (`jdk21`, `docker`, `gpu`). **Bad:** everything runs on controller with 8 executors.

## References

- [Using agents](https://www.jenkins.io/doc/book/using/using-agents/)  
- [Managing nodes](https://www.jenkins.io/doc/book/managing/nodes/)  
- [Architecting for scale](https://www.jenkins.io/doc/book/scaling/architecting-for-scale/)  
