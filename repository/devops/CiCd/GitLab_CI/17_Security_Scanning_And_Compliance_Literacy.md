# 17 — Security scanning and compliance (literacy)

[← Previous](./16_Packages_Container_Registry_And_Dependency_Proxy.md) · [README](./README.md) · [Next: Agent →](./18_Agent_Auto_DevOps_And_Infrastructure.md)

---

## 1. Concepts

GitLab’s **application security** area is large (hundreds of doc pages). This chapter is **literacy**: what exists and how it hooks into CI — not every scanner field.

Common CI-integrated scanners (availability/tier varies): SAST, DAST, dependency/container scanning, secret detection, IaC scanning, fuzz testing, and related reports in MRs.

**Compliance / security policies** can require scanners or approvals across projects (Premium/Ultimate features — confirm).

Pipeline security also means: protected variables, job token allowlists, secure MR pipelines for public projects, and not leaking secrets in logs ([14](./14_Variables_Secrets_And_OIDC.md)).

---

## 2. Advanced concepts

| Topic | Literacy point |
|-------|----------------|
| Auto-scan templates/components | Include official templates carefully; pin versions |
| MR security widget | Reports via artifacts |
| Vulnerability management | Triage in GitLab UI |
| Compliance frameworks / frameworks pipelines | Org policy as code (tier-aware) |
| License compliance | Policy gates where licensed |
| Supply chain | Signed commits, artifact provenance adjacent practices |

**Upstream-only:** every scanner’s configuration encyclopedia and every CVE feed integration page.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Baseline OSS | Secret detection + dependency scanning on MRs |
| Regulated | Policies enforce scanners + protected prod |
| Platform | Central components wrap scanners consistently |

**Good:** scanners as merge inputs with owners for triage. **Bad:** Ultimate checklist enabled with nobody reading findings.

---

## References

- [Secure your application](https://docs.gitlab.com/user/application_security/secure_your_application/)  
- [Application security](https://docs.gitlab.com/user/application_security/)  
- [Pipeline security](https://docs.gitlab.com/ci/pipeline_security/)  
- [Compliance](https://docs.gitlab.com/user/compliance/)  
