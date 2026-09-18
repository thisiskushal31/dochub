# 2 — Ownership, colo, and contracts

[← Previous](./1_On_Prem_As_A_Solution.md) · [README](./README.md) · [Next: Facility →](./3_Facility_Power_Cooling_And_Rooms.md)

---

## 1. Concepts

“We are in a datacenter” is not a design. The design is **who owns which layer** when the lights go out.

| Model | Building / power | Servers | OS / hypervisor | Application |
|-------|------------------|---------|-----------------|-------------|
| **Owned DC** | You | You | You | You |
| **Colocation** | Operator | You (usually) | You | You |
| **Cage / cabinet / suite** | Operator | You | You | You — different lock and kW, same idea |
| **Hosted private cloud** | Operator | Operator | Often VMware; you get vCenter or a portal | You |
| **Dedicated / bare-metal rental** | Operator | Operator’s iron, your OS | You | You |
| **Remote hands / smart hands** | Operator people | You still own config | You | You — they press the button you wrote |
| **Public IaaS** | Provider | Provider | Provider hypervisor; you get VMs | You |

Fill this table from the **contract**, not from a slide. CtrlS/Yotta as **named providers**: [Cloud/14](../Cloud/14_CtrlS_And_Yotta.md). OVH dedicated metal: [Cloud/12](../Cloud/12_OVHcloud.md). T-Systems running VMware for you: this chapter + [7](./7_VMware_vSphere.md), not Open Telekom Cloud public ([Cloud/13](../Cloud/13_Deutsche_Telekom.md)).

### What colo actually sells

The operator sells **reliable watts, cooling, physical security, and a place to land a circuit**. They do not sell your SLA for etcd, vCenter, or the app. If power is 99.999% and you put both PDUs on one UPS path inside the cabinet, the operator still met their number.

Typical units:

- **U** in a shared cabinet, a **full cabinet**, a **cage**, or a **suite**  
- **Committed kW** (and what happens when you draw more)  
- **Cross-connects** in the meet-me room (MMR) — a cable or provisioned circuit, billed monthly  
- **Remote hands** (reboot, reseat, read a serial) vs **smart hands** (follow a longer SOP)  
- **Physical access** hours, escorts, two-person rules  

### Who you page

Write three names:

1. **Facility** — power, cooling, door, leak  
2. **Network** — their border vs your ToR vs the carrier  
3. **Compute** — BMC, OS, hypervisor, app  

If those three are “the vendor,” you will discover at 3am that the vendor is three companies.

---

## 2. Advanced concepts

### Contract gotchas (read before you rack)

| Clause | Why it bites |
|--------|----------------|
| **Power draw vs committed kW** | Overdraw can mean they shed you, or bill punitive rates |
| **Power A+B** | Two whip colors in the cabinet is not 2N if they share an upstream |
| **Remote-hands SLA** | Minutes to a human with a badge, not minutes to a healthy VM |
| **Cross-connect lead time** | Days/weeks; your “go-live” is the circuit, not the YAML |
| **Insurance and listed equipment** | Their policy vs yours for gear in the cage |
| **Audit / visitor** | Who can walk in for a SOC2 evidence photo |
| **Early termination / relocation** | They move halls; your BGP and serials move with you |
| **Network: blended vs DIY** | Their internet vs your own carriers in the MMR |

**Equinix-class, CtrlS-class, campus hyperscale** are different products that all get called “colo.” A retail cabinet in a meet-me-rich IBX is not a hyperscale campus with your own spine. Ask what **carriers and IXes** are already in the MMR.

### Owned DC vs colo

Owned DC: you also own generators, fuel contracts, chillers, and the people who test them. Colo: you own the **IT load inside the paint**. Neither is “free.” Owned makes sense at scale or when the building *is* the plant. Colo makes sense when you want a real hall without becoming a facilities company.

### Hosted private cloud vs colo

Hosted vCenter: they patch ESXi; you open tickets for more RAM. You traded BMC access for a portal. That is valid. It is **not** colo, and it is **not** AWS. Snapshot policy, datastore backing, and who backs up vCenter are still your questions — [7](./7_VMware_vSphere.md).

### Dedicated metal rental

A dedicated server (OVH Bare Metal and kin) is **metal you did not rack**. kubeadm on it is still Kubernetes 7 ops. You usually get a BMC/KVM over a vendor portal, not a cage badge. Spare-parts lead time is their SLA, not a shelf in your storeroom.

### Edge and “the office server room”

A closet with a domestic UPS is not colo. It can still be **on-prem** ([1](./1_On_Prem_As_A_Solution.md)). Write it as a single failure domain. Do not sell it as a DR site for the hall.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Indian residency + your hardware | Colo (CtrlS/Yotta, …) + this table filled |
| Indian residency, less metal ops | Their hosted VMware or regional cloud SKU |
| EU / US retail colo | Equinix/Digital Realty-class + your carriers in the MMR |
| “T-Systems runs VMware” | Hosted private; you never get BMC |
| First production rack | Cabinet with A+B, two U for ToR, documented remote-hands SOP before the first OS |

**Staff checklist**

- Table above filled from the MSA, not from marketing  
- kW committed vs expected IT load  
- A+B power **path** named, not only two cables  
- Cross-connects: who, to whom, LOA/CFA process  
- Remote-hands: what they will and will not do; photo of serial required  
- Who holds BMC passwords vs cage badges vs vCenter  
- Spare iron: on-site, vendor, or “open a PO”  

**Good:** contract maps to the table; remote-hands SOP with serials; MMR circuit IDs in the runbook. **Bad:** “we’re in CtrlS” with one PDU, shared cabinet, no LOA, app team holding the only cage key.

**Disconfirm:** Colo is **not** the same as hosted VMware or public IaaS. Two power cords are **not** two independent plants until the one-line says so.

**Confirm:** Who owns the building, the iron, the OS, and the app in *your* deal? What does remote hands refuse to do?

---

## Go deeper

- Order and interconnect jobs: [Provider-Use/](./Provider-Use/README.md)  
- Operator kinds and regions: [Markets-And-Operators/](./Markets-And-Operators/README.md)  
- Reading landlord reports: [Jobs/13](./Jobs/13_Reading_Dashboards_Reports_And_Steering.md)  

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/) (facility rating language used in RFPs)  
- [Equinix IBX / colo](https://www.equinix.com/data-centers/colocation)  
- [CtrlS](https://www.ctrls.com/)  
- [Yotta](https://www.yotta.com/)  
- [OVHcloud Bare Metal](https://www.ovhcloud.com/en/bare-metal/)  
