# OPA (Open Policy Agent)

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

---

## 1. Concepts

**OPA** is a general **policy-as-code** engine. You write policies in **Rego**; services ask OPA “is this allowed?” for APIs, CI, or Kubernetes admission (often via Gatekeeper).

**Plain language:** A rules brain you can embed anywhere—“deny if image is not signed,” “deny if Ingress has no TLS.”

Related: [Checkov](../Checkov/README.md) (IaC scanner), [Kyverno](../../Cloud-Native/Kyverno/README.md) (Kubernetes-native policies).

**Disconfirm:** OPA installed is **not** enforcement until something **queries** it (admission webhook, CI step, app middleware).

**Confirm:** Where does policy decision happen for cluster admits vs Terraform PRs?

---

## 2. Advanced concepts

| Pattern | Use |
|---------|-----|
| Gatekeeper / constraint templates | K8s admission |
| Conftest | Policy tests on files in CI (Terraform JSON, K8s YAML) |
| Envoy / API | External authz |
| Bundle distribution | Version policies like software |

Test policies like code. Keep deny messages actionable for developers.

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| CI | `conftest test` on planned JSON / manifests |
| Cluster | Gatekeeper constraints: require labels, block `:latest` |
| Signed images | Admit only cosign-verified digests ([Cosign](../Cosign/README.md)) |

**Staff checklist:** unit-test Rego; stage policies in warn→deny; document exceptions; own policy repo versioning.

---

## References

- [OPA documentation](https://www.openpolicyagent.org/docs/latest/)  
- [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/)  
- [Conftest](https://www.conftest.dev/)  
