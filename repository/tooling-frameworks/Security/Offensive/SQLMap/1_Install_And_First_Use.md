# SQLMap — install and first use

[← SQLMap](./README.md)

Automated SQL injection testing tool. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
pipx install sqlmap
# or: git clone https://github.com/sqlmapproject/sqlmap.git
sqlmap --version
```

## First lab use

```bash
# intentionally vulnerable lab parameter only
sqlmap -u "https://LAB/item?id=1" --batch --level=1 --risk=1
```

## For / not for

| For | Not for |
|-----|---------|
| Proving SQLi on lab apps | Attacking third-party databases |
