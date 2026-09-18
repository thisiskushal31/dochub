# 23 — Load balancing, ingress, and TLS

[← README](./README.md) · [VPC →](./16_VPC_And_Network_Constructs.md) · [DNS/CDN →](./25_DNS_CDN_And_Edge_HTTP.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md)

---

## Mental map

```text
Client → (optional CDN / global anycast) → Load balancer (L4 or L7 + TLS)
       → healthy targets (VMs / containers / functions)
```

*What to notice: LB settings (health check, idle timeout, sticky, TLS policy) are **knobs on the same job**. Product names differ; unhealthy targets and wrong certs fail the same way.*

---

## 1. Concepts

A **load balancer** distributes traffic across targets and usually terminates or passes TLS. It is how the internet (or a private network) reaches your fleet without pinning to one VM IP.

### L4 vs L7

| Kind | Works on | Typical use |
|------|----------|-------------|
| **L4** (TCP/UDP) | Ports and connections | Databases proxies, raw TCP, extreme throughput |
| **L7** (HTTP/HTTPS) | Host, path, headers | Web APIs, host-based routing, WAF attachment |

### Jobs every cloud LB must answer

| Job | Question |
|-----|----------|
| Listeners | Which ports/protocols? |
| Targets | Which instances/IPs/pods? |
| Health checks | When is a target out? |
| TLS | Where do certs live; which policy? |
| Stickiness | Session affinity needed? |
| Idle timeout | Long uploads/WebSockets? |
| Scheme | Internet-facing vs internal |

**Disconfirm:** A Kubernetes `Service type: LoadBalancer` is **not** magic—it asks the cloud controller to create a *provider* LB. Without cloud permissions and subnet tags, it stays `<pending>`.

**Confirm:** Is your entry L4 or L7? Who owns the certificate? What fails when all targets are unhealthy?

Packet depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Edge HTTP/CDN: [25](./25_DNS_CDN_And_Edge_HTTP.md). WAF products: [Security/WAF](../Security/WAF/README.md).

---

## 2. Advanced concepts

### Cross-cloud product map

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| L7 HTTP(S) | ALB | Cloud Load Balancing (HTTP) | Application Gateway / Front Door (global) | OCI LB; Aliyun SLB/ALB; Tencent CLB; IBM LB |
| L4 | NLB | TCP/UDP LB | Azure Load Balancer | Similar regional L4 products |
| Gateway / mesh edge | Gateway API + controller | Same idea | Same | Provider CCM + Ingress |
| Certs | ACM | Certificate Manager | Key Vault / App Gateway certs | Provider cert managers |

Quirks that bite:

| Quirk | Example |
|-------|---------|
| Regional vs global | Azure Front Door / some GCP HTTP LBs vs classic regional ALB |
| Proxy protocol / X-Forwarded-For | App must trust LB hop, not client IP blindly |
| Connection draining | Deploys need drain time or you cut in-flight requests |
| Internal only | Private LB still needs DNS and routing ([16](./16_VPC_And_Network_Constructs.md)) |

### Kubernetes entry shapes

| Shape | Meaning |
|-------|---------|
| `Service type: LoadBalancer` | Cloud LB per Service (can get expensive / chatty) |
| Ingress / Gateway | L7 routing in-cluster or via cloud L7 |
| NodePort + external LB | Explicit wiring; common in brownfield |

OpenShift **Routes** are a different API ([OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift)) — do not assume Ingress objects on ROSA/ARO/ROKS without checking.

### Failure modes

| Failure | What you see |
|---------|----------------|
| Bad health check path | Targets flapping or never healthy |
| Cert mismatch / expired | Browser/API TLS errors |
| SG/NSG blocks LB→node | Health fails; 502/503 |
| Idle timeout too low | WebSocket / long poll drops |
| Single AZ targets | AZ outage = total outage |

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Public HTTPS API | L7 LB + managed cert + private targets |
| Internal microservice | Internal LB or mesh; no public IP |
| K8s web app | Ingress/Gateway → pods; one cloud L7 where possible |
| TCP legacy | L4 NLB-class; health on TCP or custom |

**Staff checklist**

- L4 vs L7 chosen deliberately  
- Health check matches real readiness  
- TLS policy and cert renewal owned  
- Drain / deregistration delay set for deploys  
- Security filters allow LB → targets only  

**Good:** private targets, proven health, cert automated. **Bad:** public nodes, no health check, cert in a ticket folder.

---

## References

- [AWS ELB](https://docs.aws.amazon.com/elasticloadbalancing/) · [GCP Load Balancing](https://cloud.google.com/load-balancing/docs) · [Azure Load Balancer](https://learn.microsoft.com/azure/load-balancer/) · [Application Gateway](https://learn.microsoft.com/azure/application-gateway/)  
- [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/) · [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) · [Gateway API](https://gateway-api.sigs.k8s.io/)  
