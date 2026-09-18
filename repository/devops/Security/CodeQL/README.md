# CodeQL

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

## 1. Concepts

**CodeQL** (GitHub) is a **deep SAST** engine: it builds a database of your code and runs query packs that find complex data-flow bugs (SQLi, XSS, path traversal, …).

**Plain language:** Heavier than Semgrep—models how data moves through the program. Best when you can afford a longer CI job (often on default branch / scheduled).

**Disconfirm:** CodeQL is **not** a substitute for dependency scanning (SCA) or secret scanning.

**Confirm:** Why might CodeQL run on `main` while Semgrep runs on every PR?

## 2. Advanced concepts

| Concern | Practice |
|---------|----------|
| Language support | Build must succeed for analyzed languages |
| Query packs | Security-extended vs default; org custom queries |
| SARIF upload | GitHub code scanning alerts UX |
| Performance | Cache databases; don’t force full deep scan on every tiny PR |

## 3. Applications

| Goal | Pattern |
|------|---------|
| GitHub default | Code scanning workflow + required check on protected branch |
| Depth + speed | Semgrep on PR; CodeQL on merge/nightly |
| Custom bug class | Write/query pack for internal framework misuse |

**Staff checklist:** keep builds reproducible for analysis; triage alerts like bugs; don’t ignore “noise” without a documented dismiss reason.

## References

- [CodeQL documentation](https://codeql.github.com/docs/)  
- [GitHub code scanning](https://docs.github.com/en/code-security/code-scanning)  
- [Semgrep](../Semgrep/README.md) · [SonarQube](../SonarQube/README.md)  
