# 22 — YAML and configuration catalog

[← Previous](./21_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./23_Troubleshooting_And_Staff_Checklist.md)

## 1. Concepts — configuration surfaces

| Surface | What you set |
|---------|----------------|
| `.circleci/config.yml` | `version`, `orbs`, `commands`, `executors`, `jobs`, `workflows`, parameters |
| Job | executor (`docker`/`machine`/`macos`/…), `resource_class`, `steps` |
| Workflow job entry | `requires`, `filters`, `context`, `type: approval`, matrix |
| Release / Smart Deployments | `type: release`, release plan steps, `validation` block |
| Project settings | env vars, advanced (fork secrets), SSH keys |
| Contexts | org secret bundles |
| Runners | namespace/resource_class registration + agent config |
| Triggers | VCS, schedule, custom webhooks, API |
| Policies / SSO | org admin surfaces |

Exact keys: [configuration reference](https://circleci.com/docs/reference/configuration-reference/).

## 2. Advanced concepts — good defaults

| Env | Lean toward |
|-----|-------------|
| Lab | Docker `cimg`; hello world |
| Staging | Auto deploy on `main`; OIDC |
| Prod | approval; restricted context; pinned orbs |

## 3. Applications and use cases

PR checklist: every non-default block needs a one-line reason.

## References

- [Configuration reference](https://circleci.com/docs/reference/configuration-reference/)  
- [Reusable config](https://circleci.com/docs/reference/reusing-config/)  
- [Variables](https://circleci.com/docs/reference/variables/)  
