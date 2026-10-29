# Hydra — install and first use

[← Hydra](./README.md)

Online login brute-force tool. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
brew install hydra   # or apt install hydra
hydra -h
```

## First lab use

```bash
# lab SSH with tiny wordlist you created
hydra -l labuser -P tiny.txt ssh://LAB_IP
```
Rate-limit; fragile services break easily.

## For / not for

| For | Not for |
|-----|---------|
| Auth strength demos in lab | Credential stuffing real user accounts |
