# 25 — DNS, CDN, and edge HTTP

[← README](./README.md) · [Load balancing →](./23_Load_Balancing_Ingress_And_TLS.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md)

---

## Mental map

```text
User resolver → Authoritative DNS (your zone)
             → (optional) CDN / edge POP
             → Origin (LB / object / app)
```

*What to notice: DNS is how names find entry points; CDN is a **cache and edge** in front of origin—not a replacement for app correctness.*

---

## 1. Concepts

| Job | Meaning |
|-----|---------|
| **Authoritative DNS** | You publish records (A/AAAA/CNAME/ALIAS/TXT/MX) for a zone |
| **CDN / edge HTTP** | Caches and terminates HTTP near users; pulls from origin |
| **Global entry** | Anycast / Front Door–class product that routes to regions |

Static site + CDN delivery jobs also live in [CiCd/17](../CiCd/17_Static_Sites_And_CDN_Deploy.md).

**Disconfirm:** Pointing DNS at a VM public IP is **not** a platform. CDN “everything cached” does **not** fix unauthenticated APIs.

**Confirm:** Who is authoritative for the zone? What is the origin? What is the TTL for cutover?

---

## 2. Advanced concepts

### Cross-cloud name map

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| DNS | Route 53 | Cloud DNS | Azure DNS | OCI DNS; Aliyun DNS; provider DNS |
| CDN | CloudFront | Cloud CDN | Azure CDN | Many pair with object storage |
| Global HTTP entry | CloudFront / Global Accelerator patterns | Global HTTP LB | Front Door | Product-specific |

### Knobs

| Knob | Why |
|------|-----|
| TTL | Cutover speed vs cache at resolvers |
| Alias/ANAME vs CNAME apex | Apex domain limitations |
| Cache keys / headers | Hit ratio vs correctness |
| Purge / invalidate | Deploy visibility |
| Origin shield / regional origins | Multi-region |

### Failure modes

| Failure | Impact |
|---------|--------|
| Low TTL forgotten after test | Slow rollback |
| CDN caching authenticated HTML | User A sees user B |
| DNS only updated in one provider | Split brain in multi-cloud “DR” |
| Origin still public and weak | CDN bypass attacks |

WAF/edge protect: [Security/WAF](../Security/WAF/README.md). TLS at LB: [23](./23_Load_Balancing_Ingress_And_TLS.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| API cutover | Low TTL ahead of time; LB swap; raise TTL after |
| Static frontend | Object storage + CDN ([CiCd/17](../CiCd/17_Static_Sites_And_CDN_Deploy.md)) |
| Global users | CDN or global entry → regional origins |
| Hybrid | DNS weighted/failover only after health is real ([22](./22_Hybrid_Colo_And_Cloud.md)) |

**Staff checklist**

- Zone ownership documented  
- Origin private or hardened  
- Cache rules match content type  
- Purge path known for releases  
- Cutover TTL plan written  

**Good:** DNS → CDN/LB → private origin. **Bad:** apex A record to one VM forever.

---

## References

- [Route 53](https://docs.aws.amazon.com/route53/) · [Cloud DNS](https://cloud.google.com/dns/docs) · [Azure DNS](https://learn.microsoft.com/azure/dns/)  
- [CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/) · [Cloud CDN](https://cloud.google.com/cdn/docs) · [Azure Front Door](https://learn.microsoft.com/azure/frontdoor/)  
