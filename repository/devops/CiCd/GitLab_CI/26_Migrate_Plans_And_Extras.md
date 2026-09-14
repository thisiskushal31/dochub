# 26 — Migrate, plans, and extras

[← Previous](./25_YAML_Catalog_And_Troubleshooting.md) · [README](./README.md)

---

## 1. Concepts

### Migration into GitLab CI

Docs cover migrating from Jenkins, GitHub Actions, and other systems, plus general CI migration guidance. Treat importers/guides as **accelerators** — review generated YAML; don’t merge blind. External repository CI (e.g. GitHub mirror patterns) is an alternative when SCM stays elsewhere.

### Plans and offerings literacy

Free / Premium / Ultimate, compute minutes, Duo add-ons, Dedicated — **confirm current subscription docs**. Never invent prices in handbook notes.

### Extras worth naming

| Extra | Note |
|-------|------|
| ChatOps | Run jobs from chat |
| Mobile DevOps | Specialized mobile CI docs |
| Sustainability / compute efficiency | Minutes and runner efficiency |
| Interactive web terminal | Live job debug ([10](./10_Runners_And_Executors.md)) |
| Feature flags | In-product flags literacy |
| Editor extensions | VS Code/JetBrains workflows |
| Solutions architecture | Reference solutions door |
| Wiki / Pages / snippets | Product doors — not CI depth |
| Monitor / incidents | Operations door ([24](./24_Feature_And_Offering_Coverage_Map.md)) |

---

## 2. Advanced concepts

Cross-host automation patterns stay in [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md). Parent/child and multi-project pipelines sometimes replace “many Jenkins jobs” more cleanly than 1:1 ports.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Leave Jenkins | Map jobs→stages/needs; parallel run; cutover |
| Keep GitHub SCM | External repo integration + GitLab CI |
| Buy Ultimate later | Know AppSec/compliance doors now ([17](./17_Security_Scanning_And_Compliance_Literacy.md)) |

**Good:** migration MRs owned like product code. **Bad:** bulk-import 500 jobs with no runners capacity plan.

**Upstream-only:** every per-scanner and per-cloud cookbook page.

---

## References

- [Plan a migration to GitLab CI/CD](https://docs.gitlab.com/ci/migration/plan_a_migration/)  
- [Migrate from Jenkins](https://docs.gitlab.com/ci/migration/jenkins/)  
- [Migrate from GitHub Actions](https://docs.gitlab.com/ci/migration/github_actions/)  
- [Subscriptions](https://docs.gitlab.com/subscriptions/)  
- [CI/CD for external repos](https://docs.gitlab.com/ci/ci_cd_for_external_repos/)  
