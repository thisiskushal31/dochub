# 21 — API, webhooks, and integrations

[← Previous](./20_Self_Managed_Admin_Literacy.md) · [README](./README.md) · [Next: Worked example →](./22_Worked_Example_CI_Build_And_Promote.md)

## 1. Concepts

Extend GitLab without forking it:

| Surface | Use |
|---------|-----|
| **REST / GraphQL API** | Automate projects, MRs, pipelines, variables |
| **Webhooks** | Notify external systems on events |
| **Integrations** | Slack, Jira, Jenkins, … |
| **Pipeline triggers** | Start pipelines from outside |
| **Editor extensions** | IDE workflows |

CI jobs often call the API with **job tokens** (scoped) or project access tokens — prefer least privilege ([12](./12_Caching_Artifacts_And_Job_Tokens.md)).

## 2. Advanced concepts

| Topic | Literacy |
|-------|----------|
| Trigger tokens | External start; protect them |
| ChatOps | Run jobs from chat ([optional]) |
| Import/export | Move projects ([26](./26_Migrate_Plans_And_Extras.md)) |
| Rate limits | Burst automation can 429 |

**Upstream-only:** full API resource encyclopedia.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Mobile app kicks CI | Trigger API + `rules` |
| Deploy notification | Webhook → chat |
| Compliance export | API pagination jobs |

**Good:** automation uses tokens with narrow scopes. **Bad:** personal Owner PATs in shared CI variables.

## References

- [GitLab API](https://docs.gitlab.com/api/)  
- [Webhooks](https://docs.gitlab.com/user/project/integrations/webhooks/)  
- [Integrations](https://docs.gitlab.com/integration/)  
- [Triggering pipelines](https://docs.gitlab.com/ci/triggers/)  
