# ExternalDNS

[← Back to Cloud-Native](../README.md) · [CNCF everyday tools](../4_CNCF_Everyday_Tools.md)

## 1. Concepts

**ExternalDNS** watches Kubernetes resources (Ingress, Service, Gateway, …) and **creates/updates DNS records** in an external provider so hostnames point at the right load balancer or IP.

**Plain language:** When you expose `app.example.com` on an Ingress, ExternalDNS is the robot that updates Route53 / Cloud DNS / Azure DNS / Cloudflare (etc.) instead of a human editing the zone console.

### Where it sits

```text
Ingress / Service / Gateway (hostname annotation or spec)
    → ExternalDNS controller
        → Provider API (AWS, GCP, Azure, Cloudflare, …)
            → Public or private DNS zone
```

DNS protocol depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Cluster edge map: [4](../4_CNCF_Everyday_Tools.md). TLS for that hostname: [cert-manager](../Cert-Manager/README.md).

**Disconfirm:** Creating an Ingress object is **not** the same as publishing DNS. Without ExternalDNS (or automation), the name may not resolve.

**Confirm:** Which object in *your* cluster is the source of truth for the hostname?

## 2. Advanced concepts

### Ownership and TXT registry

ExternalDNS typically writes a **TXT “owner” record** next to the A/AAAA/CNAME so it knows which records **it** manages. Without ownership:

- Two controllers fight and flap records.  
- A human edit gets overwritten—or the opposite: orphan records never cleaned.

### Safe defaults

| Setting / practice | Why |
|--------------------|-----|
| **Domain filter** | Only touch zones you own (`example.com`) |
| **Source allow-list** | Ingress and/or Service—not every object type blindly |
| **Policy** (`upsert-only` vs sync) | `sync` deletes records removed from K8s—powerful and dangerous |
| **Provider credentials** | IRSA / Workload Identity / least-privilege IAM — not long-lived keys in plain ConfigMaps |
| **Annotation filter** | Opt-in hostnames so random Ingresses do not publish |

### Provider variants (same job)

| Provider family | Literacy note |
|-----------------|---------------|
| AWS Route53 | Often IRSA on the ExternalDNS SA |
| Google Cloud DNS | Workload Identity |
| Azure DNS | Managed identity / AAD |
| Cloudflare / others | API token scoped to zone |

Private DNS zones (corp split-horizon) still use the same controller pattern—different zone ID and often different VPC association. See Networks for resolver behavior.

### Failure modes

| Symptom | Likely cause |
|---------|--------------|
| Name never appears | Filter excluded domain; annotation missing; RBAC/IAM deny |
| Flapping TTL / targets | Two ExternalDNS or ExternalDNS + Terraform both “own” the name |
| Wrong target | Ingress not assigned an address yet; pointing at ClusterIP by mistake |
| Stale record after delete | `upsert-only` policy; or ownership TXT mismatch |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Public app hostname | Ingress host + ExternalDNS annotation/source + cert-manager Certificate |
| Internal only | Private zone + Internal LB / private Ingress class |
| GitOps | Commit Ingress; ExternalDNS reconciles DNS; do not also Terraform the same FQDN |
| Multi-cluster | Separate ownership IDs / prefixes per cluster; never share one unmanaged zone blindly |

**Staff checklist**

- One owner per FQDN (ExternalDNS **or** IaC—not both without a contract)  
- Domain filter + TXT ownership documented  
- IAM/WI reviewed like any other cloud identity  
- After Ingress delete: confirm record policy (keep vs remove)  
- Cross-check resolve from outside the cluster (not only in-pod)

**Confirm**

1. What is the TXT registry for?  
2. Why is domain filter mandatory in shared DNS accounts?  
3. What breaks if Terraform and ExternalDNS both manage `api.example.com`?

**Disconfirm**

- “DNS works on my laptop” is **not** proof ExternalDNS owns the record.  
- ClusterIP is **not** a public DNS target.

**Good:** filtered domains, clear ownership, least-privilege provider identity. **Bad:** cluster-admin keys; two writers; sync-delete with no runbook.

## References

- [kubernetes-sigs/external-dns](https://github.com/kubernetes-sigs/external-dns)  
- [ExternalDNS tutorials / provider docs](https://github.com/kubernetes-sigs/external-dns#deploying-to-a-cluster)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) (DNS depth)  
- [cert-manager](../Cert-Manager/README.md)  
- [CNCF everyday tools](../4_CNCF_Everyday_Tools.md)  
