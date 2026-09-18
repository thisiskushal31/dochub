# Config, secrets, and environment parity

[← Back to CI/CD](./README.md)

Continuous Delivery requires **one artifact, many deploys**. That only works if **config and secrets are not baked into the build**.

Related: [4](./4_Artifacts_And_Registries.md), [8](./8_Environments_Promotion_And_Approvals.md), [Security/1](../Security/1_Security_Practices_And_Secrets.md), [Security/Vault](../Security/Vault/README.md).

## Separate code, config, and secrets

| Layer | Varies by env? | Where it lives |
|-------|----------------|----------------|
| **Code / artifact** | No (same digest) | Registry |
| **Config** | Yes (URLs, feature defaults, non-secret tunables) | Env vars, config maps, parameter store — injected at deploy/runtime |
| **Secrets** | Yes | Secret manager / sealed mechanism — never image layers or git |

[Twelve-Factor config](https://12factor.net/config): store config in **environment variables** as granular controls (not giant “environment class” blobs that explode as you add deploys).

MinimumCD anti-pattern: **configuration embedded in artifacts** forces rebuild-per-env and breaks “test what you ship.”

## Inject at deploy / runtime

```text
image@sha256:abc  +  staging env/secrets  →  staging process
image@sha256:abc  +  prod env/secrets     →  prod process
```

Mechanisms (examples): Kubernetes ConfigMap/Secret or external secret operators, cloud parameter stores, Vault agent/sidecar, platform “environment” variables in CI deploy jobs.

## Secrets in CI vs secrets at runtime

| Use | Practice |
|-----|----------|
| **CI needs** (registry push, cloud deploy) | Short-lived OIDC / workload identity ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)) |
| **App runtime** | App fetches from secret store or platform mounts — CI should not print them |
| **Git** | Scan for accidental commits ([Security/Gitleaks](../Security/Gitleaks/README.md)) |

Never `echo` secrets in logs. Never bake prod credentials into Docker layers “for convenience.”

## Environment parity

[Twelve-Factor dev/prod parity](https://12factor.net/dev-prod-parity): shrink gaps in time, personnel, and tooling. Especially: **same type/version of backing services** (Postgres, Redis, queue) across deploys where feasible — adapters hide differences poorly under Continuous Delivery.

Local parity helpers: containers / compose — door to [Containerization Local-Dev](https://github.com/thisiskushal31/Containerization-Deep-Dive).

## Config that *is* in Git (GitOps)

Desired-state repos often hold non-secret config (replicas, public URLs, resource requests). Keep secrets out of plain Git; use sealed secrets / external secrets / SOPS-style encryption with clear key management.

GitOps CD: [Argo_CD/](./Argo_CD/README.md), [Flux/](./Flux/README.md).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| `prod.properties` copied into the image at build | Inject at deploy |
| One `.env` committed with prod values | Secret manager + scanning |
| Staging uses SQLite, prod uses Postgres | Align backing services |
| CI job has cluster-admin forever | OIDC + least privilege per environment |

## Next

- Promote path: [8](./8_Environments_Promotion_And_Approvals.md)  
- Pipeline security: [15](./15_Pipeline_Security_And_Gates.md)

## Further reading

- [Twelve-Factor — Config](https://12factor.net/config)  
- [Twelve-Factor — Dev/prod parity](https://12factor.net/dev-prod-parity)  
- [MinimumCD — Config embedded in artifacts (anti-pattern)](https://beyond.minimumcd.org/docs/anti-patterns/pipeline/config-embedded-in-artifacts/)  
