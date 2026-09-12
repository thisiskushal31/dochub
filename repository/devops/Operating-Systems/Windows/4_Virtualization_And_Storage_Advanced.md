# Virtualization and storage advanced (Windows)

[← Back to Windows](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Virtualization and datacenter](../Fundamentals/20_Virtualization_Hypervisors_And_Datacenter.md), [Fundamentals: Storage and I/O — RAID](../Fundamentals/10_Storage_And_IO.md#5-raid-storage-subsystem). Here: **how virtualization and RAID-like storage work and are configured on Windows** — Hyper-V, VirtualBox, and Storage Spaces.

---

## 1. Virtualization on Windows

On Windows you typically use:

- **Hyper-V** — Microsoft’s **Type 1** (bare-metal) hypervisor. When enabled, the Windows kernel runs on top of the Hyper-V hypervisor; the same Windows install can host VMs. Used in servers and desktops (Pro/Enterprise).
- **VirtualBox** — A **Type 2** hypervisor that runs as an application on Windows (or Linux, macOS). Common for dev and desktop VMs.

So: **Hyper-V** = how you configure and run VMs “on Windows” in a server or Pro/Enterprise desktop; **VirtualBox** = alternative that runs as an app on the same Windows machine.

---

## 2. Hyper-V: enable and create VMs

**Enable Hyper-V** (Admin PowerShell; Windows Pro/Enterprise or Server):

```powershell
# Enable Hyper-V (requires reboot)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All

# Or with DISM
DISM /Online /Enable-Feature /FeatureName:Microsoft-Hyper-V /All
```

After reboot, use **Hyper-V Manager** (GUI) or **PowerShell** to create and manage VMs.

**Create a VM with PowerShell:**

```powershell
# New VM: name, path, memory, generation
New-VM -Name "MyVM" -MemoryStartupBytes 2GB -Path "C:\VMs" -Generation 2

# Add a virtual disk (new VHDX)
New-VHD -Path "C:\VMs\MyVM\disk.vhdx" -SizeBytes 40GB -Dynamic
Add-VMHardDiskDrive -VMName "MyVM" -Path "C:\VMs\MyVM\disk.vhdx"

# Set vCPU count
Set-VM -Name "MyVM" -ProcessorCount 2

# Attach install ISO
Set-VMDvdDrive -VMName "MyVM" -Path "D:\install.iso"
Add-VMDvdDriveToVM -VMName "MyVM" -ControllerNumber 1 -ControllerLocation 0
Set-VMFirmware -VMName "MyVM" -FirstBootDevice (Get-VMDvdDrive -VMName "MyVM")

# Start VM
Start-VM -Name "MyVM"

# List VMs
Get-VM
Get-VM -Name "MyVM" | Format-List *
```

So **how it is configured on Windows**: enable the **Hyper-V** feature, then create VMs with **New-VM**, **New-VHD**, **Set-VM**, etc. VMs and disks are stored under the path you choose (e.g. `C:\VMs`). For concepts (Type 1, CPU/memory virtualization), see [Fundamentals: Virtualization and datacenter](../Fundamentals/20_Virtualization_Hypervisors_And_Datacenter.md).

---

## 3. VirtualBox on Windows

VirtualBox runs as a normal application. Install from [virtualbox.org](https://www.virtualbox.org/), then create VMs via the **Graphical User Interface** or **VBoxManage.exe** (same as on Linux). Configuration is per-VM (memory, CPUs, disk, network) in VirtualBox’s own settings; the host OS is just “Windows.”

---

## 4. Storage and RAID on Windows

**Hardware RAID** — A RAID controller presents a single disk to Windows (e.g. one volume). No extra Windows config for the array itself; you just use the volume.

**Software RAID-like on Windows: Storage Spaces**

**Storage Spaces** lets you pool disks and create **volumes** with resiliency (mirror, parity) or no resiliency (simple). So you get RAID-like behavior (redundancy and/or striping) configured in the OS.

**Create a storage pool and a mirrored space (PowerShell):**

```powershell
# Get physical disks (not yet in a pool)
Get-PhysicalDisk -CanPool $True

# New storage pool and virtual disk (mirror = 2-way mirror)
New-StoragePool -FriendlyName "MyPool" -StorageSubSystemFriendlyName "Windows Storage*" -PhysicalDisks (Get-PhysicalDisk -CanPool $True)
New-VirtualDisk -StoragePoolFriendlyName "MyPool" -FriendlyName "MyMirror" -ResiliencySettingName Mirror -Size 100GB
Get-VirtualDisk MyMirror | Get-Disk | Initialize-Disk -PartitionStyle GPT
New-Partition -DiskNumber <N> -UseMaximumSize -DriveLetter E
Format-Volume -DriveLetter E -FileSystem NTFS -NewFileSystemLabel "Data"
```

**Resiliency options and RAID level mapping:**

| Storage Spaces setting | RAID level equivalent | Use |
|------------------------|------------------------|-----|
| **Simple** | **RAID 0** (striping; no redundancy) | Max size/speed only. |
| **Mirror** | **RAID 1** (mirroring) | Redundancy; survive one (or more) disk failure depending on layout. |
| **Parity** | **RAID 5** / **RAID 6** style (striping + parity) | Space-efficient redundancy; good for large capacity. |

So **how RAID (software) is configured on Windows**: use **Storage Spaces** to create a **storage pool** from physical disks, then create a **virtual disk** with the desired resiliency (Simple = RAID 0, Mirror = RAID 1, Parity = RAID 5/6–like); initialize and format it like any disk. For **all RAID levels** (0, 1, 2, 3, 4, 5, 6, 10) and how they work, see [Fundamentals: Storage and I/O — RAID](../Fundamentals/10_Storage_And_IO.md#5-raid-storage-subsystem).

---

## 5. Summary

| Topic | On Windows |
|-------|------------|
| **Virtualization** | **Hyper-V** (Type 1): enable feature, create VMs with `New-VM`, `New-VHD`, etc. **VirtualBox** (Type 2): install and use GUI or VBoxManage. |
| **Storage / RAID** | **Hardware RAID**: controller presents one disk; use normally. **Storage Spaces**: pool disks, create virtual disk with Mirror or Parity for software RAID-like redundancy. |

---

## Further reading

- [Microsoft: Hyper-V overview](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/)
- [Microsoft: Create a VM with Hyper-V (PowerShell)](https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-with-powershell)
- [Microsoft: Storage Spaces overview](https://docs.microsoft.com/en-us/windows-server/storage/storage-spaces/overview)
- [VirtualBox: Manual](https://www.virtualbox.org/manual/) — Installation and configuration on Windows.
