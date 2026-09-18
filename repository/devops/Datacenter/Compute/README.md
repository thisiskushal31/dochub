# Compute

[← Datacenter](../README.md)

Server platforms, CPU, chipset/I/O, memory, NUMA allocation, BMC/Redfish, and boot—the **hypervisor-killer** and bare-metal core.

### Chapter structure

Concepts → Advanced → Applications → References (official only).

## Chapters

| # | File | Focus | Status |
|---|------|--------|--------|
| 1 | [Server form factors](./1_Server_Form_Factors.md) | 1U/2U/4U, blade/chassis, multi-node, OCP/Open Rack | **filled** |
| 2 | [CPU platforms: Intel Xeon](./2_CPU_Platforms_Intel_Xeon.md) | Xeon generations; sockets; chiplets literacy | **filled** |
| 3 | [CPU platforms: AMD EPYC](./3_CPU_Platforms_AMD_EPYC.md) | EPYC generations; CCD/IOD ideas | **filled** |
| 4 | [CPU platforms: ARM and others](./4_CPU_Platforms_ARM_And_Others.md) | Ampere/Axion-class; when ARM appears in halls | **filled** |
| 5 | [Chipset, PCIe, and platform I/O](./5_Chipset_PCIe_And_Platform_IO.md) | PCIe gens/lanes; roots; CXL literacy | **filled** |
| 6 | [CPU interconnect ideas](./6_CPU_Interconnect_Ideas.md) | UPI / Infinity Fabric / equivalent *as ideas* | **filled** |
| 7 | [Memory: DIMM types and channels](./7_Memory_DIMM_Types_And_Channels.md) | DDR4/5, MCRDIMM; channels; ranks | **filled** |
| 8 | [Memory population and NUMA](./8_Memory_Population_And_NUMA.md) | Population rules; NUMA nodes; imbalance | **filled** |
| 9 | [Allocation model: socket to DIMM](./9_Allocation_Model_Socket_To_DIMM.md) | Sockets → NUMA → cores → caches → DIMM → PCIe | **filled** |
| 10 | [BMC, IPMI, and Redfish deep](./10_BMC_IPMI_And_Redfish_Deep.md) | Sensors, virtual media, inventory, security | **filled** |
| 11 | [Firmware trains and Secure Boot](./11_Firmware_Trains_And_Secure_Boot.md) | BIOS/BMC/NIC/RAID firmware; TPM; Secure Boot | **filled** |
| 12 | [Boot: UEFI, RAID, NVMe, SAN](./12_Boot_UEFI_RAID_NVMe_SAN.md) | Boot paths; HBA vs NVMe; SAN boot brownfield | **filled** |
| 13 | [NICs, HBAs, and slot planning](./13_NICs_HBAs_And_Slot_Planning.md) | Slot budget; bifurcation; dual-home | **filled** |
| 14 | [Thermal and power of the box](./14_Thermal_And_Power_Of_The_Box.md) | PSU redundancy; inlet; derating | **filled** |
| 15 | [Imaging and provisioning at scale](./15_Imaging_And_Provisioning_At_Scale.md) | PXE, MAAS/Foreman/Ironic, Redfish media | **filled** |
| 16 | [Spares and SKU discipline](./16_Spares_SKU_Discipline.md) | Same SKU spares; mixed fleets | **filled** |
| 17 | [Compute failure walks](./17_Compute_Failure_Walks.md) | Dead node; bad DIMM; BMC unreachable | **filled** |
| 18 | [Hypervisor on the box map](./18_Hypervisor_On_The_Box_Map.md) | ESXi/KVM/Hyper-V placement → on-ramp 7–8 | **filled** |

On-ramp survey: [../4_Rack_BMC_And_Provisioning.md](../4_Rack_BMC_And_Provisioning.md), [../7_VMware_vSphere.md](../7_VMware_vSphere.md), [../8_Other_Hypervisors_And_Private_IaaS.md](../8_Other_Hypervisors_And_Private_IaaS.md).

## Related

- [Accelerators/](../Accelerators/README.md) · [White-Space/](../White-Space/README.md) · [Jobs/](../Jobs/README.md) · [Integration/](../Integration/README.md)  
