# Arch family (Arch Linux, Manjaro, EndeavourOS)

[← Back to Distributions](./README.md) · [↑ Linux](../README.md)

This covers **Arch-based** distributions: **Arch Linux**, **Manjaro**, **EndeavourOS**. They use **pacman** as the package manager and follow a **rolling release** model: there are no fixed “versions”; you get continuous updates. This section goes **in depth**: pacman, repository configuration, AUR, init, and maintenance so you can run and administer these distros confidently.

---

## Rolling release and philosophy

- **Rolling release** — No major “upgrade” step; you regularly run `pacman -Syu` and get the latest packages. Breakage, when it happens, is usually due to config or manual changes, not a big dist-upgrade.
- **Arch** — Minimal base; you add what you need. Config is done by editing files; the Arch Wiki is the primary reference.
- **Manjaro / EndeavourOS** — Preconfigured installers and desktops; Manjaro may hold packages briefly for testing. Same pacman and AUR underneath.

---

## Package management: pacman

**pacman** is the single tool for official repositories. Options are short (`-S` sync/install, `-R` remove, `-Q` query local, `-S` + `-i` query remote).

```bash
# Sync package database (fetch latest repo indexes)
sudo pacman -Sy
# Full system update (sync + upgrade all; do this regularly)
sudo pacman -Syu

# Install / remove
sudo pacman -S package-name
sudo pacman -S package1 package2
sudo pacman -R package-name           # Remove (keep deps)
sudo pacman -Rns package-name         # Remove and unneeded deps; no backup of config

# Query local database (what is installed)
pacman -Q
pacman -Qs keyword                    # Search installed by name/desc
pacman -Ql package-name               # List files owned by package
pacman -Qi package-name               # Info (version, deps, reason)

# Query remote (repos)
pacman -Ss keyword                    # Search
pacman -Si package-name               # Info
pacman -Qm                            # List packages not from repos (e.g. AUR)
```

**Repository configuration** — Repos are in **/etc/pacman.conf**. Example:

```ini
[core]
Include = /etc/pacman.d/mirrorlist

[extra]
Include = /etc/pacman.d/mirrorlist
```

Mirrors are listed in **/etc/pacman.d/mirrorlist** (one URL per line). After editing, run `pacman -Syu`.

---

## Arch User Repository (AUR)

The **AUR** holds **PKGBUILD** scripts (and sometimes patches) that build packages not in the official repos. You don’t install “from” the AUR directly; you use a **helper** (e.g. **yay**, **paru**) that downloads the PKGBUILD, runs `makepkg`, and installs the resulting package with pacman.

**Using an AUR helper (yay or paru):**

```bash
# Search and install
yay -Ss keyword
yay -S package-name
# Or: paru -S package-name

# Update system including AUR packages
yay -Syu
paru -Syu
```

**Manual AUR build** (no helper):

```bash
git clone https://aur.archlinux.org/package-name.git
cd package-name
makepkg -si    # -s install deps, -i install the built package
```

**Safety:** AUR packages are user-submitted. Check the PKGBUILD and comments before building; prefer official repos when possible.

---

## Systemd and services

Arch and most derivatives use **systemd**. Same commands as elsewhere:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

**Logs:** `journalctl -b -u nginx`, `journalctl -f`, etc.

---

## Maintenance and troubleshooting

- **After kernel update:** Reboot or at least reload drivers; if you use DKMS modules (e.g. nvidia), they rebuild on kernel update.
- **Pacman lock:** If another pacman is running, wait. If a previous run crashed, remove `/var/lib/pacman/db.lck` and run again.
- **Broken deps:** `pacman -Syu` may report conflicts. Read the message; sometimes you need to remove a conflicting package or install a replacement (e.g. provided by the community). Arch Wiki has “Fixing broken packages” and “Downgrading packages”.

---

## Summary

- **Arch family** = rolling release; **pacman** for official packages; **AUR** for community PKGBUILDs (use yay/paru or makepkg).
- **Config:** `/etc/pacman.conf`, `/etc/pacman.d/mirrorlist`; always run `pacman -Syu` regularly.
- **Manjaro/EndeavourOS** = Arch-based with easier install; same pacman and AUR.
- **Services and logs:** systemd, journalctl.

---

## Further reading

- [Arch Wiki](https://wiki.archlinux.org/)
- [pacman](https://wiki.archlinux.org/title/Pacman)
- [AUR](https://wiki.archlinux.org/title/Arch_User_Repository)
