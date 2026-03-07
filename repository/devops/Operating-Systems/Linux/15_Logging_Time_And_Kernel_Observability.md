# Logging, time, and kernel observability (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Introduction and basics](./1_Introduction_And_Basics.md), [Storage and I/O](./8_Storage_And_IO.md). Here: **where logs live**, **system and NTP time**, **kernel parameters and tuning**, **where to look when troubleshooting**, and **real-time and low-latency** on Linux.

---

## Logging: where logs live and how to read them

On modern Linux, logs come from **systemd journal** (primary) and often **rsyslog** (traditional files under `/var/log`). Knowing both lets you debug services, boot, and security events.

### systemd journal (journalctl)

The **journal** is a binary log store managed by **systemd-journald**. It captures kernel messages, service stdout/stderr, and structured metadata (priority, unit, boot ID). Query with **journalctl**.

```bash
# Current boot only
journalctl -b
journalctl -b -p err
journalctl -b -p err --no-pager

# By unit (service)
journalctl -u nginx
journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"

# By time
journalctl --since "2024-01-15"
journalctl --since "1 hour ago"
journalctl --until "yesterday"

# Kernel messages (same as dmesg)
journalctl -k
journalctl -k -b

# Follow (like tail -f)
journalctl -f
journalctl -u nginx -f

# Output format
journalctl -o short
journalctl -o short-iso
journalctl -o json-pretty
```

**Persistence:** By default the journal may be **volatile** (in RAM, lost at reboot). To persist: in `/etc/systemd/journald.conf` (or drop-in under `/etc/systemd/journald.conf.d/`) set `Storage=persistent`, then restart: `systemctl restart systemd-journald`.

### rsyslog and /var/log

**rsyslog** (or syslog-ng) can write to **/var/log** using rules in `/etc/rsyslog.conf` and `/etc/rsyslog.d/`. Common paths:

| Path | Typical content |
|------|------------------|
| `/var/log/syslog` | General messages (Debian/Ubuntu). |
| `/var/log/messages` | General messages (RHEL/CentOS). |
| `/var/log/secure` or `/var/log/auth.log` | Authentication (ssh, sudo, login). |
| `/var/log/maillog` | Mail (if mail server). |
| `/var/log/cron` | Cron job output (where configured). |

```bash
# Tail and follow
tail -f /var/log/syslog
tail -f /var/log/secure

# Search
grep "Failed password" /var/log/secure
grep -i error /var/log/syslog
```

Application logs may go to **/var/log/** (e.g. `/var/log/nginx/`) or to the journal if the service is a systemd unit with `StandardOutput=journal`.

### Log rotation (logrotate)

**logrotate** prevents logs from filling disk: it renames, compresses, and optionally deletes old files. Config: `/etc/logrotate.conf` and `/etc/logrotate.d/*`.

```bash
# Config example: /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 nginx adm
}

# Test config
logrotate -d /etc/logrotate.conf
# Force run
logrotate -f /etc/logrotate.d/nginx
```

---

## Time: NTP and system time

Correct **system time** is required for logs, certificates, and clusters. Linux uses **systemd-timesyncd** (simple NTP client), **chrony**, or **ntpd** to keep time in sync.

### timedatectl (systemd)

**timedatectl** shows and sets time zone and time sync status.

```bash
# Status (NTP active, time zone, RTC)
timedatectl
timedatectl status

# Set time zone
sudo timedatectl set-timezone America/New_York
timedatectl list-timezones

# Enable NTP (uses systemd-timesyncd if available)
sudo timedatectl set-ntp true
```

### chrony (NTP client/server)

**chrony** is the preferred NTP daemon on many distros. Config: `/etc/chrony.conf` (or `/etc/chronyd.conf`).

```bash
# Install (RHEL: dnf install chrony; Debian: apt install chrony)
# Config: server pool.ntp.org iburst

systemctl enable chronyd
systemctl start chronyd
chronyc tracking
chronyc sources
chronyc makestep   # Force step if far off (use with care)
```

### Hardware clock (RTC)

The **hardware clock** (RTC) keeps time when the system is off. Sync it with system time on shutdown and read on boot.

```bash
# Show RTC
hwclock -r
# Sync system → RTC (after setting time)
sudo hwclock -w
# Sync RTC → system (e.g. at boot)
sudo hwclock -s
```

---

## Kernel parameters and tuning (sysctl)

Runtime kernel parameters live under **/proc/sys/** and can be read/set with **sysctl**. Persistent config: **/etc/sysctl.conf** or files in **/etc/sysctl.d/**.

```bash
# List all
sysctl -a

# Read one
sysctl vm.swappiness
sysctl net.ipv4.ip_forward

# Set for current boot
sudo sysctl -w vm.swappiness=10
sudo sysctl -w net.core.somaxconn=4096

# Load from file (e.g. after editing)
sudo sysctl -p /etc/sysctl.d/99-tuning.conf
```

**Common tuning (examples):**

| Parameter | Typical use |
|-----------|-------------|
| `vm.swappiness` | 0–100; lower = prefer RAM over swap (e.g. 10 for servers). |
| `net.core.somaxconn` | Max backlog for listening sockets. |
| `net.ipv4.tcp_fin_timeout` | TIME_WAIT duration. |
| `fs.file-max` | Max open file descriptors system-wide. |
| `vm.dirty_ratio` / `vm.dirty_background_ratio` | Writeback behavior. |

**Persistent:** Add lines to `/etc/sysctl.d/99-myname.conf` (e.g. `vm.swappiness=10`), then `sysctl -p /etc/sysctl.d/99-myname.conf` or reboot.

---

## /proc and /sys: where to look

**/proc** and **/sys** are virtual filesystems exposing kernel and process state. Use them to inspect the running system.

