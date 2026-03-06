# TLS Extensions & Performance

[← Back to Advanced](./README.md)

TLS 0-RTT and when to use it.

## Table of Contents

- [TLS 0-RTT](#tls-0-rtt)
- [References](#references)

---

## TLS 0-RTT

**TLS 1.3** supports **0-RTT (zero round-trip time) resumption**: the client can send **application data** in the **first** flight (together with the resumed handshake), so that **one** RTT is saved compared to a full handshake. Source: [security/2_Encryption_Tls](../security/2_Encryption_Tls.md), course outline (TLS 0-RTT).

- **How it works:** The client has a **resumption ticket** or **session** from a **previous** connection. In the **next** connection, it sends **Client Hello** (with ticket or PSK) and **0-RTT data** (early data) in the **same** flight. The server **accepts** the resumption and **may** process 0-RTT data **before** the handshake completes. **Idempotent** or **safe-to-replay** requests (e.g. GET) are good candidates.
- **Replay risks:** **0-RTT data** can be **replayed** by an attacker who captured the first flight. If the **application** treats 0-RTT as a **non-idempotent** action (e.g. payment, state change), **replay** can cause **duplicate** or **incorrect** effects. **Mitigation:** Use 0-RTT only for **idempotent** operations; or have the server **reject** or **defer** non-idempotent 0-RTT; or use **replay detection** (e.g. server-side once-only tokens).
- **When to use:** **Low-latency** first request (e.g. first API call after resume). **Avoid** for **mutating** or **sensitive** operations unless replay is explicitly handled.

---

## References

- [security/2_Encryption_Tls](../security/2_Encryption_Tls.md) (TLS 0-RTT); [services/3_Http_Tls](../services/3_Http_Tls.md)
