# Compose and Swarm as delivery targets

[← Back to CI/CD](./README.md)

Before (or beside) Kubernetes, many teams deliver with **Docker Compose** (single host / small stacks) and **Docker Swarm** (multi-node services, rolling updates). Classical DevOps courses (LinuxWorld and similar) teach these heavily. Depth of engines: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive). This file is the **CI/CD adapter**.

## Where they sit on the spectrum

```text
VM + package/systemd     →  [18], [20]
Compose (declare stack)  →  this chapter
Swarm (orchestrate)      →  this chapter
Kubernetes + GitOps      →  [9], Argo/Flux
```

Same pipeline loop ([1](./1_Pipelines_Build_Test_Deploy.md)): build image → push digest → update stack definition → roll → verify.

## Docker Compose (delivery view)

| Job | Practice |
|-----|----------|
| **Define** | `compose.yaml` services, networks, volumes, env files |
| **Build in CI** | Prefer pre-built images by **digest**; Compose `build:` in prod is a smell |
| **Config** | Env files / secrets mounts — not baking secrets into images ([13](./13_Config_Secrets_And_Env_Parity.md)) |
| **Deploy** | `docker compose pull && docker compose up -d` on the host (from CI over SSH or a pull agent) |
| **Verify** | Healthchecks in Compose + curl smoke ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)) |
| **Multi-tier labs** | Web + MySQL/MariaDB + reverse proxy — common classical project shape |

**Startup order:** `depends_on` waits for start, not readiness — use healthchecks. Named volumes for DB data; backups are still your problem.

## Docker Swarm (delivery view)

| Capability | Delivery use |
|------------|----------------|
| **Services** | Desired replicas of an image |
| **Rolling update** | Swarm updates tasks gradually (`update_config` parallelism/delay) |
| **Networks** | Overlay for multi-node |
| **Secrets / configs** | Swarm-managed secrets (better than env in git) |
| **Stacks** | `docker stack deploy -c compose.yml` |

CI publishes `registry/app@sha256:…`, updates the stack file or service image, Swarm rolls tasks. Rollback = previous image digest / `docker service rollback` patterns per current Docker docs.

Swarm is **not** dead for every org; treat it as a real adapter until you migrate. Do not skip it in an open handbook that claims classical coverage.

## Pipeline sketch

```text
CI:
  test → build image → push digest → (optional) sign [6]
CD:
  SSH/Ansible/CI runner on manager:
    update image ref to digest
    docker stack deploy / service update
  smoke against published port / LB
```

Prefer **immutable digests** over `:latest` ([4](./4_Artifacts_And_Registries.md)).

## Content trust / signing (classical Docker)

Older curricula emphasize **Docker Content Trust** (Notary) and registry signing. Modern related path is Sigstore/cosign ([6](./6_Supply_Chain_And_Signing.md)). Mentally map: **sign what you push; verify what you run** — mechanism names change.

## When to choose what

| Situation | Lean toward |
|-----------|-------------|
| One box, few services, learning multi-tier | Compose |
| Small multi-node without K8s ops budget | Swarm |
| Large platform, CRDs, progressive delivery controllers | Kubernetes ([9](./9_Progressive_Delivery_Controllers.md)) |

## Pitfalls

| Pitfall | Better |
|---------|--------|
| `latest` in production Compose | Digest pins |
| Compose build on the prod host | Build in CI; pull only |
| No healthchecks | Fail deploy on unhealthy |
| Ignoring Swarm/Compose because “only K8s is real” | Teach both; migrate deliberately |

## Next

- Host/Jenkins classical: [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md)  
- K8s progressive: [9](./9_Progressive_Delivery_Controllers.md)  
- Engine depth: Containerization Deep Dive  

## Further reading

- [Docker Compose](https://docs.docker.com/compose/)  
- [Docker Swarm rolling updates](https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/)  