| Path | Use |
|------|-----|
| `/proc/cpuinfo` | CPU model, cores. |
| `/proc/meminfo` | Memory (MemTotal, MemFree, buffers, cached, swap). |
| `/proc/loadavg` | Load average (1, 5, 15 min). |
| `/proc/mounts` | Mounted filesystems. |
| `/proc/net/*` | Network state (e.g. tcp, udp). |
| `/proc/<pid>/*` | Per-process: cmdline, status, fd, maps, cwd. |
| `/sys/block/*` | Block devices and queue/scheduler. |
| `/sys/class/net/*` | Network interfaces. |
| `/sys/kernel/mm/*` | Memory management tuning. |

```bash
# Process info
cat /proc/$(pgrep nginx)/status
ls /proc/$(pgrep nginx)/fd
cat /proc/$(pgrep nginx)/cmdline | tr '\0' ' '

# System memory
cat /proc/meminfo
free -h

# Block I/O and scheduler
cat /sys/block/sda/queue/scheduler
```

---

## Troubleshooting: where to look (quick map)

When something is wrong, use this map to find the right place:

| Symptom or question | Where to look |
|----------------------|----------------|
| **Service failed** | `journalctl -u <unit> -b`, `systemctl status <unit>`, `systemctl --failed`. |
| **Boot slow or failed** | `journalctl -b`, `journalctl -b -p err`, `systemd-analyze blame`, `systemd-analyze critical-chain`. |
| **Process hung / high CPU** | `top`, `ps`, `/proc/<pid>/status` (state: D = uninterruptible sleep), `strace -p <pid>`, `perf top`. |
| **Out of memory (OOM)** | `dmesg \| grep -i oom`, `journalctl -k -b \| grep -i oom`, `/var/log/syslog` or `messages`. |
| **Disk full / I/O slow** | `df -h`, `du`, `iostat -x 1`, `iotop`, `/proc/<pid>/io`. |
| **Network issue** | `ip a`, `ip r`, `ss -tulnp`, `journalctl -u NetworkManager`, `/var/log/syslog`. |
| **Permission / access denied** | `ls -l`, `getfacl`, `journalctl` or logs for SELinux/AppArmor (avc, APPARMOR). |
| **Kernel / driver** | `dmesg`, `journalctl -k`, `lsmod`, `modinfo`. |

**Useful commands:** `strace -p <pid>` (syscalls), `lsof -p <pid>` (open files), `ss -tunap` (sockets), `iostat -x 1 5` (disk), `vmstat 1 5` (memory, I/O, CPU).

---

## Real-time and low-latency (Linux)

For **soft real-time** (low latency, not hard guarantees), you can use **scheduling policies** and **nice** values. For **hard real-time** (deadline guarantees), Linux offers **PREEMPT_RT** and real-time policies (requires RT kernel or kernel config).

### Scheduling policies and chrt

- **SCHED_OTHER** — Default (CFS); **nice** values adjust priority within this class.
- **SCHED_FIFO** / **SCHED_RR** — Real-time; higher priority than SCHED_OTHER; use with care (can starve the system).

**chrt** — Set or view scheduling policy and priority for a process.

```bash
# Run a process with FIFO policy, priority 50
chrt -f 50 -- /path/to/command

# Change existing process
chrt -f -p 50 <pid>

# View policy and priority
chrt -p <pid>
```

**nice** and **renice** — Adjust nice value (e.g. -20 to 19; lower = higher priority for SCHED_OTHER).

```bash
nice -n -10 ./script.sh
renice -n 5 -p <pid>
```

### PREEMPT_RT (hard real-time)

**PREEMPT_RT** is a patch set that makes the kernel more preemptible and reduces latency; used in industrial and embedded systems. It is not the default in most distros. For RT kernel builds and **cyclictest**, see kernel and real-time documentation. This handbook only flags that **real-time scheduling** (chrt, nice) and **RT kernel** options exist for low-latency workloads.

---

## Summary

- **Logging:** **journalctl** (systemd journal) and **rsyslog** → **/var/log**; **logrotate** for rotation.
- **Time:** **timedatectl**, **chrony** (or systemd-timesyncd), **hwclock** for RTC.
- **Kernel:** **sysctl** and **/etc/sysctl.d/** for tuning; **/proc** and **/sys** for inspection.
- **Troubleshooting:** Use the map above (journal, status, /proc, dmesg, iostat, strace, etc.) to find the right place.
- **Real-time:** **chrt** for scheduling policy; **nice**/ **renice** for priority; **PREEMPT_RT** for hard real-time (separate kernel/docs).

---

## Further reading

- [systemd journal (journalctl)](https://www.freedesktop.org/software/systemd/man/journalctl.html)
- [rsyslog](https://www.rsyslog.com/), [logrotate](https://linux.die.net/man/8/logrotate)
- [chrony](https://chrony.tuxfamily.org/), [NTP](https://www.ntp.org/)
- [Linux kernel parameters (sysctl)](https://www.kernel.org/doc/html/latest/admin-guide/sysctl/), [proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)
- [chrt(1)](https://man7.org/linux/man-pages/man1/chrt.1.html), [sched(7)](https://man7.org/linux/man-pages/man7/sched.7.html)
- [PREEMPT_RT](https://wiki.linuxfoundation.org/realtime/start) — Real-time Linux
