# Security software

[← README](../README.md)

Named **lab software** (install + first use). The *program* (CIA, AppSec, SOC, GRC, PTES phases) stays in [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/README.md). Packet depth stays in Networks. **Isolated lab only — never scan the public internet.**

### One tool, one home (no duplication)

| Rule | Example |
|------|---------|
| One product → **one** folder in this repo | [Nmap](./Reconnaissance/Nmap/README.md) serves recon, vuln, and blue — do not fork copies |
| Already elsewhere → **link**, do not re-create | [n8n](../Automation/n8n/README.md) in Automation; **CI SAST/secrets** in [DevOps-Handbook Security](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security) |
| Capability labels list **alternatives** | Prefer Gobuster *or* ffuf *or* feroxbuster — same job |
| Methodology / defense depth | Security-Deep-Dive links here |

| Job | Folder |
|-----|--------|
| Find systems and public facts | [Reconnaissance/](./Reconnaissance/README.md) |
| Attack in a lab you own | [Offensive/](./Offensive/README.md) |
| Capture, memory, blue-team kit | [Defensive/](./Defensive/README.md) |
| IdP / CIAM / directories / workload identity / authZ / IGA | [Identity/](./Identity/README.md) |
| Binaries / firmware | [Reverse-Engineering/](./Reverse-Engineering/README.md) |

### CI / delivery security tools (not duplicated here)

Install and gate habits live in **DevOps-Handbook** so pipeline docs stay next to CI:

| Job | Alternatives (pick what fits) |
|-----|-------------------------------|
| Quality + SAST | [SonarQube](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/SonarQube) (self-hosted) · [SonarCloud](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/SonarCloud) (SaaS) |
| Fast / deep SAST | [Semgrep](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/Semgrep) · [CodeQL](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/CodeQL) |
| Secrets in git | [Gitleaks](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/Gitleaks) · [TruffleHog](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/TruffleHog) |
| SCA / image / IaC | [Trivy](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/Trivy) · [Snyk](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/Snyk) · [Checkov](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/Checkov) |
| DAST in CI | [ZAP](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/ZAP) (also [OWASP_ZAP](./Offensive/OWASP_ZAP/README.md) here for lab proxy use) |

Workflow automation (n8n) → [../Automation/](../Automation/README.md).
