# OWASP ZAP

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

---

## 1. Concepts

**OWASP ZAP** (Zed Attack Proxy) is a **DAST** tool: it probes a **running** application (preview/staging) for common web vulnerabilities.

**Plain language:** It clicks and fuzzes your live URL like an automated curious attacker—not reading source like SAST.

Kickoff primary DAST example with [SonarQube](../SonarQube/README.md) for SAST/quality.

**Disconfirm:** ZAP on production without rules of engagement is **dangerous**. DAST is **not** a replacement for SAST/SCA earlier in the chain.

**Confirm:** Which environments should ZAP usually target?

---

## 2. Advanced concepts

| Mode | Use |
|------|-----|
| Baseline / passive | Safer, faster smoke of surface |
| Full / active | Deeper; longer; needs auth & scope |
| API scan | OpenAPI-driven |
| Auth | Test users; don’t use prod admin creds |

Run after deploy to preview ([CiCd/5](../../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md)); gate high findings before promote.

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| PR preview | Baseline scan against ephemeral URL |
| Nightly staging | Deeper scan; ticket failures |
| API-only service | OpenAPI import + auth token |

**Staff checklist:** scoped URLs; dedicated test identity; rate limits; fail on agreed severities; store reports as CI artifacts.

---

## References

- [OWASP ZAP](https://www.zaproxy.org/docs/)  
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)  
- [Gate chain](../4_Security_Gate_Chain.md)  
