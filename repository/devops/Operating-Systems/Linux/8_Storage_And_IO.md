# Storage and I/O (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Storage and I/O](../Fundamentals/10_Storage_And_IO.md). Here: **how Linux** does storage (VFS, ext4/XFS, block layer, I/O scheduler) and **commands** (df, du, lsblk, iostat, iotop).

---

## How the Linux filesystem is arranged (FHS)

Linux follows the **Filesystem Hierarchy Standard (FHS)**: a common layout so that config, programs, data, and temporary files live in predictable places across distros. Understanding this layout tells you **where to find** and **where to put** files.

### Top-level directory layout

```
/
├── bin      → Essential user binaries (ls, cat, cp). Often a symlink to /usr/bin.
├── sbin     → Essential admin binaries (fsck, ip). Often a symlink to /usr/sbin.
├── boot     → Boot loader (GRUB) and kernel images (vmlinuz, initramfs).
├── dev      → Device nodes (disks, terminals). Managed by udev; not real files on disk.
├── etc      → Host-specific configuration (passwd, fstab, systemd units, app configs).
├── home     → User home directories (/home/username). Optional; servers may use /var or elsewhere.
├── lib      → Essential libraries (e.g. for /bin, /sbin). Often a symlink to /usr/lib.
├── lib64    → 64-bit libs on some distros. Often a symlink to /usr/lib64.
├── media    → Mount points for removable media (USB, CD).
├── mnt      → Temporary mount points (manual mounts).
├── opt      → Optional / third-party software (one dir per package).
├── proc     → Virtual filesystem: process and kernel info (see Process management). Not on disk.
├── root     → Home directory of the root user (not under /home).
├── run      → Runtime data (PID files, sockets). Often tmpfs; cleared at boot.
├── srv      → Data served by this system (e.g. www, git).
├── sys      → Virtual filesystem: kernel objects, devices, settings (sysfs). Not on disk.
├── tmp      → Temporary files; may be cleared at boot. Often tmpfs.
├── usr      → User space programs and read-only data (see below).
└── var      → Variable data: logs, caches, spool, databases (see below).
```

### /usr — user space programs and read-only data

**/usr** holds the bulk of the system: binaries, libraries, headers, and shared data that are not host-specific and can be shared (e.g. over NFS). After boot, the system mostly runs from here.

```
/usr/
├── bin      → User binaries (most commands: ssh, nginx, python3).
├── sbin     → Admin binaries (sshd, systemd-networkd).
├── lib      → Libraries for /usr/bin and /usr/sbin.
├── include  → C headers.
├── share    → Architecture-independent data (man pages, locale, doc, icons).
├── local    → Locally installed software (not from the package manager). Same structure: bin, sbin, lib, share.
└── src      → Source code (optional; e.g. kernel source).
```

- **Package manager** installs into **/usr** (and **/etc** for config). Do not edit **/usr** by hand except via the package manager or **/usr/local**.
- **/usr/local** — For software you install yourself (compile from source, or install scripts). Survives package upgrades.

### /etc — configuration

**/etc** holds **host-specific** configuration: user and group (passwd, group, shadow), fstab, network, SSH (sshd_config), systemd units and overrides, and application configs. Editing a file here changes behavior for this machine.

Examples you will see often:

| Path | Purpose |
|------|---------|
| /etc/passwd, /etc/group, /etc/shadow | Users and groups. |
| /etc/fstab | Static mount table (what to mount at boot). |
| /etc/hosts | Local hostname → IP. |
| /etc/resolv.conf | DNS resolvers. |
| /etc/ssh/sshd_config | SSH server config. |
| /etc/systemd/system/ | systemd unit overrides and custom units. |
| /etc/yum.repos.d/ or /etc/apt/sources.list.d/ | Package repository config. |

**What these system files do:**

| File or dir | What it does |
|-------------|----------------|
| **/etc/passwd** | List of user accounts: username, UID, GID, comment, home, shell. Passwords are in **/etc/shadow** (hashed). |
| **/etc/group** | Group names and GIDs; which users are in which groups. |
| **/etc/shadow** | Hashed passwords and expiry; only root (or shadow group) can read. |
| **/etc/fstab** | Tells the system which block devices (or UUIDs) to mount at which paths at boot; options (e.g. defaults, nofail). |
| **/etc/hosts** | Static hostname → IP mapping; checked before DNS (e.g. `127.0.0.1 localhost`). |
| **/etc/resolv.conf** | DNS resolver(s) and search domain; used by getaddrinfo and tools. |
| **/etc/ssh/sshd_config** | SSH server (sshd) configuration: port, PermitRootLogin, keys, etc. |
| **/etc/systemd/system/** | systemd unit overrides and custom units; overrides units from /usr/lib/systemd. |
| **/etc/os-release** | Distro name and version; used by scripts and package managers. |

