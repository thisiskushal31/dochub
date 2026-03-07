# openSUSE / SUSE

[← Back to Distributions](./README.md) · [↑ Linux](../README.md)

This covers **openSUSE** (Leap, Tumbleweed) and **SUSE Linux Enterprise** (SLE). They use **zypper** as the primary package manager, **RPM** packages, and **YaST** for many admin tasks. This section goes **in depth**: zypper, repo management, YaST, transactional updates (SUSE), and systemd so you can administer these distros confidently.

---

## Variants and release model

| Variant | Role | Release model |
|---------|------|----------------|
| **openSUSE Leap** | Community; aligned with SUSE Linux Enterprise. | Fixed release; new major version periodically. |
| **openSUSE Tumbleweed** | Rolling. | Continuous; tested with openQA. |
| **SUSE Linux Enterprise (SLE)** | Enterprise, paid support. | Long support cycles. |

Leap shares a lot with SLE; Tumbleweed is rolling and often has newer packages.

---

## Package management: zypper

**zypper** is the main CLI. It uses **libzypp** and resolves dependencies from configured repositories.

```bash
# Refresh repository metadata
sudo zypper refresh
# Update installed packages (stay on same release)
sudo zypper update
# Distribution upgrade (Tumbleweed: move to latest snapshot; Leap: major upgrade)
sudo zypper dup

# Install / remove
sudo zypper install package-name
sudo zypper remove package-name
sudo zypper install -t pattern lamp_server   # Install pattern (meta-package)

# Query
zypper search keyword
zypper info package-name
zypper packages --installed-only
zypper what-provides /usr/bin/nginx

# Repositories
zypper repos
zypper repos -d                    # Show URIs
sudo zypper addrepo URL alias
sudo zypper removerepo alias
sudo zypper modifyrepo -e -a        # Enable all repos
```

**Repo configuration** — Repos are under **/etc/zypp/repos.d/** (`.repo` files). Each repo has a URL, enabled flag, and priority. Priority is used when a package is in multiple repos (lower number = higher priority).

```bash
zypper lr -u
sudo zypper modifyrepo -p 10 repo_alias
```

---

## YaST (administration)

**YaST** (Yet another Setup Tool) is the main admin interface: GUI (`yast2`) or ncurses (`yast`). It edits configs and runs the underlying commands (zypper, firewall, user, etc.).

```bash
yast2                    # GUI (if X/Wayland)
yast                    # TUI (ncurses)
yast2 network           # Network module
yast2 users             # Users
yast2 firewall          # Firewall (firewalld)
yast2 software          # Software management (repos, install/remove)
```

Many settings can also be done by editing config files and using systemctl/zypper/firewall-cmd directly; YaST is a central place for common tasks.

---

## Firewall and services

openSUSE/SLE use **firewalld** (same concepts as RHEL). Commands: `firewall-cmd --list-all`, `firewall-cmd --add-service=http --permanent`, `firewall-cmd --reload`. Services are managed with **systemd**: `systemctl start/enable nginx`.

---

## Transactional updates (SUSE / openSUSE MicroOS)

On **SLE Micro** and **openSUSE MicroOS** (and similar), the root filesystem is **read-only** and updates are applied in a **transaction**: a new snapshot is created with updates, and on reboot the system boots into that snapshot. This gives atomic upgrades and easy rollback.

```bash
# Apply updates in a new snapshot (reboot to activate)
transactional-update up
# Or with shell in the same transaction
transactional-update shell
# ... run zypper commands ...
# exit
# Then reboot
```

On traditional Leap/Tumbleweed (read-write root), use `zypper update` or `zypper dup` as above; no transactional-update.

---

## Summary

- **openSUSE** = Leap (fixed, aligned with SLE) and Tumbleweed (rolling); **SLE** = enterprise.
- **zypper** for packages; repos in `/etc/zypp/repos.d/`; **zypper refresh**, **update**, **dup**.
- **YaST** (yast2 / yast) for GUI/TUI admin (network, users, firewall, software).
- **Transactional updates** on MicroOS/SLE Micro: `transactional-update up` and reboot.
- **Firewall and services:** firewalld, systemd.

---

## Further reading

- [openSUSE documentation](https://doc.opensuse.org/)
- [SUSE documentation](https://documentation.suse.com/)
