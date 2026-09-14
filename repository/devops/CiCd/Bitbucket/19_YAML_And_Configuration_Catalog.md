# 19 — YAML and configuration catalog

[← Previous](./18_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./20_Troubleshooting_And_Staff_Checklist.md)

---

## 1. Concepts — configuration surfaces

| Surface | What you set |
|---------|----------------|
| `bitbucket-pipelines.yml` | `image`, `clone`, `definitions`, `pipelines`, `options`, optional `export` |
| Pipeline kinds | `default`, `branches`, `pull-requests`, `tags`, `custom` (+ schedules in UI/API) |
| Step | `script`, `pipe`, `caches`, `artifacts`, `services`, `deployment`, `trigger`, `runs-on`, `size` |
| Stage / parallel | Grouping and concurrency |
| Reuse | YAML anchors; pipes; `definitions.pipelines` + `import` (Premium sharing) |
| Agents (beta) | `definitions.agents` + `agent:` in a step |
| Workspace / repo / deployment variables | Secrets and config |
| Branch permissions / merge checks | Forge workflow control |
| Runners | Labels and registration |

Exact keys: [configuration reference](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/) for your features/plan.

---

## 2. Advanced concepts — good defaults

| Env | Lean toward |
|-----|-------------|
| Lab | Hosted; unsecured test vars OK if non-prod |
| Staging | Auto deploy on `main`; OIDC |
| Prod | Manual step; deployment permissions; pinned pipes |

---

## 3. Applications and use cases

PR checklist: every non-default YAML block needs a one-line reason.

---

## References

- [Configuration reference](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/)  
- [Variables and secrets](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/)  
