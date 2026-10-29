# SearchSploit — install and first use

[← SearchSploit](./README.md)

CLI search of Exploit-DB archive. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
# Kali includes it; else: git clone https://gitlab.com/exploit-database/exploitdb
# symlink searchsploit into PATH
searchsploit -h
```

## First lab use

```bash
searchsploit apache 2.4
searchsploit -m PATH/TO/EDB-ID   # copy into lab workspace
```
Run PoCs only inside your lab VMs.

## For / not for

| For | Not for |
|-----|---------|
| Finding public PoCs for lab CVEs | Blind-fire exploits at live third parties |
