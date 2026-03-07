# Observability

Packet capture, flow visibility, QoS, security monitoring, and network operations. Each topic has a dedicated file for full-depth content.

## Topics

### [1. Signals & performance](./1_Signals_Performance.md)

Metrics, logs, traces; latency/jitter/loss, SLIs, synthetic checks.

### [2. Packet capture (tcpdump)](./2_Packet_Capture.md)

tcpdump basics, filters; SPAN, RSPAN, ERSPAN (getting traffic to your capture host); capturing IP/ARP/ICMP, UDP, TCP. See [Labs/](../Labs/README.md) for walkthroughs.

### [3. Wireshark](./3_Wireshark.md)

Wireshark: UDP, TCP/HTTP, HTTP/2 (decrypting TLS), MongoDB, Server-Sent Events.

### [4. QoS & congestion control](./4_Qos_Congestion.md)

Quality of Service, token/leaky bucket, techniques, congestion control (see [Transport/](../Transport/README.md) for TCP).

### [5. Security monitoring & threat hunting](./5_Security_Monitoring.md)

Threat hunting, enterprise security monitoring, Zeek, Suricata, SIEM/ELK.

### [6. Network operations](./6_Network_Operations.md)

Troubleshooting methodology (identify, theory, test, plan, verify, document); network monitoring (LibreNMS, Observium, pmacct); IP SLA (active performance measurement); change management (Batfish, Oxidized); automation (NAPALM, Ansible, netmiko); model-driven programmability (NETCONF, RESTCONF, YANG, gNMI); inventory/IPAM (NetBox, phpIPAM); flow visibility (NetFlow, sFlow, IPFIX, flow records); AI/ML in network operations; incident workflows.

## Learning path

1. [Signals & performance](./1_Signals_Performance.md) → [Packet capture](./2_Packet_Capture.md) → [Wireshark](./3_Wireshark.md) → [QoS](./4_Qos_Congestion.md) → [Security monitoring](./5_Security_Monitoring.md) → [Network operations](./6_Network_Operations.md)
2. For kernel/TCP visibility see [Transport/](../Transport/README.md). For step-by-step captures see [Labs/](../Labs/README.md).

## Cross-references

- **Transport:** TCP/UDP behavior to interpret in captures — [Transport/](../Transport/README.md)
- **Labs:** Step-by-step tcpdump and Wireshark walkthroughs — [Labs/](../Labs/README.md)
