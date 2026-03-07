# Storage and I/O (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Storage and I/O](../Fundamentals/10_Storage_And_IO.md). Here: **file systems**, **disk**, and **I/O** on Unix — **df**, **du**, **iostat**, **mount**, and FHS.

---

## File systems on Unix

Unix abstracts storage as a **file system**: a hierarchy of files and directories. **Mount points** attach a device or network share to the tree. Common file systems: **UFS** (BSD), **ZFS** (Solaris, FreeBSD), **ext4** (Linux). **df** shows disk usage; **du** shows directory usage; **mount** lists mounted file systems.

---

## Commands

```bash
# Disk usage
df -h
du -sh /path

# Mounted file systems
mount
cat /etc/fstab   # Linux
cat /etc/fstab   # or /etc/vfstab on Solaris

# I/O stats (if iostat available)
iostat -x 1 5
```

---

## RAID on Unix

**RAID** concepts (levels 0, 1, 5, 6, 10, and 2, 3, 4) are covered in [Fundamentals: Storage and I/O — RAID](../Fundamentals/10_Storage_And_IO.md#5-raid-storage-subsystem). On Unix and Unix-like systems, **how RAID is configured** depends on the flavor:

- **Hardware RAID** — A controller presents a single disk to the OS (e.g. `/dev/da0`). No OS-level RAID config; use the device as normal.
- **Software RAID** — The OS combines disks into a logical device. Tools and names differ by flavor.

### BSD family (FreeBSD, OpenBSD, NetBSD): GEOM

On **FreeBSD** (and some other BSDs), the **GEOM** framework provides software RAID. Common classes:

| RAID level | GEOM class | Command | Description |
|------------|------------|---------|-------------|
| **RAID 0** | gstripe | `gstripe` | Striping; no redundancy. |
| **RAID 1** | gmirror | `gmirror` | Mirroring; two or more disks hold the same data. |

```bash
# FreeBSD: create a mirror (RAID 1) with gmirror
gmirror label -v data /dev/da1 /dev/da2
gmirror load
mount /dev/mirror/data /mnt

# Create a stripe (RAID 0) with gstripe
gstripe label -v stripe0 /dev/da1 /dev/da2
gstripe load
# Use /dev/stripe/stripe0 for mount or UFS
```

GEOM modules: **geom_mirror.ko**, **geom_stripe.ko**. See `gmirror(8)`, `gstripe(8)` and the [FreeBSD Handbook — GEOM](https://docs.freebsd.org/en/books/handbook/disks/#disks-raid).

### Solaris / illumos: ZFS RAID-Z

On **Solaris** and **illumos** (and FreeBSD with ZFS), **ZFS** provides RAID-like redundancy via **raidz** (RAID-Z) vdevs:

| Rough RAID equivalent | ZFS vdev type | Tolerates |
|------------------------|---------------|-----------|
| RAID 5–like | **raidz** or **raidz1** | One disk failure |
| RAID 6–like | **raidz2** | Two disk failures |
| — | **raidz3** | Three disk failures |

```bash
# Create a pool with single-parity RAID-Z (raidz1)
zpool create tank raidz1 c1t0d0 c2t0d0 c3t0d0

# Double-parity (raidz2)
zpool create tank raidz2 c1t0d0 c2t0d0 c3t0d0 c4t0d0

# Status
zpool status tank
```

ZFS also supports **mirror** vdevs (RAID 1–like) and **striped** (RAID 0–like). RAID level concepts (striping, parity, mirroring) are the same; the **configuration** is ZFS-specific (zpool, vdev types).

### AIX, HP-UX

- **AIX:** Uses **LVM** with mirroring (e.g. **mirrorvg**) and can use hardware RAID; see AIX storage documentation.
- **HP-UX:** LVM mirroring and hardware RAID; see HP-UX storage docs.

So **how RAID runs on Unix**: use **GEOM** (BSD) or **ZFS raidz/mirror** (Solaris/illumos/FreeBSD) for software RAID; or rely on **hardware RAID** and use the single block device the controller presents. For **RAID levels** (0, 1, 2, 3, 4, 5, 6, 10), see [Fundamentals: Storage and I/O — RAID](../Fundamentals/10_Storage_And_IO.md#5-raid-storage-subsystem).

---

## Summary

- **File system** = hierarchy; **mount** attaches volumes.
- **df**, **du**, **mount**, **iostat** for inspection and tuning.
- **RAID on Unix:** **BSD** — GEOM **gmirror** (RAID 1), **gstripe** (RAID 0). **Solaris/illumos** — ZFS **raidz1** (RAID-5–like), **raidz2** (RAID-6–like), **mirror**. Hardware RAID = single disk to the OS.

---

## Further reading

- [File systems in operating system](https://www.geeksforgeeks.org/operating-systems/file-systems-in-operating-system/)
- [FreeBSD: Disks and file systems](https://docs.freebsd.org/en/books/handbook/disks/) — Includes GEOM, gmirror, gstripe.
- [FreeBSD: GEOM](https://docs.freebsd.org/en/books/handbook/disks/#disks-raid) — Software RAID (mirror, stripe).
- [Oracle Solaris: ZFS RAID-Z](https://docs.oracle.com/en/operating-systems/solaris/oracle-solaris/11.4/manage-zfs/raid-z-storage-pool-configuration.html) — raidz1, raidz2 configuration.
