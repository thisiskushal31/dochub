# Amass — install and first use

[← Amass](./README.md)

Attack-surface / subdomain enumeration (OWASP Amass). **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
go install -v github.com/owasp-amass/amass/v4/...@master
# or: brew install amass
amass -version
```

## First lab use

```bash
amass enum -d lab-example.test -o amass-out.txt
```
Use only domains in your lab/RoE.

## For / not for

| For | Not for |
|-----|---------|
| Subdomain enum in scope | Enumerating third-party brands without authorization |
