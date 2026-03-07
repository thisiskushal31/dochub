# Transport Layer (L4) Deep Dive

Deep coverage of UDP, TCP, and transport-level behavior. Each topic has a dedicated file; content is filled for depth (definitions, how it works, examples, failure modes).

## Topics

### [1. Transport layer overview](./1_Overview.md)

Transport layer in OSI model, transport layer protocols (TCP, UDP, others).

### [2. UDP](./2_UDP.md)

What is UDP?, user datagram structure, UDP pros and cons. See [Labs/](../Labs/README.md) for UDP server examples and capture walkthroughs.

### [3. TCP](./3_TCP.md)

What is TCP?, TCP segment, flow control, congestion control, slow start vs congestion avoidance, TCP connection states, TCP pros and cons. See [Labs/](../Labs/README.md) for TCP server examples and capture walkthroughs.

### [4. Sockets, kernel queues, and NAT](./4_Sockets_Kernel_Nat.md)

Sockets and kernel queues, listening server, how the kernel manages TCP connections, NAT, private IP addresses.

### [5. TCP performance & tuning](./5_TCP_Performance.md)

MSS vs MTU vs PMTUD, Nagle's algorithm, delayed acknowledgment, cost of connection establishment, TCP Fast Open, TCP head-of-line blocking.

### [6. Other transport protocols](./6_Other_Protocols.md)

TCP vs UDP comparison, QUIC, RUDP, DCCP, SCTP.

## Learning path

1. [Overview](./1_Overview.md) → [UDP](./2_UDP.md) → [TCP](./3_TCP.md) → [Sockets & NAT](./4_Sockets_Kernel_Nat.md) → [TCP performance](./5_TCP_Performance.md) → [Other protocols](./6_Other_Protocols.md)
2. For foundations (IP, ICMP, ARP, MTU) see [Foundations/](../Foundations/README.md).
3. For L4 vs L7 load balancing and proxies see [Services/](../Services/README.md).
4. For replacing TCP in datacenters, port exhaustion, real-world TCP failures see [Advanced/](../Advanced/README.md).

**Note on DHCP:** DHCP is **not** a transport-layer protocol. It is an **application-layer** protocol (like DNS or HTTP) that **runs over UDP** (ports 67/68). The transport layer provides UDP; DHCP is one of the applications that use it. See [Services/8_DHCP](../Services/8_DHCP.md).

## Cross-references

- **Foundations:** IP, ICMP, ARP, MTU, TCP/IP model — [Foundations/](../Foundations/README.md)
- **Services:** L4 vs L7 load balancing, proxies, listening server — [Services/](../Services/README.md)
- **Observability:** Capturing TCP/UDP with tcpdump and Wireshark — [Observability/](../Observability/README.md), [Labs/](../Labs/README.md)
- **Advanced:** Replacing TCP in datacenters, port exhaustion, TCP failure case studies — [Advanced/](../Advanced/README.md)
