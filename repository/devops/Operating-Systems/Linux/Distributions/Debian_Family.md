# Debian family (Debian, Ubuntu, Mint, Pop!_OS)

[← Back to Distributions](./README.md) · [↑ Linux](../README.md)

This covers **Debian-based** distributions: **Debian**, **Ubuntu** (and its official flavors), **Linux Mint**, **Pop!_OS**, etc. They share the **deb** package format and **apt** as the primary package manager. This section goes **in depth**: repository configuration, apt workflow, snap vs apt, AppArmor, systemd, and logging so you can administer any of these distros confidently.

---

## Relationship

| Distro | Role | Release model |
|--------|------|----------------|
| **Debian** | Base; stable/testing/unstable. | Stable every ~2 years. |
| **Ubuntu** | Derived from Debian; desktop and server. | LTS every 2 years; interim every 6 months. |
| **Mint, Pop!_OS** | Based on Ubuntu (or Debian). | Follow upstream. |

Debian’s **stable** branch is the basis for Ubuntu LTS and many servers. **testing** and **unstable** (sid) are used by developers and advanced users. Ubuntu adds its own repositories and release cycle on top of Debian packages.

---

## Package management: apt and dpkg

**apt** is the high-level tool that resolves dependencies and fetches packages; **dpkg** is the low-level tool that installs `.deb` files and maintains the package database.

**Typical update and upgrade workflow:**

```
  apt update     →  fetch latest package lists from configured repos (does not install)
  apt upgrade    →  install security and updates for already-installed packages (no new deps that change install)
  apt full-upgrade (or dist-upgrade)  →  may install/remove packages to satisfy dependencies (e.g. major upgrades)
```

**apt commands:**

```bash
# Refresh package lists (always run before install/upgrade)
sudo apt update

# Install / remove
sudo apt install package-name
sudo apt install package1 package2
sudo apt remove package-name      # Remove package, keep config files
sudo apt purge package-name       # Remove package and config files
sudo apt autoremove                # Remove packages that were only needed as dependencies

# Upgrade
sudo apt upgrade                  # Safe upgrade (no new package installs that change others)
sudo apt full-upgrade             # Resolve dependencies; may remove/install (use for release upgrades)

# Query
apt list --installed
apt list --upgradable
apt search keyword
apt show package-name
apt policy package-name           # Which version would be installed and from which repo

# Clean
sudo apt clean                   # Remove downloaded .deb from cache
sudo apt autoclean               # Remove old versions from cache
```

**apt-get** (alternative to apt; same repos; `apt` is the recommended CLI):

```bash
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install package-name
sudo apt-get install package-name --no-upgrade    # Install but do not upgrade if already installed
sudo apt-get install package-name --only-upgrade   # Upgrade only, no new installs
sudo apt-get install vsftpd=3.0.5-0ubuntu1        # Specific version
sudo apt-get remove package-name                  # Remove, keep config
sudo apt-get purge package-name                   # Remove and delete config
sudo apt-get autoremove                           # Remove orphaned dependencies
sudo apt-get clean                                # Remove downloaded .deb from cache
sudo apt-get autoclean                            # Remove old package versions from cache
sudo apt-get source package-name                  # Download and unpack source
sudo apt-get build-dep package-name               # Install build dependencies
sudo apt-get check                                # Check for broken dependencies
sudo apt-get changelog package-name               # View package changelog
```

**dpkg** (low-level; use when you have a `.deb` file or need to query the database):

```bash
# Query
dpkg -l                          # List installed (dpkg -l apache2 for one package)
dpkg -l package-name             # Status of package
dpkg -L package-name             # Files owned by package
dpkg -S /path/to/file            # Which package owns this file
dpkg -c package.deb             # List contents of .deb (without installing)
dpkg -s package-name            # Status (installed or not)

# Install / remove
sudo dpkg -i package.deb         # Install from file (may leave broken deps; prefer: sudo apt install ./package.deb)
sudo dpkg -R --install dir/      # Install all .deb in directory recursively
sudo dpkg -r package-name        # Remove (keep config)
sudo dpkg -P package-name       # Purge (remove and delete config)

# Unpack and configure (advanced)
sudo dpkg --unpack package.deb   # Unpack only; then fix deps and:
sudo dpkg --configure -a         # Configure all unpacked packages
sudo dpkg --configure package-name
```

---

## Repository configuration (sources.list)

