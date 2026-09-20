# 4 — CNCF everyday tools (cluster add-ons)

[← Back to Cloud-Native](./README.md) · [Platform engineering →](./3_Platform_Engineering.md)

## 1. Concepts — what “everyday” means

After you have a working Kubernetes API, most teams still need a **small set of add-ons** so apps can get TLS, publish DNS names, and (later) sit behind a platform catalog. Those jobs show up in almost every production cluster—even when the CNCF landscape looks endless.

**Plain language:** Think of the cluster as a building. Kubernetes is the structure. Everyday tools are the **locks (TLS)**, the **street signs (DNS)**, and the **lobby directory (IDP)** so developers can find and request what they need.

### Tier map (install when the job appears)

| Tier | Job | Typical tools (literacy) | Home here |
|------|-----|--------------------------|-----------|
| **Core** | Schedule and package workloads | Kubernetes, Helm | [Kubernetes/](./Kubernetes/README.md), [Helm/](./Helm/README.md) |
| **Delivery** | Desired state + progressive ship | Argo CD, Flux, Rollouts/Flagger | [CiCd/](../CiCd/README.md) |
| **Observe** | Metrics / logs / traces | Prometheus, Grafana, OTel, Loki… | [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md) |
| **Edge of cluster** | TLS + DNS for Ingress/Gateway | **cert-manager**, **ExternalDNS** | folders below |
| **Platform UX** | Catalog / paved road | **Backstage** (or Port / custom) | [Backstage/](./Backstage/README.md), [3](./3_Platform_Engineering.md) |
| **Next** | Mesh / eBPF net / policy | Istio, Linkerd, Cilium, Kyverno | mesh folders · Networks / Security doors |

You do **not** install the whole landscape on day one. Install when a **job** appears (HTTPS on Ingress, automatic DNS, developer self-service).

### When to install (v1 starter)

| Symptom | Add-on |
|---------|--------|
| Manual cert copies into Secrets; expiry pages | [cert-manager](./Cert-Manager/README.md) |
| Hand-edited Route53 / Cloud DNS after every Ingress | [ExternalDNS](./ExternalDNS/README.md) |
| “How do I stand up a service on our paved road?” | [Backstage](./Backstage/README.md) / platform entry |
| Need L7 mesh / mTLS between services | [Istio](./Istio/README.md) / [Linkerd](./Linkerd/README.md) — *after* TLS+DNS basics |
| Need cluster-wide K8s policy as code | [Kyverno](./Kyverno/README.md) / [OPA](../Security/OPA/README.md) |

**Disconfirm:** Having Helm installed is **not** “platform engineering.” A green Ingress is **not** proof renewals will work next month.

**Confirm:** Which tier owns TLS renewals? Which owns changing a public DNS name when a Service moves?

Depth for kubeadm / OpenShift / managed K8s: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive). Named cloud SKUs: [Cloud/](../Cloud/README.md). Hall / metal: [Datacenter/](../Datacenter/README.md).

## 2. Advanced concepts — how the edge pieces fit

```text
Client HTTPS
    → LB / Ingress / Gateway
        → TLS Secret (often filled by cert-manager)
        → Service → Pods
DNS name for that hostname
    → often written by ExternalDNS from Ingress/Service annotations
```

| Concern | Pitfall | Steering check |
|---------|---------|----------------|
| Issuer Ready=False | Solver / ACME / secret namespace wrong | `kubectl describe clusterissuer` |
| Cert renew storm | Short TTL + bad rate limits | Watch Certificate Request backlog |
| DNS flap | Two ExternalDNS controllers own same zone | TXT ownership + filter domains |
| Split-brain TLS | Manual Secret overwrites controller | Who owns the Secret keys? |

Ingress / Gateway class choice (NGINX, Contour, Gateway API): literacy here; product depth in Containerization + Networks. Cilium/Hubble: networking observability entry — [Networks Cloud-Native](https://github.com/thisiskushal31/Networks-Deep-Dive/tree/main/Cloud-Native).

### Global / estate variants

Same jobs on EKS/GKE/AKS, OpenShift Routes, or bare metal + MetalLB. Provider DNS (Route53, Cloud DNS, Azure DNS, Cloudflare) changes **credentials**, not the ExternalDNS *job*. Private ACME / corporate CA changes **Issuer type**, not the Certificate *job*.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First public HTTPS app | Ingress + cert-manager ClusterIssuer + Certificate (or Ingress annotation) |
| Many microservices, one zone | ExternalDNS with domain filter + TXT registry |
| Platform team | Backstage catalog templates that emit Helm/GitOps PRs — [3](./3_Platform_Engineering.md) |
| GitOps | Commit Issuer/Certificate/Ingress; Argo/Flux apply; cert-manager/ExternalDNS reconcile |

**Staff checklist**

- Know who owns cert-manager and the Cluster Resource Namespace  
- Document ACME account / corporate CA contact  
- Domain filter + ownership TXT before second ExternalDNS  
- Portal/catalog only points at **paved** paths (not every raw CRD)  

**Confirm**

1. Name two everyday add-ons that sit at the cluster edge.  
2. Why can a Certificate fail even when the Ingress looks fine?  
3. What must you decide before running two ExternalDNS instances?

**Disconfirm**

- Installing Backstage is **not** a substitute for working TLS and DNS.  
- “CNCF graduated” is **not** a reason to install a tool with no job.

**Good:** job-driven install; renewals tested; DNS ownership clear. **Bad:** landscape tourism; manual Secrets forever; three DNS controllers fighting.

## References

- [CNCF Landscape](https://landscape.cncf.io/)  
- [cert-manager docs](https://cert-manager.io/docs/)  
- [ExternalDNS](https://github.com/kubernetes-sigs/external-dns)  
- [Backstage](https://backstage.io/docs/)  
- [Gateway API](https://gateway-api.sigs.k8s.io/)  
- [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive)  
