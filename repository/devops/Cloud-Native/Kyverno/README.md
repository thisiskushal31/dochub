# Kyverno

[← Back to Cloud-Native](../README.md) · [OPA (general policy)](../../Security/OPA/README.md) · [CNCF everyday tools](../4_CNCF_Everyday_Tools.md)

---

## 1. Concepts

**Kyverno** is a **Kubernetes-native policy engine** (CNCF). It admits, mutates, generates, and verifies cluster resources using policies that feel like Kubernetes YAML—plus **CEL**-based policy types in current releases.

**Plain language:** A cluster seatbelt. Before (or while) something is created, Kyverno can say “no unsigned image,” “add these labels,” or “create a NetworkPolicy twin.”

| Job | Typical policy kind (current direction) |
|-----|----------------------------------------|
| Validate | `ValidatingPolicy` |
| Mutate | `MutatingPolicy` |
| Generate related objects | `GeneratingPolicy` |
| Cleanup on schedule | `DeletingPolicy` |
| Verify image signatures / attestations | `ImageValidatingPolicy` |

Legacy `ClusterPolicy` / `Policy` (`kyverno.io/v1`) are **deprecated** toward removal—prefer `policies.kyverno.io` CEL types and plan migration ([official migration guide](https://kyverno.io/docs/guides/migration-to-cel/)).

vs [OPA](../../Security/OPA/README.md) / Gatekeeper: OPA is a general Rego engine (CI, APIs, many hosts). **Kyverno specializes in Kubernetes resources** with less Rego for common cluster guardrails. Many platforms use one primary; some use both for different layers.

**Disconfirm:** Installing Kyverno with zero policies does **nothing**. Kyverno is **not** a network WAF ([WAF](../../Security/WAF/README.md)).

**Confirm:** Name one validate vs one mutate use case.

---

## 2. Advanced concepts

### Admission + background

| Mode | Meaning |
|------|---------|
| Admission | Block/mutate on CREATE/UPDATE (and related ops) |
| Background | Scan / mutate existing resources; report drift |
| Audit vs Deny | Warn in reports first; then enforce |

### Image verification

`ImageValidatingPolicy` pairs with supply-chain signing ([Cosign](../../Security/Cosign/README.md), [CiCd/6](../../CiCd/6_Supply_Chain_And_Signing.md)): admit only images that verify under your trust roots / identities.

### Exceptions and ownership

| Concern | Practice |
|---------|----------|
| PolicyException | Narrow, time-boxed, owned exceptions—not cluster-wide disable |
| Fail open vs fail closed | Know webhook failure policy; test upgrades |
| GitOps | Policies live in Git; Kyverno enforces what GitOps applies |
| CLI testing | Unit-test policies before merge (`kyverno` CLI) |

### Failure modes

| Failure | Outcome |
|---------|---------|
| Webhook timeout | Stuck deploys or fail-open admits |
| Over-strict overnight | Break platform addons; teams force exceptions |
| Legacy-only policies | Upgrade debt when old APIs remove |
| No reporting sink | Blind to audit failures |

---

## 3. Applications and use cases

Illustrative shape (pin API versions from current docs):

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: require-team-label
spec:
  validationActions: [Deny]
  matchConstraints:
    resourceRules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        operations: ["CREATE", "UPDATE"]
        resources: ["pods"]
  validations:
    - expression: "'team' in object.metadata.?labels.orValue([])"
      message: "Every Pod requires a team label."
```

| Goal | Pattern |
|------|---------|
| Baseline cluster | Require labels, deny `:latest`, deny privileged |
| Supply chain | ImageValidatingPolicy + Cosign identities |
| Tenancy | Generate NetworkPolicy / ResourceQuota per Namespace |
| Soft launch | Audit → Deny after soak |

**Staff checklist**

- Prefer CEL policy types on new work; migrate legacy on a schedule  
- Test with Kyverno CLI in CI  
- Document exceptions with owners and expiry  
- Watch webhook latency / failure metrics  
- Align policies with paved-road templates ([Platform engineering](../3_Platform_Engineering.md))  

**Confirm**

1. What is the migration pressure away from `ClusterPolicy`?  
2. How does Kyverno relate to Cosign at admit time?  
3. When do you choose Kyverno vs OPA/Conftest in CI?

**Disconfirm**

- “Policy as code” in Terraform Checkov is **not** the same as admission Kyverno.  
- A PolicyException forever is **not** a control.

**Good:** Git-versioned CEL policies, tested, audited, then enforced. **Bad:** undocumented ClusterPolicy sprawl; fail-open ignored.

---

## References

- [Kyverno documentation](https://kyverno.io/docs/)  
- [Policy types overview](https://kyverno.io/docs/policy-types/overview/)  
- [Migrating to CEL policies](https://kyverno.io/docs/guides/migration-to-cel/)  
- [OPA](../../Security/OPA/README.md) · [Cosign](../../Security/Cosign/README.md) · [WAF](../../Security/WAF/README.md)  