Repositories are defined in **/etc/apt/sources.list** and in files under **/etc/apt/sources.list.d/** (one file per repo or PPA). Each line has:

- **Type:** `deb` (binary) or `deb-src` (source)
- **URL:** base URL of the repo (e.g. `http://archive.ubuntu.com/ubuntu`)
- **Suite:** distribution release (e.g. `jammy`, `jammy-updates`, `jammy-security`)
- **Components:** one or more of `main`, `restricted`, `universe`, `multiverse` (Ubuntu) or `main`, `contrib`, `non-free` (Debian)

**Example (Ubuntu 22.04):**

```
deb http://archive.ubuntu.com/ubuntu jammy main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu jammy-updates main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu jammy-security main restricted universe multiverse
```

**Example (Debian stable):**

```
deb http://deb.debian.org/debian stable main contrib non-free
deb http://deb.debian.org/debian-security stable-security main contrib non-free
```

**Add a repository (e.g. Docker):**

```bash
# Add GPG key and repo list entry (example: Docker)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install docker-ce
```

**Pin or hold packages** — Prevent a package from being upgraded (e.g. hold kernel):

```bash
sudo apt hold package-name
sudo apt unhold package-name
# Or in /etc/apt/preferences (pin by priority)
```

---

## Snap vs apt (Ubuntu)

**snap** is a separate packaging format and runtime. Snap packages are confined and auto-update. On Ubuntu, both **apt** (deb) and **snap** are available.

| Use apt when | Use snap when |
|--------------|----------------|
| You need the same versions as the rest of the system (e.g. LTS stack). | You want the latest app version or a specific channel. |
| You manage servers and need predictable, repo-controlled updates. | You want automatic updates and isolation. |
| You prefer traditional FHS and init scripts. | You’re OK with snap’s layout and daemon. |

**Snap commands:**

```bash
snap list
snap install package
snap remove package
snap refresh
snap info package
snap set core proxy.http="http://proxy:3128"
```

Snap store and daemon can be disabled or removed if you want a pure deb/apt system; many server deployments use only apt.

---

## AppArmor (Mandatory Access Control)

**AppArmor** is the default MAC on Ubuntu and Debian. Profiles restrict what a process can do (files, capabilities, network). Profiles are in `/etc/apparmor.d/`.

**Status and mode:**

```bash
sudo aa-status                    # Loaded profiles and complain/enforce mode
sudo aa-complain /etc/apparmor.d/usr.sbin.nginx   # Put profile in complain (log only)
sudo aa-enforce /etc/apparmor.d/usr.sbin.nginx   # Enforce
```

**Reload after editing a profile:**

```bash
sudo systemctl reload apparmor
# Or: sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
```

**When something is denied:** Check `dmesg` or `journalctl` for `APPARMOR` messages. Adjust the profile in `/etc/apparmor.d/` (or add a local override in `/etc/apparmor.d/local/`) and reload.

---

## Systemd and logging

**systemd** is used for services and targets (same as RHEL family). Unit files: `/usr/lib/systemd/system/`, overrides in `/etc/systemd/system/`.

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
sudo systemctl edit nginx
sudo systemctl daemon-reload
```

**Logging:** **journalctl** is the primary interface. Rsyslog may write to `/var/log/syslog`, `/var/log/auth.log`, etc.

```bash
journalctl -b -u nginx
journalctl -f
journalctl -p err --since today
```

---

## Summary

- **Debian family** = Debian + Ubuntu + derivatives; **apt** (high-level) and **dpkg** (low-level); **deb** packages.
- **Repos:** `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`; format `deb URL suite components`.
- **Workflow:** `apt update` then `apt upgrade` or `apt full-upgrade`; use `apt policy` and `apt show` to inspect.
- **Ubuntu:** **snap** available alongside apt; use apt for server/predictability unless you need snap-specific features.
- **AppArmor:** MAC; `aa-status`, `aa-complain`, `aa-enforce`; profiles in `/etc/apparmor.d/`.
- **Services and logs:** systemd, journalctl (and rsyslog).

---

## Further reading

- [apt-get and apt-cache commands](https://www.tecmint.com/useful-basic-commands-of-apt-get-and-apt-cache-for-package-management/) — update, upgrade, install, remove, purge, clean, source, build-dep, changelog, check.
- [dpkg command examples](https://www.tecmint.com/dpkg-command-examples/) — install, list, remove, purge, contents, status, unpack, configure.
- [Package management (Yum, RPM, Apt, Dpkg, Zypper)](https://www.tecmint.com/linux-package-management/) — low-level vs high-level tools by distro.
- [Debian handbook](https://debian-handbook.info/)
- [Ubuntu documentation](https://ubuntu.com/server/docs)
- [apt man page](https://manpages.debian.org/apt)
