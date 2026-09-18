# 12 — Fabric failure walks

[← Previous](./11_Storage_Network_Separation.md) · [README](./README.md)

---

## 1. Concepts

Walk network incidents from **host NIC → ToR → spine → border/MMR**, and separately **OOB**, before blaming applications.

---

## 2. Advanced concepts

### Walk library

| Failure | Expected good | Classic bad |
|---------|---------------|-------------|
| **One NIC down** | Bond/ECMP continues | Single NIC host |
| **ToR A down** | Dual-home to B | Both uplinks on A |
| **Spine down** | ECMP via others | Too few spines |
| **MLAG peer issue** | Contained | Split-brain |
| **OOB down** | Data plane may live; recovery hard | Blind BMC |
| **Provisioning DHCP wrong** | Install fail only | Prod DHCP chaos |
| **MMR XC cut** | Second circuit carries | Single XC |
| **Border fail** | Second ISP/path | One pipe |
| **Optic dirty** | Localized flap | Mass “routing” chase |
| **Storage VLAN congested** | — | App timeouts mis-attributed |

### Independence checklist

- Two cables ≠ two ToRs  
- Two ToRs ≠ two PDUs  
- OOB ≠ data plane  

### How it connects

Storage walks: [Storage-Physical/12](../Storage-Physical/12_Storage_Failure_Walks.md). Power: [Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md). Integration narratives: [Integration](../Integration/README.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Tabletop | Kill ToR A; cut one XC; break OOB switch |
| On-call order | Physical link/DOM → LACP → upstream → DNS |
| RCA | Include cabling photos when relevant |
| Colo | Separate landlord XC tickets from your ToR |

**Staff checklist**

- Diagrams reachable offline  
- Dual-home audited quarterly  
- Optics spares ready  
- OOB monitoring independent  
- Never restart BGP as step 1 for a dark optic  

**Good:** layered walks, evidence from DOM/LACP first. **Bad:** app restart storms; ignored failed ToR; single XC surprise.

---

## References

- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Vendor troubleshooting guides for your switch OS  
- [Accelerators/6](../Accelerators/6_Optics_DAC_AOC_Transceivers.md)  
