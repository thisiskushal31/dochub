# Virtualization, hypervisors, and the datacenter

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers **virtualization** and **hypervisors** in an **OS-agnostic** way: how VMs get CPU, memory, and I/O; how the datacenter shares and divides resources. Platform-specific setup (e.g. KVM on Linux, Hyper-V on Windows) is in [Linux](../Linux/14_Virtualization_On_Linux.md) and [Windows](../Windows/4_Virtualization_And_Storage_Advanced.md).

---

## 1. What is virtualization?

**Virtualization** means running one or more **guest** operating systems (or workloads) on top of a **host**. Each guest believes it has its own CPU(s), RAM, and disks. In reality, a **virtualization layer** (the **hypervisor** or host kernel) **multiplexes** physical hardware and presents each guest with **virtual** resources.

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  Guest 1 (OS)    Guest 2 (OS)    Guest 3 (OS)                   │
  │  "My CPU, RAM, disk"  "My CPU, RAM, disk"  "My CPU, RAM, disk"  │
  └─────────────────────────────────────────────────────────────────┘
                                    │
  ┌─────────────────────────────────────────────────────────────────┐
  │ Hypervisor (or host kernel + VMM)                               │
  │ Schedules CPU, partitions or overcommits memory, virtualizes I/O│
  └─────────────────────────────────────────────────────────────────┘
                                    │
  ┌─────────────────────────────────────────────────────────────────┐
  │  Physical: CPUs, RAM, disks, network                            │
  └─────────────────────────────────────────────────────────────────┘
```

---

## 2. Type 1 vs Type 2 hypervisors

| Type | Runs on | Examples | Typical use |
|------|---------|----------|-------------|
| **Type 1 (bare-metal)** | Directly on **hardware**; no host OS under it | VMware ESXi, Microsoft Hyper-V, KVM (Linux kernel), Xen | Datacenter servers; one hypervisor, many VMs. |
| **Type 2 (hosted)** | As an **application** on a host OS | VMware Workstation, VirtualBox, Parallels | Desktops/laptops; developer VMs. |

- **Type 1:** The hypervisor is the “OS” that boots; it owns CPU, memory, and devices and runs guests in VMs. Lowest overhead; used in datacenters.
- **Type 2:** The host OS (e.g. Windows, Linux) runs normally; a **VMM (Virtual Machine Monitor)** app creates VMs. More overhead but easy to install and use on a single machine.

---

## 3. CPU virtualization

The CPU must run guest code in a way that:
- Keeps the guest **isolated** (cannot touch other VMs or the hypervisor).
- Handles **sensitive instructions** that would change real hardware state (e.g. change page tables, disable interrupts). If the guest ran these directly, it would break the host.

**Mechanisms:**

- **Trap-and-emulate:** Guest runs at a **reduced privilege** (e.g. non-root). When it executes a sensitive instruction, the CPU **traps** to the hypervisor, which **emulates** the effect for that guest’s virtual state (e.g. virtual CR3, virtual interrupt flag).
- **Hardware support:** **Intel VT-x** and **AMD-V** add a **guest mode** and **VM exits**. When the guest does something that affects “real” hardware or needs the hypervisor, the CPU **exits** to the hypervisor, which updates virtual state and resumes the guest. This makes virtualization efficient (no binary translation for most instructions).

```
  Guest executes "load page-table base" (sensitive)
       → CPU triggers VM exit
       → Hypervisor: update *virtual* page-table pointer for this VM, then resume guest
  Guest continues; it only sees its own “hardware”.
