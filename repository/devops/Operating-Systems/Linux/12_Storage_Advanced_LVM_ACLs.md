# Storage advanced: LVM, ACLs, and network mounts (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Storage and I/O](./8_Storage_And_IO.md). Here: **LVM** (Logical Volume Manager), **ACLs** (Access Control Lists), **setgid directories**, and **network file systems** (NFS, CIFS) on Linux — with commands for DevOps and multi-user systems.

**Hands-on:** To create and extend LVM, set up RAID, and use ACLs on a lab system, follow [Learn Linux — hands-on](./00_Learn_Linux_Hands_On.md).

---

## LVM (Logical Volume Manager)

LVM adds a layer between **physical disks** and **file systems**: **Physical Volumes (PV)** → **Volume Groups (VG)** → **Logical Volumes (LV)**. File systems are created on LVs. You can resize LVs (and often VGs) without repartitioning. **Concepts:** A **Physical Extent (PE)** is the smallest allocatable unit in a VG (default 4 MB); you can set a different PE size when creating the VG (e.g. `-s 32M`). The VG can be extended by adding PVs; LVs can be extended (or reduced, with care) within free space in the VG.

```bash
# Create PV, VG, LV
pvcreate /dev/sdb1
vgcreate myvg /dev/sdb1
lvcreate -L 10G -n mylv myvg
mkfs.ext4 /dev/myvg/mylv
mount /dev/myvg/mylv /mnt

# Extend LV (after extending PV or adding PV to VG)
lvextend -L +5G /dev/myvg/mylv
resize2fs /dev/myvg/mylv   # ext4
# Or: xfs_growfs /mnt      # XFS

# List
pvs
vgs
lvs
lsblk
```

### Full LVM workflow (from scratch)

When adding new disks, partition them with type **8e (Linux LVM)** before creating PVs. You can create LVs by size (`-L`) or by number of PEs (`-l`). Inspect free space with `vgdisplay` / `vgs` and add entries to `/etc/fstab` for persistent mounts.

```bash
# 1. Partition disks (fdisk): create partition, set type to 8e (Linux LVM)
fdisk /dev/sdb   # n, p, 1, Enter, Enter, t, 8e, w

# 2. Create PVs and VG (optional: -s 32M for 32 MB PE size)
pvcreate /dev/sdb1 /dev/sdc1 /dev/sdd1
vgcreate -s 32M myvg /dev/sdb1 /dev/sdc1 /dev/sdd1

# 3. Inspect VG (free PE, total size)
vgdisplay myvg
vgs

# 4. Create LVs (by size or by PEs)
lvcreate -L 20G -n lv_docs myvg
# Or: lvcreate -l 639 -n lv_docs myvg   # 639 PEs × 32M ≈ 20G

# 5. Create filesystem and mount
mkfs.ext4 /dev/myvg/lv_docs
mkdir -p /mnt/docs
mount /dev/myvg/lv_docs /mnt/docs

# 6. Persistent mount: add to /etc/fstab (use UUID or /dev/mapper/myvg-lv_docs)
# /dev/mapper/myvg-lv_docs  /mnt/docs  ext4  defaults  0 0
mount -a   # Test fstab
```

### Extend and reduce LVM

**Extend:** Add a new PV (partition type 8e), then extend the VG and LV. You can extend an LV while it is mounted. Resize the filesystem after extending the LV.

```bash
# Add new disk/partition and create PV
pvcreate /dev/sde1
vgextend myvg /dev/sde1

# Extend LV by size or by number of PEs (vgdisplay shows free PE)
lvextend -L +10G /dev/myvg/mylv
# Or: lvextend -l +2560 /dev/myvg/mylv   # 2560 PEs
resize2fs /dev/myvg/mylv   # ext4 (online)
# xfs_growfs /mnt          # XFS (mount point)
```

**Reduce:** Must unmount first. Steps: unmount → e2fsck → resize filesystem to target size → lvreduce → (optionally resize2fs again) → mount. Back up data before reducing.

