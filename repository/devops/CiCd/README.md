# CI/CD

Pipelines, tools, practices, and deployment strategies. **Each tool has its own folder**; add new tools as new folders. *Stub scaffold August 2026 — [write order](../CONTENT_WRITE_ORDER.md).*

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Pipelines: build, test, deploy](./1_Pipelines_Build_Test_Deploy.md) | expand — full delivery loop narrative |
| 2 | [CI/CD tools index](./2_CI_CD_Tools.md) | expand — Azure DevOps, Buildkite entries |
| 3 | [Deployment strategies](./3_Deployment_Strategies.md) | expand — blue-green, canary, flags |
| 4 | [**Artifacts and registries**](./4_Artifacts_And_Registries.md) | stub |
| 5 | [**Verify, rollback, synthetic tests**](./5_Verify_Rollback_And_Synthetic_Tests.md) | stub |
| 6 | [**Supply chain: SBOM and signing**](./6_Supply_Chain_And_Signing.md) | stub |
| 7 | [**Database migrations in pipelines**](./7_DB_Migrations_In_Pipelines.md) | stub |

## End-to-end delivery loop (write in topic 1 + cross-link 4–7)

```text
PR → build → test → security gates → publish artifact → deploy → verify → promote → observe → notify
```

See [Security/4_Security_Gate_Chain.md](../Security/4_Security_Gate_Chain.md) for gate detail.

## Tools (one folder per tool)

| Tool | Description |
|------|-------------|
| [**Jenkins**](./Jenkins/README.md) | expand |
| [**GitHub Actions**](./GitHub_Actions/README.md) | expand |
| [**GitLab CI**](./GitLab_CI/README.md) | expand |
| [**CircleCI**](./CircleCI/README.md) | expand |
| [**Tekton**](./Tekton/README.md) | expand |
| [**Argo CD**](./Argo_CD/README.md) | expand |
| [**Flux**](./Flux/README.md) | expand |

## Scope

- **Covered here:** Pipeline concepts and tooling from a DevOps perspective.
- **Go deeper:** [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) for K8s/GitOps depth.
