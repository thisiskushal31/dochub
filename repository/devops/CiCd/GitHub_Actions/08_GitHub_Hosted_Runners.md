# 08 — GitHub-hosted runners

[← Previous](./07_Contexts_Expressions_And_Variables.md) · [README](./README.md) · [Next: Self-hosted →](./09_Self_Hosted_Runners_And_Groups.md)

## 1. Concepts

**GitHub-hosted runners** are VMs GitHub provisions per job (`runs-on: ubuntu-latest`, `windows-latest`, `macos-latest`, …). Default low-ops path: ephemeral, patched by GitHub, billed by minutes (plan limits apply).

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```

Labels and image versions change — confirm the [hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).

### Job containers

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container: node:22
    steps: […]
```

Steps run inside the container on the hosted VM — useful for pinned toolchains. Pair with `services:` for Postgres/Redis ([24](./24_Migrate_Packages_And_Extras.md)).

## 2. Advanced concepts

### Larger runners

Plan-gated runners with more CPU/RAM, optional **custom images**, higher concurrency ceilings, and networking features. Access is usually via **runner groups** and labels. Specs and billing differ from standard hosted — confirm [larger runners](https://docs.github.com/en/actions/concepts/runners/larger-runners).

### Private networking

Hosted jobs sometimes must reach private package registries or APIs. Documented patterns include:

| Pattern | Idea |
|---------|------|
| API gateway + OIDC | Runner presents OIDC; gateway authorizes into private net |
| WireGuard overlay | Overlay between runner and private service |
| Azure VNet injection (larger) | Runner attaches into your VNet (buffer subnet IPs for concurrency) |

Literacy here; cloud-specific how-tos stay upstream.

### Customization & concurrency

You can install extra software in the job, but heavy golden images push teams to larger custom images, containers, or self-hosted. Hosted jobs have a **6 hour** execution limit. Concurrent job caps depend on plan and runner class (including separate macOS / GPU caps on larger) — see [limits](https://docs.github.com/en/actions/reference/limits).

### Docker Hub pulls

Public pulls on GitHub-hosted runners are treated specially vs self-hosted (self-hosted always counts against Docker Hub rate limits). Private Hub pulls still rate-limit.

## 3. Applications and use cases

| Need | Choice |
|------|--------|
| Standard CI | `ubuntu-latest` |
| Xcode / Apple | macOS hosted (budget consciously) |
| Heavy compile | Larger runners or self-hosted |
| Private package registry | Private networking pattern or self-hosted |

**Good:** smallest stable runner. **Bad:** macOS for jobs that do not need Apple toolchains.

## References

- [GitHub-hosted runners](https://docs.github.com/en/actions/concepts/runners/github-hosted-runners)  
- [Larger runners](https://docs.github.com/en/actions/concepts/runners/larger-runners)  
- [Private networking](https://docs.github.com/en/actions/concepts/runners/private-networking)  
- [Running jobs in a container](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container)  
- [Actions limits](https://docs.github.com/en/actions/reference/limits)  