```bash
umount /mnt/docs
e2fsck -ff /dev/myvg/mylv
resize2fs /dev/myvg/mylv 10G        # Shrink filesystem to 10G
lvreduce -L 10G /dev/myvg/mylv      # Or: lvreduce -l -2048 /dev/myvg/mylv (by PEs)
resize2fs /dev/myvg/mylv             # Resize to fill LV
mount /dev/myvg/mylv /mnt/docs
```

### LVM thin provisioning

A **thin pool** is an LV that holds metadata and data for **thin volumes**. Thin volumes are virtual sizes; space is allocated from the pool only when data is written. This allows **over-provisioning** (e.g. 15G pool with multiple 5G thin volumes); monitor pool usage to avoid filling the pool.

```bash
# Create VG and thin pool
vgcreate -s 32M vg_thin /dev/sdb1
lvcreate -L 15G --thinpool tp_pool vg_thin

# Create thin volumes (virtual size; space taken from pool on write)
lvcreate -V 5G --thin -n thin_vol1 vg_thin/tp_pool
lvcreate -V 5G --thin -n thin_vol2 vg_thin/tp_pool
mkfs.ext4 /dev/vg_thin/thin_vol1
mount /dev/vg_thin/thin_vol1 /mnt/client1

# Extend thin pool if needed (same as normal LV)
lvextend -L +15G /dev/vg_thin/tp_pool
```

---

## Mount by UUID or label

Use **UUID** or **label** in `/etc/fstab` so mounts survive device name changes (e.g. after adding disks).

```bash
# Get UUID and label
blkid /dev/sda1
lsblk -f

# /etc/fstab example
# UUID=xxx  /data  ext4  defaults  0 2
# LABEL=mydata  /data  ext4  defaults  0 2
mount -a   # Mount all in fstab
```

---

## ACLs (Access Control Lists)

Standard Linux permissions are **owner / group / others** (ugo) and **rwx**. **ACLs** allow **per-user** or **per-group** permissions on a file or directory, beyond the single group.

```bash
# Set ACL
setfacl -m u:alice:rwx /path/to/dir
setfacl -m g:devs:r-x /path/to/file
setfacl -m u:bob:r-- /path/to/file

# Default ACL (for new files in directory)
setfacl -m d:u:alice:rwx /path/to/dir

# View
getfacl /path/to/file

# Remove
setfacl -x u:alice /path/to/file
setfacl -b /path/to/file   # Remove all ACLs
```

---

## Setgid and collaboration directories

- **setgid on directory** — New files created in the directory inherit the directory’s **group**. Useful for shared folders (e.g. `/opt/team` with group `devs`).
- **setuid/setgid on file** — When executed, the process runs with the file’s owner/group (e.g. `passwd`). Use sparingly for security.

```bash
# Set GID bit on directory (new files get dir's group)
chmod g+s /opt/shared
chgrp devs /opt/shared

# Check
ls -ld /opt/shared   # drwxrwsr-x  ...  devs  ...
```

---

## RAID on Linux (software RAID with mdadm)

**RAID** (redundancy and/or striping across disks) is covered in [Fundamentals: Storage and I/O](../Fundamentals/10_Storage_And_IO.md). On Linux, **software RAID** is implemented by the **md** (multiple devices) subsystem; the main tool is **mdadm**.

- **Hardware RAID** — A controller presents a single block device (e.g. `/dev/sda`); the OS does not see individual disks. No mdadm needed for the array itself.
- **Software RAID** — The kernel combines block devices (e.g. `/dev/sdb1`, `/dev/sdc1`) into a single **MD** device (e.g. `/dev/md0`). You then put a file system or LVM on `/dev/md0`.

**Concepts:** By default there is no RAID config file; you must **save the array layout** to `mdadm.conf` (Debian/Ubuntu: `/etc/mdadm/mdadm.conf`; RHEL/Fedora: `/etc/mdadm.conf`) after creating the array so it assembles at boot (e.g. as `/dev/md0`). Without that, the kernel may assign a different device number after reboot. A **hot spare** can be added so that if a member fails, the spare is used automatically for rebuild.

