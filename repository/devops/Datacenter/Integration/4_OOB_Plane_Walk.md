# 4 — OOB plane walk

[← Previous](./3_Disk_To_Array_To_Host.md) · [README](./README.md) · [Next: Lose PDU A →](./5_Failure_Lose_PDU_A.md)

---

## 1. Concepts

The **out-of-band plane** reaches BMCs, console servers, PDU meters, and often switch mgmt—when production networking or OS is dead.

```text
Operator → jump host → OOB network → BMC / console server / PDU / mgmt ports
```

Parallel to [2](./2_NIC_To_MMR.md). Homes: [Fabric-Physical/3](../Fabric-Physical/3_OOB_Management_Network.md), [Compute/10](../Compute/10_BMC_IPMI_And_Redfish_Deep.md), [Accelerators/8](../Accelerators/8_Serial_Console_Servers.md).

---

## 2. Advanced concepts

### Independence checkpoints

| Claim | Verify |
|-------|--------|
| OOB ≠ prod leaf only | Survives data ToR loss |
| Creds vaulted | No defaults |
| Dual power on mgmt switches | PDU diversity |
| Serial fallback | When BMC dies |

### Failure modes

OOB down during data outage = flying blind. Provisioning VLAN related but distinct ([Fabric-Physical/4](../Fabric-Physical/4_Provisioning_Network.md)).

### Global variants

iDRAC/iLO/Redfish UIs differ; plane jobs identical.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Day-0 rack | Cable BMC before imaging |
| Incident | OOB first for power/console |
| Audit | Zero BMCs on prod subnets |
| Colo | Know landlord vs customer OOB ownership |

**Staff checklist**

- Jump path documented offline  
- Inventory of BMC IPs/serials  
- Console server port map  
- Never expose BMC to internet  

**Good:** isolated, dual-powered OOB. **Bad:** BMC on prod; single mgmt switch.

---

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [Fabric-Physical/3](../Fabric-Physical/3_OOB_Management_Network.md)  
- On-ramp [5](../5_Fabric_Cross_Connect_And_OOB.md)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
