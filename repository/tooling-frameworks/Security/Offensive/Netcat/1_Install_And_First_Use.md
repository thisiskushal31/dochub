# Netcat — install and first use

[← Netcat](./README.md)

TCP/UDP Swiss army knife for lab connectivity checks and simple listeners. **Lab only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install netcat` or use `nc` (BSD) |
| Linux | `sudo apt install netcat-openbsd` (or nmap-ncat) |

`nc -h` / `man nc` — flags differ between implementations; read your local man page.

## First lab use

Listen on lab VM:

```bash
nc -l 4444
```

From another lab host:

```bash
nc LAB_IP 4444
```

Type text; confirm bidirectional. This teaches ports/sockets — not a backdoor tutorial for live systems.

## For / not for

| For | Not for |
|-----|---------|
| Connectivity / banner grabs in lab | Persistence on systems you do not own |
| Debugging simple TCP services | Replacing proper C2 study in authorized labs with care |
