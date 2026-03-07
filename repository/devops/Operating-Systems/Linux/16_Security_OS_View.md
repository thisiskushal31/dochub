# Security from the OS view (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Users, groups, and scheduling](./10_Users_Groups_And_Scheduling.md), [Networking and firewall](./11_Networking_And_Firewall.md). Here: **mandatory access control (SELinux, AppArmor)**, **PAM (authentication)**, **SSH hardening**, and **audit (auditd)** from the operating-system perspective. For full security and DevSecOps, see the handbook’s Security section; this topic ties OS mechanisms to daily admin tasks.

---

## Mandatory access control (MAC): SELinux and AppArmor

**Discretionary access control (DAC)** — Owner and permissions (rwx, ugo) decide access; the owner can change them. **Mandatory access control (MAC)** — The kernel enforces a **policy** that restricts what processes can do (files, ports, capabilities) regardless of ownership. Even root can be denied.

On Linux, the two common MAC systems are **SELinux** (RHEL, Fedora, CentOS) and **AppArmor** (Debian, Ubuntu, SUSE). You only need one active; which one depends on the distro.

### SELinux (RHEL family)

**SELinux** labels every process and object (file, port) with a **security context** (user:role:type). Policy rules allow or deny operations (e.g. “process type `httpd_t` may read files with type `httpd_content_t`”). **Enforcing** = deny and log; **Permissive** = log only.

```bash
# Status
getenforce          # Enforcing | Permissive | Disabled
sudo setenforce 0   # Permissive (temporary)
sudo setenforce 1   # Enforcing

# Contexts
ls -Z /var/www/html/
ps -Z -C nginx

# Fix wrong context (e.g. after copy/restore)
sudo restorecon -Rv /var/www/html/
sudo chcon -t httpd_sys_content_t /var/www/html/myfile

# Booleans (policy toggles)
getsebool -a
sudo setsebool -P httpd_can_network_connect 1

# When something is denied: check logs
sudo ausearch -m avc -ts recent
journalctl -t setroubleshoot
# Generate allow module (use only after understanding risk)
sudo audit2allow -a -M mymod
sudo semodule -i mymod.pp
```

**Distro detail:** See [Distributions: RHEL family](./Distributions/RHEL_Family.md) for SELinux in depth.

### AppArmor (Debian / Ubuntu family)

**AppArmor** uses **profiles** (loaded from `/etc/apparmor.d/`) that restrict capabilities, file access, and network per program. Profiles can be in **enforce** or **complain** (log only).

```bash
# Status
sudo aa-status
sudo aa-status --complaining

# Switch profile to complain (log only) or enforce
sudo aa-complain /etc/apparmor.d/usr.sbin.nginx
sudo aa-enforce /etc/apparmor.d/usr.sbin.nginx

# Reload after editing profile
sudo systemctl reload apparmor
# Or: sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
```

**When something is denied:** Check `dmesg` or `journalctl` for `APPARMOR`; adjust the profile in `/etc/apparmor.d/` (or `/etc/apparmor.d/local/`) and reload.

**Distro detail:** See [Distributions: Debian family](./Distributions/Debian_Family.md) for AppArmor in depth.

---

## PAM (Pluggable Authentication Modules)

**PAM** is the layer between applications and authentication mechanisms (passwords, LDAP, keys, MFA). When you log in (console, SSH, sudo), the program (login, sshd, sudo) calls PAM, which runs a stack of **modules** defined in `/etc/pam.d/`.

**Config:** Each service has a file under `/etc/pam.d/` (e.g. `login`, `sshd`, `sudo`). Lines specify **type** (auth, account, password, session), **control** (required, sufficient, optional), and **module** (e.g. `pam_unix.so`, `pam_sss.so`).

```bash
# List PAM config for a service
cat /etc/pam.d/sshd
cat /etc/pam.d/sudo

# Common modules (names may vary)
# pam_unix.so   — password/auth against /etc/shadow
# pam_sss.so    — SSSD (LDAP/AD)
# pam_limits.so — limits (e.g. nofile) from /etc/security/limits.conf
# pam_tally2.so / pam_faillock.so — lockout after failed attempts
```

**limits.conf** — PAM can apply resource limits at login. Edit `/etc/security/limits.conf` or files under `/etc/security/limits.d/` (e.g. `nofile`, `nproc`). Requires a new login or session to take effect.

**Why it matters:** Broken PAM config can lock you out (e.g. wrong `pam_sss.so` or typo). Always keep a root console or recovery access when changing PAM. For LDAP/AD integration, see SSSD and distro docs.

---

## SSH hardening (OS perspective)

SSH is the main remote-administration interface. From the OS view, you care about **which binary**, **config**, and **keys**.

**Config:** `/etc/ssh/sshd_config` (server). Restrict root and force key-based auth for production:

```bash
# Typical hardening (adjust to policy)
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers admin deploy
# Then restart: systemctl restart sshd
```

**Keys:** User keys in `~/.ssh/authorized_keys`; server host keys in `/etc/ssh/ssh_host_*`. Use `ssh-keygen` for key generation and `ssh-copy-id` to deploy.

**Audit:** Check auth logs for failures: `journalctl -u sshd` or `grep "Failed\|Accepted" /var/log/secure` (or auth.log). Use **fail2ban** or **pam_faillock** to limit brute force; see distro and Security section.

---

## Audit (auditd)

**auditd** records **audit events** (file access, syscalls, logins) to disk for compliance and forensics. Rules go in `/etc/audit/rules.d/` (or `audit.rules`); logs go to `/var/log/audit/audit.log`.

```bash
# Status
sudo systemctl status auditd
sudo auditctl -s

# Add rule (e.g. watch a file)
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
# List rules
sudo auditctl -l

# Search logs
sudo ausearch -k passwd_changes
sudo ausearch -m avc -ts recent
sudo ausearch -ui 1000
```

**Persistence:** Rules in `/etc/audit/rules.d/` are loaded at boot. Use `auditctl` for one-off rules; add to rules.d for permanent.

**SELinux:** Denials are logged as AVC events; `ausearch -m avc` and `audit2allow` are used to inspect and (carefully) allow new behavior.

---

## Summary

- **MAC:** **SELinux** (RHEL) or **AppArmor** (Debian/Ubuntu) enforce policy; use `getenforce`/`setenforce` or `aa-status`/`aa-enforce`; fix contexts or profiles when access is wrongly denied.
- **PAM:** Authentication stack in `/etc/pam.d/`; **limits** in `/etc/security/limits.conf`; changes apply at next login.
- **SSH:** Harden `/etc/ssh/sshd_config` (e.g. no root login, key-only), protect `authorized_keys` and host keys; monitor auth logs.
- **Audit:** **auditd** and **ausearch** for compliance and forensics; AVC logs for SELinux.

---

## Further reading

- [SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/) (Red Hat), [AppArmor](https://wiki.ubuntu.com/AppArmor)
- [PAM](https://man7.org/linux/man-pages/man7/pam.7.html), [limits.conf(5)](https://man7.org/linux/man-pages/man5/limits.conf.5.html)
- [sshd_config(5)](https://man7.org/linux/man-pages/man5/sshd_config.5.html)
- [auditd](https://linux.die.net/man/8/auditd), [ausearch(8)](https://man7.org/linux/man-pages/man8/ausearch.8.html)
