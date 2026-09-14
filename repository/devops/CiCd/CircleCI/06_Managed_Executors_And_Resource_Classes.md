# 06 — Managed executors and resource classes

[← Previous](./05_Templates_And_First_Config_Yml.md) · [README](./README.md) · [Next: Runners →](./07_Self_Hosted_Runners.md)

---

## 1. Concepts

An **executor** is where a job’s steps run. On CircleCI Cloud, common managed options:

| Executor | Typical use |
|----------|-------------|
| **Docker** | Default Linux containers (`docker:` + image) |
| **Machine** | Full Linux VM (Docker-in-Docker, privileged needs) |
| **macOS** | Xcode / iOS / macOS builds |
| **Windows** | .NET / Windows tooling |

```yaml
jobs:
  unit:
    docker:
      - image: cimg/node:22.11
    resource_class: medium
    steps:
      - checkout
      - run: npm test
```

**resource_class** selects CPU/RAM (and availability) for that executor family. Classes and pricing/plan availability change — confirm current tables in docs.

---

## 2. Advanced concepts

### Docker extras

- Multiple images → primary + service containers (DBs).  
- **Remote Docker** / machine when you need to build images.  
- Private images need registry auth (OIDC to ECR/GAR preferred — [13](./13_OIDC_And_Cloud_Federation.md)).  

### Specialized managed compute

| Need | Docs angle |
|------|------------|
| **ARM** Linux VMs | Arm VM execution / resource classes |
| **CUDA / GPU** | Linux CUDA images; Windows GPU executor where offered |
| **iOS** | macOS executor + codesigning guides |
| **Android** | Android machine images / support policy |

Confirm current image names and resource classes in execution-managed docs — they rotate under support policies.

### SSH into jobs

Debug by SSHing into a job environment when enabled — revoke access habits like bastions.

### Self-hosted instead

If you need VPC residency or custom hardware → runners ([07](./07_Self_Hosted_Runners.md)).

---

## 3. Applications and use cases

| Need | Choice |
|------|--------|
| Standard Node/Java CI | Docker + `cimg` |
| `docker build` | Machine or remote Docker patterns |
| iOS | macOS executor |
| Private build farm | Runner |

**Good:** smallest resource_class that is stable. **Bad:** largest class “just in case” on every job.

---

## References

- [Executor introduction](https://circleci.com/docs/guides/execution-managed/executor-intro/)  
- [Using Docker](https://circleci.com/docs/guides/execution-managed/using-docker/)  
- [Resource class overview](https://circleci.com/docs/guides/execution-managed/resource-class-overview/)  
- [Building Docker images](https://circleci.com/docs/guides/execution-managed/building-docker-images/)  
- [Using ARM](https://circleci.com/docs/guides/execution-managed/using-arm/)  
- [Using GPU](https://circleci.com/docs/guides/execution-managed/using-gpu/)  
- [iOS codesigning](https://circleci.com/docs/guides/execution-managed/ios-codesigning/)  
