# Signals & Performance

[← Back to Observability](./README.md)

Metrics, logs, traces; latency, jitter, loss; SLIs and synthetic checks.

## Table of Contents

- [Signals: metrics, logs, traces](#signals-metrics-logs-traces)
- [Performance and SLIs](#performance-and-slis)
- [References](#references)

---

## Signals: metrics, logs, traces

For **network observability**, you collect three kinds of signals and use them for troubleshooting, capacity planning, and security.

The diagram below illustrates the three pillars of observability (logging, tracing, metrics) and typical architectures. Source and image: [ByteByteGo – Logging, Tracing, and Metrics](https://bytebytego.com/guides/logging-tracing-metrics/).

![Logging, tracing, and metrics — three pillars of observability (ByteByteGo)](../Assets/Observability/bytebytego-logging-tracing-metrics.png)

- **Metrics** — **Counters** and **gauges** over time: throughput (bytes/packets per second), **error/drop** rates, **connection** counts, **interface** utilization, **round-trip time (RTT)**. Collected from devices (SNMP, NetFlow, vendor APIs), hosts (e.g. node_exporter), and applications (e.g. request rate, latency percentiles). Stored in time-series DBs (Prometheus, InfluxDB) for dashboards and alerting.
- **Logs** — **Event records** from network devices (syslog, auth, config change), **flow** or **session** logs (Zeek conn.log, firewall logs), and **application** logs (request/response, errors). Used for **audit**, **incident investigation**, and **correlation** in a SIEM. See [5_Security_Monitoring](./5_Security_Monitoring.md).
- **Traces** — **End-to-end** request path across services and network hops (e.g. distributed tracing with span IDs). Less common for “pure” L2/L3 but used for **application** flows over the network (e.g. which hop or service added latency). Can be combined with **flow** data (NetFlow, IPFIX) for path and volume.

**Networking focus:** Flow data (NetFlow/sFlow/IPFIX), device metrics (interface up/down, errors, discards), and **packet capture** (PCAP) for deep inspection. See [2_Packet_Capture](./2_Packet_Capture.md), [3_Wireshark](./3_Wireshark.md).

---

## Performance and SLIs

- **Latency** — Time for a packet or request to go from source to destination (one-way or RTT). **Network latency** = propagation + queuing + serialization; **application latency** includes processing. Measured in ms; high latency degrades interactive and real-time apps.

The diagram below shows **relative latency numbers** (from cache to network round-trip) that help reason about where delay comes from. Source and image: [ByteByteGo – Which Latency Numbers Should You Know?](https://bytebytego.com/guides/which-latency-numbers-should-you-know/) (note: approximate benchmarks; useful for context).

![Latency numbers — from L1 cache to network RTT (ByteByteGo)](../Assets/Observability/bytebytego-latency-numbers.jpg)
- **Jitter** — **Variation** in delay between packets (e.g. due to queuing, congestion, path change). Bad for **voice and video**; often smoothed with a **jitter buffer** at the receiver.
- **Loss** — **Packet loss** (dropped or corrupted). Expressed as % or count. Causes: congestion, errors, policy (e.g. firewall). Affects throughput and real-time quality. See [4_Qos_Congestion](./4_Qos_Congestion.md).

**SLIs (Service Level Indicators)** for networking might include: **availability** (reachability, uptime), **latency** (p50, p95, p99 RTT), **throughput** (achieved vs capacity), **packet loss %**, **error/discard** rate. **Synthetic checks** (e.g. periodic ping, HTTP probe, or traceroute from monitoring nodes) validate **reachability** and **path** and feed SLIs and alerting. See [6_Network_Operations](./6_Network_Operations.md).

**Commands (hands-on): simple synthetic checks**

```bash
# Ping: reachability and RTT (use in scripts or cron for SLI)
ping -c 5 8.8.8.8

# Traceroute: path and per-hop latency
traceroute 8.8.8.8

# HTTP probe (e.g. for availability / status)
curl -o /dev/null -w "%{http_code}\n" -s https://example.com
```

---

## References

- [ByteByteGo – Logging, Tracing, and Metrics](https://bytebytego.com/guides/logging-tracing-metrics/) (diagram; used with credit)
- [ByteByteGo – Which Latency Numbers Should You Know?](https://bytebytego.com/guides/which-latency-numbers-should-you-know/) (diagram; used with credit)
- [4_Qos_Congestion](./4_Qos_Congestion.md); [2_Packet_Capture](./2_Packet_Capture.md); [3_Wireshark](./3_Wireshark.md); [5_Security_Monitoring](./5_Security_Monitoring.md); [6_Network_Operations](./6_Network_Operations.md)
