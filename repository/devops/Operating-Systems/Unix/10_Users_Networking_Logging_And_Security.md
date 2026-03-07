# Users, networking, logging, and security (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Introduction and basics](./1_Introduction_And_Basics.md), [Shell and scripting](./9_Shell_And_Scripting.md). Here: **user management**, **networking**, **logging**, and **security** on Unix and Unix-like systems. Commands and paths vary by **flavor** (BSD, Solaris, AIX, HP-UX); this topic gives a common frame and points to [Flavors](./Flavors/README.md) for details.

---

## User management (local)

Unix uses **local users and groups** stored in `/etc/passwd`, `/etc/group`, and (on most systems) `/etc/shadow`. Creation and modification are flavor-specific.

| Flavor | Add user | Set password | Groups |
|--------|----------|--------------|--------|
| **FreeBSD / BSD** | `adduser` (interactive) or `pw useradd name -m -s /bin/sh` | `passwd name` | `pw groupadd`, `pw groupmod name -m user` |
| **Solaris / illumos** | `useradd -m -s /bin/bash name` | `passwd name` | `groupadd`, `usermod -G group name` |
| **AIX** | `mkuser`, SMIT | `passwd name` | `mkgroup`, `chuser groups=...` |
| **HP-UX** | `useradd` | `passwd` | `groupadd`, `usermod` |

**Cron** — Scheduled jobs: `crontab -e` (per user), or system crontabs in `/etc/cron.d/`, `/etc/crontab`, or `/var/cron/tabs/` (BSD). Syntax: minute, hour, day-of-month, month, day-of-week, command. See [Shell and scripting](./9_Shell_And_Scripting.md) for shell use in cron.

**Where to go deeper:** [Flavors: BSD](./Flavors/BSD_Family.md), [Flavors: Solaris](./Flavors/Solaris_illumos.md), [Flavors: AIX](./Flavors/AIX.md), [Flavors: HP-UX](./Flavors/HP_UX.md).

---

## Networking

**Common commands (behavior and paths vary by OS):**

```bash
# Interfaces and addresses (BSD: ifconfig; Linux: ip or ifconfig; Solaris: ipadm, ifconfig)
ifconfig
ifconfig em0

# Routing
netstat -r
route get default   # BSD
route -n            # Linux

# Listener and connections
netstat -an
netstat -tuln       # Linux
sockstat -l         # BSD
```

**Firewall** — **pf** (OpenBSD, also FreeBSD), **ipfilter** (Solaris, some BSD), **ipfw** (FreeBSD legacy). Rules and syntax are flavor-specific; see [Flavors](./Flavors/README.md).

---

## Logging (how to check)

**syslog** — Most Unix systems use **syslog** (or a variant: **rsyslog**, **syslog-ng**). Messages are sent to facilities (kern, user, daemon, auth, etc.) and priorities; config in `/etc/syslog.conf` or `/etc/rsyslog.conf`. **logger** sends from shell: `logger -p user.info "message"`.

**Where logs live:** `/var/log/` — often `messages`, `secure` or `auth.log`, `maillog`, and app-specific dirs. **BSD:** `/var/log/messages`, `/var/log/auth.log`. **Solaris:** SMF logs, `/var/svc/log/`. **View:** `tail -f /var/log/messages`, `grep` by pattern or time.

**Where to go deeper:** [Flavors](./Flavors/README.md) for syslog and log paths per OS.

---

## Security (overview)

- **SSH** — `ssh`, `sshd`; config in `/etc/ssh/sshd_config`. Key-based auth, disable root login, and hardening are common across Unix.
- **File permissions** — `chmod`, `chown`, `chgrp`; setuid/setgid; ACLs where supported (e.g. `getfacl`/`setfacl` on Linux, NFSv4 ACLs on Solaris).
- **Firewall** — See Networking above; pf, ipfilter, or ipfw per flavor.
- **MAC (Mandatory Access Control)** — **TrustedBSD** (FreeBSD), **SELinux** (some Linux), **Zones** and labels (Solaris). Flavor-specific.

**Where to go deeper:** [Flavors](./Flavors/README.md), [Linux: Security from the OS view](../Linux/16_Security_OS_View.md) for concepts that apply across Unix-like systems.

---

## Summary

- **User management:** `adduser`/`pw` (BSD), `useradd` (Solaris/AIX/HP-UX); `passwd`, groups; **cron** for scheduling. See Flavors.
- **Networking:** `ifconfig`, `netstat`, `route` (or flavor equivalents); **firewall** = pf, ipfilter, or ipfw per flavor.
- **Logging:** **syslog**; logs under `/var/log/`; `logger`; flavor-specific paths and SMF on Solaris.
- **Security:** SSH, permissions, firewall, MAC (flavor-specific). See Flavors for details.

---

## Further reading

- [FreeBSD Handbook: Users and basic account management](https://docs.freebsd.org/en/books/handbook/security/#users)
- [FreeBSD Handbook: Firewalls](https://docs.freebsd.org/en/books/handbook/firewalls/)
- [OpenBSD: pf](https://www.openbsd.org/faq/pf/)
- [Oracle Solaris: Managing network services](https://docs.oracle.com/cd/E37838_01/html/E61006/index.html)
- [Flavors](./Flavors/README.md) — BSD, Solaris, AIX, HP-UX for commands and paths.
