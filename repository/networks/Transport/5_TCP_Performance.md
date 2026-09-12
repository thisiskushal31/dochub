# TCP Performance & Tuning

[← Back to Transport](./README.md)

MSS, MTU, PMTUD, Nagle, delayed ACK, connection cost, TFO, and head-of-line blocking.

## Table of Contents

- [MSS vs MTU vs PMTUD](#mss-vs-mtu-vs-pmtud)
- [Nagle's algorithm](#nagles-algorithm)
- [Delayed acknowledgment](#delayed-acknowledgment)
- [Cost of connection establishment](#cost-of-connection-establishment)
- [TCP Fast Open (TFO)](#tcp-fast-open-tfo)
- [TCP head-of-line blocking](#tcp-head-of-line-blocking)
- [References](#references)

---

## MSS vs MTU vs PMTUD

**MTU** is the max packet size on a link (e.g. 1500 for Ethernet). **Path MTU** is the minimum MTU along the path. **MSS** is the max TCP payload a host will receive; advertised in the handshake, typically MTU − 40. **PMTUD**: sender sets DF (IPv4); if a router cannot forward, it drops and sends ICMP "Fragmentation Needed" with its MTU; sender reduces segment size. If ICMP is blocked, PMTUD can **black hole** (packets dropped, no feedback). **PLPMTUD** (RFC 4821) probes without relying on ICMP. See [Foundations/5_Network_Layer](../Foundations/5_Network_Layer.md) for fragmentation.

---

## Nagle's algorithm

**Nagle** (RFC 896) buffers small sends when there is **unacknowledged data** in flight; it sends when an ACK arrives or a full segment is ready. Reduces tiny packets but **increases latency** for small request–response traffic. Disable with **TCP_NODELAY** when low latency matters (e.g. games, interactive apps).

---

## Delayed acknowledgment

The receiver **delays** sending an ACK (e.g. up to 500 ms) to **piggyback** it with data or combine ACKs. With **Nagle**, this can cause a **stall**: sender waits for ACK to send more; receiver waits to send ACK with data; each waits on the other until the delayed-ACK timer fires. Fix: disable Nagle and/or avoid many tiny writes.

---

## Cost of connection establishment

The **three-way handshake** costs **1 RTT** before the first data. **TLS** adds more RTTs. Short-lived connections pay this every time; **connection reuse** (keep-alive, pooling) and **TCP Fast Open** reduce the cost.

---

## TCP Fast Open (TFO)

**TFO** (RFC 7413) lets the client send **data in the SYN** (and a cookie from a prior connection). The server validates the cookie and can send data in the SYN-ACK. First request–response can complete in **1 RTT**. Requires OS and app support; some middleboxes may interfere.

---

## TCP head-of-line blocking

TCP delivers bytes **in order**. If segment N is lost, segments N+1, N+2, … cannot be delivered until N is retransmitted — **one loss blocks the whole stream**. QUIC avoids this with multiple **streams**: loss on one stream does not block others. See [Other protocols](./6_Other_Protocols.md) and [Advanced/](../Advanced/README.md).

---

## References

- RFC 1191 (PMTUD); RFC 4821 (PLPMTUD); RFC 896 (Nagle); RFC 7413 (TFO)
- [TCP](./3_TCP.md); [Advanced](../Advanced/README.md)
