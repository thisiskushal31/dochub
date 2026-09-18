# 8 — Crash cart, KVM, and serial aggregation

[← Previous](./7_Asset_Tags_Serials_And_Elevations.md) · [README](./README.md) · [Next: AI-ready white space →](./9_High_Density_And_AI_Ready_White_Space.md)

## 1. Concepts

When BMC/network identity is dead or you need BIOS-level access, white space still needs a **break-glass console path**.

| Tool | Job |
|------|-----|
| **Crash cart** | Monitor/keyboard/mouse on wheels (+ USB/ISO tools) |
| **Local KVM** | Direct console at rack |
| **KVM over IP** | Remote keyboard/video (often via BMC or dedicated) |
| **Serial console / aggregation** | USB-serial or serial servers for headless gear (switches, PDUs, legacy) |
| **Virtual media** | Mount ISO via BMC ([Compute](../Compute/README.md)) |

### Where it sits

Crash carts parked at ends of aisles or in staging; serial aggregators in management racks on OOB networks ([on-ramp 5](../5_Fabric_Cross_Connect_And_OOB.md)); KVM appliances in secure management cages.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| No charged cart / missing dongles | Extended outage |
| Wrong video adapter (VGA/DP/USB-C) | Can’t see POST |
| Serial baud mismatch | Garbage console |
| KVM shared without AAA | Security incident |
| Relying only on in-band SSH | Blind when NIC/OS dead |
| Virtual media blocked by policy mid-incident | Can’t recover image |

### How it connects

```text
Break-glass → crash cart / serial / BMC KVM → fix boot/network → return to normal OOB tools
```

Remote hands often perform crash-cart steps from a ticket SOP—spell adapters and baud rates explicitly.

### Security

Console access is root-equivalent. Log use, lock carts, and keep OOB on isolated networks. Jobs/security culture: [Jobs](../Jobs/README.md), on-ramp [11](../11_Identity_Access_And_Change.md).

### Global variants

Connector zoos differ by OEM generation. Keep a dongle kit per site standard—not per engineer’s backpack alone.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| OS won’t boot | BMC virtual media first; crash cart if BMC dead |
| Switch bricked config | Serial aggregators + known-good cable |
| Colo without on-site staff | Smart Hands crash-cart SOP with photos |
| Drill | Quarterly find-the-cart + boot a lab node |

**Staff checklist**

- Cart charged; adapters inventoried  
- Serial baud/parity cheat sheet on cart  
- OOB/KVM AAA working  
- Ticket notes include U/serial before console work  
- Never leave logged-in console unattended  

**Good:** tested break-glass path, stocked dongles, logged use. **Bad:** BMC-only faith; missing DP dongle at 03:00; shared KVM admin/admin.

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [OpenBMC](https://www.openbmc.org/)  
