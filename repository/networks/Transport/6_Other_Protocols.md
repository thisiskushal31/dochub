# Other Transport Protocols

[← Back to Transport](./README.md)

TCP vs UDP comparison and alternatives: QUIC, RUDP, DCCP, SCTP. When to choose which and what each offers.

## Table of Contents

- [TCP vs UDP](#tcp-vs-udp)
- [QUIC](#quic)
- [RUDP](#rudp)
- [DCCP](#dccp)
- [SCTP](#sctp)
- [References](#references)

---

## TCP vs UDP

| Aspect | TCP | UDP |
|--------|-----|-----|
| **Connection** | Connection-oriented (handshake) | Connectionless |
| **Reliability** | Reliable (ACK, retransmit) | Best-effort, no guarantee |
| **Ordering** | In-order delivery | No ordering |
| **Overhead** | 20–60 byte header, state, retransmission | 8-byte header, minimal state |
| **Flow control** | Yes (receive window) | No |
| **Congestion control** | Yes | No |
| **Use cases** | HTTP, SSH, email, file transfer | DNS, VoIP, streaming, games |

**When to use TCP:** When data must arrive **complete** and **in order** (web, file transfer, RPC with reliability requirements). When you want **flow and congestion control** without implementing them yourself.

**When to use UDP:** When **latency** or **simplicity** matters more than reliability (real-time, gaming, DNS, DHCP). When you need **broadcast or multicast**, or when you implement **custom reliability** (e.g. QUIC, RUDP) on top of UDP.

See [UDP](./2_UDP.md) and [TCP](./3_TCP.md) for full detail.

---

## QUIC

**QUIC (Quick UDP Internet Connections)** is a transport protocol that runs **over UDP**. It was designed to reduce connection setup latency, improve resilience to packet loss, and avoid TCP’s head-of-line blocking. **HTTP/3** uses QUIC as its transport.

- **Encryption** — QUIC integrates **TLS 1.3**; the handshake is combined with connection establishment, often in **1 RTT** (or 0-RTT for repeat connections).
- **Multiplexing** — Multiple **streams** over one connection. Loss on one stream does **not** block others (no head-of-line blocking at the stream level).
- **Connection migration** — Connection ID allows the connection to survive **IP or port changes** (e.g. mobile switching networks).
- **Built on UDP** — Deployed without kernel or middlebox changes to TCP; only UDP and the application need to support QUIC.

**Use cases:** HTTP/3, and any application that wants low-latency, multiplexed, encrypted transport. See [Advanced/](../Advanced/README.md) for “replacing TCP” and [Services/](../Services/README.md) for HTTP.

---

## RUDP

**RUDP (Reliable User Datagram Protocol)** is a **reliable** protocol built **on top of UDP**. It is not a single standard but a family of designs that add **acknowledgments**, **retransmission**, and sometimes **ordering** and **congestion control** to UDP. Used in some games, media, and proprietary systems where you want reliability without full TCP behaviour (e.g. selective reliability, custom congestion control).

- **Typical features:** ACKs, sequence numbers, retransmission of lost packets, optional ordering.
- **vs TCP:** Can be tuned per application (e.g. only acknowledge critical messages); often used in real-time or gaming where partial reliability or custom logic is needed.

---

## DCCP

**DCCP (Datagram Congestion Control Protocol)** (RFC 4340) provides **congestion-controlled**, **unreliable** datagram delivery. It is **not** widely deployed.

- **Goal:** For applications that want **congestion control** (to be fair to the network) but **not** reliability (e.g. streaming, VoIP). TCP gives both; UDP gives neither. DCCP fills the middle.
- **Features:** Congestion control (e.g. TCP-like or TFRC), optional ECN, no retransmission or ordering guarantee.
- **Usage:** Rare; QUIC and application-level schemes are more common today.

---

## SCTP

**SCTP (Stream Control Transmission Protocol)** (RFC 4960) is a **connection-oriented**, **reliable** transport protocol with features beyond TCP: **multiple streams**, **multihoming**, and **message boundaries**.

- **Message-oriented** — Preserves **message boundaries** (like UDP) while providing reliability (like TCP). Applications receive distinct messages, not a byte stream.
- **Multiple streams** — One association (connection) can have several **streams**; loss in one stream does not block others (similar idea to QUIC streams).
- **Multihoming** — An endpoint can have **multiple IP addresses**; SCTP can use alternate paths if one fails, without relying only on the IP layer.
- **Security** — Association setup uses a **cookie** mechanism (e.g. INIT-ACK), reducing SYN-flood and half-open abuse.
- **Full-duplex** — Both sides can send and receive simultaneously; supports **half-closed** associations.

**Use cases:** Signalling (e.g. SIP, SCTP), telephony (SS7 over IP), and applications that need reliability plus message framing or multihoming. **Drawbacks:** Requires kernel and application support; less ubiquitous than TCP/UDP. See [Transport overview](./1_Overview.md) for protocol list.

---

## References

- [GeeksforGeeks – SCTP](https://www.geeksforgeeks.org/computer-networks/sctp-full-form/)
- [GeeksforGeeks – Transport Layer Protocols](https://www.geeksforgeeks.org/computer-networks/transport-layer-protocols/)
- RFC 4960 – Stream Control Transmission Protocol (SCTP)
- RFC 4340 – Datagram Congestion Control Protocol (DCCP)
- IETF QUIC (RFC 9000 and related); [Advanced – Replacing TCP](../Advanced/README.md)
