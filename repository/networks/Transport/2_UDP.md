# UDP (User Datagram Protocol)

[← Back to Transport](./README.md)

Connectionless transport: structure, semantics, and when to use it. UDP provides **fast, lightweight, process-to-process** delivery with **no** reliability, ordering, or flow control.

## Table of Contents

- [What is UDP?](#what-is-udp)
- [User datagram structure](#user-datagram-structure)
- [UDP pros and cons](#udp-pros-and-cons)
- [References](#references)

---

## What is UDP?

**UDP (User Datagram Protocol)** is a **transport layer** protocol (OSI Layer 4) that provides **fast, connectionless, and lightweight** communication between processes. It does **not** guarantee delivery, order, or error recovery; it is suitable when **low latency** or **simplicity** matters more than reliability.

- **Connectionless** — No handshake or connection state. Each **datagram** is independent; the sender does not know if it was received.
- **Best-effort** — The network may drop, reorder, or duplicate datagrams; UDP does not retransmit or reorder.
- **Process-to-process** — **Port numbers** (16-bit) identify the source and destination application. Together with IP, the pair (IP address, port) is a **socket**.
- **Minimal overhead** — Fixed **8-byte** header. No sequence numbers, acknowledgments, or flow-control fields.

UDP is used where speed and small overhead are important and occasional loss is acceptable: **DNS**, **DHCP**, **NTP**, **VoIP**, **streaming**, **online games**, and custom real-time or control protocols.

**Top use cases for UDP (from [ByteByteGo – Top 4 Most Popular Use Cases for UDP](https://bytebytego.com/guides/top-4-most-popular-use-cases-for-udp/)):**

![Top 4 UDP use cases (ByteByteGo)](../Assets/Transport/bytebytego-top-4-udp-use-cases.png)

```text
  1. Streaming     →  Video/audio; occasional drops OK; low latency matters
  2. DNS           →  Short queries; quick response; retry on loss
  3. Multicast     →  One-to-many (e.g. media, discovery); UDP natively supports multicast
  4. IoT           →  Small, frequent sensor data; low power; loss tolerable
```

![UDP — connectionless datagram delivery](../Assets/Transport/udp-datagram.gif)

---

## User datagram structure

The **UDP header** is exactly **8 bytes**, followed by the payload. Port numbers are 16-bit (0–65535); port 0 is reserved.

| Field | Size | Description |
|-------|------|-------------|
| **Source Port** | 16 bits | Sender’s port number. May be 0 if the sender does not expect a reply. |
| **Destination Port** | 16 bits | Receiver’s port number. Identifies the application on the destination host. |
| **Length** | 16 bits | Total length of the **UDP header + data** in bytes. Minimum 8 (header only). |
| **Checksum** | 16 bits | Error detection over header, data, and a **pseudo header** (IP addresses, protocol number, UDP length). Optional in IPv4; **mandatory** in IPv6. |

**Layout:**

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length             |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Payload (data)                         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **No** sequence number, acknowledgment, or window — so no retransmission, ordering, or flow control.
- **Checksum** — If present, the receiver can detect corruption and drop the datagram; UDP does not ask for retransmission. Lost or corrupt datagrams are left to the application or upper layers (e.g. DNS retries the query).

### UDP pseudo header

For the **checksum**, UDP (and TCP) uses a **pseudo header** that is **not** sent on the wire. It includes: source IP, destination IP, protocol number (17 for UDP), and UDP length. This ties the checksum to the IP addresses and protocol so that misdelivered or altered packets are more likely to be detected.

---

## UDP pros and cons

### Advantages

- **No connection setup** — First packet can carry data immediately; no handshake delay.
- **Low overhead** — 8-byte header; good for small, frequent messages (e.g. DNS, NTP).
- **Faster** — No retransmission, no flow/congestion control; less processing and delay.
- **Broadcast and multicast** — UDP can send to a broadcast or multicast address; TCP is strictly unicast.
- **Simple** — Easy to implement and reason about; suitable for custom or real-time protocols.

### Disadvantages

- **No delivery guarantee** — Packets can be lost, duplicated, or reordered; the application must handle this if needed.
- **No flow control** — A fast sender can overwhelm the receiver or the network.
- **No congestion control** — UDP does not back off when the network is congested; can worsen congestion (e.g. in DDoS or aggressive streaming).
- **No ordering** — Application must reorder or tolerate out-of-order data.

### When to use UDP vs TCP

- **Use UDP** when: low latency is critical (games, VoIP, live streaming), messages are small and idempotent (DNS), or you need broadcast/multicast. Acceptable to lose or reorder some packets.
- **Use TCP** when: data must arrive complete and in order (file transfer, HTTP, email), or you want built-in flow and congestion control.

See [TCP](./3_TCP.md) for connection-oriented, reliable delivery. For UDP server examples and captures, see [Labs/](../Labs/README.md).

---

## References

- [ByteByteGo – Top 4 Most Popular Use Cases for UDP](https://bytebytego.com/guides/top-4-most-popular-use-cases-for-udp/) (diagram; used with credit)
- [GeeksforGeeks – User Datagram Protocol (UDP)](https://www.geeksforgeeks.org/computer-networks/user-datagram-protocol-udp/)
- [GeeksforGeeks – Transport Layer Protocols](https://www.geeksforgeeks.org/computer-networks/transport-layer-protocols/)
- RFC 768 – User Datagram Protocol
