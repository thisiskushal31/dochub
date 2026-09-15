# 21 — Blue Ocean, CLI, and Remote API

[← Previous](./20_Scaling_HA_Backup_And_Monitoring.md) · [README](./README.md) · [Next: Worked example →](./22_Worked_Example_Pipeline_Build_And_Deploy.md)

---

## 1. Concepts

| Surface | Role |
|---------|------|
| **Classic UI** | Default administration and job config |
| **Blue Ocean** | Deprecated **July 2026** — no new features; prefer **Pipeline Graph View** / **Stage View** |
| **Jenkins CLI** | `jenkins-cli.jar` / SSH CLI for admin automation |
| **Remote Access API** | REST XML/JSON for jobs, builds, queue, … |
| **External / scripted clients** | API tokens + crumbs; authenticated automation |

Use API/CLI for cattle operations; still prefer JCasC + Git for desired state. Classic UI + Pipeline Stage View remain enough for competence.

---

## 2. Advanced concepts

### Auth for API

API tokens, SSH keys for CLI — rotate; least privilege users.

```bash
# CLI — download jenkins-cli.jar from the controller, then:
java -jar jenkins-cli.jar -s https://jenkins.example.com/ -auth user:token   help

java -jar jenkins-cli.jar -s https://jenkins.example.com/ -auth user:token   build myfolder/myjob -p ENV=stage -s
```

```bash
# Remote Access API — trigger a build (token user; crumb may be required)
curl -X POST -u user:token \
  "https://jenkins.example.com/job/myfolder/job/myjob/buildWithParameters?ENV=stage"
```

### CSRF crumbs

Remote POST needs crumb handling unless disabled (don’t disable casually). Fetch a crumb from `/crumbIssuer/api/json` when the controller requires it — see authenticating scripted clients docs.

### Blue Ocean literacy

Official handbook: Blue Ocean **deprecated July 2026** (no further security/functionality updates after that posture). For new estates prefer **Pipeline Graph View** and **Pipeline: Stage View**; keep classic UI + Snippet Generator. Existing Blue Ocean installs: plan migration, don’t build new standards on it.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Trigger from portal | Remote API build with parameters |
| Bootstrap | CLI install-plugin + casc apply |
| Debug Pipeline | Blue Ocean or Pipeline Steps view |

**Good:** API as automation with audited service accounts. **Bad:** personal admin tokens in shared chatbots.

---

## References

- [Jenkins CLI](https://www.jenkins.io/doc/book/managing/cli/)  
- [Remote access API](https://www.jenkins.io/doc/book/using/remote-access-api/)  
- [Blue Ocean](https://www.jenkins.io/doc/book/blueocean/) (deprecated July 2026)  
- [Pipeline Graph View plugin](https://plugins.jenkins.io/pipeline-graph-view/)  
