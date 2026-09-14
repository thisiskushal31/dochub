# 22 — Worked example: CI, build, and promote

[← Previous](./21_API_Webhooks_And_Integrations.md) · [README](./README.md) · [Next: Best practices →](./23_Best_Practices_And_When_Not_GitLab.md)

---

## 1. Concepts — lab goal

On a real GitLab project (personal namespace or group sandbox):

1. Add `.gitlab-ci.yml` with a test job on MRs; ensure a runner picks it up.  
2. Require pipeline success to merge.  
3. Add build job on default branch: build image → push to GitLab container registry → pass **digest** (as dotenv artifact or similar).  
4. Add manual/protected `environment: production` job that deploys **that digest** (or opens a GitOps MR).  
5. Prefer **ID tokens** for cloud deploys if leaving GitLab’s registry.  
6. Optional: move test/build into a **component** and `include:` it pinned.

Do not skip the digest.

---

## 2. Advanced — stretch

| Stretch | Chapter |
|---------|---------|
| `rules:changes` monorepo | [08](./08_Rules_Workflow_And_Pipeline_Types.md) |
| `needs` DAG | [09](./09_Needs_DAG_And_Downstream_Pipelines.md) |
| Cache + artifacts | [12](./12_Caching_Artifacts_And_Job_Tokens.md) |
| Components/Catalog | [13](./13_Includes_Components_And_CI_Catalog.md) |
| SAST/secret detection include | [17](./17_Security_Scanning_And_Compliance_Literacy.md) |
| Agent / Flux handoff | [18](./18_Agent_Auto_DevOps_And_Infrastructure.md) |

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| CI | Green MR pipeline |
| Build | Image in registry by digest |
| Promote | Prod points at that digest |
| Reuse | Project YAML calls pinned component |

**Good:** lab becomes the team template. **Bad:** only green test with `:latest` in prod.

---

## References

- [CI/CD quick start](https://docs.gitlab.com/ci/quick_start/)  
- [Tutorial: Create a complex pipeline](https://docs.gitlab.com/ci/quick_start/tutorial/)  
- [Container registry](https://docs.gitlab.com/user/packages/container_registry/)  
