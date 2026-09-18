# Semgrep

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

## 1. Concepts

**Semgrep** is a fast **SAST** (static application security testing) engine: pattern rules over source code without a full compiler setup for many languages.

**Plain language:** Grep that understands code structure—and ships security rules you can run on every PR.

Gate placement: SAST tier with [CodeQL](../CodeQL/README.md) / [SonarQube](../SonarQube/README.md) — [chain](../4_Security_Gate_Chain.md).

**Disconfirm:** Semgrep passing is **not** proof the app is secure—it catches classes of bugs your rules cover.

**Confirm:** When would you pick Semgrep vs CodeQL on a PR?

## 2. Advanced concepts

| Mode | Use |
|------|-----|
| Registry / OSS rules | Quick start (OWASP-ish packs) |
| Custom rules | Org-specific anti-patterns |
| CI diff-aware | Comment on changed lines; keep noise low |
| Autofix (where available) | Developer-friendly, still review |

Pair with SCA ([Trivy](../Trivy/README.md) / [Snyk](../Snyk/README.md))—different job (code vs dependencies).

## 3. Applications

| Goal | Pattern |
|------|---------|
| PR SAST | Semgrep CI action / CLI; block high severity |
| Custom guardrail | Rule: “no raw SQL string concat” |
| Monorepo | Path filters per language pack |

**Staff checklist:** start with curated packs; tune ignores; fail on new high findings; don’t bury Semgrep output unread.

## References

- [Semgrep docs](https://semgrep.dev/docs/)  
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) (literacy)  
- [Gate chain](../4_Security_Gate_Chain.md)  
