# Gitleaks

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

## 1. Concepts

**Gitleaks** scans git history and diffs for **secrets** (API keys, tokens, passwords) so they do not land in a remote repo.

**Plain language:** It is a metal detector for your commits. Gate 1 in the [chain](../4_Security_Gate_Chain.md).

| Where it runs | Job |
|---------------|-----|
| Pre-commit / pre-push | Catch before push |
| CI on PR | Block merge if new secrets appear |
| Historical scan | Find old leaks still in history |

**Disconfirm:** “We use vault for runtime” does **not** protect secrets already committed to git. Rotating a key is required after a leak—not only deleting the line.

**Confirm:** Which gate number is secret scanning? What do you do *after* a true positive in history?

## 2. Advanced concepts

| Concern | Practice |
|---------|----------|
| Allowlists | Documented false positives only; never blanket-disable |
| Baseline | Historical scan once; then PR-diff mode for day-to-day |
| Fork PRs | Treat untrusted PRs carefully—don’t echo secrets into logs |
| Platform scanners | GitHub/GitLab secret scanning complements Gitleaks; overlap is fine |

Pipeline map: [CiCd/15](../../CiCd/15_Pipeline_Security_And_Gates.md).

## 3. Applications

| Goal | Pattern |
|------|---------|
| PR gate | `gitleaks detect --source . --verbose` (pin version) fail on findings |
| History cleanup | Rotate credentials → rewrite/filter history only with explicit process |
| Local | Pre-commit hook for developers |

**Staff checklist:** pin version; fail CI on findings; rotate on leak; don’t commit `.gitleaks.toml` allowlists without review.

**Confirm:** Why pin the scanner version? **Disconfirm:** Redacting a log is **not** the same as rotating the credential.

## References

- [Gitleaks](https://github.com/gitleaks/gitleaks)  
- [Security gate chain](../4_Security_Gate_Chain.md)  
- [CiCd/15](../../CiCd/15_Pipeline_Security_And_Gates.md)  
