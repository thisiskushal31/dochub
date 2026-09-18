# 01 — What is GitLab

[← GitLab CI](./README.md) · [Next: Groups and projects →](./02_Groups_Projects_And_Namespaces.md)

## 1. Concepts

**GitLab** is a DevSecOps platform around one product surface: plan → create → verify (CI/CD) → secure → release → monitor → manage infrastructure. You can run it as:

| Offering | Plain meaning |
|----------|----------------|
| **GitLab.com** | SaaS operated by GitLab |
| **Self-Managed** | You install and operate (Linux package, Helm/Operator, Docker, …) |
| **Dedicated** | Single-tenant GitLab operated for you |

**CI/CD** is the Verify heart of this track: pipelines from `.gitlab-ci.yml`, executed by **runners**. The rest of GitLab still matters — MRs, protected branches, environments, registries, AppSec, Agent, Duo — because delivery on GitLab is rarely “CI alone.”

Tiers (Free / Premium / Ultimate and add-ons such as Duo) **gate features**. List the capability; confirm current tier tables in subscription docs — **do not invent prices or seat math**.

### When GitLab fits

| Situation | Fit |
|-----------|-----|
| Want SCM + MR + CI + registry + security in one product | Strong |
| Already standardized on GitHub/Bitbucket for code | Possible (external repo CI) but friction |
| Need self-managed / air-gapped forge | Self-Managed path |
| Only need a job runner with no GitLab product | Other CI may be simpler |

## 2. Advanced concepts

### DevSecOps lifecycle (product map)

Official get-started lanes: projects, planning, code, **CI/CD**, secure, deploy/release, infrastructure, **monitor** (metrics/logs/tracing/incidents — operations door), extend (API). This track deep-dives CI and keeps literacy chapters for the others ([24](./24_Feature_And_Offering_Coverage_Map.md)). Wiki/Pages/snippets are product features adjacent to SCM — named on the coverage map, not a second docs site.

### CI vs the whole platform

| Layer | Job |
|-------|-----|
| SCM / MR | Change review and merge gates |
| CI pipelines | Build, test, scan, publish |
| Environments / release | Deploy history and gates |
| Packages / registry | Artifact stores |
| AppSec / compliance | Scanning and policy literacy |
| Agent / infra | Cluster and GitOps-adjacent control |
| Duo | Assisted authoring and review |

### Related host-neutral jobs

Cross-forge patterns (schedule, promote, reusable templates): [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md).

## 3. Applications and use cases

| Team | Use GitLab for |
|------|----------------|
| App squad | MR + pipeline + environment deploy |
| Platform | Runners, components/Catalog, OIDC, Agent |
| Security | Scanning jobs + policies (tier-aware) |
| Ops | Self-Managed ref-arch / admin literacy |

**Good:** one system of record for code and delivery. **Bad:** treating GitLab as “only Jenkins YAML” and ignoring MR/environment gates.

## References

- [GitLab Docs](https://docs.gitlab.com/)  
- [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/)  
- [Subscriptions](https://docs.gitlab.com/subscriptions/)  
- [Use GitLab](https://docs.gitlab.com/user/)  
