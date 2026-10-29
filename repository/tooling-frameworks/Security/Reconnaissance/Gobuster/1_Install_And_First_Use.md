# Gobuster — install and first use

[← Gobuster](./README.md)

Directory/DNS/vhost brute forcing. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
go install github.com/OJ/gobuster/v3@latest
# or: brew install gobuster
gobuster version
```

## First lab use

```bash
gobuster dir -u https://LAB -w /path/to/wordlist.txt
```

## For / not for

| For | Not for |
|-----|---------|
| Path discovery on lab web apps | Brute-forcing sites outside scope |
