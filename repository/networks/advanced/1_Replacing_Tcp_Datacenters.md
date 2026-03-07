# Replacing TCP for Datacenters

[← Back to Advanced](./README.md)

Why TCP can be suboptimal in DC; QUIC and alternatives; deployment considerations.

## Table of Contents

- [Part 1: Why TCP can be suboptimal](#part-1-why-tcp-can-be-suboptimal)
- [Part 2: QUIC and alternatives](#part-2-quic-and-alternatives)
- [Part 3: Deployment and migration](#part-3-deployment-and-migration)
- [References](#references)

---

## Part 1: Why TCP can be suboptimal

In **datacenters**, TCP can be **suboptimal** for certain workloads and topologies. Source: Course outline (Replacing TCP for Data Centers), transport-layer concepts.

- **Latency** — TCP **handshake** (SYN, SYN-ACK, ACK) adds **one RTT** before data; **TLS** adds more. For **short** or **many small** requests, this **overhead** dominates. **TCP Fast Open (TFO)** and **TLS 0-RTT** reduce it but are not universal.
- **Head-of-line (HOL) blocking** — In a **single** TCP connection, **one** lost segment **blocks** all subsequent segments until it is retransmitted. With **multiplexed** streams (e.g. HTTP/2 over one TCP connection), **one** lost packet can stall **all** logical streams. This hurts **latency** when loss is non-zero (e.g. in DC or wireless).
- **Incast** — Many **senders** (e.g. workers) send to **one** receiver at once (e.g. shuffle, fan-in). **Switch buffers** can **overflow**; TCP **backoff** causes **throughput collapse** and **timeouts**. Requires **traffic** and **buffer** tuning (e.g. ECN, smaller timeouts, pacing).
- **Kernel overhead** — Per-packet **kernel** processing, **context switches**, and **copying** can limit **throughput** and **latency** for high-rate or low-latency apps. **Kernel bypass** (e.g. DPDK) or **user-space** stacks are used in some DC environments.

---

## Part 2: QUIC and alternatives

**QUIC (Quick UDP Internet Connections)** is a **transport** protocol over **UDP** that provides **encryption**, **multiplexing**, and **low-latency** connection establishment. Source: [Transport/6_Other_Protocols](../Transport/6_Other_Protocols.md), course outline.

- **QUIC:** **Connection** and **0–1 RTT** setup (resumption); **multiple streams** over one connection with **per-stream** flow control; **no head-of-line blocking** between streams (loss on one stream does not block others). **Encryption** (TLS 1.3) is mandatory. Used in **HTTP/3** and for **custom** protocols. **Trade-off:** Runs in **user space** (or kernel implementations); **NAT/firewall** must allow UDP; **visibility** is harder (encrypted).
- **Other alternatives:** **SCTP** (streams, multihoming; less adoption). **Custom** UDP-based or **kernel-bypass** stacks (e.g. **DPDK**, **io_uring**) for **extreme** latency/throughput in controlled DCs. **TCP** with **TFO** and **multiple connections** or **connection pooling** remains common where QUIC is not yet deployed.

---

## Part 3: Deployment and migration

- **Deployment:** **QUIC/HTTP3** is supported in **browsers** and many **CDNs/servers**. Deploy **UDP** (typically 443) and **QUIC** on the same **service** as TCP/TLS; **fallback** to TCP if QUIC fails. **Load balancers** and **proxies** must **support** QUIC (termination or passthrough).
- **Migration:** **Incremental**: enable QUIC alongside TCP; monitor **adoption** and **errors**. **Troubleshooting**: QUIC is **encrypted**; use **server-side** logs and **metrics** (e.g. qlog). **NAT/firewall**: ensure **UDP** is allowed and **timeouts** are sufficient for idle QUIC connections.

---

## References

- Course outline: Replacing TCP for Data Centers (Parts 1–3)
- [Transport/5_TCP_Performance](../Transport/5_TCP_Performance.md) (head-of-line blocking, TFO); [Transport/6_Other_Protocols](../Transport/6_Other_Protocols.md) (QUIC)
