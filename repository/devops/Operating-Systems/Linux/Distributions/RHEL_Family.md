# RHEL family (RHEL, CentOS, Fedora, Rocky, AlmaLinux)

[← Back to Distributions](./README.md) · [↑ Linux](../README.md)

This covers **Red Hat–based** distributions: **RHEL** (Red Hat Enterprise Linux), **CentOS** (and Stream), **Fedora** (upstream), **Rocky Linux**, and **AlmaLinux**. They share the **rpm** package format and **dnf**/ **yum** as the primary package manager. This section goes **in depth**: repositories, subscription, SELinux, firewalld, systemd, logging, and tuning so you can administer any of these distros confidently.

---

## Relationship between distros

| Distro | Role | Release model |
|--------|------|----------------|
| **Fedora** | Upstream; new features first. | Short cycle (~6 months). |
| **RHEL** | Enterprise, paid support. | Long support (e.g. 10 years). |
| **CentOS Stream** | Rolling between Fedora and RHEL. | Continuous. |
| **Rocky Linux / AlmaLinux** | Free, binary-compatible rebuilds of RHEL. | Follows RHEL releases. |

Fedora is where new packages and kernel features land first; RHEL stabilizes a subset for long-term support. Rocky and Alma provide the same binaries as RHEL without Red Hat subscription. CentOS Stream sits between Fedora and RHEL and is used to prepare the next RHEL minor release.

---

## Package management: dnf and yum

**dnf** is the default on Fedora and modern RHEL/CentOS; **yum** is the legacy CLI (often a symlink or wrapper to dnf). Both use the same metadata and repository layout.

```bash
# Refresh metadata (fetch repo indexes)
sudo dnf check-update
sudo dnf makecache

# Install / remove
sudo dnf install package-name
sudo dnf install package-1 package-2
sudo dnf remove package-name
sudo dnf groupinstall "Development Tools"
sudo dnf group list

# Update system (update = upgrade packages; upgrade is an alias)
sudo dnf update
sudo dnf upgrade

# Query
dnf list installed
dnf list available
dnf search keyword
dnf info package-name
dnf provides /usr/bin/nginx    # Which package provides this file?

# Repositories
dnf repolist
dnf repolist all
dnf repolist --enabled
dnf repolist --disabled

# History and groups
dnf history                    # List past dnf transactions
dnf history undo last          # Undo last transaction (if supported)
dnf grouplist                  # List package groups
dnf groupinstall "Educational Software"
dnf groupremove "Group Name"

# Install from a specific repo or sync
dnf --enablerepo=epel install phpmyadmin
dnf distro-sync                 # Sync installed packages to stable repo versions
dnf reinstall package-name
dnf downgrade package-name      # Downgrade if older version available

# Clean and help
dnf clean all                  # Clear cache (fixes stale metadata errors)
dnf autoremove                 # Remove orphaned dependencies
dnf help
dnf help clean
```

**rpm** (low-level; use when you have a `.rpm` file or need to query the database directly):

```bash
# Query installed
rpm -qa                        # All installed packages
rpm -qa --last                 # Recently installed (with dates)
rpm -qi package-name           # Info (version, vendor, description)
rpm -ql package-name           # Files owned by package
rpm -qf /path/to/file          # Which package owns this file
rpm -qR package-name           # Requires (dependencies)
rpm -qd package-name          # Documentation files (e.g. man pages)

# Query a .rpm file (before install)
rpm -qip package.rpm           # Info
rpm -qpR package.rpm           # Dependencies of the file

# Install / upgrade / remove
rpm -ivh package.rpm           # Install (-i), verbose (-v), hash progress (-h)
rpm -ivh --nodeps package.rpm  # Force install ignoring deps (risky)
rpm -Uvh package.rpm           # Upgrade (or install if not present)
rpm -e package-name            # Erase (uninstall)
rpm -e --nodeps package-name   # Force remove (may break others)

# Verify and signatures
rpm --checksig package.rpm     # Check PGP signature and digest
rpm -Vp package.rpm            # Verify package file
rpm -Va                        # Verify all installed packages
rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-8
rpm -qa gpg-pubkey*            # List imported GPG keys

# Database (if corrupted)
rpm --rebuilddb                # Rebuild RPM DB in /var/lib/rpm
```

---

## Repository configuration

