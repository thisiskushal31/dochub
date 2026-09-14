# 17 — Best practices and Cloud vs Data Center

[← Previous](./16_Worked_Example_Build_And_Deploy.md) · [README](./README.md) · [Next: Coverage map →](./18_Feature_And_Configuration_Coverage_Map.md)

---

## 1. Concepts — managing Bitbucket

Prefer:

- Project/repo structure with clear admins  
- Branch permissions + merge checks including Pipelines; **enforce** checks on Premium for production branches  
- `bitbucket-pipelines.yml` in Git; pin pipes; consider **configuration sharing** (Premium)  
- OIDC and deployment-scoped secrets; **deployment permissions** (Premium) for prod  
- Promote by digest; manual prod steps for Continuous Delivery  
- API tokens / access tokens — not long-lived passwords in repos  
- Jira keys for traceability when Atlassian is the work system  
- Know Free vs Standard vs Premium **capability** gates (minutes, LFS, admin controls)  

---

## 2. Advanced concepts

### A. Cloud management cadence

| Cadence | Action |
|---------|--------|
| Continuous | Failed prod deploys; runner health |
| Weekly | Flaky pipelines; minute burn |
| Monthly | Access review; unused apps |
| Quarterly | IP allowlist; OIDC roles; Premium feature usage |

### B. Cloud vs Data Center

| Topic | Cloud | Data Center |
|-------|-------|-------------|
| CI | Pipelines | Bamboo / Jenkins / other |
| Ops | Atlassian operates control plane | You patch Bitbucket DC |
| Premium controls | IP allowlist, deployment permissions, … | Your network + product features |
| Scaling | Plan limits / runners | Cluster sizing you own |

Do not promise “Pipelines on Data Center” — plan the CI product explicitly.

### C. Deploy spectrum reminder

Static → PaaS → containers → VMs → GitOps handoff ([12](./12_Deploy_Targets_And_Pipes_Catalog.md), [CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)).

### Good vs bad

| Good | Bad |
|------|-----|
| Required build + approvals on `main` | Optional checks |
| OIDC to cloud | Long-lived keys on every PR |
| Deployment permissions on prod | Prod vars visible to all writers |
| Pin pipes | Floating pipe tags |

### When not to use Bitbucket

GitHub/GitLab already SoR; need DC Git without accepting Bamboo/Jenkins; team standardized elsewhere ([CiCd/2](../2_CI_CD_Tools.md)).

---

## 3. Applications and use cases

Staff review: walk A–C; mark use / defer / N/A for Premium features and DC CI choice.

---

## References

- [Keep your workspace secure](https://support.atlassian.com/bitbucket-cloud/docs/keep-your-workspace-secure/)  
- [Bitbucket Cloud vs Data Center](https://bitbucket.org/product/guides/getting-started/overview)  
- [CiCd tools index](../2_CI_CD_Tools.md)  
