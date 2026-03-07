# CI/CD

Pipelines, tools, practices, and deployment strategies. **Each tool has its own folder**; add new tools as new folders. *Content is in placeholder form; will be expanded.*

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Pipelines: build, test, deploy](./1_Pipelines_Build_Test_Deploy.md) | Build, test, security scanning, artifact management |
| 2 | [CI/CD tools index](./2_CI_CD_Tools.md) | Index of tool folders and when to use which |
| 3 | [Deployment strategies](./3_Deployment_Strategies.md) | Blue-green, canary, rolling, feature flags, rollback |

## Tools (one folder per tool)

| Tool | Description |
|------|-------------|
| [**Jenkins**](./Jenkins/README.md) | Pipelines, Jenkinsfile, plugins |
| [**GitHub Actions**](./GitHub_Actions/README.md) | Workflows, jobs, runners on GitHub |
| [**GitLab CI**](./GitLab_CI/README.md) | Pipelines, .gitlab-ci.yml, runners |
| [**CircleCI**](./CircleCI/README.md) | Orbs, jobs, cloud/self-hosted CI |
| [**Tekton**](./Tekton/README.md) | Kubernetes-native pipelines |
| [**Argo CD**](./Argo_CD/README.md) | GitOps, continuous delivery for K8s |
| [**Flux**](./Flux/README.md) | GitOps for Kubernetes |

To add a new tool: create a folder and add it to the table above. Community-maintained.

## Scope

- **Covered here:** Pipeline concepts and tooling from a DevOps perspective. Orchestration depth in Containerization-Deep-Dive.
- **Go deeper:** [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) for K8s/GitOps depth.
