# 18 — CircleCI Server, CLI, API, and toolkit

[← Previous](./17_Insights_Test_Splitting_And_Optimize.md) · [README](./README.md) · [Next: Worked example →](./19_Worked_Example_Build_And_Deploy.md)

## 1. Concepts

### CircleCI Server

Self-managed CircleCI (versioned admin docs: 4.7–4.10 in the docs tree). You operate control plane components (often on Kubernetes), including air-gapped install paths. Same config ideas; orb registries, networking, and ops differ from Cloud.

Use Server when policy requires on-prem control plane — otherwise prefer Cloud.

### CLI

Validate and process config locally (`circleci config validate` / `process`), interact with orbs, split tests, and more. Install from current toolkit docs.

### API

REST API v2 for pipelines, projects, contexts, etc. Automate org bootstrap; store tokens outside Git.

### Toolkit

VS Code extension, config editor, webhooks — improve authoring and integration without replacing Git as source of truth.

## 2. Advanced concepts

Server operator guides cover installation, upgrades, and air gap. Pin the Server version docs you actually run — APIs and features drift across 4.x.

Outbound webhooks notify your systems of pipeline events ([24](./24_Integrations_Migrate_Plans_And_Extras.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Local PR check | CLI validate/process |
| Fleet of projects | API/Terraform-style automation |
| Air-gapped enterprise | Server air-gapped install |

**Good:** token inventory with owners. **Bad:** personal API tokens in shared runners.

## References

- [API](https://circleci.com/docs/api/v2/)  
- [Toolkit / CLI guides](https://circleci.com/docs/guides/toolkit/)  
- [Server admin (current)](https://circleci.com/docs/server/)  
