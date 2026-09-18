# Checkov

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md) · [IAC](../../IAC/README.md)

## 1. Concepts

**Checkov** scans **Infrastructure as Code** (Terraform, CloudFormation, Kubernetes, Helm, Dockerfiles, …) for misconfigurations before apply.

**Plain language:** A linter for cloud/K8s intent—“public S3?”, “privileged pod?”, “open security group?”—in the PR, not after the breach.

**Disconfirm:** Checkov green is **not** proof the live account matches the code (drift). Pair with plan/apply review ([Atlantis](../../IAC/Atlantis/README.md)).

**Confirm:** When should Checkov run relative to `terraform apply`?

## 2. Advanced concepts

| Concern | Practice |
|---------|----------|
| Framework packs | CIS-ish policies; enable relevant clouds only |
| Skip / suppress | Require justification comments |
| Soft vs hard fail | Warn on PR; hard fail on main for critical checks |
| Overlap | [Trivy config](../Trivy/README.md), [OPA](../OPA/README.md)—pick primary |

## 3. Applications

| Goal | Pattern |
|------|---------|
| Terraform PR | Checkov on `*.tf` + fail on critical |
| K8s manifests | Scan Helm output or raw YAML in CI |
| GitOps | Policy before merge to env branch |

**Staff checklist:** tune skips; don’t drown in CIS noise; block known-dangerous defaults (0.0.0.0/0 SSH, privileged).

## References

- [Checkov docs](https://www.checkov.io/)  
- [IAC patterns](../../IAC/1_IAC_Tools_And_Patterns.md)  
- [OPA](../OPA/README.md)  
