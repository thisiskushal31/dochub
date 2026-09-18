# 3 — OOB management network

[← Previous](./2_ToR_EoR_MoR.md) · [README](./README.md) · [Next: Provisioning network →](./4_Provisioning_Network.md)

---

## 1. Concepts

The **out-of-band (OOB)** network reaches BMCs, console servers, PDU meters, and sometimes management ports of switches—when the data plane is sick or unconfigured.

### Separation rules (jobs)

| Rule | Why |
|------|-----|
| Distinct VLAN/VRF/switch fabric | Blast radius + security |
| No internet exposure | BMC exploit surface |
| AAA / vaulted creds | Audit |
| Dual path preference | OOB survives PDU A loss |

### Where it sits

Dedicated ToR/Mgmt switches or isolated VRF; firewall jump hosts; on-ramp survey [../5_Fabric_Cross_Connect_And_OOB.md](../5_Fabric_Cross_Connect_And_OOB.md). BMC deep: [Compute/10](../Compute/10_BMC_IPMI_And_Redfish_Deep.md).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| OOB on prod leaf only | Dark when leaf dies (ironic) |
| Shared NIC BMC mode misunderstood | Bridging risk |
| Flat default passwords | Estate own |
| No DNS/NTP on OOB | Cert/time pain |
| Single mgmt switch | OOB SPOF |

### How it connects

Provisioning may be adjacent but should not equal prod ([4](./4_Provisioning_Network.md)). Serial aggregators live here ([Accelerators/8](../Accelerators/8_Serial_Console_Servers.md)).

### Global variants

Same jobs; some colo offer managed OOB—still isolate credentials and document ownership.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Day-0 rack | Cable BMC before imaging |
| Incident | OOB first, not SSH hope |
| Audit | Scan for BMCs on prod subnets (should be zero) |
| Design | OOB survives loss of any one data leaf |

**Staff checklist**

- BMC inventory on OOB only  
- Jump host required  
- Creds vaulted  
- Mgmt switches dual-powered  
- Never port-forward BMC to the world  

**Good:** isolated OOB, jump, monitored. **Bad:** BMC on prod; default creds; OOB dies with the leaf it manages.

---

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NIST](https://www.nist.gov/) (mgmt plane hygiene themes)  
- On-ramp [5](../5_Fabric_Cross_Connect_And_OOB.md)  
