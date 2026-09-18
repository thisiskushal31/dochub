# 01 — What is CircleCI

[← README](./README.md) · [Next: Org & project →](./02_Organization_Project_And_VCS.md)

## 1. Concepts

If you are new to delivery tools: **CI/CD** means integrating code often with automated build/test, and delivering reliably to environments ([CiCd/1](../1_Pipelines_Build_Test_Deploy.md)). **CircleCI** runs that automation when you push to a connected Git repository.

Mental model:

```text
Code in GitHub / GitLab / Bitbucket / …
  → CircleCI project + .circleci/config.yml
  → pipeline run → workflows → jobs (on executors or runners)
  → optional deploy
```

### Cloud vs Server

| | **CircleCI Cloud** | **CircleCI Server** |
|--|--------------------|---------------------|
| Host | CircleCI SaaS (`app.circleci.com`) | You operate (often Kubernetes) |
| This track | **Primary** | Brownfield literacy ([18](./18_Server_CLI_API_And_Toolkit.md)) |

### Product surface

| Area | What you get |
|------|----------------|
| **Projects / pipelines** | Connect repo; run configs; view history |
| **config.yml** | Jobs, workflows, executors, orbs (`version: 2.1`) |
| **Managed executors** | Docker, Linux VM (machine), macOS, Windows, GPU where offered |
| **Self-hosted runners** | Machine runner and container runner in your infra |
| **Orbs** | Versioned reusable config packages |
| **Contexts** | Org-scoped shared secrets |
| **OIDC** | Short-lived tokens for cloud providers |
| **Dynamic config** | Generate/continue pipelines at runtime |
| **Deploy / markers** | Deploy jobs, approval holds, deploy tracking |
| **Insights / test** | Pipeline and test analytics; test splitting |
| **Security / SSO / policies** | IP ranges, roles, config policies (plan-gated) |
| **CLI / API** | Local validate/process; automate org resources |

Plan tiers change **concurrency**, resource classes, and admin features — confirm on CircleCI’s pricing/docs; this handbook names **capabilities**, not a price list.

### When teams choose CircleCI

| Fit | Why |
|-----|-----|
| Want hosted executors + YAML in Git | Fast path without owning agents |
| Orbs for common cloud deploys | Registry of reusable packages |
| Mix of cloud + private runners | Hybrid compute |

### When not to force it

| Situation | Prefer |
|-----------|--------|
| Forge-native CI is enough | [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), … |
| Agent-centric hybrid is the requirement | [Buildkite/](../Buildkite/README.md) |
| Fully self-managed classical CI | [Jenkins/](../Jenkins/README.md) |

## 2. Advanced concepts

**Concurrency** = many jobs at once (plan limits on some tiers). **Parallelism** = split one job’s tests across containers. Don’t confuse them when debugging queueing.

Open-source and forked PR settings change secret/OIDC behavior — treat forks as untrusted by default ([13](./13_OIDC_And_Cloud_Federation.md)).

## 3. Applications and use cases

| Role | How CircleCI shows up |
|------|------------------------|
| App engineer | Push → pipeline UI → job logs |
| Platform | Orgs, contexts, runners, policies |
| Security | Contexts, OIDC, IP ranges, SSO |
| SE learning delivery | Config-as-code CI mapped to the universal loop |

**Good:** pinned images/orbs; contexts least-privileged. **Bad:** unpinned `@volatile` orbs on production deploy.

## References

- [CircleCI overview](https://circleci.com/docs/guides/about-circleci/about-circleci/)  
- [Concepts](https://circleci.com/docs/guides/about-circleci/concepts/)  
- [Docs home](https://circleci.com/docs/)  
