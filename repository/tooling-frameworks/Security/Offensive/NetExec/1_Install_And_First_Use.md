# NetExec — install and first use

[← NetExec](./README.md)

Lab enumeration and authenticated checks against **systems you own**. Formerly CrackMapExec-class tooling.

## Install

Follow current docs: [Pennyw0rth/NetExec](https://github.com/Pennyw0rth/NetExec) (pipx / release binaries change — prefer the repo README).

```bash
# example pattern — confirm on the official README before running
pipx install git+https://github.com/Pennyw0rth/NetExec
nxc --help
```

## First lab use

```bash
nxc smb 192.168.56.0/24 -u '' -p ''   # lab only
```

Only against authorized lab ranges.

## Related

- [Impacket](../Impacket/README.md) · [BloodHound](../BloodHound/README.md) · [Evil-WinRM](../Evil-WinRM/README.md)