### /boot — boot loader and kernel

**/boot** holds files needed to **boot** the system. The bootloader (usually GRUB) reads this partition (or directory) and loads the kernel and initramfs.

| File or dir | What it does |
|-------------|----------------|
| **vmlinuz-*** (or **vmlinuz**) | Compressed Linux **kernel** image; the OS kernel that gets loaded first. |
| **initramfs-*** (or **initrd-***) | **Initial RAM filesystem**: minimal root with drivers and scripts to mount the real root (e.g. LVM, RAID, crypto). |
| **grub/** | GRUB config (**grub.cfg**) and modules; defines boot menu and kernel command line. |
| **config-***, **System.map-*** | Kernel build config and symbol table; useful for debugging, not required to boot. |

### /var — variable data

**/var** holds data that **changes** during normal operation: logs, caches, spool (print, mail), databases, and application data that is not config.

```
/var/
├── log      → Log files (syslog, journal, auth.log, app logs).
├── cache    → Application caches (apt, dnf, fonts). Safe to clear when apps are idle.
├── lib      → Variable state (databases, package db, docker images).
├── run      → Runtime data; often a symlink to /run.
├── spool    → Queues (cron, mail, print).
└── tmp      → Temporary files that must survive reboot (unlike /tmp).
```

- **Logs:** Look in **/var/log/** (and **journalctl** for systemd).
- **Package manager** stores its database and cache under **/var** (e.g. /var/lib/dpkg, /var/cache/apt).

**Key system dirs and files under /var and what they do:**

| Path | What it does |
|------|----------------|
| **/var/log/** | System and app logs: **syslog**, **auth.log** (or **secure**), **journal/** (systemd). Daemons and installers write here. |
| **/var/cache/** | Caches (apt, dnf, fonts). Safe to clear when apps are idle; they will repopulate. |
| **/var/lib/** | Persistent app state: **dpkg**/rpm DB, **docker** (images, containers), DB files (e.g. PostgreSQL, MySQL). |
| **/var/spool/** | Queues: **cron** (scheduled jobs), **mail**, **cups** (print). Data waiting to be processed. |
| **/var/run** | Runtime data (PIDs, sockets); on many systems a symlink to **/run** (tmpfs, cleared at boot). |

### /dev, /proc, /sys — not real disks

