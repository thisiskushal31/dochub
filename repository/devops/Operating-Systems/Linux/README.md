# Linux (implementation)

**How Linux implements OS fundamentals — in the Linux fashion.** Assume you have read [Fundamentals](../Fundamentals/README.md) (kernel, process, scheduling, sync, deadlock, threads, memory, storage, shell as **concepts**). Here we cover the **Linux kernel** (monolithic, LKMs), syscalls, process model, scheduler (CFS), memory (VM, swap), storage (VFS, file systems), and shell/scripting — **deep coverage** with commands, tools, and diagrams (images from references, with credit) for DevOps.

**Linux is hands-on.** For a **step-by-step, do-it-yourself** path (install distros, run commands, set up LVM/RAID, users, cron, firewall, scripting), use **[Learn Linux — hands-on](./00_Learn_Linux_Hands_On.md)**. It maps each topic below to the [Beginner's Guide for Linux](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/) so you can read the handbook for concepts and then perform the tutorials on a VM or machine.

## Topics

| # | Topic | Description |
|---|--------|-------------|
| 0 | [**Learn Linux — hands-on**](./00_Learn_Linux_Hands_On.md) | **Hands-on learning path:** map of handbook topics to step-by-step tutorials. Use a VM and do the exercises. |
| 1 | [Introduction and basics](./1_Introduction_And_Basics.md) | OS intro, types, kernel, shell, system calls, boot process |
| 2 | [Process management](./2_Process_Management.md) | Process, PCB, states, schedulers, creation and deletion |
| 3 | [CPU scheduling](./3_CPU_Scheduling.md) | Scheduling algorithms, preemptive vs non-preemptive, dispatcher |
| 4 | [Process synchronization](./4_Process_Synchronization.md) | Race condition, critical section, semaphores, mutex, IPC |
| 5 | [Deadlock](./5_Deadlock.md) | Deadlock intro, prevention, detection, recovery, Banker's algorithm |
| 6 | [Multithreading](./6_Multithreading.md) | Threads, user vs kernel threads, multithreading models |
| 7 | [Memory management](./7_Memory_Management.md) | Memory units, virtual memory, paging, segmentation, page replacement |
| 8 | [Storage and I/O](./8_Storage_And_IO.md) | **Linux filesystem layout (FHS)** — /, /usr, /etc, /var, /dev, /proc; file systems, disk scheduling, I/O, spooling |
| 9 | [Shell and scripting](./9_Shell_And_Scripting.md) | CLI, shell, shell scripting, commands for DevOps |
| 10 | [Users, groups, and scheduling](./10_Users_Groups_And_Scheduling.md) | useradd, usermod, passwd, chage, sudo, visudo; cron, at; shutdown, reboot |
| 11 | [Networking and firewall](./11_Networking_And_Firewall.md) | ip, nmcli, hostname, DNS; SSH, scp, rsync; firewalld, iptables |
| 12 | [Storage advanced: LVM, ACLs, RAID](./12_Storage_Advanced_LVM_ACLs.md) | LVM (pv, vg, lv), **RAID (mdadm)**, fstab by UUID, ACLs (setfacl, getfacl), setgid dirs, NFS/CIFS |
| 13 | [Container filesystem: Docker and storage](./13_Container_Filesystem_Docker_And_Storage.md) | How Docker-based Linux filesystem works on a Linux host: overlay2, layers, volumes, bind mounts |
| 14 | [Virtualization on Linux](./14_Virtualization_On_Linux.md) | How virtualization works and is configured on Linux: KVM, libvirt (virt-install, virsh), VirtualBox |
| 15 | [Logging, time, and kernel observability](./15_Logging_Time_And_Kernel_Observability.md) | Logging (journalctl, rsyslog, logrotate), time (chrony, timedatectl), sysctl, /proc and /sys, troubleshooting map, real-time (chrt, nice) |
| 16 | [Security from the OS view](./16_Security_OS_View.md) | MAC (SELinux, AppArmor), PAM, SSH hardening, auditd |
| — | [**Distributions (flavors)**](./Distributions/README.md) | **Fedora, CentOS, RHEL, Ubuntu, Debian, Arch, openSUSE, Alpine** — package managers (dnf, apt, pacman, zypper, apk), distro-specific commands |

---

## Documentation and further reading

Each topic file above includes a **Further reading** section with links to relevant articles. For official and in-depth Linux documentation, use the following.

**Linux kernel and core**

- [The Linux Kernel documentation](https://docs.kernel.org/) — Official kernel docs (process, memory, driver API, syscalls).
- [Linux man pages (man7.org)](https://man7.org/linux/man-pages/) — Authoritative man pages for syscalls, C library, and many commands.
- [Linux From Scratch (LFS)](https://www.linuxfromscratch.org/) — Build a minimal Linux system from source (advanced).

**Major distributions (official docs)**

- [Red Hat Enterprise Linux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/) — RHEL administration, security, tuning.
- [Fedora](https://docs.fedoraproject.org/) — Fedora docs and guides.
- [Ubuntu Server](https://ubuntu.com/server/docs) — Ubuntu server documentation.
- [Debian](https://www.debian.org/doc/) — Debian manuals and wiki.
- [Arch Wiki](https://wiki.archlinux.org/) — Arch Linux (and general Linux) reference; very detailed.
- [openSUSE](https://doc.opensuse.org/) — openSUSE documentation.
- [Alpine](https://wiki.alpinelinux.org/) — Alpine Linux wiki and documentation.

**Distro-specific coverage in this handbook:** See [Distributions](./Distributions/README.md) for RHEL/CentOS/Fedora, Debian/Ubuntu, Arch, openSUSE/SUSE, and Alpine — with package managers, release models, and links to official docs.

---

## Adding topics

New OS topics can be added as numbered files (e.g. `10_New_Topic.md`) and linked from this README. **Distro-specific content** (Fedora, CentOS, Ubuntu, etc.) goes under [Distributions](./Distributions/README.md). Community-maintained.
