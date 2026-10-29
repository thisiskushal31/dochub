# ffuf — install and first use

[← ffuf](./README.md)

Fast web fuzzer for directories, vhosts, parameters. **Lab only.**

## Install

```bash
go install github.com/ffuf/ffuf/v2@latest
# or: brew install ffuf
ffuf -V
```

## First lab use

Wordlist + URL with `FUZZ` keyword:

```bash
ffuf -u https://LAB/FUZZ -w /path/to/wordlist.txt -mc 200,301,302,403
```

Tune match codes so noise drops. Respect lab rate limits (`-rate`).

## For / not for

| For | Not for |
|-----|---------|
| Finding hidden paths on lab apps | Hammering third-party sites |
| Parameter discovery in scope | Credential stuffing without RoE |

## Related

- Gobuster (similar job) → sibling folder  
- Burp/ZAP for interactive proxy work
