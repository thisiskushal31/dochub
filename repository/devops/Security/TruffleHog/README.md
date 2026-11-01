# TruffleHog

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md) · Alternative to [Gitleaks](../Gitleaks/README.md)

## 1. Concepts

**TruffleHog** finds secrets in git history and filesystems (high-entropy / verified detectors depending on mode). Use it as a **secrets scanning** alternative or complement to Gitleaks.

**Disconfirm:** A clean scan is not proof no secret ever leaked outside git.

## 2. Applications

| Goal | Pattern |
|------|---------|
| Pre-commit / CI | Scan diff or repo; fail on verified findings |
| Incident | Scan history after a suspected leak; rotate anything hit |

Pin versions; treat findings as rotate-immediately.

## References

- [TruffleHog](https://github.com/trufflesecurity/trufflehog)  
- [Gitleaks](../Gitleaks/README.md)  
- [Gate chain](../4_Security_Gate_Chain.md)  
