# Virtualization on Linux

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Virtualization and datacenter](../Fundamentals/20_Virtualization_Hypervisors_And_Datacenter.md). Here: **how virtualization works and is configured on Linux** — KVM (Type 1), libvirt, and VirtualBox (Type 2). Commands and typical setup so you can create and manage VMs on a Linux host.

---

## 1. How virtualization works on Linux

On Linux you typically use:

- **KVM (Kernel-based Virtual Machine)** — A **Type 1** style hypervisor: the Linux kernel acts as the host; kernel modules (`kvm`, `kvm_intel` or `kvm_amd`) use CPU virtualization (Intel VT-x, AMD-V) to run guest VMs. No separate hypervisor process; the kernel schedules vCPUs and manages guest memory (EPT/NPT). This is how you get “virtualization on Linux” in datacenters and servers.
- **libvirt** — A **management layer** (daemon, API, and tools) that talks to KVM (and other backends). It handles VM definitions (XML), storage pools, networks, and lifecycle (create, start, stop). Most Linux VM tooling uses libvirt.
- **VirtualBox** — A **Type 2** hypervisor that runs as a user-space application on the host. It can run on Linux (and Windows, macOS). Good for desktops and dev VMs; for servers, KVM is more common.

So: **KVM + libvirt** = how you configure and run VMs “on Linux” in a server or datacenter; **VirtualBox** = alternative on the same Linux machine for desktop-style use.

---

## 2. Prerequisites: CPU and kernel

Hardware-assisted virtualization must be enabled:

```bash
# Check if CPU supports VT-x (Intel) or AMD-V (AMD) and if it’s enabled in BIOS
egrep -o '(vmx|svm)' /proc/cpuinfo
# vmx = Intel VT-x, svm = AMD-V

# KVM kernel modules (usually auto-loaded when you use KVM)
lsmod | grep kvm
# kvm_intel or kvm_amd, and kvm
```

If nothing appears, enable virtualization in the host BIOS/UEFI and ensure the right `kvm` module is loaded.

---

## 3. KVM and libvirt: installation and service

Typical install (distribution-specific; below is generic):

```bash
# RHEL/Fedora/CentOS
sudo dnf install qemu-kvm libvirt virt-install virt-viewer
# Optional: virt-manager (GUI)

# Debian/Ubuntu
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients virtinst virt-viewer
# Optional: virt-manager

# Enable and start libvirt
sudo systemctl enable --now libvirtd
# Or on some distros: libvirt (no 'd')
```

- **qemu-kvm** — Provides the QEMU emulator and KVM acceleration; libvirt uses it to run the VM process.
- **libvirt** — Daemon (`libvirtd`) and tools (`virsh`, `virt-install`).
- **virt-install** — CLI to create new VMs.
- **virt-viewer** — Connect to VM console (SPICE/VNC).

---

## 4. Creating a VM with virt-install

**virt-install** creates a new VM and registers it with libvirt. You specify name, memory, vCPUs, disk, and install source.

```bash
# Minimal: create a VM with local install media (ISO)
virt-install \
  --name myvm \
  --memory 2048 \
  --vcpus 2 \
  --disk size=20 \
  --cdrom /path/to/installer.iso \
  --os-variant detect \
  --graphics none \
  --console pty,target.type=serial

# Using a network install (e.g. Fedora)
virt-install \
  --name fedora-vm \
  --memory 2048 \
  --vcpus 2 \
  --disk size=20 \
  --location https://download.fedoraproject.org/pub/fedora/linux/releases/39/Server/x86_64/os/ \
  --os-variant fedora39 \
  --graphics none \
  --console pty,target.type=serial
```

- **--name** — VM name in libvirt.
- **--memory** — RAM in MiB.
- **--vcpus** — Number of vCPUs (shared CPU on the host).
- **--disk size=20** — Create a 20 GiB disk in the default pool (e.g. `/var/lib/libvirt/images/`).
- **--disk path=/var/lib/libvirt/images/myvm.qcow2,size=20** — Explicit path and size.
- **--cdrom** — ISO for install; **--location** — URL or path for network/local tree.
- **--os-variant** — Tunes defaults (clock, devices); list with `osinfo-query os`.
- **--graphics none** — No VNC/SPICE (useful for headless); use **--graphics vnc** or **spice** for a graphical console.
- **--network default** — Default NAT; or **--network bridge=br0** for a bridge.

After creation, the VM is defined in libvirt; you start/stop it with **virsh**.

---

## 5. Managing VMs with virsh

**virsh** is the CLI to manage VMs (and pools, networks) under libvirt.

```bash
# List VMs (running and defined)
virsh list --all

# Start, shut down, destroy (force off)
virsh start myvm
virsh shutdown myvm
virsh destroy myvm

# Autostart VM on host boot
virsh autostart myvm

# VM info and config
virsh dominfo myvm
virsh dumpxml myvm

# Console (serial) if you used --console pty
virsh console myvm

# Edit VM definition (XML); then redefine
virsh edit myvm
# Or: virsh define /path/to/myvm.xml
```

So **how it is configured on Linux**: VM “hardware” (vCPUs, memory, disks, network) is stored in an **XML definition**; `virt-install` creates it, `virsh edit` changes it. Libvirt passes that to QEMU/KVM when you start the VM.

---

## 6. Storage pools and networks

