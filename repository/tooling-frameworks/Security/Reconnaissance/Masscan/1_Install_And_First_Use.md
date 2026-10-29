# Masscan — install and first use

[← Masscan](./README.md)

Very fast port scanner. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
# Linux common: build from https://github.com/robertdavidgraham/masscan
# or distro package if available
masscan --version
```

## First lab use

```bash
# LAB subnet you own only — rate-limit!
sudo masscan LAB_CIDR -p80,443 --rate 1000
```
Prefer Nmap for version detection after Masscan finds open ports.

## For / not for

| For | Not for |
|-----|---------|
| Wide lab port discovery | Internet-wide scanning; high-rate DoS of fragile hosts |
