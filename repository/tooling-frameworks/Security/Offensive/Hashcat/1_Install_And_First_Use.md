# Hashcat — install and first use

[← Hashcat](./README.md)

GPU/CPU password recovery / hash cracking. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
# Linux/macOS: https://hashcat.net/hashcat/ releases or brew install hashcat
hashcat --version
```

## First lab use

```bash
# crack a lab-generated hash file you created
hashcat -m 0 lab_hashes.txt rockyou.txt
```
Only hashes you are authorized to recover.

## For / not for

| For | Not for |
|-----|---------|
| Lab password audits | Cracking stolen third-party dumps |
