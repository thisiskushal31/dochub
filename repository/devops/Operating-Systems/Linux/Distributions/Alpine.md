# Alpine Linux

[← Back to Distributions](./README.md) · [↑ Linux](../README.md)

**Alpine Linux** is a minimal, security-focused distribution built around **musl libc** and **BusyBox**. It is widely used in **containers** (Docker base images) and embedded or resource-constrained environments. Package manager: **apk**. This section goes **in depth**: apk, repository and pinning, OpenRC, containers, and networking so you can run and administer Alpine confidently.

---

## Why Alpine matters

- **Small footprint** — Minimal base image (often under 5 MB); fast to pull and run in containers.
- **musl + BusyBox** — Different C library and userland than glibc-based distros; some binaries from other distros may not run without compatibility layers.
- **Security** — Optional hardening (e.g. PaX); minimal attack surface; no unnecessary daemons.
- **Release model** — Two releases per year (e.g. 3.18, 3.19); each supported ~2 years. **Edge** is the rolling branch (development).

---

## Package management: apk

**apk** is the only package manager. It uses a single index and installs from **repositories** listed in **/etc/apk/repositories**.

```bash
# Update index (fetch latest package list from repos)
apk update
# Upgrade all installed packages
apk upgrade

# Install / remove
apk add package-name
apk add package1 package2
apk add --no-cache package-name   # Don't keep index/cache in /var/cache/apk (standard in Docker)
apk del package-name
apk del --purge package-name      # Remove and purge config

# Query
apk info
apk info -a package-name          # All info (deps, description)
apk search keyword
apk list --installed
```

**Repository configuration** — **/etc/apk/repositories** lists URLs, one per line. You can point to a release (e.g. `v3.18`) or **edge**.

Example (release 3.18, main + community):

```
https://dl-cdn.alpinelinux.org/alpine/v3.18/main
https://dl-cdn.alpinelinux.org/alpine/v3.18/community
```

Edge (rolling):

```
https://dl-cdn.alpinelinux.org/alpine/edge/main
https://dl-cdn.alpinelinux.org/alpine/edge/community
```

**Pinning** — To prefer a specific repo or avoid upgrading a package:

```bash
# Pin a package to a version (install and hold)
apk add package@3.18.0
# Or in /etc/apk/repositories use @edge or @community in the URL for that repo
```

**Cache** — By default apk keeps downloaded packages in `/var/cache/apk/`. In containers you usually want `apk add --no-cache` and then `rm -rf /var/cache/apk/*` (or use `--no-cache` so they aren’t cached) to keep the image small.

---

## OpenRC (init and services)

Alpine uses **OpenRC**, not systemd. Services are **scripts** in **/etc/init.d/** and are enabled by adding them to runlevels (e.g. **default**).

```bash
# Start / stop / restart a service
rc-service nginx start
rc-service nginx stop
rc-service nginx restart

# Enable service at boot (add to default runlevel)
rc-update add nginx default
rc-update del nginx default
rc-update show

# List services and status
rc-status
```

**Runlevels:** `boot`, `default`, `shutdown`. Most daemons go in `default`. Config for a service is often in `/etc/conf.d/servicename`.

---

## Containers (Docker and others)

The official **alpine** image on Docker Hub is the standard minimal base. In a Dockerfile:

```dockerfile
FROM alpine:3.18
RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Best practices:**

- Use `apk add --no-cache` so the image doesn’t keep the apk cache.
- Pin the version: `alpine:3.18` not `alpine:latest` for reproducible builds.
- For multi-stage builds, copy only what you need from the Alpine stage (e.g. a binary) into a smaller final image.

**Kubernetes / containerd:** Same idea — use the alpine image and apk when you need to install packages in the image.

---

## Networking

Minimal installs often use **udhcpc** for DHCP and **ip** / **iptables** for the rest. No NetworkManager by default.

```bash
# Bring interface up with DHCP
udhcpc -i eth0
# Or configure manually with ip
ip addr add 192.168.1.10/24 dev eth0
ip link set eth0 up
```

**Persistent config** — Edit **/etc/network/interfaces** (or use **networking** OpenRC service). For wireless or complex setups you can install **wpa_supplicant** and related packages.

---

## Summary

- **Alpine** = minimal, musl/BusyBox-based; **apk** for packages; **OpenRC** for init and services.
- **Repos:** `/etc/apk/repositories`; use `v3.18` (release) or `edge` (rolling); **apk update**, **apk upgrade**.
- **Containers:** Use `alpine` image and `apk add --no-cache`; pin version for reproducibility.
- **Services:** `rc-service`, `rc-update`, `rc-status`; no systemd.
- **Networking:** udhcpc, ip, iptables; config in `/etc/network/interfaces`.

---

## Further reading

- [Alpine Linux wiki](https://wiki.alpinelinux.org/) — Installation, packaging, and administration.
- [Alpine Linux documentation](https://docs.alpinelinux.org/) — Official docs.
- [Alpine packages](https://pkgs.alpinelinux.org/packages) — Package search.
