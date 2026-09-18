# 34 — Multi-tier and reference topologies on cloud

[← README](./README.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md) · [LB →](./23_Load_Balancing_Ingress_And_TLS.md) · [Data →](./32_Managed_Data_And_Databases_On_Cloud.md)

---

## Mental map

```text
Users
  → DNS / CDN / edge          ([25](./25_DNS_CDN_And_Edge_HTTP.md))
  → Load balancer + TLS       ([23](./23_Load_Balancing_Ingress_And_TLS.md))
  → App tier (VM | Run | K8s | Functions)
  → Optional async (queue)
  → Data tier (managed DB | DB-on-VM | object)
  → Observability + IAM everywhere ([15](./15_Org_IAM_And_Identity_Federation.md), [30](./30_Cloud_Observability_And_Audit_Doors.md))
```

*What to notice: “6–7 layers” is still one product: **paths and failure domains**. Cloud products fill slots; they do not invent a new networking physics.*

---

## 1. Concepts — classic tiers on cloud

| Tier | Job | Cloud fill |
|------|-----|------------|
| 1. Edge | Cache / WAF / global entry | CDN / Front Door / CloudFront ([25](./25_DNS_CDN_And_Edge_HTTP.md); [Security/WAF](../Security/WAF/README.md)) |
| 2. DNS | Name → entry | Route 53 / Cloud DNS / Azure DNS |
| 3. Load balancing | Distribute + TLS | ALB / Cloud LB / App Gateway ([23](./23_Load_Balancing_Ingress_And_TLS.md)) |
| 4. App / API | Business logic | VM fleets, serverless, managed K8s ([28](./28_Deployment_Shapes_On_Cloud.md), [31](./31_Serverless_Functions_And_Containers.md)) |
| 5. Async | Decouple spikes | Queues / buses (recognize; DE depth elsewhere) |
| 6. Data | Durable state | Managed DB / VM DB / object ([32](./32_Managed_Data_And_Databases_On_Cloud.md), [24](./24_Object_Block_And_File_Storage.md)) |
| 7. Control + signals | Identity, secrets, audit, cost, managed observability | IAM/KMS/budgets ([15](./15_Org_IAM_And_Identity_Federation.md)–[20](./20_FinOps_And_Cost_Controls.md), [26](./26_Secrets_KMS_And_Encryption.md)) + native/Managed Prom/SaaS ([30](./30_Cloud_Observability_And_Audit_Doors.md)) |

**Disconfirm:** Drawing seven boxes in a slide is **not** an architecture if IAM and private networking are missing. Collapsing DB onto the app VM is **not** “simpler production.”

**Confirm:** Which tiers are public? Which are private? What fails if tier 3 dies? If tier 6 dies?

---

## 2. Advanced concepts — reference patterns

### A. Legacy lift (single VM or small group)

```text
DNS → (optional LB) → VM(s) in public or private subnet → disk
```

Use for brownfield and labs. Harden: no public SSH; prefer LB + private VMs ([18](./18_Compute_Instances_And_Autoscaling.md)).

### B. Mainstream 3-tier web

```text
CDN → L7 LB → private app fleet (MIG/ASG/VMSS or Run/K8s) → private managed DB
```

### C. Event-driven

```text
Events → Functions / consumers → queue → workers → DB/object
```

### D. AI-augmented

```text
Users → app tier → managed FM API (Bedrock/Vertex/Azure OpenAI)
                  ↘ retrieval from private object/vector
```

See [33](./33_AI_And_ML_Platforms_On_Cloud.md).

### E. Hybrid

```text
Cloud app tiers ↔ on-ramp ↔ colo data or interconnect ([17](./17_Private_Connectivity_And_On_Ramps.md), [22](./22_Hybrid_Colo_And_Cloud.md))
```

### Failure modes

| Failure | Impact |
|---------|--------|
| Public data tier | Breach |
| Single AZ for all tiers | Zone outage |
| No health checks on LB | Blackhole deploys |
| Secrets in app images | Credential leak |

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First production SaaS | Pattern B + federated CI |
| Cron + uploads | Pattern C |
| Chat feature | Pattern D on top of B |
| Regulated data in colo | Pattern E |

**Staff checklist**

- Tier list written for the system  
- Public vs private labeled  
- Deploy shape per app tier ([28](./28_Deployment_Shapes_On_Cloud.md))  
- Data family chosen ([32](./32_Managed_Data_And_Databases_On_Cloud.md))  
- IAM roles per tier, not one Admin  

**Good:** private data, LB health, least privilege per tier. **Bad:** one public VM that is web+DB+CI.

---

## References

- [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/) · [GCP Architecture Framework](https://cloud.google.com/architecture/framework) · [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)  
- Floor 1 job chapters in this folder  
