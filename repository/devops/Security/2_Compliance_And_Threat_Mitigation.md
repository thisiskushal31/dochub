# Compliance and threat mitigation

[← Back to Security](./README.md) · [Gate chain](./4_Security_Gate_Chain.md) · [AST and the other gates](./6_AST_Methods_And_Tools.md)

Pipeline scans are [6](./6_AST_Methods_And_Tools.md) and [4](./4_Security_Gate_Chain.md). This page is what stays **after** the artifact is admitted: posture of the live account, how long a finding may live, and the edge controls that are not tests.

Full SOC, forensics, and audit programs: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) (Defensive-Ops, GRC, Cloud-Security).

## What beginners must get right

| Correct | Wrong |
|---------|--------|
| A finding has an owner and a date | A scanner dashboard is the program |
| An exception expires | “Risk accepted” with no end |
| IaC scan and live posture are both real | Checkov green means the console matches the repo |
| WAF and sensors complement the chain | The firewall ticket replaces SAST and patching |

**Disconfirm:** DDoS protection is **not** a vulnerability scan. An IDS alert is **not** a pull-request gate.

**Confirm:** Who owns a critical CVE on a base image after Trivy has already failed the build once?

## Live posture vs the pull request

| Check | Reads | Typical home |
|-------|--------|----------------|
| **CSPM** | The cloud account as it is: public buckets, open paths, missing logs | Cloud security console. Depth: [Security-Deep-Dive Cloud-Security](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Cloud-Security) |
| **KSPM** | The cluster as it is: RBAC, privileged pods, unpinned images | Same family, Kubernetes API |
| **CIS-class benchmark** | Image or node vs a written baseline | kube-bench, Docker Bench, OpenSCAP — schedule it |
| **IaC / admission** | The diff, then the object at apply time | [Checkov](./Checkov/README.md), [Kyverno](../Cloud-Native/Kyverno/README.md), [OPA](./OPA/README.md) |

Run benchmark and posture on a cadence. Do not add them as a second 20-minute job on every commit. Alert the owner of the account or cluster, not “security@” with no route.

## Vulnerability management

| Piece | Practice |
|-------|----------|
| Severity bar | The same bar the [gate chain](./4_Security_Gate_Chain.md) fails closed on |
| SLA | Critical and high have a written number of days |
| Exception | Named owner, reason, expiry. Renew on purpose |
| Base images | Platform owns the golden image; apps own the Dockerfile bump |
| Evidence | Pipeline log, SBOM, and the exception register — not a slide |

Dependabot or Renovate opens the bump. A human still merges it. “We scan” without a merge path is a report.

## Edge and runtime (not tests)

| Control | Job |
|---------|-----|
| [WAF](./WAF/README.md) | Filter HTTP at the edge. Tune it. It does not read source |
| DDoS | Cloud or CDN capacity and rate limits. An availability control |
| Runtime sensor (Falco-class) | Syscall or audit events from the node. Detect; page someone |
| [Vault](./Vault/README.md) | Broker secrets at runtime so they are not in the image |
| Cert expiry | Alert before TLS breaks. A check, not a CVE scan |
| IDS / IPS | Network detection. Literacy here; packet depth is [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |

Incident handling after a page: [Security-Deep-Dive Defensive-Ops](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Defensive-Ops).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Every CSPM finding as a page | Route by account owner; page on exposure and on missing audit logs |
| Permanent exceptions | Expiry, or it is policy |
| Buying detection and skipping the PR gates | Sensors see what the chain let through |

## Next

- Ordered gates: [4](./4_Security_Gate_Chain.md)
- Method catalog: [6](./6_AST_Methods_And_Tools.md)

## Further reading

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
