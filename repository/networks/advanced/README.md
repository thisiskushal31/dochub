# Advanced & Edge Topics

Topics that build on foundations, transport, and services. Each topic has a dedicated file for full-depth content.

## Topics

### [1. Replacing TCP for datacenters](./1_Replacing_Tcp_Datacenters.md)

Why TCP can be suboptimal in DC (Part 1); QUIC and alternatives (Part 2); deployment and migration (Part 3).

### [2. Resource limits & failure modes](./2_Resource_Limits_Failure_Modes.md)

Running out of TCP source ports; Postgres failure caused by a Cisco router (TCP case study).

### [3. TLS extensions & performance](./3_Tls_Extensions.md)

TLS 0-RTT (early data, replay risks, when to use).

### [4. On-premises & enterprise networking](./4_On_Premises_Enterprise.md)

Building a network with enterprise devices; Cisco switches, IOS, routers; console connection; troubleshooting; Packet Tracer and simulation.

### [5. Wireless & special networks](./5_Wireless_Special_Networks.md)

Wi-Fi standards, Bluetooth, generations of wireless (1G–5G), 6G (emerging), WLAN, Zigbee.

## Learning path

1. After [foundations/](../foundations/README.md), [transport/](../transport/README.md), and [services/](../services/README.md): [Replacing TCP](./1_Replacing_Tcp_Datacenters.md) → [Resource limits](./2_Resource_Limits_Failure_Modes.md) → [TLS 0-RTT](./3_Tls_Extensions.md) → [On-prem & enterprise](./4_On_Premises_Enterprise.md) → [Wireless](./5_Wireless_Special_Networks.md)

## Cross-references

- **Transport:** TCP behavior, congestion control, connection states — [transport/](../transport/README.md)
- **Security:** TLS/mTLS, SNI — [security/](../security/README.md)
- **Services:** Proxies, load balancing, connection pooling — [services/](../services/README.md)
