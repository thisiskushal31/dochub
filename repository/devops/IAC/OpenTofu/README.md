# OpenTofu

[← Back to IAC](../README.md) · [Terraform](../Terraform/README.md)

---

## 1. Concepts

**OpenTofu** is an open-source **Terraform-compatible** IaC tool (Linux Foundation). For most day-to-day HCL modules, providers, and state workflows, skills transfer from Terraform.

**Plain language:** Same language and workflow shape as Terraform for many teams; different project governance and release channel. Learn [Terraform concepts](../Terraform/README.md) / [state & backends](../2_State_Modules_And_Backends.md) once—apply to either binary when versions align.

**Disconfirm:** “Terraform” and “OpenTofu” are **not** guaranteed identical at every version—pin and test upgrades. Switching binaries mid-state needs a deliberate migration plan.

**Confirm:** What stays the same (HCL, state model) vs what you must verify (provider/version compatibility)?

---

## 2. Advanced concepts

| Topic | Literacy |
|-------|----------|
| State | Remote backends, locking—same ops discipline |
| Providers | Registry / mirror choices; pin versions |
| CI | `tofu plan` / `apply` in PR bots ([Atlantis](../Atlantis/README.md)) |
| Migration | Follow current OpenTofu↔Terraform migration docs; never casual swap on prod state |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| New greenfield | Pick one toolchain; document why |
| Existing Terraform | Stay or migrate with tested state upgrade path |
| Policy | Same Checkov/OPA gates on HCL |

**Staff checklist:** pin `tofu` version; remote state + lock; code review plans; no apply from laptops to prod without audit path.

---

## References

- [OpenTofu docs](https://opentofu.org/docs/)  
- [Terraform](../Terraform/README.md) · [Atlantis](../Atlantis/README.md)  
