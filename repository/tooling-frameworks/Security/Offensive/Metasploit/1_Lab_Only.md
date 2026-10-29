# Metasploit — lab only

[← Metasploit](./README.md)

Exploitation framework. **Only against machines you own or have written permission to test.**

## Install

Prefer a dedicated Kali/lab VM. Framework installers: [docs.metasploit.com](https://docs.metasploit.com/).

```bash
msfconsole -v
```

## First lab use

1. Snapshot the lab victim VM.  
2. `msfconsole`  
3. Use a module aimed at an **intentionally vulnerable** lab service you already know is present.  
4. Document detection opportunities; revert snapshot.

## For / not for

| For | Not for |
|-----|---------|
| Controlled exploit demos in lab | Attacking the public internet |
| Purple-team detection tests | “Trying exploits” on random Shodan hits |
