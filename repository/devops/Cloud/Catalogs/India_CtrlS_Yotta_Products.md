# CtrlS / Yotta (India) — product catalog (what / when / why not)

[← Catalogs](./README.md) · [CtrlS & Yotta literacy →](../14_CtrlS_And_Yotta.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md) · [Datacenter Provider-Use →](../../Datacenter/Provider-Use/README.md)

*Final choice page for India regional cloud / colo-adjacent offerings from **CtrlS** and **Yotta**. SKUs are thinner and more contract-shaped than hyperscalers—still decide with what / when / why not. Deeper detail: vendor portals and your MSA.*

---

## How to read this catalog

| Shape | What it is | When | Why not |
|-------|------------|------|---------|
| **Colo / wholesale / retail DC** | Space, power, cooling, cross-connects | You own/lease metal or cages | You want metered API cloud only |
| **Hosted private cloud / VMware / OpenStack** | Managed virtualization on their halls | India residency + familiar hypervisor | Public hyperscaler already approved |
| **IaaS VMs / VPC-like** | Tenant VMs + network | Elastic compute without owning iron | Need global regions / FM catalogs → AWS/GCP/Azure |
| **Managed Kubernetes / containers** | K8s or container platform SKU | App platform on regional cloud | DIY kubeadm on colo metal (Containerization) |
| **Managed DB / backup / DR** | DBaaS / backup targets | Ops offload in-region | Engine depth → Databases-Deep-Dive + your DBA |
| **Connectivity / IX / cloud on-ramp** | Cross-connect, MPLS, partner interconnect | Hybrid to hyperscaler or enterprise WAN | VPN-only labs |

Plant literacy (halls, power, cages): [Datacenter/](../../Datacenter/README.md). Tenant API habits still map to Floor 1 jobs.

---

## CtrlS — typical product families

| Family | What for | When | Why not |
|--------|----------|------|---------|
| **Data center / colo (tier-rated halls)** | Space + power + interconnect | India colo / DR site | Pure SaaS |
| **Cloud / IaaS (CtrlS Cloud)** | VMs, storage, network as service | India-local cloud procurement | Global multi-region product surface |
| **Private cloud / VMware / managed DC** | Hosted private | Regulated / dedicated | Public shared tenancy OK |
| **Managed services / NOC / SOC add-ons** | Operate for you | Thin staff | You run Day-2 yourself |
| **Backup / DR / replication** | Protect estates | Compliance DR in-country | Single AZ hobby |
| **Network / CDN / security partners** | Edge and circuits | Entry + interconnect | Hyperscaler edge already chosen |
| **GPU / AI infrastructure offers** | Accelerators in-hall | Train/serve in India DC | Hosted FM API on hyperscaler enough |

Exact SKU names move with marketing—map your quote to the **family** row above, then pin the contract SKU in runbooks.

---

## Yotta — typical product families

| Family | What for | When | Why not |
|--------|----------|------|---------|
| **Hyperscale DC / colo** | Halls + power + fabric | Capacity / colo in India hubs | Laptop server under desk |
| **Yotta Cloud / IaaS** | Tenant compute/storage/network | India cloud with DC adjacency | Need AWS-wide SKU catalog |
| **Private / sovereign / dedicated zones** | Stronger isolation | Compliance tenancy | Shared public OK |
| **Managed K8s / PaaS-style offers** | App platform | Faster app landing | Raw VMs preferred |
| **Storage / object / backup** | Durable bits | Artifacts + backups in-country | Only tape van |
| **Connectivity / fabric / on-ramps** | Hybrid | Colo↔cloud↔enterprise | No hybrid need |
| **AI / GPU clusters** | Accelerators | Local train/serve | API-only GenAI |

---

## Choose matrix (India decision)

| Situation | Prefer | Avoid |
|-----------|--------|-------|
| Global product + India users | Hyperscaler region (Mumbai/Delhi/…) + optional colo on-ramp | Forcing all compute onto regional cloud without skill |
| Data residency / tender names CtrlS or Yotta | Their IaaS/private cloud + catalog rows above | Ignoring contract SLAs / shared responsibility |
| You already run metal in their hall | Colo + your hypervisor / kube (Datacenter + Containerization) | Buying IaaS twice for same racks |
| Need Bedrock/Vertex/Azure OpenAI catalog | Hyperscaler AI chapter [33](../33_AI_And_ML_Platforms_On_Cloud.md) | Expecting identical FM SKUs on regional cloud |
| DR in India only | Regional cloud or dual-hall colo | Single hall “DR” |

---

## How to use

1. Separate **landlord** (colo) vs **tenant cloud** (IaaS) in the quote.  
2. Map quote lines → family rows → Floor 1 jobs (IAM, VPC, LB, backup).  
3. Wire estate in [14](../14_CtrlS_And_Yotta.md); plant in [Datacenter Provider-Use](../../Datacenter/Provider-Use/README.md).  
4. Vendor portal / MSA for API and SLA depth.

## References

- CtrlS / Yotta public product pages and your account team docs (pin URLs in the estate runbook—marketing URLs churn).  
