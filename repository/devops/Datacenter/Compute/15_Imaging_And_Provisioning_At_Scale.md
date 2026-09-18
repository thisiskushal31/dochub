# 15 — Imaging and provisioning at scale

[← Previous](./14_Thermal_And_Power_Of_The_Box.md) · [README](./README.md) · [Next: Spares SKU →](./16_Spares_SKU_Discipline.md)

---

## Mental map

```text
PXE VLAN ──► install ──► port flip ──► prod
     or
BMC Redfish virtual media ──► install (OOB)
```

Playbook depth: [Setup-And-Bring-Up/9](../Setup-And-Bring-Up/9_Imaging_Path.md) · VLAN flip: [Setup/6](../Setup-And-Bring-Up/6_LAN_Segmentation_Jobs.md).

### Operator experience (verify locally)

Operators often PXE on a dedicated VLAN then automate the switchport to production; others invent with Redfish and skip in-band PXE. Pin images; don’t share DHCP across BMC and prod. Pilot before 100×.

---

## 1. Concepts

**Provisioning** turns empty metal into a known OS/firmware state repeatedly. At scale you need identity (which serial?), network boot or virtual media, config, and verification—not USB sticks per node.

### Common tool patterns

| Pattern | Examples (illustrative) |
|---------|-------------------------|
| **PXE / iPXE + DHCP** | Classic network boot |
| **Ironic / MAAS / Foreman / Cobbler** | Metal lifecycle managers |
| **Redfish virtual media + boot** | OOB ISO mount |
| **OEM portals / SUTs** | Vendor imaging suites |
| **Config mgmt after first boot** | Ansible etc. ([Automation](../Automation/README.md)) |

### Where it sits

OOB + PXE VLANs; image servers; secrets for BMC; CMDB identity. On-ramp survey: [4](../4_Rack_BMC_And_Provisioning.md). Delivery pipelines: [CiCd](../CiCd/README.md).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| DHCP/PXE wrong VLAN | Node won’t boot install |
| Duplicate MAC/IP identity | Wrong hostname/certs |
| Image drift | Snowflake nodes |
| Secure Boot mismatch | Install rejected ([11](./11_Firmware_Trains_And_Secure_Boot.md)) |
| No idempotent re-image | Slow rebuilds |
| Secrets in clear images | Compromise |

### Pipeline literacy

1. Discover serial/BMC inventory  
2. Apply firmware train  
3. Image OS  
4. Join identity/config  
5. Conformance tests (disk, NIC, NUMA expectations)  
6. Hand to app/platform  

### How it connects

Arch (arm64 vs amd64) must match ([4](./4_CPU_Platforms_ARM_And_Others.md)). Hypervisor vs OS image choice: [18](./18_Hypervisor_On_The_Box_Map.md).

### Global variants

Tool names differ; durable jobs—discover, firmware, image, configure, verify—do not.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Fleet of 50+ | Metal manager + Redfish; ban USB as primary |
| Break/fix | Re-image same SKU from golden pipeline |
| Air-gapped | Local image vault + signed artifacts |
| Colo | OOB reachability before first PXE attempt |

**Staff checklist**

- Identity from serial/BMC not sticky notes  
- Images signed/versioned  
- PXE/OOB documented per site  
- Re-image tested quarterly  
- Never handcraft production nodes as the standard path  

**Good:** repeatable metal pipeline, conformance gates. **Bad:** USB heroes; undocumented PXE; golden image from 2019.

---

## References

- [OpenStack Ironic](https://docs.openstack.org/ironic/)  
- [MAAS](https://maas.io/docs)  
- [The Foreman](https://theforeman.org/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [iPXE](https://ipxe.org/)  
