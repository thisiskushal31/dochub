# Pipeline as code, runners, caching, and matrix builds

[← Back to CI/CD](./README.md)

How CI **executes** work: definitions in Git, where jobs run, how you stay fast without lying about freshness.

Tool-specific syntax: folders under [2](./2_CI_CD_Tools.md).

## Pipeline as code

Store workflow definitions in the repo (`Jenkinsfile`, `.github/workflows/*.yml`, `.gitlab-ci.yml`, Tekton YAML, Buildkite pipelines, …).

| Benefit | Why it matters |
|---------|----------------|
| Review | Pipeline changes go through PR like app code |
| Branch fidelity | Feature branches can change CI safely |
| Audit | History of who changed release machinery |
| Reuse | Shared templates/actions/orbs/libraries |

Anti-pattern: only clicking a GUI job that nobody can recreate after a year.

## Runners and agents

| Model | Meaning |
|-------|---------|
| **Hosted runners** | Vendor VMs/containers (GitHub-hosted, GitLab shared, …) |
| **Self-hosted / agents** | Your machines/K8s pods (Jenkins agents, Buildkite agents, Actions self-hosted, Tekton on cluster) |

Choose self-hosted when you need private network access, GPUs, stricter data boundaries, or custom tooling. Harden them: ephemeral where possible, least privilege, patch cadence — compromised runners equal compromised supply chain ([15](./15_Pipeline_Security_And_Gates.md), [6](./6_Supply_Chain_And_Signing.md)).

## Caching

| Cache type | Example | Caution |
|------------|---------|---------|
| **Dependency cache** | `node_modules`, Maven `.m2`, Go module cache | Key on lockfile hash |
| **Build/task cache** | Compiler outputs, monorepo task hash caches | Must invalidate on input change |
| **Docker layer cache** | Faster image builds | Don’t cache secrets into layers |
| **Remote cache** | Shared across agents/PRs (e.g. monorepo remote caches) | Trust and isolation matter |

Caching that serves **stale** wrong artifacts is worse than a slow clean build. Prefer correctness keys over maximum hit rate.

## Matrix / parallel builds

Run the same job across dimensions: OS, language version, browser, architecture.

```text
test × (node 20, 22) × (ubuntu, macos)  → parallel jobs → join gate
```

Keeps the commit stage honest across supported platforms without serial hours.

## Fan-out / fan-in

```text
          ┌─ lint
commit ───┼─ unit (matrix)
          └─ SCA
                │
                ▼
            build artifact → deploy jobs
```

Fail fast on cheap jobs; don’t wait for e2e to learn the linter failed.

## Monorepo note

Large repos need **path filters** or **project-graph affected** runs so you don’t rebuild the world every PR — see [14](./14_Monorepo_And_Multi_Repo_CI.md).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Mutable “latest” runner images with mystery software | Pin runner images / tool versions |
| Long-lived privileged self-hosted runners | Ephemeral, scoped tokens, network egress control |
| Cache key = branch name only | Include lockfile + relevant file hashes |
| One 2-hour job | Split and parallelize |

## Next

- Monorepos: [14](./14_Monorepo_And_Multi_Repo_CI.md)  
- Security of CI identity: [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)

## Further reading

- Your CI vendor docs: caching, matrix, self-hosted runners  
- [Nx — monorepo CI / affected](https://nx.dev/docs/features/ci-features/affected) (pattern illustration for graph-aware CI)  
