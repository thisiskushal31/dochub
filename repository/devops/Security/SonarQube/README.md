# SonarQube

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

---

## 1. Concepts

**SonarQube** (and SonarCloud) is a **quality + security** platform: static analysis, coverage gates, duplication, and issue tracking with a quality-gate pass/fail for CI.

**Plain language:** A report card for the codebase. Pipelines often **fail the build** if the quality gate fails (new bugs, coverage drop, security hotspots).

Kickoff primary SAST/quality example alongside [ZAP](../ZAP/README.md) for DAST.

**Disconfirm:** A green Sonar gate is **not** a penetration test. Coverage % is **not** proof of useful tests.

**Confirm:** What does a “quality gate” decide in CI?

---

## 2. Advanced concepts

| Surface | Job |
|---------|-----|
| Issues / hotspots | Bugs, vulns, code smells |
| Quality gate | Thresholds on new code (preferred) vs overall |
| PR decoration | Comments on changed lines |
| Editions | Community vs commercial features — know what you licensed |

New-code focus reduces “fix the ocean” fatigue. Pair with [Semgrep](../Semgrep/README.md) / [CodeQL](../CodeQL/README.md) if you want rule engines outside Sonar’s model.

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| PR gate | Analyze + quality gate required check |
| Main branch | Full analysis; trend dashboards |
| Monorepo | Separate projects / monorepo mode per docs |

**Staff checklist:** gate on **new code**; own triage SLAs; don’t disable rules silently; keep scanner version pinned in CI.

---

## References

- [SonarQube docs](https://docs.sonarsource.com/sonarqube/)  
- [SonarCloud](https://docs.sonarsource.com/sonarcloud/)  
- [Gate chain](../4_Security_Gate_Chain.md) · [ZAP](../ZAP/README.md)  
