# GitLab CI

[← Back to CI/CD](../README.md)

Pipelines defined in **`.gitlab-ci.yml`**, deeply integrated with GitLab SCM, Merge Requests, environments, and (optionally) GitLab Agent / Auto DevOps features.

Concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md).

---

## Core model

| Concept | Meaning |
|---------|---------|
| **Pipeline** | Directed graph of jobs for a pipeline run |
| **Stage** | Ordered groups (`build`, `test`, `deploy`, …) |
| **Job** | Script (+ image, rules, needs) |
| **Runner** | Shared SaaS or self-managed executors |
| **CI/CD variables** | Project/group/instance; masked/protected |
| **Environments** | Deploy targets with history |

`rules:` / `workflow:rules` control when jobs run (branches, changes, MR pipelines).

---

## Illustrative snippet

```yaml
stages: [test, build]
unit:
  stage: test
  image: node:22
  script: ["npm ci", "npm test"]
image:
  stage: build
  script: ["docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA ."]
```

Prefer **needs:** for DAG speed over purely serial stages when jobs are independent.

---

## First use (outline)

1. Ensure a Runner is available (shared or install gitlab-runner).  
2. Commit `.gitlab-ci.yml` with a test job on MRs.  
3. Enable merge checks requiring pipeline success.  
4. Add deploy jobs to protected environments; use OIDC/cloud IAM where supported.  

Docs: [GitLab CI/CD](https://docs.gitlab.com/ee/ci/).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Unprotected variables on unprotected branches | Protected variables + protected branches |
| Monorepo runs everything always | `rules:changes` or affected tooling ([14](../14_Monorepo_And_Multi_Repo_CI.md)) |

## Further reading

- [GitLab CI/CD YAML reference](https://docs.gitlab.com/ee/ci/yaml/)  
- [CI/CD best practices](https://docs.gitlab.com/ee/ci/pipelines/pipeline_efficiency.html)  
