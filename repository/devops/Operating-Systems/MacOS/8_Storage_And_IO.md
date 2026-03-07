# macOS: storage and I/O

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Storage and I/O](../Fundamentals/10_Storage_And_IO.md). Here: **macOS file systems** (**APFS**, **HFS+**), **directory layout**, and **commands** (`diskutil`, `df`, `du`).

---

## File system: APFS and HFS+

**APFS (Apple File System)** is the default on macOS (since High Sierra). It is **copy-on-write**, **checksummed**, and supports **snapshots**, **clones**, **encryption**, and **space sharing**:

- **Container** — One APFS container per partition (or one partition can hold one container). The container holds a **Space Manager** and can hold **multiple volumes**.
- **Volume** — A logical volume inside the container. Typical macOS install: **System** (read-only on sealed systems), **Data** (user data), **Preboot**, **Recovery**, **VM** (swap). Volumes **share** the container’s free space; no fixed size per volume.
- **Block size** — Default 4096 bytes; structures are stored as objects on disk (e.g. **Container Superblock**, **Volume Superblock**, **Object Map (OMAP)**). **Object Maps** provide virtual-to-physical mapping and enable **snapshots** and **clones**.

**HFS+ (Mac OS Extended)** is the legacy default; still supported for compatibility (e.g. external drives, Time Machine on some configs). New installs use APFS for the boot volume.

**References:** [APFS (Apple)](https://developer.apple.com/documentation/foundation/file_system), [APFS Container and Volumes (Eclectic Light)](https://eclecticlight.co/2024/04/02/apfs-containers-and-volumes/), [Apple File System Reference (PDF)](https://developer.apple.com/support/downloads/Apple-File-System-Reference.pdf).

---

## Directory layout (recap)

| Path           | Purpose                                      |
|----------------|-----------------------------------------------|
| `/`            | Root (often read-only on system volume)      |
| `/System`      | macOS system (read-only; sealed)             |
| `/System/Library` | System frameworks, KEXTs, LaunchDaemons   |
| `/Library`     | System-wide support, LaunchDaemons/Agents    |
| `/Applications`| Applications for all users                   |
| `/Users`       | Home directories                             |
| `/usr`         | BSD userland (bin, lib); often read-only     |
| `/var`         | Variable data (logs, caches, vm swapfiles)  |
| `~/Library`    | Per-user app support, Caches, Preferences    |

---

## Commands

**diskutil** — Disk and volume management (no raw device writes here; high-level only).

- **`diskutil list`** — List disks and partitions; shows APFS **containers** and **volumes** (e.g. "Container disk1" with "Macintosh HD", "VM", etc.).
- **`diskutil info <diskNsM>`** or **`diskutil info "Volume Name"`** — Details for a disk or volume (size, used, file system, UUID).
- **`diskutil apfs list`** — APFS containers and volumes with UUIDs and roles.
- **`diskutil unmount /Volumes/<name>`** — Unmount a volume (e.g. external drive).
- **`diskutil mount <diskNsM>`** — Mount a volume.

**Space and usage**

- **`df -h`** — Disk space per mounted volume (human-readable). APFS volumes show shared container space.
- **`du -sh <dir>`** — Disk usage of directory (e.g. `du -sh ~/Library`).
- **`du -sh *`** — Usage per item in current directory.

**Example:**

```bash
# List all disks and APFS layout
diskutil list
diskutil apfs list

# Space on each volume
df -h

# How much space a directory uses
du -sh /Users/*/Library
```

---

## Summary

- **File system:** **APFS** (containers, volumes, snapshots, CoW); **HFS+** legacy.
- **Layout:** `/System`, `/Library`, `/Applications`, `/Users`, `/var`, `~/Library`.
- **Commands:** **`diskutil list`**, **`diskutil apfs list`**, **`diskutil info`**, **`df -h`**, **`du -sh`**.

---

## Further reading

- [Apple File System Reference (Apple)](https://developer.apple.com/support/downloads/Apple-File-System-Reference.pdf)
- [File System Programming Guide (Apple)](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/)
- [APFS: Containers and volumes (Eclectic Light)](https://eclecticlight.co/2024/04/02/apfs-containers-and-volumes/)
- `man diskutil`, `man df`, `man du`
