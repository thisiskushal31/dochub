# Bettercap — install and first use

[← Bettercap](./README.md)

Network/MITM reconnaissance framework. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
# releases: https://github.com/bettercap/bettercap
bettercap -h
```

## First lab use

On isolated lab network only:
```bash
sudo bettercap -iface eth0
```
Explore `net.probe on` style discovery; do not ARP-spoof networks you do not own.

## For / not for

| For | Not for |
|-----|---------|
| Lab LAN recon / MITM demos | Attacking shared/public Wi-Fi users |
