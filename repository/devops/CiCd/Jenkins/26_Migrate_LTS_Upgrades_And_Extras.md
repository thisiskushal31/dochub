# 26 — Migrate, LTS upgrades, and extras

[← Previous](./25_Jenkinsfile_JCasC_And_Config_Catalog.md) · [README](./README.md)

---

## 1. Concepts

### LTS upgrades

Follow LTS upgrade guides / changelogs: backup `$JENKINS_HOME`, read plugin compatibility, stage on a clone, then prod. Weekly releases are for those who accept more change.

### Migrating *to* Jenkins

Import jobs, recreate credentials, move Freestyle → Pipeline gradually, introduce Multibranch + libraries. There is no single magic importer for every tool — treat migrations as programs.

### Migrating *from* Jenkins

Often to forge CI (GitHub Actions, GitLab CI, …). Map: Freestyle/Pipeline → workflows; shared libraries → reusable workflows/components; agents → runners. Parallel-run before cutover ([GitHub_Actions/24](../GitHub_Actions/24_Migrate_Packages_And_Extras.md), [GitLab_CI/26](../GitLab_CI/26_Migrate_Plans_And_Extras.md)).

### Extras worth naming

| Extra | Note |
|-------|------|
| Solutions pages | Language/stack cookbooks — upstream |
| Pipeline step reference | Per-plugin generated docs |
| Support bundle | For diagnostics with community/vendor |
| UI themes | Appearance literacy |
| JMeter / perf examples | Using-docs adjacent |
| Chef/Puppet installs | CM literacy doors |
| Jenkinsfile Runner / GHA act | Niche; optional literacy |

---

## 2. Advanced concepts

Built-in node migration, detached plugins, and security hardening changes often accompany major LTS jumps — read the upgrade guide for *your* from→to pair.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Survive years | LTS cadence + casc + backup drills |
| Leave Jenkins | Parallel pipelines on target; freeze plugin growth |
| Absorb company | Organization Folders + libraries + folders RBAC |

**Good:** upgrade notes in the change ticket. **Bad:** friday plugin “update all” on the only controller.

**Upstream-only:** every plugin, every solution page, full step reference dump.

---

## References

- [LTS changelog](https://www.jenkins.io/changelog-stable/)  
- [Upgrade guide](https://www.jenkins.io/doc/upgrade-guide/)  
- [Pipeline best practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)  
