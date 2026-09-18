# 16 — Spares and SKU discipline

[← Previous](./15_Imaging_And_Provisioning_At_Scale.md) · [README](./README.md) · [Next: Failure walks →](./17_Compute_Failure_Walks.md)

---

## 1. Concepts

**SKU discipline** means the fleet is composed of a small set of approved configurations. **Spares** are cold/hot replacements that match those SKUs—DIMMs, PSUs, fans, NICs, whole nodes.

Without discipline, every failure becomes an engineering project.

### What a SKU record holds

| Field | Why |
|-------|-----|
| Board/CPU/memory map | Population & topology |
| Riser/NIC/HBA BOM | Slot plan |
| PSU wattage | Power/thermal |
| Firmware train | Compatibility |
| Rail kit / U height | White space fit |
| Image profile | Provisioning |

---

## 2. Advanced concepts

### Failure modes of mixed fleets

| Failure | Impact |
|---------|--------|
| Unique one-off server | No spare; long MTTR |
| Same model different riser | Card won’t fit |
| DIMM QVL drift | Unsupported mixes |
| “Close enough” NIC | Driver/firmware mismatch |
| Spares consumed by lab silently | Production stockout |

### Spares math literacy

- Failure rate × fleet size × lead time  
- Critical path parts (PSU, fan, DIMM, boot drive)  
- Whole-node spare for tight SLAs  

### How it connects

Asset tags/elevations: [White-Space/7](../White-Space/7_Asset_Tags_Serials_And_Elevations.md). Firmware trains: [11](./11_Firmware_Trains_And_Secure_Boot.md). Purchasing must freeze BOM changes through CAB.

### Global variants

Lead times differ by region; keep spares near the hall that needs them. Colo remote hands can swap only if SKU parts are on-site or shipped with ticket.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New platform intro | Cap to 1–2 SKUs; kit spares before prod |
| Vendor swap | Dual-running SKUs with clear naming |
| Audit | Count orphans not on SKU list |
| Incident | Spare node rebuild > heroic parts mix |

**Staff checklist**

- Approved SKU list published  
- Spares inventory accurate  
- BOM changes go through change  
- Labels show SKU on chassis  
- Never raid production spares for “temporary lab” without tracking  

**Good:** few SKUs, kits on site, CMDB match. **Bad:** 40 unique snowflakes; empty spare cage; mystery risers.

---

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish) (inventory for drift)  
- OEM spare parts / FRU documentation for your platforms  
- ITIL-ish change practices as org uses (no cert dump)  
- [TIA-606](https://tiaonline.org/) (labeling/admin literacy)  
