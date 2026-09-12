# Unix flavors (distributions)

[← Back to Unix](../README.md) · [↑ Operating Systems](../../README.md)

**Where to put FreeBSD, Solaris, AIX, HP-UX, and other Unix variants.** The [Unix](../README.md) section above covers the **kernel and common concepts** (process, memory, shell, POSIX) that apply across Unix and Unix-like systems. This folder covers **flavor-specific** topics: package managers, service management, and commands or configs that differ by variant.

---

## Why a separate Flavors folder?

- **Unix (generic)** = shared concepts: POSIX, process model, file hierarchy, shell, signals. Commands like `ps`, `kill`, `cron` are similar across variants.
- **Flavors** = how each **variant** is packaged and administered: different **package systems** (pkg vs IPS vs installp vs swinstall), **init/service** (rc.d, smf, System V), and **vendor tools** (SMIT, YaST-like tools, ZFS, DTrace).

Put anything **specific to one Unix flavor or family** here.

---

## Structure

| Flavor / family | File | Covers |
|-----------------|------|--------|
| **BSD family** (FreeBSD, OpenBSD, NetBSD) | [BSD_Family.md](./BSD_Family.md) | pkg, ports; rc.d, service; FreeBSD vs OpenBSD vs NetBSD. |
| **Solaris / illumos** | [Solaris_illumos.md](./Solaris_illumos.md) | pkg (IPS), smf, ZFS, DTrace, zones; Oracle Solaris vs illumos. |
| **AIX** (IBM) | [AIX.md](./AIX.md) | installp, rpm; SMIT, WLM; mksysb. |
| **HP-UX** | [HP_UX.md](./HP_UX.md) | swinstall, SAM; Itanium/PA-RISC. |
| **Others** (e.g. IRIX, UnixWare) | Add as needed | One file per flavor. |

Create a new `.md` file for each flavor or family. Link it from this README.

---

## Quick reference: package and service management by flavor

| Flavor / family | Package manager | Service / init | Notes |
|-----------------|-----------------|----------------|-------|
| FreeBSD, OpenBSD, NetBSD | pkg, ports | rc.d, rc.conf | BSD lineage. |
| Solaris, illumos | pkg (IPS) | smf (svcadm) | ZFS, DTrace, zones. |
| AIX | installp, rpm | System V rc | SMIT, WLM, mksysb. |
| HP-UX | swinstall | SAM, init | PA-RISC, Itanium. |

---

## Adding a new flavor

1. Create a new file, e.g. `Flavors/MyFlavor.md`.
2. Add a row to the **Structure** table and (if useful) to the **Quick reference** table.
3. Cover: package manager, service management, release model, flavor-specific commands, and links to official docs.

This repo is community-maintained. Prefer one file per **family** (e.g. BSD) unless a flavor is different enough to deserve its own file.
