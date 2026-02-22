# Communication: Protocols (HTTP, TCP, UDP)

## Why protocols matter

Systems communicate over the network. Key building blocks: **HTTP**, **TCP**, **UDP** (and API styles like RPC, REST, gRPC, GraphQL — see [API styles](11-api-styles.md)).

---

## HTTP

- **Role:** Encode and carry data between **client and server**. Request/response: client sends request, server responds with content and status.
- **Properties:** Self-contained messages; can pass through intermediaries (load balancers, caches, proxies) that do caching, compression, TLS.
- **Common methods:**

| Verb | Description | Idempotent | Safe | Cacheable |
|------|-------------|------------|------|-----------|
| GET | Read resource | Yes | Yes | Yes |
| POST | Create / trigger | No | No | If freshness in response |
| PUT | Create or replace | Yes | No | No |
| PATCH | Partial update | No | No | If freshness in response |
| DELETE | Delete | Yes | No | No |

---

## TCP

- **Connection-oriented** over IP. Handshake to establish/close. **Reliable, ordered:** packets arrive in order and uncorrupted (sequence numbers, checksums, acks, retransmit). Flow control and congestion control.
- **Trade-off:** Extra guarantees add latency and overhead vs UDP.
- **Use when:** You need **all data intact** (e.g. web, DB, SMTP, FTP, SSH). Prefer TCP when reliability matters more than minimal latency.
- **Scaling:** Many open TCP connections use more memory; connection pooling and switching to UDP where appropriate can help.

---

## UDP

- **Connectionless.** No guarantee of order or delivery; no congestion control. **Lower latency**, more efficient for suitable workloads.
- **Use when:** **Lowest latency** matters; **late data is worse than lost data** (e.g. VoIP, video chat, real-time games). Can implement your own error correction on top.
- **Special:** Can **broadcast** to all devices on a subnet (e.g. DHCP before client has an IP).

**Summary:** TCP = reliable, ordered; UDP = low latency, best-effort. Choose by reliability vs latency needs.
