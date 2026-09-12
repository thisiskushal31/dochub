# VirtualBox and OpenWRT lab

[← home-lab](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- VirtualBox network modes: NAT, host-only, internal — when to use each
- OpenWRT VM as lab router: DHCP, DNS forwarder, firewall zones
- Client + server VMs on internal network
- Optional: second NIC for “WAN” simulation
- Commands: `ip addr`, `iptables`/`nft`, OpenWRT LuCI vs CLI
- Troubleshooting: no default route, wrong DNS, asymmetric routing

## Cross-references

- [Labs/4_Labs_Vms.md](../Labs/4_Labs_Vms.md)
- [Services/8_DHCP.md](../Services/8_DHCP.md)

## Checklist before marking done

- [ ] Step-by-step VM creation list (names, RAM, NIC attachment)
- [ ] Screenshot or Assets/ path for topology
- [ ] Verify: client gets DHCP, resolves DNS, reaches “internet” via NAT