Repositories are defined by `.repo` files under `/etc/yum.repos.d/` (and `/etc/dnf/dnf.conf` can set global options). Each repo has a unique `[id]`, `baseurl` or `mirrorlist`, and optionally `gpgcheck` and `enabled`.

**Example:** `/etc/yum.repos.d/appstream.repo` (RHEL/Rocky/Alma):

```ini
[appstream]
name=AppStream
mirrorlist=https://mirrors.rockylinux.org/mirrorlist?arch=$basearch&repo=AppStream-8
#baseurl=http://dl.rockylinux.org/$contentdir/$releasever/AppStream/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-rocky
```

**Enable/disable a repo:**

```bash
sudo dnf config-manager --enable repo_id
sudo dnf config-manager --disable repo_id
# List all repo options
dnf repoinfo
```

**Global dnf options** — `/etc/dnf/dnf.conf` (or drop-ins under `/etc/dnf/conf.d/`):

```ini
[main]
gpgcheck=1
installonly_limit=3
clean_requirements_on_remove=True
best=True
```

---

## RHEL subscription (RHEL only)

On **RHEL**, you need to attach a subscription to get access to official repos and support. Rocky, Alma, Fedora, and CentOS Stream do not use subscription-manager for repo access.

```bash
# Register with Red Hat (interactive or with username/password)
sudo subscription-manager register
# Or: sudo subscription-manager register --username user --password pass --auto-attach

# Attach an available subscription (e.g. from a pool)
sudo subscription-manager attach --pool=POOL_ID
# Or auto-attach a suitable subscription
sudo subscription-manager attach --auto

# List subscriptions and consumed products
sudo subscription-manager list --consumed
sudo subscription-manager status

# Refresh after attaching (enable repos, update metadata)
sudo subscription-manager refresh
```

---

## SELinux (Mandatory Access Control)

**SELinux** enforces **mandatory access control**: every process and file has a **security context** (user:role:type). Policy rules allow or deny operations (e.g. “process type `httpd_t` may read files with type `httpd_content_t`”). Even root is constrained by policy, which limits the impact of a compromised service.

**Check status and mode:**

```bash
getenforce          # Enforcing / Permissive / Disabled
sudo setenforce 0   # Temporarily set to Permissive (no reboot)
sudo setenforce 1   # Back to Enforcing
```

**View security contexts:**

```bash
ls -Z /var/www/html/
# system_u:object_r:httpd_sys_content_t:s0 index.html

ps -Z -C nginx
# system_u:system_r:httpd_t:s0  (process type httpd_t)
```

**Fix wrong context** (e.g. after copying files or restoring from backup):

```bash
# Restore default context for a path (uses file_contexts)
sudo restorecon -Rv /var/www/html/

# Set context manually (temporary; prefer restorecon)
sudo chcon -t httpd_sys_content_t /var/www/html/myapp
```

**Booleans** — Toggle policy features (e.g. allow httpd to connect to network, allow NFS home dirs):

```bash
getsebool -a
sudo setsebool -P httpd_can_network_connect 1
```

**When something is denied:** Check logs with `ausearch -m avc -ts recent` or `journalctl -t setroubleshoot`. Use `audit2allow` to generate a custom module that allows the denied action (only after you understand and accept the risk).

```bash
sudo ausearch -m avc -ts recent
sudo audit2allow -a -M mymodule
sudo semodule -i mymodule.pp
```

---

## Firewalld (dynamic firewall)

**firewalld** manages **nftables** (or iptables) with a zone-based model. Each zone has a default policy and a set of allowed services/ports. Interfaces and sources are assigned to zones (e.g. `public`, `dmz`, `trusted`).

**Structure:**

```
  Incoming packet → zone for interface/source → rules (services, ports, rich rules)
  Default zone: applied to interfaces not explicitly assigned
```

**Essential commands:**

```bash
# List default zone and zone for each interface
firewall-cmd --get-default-zone
firewall-cmd --get-active-zones

# List all rules in default zone
firewall-cmd --list-all
# For a specific zone
firewall-cmd --zone=public --list-all

# Add/remove service (service = predefined port set, e.g. http = 80/tcp)
sudo firewall-cmd --add-service=http
sudo firewall-cmd --add-service=http --permanent   # Persist across reload
sudo firewall-cmd --remove-service=http --permanent

# Add/remove port
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --remove-port=8080/tcp --permanent

# Reload to apply permanent changes (no drop of existing connections)
sudo firewall-cmd --reload

# Rich rule (e.g. allow from one IP, or forward port)
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" accept' --permanent
sudo firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080 --permanent
```

