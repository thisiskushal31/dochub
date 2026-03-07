# Learn Linux — hands-on

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Linux and the operating system are hands-on.** Theory from [Fundamentals](../Fundamentals/README.md) and the topic files in this folder give you **concepts and commands**; to really learn Linux you need to **run commands, create users, configure services, set up RAID and LVM, and script** on a real or virtual system.

This page ties the handbook to a **hands-on learning path** so you can do that. Use it as your **practical companion**: read a topic here, then do the corresponding tutorials on a VM or machine.

---

## How to use this (hands-on workflow)

1. **Get a lab** — Install a Linux distro (RHEL, CentOS, Rocky, Alma, Fedora, Ubuntu, or Debian) on bare metal or in a VM (VirtualBox, KVM, or VMware). See [Introduction and basics](./1_Introduction_And_Basics.md) and [Virtualization on Linux](./14_Virtualization_On_Linux.md).
2. **Read the handbook topic** — For the area you care about (e.g. storage, processes, users), read the matching topic file in this folder for concepts and command syntax.
3. **Do the steps** — Follow the tutorials linked below. Run every command, create the configs, and fix any errors. That’s where the learning is.
4. **Repeat** — Move through sections in order or jump to what you need; the goal is to make the commands and behaviors automatic.

The handbook content is drawn from multiple sources and merged into one place. The table below maps **handbook topics** to a structured hands-on curriculum and to specific tutorial links. One such curriculum is the [Beginner’s Guide for Linux](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/) (commands, package management, LVM, RAID, services, security, scripting); you can use it as a reference. Each topic file’s **Further reading** lists additional tutorial links.

---

## Handbook topic → hands-on mapping

Use this table to go from a **handbook topic** to **hands-on links** where you can practice.

