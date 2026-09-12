# Linux distributions (flavors)

[← Back to Linux](../README.md) · [↑ Operating Systems](../../README.md)

**Where to put Fedora, CentOS, and other Linux flavors.** The [Linux](../README.md) section above covers the **kernel and common userland** (commands, process, memory, storage, shell) that apply across most distributions. This folder covers **distribution-specific** topics: package managers, release cycles, and commands or configs that differ by distro.

---

## Why a separate Distributions folder?

- **Linux** = kernel + common tools (GNU coreutils, procps, etc.). Commands like `ps`, `bash`, `systemd` are shared.
- **Distributions** = how that stack is **packaged and delivered**: different **package managers** (apt vs dnf vs zypper), **init systems** (systemd is common but not universal), **release models** (rolling vs fixed), and **vendor tools** (subscription-manager on RHEL, snap on Ubuntu).

Put anything that is **specific to one distro or distro family** here.

---

## Structure (suggested)

| Distro / family | File or folder | Covers |
|-----------------|----------------|--------|
| **RHEL family** (RHEL, CentOS, Fedora, Rocky, AlmaLinux) | [RHEL_Family.md](./RHEL_Family.md) | dnf/yum, rpm, subscription-manager, firewalld, selinux; differences between Fedora (upstream), RHEL (paid), CentOS/Rocky/Alma (free rebuilds). |
| **Debian family** (Debian, Ubuntu, Mint, Pop!_OS) | [Debian_Family.md](./Debian_Family.md) | apt, dpkg, snap (Ubuntu); release cycles; LTS. |
| **Arch family** (Arch, Manjaro, EndeavourOS) | [Arch_Family.md](./Arch_Family.md) | pacman, AUR, rolling release. |
| **openSUSE / SUSE** | [openSUSE_SUSE.md](./openSUSE_SUSE.md) | zypper, YaST, transactional updates (SUSE). |
| **Alpine** | [Alpine.md](./Alpine.md) | apk, OpenRC, minimal/container-focused; musl, BusyBox. |
| **Others** (Slackware, Gentoo, NixOS) | Add as needed | One file per distro or family as needed. |

Create a new `.md` file (or subfolder with README) for each distro/family you want to document. Link it from this README.

---

## Official documentation (by distro)

| Distro / family | Official documentation |
|-----------------|------------------------|
| RHEL, Fedora, CentOS, Rocky, Alma | [RHEL docs](https://access.redhat.com/documentation/), [Fedora docs](https://docs.fedoraproject.org/) |
| Debian, Ubuntu | [Debian manual](https://www.debian.org/doc/), [Ubuntu server](https://ubuntu.com/server/docs) |
| Arch | [Arch Wiki](https://wiki.archlinux.org/) |
| openSUSE, SUSE | [openSUSE](https://doc.opensuse.org/), [SUSE](https://documentation.suse.com/) |
| Alpine | [Alpine wiki](https://wiki.alpinelinux.org/), [Alpine docs](https://docs.alpinelinux.org/) |

---

## Quick reference: package managers by distro

| Distro / family | Package manager (primary) | Command examples |
|-----------------|---------------------------|-------------------|
| Fedora, RHEL, CentOS, Rocky, Alma | dnf (yum) | `dnf install pkg`, `dnf update`, `yum list` |
| Debian, Ubuntu | apt | `apt update`, `apt install pkg`, `apt list --installed` |
| Arch, Manjaro | pacman | `pacman -S pkg`, `pacman -Syu` |
| openSUSE | zypper | `zypper install pkg`, `zypper update` |
| Alpine | apk | `apk add pkg`, `apk update`, `apk --no-cache add pkg` (containers) |

---

## Adding a new distribution

1. Create a new file, e.g. `Distributions/MyDistro.md`.
2. Add a row to the **Structure** table in this README and (if useful) to the **Quick reference** table.
3. Cover: package manager, release model, any distro-specific commands or paths, and links to official docs.

This repo is community-maintained. Prefer one file per **family** (e.g. RHEL family) unless a distro is different enough to deserve its own file.