**Storage pools** are where libvirt keeps VM disks (dir, LVM, etc.):

```bash
virsh pool-list --all
virsh pool-info default
# Default pool often: /var/lib/libvirt/images
```

**Networks**: default is a NAT network; for bridged networking you create a bridge on the host and use `--network bridge=br0` (or equivalent in XML).

---

## 7. VirtualBox on Linux

VirtualBox is a **Type 2** hypervisor. You install it from the project repo or distro package, then create VMs via GUI or **VBoxManage**.

```bash
# Install (example: Ubuntu)
# Add Oracle repo or: sudo apt install virtualbox

# List VMs
VBoxManage list vms

# Create VM (headless example)
VBoxManage createvm --name "MyVM" --register
VBoxManage modifyvm "MyVM" --memory 2048 --cpus 2
VBoxManage createhd --filename ~/VMs/MyVM.vdi --size 20480
VBoxManage storagectl "MyVM" --name "SATA" --add sata
VBoxManage storageattach "MyVM" --storagectl "SATA" --port 0 --device 0 --type hdd --medium ~/VMs/MyVM.vdi
VBoxManage storageattach "MyVM" --storagectl "SATA" --port 1 --device 0 --type dvddrive --medium /path/to/install.iso
VBoxManage startvm "MyVM" --type headless
```

So on **Linux**, VirtualBox runs as an app; it uses the same CPU virtualization (VT-x/AMD-V) but in a hosted way. Configuration is per-VM (VBoxManage or GUI), not via libvirt.

### Hands-on: VirtualBox and install guides

**VirtualBox on Linux (RHEL/Fedora):** Add repo, import key, install EPEL and deps (kernel-devel, kernel-headers, dkms), then install VirtualBox. If the kernel module fails to build, ensure `kernel-devel` matches `uname -r` and run `/sbin/vboxconfig`; check with `systemctl status vboxdrv`.

```bash
# RHEL/Rocky/Alma/CentOS: add VirtualBox repo and install
wget https://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo -P /etc/yum.repos.d/
rpm --import https://www.virtualbox.org/download/oracle_vbox.asc
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
dnf install binutils kernel-devel kernel-headers dkms -y
dnf install VirtualBox-7.0
virtualbox
```

**VirtualBox on Debian/Ubuntu:** Add Oracle repo and install: `apt-get install virtualbox-7.0`. Extension pack: download `.vbox-extpack` from VirtualBox site and install via File → Preferences → Extension Manager.

**Rocky Linux on VirtualBox (Windows):** Install Oracle VM VirtualBox on Windows, create a new VM (name, ISO, RAM, CPU, disk), then start and install Rocky (language, partitioning e.g. /, /boot, /home, swap, network, root password, user). Reboot into the new system.

**RHEL 9 (free):** Download RHEL 9 ISO from [Red Hat Developer Portal](https://developers.redhat.com/) (no-cost subscription). Create bootable USB (e.g. with `dd` or Rufus). Boot, run installer (language, destination/partitioning, root + user). After install, register: `sudo subscription-manager register --username=... --password=...`, `sudo subscription-manager attach --auto`; confirm with `subscription-manager list --installed`.

---

## 8. Summary: virtualization on Linux

| Component | Role on Linux |
|-----------|----------------|
| **KVM** | Kernel modules use VT-x/AMD-V; kernel schedules vCPUs and manages guest memory. |
| **libvirt** | Management: VM definitions (XML), storage pools, networks; tools: virsh, virt-install. |
| **virt-install** | Create VMs: name, memory, vCPUs, disk, install source, network. |
| **virsh** | Start, stop, edit, list VMs and pools. |
| **VirtualBox** | Type 2 option on Linux; VBoxManage or GUI to create and run VMs. |

For **concepts** (Type 1 vs 2, CPU/memory virtualization, datacenter), see [Fundamentals: Virtualization and datacenter](../Fundamentals/20_Virtualization_Hypervisors_And_Datacenter.md). For **RAID on Linux**, see [Storage advanced](./12_Storage_Advanced_LVM_ACLs.md).

---

## Further reading

**VirtualBox and install guides**

- [Install Rocky Linux in VirtualBox on Windows](https://www.tecmint.com/install-rocky-linux-in-virtualbox-on-windows/) — VirtualBox on Windows, create VM, install Rocky (partitioning, users).
- [Install VirtualBox on RHEL/CentOS/Fedora and Debian/Ubuntu](https://www.tecmint.com/install-virtualbox-on-redhat-centos-fedora/) — Repo, EPEL, kernel-devel, dkms, VirtualBox-7.0; vboxconfig, Extension Pack.
- [Download and install RHEL 9 for free](https://www.tecmint.com/download-install-rhel-9-free/) — Developer subscription, ISO, partitioning, subscription-manager register/attach.

**Official**

- [Linux kernel: KVM](https://www.linux-kvm.org/) — KVM project and docs.
- [libvirt: Documentation](https://libvirt.org/docs.html) — Domain XML, storage, networks.
- [virt-install(1)](https://man7.org/linux/man-pages/man1/virt-install.1.html), [virsh(1)](https://man7.org/linux/man-pages/man1/virsh.1.html) — Man pages.
- [VirtualBox: Manual](https://www.virtualbox.org/manual/) — Installation and VBoxManage.
