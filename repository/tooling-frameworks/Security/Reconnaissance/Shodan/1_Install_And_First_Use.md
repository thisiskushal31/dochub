# Shodan — install and first use

[← Shodan](./README.md)

Internet device search engine (API/CLI). **Lab / authorized targets only — never against systems you do not own.**

## Install

Create account at shodan.io; install CLI:
```bash
pipx install shodan
shodan init YOUR_API_KEY
```

## First lab use

```bash
shodan host LAB_PUBLIC_IP   # only IPs you own / RoE allows
shodan search 'org:"Your Lab Org"'
```
Do not use Shodan results as permission to attack.

## For / not for

| For | Not for |
|-----|---------|
| Internet exposure awareness | Picking random hosts to exploit |
