# 23 — Best practices and when not Jenkins

[← Previous](./22_Worked_Example_Pipeline_Build_And_Deploy.md) · [README](./README.md) · [Next: Coverage map →](./24_Feature_And_Offering_Coverage_Map.md)

---

## 1. Concepts — defaults that age well

| Do | Don’t |
|----|-------|
| LTS + tested backups | Random weekly in prod |
| Agents for builds; controller thin | Build on built-in node |
| Pipeline in SCM + shared libraries | UI-only scripts; `@Library(…@main)` forever |
| JCasC for controller config | Irreproducible click-ops |
| Least-privilege authz + folders | “Anyone can do anything” |
| Pin plugins; stage upgrades | Install everything |
| Webhooks over Poll SCM when possible | Poll every minute at scale |
| Fingerprint / digest promote | Rebuild for prod |
| Isolate untrusted PRs | Prod creds on fork PR agents |

Official using/pipeline best-practice pages reinforce these themes.

---

## 2. Advanced — when *not* (or not only) Jenkins

| Situation | Better fit |
|-----------|------------|
| GitHub-only greenfield, low ops appetite | [GitHub_Actions/](../GitHub_Actions/README.md) |
| GitLab as full DevSecOps platform | [GitLab_CI/](../GitLab_CI/README.md) |
| Pure K8s-native pipelines without Jenkins ops | [Tekton/](../Tekton/README.md) |
| Hybrid agents with hosted control plane preference | [Buildkite/](../Buildkite/README.md) |
| Only cluster sync | Flux/Argo — Jenkins builds images |

Keep Jenkins when you need deep on-prem control, classical estates, or existing plugin investments — improve it; don’t abandon fashionably without a plan ([CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md)).

---

## 3. Applications and use cases

| Decision | Ask |
|----------|-----|
| Keep Jenkins? | Do we own controller ops for real? |
| Shared libraries? | Who versions the paved road? |
| One controller vs many? | Blast radius vs cost |

---

## References

- [Using Jenkins best practices](https://www.jenkins.io/doc/book/using/best-practices/)  
- [Pipeline best practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)  
- [CiCd tools map](../2_CI_CD_Tools.md)  
