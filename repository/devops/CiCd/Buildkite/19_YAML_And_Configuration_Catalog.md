# 19 — YAML and configuration catalog

[← Previous](./18_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./20_Troubleshooting_And_Staff_Checklist.md)

## 1. Concepts — configuration surfaces

| Surface | What you set |
|---------|----------------|
| `.buildkite/pipeline.yml` (or upload path) | `agents`, `env`, `steps` |
| Step types | `command`, `wait`, `block`, `input`, `trigger`, `group` |
| Command attrs | `label`, `key`, `depends_on`, `if`, `plugins`, `artifact_paths`, `concurrency`, … |
| Dynamic | generator → `buildkite-agent pipeline upload` |
| Agent | config file, tags, hooks, token |
| Queue / cluster | UI/API hosted shape or self-hosted registration |
| Secrets / OIDC | Buildkite secrets; agent env; `oidc` CLI |
| Pipeline settings | triggers, default branch, teams, cluster |
| Repository providers | GitHub/GitLab/Bitbucket/Origin/… + clone credentials |
| Hooks | agent / repo / plugin lifecycle scripts |
| Hosted queue | instance shape, cache, network, image settings |
| Governance | templates, exports, archiving |
| APIs / Terraform | automation of org and pipelines |

Exact keys: current configure + command-step docs.

## 2. Advanced concepts — good defaults

| Env | Lean toward |
|-----|-------------|
| Lab | Hosted agents; Hello world |
| Staging | Auto deploy on `main`; OIDC |
| Prod | block or separate pipeline; concurrency_group; pinned plugins |

## 3. Applications and use cases

PR checklist: every non-default YAML block needs a one-line reason.

## References

- [Defining steps](https://buildkite.com/docs/pipelines/configure/defining-steps)  
- [Command step](https://buildkite.com/docs/pipelines/configure/step-types/command-step)  
- [Environment variables](https://buildkite.com/docs/pipelines/configure/environment-variables)  
