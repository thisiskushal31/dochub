# 04 — Configuration surfaces: UI, JCasC, init, properties, CLI

[← Previous](./03_Architecture_Controller_Agents_Executors.md) · [README](./README.md) · [Next: Job types →](./05_Job_Types_Freestyle_And_Matrix.md)

## 1. Concepts

Jenkins is configured through **several equivalent surfaces**. Staff who only know the UI miss half the product — and cannot rebuild a controller after disk loss.

| Surface | What it configures | Typical store |
|---------|-------------------|---------------|
| **Manage Jenkins UI** | System, security, nodes, plugins, tools, clouds | `$JENKINS_HOME` XML |
| **Job / folder config UI** | Per-item Freestyle/Pipeline settings | `jobs/…/config.xml` |
| **Jenkinsfile** | Pipeline definition | SCM |
| **Configuration as Code (JCasC)** | Controller config as YAML | Git + casc plugin |
| **Groovy init / hook scripts** | Boot-time automation | `init.groovy.d` |
| **System properties** (`-D…`) | JVM/startup feature flags | Service unit / Helm values |
| **CLI / Remote API** | Scripted changes | [21](./21_Blue_Ocean_CLI_And_Remote_API.md) |
| **plugins list** | Installed plugin set | `plugins/` or `plugins.txt` |

### JCasC (must-know)

The **Configuration as Code** plugin exports/applies human-readable YAML for large parts of Manage Jenkins (security realms, credentials providers, clouds, tools, global node properties, …). Check YAML into SCM; apply on bootstrap; review diffs like app code.

Illustrative shape (keys vary by plugins — **export from your controller** is truth):

```yaml
# jenkins.yaml (JCasC) — illustrative
jenkins:
  systemMessage: "Platform Jenkins — config via JCasC"
  numExecutors: 0
  securityRealm:
    local:
      allowsSignup: false
      users:
        - id: "admin"
          password: "${ADMIN_PASSWORD}"
  authorizationStrategy:
    loggedInUsersCanDoAnything:
      allowAnonymousRead: false
unclassified:
  location:
    url: "https://jenkins.example.com/"
```

`plugins.txt` (official Docker image pattern):

```text
configuration-as-code:latest
git:latest
workflow-aggregator:latest
credentials-binding:latest
```

Traditional Groovy init scripts can do almost anything — few guardrails. Prefer JCasC for repeatable controllers; reserve Groovy for gaps JCasC cannot express yet.

```groovy
// $JENKINS_HOME/init.groovy.d/set-executors.groovy — illustrative
import jenkins.model.Jenkins
Jenkins.instance.setNumExecutors(0)
Jenkins.instance.save()
```

### `$JENKINS_HOME`

The controller’s state directory: job configs, build history metadata, secrets, plugins, casc overlays. Back this up ([20](./20_Scaling_HA_Backup_And_Monitoring.md)); treat agent workspaces as ephemeral.

## 2. Advanced concepts

### Config as code loop

1. Install `configuration-as-code`.  
2. **View Configuration** / export → baseline YAML.  
3. Store in Git; edit intentionally; reload/apply.  
4. Pair with Docker/K8s mounts or casc bundles for immutable controllers.  
5. Validate after apply — plugin schema support varies; read casc logs.

Common casc domains (exact keys evolve — export is truth): `jenkins:` (systemMessage, numExecutors, securityRealm, authorizationStrategy, clouds, nodes…), `credentials:`, `tool:`, `unclassified:`, plugin-specific roots.

### Groovy hook scripts

`init.groovy.d/*.groovy` runs at startup — document and CODEOWN them; they are foot-guns in the wrong hands. Prefer idempotent scripts; avoid “create admin user every boot” surprises in prod.

### System configuration & properties

Quiet period, SCM checkout retry, workspace cleanup defaults, global properties — plus JVM system properties for tuning/features ([system properties](https://www.jenkins.io/doc/book/managing/system-properties/)). Networking parameters (HTTP port, prefix, listen address) live in install/service docs.

```bash
# Example: systemd drop-in / container JAVA_OPTS (names vary by install)
JAVA_OPTS="-Dhudson.model.DirectoryBrowserSupport.CSP= -Djava.awt.headless=true"
```

### Script Console

Arbitrary Groovy on the controller — break-glass only; treat as root shell. Pair with authz lockdown ([16](./16_Security_Folders_RBAC_And_Hardening.md)).

### Which surface for which change?

| Change | Prefer |
|--------|--------|
| Pipeline logic | Jenkinsfile + libraries |
| Controller security/clouds/tools | JCasC |
| One-off emergency | UI or Script Console (then capture to casc) |
| Feature flags | System properties |
| Job scaffolding at scale | Job DSL / REST ([13](./13_Shared_Libraries_And_Job_DSL.md), [21](./21_Blue_Ocean_CLI_And_Remote_API.md)) |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Cattle controllers | JCasC + pinned plugins as code |
| Pet legacy controller | Export JCasC gradually; stop snowflake UI-only changes |
| Air-gap | Vendored plugins + casc bundle |
| Multi-env | Same casc shape; env-specific overlays |

**Good:** controller config in Git with tested apply. **Bad:** irreproducible UI clicks with no export.

## References

- [Configuration as Code](https://www.jenkins.io/doc/book/managing/casc/)  
- [System configuration](https://www.jenkins.io/doc/book/managing/system-configuration/)  
- [System properties](https://www.jenkins.io/doc/book/managing/system-properties/)  
- [Groovy hook scripts](https://www.jenkins.io/doc/book/managing/groovy-hook-scripts/)  
- [Jenkins CLI](https://www.jenkins.io/doc/book/managing/cli/)  
- [Script Console](https://www.jenkins.io/doc/book/managing/script-console/)  
