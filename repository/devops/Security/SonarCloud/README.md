# SonarCloud

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md) · Alternative to self-hosted [SonarQube](../SonarQube/README.md)

## 1. Concepts

**SonarCloud** is SonarSource’s **SaaS** quality + security analysis: static analysis, hotspots, coverage-oriented quality gates, and PR decoration — without running your own SonarQube server.

**Plain language:** Same family of quality gates as SonarQube, hosted for you. Pick Cloud when you want less ops; pick [SonarQube](../SonarQube/README.md) when you need on-prem / air-gap / custom plugins.

**Disconfirm:** SonarCloud green ≠ pentest done. It is not a substitute for Semgrep/CodeQL if you need those rule engines specifically.

**Confirm:** When would SaaS analysis be unacceptable (data residency)?

## 2. Advanced concepts

| Topic | Note |
|-------|------|
| Org / project binding | Tie CI identity carefully |
| New-code focus | Prefer gating on changed code |
| Parallel engines | Still fine to run [Semgrep](../Semgrep/README.md) / [CodeQL](../CodeQL/README.md) beside Cloud |
| Secrets | Never put tokens in public forks’ logs |

## 3. Applications

| Goal | Pattern |
|------|---------|
| PR gate | Analyze + require quality gate check |
| Monorepo | Separate projects per docs |
| Migration | Import/compare with existing SonarQube projects carefully |

## References

- [SonarCloud docs](https://docs.sonarsource.com/sonarcloud/)  
- [SonarQube](../SonarQube/README.md) (self-hosted alternative)  
- [Gate chain](../4_Security_Gate_Chain.md)  
