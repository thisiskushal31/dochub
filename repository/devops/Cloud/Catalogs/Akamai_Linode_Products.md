# Akamai Linode / VPS kin — product catalog (what / when / why not)

[← Catalogs](./README.md) · [VPS kin literacy →](../21_Akamai_Linode_And_VPS_Kin.md) · [Shared jobs →](../15_Org_IAM_And_Identity_Federation.md)

*Final choice page for **Linode (Akamai Cloud Computing)** and close VPS kin (DigitalOcean, Vultr, Hetzner, etc.). Thinner catalogs than hyperscalers—still what / when / why not. Deeper API: [linode.com/docs](https://www.linode.com/docs/).*

## Linode / Akamai Cloud Computing

| Product | What for | When | Why not |
|---------|----------|------|---------|
| **Linodes (VMs)** | VMs | Simple apps, predictable VPS | Need org-scale IAM/SCP → AWS/GCP/Azure |
| **CPU / dedicated / GPU / high-memory plans** | Shape classes | Match workload | Oversize “just in case” |
| **LKE** | Managed Kubernetes | Need kube on Linode | Single VM + Docker enough |
| **Akamai App Platform / containers offers** | App platform variants | Those products | DIY LKE/VM |
| **NodeBalancers** | LB | Multi-Linode HTTP/TCP | Single instance |
| **Object Storage** | S3-compatible object | Artifacts, backups, static | Block for DB |
| **Block Storage / NVMe** | Extra volumes | DB/data disks | Object for artifacts |
| **Images / StackScripts** | Golden image / bootstrap | Repeatable VMs | Snowflakes |
| **VPC / firewall / VLAN** | Network isolation | Private backends | Public-everything labs |
| **DNS / Domains** | DNS | Zones | — |
| **Managed DB (MySQL/Postgres/…)** | DBaaS | Offload DB ops | App + disk on one Linode for toys |
| **Backups / Linode Backup** | Snapshots | Protect VMs | App-level only |
| **Akamai CDN / edge (adjacent)** | CDN / edge security | Global HTTP | VPS-only internal tools |

## VPS kin (same jobs, different brands)

| Kin | What for | When | Why not |
|-----|----------|------|---------|
| **DigitalOcean Droplets / DOKS / Spaces / Managed DB** | Simple cloud | Startups, tutorials, small prod | Enterprise org guardrails |
| **Vultr / Hetzner Cloud / Lightsail-class** | Cheap VMs + extras | Cost-sensitive / EU metal-ish | Full enterprise landing zone |
| **Managed K8s on kin** | Kube without hyperscaler | Small clusters | Need EKS/GKE/AKS ecosystem |

**When VPS kin:** small surface, price clarity, fewer IAM concepts. **Why not:** multi-account landing zones, deep FM catalogs, regulated shared-responsibility paperwork that names a hyperscaler.

## How to use

1. Job → When / Why not (VM vs LKE vs Object vs Managed DB).  
2. Read [21](../21_Akamai_Linode_And_VPS_Kin.md)—VPS ≠ colo.  
3. [Linode docs](https://www.linode.com/docs/) (or kin docs) for API/limits.

## References

- [Akamai Cloud Computing / Linode](https://www.linode.com/products/)  