### Creating and managing arrays with mdadm

Partitions used for RAID should have type **fd (Linux raid autodetect)**. After creating the array, run `mkfs`, mount, add to fstab, and **save the array** with `mdadm --detail --scan --verbose >> /etc/mdadm.conf` (or `/etc/mdadm/mdadm.conf` on Debian/Ubuntu) so it assembles at boot.

```bash
# RAID 0 (stripe — no redundancy; high performance, no fault tolerance)
sudo mdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/sdb1 /dev/sdc1

# RAID 1 (mirror) from two partitions
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1

# Create RAID 5 from three partitions
sudo mdadm --create /dev/md5 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1

# Create RAID 10 (mirror pairs + stripe); use 4 devices
sudo mdadm --create /dev/md10 --level=10 --raid-devices=4 /dev/sdb1 /dev/sdc1 /dev/sdd1 /dev/sde1

# Assemble (start) an existing array (e.g. after reboot)
sudo mdadm --assemble /dev/md0 /dev/sdb1 /dev/sdc1
# Or: sudo mdadm --assemble --scan

# Stop array
sudo mdadm --stop /dev/md0
```

### RAID 5 creation workflow (step-by-step)

Minimum three disks. Partition each disk (e.g. with `fdisk`) and set partition type to **fd (Linux raid autodetect)**. Then create the array, create a file system, mount, and **save the config** so the array is assembled at boot.

```bash
# 1. Install mdadm (if not present)
# RHEL/Fedora:  sudo dnf install mdadm
# Debian/Ubuntu: sudo apt-get install mdadm

# 2. Examine drives for existing RAID (should show no superblock if new)
sudo mdadm -E /dev/sdb1 /dev/sdc1 /dev/sdd1
# or: sudo mdadm --examine /dev/sd[b-d]1

# 3. Create RAID 5 array
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1
# Short form: sudo mdadm -C /dev/md0 -l=5 -n=3 /dev/sd[b-d]1

# 4. Check status (resync may be in progress)
cat /proc/mdstat
sudo mdadm --detail /dev/md0
# Monitor: watch -n1 cat /proc/mdstat

# 5. Create filesystem and mount
sudo mkfs.ext4 /dev/md0
sudo mkdir -p /mnt/raid5
sudo mount /dev/md0 /mnt/raid5

# 6. Add to fstab for mount at boot (use UUID after first boot: blkid /dev/md0)
# /dev/md0  /mnt/raid5  ext4  defaults  0 0
sudo mount -a

# 7. Save RAID config so array assembles at boot (critical)
sudo mdadm --detail --scan --verbose | sudo tee -a /etc/mdadm/mdadm.conf
# RHEL/Fedora: append to /etc/mdadm.conf
```

### Monitoring and configuration

```bash
# Status of all arrays
cat /proc/mdstat
# Or: mdadm --detail /dev/md0

# Add a spare to an array (for RAID 5/6)
sudo mdadm /dev/md0 --add /dev/sde1

# Fail and remove a device (e.g. before replacing a disk)
sudo mdadm /dev/md0 --fail /dev/sdb1
sudo mdadm /dev/md0 --remove /dev/sdb1

# Save array layout so it can be assembled at boot (Debian/Ubuntu: usually in mdadm.conf)
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
# RHEL/Fedora: /etc/mdadm.conf
```

### Using the RAID device

After creating `/dev/md0` (or another MD device), use it like any block device: create a file system, or use it as an LVM PV.

```bash
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /mnt/data
# Add to /etc/fstab by UUID: blkid /dev/md0, then UUID=... /mnt/data ext4 defaults 0 2
```

