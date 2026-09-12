# Topology and addressing for a home lab

[← home-lab](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Lab goals: learn routing/DNS/TCP without touching production
- Physical vs virtual topology (single laptop vs dedicated lab NIC)
- IP plan: management subnet, client subnet, “internet” NAT segment
- Isolation: host-only / internal networks; no bridge to home LAN without intent
- DNS and default gateway placement (OpenWRT or Linux router VM)
- Validation: ping, traceroute, `ip route`, `dig`

## Cross-references

- [Foundations/5_Network_Layer.md](../Foundations/5_Network_Layer.md)
- [Routing-Switching/5 — home lab scale](../Routing-Switching/5_Switching_Resiliency_Design.md#network-scale-spectrum-home-lab-to-data-center)

## Checklist before marking done

- [ ] ASCII diagram of recommended 3-VM layout
- [ ] Copy-paste IP plan table
- [ ] Safety checklist (isolation, no scanning outside lab)
