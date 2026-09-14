# 04 — Config mental model: jobs, steps, workflows

[← Previous](./03_Create_Project_Config_And_View_Pipelines.md) · [README](./README.md) · [Next: Templates →](./05_Templates_And_First_Config_Yml.md)

---

## 1. Concepts

CircleCI config is YAML in **`.circleci/config.yml`**. Prefer **`version: 2.1`** for orbs and reusable config.

| Object | Role |
|--------|------|
| **Workflow** | Orchestrates which **jobs** run and in what order |
| **Job** | Series of **steps** in one executor |
| **Step** | `checkout`, `run`, `restore_cache`, orb commands, … |
| **Executor** | Where the job runs (Docker image, machine, macOS, runner, …) |
| **Orb** | Packaged reusable jobs/commands/executors ([10](./10_Orbs_Use_And_Author_Literacy.md)) |

```text
workflows:
  → jobs (requires / filters)
    → steps inside an executor
```

Jobs in a workflow that do not depend on each other can run **concurrently** (subject to plan limits).

---

## 2. Advanced concepts

Install dependencies in the job that needs them — each job starts clean unless you pass **workspaces** or **caches** ([09](./09_Caches_Workspaces_And_Artifacts.md)).

Top-level reusable keys: `orbs`, `commands`, `executors`, parameters ([11](./11_Reusable_Config_Commands_Executors_Parameters.md)).

Full key encyclopedia: configuration reference — don’t memorize; look up when implementing.

---

## 3. Applications and use cases

| Estate | Shape |
|--------|-------|
| Tiny service | One workflow, one test job |
| Standard app | test → build → deploy workflow |
| Shared platform | Orbs + org contexts |

**Good:** workflows explicit in YAML. **Bad:** one mega-job that always deploys.

---

## References

- [Concepts](https://circleci.com/docs/guides/about-circleci/concepts/)  
- [Jobs and steps](https://circleci.com/docs/guides/orchestrate/jobs-steps/)  
- [Workflows](https://circleci.com/docs/guides/orchestrate/workflows/)  
- [Configuration reference](https://circleci.com/docs/reference/configuration-reference/)  
