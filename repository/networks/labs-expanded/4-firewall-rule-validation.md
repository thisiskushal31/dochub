# Firewall rule validation lab

[← labs-expanded](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Lab matrix: allow/deny by port, source IP, state (NEW/ESTABLISHED)
- Linux: nftables or iptables minimal ruleset
- Optional: cloud SG equivalent (gcloud/aws one example each)
- Test with nc, curl, hping3 — **lab network only**
- Log and verify drops (dmesg, nft log, VPC flow logs concept)

## Cross-references

- [Security/5_Firewalls_Aaa.md](../Security/5_Firewalls_Aaa.md)

## Checklist before marking done

- [ ] Table: rule → test command → expected result
- [ ] Common mistake: forgetting return traffic / established state
