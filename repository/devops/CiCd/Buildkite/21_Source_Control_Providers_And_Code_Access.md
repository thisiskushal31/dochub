# 21 — Source control providers and code access

[← Previous](./20_Troubleshooting_And_Staff_Checklist.md) · [README](./README.md) · [Next: Agent hooks →](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md)

## 1. Concepts

Buildkite does **not** host your Git forge. It **connects** to providers so repository events create builds and so agents can clone code.

| Provider | Docs home |
|----------|-----------|
| GitHub | Full-access / limited App installs; webhooks; status checks |
| GitHub Enterprise | Self-managed GitHub |
| GitLab | Cloud / self-managed patterns per docs |
| Bitbucket Cloud | Remote URL / provider connection |
| Bitbucket Server / Data Center | Self-managed Bitbucket |
| Origin | Buildkite Origin mirroring / access path |
| Phabricator | Legacy/brownfield |
| Other Git | Generic Git server |

Connect from **Repository Providers** / **Git scope** on New Pipeline ([03](./03_Create_Pipeline_Connect_Git_And_View_Builds.md)).

### Private clone credentials

| Situation | Typical approach |
|-----------|------------------|
| Hosted agents + full-access GitHub/Origin | Provider connection includes code access |
| Self-hosted / limited GitHub / other providers | **SSH key in Buildkite secrets** (recommended in docs) |
| Self-hosted | SSH keys on the agent machine |
| GitHub App | Short-lived installation token via `pre-checkout` hook |

## 2. Advanced concepts

- Separate **trigger** credentials (webhooks) from **clone** credentials (agent checkout).  
- Fork/PR builds: assume untrusted code — isolate agents and secrets ([10](./10_Secrets_Environment_And_OIDC.md)).  
- GitHub Merge Queue / Actions-from-Buildkite tutorials exist for migration estates — use when that is your workflow, not by default.

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| GitHub.com SaaS | GitHub App + hosted or self-hosted agents |
| GitLab self-managed | Provider connection + SSH/secrets for clone |
| Multi-forge company | One Buildkite org; multiple repository providers |

**Good:** documented clone path per agent type. **Bad:** long-lived PATs in pipeline YAML.

## References

- [Source control](https://buildkite.com/docs/pipelines/source-control)  
- [GitHub](https://buildkite.com/docs/pipelines/source-control/github)  
- [Self-hosted code access](https://buildkite.com/docs/agent/self-hosted/code-access)  
- [Hosted agent code access](https://buildkite.com/docs/agent/buildkite-hosted/code-access)  
