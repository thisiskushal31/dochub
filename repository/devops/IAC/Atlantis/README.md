# Atlantis

[← Back to IAC](../README.md) · [Terraform](../Terraform/README.md) · [OpenTofu](../OpenTofu/README.md)

---

## 1. Concepts

**Atlantis** runs **Terraform/OpenTofu plan and apply from pull requests**—comments `atlantis plan` / `atlantis apply` so changes are reviewed as code with remote state locking.

**Plain language:** A bot that turns infra PRs into “here is the plan; two approvals; apply from the PR”—instead of engineers applying from laptops.

First-use notes: [1_Install_And_First_Use](./1_Install_And_First_Use.md).

**Disconfirm:** Atlantis is **not** GitOps for Kubernetes ([Argo CD](../../CiCd/Argo_CD/README.md) / [Flux](../../CiCd/Flux/README.md)). PR apply still needs IAM least privilege ([Security/5](../../Security/5_OIDC_CI_And_Least_Privilege.md)).

**Confirm:** Who is allowed to `atlantis apply` on `prod`?

---

## 2. Advanced concepts

| Concern | Practice |
|---------|----------|
| Repo / project config | `atlantis.yaml` projects, dir, workspace |
| Locking | Prevent two applies on same state |
| Policies | Require plan on PR; restrict apply to main; Checkov in CI too |
| Secrets | Workflow runners use OIDC/roles—not static keys in repo |
| Multi-account | Separate projects / roles per env |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Team Terraform | PR → plan comment → approve → apply |
| Prod | Extra approval; no apply from feature branches |
| OpenTofu | Same PR UX when configured for `tofu` |

**Staff checklist:** protect apply permissions; audit logs; remote state; never disable locking “temporarily.”

---

## References

- [Atlantis documentation](https://www.runatlantis.io/docs/)  
- [Terraform](../Terraform/README.md) · [Checkov](../../Security/Checkov/README.md)  
