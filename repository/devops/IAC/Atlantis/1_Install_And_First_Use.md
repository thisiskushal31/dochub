# Atlantis — install and first use

[← Atlantis](./README.md)

---

## 1. Concepts

Minimal path to a working Atlantis for one Terraform root:

1. Deploy Atlantis (Helm/VM/compose) with webhook secrets to GitHub/GitLab/etc.  
2. Grant the Atlantis identity **plan/apply** rights to the target cloud/org (prefer OIDC).  
3. Add repo webhook → Atlantis URL.  
4. Open a PR that changes `.tf`; comment `atlantis plan`.  
5. After review, `atlantis apply` (per your policy).

**Disconfirm:** Exposing Atlantis without auth webhook secrets is **unsafe**.

---

## 2. First checklist

| Step | Done when |
|------|-----------|
| VCS app/webhook | PR events reach Atlantis |
| Server-side repo allowlist | Only intended repos |
| State backend | Accessible from Atlantis runners |
| IAM | Least privilege per project |
| Smoke PR | Plan comment posts successfully |

Deep ops: [README](./README.md). State concepts: [../2_State_Modules_And_Backends.md](../2_State_Modules_And_Backends.md).

---

## References

- [Atlantis getting started](https://www.runatlantis.io/docs/installation-guide.html)  
