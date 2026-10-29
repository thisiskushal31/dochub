# Volatility — install and first use

[← Volatility](./README.md)

Memory forensics framework (Volatility 3). **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
pipx install volatility3
vol -h
```

## First lab use

```bash
vol -f lab_memory.raw windows.info
vol -f lab_memory.raw windows.pslist
```
Use memory images from **your** lab VMs or licensed sample images.

## For / not for

| For | Not for |
|-----|---------|
| IR/forensics lab practice | Imaging others’ machines without authority |
