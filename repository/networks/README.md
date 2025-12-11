# Networks Deep Dive

Hands-on networking notes from physical and data-link layers through TCP/IP,
routing, security, and cloud-native networking. Focused on practical concepts,
packets, and troubleshooting checklists.

## Structure

- `foundations/` — OSI & TCP/IP, addressing, subnetting, VLANs, spanning tree.
- `routing-switching/` — static & dynamic routing (OSPF/BGP), ECMP, failover.
- `services/` — DNS, HTTP(S), load balancing, proxies, caching.
- `security/` — TLS, mTLS, firewalls/ACLs, Zero Trust patterns, IPsec/WireGuard.
- `cloud-native/` — VPC/VNet, peering, VPN/Direct Connect/Interconnect, service mesh, CNI.
- `observability/` — packet capture, flow logs, metrics, tracing; SLOs for networking.

## How to use

1. Start with `foundations/` for layer 1–3 basics.
2. Use `routing-switching/` for control-plane details and failure handling.
3. See `services/` and `security/` for delivery and protection layers.
4. For cloud workloads, jump to `cloud-native/` and pair with `observability/`.
5. Keep checklists handy for changes, migrations, and incident response.

## Contributing

- Prefer concise diagrams and packet walks; add copy/paste commands where useful.
- Call out trade-offs (latency vs. reliability, east-west vs. north-south).
- Include failure modes and validation steps for each pattern.
