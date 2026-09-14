# 03 — Create a project, add config, and view pipelines

[← Previous](./02_Organization_Project_And_VCS.md) · [README](./README.md) · [Next: Config model →](./04_Config_Mental_Model_Jobs_Steps_Workflows.md)

---

## 1. Concepts

### Know-nothing path (Cloud)

1. Sign up / open [app.circleci.com](https://app.circleci.com).  
2. Select (or create) an **organization**.  
3. **Create project** → connect repository → set up pipeline (config + triggers).  
4. Commit **`.circleci/config.yml`** at the repo root (or accept an in-app starter).  
5. Push; open the **pipeline** in the web app.

### What you see in the UI

| View | Job |
|------|-----|
| Pipelines list | Recent runs and status |
| Pipeline / workflow map | Jobs and dependencies |
| Job page | Steps, **logs**, timing |
| Artifacts / tests tabs | When configured |

That is “seeing a pipeline”: project → pipeline run → workflow → job logs.

### Minimal mental config

Config lives under `.circleci/`. CircleCI believes in **configuration as code** — the YAML is the source of truth reviewed in Git ([04](./04_Config_Mental_Model_Jobs_Steps_Workflows.md)).

SSH into a running/finished job (when enabled) helps debug environment issues — use sparingly; treat as privileged access.

---

## 2. Advanced concepts

**Config editor** and VS Code extension help validate and iterate. Prefer `circleci config validate` / `process` via CLI for local checks ([18](./18_Server_CLI_API_And_Toolkit.md)).

Hello-world samples exist per executor (Docker, macOS, Windows) ([05](./05_Templates_And_First_Config_Yml.md), [06](./06_Managed_Executors_And_Resource_Classes.md)).

---

## 3. Applications and use cases

| Goal | Milestone |
|------|-----------|
| Prove CircleCI works | Hello world green; logs readable |
| Real app | Tests on every PR |
| Path to prod | Deploy job + approval hold ([15](./15_Deployments_Approvals_And_Markers.md)) |

**Verify:** VCS status checks (if used) reflect pipeline result; failed step log shows the failing command.

---

## References

- [Quickstart guide](https://circleci.com/docs/guides/getting-started/getting-started/)  
- [Hello world](https://circleci.com/docs/guides/getting-started/hello-world/)  
- [Introduction to the web app](https://circleci.com/docs/guides/about-circleci/introduction-to-the-circleci-web-app/)  
- [Config intro](https://circleci.com/docs/guides/getting-started/config-intro/)  
