# Monorepo and multi-repo CI

[← Back to CI/CD](./README.md)

Repo layout changes how you **select what to build/test/deploy**. Wrong selection wastes hours or ships the wrong service.

Runners/caching basics: [11](./11_Pipeline_As_Code_Runners_Caching_Matrix.md).

## Two layouts

| Layout | CI challenge |
|--------|--------------|
| **Multi-repo** | Many pipelines; version skew; cross-repo contract tests; “who releases the platform?” |
| **Monorepo** | One clone; risk of rebuilding *everything* every PR; need affected-project selection |

Neither is universally “more DevOps.” Delivery still needs small batches, fast feedback, and clear ownership ([Methodologies/16](../Methodologies/16_Roles_Teams_And_Platforms.md)).

## Path filters (simple monorepo)

CI vendors support path conditions (e.g. GitHub Actions `paths`, GitLab `rules:changes`):

```text
apps/api/** changed  → run api pipeline
apps/web/** changed  → run web pipeline
```

Works when packages don’t share deep dependency graphs. **Misses** transitive dependents (change a shared lib → consumers should rebuild).

## Project-graph “affected” (scale)

Tools such as **Nx** (and similar monorepo task runners) build a **project graph** from imports/config, diff the PR, and run tasks only on **affected** projects and dependents (`nx affected`).

Pair with:

- **Task/remote caching** so unchanged work is replayed  
- **Distributed agents** when affected set is still large  

Path filters alone drift; graph-aware selection tracks real dependencies (Nx docs: affected + CI best practices).

## Multi-repo coordination

| Need | Pattern |
|------|---------|
| Shared libraries | Versioned packages in a registry ([4](./4_Artifacts_And_Registries.md)) + Dependabot/Renovate |
| API compatibility | Consumer-driven contracts in CI ([10](./10_Testing_In_The_Pipeline.md)) |
| Atomic multi-service release | Release train ID, or GitOps umbrella commit, or carefully ordered promotes ([8](./8_Environments_Promotion_And_Approvals.md)) |

## What always stays true

- Build **immutable** artifacts per shippable unit  
- Don’t skip tests for “unrelated” packages if the graph says they depend on the change  
- Keep commit-stage feedback fast — monorepo is not an excuse for 2-hour mandatory walls  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Always `build all` | Affected / path + graph |
| Path filters only with shared libs | Graph-aware affected |
| Multi-repo with no contract tests | Contracts + versioned deps |
| One broken package blocks unrelated teams forever | Ownership + selective CI + good caching |

## Next

- Pipeline mechanics: [11](./11_Pipeline_As_Code_Runners_Caching_Matrix.md)  
- Testing map: [10](./10_Testing_In_The_Pipeline.md)

## Further reading

- [Nx — Run only tasks affected by a PR](https://nx.dev/docs/features/ci-features/affected)  
- [Nx — Monorepo CI best practices](https://nx.dev/docs/kb/monorepo-ci-best-practices)  
- Your CI vendor docs for `paths` / `rules:changes`  
