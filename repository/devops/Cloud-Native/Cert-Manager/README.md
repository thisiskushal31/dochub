# cert-manager

[← Back to Cloud-Native](../README.md) · [CNCF everyday tools](../4_CNCF_Everyday_Tools.md)

---

## 1. Concepts

**cert-manager** is a Kubernetes controller that **requests, stores, and renews TLS certificates** so humans are not copying PEMs into Secrets by hand.

**Plain language:** It is the cluster’s automatic certificate clerk. You declare “I need a cert for `app.example.com`”; it talks to a CA (often Let’s Encrypt), puts the result in a Secret, and renews before expiry.

### Where it sits

| Piece | Role |
|-------|------|
| **cert-manager** pods | Controllers watching Certificate / Issuer APIs |
| **Issuer** | Namespaced CA config (ACME, CA, Vault, …) |
| **ClusterIssuer** | Same, but usable from **any** namespace |
| **Certificate** | Desired cert: DNS names, Secret name, issuerRef |
| **Secret** (`tls.crt` / `tls.key`) | What Ingress / Gateway / apps actually mount |

K8s depth: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive). Edge map: [4](../4_CNCF_Everyday_Tools.md).

**Disconfirm:** An Ingress with `tls:` lines is **not** a renewal plan unless something (cert-manager or an operator) fills and refreshes that Secret.

**Confirm:** Issuer vs ClusterIssuer—which one can many namespaces share?

---

## 2. Advanced concepts

### Issuer vs ClusterIssuer

- **Issuer** — only Certificates in the **same namespace** can use it.  
- **ClusterIssuer** — any namespace can reference it (`issuerRef.kind: ClusterIssuer`).  
- Secrets referenced by a **ClusterIssuer** live in the **cluster resource namespace** (default `cert-manager`), not in the app namespace—common first-day footgun.

### Let’s Encrypt (ACME) solvers

| Solver | How it proves you own the name | Typical use |
|--------|--------------------------------|-------------|
| **HTTP-01** | ACME puts a challenge file reachable on `:80` for the hostname | Public HTTP Ingress |
| **DNS-01** | ACME writes a TXT record in DNS | Wildcards; private HTTP; when HTTP-01 is blocked |

Staging Issuer first (Let’s Encrypt staging) to avoid production rate limits while debugging.

### Ingress / Gateway integration

Common patterns:

1. Explicit **Certificate** CR → Secret → reference from Ingress/Gateway.  
2. Ingress **annotations** that ask cert-manager to create the Certificate for you.

Either way: renewals rewrite the Secret; pods/Ingress must pick up new material (most reload automatically; some apps cache—know yours).

### Failure modes

| Symptom | Likely cause |
|---------|--------------|
| Certificate Ready=False | Issuer not Ready; solver cannot complete; wrong DNS |
| Rate limited | Hit LE prod too often during debug |
| Secret empty / stale | Wrong `secretName`; another controller overwrites |
| Works in one NS only | Used Issuer instead of ClusterIssuer |

---

## 3. Applications and use cases

Illustrative shapes (pin API versions from current docs):

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: platform@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-account
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: app-tls
  namespace: app
spec:
  secretName: app-tls
  dnsNames:
    - app.example.com
  issuerRef:
    name: letsencrypt-staging
    kind: ClusterIssuer
    group: cert-manager.io
```

| Goal | Pattern |
|------|---------|
| Public site TLS | HTTP-01 ClusterIssuer + Certificate or Ingress shim |
| `*.apps.example.com` | DNS-01 + provider credentials |
| Corp / air-gapped | CA or Vault Issuer — not public ACME |
| GitOps | Commit Issuer + Certificate; verify Ready in CI/CD |

**Staff checklist**

- Staging Issuer before prod ACME  
- Document cluster resource namespace  
- Alert on Certificate not Ready / expiring soon  
- Never commit private keys; Secrets stay in-cluster / sealed / ESO  
- After Issuer change: confirm one renew cycle in non-prod  

**Confirm**

1. Where do ClusterIssuer-referenced Secrets live by default?  
2. When do you need DNS-01 instead of HTTP-01?  
3. What proves renewals work—not just first issue?

**Disconfirm**

- “We terminated TLS at the cloud LB” does **not** remove the need for in-cluster certs for east-west or internal Ingress.  
- Copy-pasting a cert into a Secret once is **not** ops.

**Good:** Ready Issuers, tested renewals, monitored expiry. **Bad:** silent manual PEMs; prod ACME as debug loop.

---

## References

- [cert-manager documentation](https://cert-manager.io/docs/)  
- [Issuer / ClusterIssuer](https://cert-manager.io/docs/concepts/issuer/)  
- [Certificate resource](https://cert-manager.io/docs/usage/certificate/)  
- [ACME / Let’s Encrypt](https://letsencrypt.org/docs/)  
- [ExternalDNS](../ExternalDNS/README.md) (hostname automation pair)  
