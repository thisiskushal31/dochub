# Resource Limits & Failure Modes

[← Back to Advanced](./README.md)

TCP source port exhaustion and real-world TCP failure case studies.

## Table of Contents

- [Running out of TCP source ports](#running-out-of-tcp-source-ports)
- [Postgres failure caused by a Cisco router (TCP issue)](#postgres-failure-caused-by-a-cisco-router-tcp-issue)
- [References](#references)

---

## Running out of TCP source ports

A **single** client (one **source IP**) can open only a **limited** number of **simultaneous** connections to a **given** destination IP:port, because each connection is identified by **(source IP, source port, dest IP, dest port)** and the **ephemeral port** range is finite. Source: Course outline (Running out of TCP Source Ports).

- **Ephemeral port range** — The OS assigns **source ports** from a range (e.g. Linux `net.ipv4.ip_local_port_range`, often 32768–60999). So **one** client to **one** server IP:port can use at most ~28k **distinct** connections at once (minus ports in **TIME_WAIT** or other states).
- **TIME_WAIT** — After **active close** (client sends FIN first), the client holds the **(src IP, src port, dest IP, dest port)** tuple in **TIME_WAIT** for **2*MSL** (e.g. 60–120 s) so that delayed segments do not confuse a **new** connection. During that time, that **same** 4-tuple **cannot be reused**. **High** connection churn (many short-lived connections to the same server) can **exhaust** available source ports and cause **“cannot assign requested address”** or similar.
- **Tuning / mitigation:** **Reuse** connections (connection **pooling**, keep-alive) to reduce **churn**. **Increase** ephemeral range (trade-off: more memory). **Reuse** TIME_WAIT sockets where safe (e.g. Linux `net.ipv4.tcp_tw_reuse` for **outbound**). **Scale out** with more **client IPs** (e.g. more pods/nodes) so the limit is per IP. **Server-side**: ensure the server **closes** cleanly and does not leave too many connections in **CLOSE_WAIT**.

---

## Postgres failure caused by a Cisco router (TCP issue)

This **case study** illustrates how **network devices** (e.g. a **Cisco router**) can interact with **TCP** in ways that cause **application** failures (e.g. **Postgres**). Source: Course outline (Postgres failure caused by a Cisco router).

- **Scenario:** A **Postgres** deployment (or similar DB) relies on **many** TCP connections between clients and the DB. A **router** (or firewall) in the path may **terminate** idle TCP sessions (e.g. **NAT** or **session** timeout), **drop** or **alter** segments (e.g. **MTU**, **checksum** offload, **TCP options**), or **send** **RST** in certain conditions. If the device **closes** or **resets** connections that the **application** still considers **open**, the app can see **“connection reset”**, **“broken pipe”**, or **connection pool** exhaustion.
- **Takeaways:** **Align** device **timeouts** (NAT, session, firewall) with **application** idle timeouts and **keep-alive** settings. **Inspect** the path (routers, firewalls, load balancers) for **TCP**-altering behavior (e.g. **proxy** that closes idle connections). **Tune** **TCP keep-alive** (or app-level pings) so that idle connections are **refreshed** before the **network** device drops them. **Monitor** **connection** errors and **retries** to correlate with **network** changes or device config.

---

## References

- Course outline: Running out of TCP Source Ports, Postgres failure caused by a Cisco router (TCP issue)
- [Transport/4_Sockets_Kernel_Nat](../Transport/4_Sockets_Kernel_Nat.md); [Transport/5_TCP_Performance](../Transport/5_TCP_Performance.md)