- **/dev** — Device nodes. Created by **udev**. Examples: `/dev/sda` (disk), `/dev/nvme0n1` (NVMe), `/dev/tty` (terminal). Writing to a block device can destroy data; treat with care.
- **/proc** — **procfs**: one directory per process (**/proc/<PID>/**), plus system-wide info (meminfo, loadavg, cmdline). See [Process management](./2_Process_Management.md).
- **/sys** — **sysfs**: kernel objects, device topology, tunables. Used by tools (e.g. **lsblk**, **udev**) and for tuning.

### Why this matters

- **Config** → **/etc**. **Logs and caches** → **/var**. **Your own installs** → **/usr/local** or **/opt**.
- **Paths in docs** (e.g. “edit /etc/nginx/nginx.conf”) assume this layout. Same layout across most distros (RHEL, Debian, Arch, etc.) with small differences (e.g. /usr/bin vs /bin symlinks).

For the full spec, see [FHS (Filesystem Hierarchy Standard)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html). Distro docs may describe minor variations.

---

## Essential file and directory commands (hands-on)

These commands are used constantly for listing, searching, archiving, and filtering. Concepts and examples below are drawn from hands-on tutorials (see Further reading).

### Listing: `ls`

`ls` lists directory contents. Common options:

| Option | Effect |
|--------|--------|
| `-l` | Long format: permissions, links, owner, group, size, date, name |
| `-a` | Include hidden files (names starting with `.`) |
| `-lh` | Human-readable sizes (K, M, G) |
| `-F` | Append `/` to directories |
| `-R` | Recursive (list subdirectories) |
| `-r` | Reverse sort order |
| `-t` | Sort by modification time (newest first with `-ltr`) |
| `-lS` | Sort by size (largest first) |
| `-i` | Show inode numbers |
| `-n` | Show numeric UID/GID |
| `-ld dir` | Show info about the directory itself, not its contents |

```bash
ls
ls -la
ls -lh /var/log
ls -ltr
ls -lS
ls -ld /tmp
ls *.txt
```

### Navigation: `cd` and `pwd`

**cd** — Change directory; it’s a **shell built-in** (not an external binary), so only the shell can change its own working directory. Use **absolute** paths (start with `/`) or **relative** (e.g. `lib`, `..`). `cd` with no arguments, or `cd ~`, goes to home. `cd -` switches back to the previous directory. Use `pushd` / `popd` for a directory stack; handle spaces in names with quotes or backslash.

```bash
cd /usr/local
cd lib
cd ..
cd ../..
cd ~
cd -
cd "dir with spaces"
pushd /var/www/html
popd
```

**pwd** — Print working directory (full path). Options: `-L` (use env PWD, may show symlink path), `-P` (resolve symlinks to physical path). Default behavior is like `-P`. Use `$PWD` in scripts.

```bash
pwd
pwd -L
pwd -P
```

### Creating directories: `mkdir`

**mkdir** — Create directory(ies). `-p` creates parent directories as needed (nested structure). `-m mode` sets permissions on creation. `-v` verbose. Multiple dirs: `mkdir a b c` or brace expansion `mkdir dir/{a,b,c}` (Bash).

```bash
mkdir mydir
mkdir -p parent/child/grandchild
mkdir -m 755 mydir
mkdir -p -v logs/2024/01
mkdir dir1 dir2 dir3
mkdir project/{src,doc,test}
```

### Copy: `cp`

**cp** — Copy files and directories. `-r` (or `-R`) recursive for directories. `-v` verbose; `-i` prompt before overwrite; `-n` do not overwrite; `-u` copy only when source is newer; `-p` preserve attributes; `-f` force (remove destination if needed). `--backup=numbered` backs up before overwrite. `-l` create hard link instead of copy; `-s` create symlink.

```bash
cp file1.txt file2.txt
cp -v file1.txt backup/
cp -r dir1 dir2
cp -i file1.txt file2.txt
cp -u -v source dest
cp -p file1 file2
cp -r -v dir1 dir2 dir3 dest/
```

### Create files / update timestamps: `touch`

**touch** — Create empty file(s) or update access/modification time. Options: `-a` access time only; `-m` modification time only; `-c` do not create if missing; `-r ref` use ref file’s times; `-t [[CC]YY]MMDDhhmm[.ss]` set time explicitly.

```bash
touch newfile
touch file1 file2 file3
touch -a existing
touch -m existing
touch -c nocreate
touch -r reference.txt target.txt
touch -t 202012101830.55 myfile
```

### Move and rename: `mv`

**mv** — Move or rename files and directories. Same syntax as cp; by default overwrites destination. `-v` verbose; `-i` prompt before overwrite; `-n` do not overwrite; `-u` move only when source is newer; `--backup=numbered` backup before overwrite.

```bash
mv file1.txt file2.txt
mv -v src dst
mv -v file1 file2 file3 destdir/
mv -i file1 file2
mv -n file1 file2
mv --backup=numbered -v file1 file2
```

### Disk usage: `df` and `du`

**df** — Disk filesystem: summary of used/available space per mounted filesystem. `-h` human-readable; `-T` show filesystem type; `-i` inode usage; `-t type` only given fs type; `-x type` exclude type; `-a` include pseudo filesystems.

```bash
df
df -h
df -hT /home
df -i
df -T
df -t ext4
```

**du** — Disk usage of files and directories (recursive). `-h` human-readable; `-s` summary (total for each argument); `-a` all files (not just dirs); `-c` grand total; `--exclude=PATTERN`; `--time` show modification time.

```bash
du /path
du -h /path
du -sh /path
du -ah /path
du -ch /path
du -ah --exclude='*.txt' /path
```

### Links: `ln`

**ln** — Create hard or symbolic links. **Hard link:** same inode as target; only within same filesystem. **Symbolic (soft) link:** points to another path; can cross filesystems. `ln source linkname` (hard); `ln -s target linkname` (symlink). `-f` force (replace existing link); `-v` verbose.

```bash
ln file hardlink
ln -s /path/to/target symlink
ln -sf /path/to/target symlink
```

### Remove empty directories: `rmdir`

**rmdir** — Remove empty directories only. `-p` remove directory and ancestors (if empty); `-v` verbose; `--ignore-fail-on-non-empty` don’t fail when dir is non-empty (exit 0, dir not removed).

```bash
rmdir empty_dir
rmdir -v dir1 dir2 dir3
rmdir -p -v parent/child/grandchild
```

### Text and counting: `sort`, `wc`

**sort** — Sort lines of text. `-n` numeric; `-r` reverse; `-k N` sort by field N; `-t C` delimiter; `-M` month order; `-h` human-readable sizes; `-c` check if already sorted.

```bash
sort file.txt
sort -n numbers.txt
sort -M month.txt
sort -t '+' -k1 -n file.txt
sort -c sorted.txt   # exit 0 if sorted
```

**wc** — Word count: lines, words, bytes, chars. `-l` lines; `-w` words; `-c` bytes; `-m` characters; `-L` length of longest line.

```bash
wc file.txt
wc -l file.txt
wc -w file.txt
wc -c file.txt
wc -L file.txt
```

### Memory usage: `free`

**free** — Show physical and swap memory (total, used, free, buffers, cached). `-h` human-readable; `-b`/`-k`/`-m`/`-g` units; `-t` total line; `-s N` repeat every N seconds; `-o` omit buffer-adjusted line.

```bash
free
free -h
free -m
free -s 5
```

### Finding files: `find`

`find` searches for files and directories by name, type, permissions, time, size, owner, and more. Use `-exec` to run a command on each match.

```bash
# By name (case-sensitive / case-insensitive)
find . -name "tecmint.txt"
find /home -iname "*.php"
# By type: file (-type f) or directory (-type d)
find . -type f -name "*.conf"
find / -type d -name mydir
# By permission
find . -type f -perm 0777
find / -perm /u=s
# By owner/group
find /home -user tecmint
find /home -group developer
# By time (modified): last 50 days, or last 1 hour
find / -mtime 50
find / -mmin -60
# By size (e.g. 50M, +50M–100M)
find / -size 50M
find / -size +50M -size -100M
# Empty files/dirs
find /tmp -type f -empty
find /tmp -type d -empty
# Execute a command on each match (chmod, rm, etc.)
find / -type f -perm 0777 -exec chmod 644 {} \;
find . -type f -name "*.txt" -exec rm -f {} \;
```

### Archiving and compression: `tar`

`tar` creates and extracts archives (optionally with gzip or bzip2). Common flags: `c` = create, `x` = extract, `t` = list, `v` = verbose, `f` = archive file, `z` = gzip, `j` = bzip2.

```bash
# Create archive (uncompressed, gzip, bzip2)
tar -cvf backup.tar /home/tecmint
tar -cvzf backup.tar.gz /home/tecmint
tar -cvfj backup.tar.bz2 /home/tecmint
# Extract (optionally to another directory)
tar -xvf backup.tar
tar -xvf backup.tar.gz -C /dest
# List contents without extracting
tar -tvf backup.tar
# Extract a single file or by pattern
tar -xvf backup.tar.bz2 path/to/file
tar -xvf backup.tar.gz --wildcards '*.png'
# Exclude files when creating
tar --exclude='*.txt' -czvf backup.tar.gz /home/tecmint
```

### Searching in files: `grep`

`grep` searches for patterns in text (files or stdin). Case-sensitive by default; use `-i` to ignore case.

| Option | Effect |
|--------|--------|
| `-i` | Ignore case |
| `-v` | Invert: show lines that do *not* match |
| `-n` | Show line numbers |
| `-c` | Count of matching lines |
| `-A N` | Show N lines after match |
| `-B N` | Show N lines before match |
| `-C N` | Show N lines before and after |
| `-r` | Recursive (search under directories) |
| `-w` | Match whole word only |
| `-E` | Extended regex (egrep) |
| `-F` | Fixed string (fgrep) |

```bash
grep "pattern" file.txt
grep -i "error" /var/log/syslog
grep -v "^\#" /etc/apache2/apache2.conf
grep -n "main" setup.py
grep -r "function" .
grep -w "RUNNING" output.txt
grep -E "pattern1|pattern2" file.txt
# In gzipped files
zgrep -i error /var/log/syslog.2.gz
```

---

## File systems

A **file system** organizes data on disk (or other storage) into **files** and **directories**. The OS provides:

- **Naming** — Hierarchical names (paths), e.g. `/home/user/file.txt`.
- **Structure** — Directories, links (hard, symbolic), attributes (permissions, timestamps).
- **Mapping** — Logical files → blocks on disk; the OS and file-system driver implement this.
- **Protection** — Permissions (read, write, execute) and ownership (user, group).

Common Linux file systems: **ext4**, **XFS**, **Btrfs**, **ZFS** (on some platforms). Network and virtual file systems: **NFS**, **tmpfs**, **procfs**, **sysfs**.

---

## Primary vs secondary memory

| Type | Examples | Role |
|------|----------|------|
| **Primary** | RAM, cache | Directly used by the CPU; volatile; fast. |
| **Secondary** | SSD, HDD, network storage | Persistent; larger; slower. |

The OS moves data between primary and secondary (e.g. page cache, buffer cache, swap). File operations are often buffered in RAM before being written to disk.

---

## Disk scheduling

When multiple I/O requests are pending, the OS **schedules** them to minimize seek time and maximize throughput. Classic algorithms:

| Algorithm | Idea |
|-----------|------|
| **FCFS** | First-Come, First-Served; simple, can be inefficient. |
| **SSTF** (Shortest Seek Time First) | Serve request closest to current head position; can cause starvation. |
| **SCAN** (elevator) | Move head in one direction, serve requests along the way, then reverse. |
| **C-SCAN** | Like SCAN but wrap around; more uniform wait. |
| **LOOK / C-LOOK** | Like SCAN/C-SCAN but stop when no more requests in that direction. |

Modern systems use more sophisticated schedulers (e.g. in the block layer) and SSDs change the trade-offs (no seek for flash, but queue depth and wear matter).

---

## Device management

The OS **device management** includes:

- **Abstraction** — Devices appear as files (e.g. `/dev/sda`) or through standardized APIs.
- **Drivers** — Kernel modules or built-in code that talk to hardware.
- **Scheduling** — Ordering and merging I/O requests (disk scheduling).
- **Buffering / caching** — Reducing direct access to slow devices and smoothing throughput.

In Linux, devices are under `/dev`; block devices (disks) and character devices (terminals, raw) are distinguished. **udev** manages device nodes and permissions.

---

## Spooling vs buffering

| Term | Meaning | Typical use |
|------|---------|-------------|
| **Buffering** | Temporary storage in memory to smooth out speed differences between producer and consumer (e.g. CPU vs disk). | General I/O; reduce wait. |
| **Spooling** (Simultaneous Peripheral Operations On-Line) | Put data (e.g. print jobs) on disk or a queue so the slow device can process it later while the application continues. | Print queues, batch jobs. |

So: **buffer** = short-term in-memory smoothing; **spool** = queue (often on disk) for a shared device like a printer.

---

## Essential Linux commands for storage and I/O

```bash
# Disk and file system usage
df -h
du -sh /path
lsblk
fdisk -l

# Mount points
mount
cat /etc/fstab

# File system type and options
findmnt /
stat -f /

# I/O and block devices
iostat -x 1 5
iotop

# List open files (and who is using a mount)
lsof +D /path
fuser -vm /path

# Create file system and mount (example)
# mkfs.ext4 /dev/sdX1
# mount /dev/sdX1 /mnt

# Swap
swapon --show
cat /proc/swaps
```

---

## More Linux storage and I/O commands

```bash
# Block devices and partitions
blkid
lsblk -f
parted -l
partprobe                  # Reload partition table

# File system operations (examples; adjust fs type)
mkfs.ext4 /dev/sdX1
resize2fs /dev/sdX1        # ext4 resize
xfs_growfs /mount/point    # XFS grow
fsck /dev/sdX1             # Check/repair (unmount first or use -n)

# Find large files and disk usage
find / -xdev -type f -size +100M 2>/dev/null
ncdu /path                 # Interactive disk usage (if installed)
du -h --max-depth=1 /var

# I/O and performance
dd if=/dev/zero of=test bs=1M count=100   # Simple write test
sync
vmstat 1 5                 # Includes io (bi/bo)
sar -d 1 5                 # Disk stats (if sysstat)

# NFS and remote
mount -t nfs server:/export /mnt
showmount -e server
```

### Mount options and network filesystems

**mount** attaches a filesystem at a directory (mount point). **umount** detaches it; ensure no process is using the mount (e.g. `cd` out of it). Common **-o** options: **rw** / **ro** (read-write / read-only), **noexec** (disable execution of binaries), **defaults** (async, auto, dev, exec, nouser, rw, suid), **loop** (mount an ISO or image file), **auto** / **noauto** (mount -a or not).

```bash
mount                                    # List mounted filesystems
mount -t ext4 /dev/sdX1 /mnt -o ro,noexec
mount -o remount,rw /mnt
umount /mnt                              # Fails if path is in use; use umount -l to lazy unmount

# NFS (server must export the path)
mount -t nfs server.example.com:/exported/path /mnt
# In /etc/fstab: server.example.com:/exported/path  /mnt  nfs  defaults  0  0

# CIFS/Samba (store credentials in a file with chmod 600, reference in fstab)
mount -t cifs //server/share /mnt -o credentials=/path/to/.smbcredentials
# In /etc/fstab: //server/share  /mnt  cifs  credentials=/path/to/.smbcredentials,defaults  0  0
```

**/etc/fstab** format: `<device> <mount_point> <type> <options> <dump> <fsck_pass>`. Use UUID or label for device so mounts survive partition number changes. Run `mount -a` to mount all fstab entries.

### Ext2, Ext3, and Ext4

**ext2** — No journal; suitable for flash. **ext3** — Adds journaling (recovery after crash). **ext4** — Default on many distros; journal checksums, larger limits, extents, online defrag (e4defrag). Create with **mke2fs** or **mkfs.ext3** / **mkfs.ext4**; convert with **tune2fs** (unmount first).

```bash
# Create filesystem
mke2fs /dev/sdX1                         # ext2
mke2fs -j /dev/sdX1                      # ext3 (journal)
mkfs.ext4 /dev/sdX1                      # ext4
mke2fs -t ext4 /dev/sdX1

# Convert ext2 → ext3 (add journal)
tune2fs -j /dev/sdX1
# Update /etc/fstab type to ext3, then mount

# Convert ext2/ext3 → ext4 (enable extents and related features)
tune2fs -O extents,uninit_bg,dir_index /dev/sdX1
fsck -pf /dev/sdX1                       # Fix on-disk structures
# Update fstab to ext4, mount, reboot
```

### Backup with Rsnapshot

**Rsnapshot** uses rsync to create incremental backups (hourly, daily, weekly, monthly) in a single snapshot root; only one full copy plus diffs. Config: **/etc/rsnapshot.conf** — set `snapshot_root`, `interval` (hourly 6, daily 7, weekly 4, monthly 3), `backup` lines (local paths or `user@host:/path`), `cmd_ssh`, `exclude_file`. Run `rsnapshot configtest` then `rsnapshot hourly` (or daily, weekly, monthly). Automate with cron (e.g. hourly on the hour, daily at 03:30).

```bash
# Install (RHEL: dnf install epel-release && dnf install rsnapshot; Debian: apt install rsnapshot)
sudo rsnapshot configtest
sudo rsnapshot hourly
sudo rsnapshot daily
# Cron example: 0 */4 * * * root /usr/bin/rsnapshot hourly
```

---

## Summary

- **File system** = organization of files and directories on storage; provides naming, structure, and protection.
- **Primary** memory (RAM) vs **secondary** (disk/SSD); OS caches and buffers between them.
- **Disk scheduling** (FCFS, SSTF, SCAN, C-SCAN, etc.) orders I/O to improve throughput and latency.
- **Device management**: abstraction (/dev), drivers, scheduling, buffering.
- **Buffering** = in-memory smoothing; **spooling** = queuing (e.g. to disk) for shared devices.
- On Linux: `df`, `du`, `lsblk`, `mount`, `iostat`, `iotop`, `lsof`, `fuser`.

---

## Further reading

**Official Linux documentation**

- [Linux kernel: Block layer](https://docs.kernel.org/block/index.html) — Block devices and I/O.
- [Linux man pages: mount(8)](https://man7.org/linux/man-pages/man8/mount.8.html), [fstab(5)](https://man7.org/linux/man-pages/man5/fstab.5.html), [df(1)](https://man7.org/linux/man-pages/man1/df.1.html) — Mounting and disk usage.

**File and directory commands**

- [cd command](https://www.tecmint.com/cd-command-in-linux/) — Absolute/relative paths, `cd -`, `pushd`/`popd`, spaces, wildcards, zoxide.
- [pwd command](https://www.tecmint.com/pwd-command-examples/) — Print working directory, -L/-P, $PWD, scripting.
- [mkdir command](https://www.tecmint.com/mkdir-command-examples/) — Single/multiple dirs, -p, -m, -v, brace expansion.
- [cp command](https://www.tecmint.com/cp-command-examples/) — Copy files/dirs, -r, -i, -n, -u, -p, -f, --backup, -l/-s.
- [touch command](https://www.tecmint.com/8-pratical-examples-of-linux-touch-command/) — Create empty files, -a/-m/-c/-r/-t.
- [mv command](https://www.tecmint.com/mv-command-linux-examples/) — Rename/move, -v, -i, -n, -u, --backup.
- [df command](https://www.tecmint.com/how-to-check-disk-space-in-linux/) — Disk space, -h, -T, -i, -t, -x.
- [du command](https://www.tecmint.com/check-linux-disk-usage-of-files-and-directories/) — Directory/file usage, -h, -s, -a, -c, --exclude, --time.
- [ln: hard and symbolic links](https://www.tecmint.com/create-hard-and-symbolic-links-in-linux/) — ln, ln -s, -f, -v.
- [rmdir command](https://www.tecmint.com/rmdir-command-examples/) — Remove empty dirs, -p, -v, --ignore-fail-on-non-empty.
- [sort command](https://www.tecmint.com/sort-command-linux/) — Sort lines, -n, -M, -t, -k, -c.
- [wc command](https://www.tecmint.com/wc-command-examples/) — Lines, words, bytes, -l, -w, -c, -L.
- [free command](https://www.tecmint.com/check-memory-usage-in-linux/) — Physical and swap memory, -h, -s.
- [15 Basic ls Command Examples](https://www.tecmint.com/15-basic-ls-command-examples-in-linux/) — ls options (long, hidden, recursive, sort by time/size, inode).
- [35 Practical Examples of Linux Find Command](https://www.tecmint.com/35-practical-examples-of-linux-find-command/) — find by name, type, permission, time, size, -exec.
- [18 Tar Command Examples](https://www.tecmint.com/18-tar-command-examples-in-linux/) — create/extract/list tar, tar.gz, tar.bz2; exclude, wildcards.
- [12 Practical Examples of Linux Grep Command](https://www.tecmint.com/12-practical-examples-of-linux-grep-command/) — grep -i, -v, -A/-B/-C, -n, -r, -w, zgrep, egrep/fgrep.
- [Mount local and network (NFS, Samba) filesystems](https://www.tecmint.com/mount-filesystem-in-linux/) — mount/umount, -o options, fstab, NFS, CIFS credentials.
- [Ext2, Ext3, Ext4: create and convert](https://www.tecmint.com/what-is-ext2-ext3-ext4-and-how-to-create-and-convert-linux-file-systems/) — mke2fs, mkfs.ext3/ext4, tune2fs -j and -O extents.
- [Linux file system types](https://www.tecmint.com/linux-file-system-explained/) — ext2/3/4, XFS, Btrfs, JFS, partition table, BIOS vs UEFI.
- [Rsnapshot backup utility](https://www.tecmint.com/rsnapshot-a-file-system-backup-utility-for-linux/) — config, snapshot_root, intervals, backup, exclude, cron.

**Concepts and tutorials**

- [File Systems in Operating System](https://www.geeksforgeeks.org/operating-systems/file-systems-in-operating-system/)
- [Secondary Memory](https://www.geeksforgeeks.org/computer-science-fundamentals/secondary-memory/)
- [Disk Scheduling Algorithms](https://www.geeksforgeeks.org/operating-systems/disk-scheduling-algorithms/)
- [Device Management in Operating System](https://www.geeksforgeeks.org/operating-systems/device-management-in-operating-system/)
- [Spooling vs Buffering](https://www.geeksforgeeks.org/operating-systems/difference-between-spooling-and-buffering/)
- [File management in Linux](https://www.geeksforgeeks.org/linux-unix/file-management-in-linux/)
- [Implementing Directory Management using Shell Script](https://www.geeksforgeeks.org/linux-unix/implementing-directory-management-using-shell-script/)
