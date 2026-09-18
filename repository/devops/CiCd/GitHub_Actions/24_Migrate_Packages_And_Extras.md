# 24 — Migrate, packages, and extras

[← Previous](./23_Troubleshooting_And_Staff_Checklist.md) · [README](./README.md)

## 1. Concepts

### Migration

**GitHub Actions Importer** helps automate migrations from Jenkins, CircleCI, GitLab, Azure DevOps, Travis, Bitbucket, Bamboo, and more. Manual migration guides also exist. Treat Importer as an **accelerator** — review generated YAML; don’t merge blind. Custom transformers extend mappings when your old CI is weird.

### Packages & containers

Tutorials cover publishing Docker/npm/Maven/Gradle packages and using **service containers** (Postgres, Redis) beside jobs. Pattern: build → authenticate (OIDC/token) → publish → consume by digest.

### Admin extras

Org/enterprise Actions policies, metrics views, making retired namespaces available on GHE.com, Support boundaries for ARC — platform admin reading.

### Agentic workflows

Docs describe turning Markdown instructions into automations powered by coding agents. Optional literacy for assisted delivery; not required for core CI/CD competence. Keep the same gates (permissions, environments, promote-by-digest).

## 2. Advanced concepts

Cross-host automation patterns (cron, promote, reusable templates) stay in [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md). This chapter is GitHub-specific leftovers that did not need a full chapter each:

| Extra | Note |
|-------|------|
| Creating JS/Docker/composite actions | When you maintain platform actions ([11](./11_Actions_Marketplace_And_Pinning.md)) |
| Immutable releases for actions | Stronger tag posture for publishers |
| Issue automation samples | Patterns only — don’t grow a bot farm without owners |
| Self-hosted → hosted migration guide | When constraints fade |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Leave Jenkins/CircleCI/… | Importer + parallel runs + cutover |
| Integration tests | `services:` containers |
| Publish library | packages tutorials + attestations literacy |
| Assisted chores | Agentic workflows behind the same policy gates |

**Good:** migration PRs reviewed like product code. **Bad:** bulk-import 500 jobs unowned.

**Upstream-only:** every per-language and per-cloud tutorial page; full Importer argument reference.

## References

- [Migrating to GitHub Actions](https://docs.github.com/en/actions/tutorials/migrate-to-github-actions)  
- [Automating migration with GitHub Actions Importer](https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/use-github-actions-importer)  
- [GitHub Actions Importer reference](https://docs.github.com/en/actions/reference/github-actions-importer)  
- [Publishing packages](https://docs.github.com/en/actions/tutorials/publish-packages)  
- [Service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services)  
- [Develop agentic workflows](https://docs.github.com/en/actions/tutorials/develop-agentic-workflows-in-github-actions)  
