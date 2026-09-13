# DevOps toolchain stages (conceptual)

[← Back to Methodologies](./README.md)

A **toolchain** is the set of tools that implement the delivery value stream. Foundation courses teach **stages** before brand names. Memorize the stage; pick one tool per stage later.

---

## Classic stage map

```text
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor
         ↑________________________________feedback____________|
```

| Stage | Job | Handbook / sister home |
|-------|-----|-------------------------|
| **Plan** | Prioritize work, security/data class early | Backlog + [14 DevSecOps](./14_DevSecOps_Mindset.md) |
| **Code** | Version control, branching, reviews | [4](./4_Branching_And_PR_Practices.md); Git in Tooling Utility |
| **Build** | Compile/package immutable artifacts | [CiCd/](../CiCd/README.md), [CiCd/4](../CiCd/4_Artifacts_And_Registries.md) |
| **Test** | Automated quality + security checks | [13](./13_Continuous_Everything.md), [Security/](../Security/README.md) |
| **Release** | Make a version releasable / promotable | [13](./13_Continuous_Everything.md) Continuous Delivery |
| **Deploy** | Install into an environment | [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md), [CiCd/3](../CiCd/3_Deployment_Strategies.md) |
| **Operate** | Run, patch, respond | [3](./3_Team_Patterns_SRE_Incident.md), [Servers/](../Servers/README.md), OS |
| **Monitor** | Metrics, logs, traces, product signals | [Observability/](../Observability/README.md) |

Infra as code, cloud, and containers cut across stages: [IAC/](../IAC/README.md), [Cloud/](../Cloud/README.md), [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

---

## Rules for beginners

1. **One tool per stage** until you are fluent — then compare.  
2. Prefer **integration** (same identity, artifacts, and traces across stages) over a pile of disconnected demos.  
3. AI/AIOps appearances in modern syllabi are **assistive** (summarize incidents, suggest runbooks) — they do not replace SLOs, ownership, or change control.  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Collecting 15 logos on a CV | Explain each stage with one tool you can debug |
| Toolchain with no feedback to Plan | Close the loop with incidents and DORA |

## Next

- Vocabulary CI/CD: [13](./13_Continuous_Everything.md)  
- Implement: [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)

## Further reading

- DevOps Foundation — Automation & toolchain module (stage thinking)  
- Your eventual CiCd tool folders — after concepts  
