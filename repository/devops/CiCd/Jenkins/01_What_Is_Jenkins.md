# 01 — What is Jenkins

[← Jenkins](./README.md) · [Next: Install →](./02_Install_Controller_And_LTS.md)

## 1. Concepts

**Jenkins** is an open-source automation server. You install it, configure it, and it runs **jobs/pipelines** when events happen (SCM change, schedule, API, manual).

Mental model:

```text
event → controller schedules work → agent executor runs steps → artifacts / status
```

| Idea | Plain meaning |
|------|----------------|
| **Controller** | The Jenkins service that stores config, schedules, serves UI/API |
| **Agent** | Machine/container that executes builds (labeled) |
| **Job / item** | Unit of automation (Freestyle, Pipeline, folder, …) |
| **Pipeline** | Job defined as code (`Jenkinsfile`) |
| **Plugin** | Extension that adds steps, auth, SCM, clouds, … |
| **LTS** | Long-Term Support line — prefer for production |

### When Jenkins fits

| Situation | Fit |
|-----------|-----|
| On-prem / air-gap / custom agents | Strong |
| Classical VM/WAR deploy estates | Strong ([18](./18_Classical_Host_And_Web_Deploy.md), [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md)) |
| Code only on GitHub and you want zero CI server ops | GitHub Actions may be simpler |
| Greenfield “forge-native only” | Forge CI often lower ops |

You **operate** Jenkins (plugins, backups, HA, CVEs). That is the trade for control.

## 2. Advanced concepts

### Product surfaces

Guided Tour · Tutorials · **User Handbook** (install, using, Pipeline, security, scaling, system administration, managing) · Pipeline hub · Solutions pages · Extend Jenkins (developer — mostly upstream here).

### Freestyle vs Pipeline

Freestyle = UI-configured steps (still everywhere in legacy). Pipeline = Jenkinsfile in Git (prefer for new work). Both are “real Jenkins.”

### Related handbook doors

| Topic | Where |
|-------|--------|
| Host-neutral CI jobs | [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md) |
| Classical stack map | [CiCd/23](../23_Classical_DevOps_Stack_Map.md) |
| OIDC / cloud keys | Prefer short-lived patterns; [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md) |

## 3. Applications and use cases

| Team | Use Jenkins for |
|------|-----------------|
| App squad | Multibranch Pipeline + shared library |
| Platform | JCasC controllers, agent clouds, plugin policy |
| Ops | Backup, reverse proxy, monitoring |
| Brownfield | Keep Freestyle while migrating lane-by-lane |

**Good:** Pipeline-as-code + agents + least privilege. **Bad:** one god-controller with every plugin and builds on the controller node.

## References

- [Jenkins documentation](https://www.jenkins.io/doc/)  
- [What is Jenkins?](https://www.jenkins.io/doc/)  
- [User Handbook](https://www.jenkins.io/doc/book/)  