```

The hypervisor **schedules** vCPUs onto physical CPUs (cores): each vCPU is a thread or process that the host scheduler runs. So “shared CPU” in the datacenter means: many vCPUs from many VMs are time-sliced on a smaller number of physical cores.

---

## 4. Memory virtualization

Each VM has a **guest physical address space** (what the guest OS thinks is “physical” RAM). The hypervisor maps **guest physical** → **machine physical** (real RAM).

- **Shadow page tables (older):** The hypervisor maintains a shadow copy of page tables that translate **guest virtual** → **machine physical**. On guest TLB miss or page-table write, the hypervisor updates the shadow. Costly.
- **Extended page tables (EPT / NPT):** Hardware supports a second level of translation: **guest virtual** → **guest physical** (guest’s page tables) → **machine physical** (hypervisor’s tables). The CPU does both lookups; the hypervisor only manages the guest-physical → machine-physical mapping. This is how **memory is divided** between VMs: the hypervisor gives each VM a set of machine-physical pages (or overcommits by swapping or ballooning).

**Memory overcommit:** The hypervisor can assign more total “guest RAM” than physical RAM. When memory is tight, it may:
- **Swap** guest “physical” pages to disk (hypervisor swap).
- Use a **balloon driver** inside the guest: the driver “inflates” (allocates guest RAM and tells the hypervisor “this is free”), so the hypervisor can reuse that machine RAM; “deflate” when the guest needs memory again.

So in the datacenter: **memory division** = each VM gets a slice of machine RAM (or an overcommitted slice), enforced by the hypervisor via EPT/NPT and optionally balloon/swap.

---

## 5. I/O and devices

Guests usually do **not** own real disks or NICs. The hypervisor (or host) gives each VM **virtual** devices:

- **Emulated:** Software emulation (e.g. legacy IDE disk). Simple, compatible, slower.
- **Paravirtualized (PV):** Guest knows it’s virtualized; uses special drivers that call the hypervisor for I/O. Fewer traps, better performance.
- **Pass-through / SR-IOV:** A real device (or a VF) is assigned to one VM; guest drivers talk to hardware directly. Lowest latency, used for high I/O workloads.

Storage is often a **virtual disk** (file or LUN) presented as a block device to the guest. The hypervisor translates guest block I/O to reads/writes to that file or LUN.

---

## 6. Datacenter perspective: shared CPU and memory

In a **datacenter**, a single physical server runs many VMs (or containers). Key ideas:

- **Shared CPU:** Physical cores are **time-shared** across vCPUs. The hypervisor (or host kernel) scheduler decides which vCPU runs on which core and for how long. Oversubscribing vCPUs (more vCPUs than cores) is common; it works when workloads are not all CPU-bound.
- **Memory division:** Each VM is given a **memory limit** (e.g. 4 GB). The hypervisor assigns machine RAM (and possibly swap) to satisfy those limits. Total “guest RAM” can exceed physical RAM (overcommit); the hypervisor uses ballooning and/or swap to handle pressure.
- **Storage:** Often **shared** (SAN, NFS, or local disks) presented as virtual disks. RAID (or erasure coding) is used at the storage layer for redundancy; see [Storage and I/O](./10_Storage_And_IO.md#5-raid-storage-subsystem).
- **Network:** Virtual switches and NICs connect VMs to each other and to the outside; the hypervisor or host implements vSwitches and VLANs.

So “how the datacenter works” at this level: **one physical box** → **hypervisor** → **many VMs**, each with a share of CPU time, a slice of RAM, and virtual disks/NICs. Configuration and tooling (how many vCPUs, how much RAM, which disk, which network) are **per platform** (Linux/KVM, VMware, Hyper-V, etc.).

---

## Summary

- **Virtualization** = one or more guests (VMs) on a host; the hypervisor multiplexes hardware.
- **Type 1** = hypervisor on bare metal (ESXi, Hyper-V, KVM). **Type 2** = hypervisor as app (Workstation, VirtualBox).
- **CPU:** Trap-and-emulate and hardware (VT-x, AMD-V) give each VM isolated vCPUs; hypervisor schedules vCPUs on physical cores → **shared CPU**.
- **Memory:** Guest physical → machine physical; EPT/NPT for efficient mapping; **memory division** by assigning machine pages (or overcommit + balloon/swap).
- **I/O:** Virtual devices (emulated, paravirtual, or pass-through); storage often a file or LUN.
- **Datacenter:** One server runs many VMs; CPU and memory are shared/divided by the hypervisor; storage and network are virtualized and often shared.

For **how** to configure and use virtualization and RAID on a specific OS, see [Linux: Virtualization](../Linux/14_Virtualization_On_Linux.md), [Linux: Storage advanced (incl. RAID)](../Linux/12_Storage_Advanced_LVM_ACLs.md), and [Windows: Virtualization and storage advanced](../Windows/4_Virtualization_And_Storage_Advanced.md).

---

## Further reading

- [Virtualization (OS perspective)](./13_OS_Concepts_Compilers_Linkers_Virtualization.md#virtualization-and-containerization-os-perspective) — Virtualization vs containerization in this handbook.
- [RAID (storage subsystem)](./10_Storage_And_IO.md#5-raid-storage-subsystem) — How RAID fits under the OS and in the datacenter.
- Vendor docs: VMware, Microsoft Hyper-V, Oracle VirtualBox, and Linux KVM (kernel.org, distro docs) for implementation and configuration details.