| Handbook topic | What to do hands-on | Hands-on links |
|-----------------|---------------------|----------------|
| [1. Introduction and basics](./1_Introduction_And_Basics.md) | Install Linux, understand boot, kernel, shell | Introduction & OS installation: [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-1) (What is Linux, boot process, directory structure, install RHEL 9, VirtualBox, distros, Rocky on VirtualBox). |
| [2. Process management](./2_Process_Management.md) | List and control processes | Essential commands: [top](https://www.tecmint.com/12-top-command-examples-in-linux/) · [ps](https://www.tecmint.com/ps-command-monitor-processes-in-linux/) · [kill](https://www.tecmint.com/how-to-kill-process-in-linux/). Monitoring: process monitoring, kill/pkill/killall, lsof. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-2) · [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-7). |
| [8. Storage and I/O](./8_Storage_And_IO.md) | Files, disks, df, du, mount, FHS | Essential commands: ls, cd, pwd, mkdir, rmdir, mv, cp, touch, find, cat, df, du, tar, grep, ln. File system: Ext2/3/4, NFS, mount. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-2) · [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-9). |
| [9. Shell and scripting](./9_Shell_And_Scripting.md) | Shell and scripts | Basic commands (pipes, redirection). [Shell and basic scripting Part I–XI](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-17) (shell, scripts, functions, variables, arrays). |
| [10. Users, groups, and scheduling](./10_Users_Groups_And_Scheduling.md) | Users, groups, permissions, cron | useradd, usermod; users, groups, permissions; su vs sudo, configure sudo; psacct/acct. Cron scheduling. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-5) · [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-7). |
| [11. Networking and firewall](./11_Networking_And_Firewall.md) | Network config, SSH, firewall | [rsync](https://www.tecmint.com/rsync-local-remote-file-synchronization-commands/) · [scp](https://www.tecmint.com/scp-command-examples/). IPTables, FirewallD, UFW, security. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-8) · [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-13). |
| [12. Storage advanced: LVM, ACLs, RAID](./12_Storage_Advanced_LVM_ACLs.md) | LVM, RAID, ACLs | LVM: [Setup LVM](https://www.tecmint.com/create-lvm-storage-in-linux/) · [Extend/Reduce](https://www.tecmint.com/extend-and-reduce-lvms-in-linux/) · [Thin provisioning](https://www.tecmint.com/setup-thin-provisioning-volumes-in-lvm/). RAID: [Intro & levels](https://www.tecmint.com/understanding-raid-setup-in-linux/) · [RAID 0](https://www.tecmint.com/create-raid0-in-linux/) · [RAID 1](https://www.tecmint.com/create-raid1-in-linux/) · [RAID 5](https://www.tecmint.com/create-raid-5-in-linux/) · [RAID 6](https://www.tecmint.com/create-raid-6-in-linux/) · [RAID 10](https://www.tecmint.com/create-raid-10-in-linux/) · [Grow](https://www.tecmint.com/grow-raid-array-in-linux/) · [Recover](https://www.tecmint.com/recover-data-and-rebuild-failed-software-raid/) · [mdadm](https://www.tecmint.com/manage-software-raid-devices-in-linux-with-mdadm/) · [Assemble](https://www.tecmint.com/creating-and-managing-raid-backups-in-linux/). [ACLs](https://www.tecmint.com/secure-files-directories-using-acls-in-linux/). |
| [12. Storage advanced] (package mgmt) | Install packages, repos | Yum, RPM, APT, DPKG, Zypper, DNF. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-6). |
| [11. Networking](./11_Networking_And_Firewall.md) (backup/sync) | Backup, sync, recovery | [rsync](https://www.tecmint.com/rsync-local-remote-file-synchronization-commands/) · [scp](https://www.tecmint.com/scp-command-examples/). Rsnapshot, backup/restore, clone, disk cloning. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-8). |
| [14. Virtualization](./14_Virtualization_On_Linux.md) | Run Linux in a VM | [Install VirtualBox on Linux](https://www.tecmint.com/install-virtualbox-on-redhat-centos-fedora/) · [Install Rocky on VirtualBox (Windows)](https://www.tecmint.com/install-rocky-linux-in-virtualbox-on-windows/) · [RHEL 9 free](https://www.tecmint.com/download-install-rhel-9-free/). Handbook: [Virtualization on Linux](./14_Virtualization_On_Linux.md) (KVM, virt-install, virsh). |
| [15. Logging, time, and kernel observability](./15_Logging_Time_And_Kernel_Observability.md) | Logs, NTP, sysctl, troubleshooting | journalctl, rsyslog, logrotate; chrony, timedatectl; sysctl, /proc, /sys; where to look when things fail; chrt, nice. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-7) (monitoring). |
| [16. Security from the OS view](./16_Security_OS_View.md) | MAC, PAM, SSH, audit | SELinux/AppArmor, PAM, SSH hardening, auditd. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-13) (security and firewall). |
| Services & systemd | Services, startup | [chkconfig and systemctl](https://www.tecmint.com/chkconfig-command-examples/) · [Stop/disable unwanted services](https://www.tecmint.com/remove-unwanted-services-from-linux/) · [Manage systemd](https://www.tecmint.com/manage-services-using-systemd-and-systemctl-in-linux/) · [Startup process](https://www.tecmint.com/linux-boot-process-and-manage-services/). [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-12). |
| Security & hardening | Security, firewall, SSH | Hardening, secure SSH, GRUB password, SSH/MOTD banners, Lynis, [ACLs](https://www.tecmint.com/secure-files-directories-using-acls-in-linux/), SELinux, IPTables, FirewallD, UFW. [guide](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/#section-13). |
| [Distributions](./Distributions/README.md) | Distro-specific packages | Yum/RPM (RHEL, CentOS, Fedora), APT/DPKG (Debian, Ubuntu), Zypper (SUSE), DNF. Handbook: [Distributions](./Distributions/README.md). |

---

## External guide — section index

Below is the **section index** of one [Beginner’s Guide for Linux](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/). Open the guide and use the in-page links to reach each section. Each section contains multiple step-by-step articles; do them on your lab system.

| # | Section | What you’ll do hands-on |
|---|---------|--------------------------|
| 1 | Introduction to Linux and OS installations | What is Linux, boot process, directory structure; install RHEL 9, VirtualBox; try distros; install Rocky on VirtualBox. |
| 2 | Essential basic Linux commands | **ls, cd, pwd, dir, mkdir, rmdir, mv, cp, touch, find, cat, df, du, tar, grep, ln, alias, echo, tail, top, ps, kill, uniq.** Run every command. |
| 3 | Essentials of advance Linux commands | **head, tail, cat**; **wc**; **sort**; **rename**; **echo**; **pydf**; **free** (RAM). |
| 4 | Some more advanced commands | 20 useful commands (newbies); 20 for middle-level users; 20 for experts; funny commands; 51 lesser-known commands; 10 dangerous commands (never run blindly). |
| 5 | User, group, and file permissions | **useradd, usermod**; manage users & groups & permissions (advanced); **su vs sudo**, configure **sudo**; monitor user activity (**psacct/acct**). |
| 6 | Linux package management | **Yum, RPM** (CentOS, RHEL, Fedora); **APT-GET, APT-CACHE, DPKG** (Debian, Ubuntu); **Zypper** (SUSE, openSUSE); comparison; **DNF**. |
| 7 | System monitoring and cron | **top**; **kill, pkill, killall**; **lsof**; **cron**; performance tools; Nagios, Zabbix; shell script to monitor network, disk, uptime, load, RAM. |
| 8 | Archiving, backup/sync, recovery | **tar**; RAR; compression tools; **rsync** (local/remote); **scp**; Rsnapshot; backup/restore tools; clone systems; recover deleted files; disk cloning/backup. |
| 9 | File system / network storage | Ext2, Ext3, Ext4 (create, convert); file system types; NFSv4; mount/unmount local and NFS/Samba; Btrfs; GlusterFS. |
| 10 | LVM management | Setup LVM; extend/reduce LVM; snapshot/restore; thin provisioning; striping I/O; migrate LVM. |
| 11 | RAID management | Intro, concepts, levels; create RAID 0, 1, 5, 6, 10; grow array, remove failed disks; recover/rebuild failed RAID; manage with **mdadm**; assemble partitions as RAID, backups. |
| 12 | Manage services | Configure services to start/stop automatically; stop/disable unwanted services; **systemctl** (systemd); startup process and services. |
| 13 | System security and firewall | Hardening tips; secure SSH; GRUB password; SSH/MOTD banners; Lynis; ACLs; network audit; SELinux; IPTables, FirewallD, UFW, Shorewall, CSF, IPFire, pfSense. |
| 14 | LAMP setup | Install LAMP on RHEL/CentOS, Ubuntu, Arch, Gentoo; virtual hosts; SSL; security; Varnish; load testing. |
| 15 | LEMP setup | Install LEMP; FcgiWrap (Perl, Ruby, Bash); LEMP on Gentoo, Arch. |
| 16 | MySQL/MariaDB administration | Basic admin commands; mysqladmin; backup/restore; replication; Mytop, Mtop; performance monitoring. |
| 17 | Shell scripting | Shell and basic scripting (Parts I–XI): shell, scripts, math, functions, arrays, variables, nested substitution, predefined BASH variables. |
| 18 | Linux interview questions | **ls**, basic, beginners, core, random, commands, services/daemons, MySQL, Apache, VsFTP, SSH, Squid, iptables, networking. |
| 19 | Shell scripting interview questions | Q&A on shell scripting (theory and practical). |
| 20 | Free Linux books | Cheat sheet; GNU/Linux advanced administration; securing & optimizing; patch management; hands-on guide; Linux Bible; Linux from Scratch; shell scripting cookbook; Bash guide. |
| 21 | Certifications | RHCSA, LFCS, LFCE preparation guides. |

---

## Hands-on habits

- **Run every command** — Don’t just read; type (or paste) and run. See success and error messages.
- **Break things on purpose** — Wrong options, missing args, wrong paths. Then fix them; that’s how you learn.
- **Use one VM per “role”** — e.g. one for LVM/RAID, one for services/firewall, one for scripting. Snapshots help.
- **Keep notes** — Commands that worked, mistakes, and fixes. Reuse them later.
- **Combine with handbook** — When a tutorial says “create an LVM,” read [Storage advanced: LVM](./12_Storage_Advanced_LVM_ACLs.md) for the concepts and options, then do the steps in the linked tutorial.

---

## Summary

- **Handbook** = concepts and command reference. The links above point to step-by-step, hands-on tutorials you can use as a curriculum.
- See the [Beginner's Guide for Linux](https://www.tecmint.com/free-online-linux-learning-guide-for-beginners/) or other references as you like; the table above maps each handbook topic to matching tutorial sections.
- For **LVM** and **RAID**, the handbook has the theory and commands; the linked guide has full walkthroughs (create, extend, recover) — do them on a lab.
- Linux is learned by doing. Read a topic, then do the corresponding section on a real or virtual system.
