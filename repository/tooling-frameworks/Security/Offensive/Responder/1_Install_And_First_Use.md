# Responder — install and first use

[← Responder](./README.md)

LLMNR/NBT-NS/mDNS poisoner for lab credential capture demos. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
# Kali: responder; else clone https://github.com/lgandx/Responder
sudo python3 Responder.py -h
```

## First lab use

Run only on an isolated lab LAN you own:
```bash
sudo python3 Responder.py -I eth0
```
Trigger name resolution from a lab Windows client; capture hashes for **lab** cracking practice. Defend with disabling LLMNR/NBT-NS.

## For / not for

| For | Not for |
|-----|---------|
| Lab poisoning demos | Poisoning office/café networks |
