# Impacket — install and first use

[← Impacket](./README.md)

Python collection for Windows/AD network protocols. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
pipx install impacket
# or: pip install impacket
impacket-smbclient -h
```

## First lab use

Use against **lab AD / Windows VMs** only, e.g. list shares with lab creds:
```bash
impacket-smbclient 'LABDOM/user:pass@LAB_DC'
```

## For / not for

| For | Not for |
|-----|---------|
| AD/Windows protocol labs | Unauthorized access to real domains |
