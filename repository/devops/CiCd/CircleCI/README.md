# CircleCI

[← Back to CI/CD](../README.md)

Hosted CI/CD with **orbs** (reusable packages), workflows, and cloud or self-hosted runners.

Concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md).

---

## Core model

| Concept | Meaning |
|---------|---------|
| **Config** | `.circleci/config.yml` (or dynamic config) |
| **Job** | Steps in an executor (Docker, machine, macOS, …) |
| **Workflow** | Orchestrates jobs (fan-out, approval jobs) |
| **Orb** | Versioned reusable config (official/partner/community) |
| **Context** | Shared secrets across projects |

---

## Illustrative snippet

```yaml
version: 2.1
jobs:
  test:
    docker: [{ image: "cimg/node:22.11" }]
    steps:
      - checkout
      - run: npm test
workflows:
  build:
    jobs: [test]
```

Pin orb and image versions. Use contexts carefully (who can access production secrets).

---

## First use (outline)

1. Connect the GitHub/GitLab repo to CircleCI.  
2. Add `.circleci/config.yml` with a test job.  
3. Enable required status checks on the VCS side.  
4. Add deploy workflow with manual approval job for production if practicing Continuous Delivery.  

Docs: [CircleCI docs](https://circleci.com/docs/).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Unpinned orbs | Version pins + review orb source |
| One context for all envs | Separate prod context + restricted teams |

## Further reading

- [CircleCI configuration reference](https://circleci.com/docs/configuration-reference/)  
- [Orbs](https://circleci.com/docs/orbs/)  