**Zone assignment:**

```bash
sudo firewall-cmd --zone=trusted --add-interface=eth1
sudo firewall-cmd --zone=public --add-source=192.168.2.0/24 --permanent
```

---

## Systemd (services and targets)

All RHEL-family distros use **systemd**. Unit files live in `/usr/lib/systemd/system/` (vendor) and `/etc/systemd/system/` (overrides and custom).

**Service lifecycle:**

```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx    # If supported (e.g. SIGHUP)
sudo systemctl enable nginx    # Start at boot
sudo systemctl disable nginx
sudo systemctl status nginx
```

**Override a unit** (e.g. add env var or change ExecStart):

```bash
sudo systemctl edit nginx
# Creates /etc/systemd/system/nginx.service.d/override.conf
# After editing:
sudo systemctl daemon-reload
sudo systemctl restart nginx
```

**Targets (runlevels):**

```bash
systemctl get-default              # e.g. graphical.target or multi-user.target
sudo systemctl set-default multi-user.target
sudo systemctl isolate rescue.target   # Single-user maintenance
```

**Logs:** See “Logging” below.

---

## Logging

- **systemd journal** — Primary log store. Query with `journalctl`.
- **rsyslog** — Can forward to files under `/var/log/` (e.g. `/var/log/messages`, `/var/log/secure`). Config: `/etc/rsyslog.conf` and `/etc/rsyslog.d/`.

**journalctl:**

```bash
journalctl -b                  # Current boot
journalctl -u nginx            # Unit nginx
journalctl -f                  # Follow (like tail -f)
journalctl -p err -b           # Priority error this boot
journalctl --since "1 hour ago"
journalctl -o short-iso
```

**Persistent journal** — By default the journal may be volatile. To persist: create `/etc/systemd/journald.conf.d/persist.conf` with `Storage=persistent`, then restart `systemd-journald`.

---

## Kernel and system tuning (sysctl)

Runtime kernel parameters are under `/proc/sys/` and can be set with **sysctl**. Persistent config: `/etc/sysctl.conf` or files in `/etc/sysctl.d/`.

```bash
sysctl -a                     # List all
sysctl vm.swappiness          # Read one
sudo sysctl -w vm.swappiness=10   # Set for current boot
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.d/99-tuning.conf
sudo sysctl -p /etc/sysctl.d/99-tuning.conf
```

Common tuning: `vm.swappiness`, `net.ipv4.tcp_fin_timeout`, `net.core.somaxconn`, `fs.file-max`. See RHEL tuning guide in Further reading.

---

## Summary

- **RHEL family** = Fedora (upstream), RHEL (enterprise + subscription), CentOS Stream (rolling), Rocky/Alma (free RHEL rebuilds).
- **Packages:** **dnf** / **yum**; repos in `/etc/yum.repos.d/`; **rpm** for low-level queries.
- **RHEL only:** **subscription-manager** to register and attach subscriptions.
- **SELinux:** Enforcing by default; use `restorecon`, `chcon`, `setsebool`, and audit logs to fix denials.
- **firewalld:** Zone-based; `firewall-cmd --add-service/port`, `--reload`, rich rules.
- **systemd:** Services and targets; overrides in `/etc/systemd/system/`.
- **Logs:** **journalctl** and optionally **rsyslog** to `/var/log/`.
- **Tuning:** **sysctl** and `/etc/sysctl.d/`.

---

## Further reading

- [DNF commands for RPM package management](https://www.tecmint.com/dnf-commands-for-fedora-rpm-package-management/) — repolist, list, search, provides, install, update, remove, history, grouplist, clean, distro-sync, reinstall, downgrade.
- [RPM command examples](https://www.tecmint.com/20-practical-examples-of-rpm-commands-in-linux/) — install, query, verify, signature, rebuilddb.
- [Package management (Yum, RPM, Apt, Dpkg, Zypper)](https://www.tecmint.com/linux-package-management/) — low-level vs high-level tools by distro.
- [Fedora documentation](https://docs.fedoraproject.org/)
- [RHEL documentation](https://access.redhat.com/documentation/)
- [CentOS / CentOS Stream](https://www.centos.org/)
- [Rocky Linux](https://rockylinux.org/)
- [AlmaLinux](https://almalinux.org/)
