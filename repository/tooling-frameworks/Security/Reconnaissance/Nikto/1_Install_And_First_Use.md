# Nikto — install and first use

[← Nikto](./README.md)

Noisy web server vulnerability scanner. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
# Kali/apt: sudo apt install nikto
nikto -Version
```

## First lab use

```bash
nikto -h https://LAB_WEB_APP
```
Expect volume; lab or approved windows only.

## For / not for

| For | Not for |
|-----|---------|
| Quick lab web misconfig hints | Unscoped production scans |
