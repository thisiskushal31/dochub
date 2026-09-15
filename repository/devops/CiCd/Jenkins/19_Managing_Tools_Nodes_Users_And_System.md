# 19 — Managing tools, nodes, users, and system

[← Previous](./18_Classical_Host_And_Web_Deploy.md) · [README](./README.md) · [Next: Scale →](./20_Scaling_HA_Backup_And_Monitoring.md)

---

## 1. Concepts

**Manage Jenkins** is the operator console. Configuration classes:

| Area | Examples |
|------|----------|
| **System** | Quiet period, SCM retry, location/URL, global properties, env |
| **Security** | Realm, authz, CSRF — see [16](./16_Security_Folders_RBAC_And_Hardening.md) |
| **Tools** | JDK, Maven, Gradle, Git, Node (auto-installer or fixed paths) |
| **Nodes / clouds** | Agents and ephemeral clouds ([11](./11_Agents_Clouds_Docker_And_Kubernetes.md)) |
| **Plugins** | Update Center ([17](./17_Plugins_Update_Center_And_Hygiene.md)) |
| **Users** | Accounts (depending on security realm); admin password reset literacy |
| **Appearance / themes** | UI themes |
| **User Content** | Static files served by Jenkins (CSP-adjacent) |
| **About / system info** | Versions, support bundle inputs |
| **Script Console / Approval** | Break-glass Groovy; sandbox approvals |
| **Configuration as Code** | Export/apply ([04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)) |
| **CLI** | Remote admin ([21](./21_Blue_Ocean_CLI_And_Remote_API.md)) |
| **Time zone / locale** | Display and i18n literacy |

Capture as much as possible in **JCasC** ([04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)).

---

## 2. Advanced concepts

### Built-in node migration

Docs cover built-in node renames/migrations — read when upgrading across eras.

### Spawning processes / environment

Agent process spawning and env isolation matter for reliable `sh` steps.

### User content

User Content directory and CSP interactions — security-adjacent.

### Tools in Pipeline

Names must match **Global Tool Configuration** (or JCasC `tool:` entries):

```groovy
pipeline {
  agent { label 'linux' }
  tools {
    jdk '21'
    maven '3.9'
  }
  stages {
    stage('Build') {
      steps { sh 'mvn -B -version && mvn -B test' }
    }
  }
}
```

Prefer baking JDK/Maven into agent images for cattle fleets; use `tools { }` when permanent nodes share one controller-managed install.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Reproducible agents | Bake tools in images; minimal Global Tool auto-install |
| Multi-team | Folders + users/groups via realm |
| Audit | System info + support bundle process |

**Good:** JCasC for system/tools/clouds. **Bad:** undocumented UI-only tool paths.

---

## References

- [Managing Jenkins](https://www.jenkins.io/doc/book/managing/)  
- [Tools](https://www.jenkins.io/doc/book/managing/tools/)  
- [Nodes](https://www.jenkins.io/doc/book/managing/nodes/)  
- [Users](https://www.jenkins.io/doc/book/managing/users/)  
