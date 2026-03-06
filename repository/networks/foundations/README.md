# Foundations (L1–L3)

Layer 1–3 and IP-layer basics. Each topic has a dedicated file; content is filled for depth (definitions, how it works, examples). Use cross-references for transport, observability, and labs.

## Topics

### [1. Basics & architecture](./1_Basics_And_Architecture.md)

Overview of computer networking, network types, Internet introduction, building a simple network, home networks, network devices, client–server architecture, host-to-host communication.

### [2. Models: OSI & TCP/IP](./2_Models.md)

OSI model (seven layers, encapsulation), TCP/IP model (four layers), OSI and TCP/IP compared.

### [3. Physical layer](./3_Physical_Layer.md)

Physical layer in OSI, network topology, transmission modes, transmission media (guided/unguided), cabling standards (copper and fibre), Power over Ethernet (PoE).

### [4. Data link layer](./4_Data_Link_Layer.md)

Data link layer in OSI, switching, VLAN, framing, error detection/correction, flow control, sliding window (Stop-and-wait, Go-Back-N, Selective Repeat), piggybacking, link aggregation (LACP), Layer 2 discovery (CDP, LLDP), PPP and PPPoE.

### [5. Network layer](./5_Network_Layer.md)

Network layer in OSI, IP address, classful/classless (CIDR), IP building blocks, IPv4 header, IPv4 vs IPv6, public/private IPs, subnetting, VLSM/supernetting, ICMP/PING/TraceRoute, ARP/ND, routing example, network layer protocols.

## Learning path

1. [Basics & architecture](./1_Basics_And_Architecture.md) → [Models](./2_Models.md) → [Physical layer](./3_Physical_Layer.md) → [Data link layer](./4_Data_Link_Layer.md) → [Network layer](./5_Network_Layer.md)
2. For transport (UDP/TCP, NAT, sockets) see [transport/](../transport/README.md).
3. For capturing IP/ARP/ICMP see [observability/](../observability/README.md) and [labs/](../labs/README.md).

## Cross-references

- **Transport:** UDP/TCP, NAT, sockets — [transport/](../transport/README.md)
- **Observability:** Capturing IP/ARP/ICMP with tcpdump — [observability/](../observability/README.md), [labs/](../labs/README.md)
- **Routing protocols:** RIP, OSPF, BGP, etc. — [routing-switching/](../routing-switching/README.md)