So **how RAID is configured on Linux**: use **mdadm** to create/assemble/stop **MD** devices; put filesystems or LVM on them; persist assembly via **mdadm.conf** and **fstab**. For **how RAID works** (levels, striping, parity), see [Fundamentals: Storage and I/O — RAID](../Fundamentals/10_Storage_And_IO.md#5-raid-storage-subsystem).

---

## NFS and CIFS (network mounts)

**NFS** (Network File System — Linux/Unix):

```bash
# Install client (RHEL: nfs-utils)
sudo mount -t nfs server:/exported/path /mnt
# In /etc/fstab: server:/exported/path  /mnt  nfs  defaults  0 0
```

**CIFS/SMB** (Windows shares):

```bash
# Install cifs-utils
sudo mount -t cifs //server/share /mnt -o username=user,password=pass
# Or use credentials file; add to fstab for persistence
```

---

## Summary

- **LVM:** `pvcreate`, `vgcreate`, `lvcreate`, `lvextend`, `resize2fs`/`xfs_growfs`; list with `pvs`, `vgs`, `lvs`.
- **RAID (Linux):** Software RAID with **mdadm** — create/assemble MD devices (e.g. `/dev/md0`), then mkfs/mount or use as LVM PV; persist with mdadm.conf and fstab.
- **Mount:** Use **UUID** or **label** in fstab; `blkid`, `mount -a`.
- **ACLs:** `setfacl`, `getfacl` for per-user/per-group permissions.
- **Setgid dirs:** `chmod g+s` so new files inherit group; good for shared dirs.
- **Network:** NFS (`mount -t nfs`), CIFS (`mount -t cifs`) for remote filesystems.

---

## Further reading

**Official Linux documentation**

- [Linux man pages: lvm(8)](https://man7.org/linux/man-pages/man8/lvm.8.html), [setfacl(1)](https://man7.org/linux/man-pages/man1/setfacl.1.html), [getfacl(1)](https://man7.org/linux/man-pages/man1/getfacl.1.html) — LVM and ACLs.
- [mdadm(8)](https://man7.org/linux/man-pages/man8/mdadm.8.html) — Software RAID (MD) administration.

**RAID (Linux mdadm, step-by-step)**

- [Part 1 – Introduction to RAID, concepts and levels](https://www.tecmint.com/understanding-raid-setup-in-linux/) · [Part 2 – RAID 0 (stripe)](https://www.tecmint.com/create-raid0-in-linux/) · [Part 3 – RAID 1 (mirror)](https://www.tecmint.com/create-raid1-in-linux/) · [Part 4 – RAID 5](https://www.tecmint.com/create-raid-5-in-linux/) · [Part 5 – RAID 6](https://www.tecmint.com/create-raid-6-in-linux/) · [Part 6 – RAID 10](https://www.tecmint.com/create-raid-10-in-linux/) · [Part 7 – Grow array and remove failed disks](https://www.tecmint.com/grow-raid-array-in-linux/) · [Part 8 – Recover and rebuild failed RAID](https://www.tecmint.com/recover-data-and-rebuild-failed-software-raid/) · [Part 9 – Manage RAID with mdadm](https://www.tecmint.com/manage-software-raid-devices-in-linux-with-mdadm/) · [Assemble RAID and backups](https://www.tecmint.com/creating-and-managing-raid-backups-in-linux/).
- **LVM:** [Create LVM storage (Part 1)](https://www.tecmint.com/create-lvm-storage-in-linux/) · [Extend/Reduce LVM (Part 2)](https://www.tecmint.com/extend-and-reduce-lvms-in-linux/) (vgextend, lvextend, resize2fs; reduce: umount, e2fsck, resize2fs, lvreduce) · [Thin provisioning (Part 4)](https://www.tecmint.com/setup-thin-provisioning-volumes-in-linux/) (thin pool, thin volumes, over-provisioning).
- [Red Hat: LVM](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_and_managing_storage/configuring-lvm-configuring-and-managing-storage) — In-depth LVM administration.
- [Access Control Lists (ACLs) in Linux](https://www.geeksforgeeks.org/access-control-listsacl-linux/)
- [NFS and CIFS (mount)](https://man7.org/linux/man-pages/man8/mount.8.html)
