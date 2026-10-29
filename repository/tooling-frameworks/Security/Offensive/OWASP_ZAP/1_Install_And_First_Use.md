# OWASP ZAP — install and first use

[← OWASP ZAP](./README.md)

Open-source web app scanner / proxy (DAST). **Lab or approved staging only.** Pipeline packaging: [Handbook ZAP](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security/ZAP).

## Install

- Download from [zaproxy.org](https://www.zaproxy.org/download/)  
- Or container image for CI (see Handbook)

GUI: `zap.sh` / Windows launcher. Check version in Help → About.

## First lab use

1. Point lab browser at ZAP proxy (or use ZAP’s browser).  
2. Manual explore the lab app (spider lightly).  
3. Run a **baseline** automated scan against the lab URL only.

```bash
# example CLI baseline against lab
zap-baseline.py -t https://LAB_WEB_APP
```

## For / not for

| For | Not for |
|-----|---------|
| Finding common web issues in lab/CI | Unscoped internet scanning |
| Complementing SAST | Replacing authZ design review |
