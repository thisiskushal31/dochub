# 20 — Best practices and when not Actions

[← Previous](./19_Worked_Example_CI_Build_And_Promote.md) · [README](./README.md) · [Next: Coverage map →](./21_Feature_And_Configuration_Coverage_Map.md)

## 1. Concepts — defaults that age well

| Do | Don’t |
|----|-------|
| Pin actions and reusable workflows (prefer SHA on critical paths) | `@main` everywhere |
| Explicit least-privilege `permissions` | `write-all` |
| OIDC to cloud; tight claims (`job_workflow_ref` when paved) | Long-lived access keys |
| Promote by digest (+ attest when required) | Rebuild and hope |
| Path filters + concurrency | Waste minutes on noise |
| Org paved road (`workflow_call`) | Copy-paste CI into 80 repos |
| GitOps for cluster apply | Steady-state `kubectl` from CI |
| Careful fork / `pull_request_target` | Secrets + untrusted code |
| Own scheduled workflows | Orphan crons that fail silently |
| Right-size runners | macOS/GPU for no reason |

## 2. Advanced — when *not* (or not only) Actions

| Situation | Better fit |
|-----------|------------|
| Code not on GitHub | GitLab CI / other forge CI |
| Air-gap / policy forbids cloud CI | Jenkins / on-prem CI / GHES+self-hosted with care |
| Extreme custom agents already standardized | Keep that platform ([Buildkite/](../Buildkite/README.md), …) |
| Only need cluster sync | Flux/Argo — Actions just builds images |
| Durable bot across many repos without workflow runs | GitHub App |

Actions vs Apps: [01](./01_What_Is_GitHub_Actions.md).

## 3. Applications and use cases

| Decision | Ask |
|----------|-----|
| Adopt Actions? | Is GitHub the system of record for this code? |
| Self-hosted / ARC? | Do we own patching and isolation? |
| Reusable workflows? | Who versions and CODEOWNS the paved road? |
| Larger runners? | Have we measured queue time and CPU need? |

## References

- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)  
- [CiCd tools map](../2_CI_CD_Tools.md)  
- [Workflow automation beyond PR CI](../24_Workflow_Automation_Beyond_PR_CI.md)  
