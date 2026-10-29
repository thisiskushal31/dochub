# Nmap — 1 Install

[← Nmap](./README.md)

Network mapper for host and port discovery. **Isolated lab only — never scan the public internet.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install nmap` |
| Debian/Ubuntu | `sudo apt install nmap` |
| Windows | Installer from [nmap.org](https://nmap.org/download.html) |

Check: `nmap --version`

## What a port is (one paragraph)

A **port** is a numbered endpoint on a host (0–65535) where a service may listen (e.g. 22 SSH, 443 HTTPS). Nmap asks which ports answer, and optionally what service/version they claim to be.

## First lab command

Against a lab IP you own (example `192.168.56.10`):

```bash
nmap -sV 192.168.56.10
```

`-sV` probes open ports for service/version hints. Read open / closed / filtered in [3](./3_Read_The_Output.md).

## Related home

- Scan types on the wire → Networks-Deep-Dive Security  
- Phase context → [Security-Deep-Dive Offensive/4](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Offensive/4_Scanning_And_Enumeration.md)

## Next

- [2 First scan](./2_First_Scan.md)
