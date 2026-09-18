# 11 — Images, services, and Docker build

[← Previous](./10_Runners_And_Executors.md) · [README](./README.md) · [Next: Cache and artifacts →](./12_Caching_Artifacts_And_Job_Tokens.md)

## 1. Concepts

```yaml
test:
  image: python:3.12
  services:
    - postgres:16
  variables:
    POSTGRES_DB: app
  script:
    - pytest
```

| Keyword | Role |
|---------|------|
| `image` | Container (or environment) for the job |
| `services` | Linked service containers (DB, Docker daemon, …) |

### Building container images

| Pattern | Trade-off |
|---------|-----------|
| **Docker-in-Docker** (`docker:dind`) | Familiar; often needs privileged runners |
| **Kaniko** | Daemonless builds in containers/K8s-friendly |
| **Buildah** (incl. rootless / multi-arch) | Strong rootless story; follow runner/operator guides |
| BuildKit / other | Team standard — pin and document |

Prefer authenticating to the **GitLab container registry** with job token / deploy token patterns documented upstream. **GitLab↔Google Cloud** integration docs cover GCP-specific auth/deploy helpers — same OIDC/ID-token design as [14](./14_Variables_Secrets_And_OIDC.md); cookbook steps stay upstream.

## 2. Advanced concepts

### DinD realities

| Topic | Note |
|-------|------|
| TLS / DOCKER_HOST | Misconfig → “cannot connect to docker daemon” |
| Layer caching | Inline/registry cache strategies |
| Privileged mode | Security trade-off on shared runners |

### Registry auth

`docker login`, `DOCKER_AUTH_CONFIG`, and CI job token access to project registry — follow current authenticate-registry docs.

### Mobile / special build

Mobile DevOps and Xcode-like flows exist as specialized docs — literacy pointer only.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Unit tests + DB | `services: postgres` |
| Publish image | Build → push `$CI_REGISTRY_IMAGE@$digest` |
| Stricter runners | Rootless Buildah / Kaniko vs privileged DinD |

**Good:** pin base image digests for builds you care about. **Bad:** privileged DinD on a runner pool that also runs untrusted community MRs.

## References

- [YAML `image`](https://docs.gitlab.com/ci/yaml/#image)  
- [Services](https://docs.gitlab.com/ci/services/)  
- [Docker-in-Docker](https://docs.gitlab.com/ci/docker/using_docker_build/)  
- [Authenticate with registry](https://docs.gitlab.com/ci/docker/authenticate_registry/)  
