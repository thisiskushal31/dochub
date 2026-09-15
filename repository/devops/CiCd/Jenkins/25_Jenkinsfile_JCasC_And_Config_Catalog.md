# 25 — Jenkinsfile, JCasC, and configuration catalog

[← Previous](./24_Feature_And_Offering_Coverage_Map.md) · [README](./README.md) · [Next: Migrate →](./26_Migrate_LTS_Upgrades_And_Extras.md)

---

## 1. Concepts — surfaces you configure

| Surface | Typical files / UI | Chapter |
|---------|-------------------|---------|
| Controller system | Manage Jenkins; **JCasC YAML** | [04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md) |
| Boot hooks | `init.groovy.d`, system properties | [04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md) |
| Plugins | Plugin Manager; `plugins.txt` / image bake | [17](./17_Plugins_Update_Center_And_Hygiene.md) |
| Nodes / clouds | Nodes UI; casc `jenkins.clouds` | [11](./11_Agents_Clouds_Docker_And_Kubernetes.md) |
| Credentials | Credentials UI / casc | [12](./12_Credentials_Secrets_And_Binding.md) |
| Global tools | Tools UI / casc | [19](./19_Managing_Tools_Nodes_Users_And_System.md) |
| Security | Realm + authz / casc | [16](./16_Security_Folders_RBAC_And_Hardening.md) |
| Jobs | Freestyle XML; **Jenkinsfile**; Job DSL | [05](./05_Job_Types_Freestyle_And_Matrix.md)–[06](./06_Pipeline_Core_And_Jenkinsfile.md) |
| Folders / org folders | Folder config; Multibranch SCM sources | [10](./10_Multibranch_And_Organization_Folders.md) |
| Shared libraries | Global Pipeline Libraries + SCM | [13](./13_Shared_Libraries_And_Job_DSL.md) |
| Views | List/section views | [05](./05_Job_Types_Freestyle_And_Matrix.md) |
| Proxy / systemd | Host install | [20](./20_Scaling_HA_Backup_And_Monitoring.md) |

### Jenkinsfile index (Declarative)

`pipeline`, `agent`, `environment`, `tools`, `options`, `parameters`, `triggers`, `stages`, `stage`, `steps`, `when`, `parallel`, `matrix`, `input`, `post`, libraries via `@Library` — details in [08](./08_Declarative_Pipeline_Syntax.md); full syntax + steps reference upstream.

```groovy
pipeline {
  agent none
  options { timestamps() }
  parameters { string(name: 'ENV', defaultValue: 'dev') }
  triggers { cron('H 3 * * 1-5') }
  stages {
    stage('CI') {
      agent { label 'linux' }
      environment { TOKEN = credentials('ci-token') }
      steps { sh 'make ci' }
    }
  }
  post { always { cleanWs() } }
}
```

### JCasC index

Export from UI → edit YAML → apply/reload. Covers many Manage Jenkins settings; plugin support varies — validate after apply ([04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)).

```yaml
jenkins:
  numExecutors: 0
tool:
  jdk:
    installations:
      - name: "21"
        home: "/usr/lib/jvm/java-21"
```

### Freestyle config axes (literacy)

SCM → build environment → build steps → post-build actions → “Restrict where” → triggers. Prefer migrating logic to Pipeline over deepening Freestyle forever ([05](./05_Job_Types_Freestyle_And_Matrix.md)).

---

## 2. Advanced — troubleshooting playbook

| Symptom | Likely cause | Look at |
|---------|--------------|---------|
| Job pending forever | No matching label/cloud; caps hit | Agents; cloud caps; executor starvation docs |
| CPS / NonCPS errors | Illegal Groovy | [09](./09_Scripted_Pipeline_And_CPS.md) |
| Script not approved | Sandbox | Script Approval ([16](./16_Security_Folders_RBAC_And_Hardening.md)) |
| Credential null / empty | Wrong scope/ID | Folder vs system ([12](./12_Credentials_Secrets_And_Binding.md)) |
| Agent offline | Remoting/proxy/WebSocket | Reverse proxy; agent logs ([20](./20_Scaling_HA_Backup_And_Monitoring.md)) |
| Plugin boom after upgrade | Incompatible pin | LTS notes; rollback ([26](./26_Migrate_LTS_Upgrades_And_Extras.md)) |
| JCasC apply fail | Schema/plugin missing | Casc logs; export diff |
| Disk full | Artifacts/builds | Discarders; external storage |
| CSRF / 403 on API | Crumb / token | [21](./21_Blue_Ocean_CLI_And_Remote_API.md) |
| Multibranch no jobs | SCM creds / filters | [10](./10_Multibranch_And_Organization_Folders.md) |
| UI hang | Thread contention | Thread dump; support bundle |

---

## 3. Applications — staff checklist

- LTS controller; built-in build executors minimized  
- Agents labeled; untrusted code isolated  
- Jenkinsfile in SCM; libraries version-pinned  
- Credentials scoped; no secrets in job XML/Jenkinsfile  
- Authz least privilege; CSRF on; Script Console restricted  
- Plugins pinned; upgrade staged; advisories watched  
- JCasC (or equivalent) for controller; backup + restore tested  
- Webhooks preferred; Poll SCM only when needed  
- Promote by fingerprint/digest; classical path documented if used  
- Reverse proxy WebSocket verified for inbound agents  

**Good:** fix in Git (Jenkinsfile/JCasC). **Bad:** irreproducible UI-only prod.

Full inventory: [24](./24_Feature_And_Offering_Coverage_Map.md).

---

## References

- [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)  
- [Configuration as Code](https://www.jenkins.io/doc/book/managing/casc/)  
- [Troubleshooting](https://www.jenkins.io/doc/book/troubleshooting/)  
- [Diagnosing errors](https://www.jenkins.io/doc/book/system-administration/diagnosing-errors/)  
