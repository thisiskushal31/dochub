# 17 — Profiling and network topology

[← Previous](./16_Streams_Processors_And_Data_Quality.md) · [README](./README.md) · [Next →](./18_Security_SIEM_Literacy.md)

## 1. Concepts — when APM is not enough

**Universal Profiling** is always-on, eBPF-based **CPU profiling** across the host: stacktraces, flamegraphs, and functions **without** instrumenting every binary. Use it when APM shows a slow span but not *which native or shared library* burns CPU ([07](./07_APM_Tracing_And_RUM.md), [parent 23](../23_Continuous_Profiling_And_Events.md)). **CPU stack sampling only** today—not a memory-leak detective. Fixed sampling frequency (~20 Hz) → predictable storage (~40 MB per core per day before ILM).

**Network Topology** (plugin, **preview**) visualizes **SNMP-enabled devices**—L2/L3 adjacency, BGP/OSPF state, interface health—from Logstash-polled MIBs into Kibana. Use it for **network device** digs, not application RED.

| Signal | Answers | Does not answer |
|--------|---------|-----------------|
| **APM traces** | Where time went across services | Kernel/third-party CPU without spans |
| **Universal Profiling** | Which frames/hosts/containers burn CPU | Request-level user journeys alone |
| **Network Topology** | Router/switch/BGP adjacency health | Checkout latency root cause in app code |

**Availability.** Universal Profiling: Stack / Elastic Cloud Hosted — **unavailable on serverless Observability**. Network Topology: **self-managed Kibana only** — **not** Elastic Cloud Hosted or serverless.

**Disconfirm:** Profiling day one instead of APM+logs ([14](./14_What_To_Enable_Next_And_When_Not.md)). Network Topology on ECH/serverless. Profiling ⇒ heap/memory leak root cause. Topology pages ⇒ SRE app on-call by default.

**Confirm:** Linux hosts eligible for eBPF (x86_64 kernel ≥4.19 or ARM64 ≥5.5)? Profiling owner named? For topology: SNMP inventory + Logstash pipeline owned by network?

## 2. Advanced — install literacy, probabilistic, self-managed limits

### Universal Profiling — Cloud path (literacy)

1. Prerequisites: Elastic Cloud deployment with **Integrations Server** enabled; `elastic`/superuser for first setup; Linux workloads.  
2. In Kibana, open any **Universal Profiling** nav item → **Set up Universal Profiling** (or programmatic Kibana API, Stack 9.2+).  
3. Install the **Universal Profiling Agent** (host-agent) or the **Universal Profiling Agent integration** via Fleet on target hosts.  
4. Filter views by host/container/deployment; use **differential** views across time ranges for post-deploy regressions.  
5. Unsymbolized frames show hex—adding native symbols is often a separate ops process.

Interpreters supported include JVM/JDK, Python, Go, Rust, C/C++, Node.js/V8, Ruby, .NET, PHP, Perl (see current version matrix in docs).

### Self-managed Stack path (literacy)

Backend + client: minimum Stack **8.12+**, license required. Install profiling **backend** (Helm on Kubernetes 1.22+; ECE ≥3.7 with stackpack; ECK: helm standalone connecting to ECK-managed ES—no native Profiling Operator/CRDs yet). Then enable in Kibana and deploy host-agents. Order matters: Stack update → Kibana enable → backend → agents ([docs steps 1–5](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/run-universal-profiling-on-self-hosted-elastic-stack)).

### Probabilistic profiling

At fleet scale, lower event volume with `-probabilistic-threshold` (1–99; default 100 = always) and `-probabilistic-interval` (default 1m). Each interval draws a random 0–99; if threshold > random, collect for that interval. Events scale roughly linearly with threshold—use to protect storage budget ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

### Profiling ILM

Default profiling ILM: rollover ~30d/50GB, warm after 30d, delete after 60d (indices stay hot 30d *after* rollover because rollover blocks phase transition). Customize for compliance vs cost; search `profiling` in Index Lifecycle Management.

### Network Topology — path and limits

Logstash polls IF-MIB / IP-MIB / BRIDGE-MIB / BGP4-MIB / OSPF-MIB → Elasticsearch data stream → `snmp-device-enrichment` pipeline (`host.type`, `observer.vendor`) → Kibana force-directed graph. Failures: SNMP credentials, missing OIDs, poll timeouts—not “APM misconfigured.” Poll frequency vs device CPU is a network-ops tradeoff.

**Vs Datadog NPM/USM.** Elastic Network Topology here is **device SNMP topology**, not eBPF service-map USM ([Datadog/17](../Datadog/17_Network_USM_And_GPU_Monitoring.md)). For service dependency graphs, lean on APM service maps first.

**Overhead / canary.** eBPF is low overhead; still canary one node pool. Kernel version and locked-down seccomp policies can block the agent. Proxy settings exist for agent → backend.

**Dig order.** APM → logs → metrics first ([parent 21](../21_Correlation_And_Dig_Methodology.md)). Add Profiling when the span is “CPU somewhere.” Add Network Topology when the symptom is link/protocol adjacency.

## 3. Applications — use cases and staff checklist

| Use case | Moves |
|----------|-------|
| p99 up after deploy, flat APM DB time | Profiling differential → hot function → code/config |
| Shared sidecars eating CPU | Profiling by container/deployment |
| Storage growth from profiling | Probabilistic threshold; tighten profiling ILM |
| Multi-site BGP flap | Network Topology adjacency + interface tables |
| App SLO only | Skip topology; keep Synthetics/APM ([08](./08_Synthetics_And_Uptime.md)) |
| Serverless-only estate | Profiling unavailable—stay on APM/EDOT |

**Staff checklist:** Profiling enabled only on owned fleets; symbols process documented; profiling index ILM set; probabilistic policy for large fleets; Network Topology limited to self-managed + SNMP allowlist; never page SRE from topology without a network owner; license confirmed for self-managed backend.


**Sizing literacy (Cloud).** Docs example for ~500 hosts / ~6000 cores: Elasticsearch ~64 GB × 2 zones, Kibana ~8 GB, Integrations Server ~8 GB (still size for *your* fleet). Even small fleets should avoid single-zone ES for profiling backends. Proxy the host-agent when nodes lack direct egress.

**Symbols and differentials.** After a deploy, compare flamegraphs across the release window; if frames are hex-only, the investigation stops at “native code”—budget time for symbol packages on critical binaries. Probabilistic profiling reduces events but also thins rare stacks—do not debug a once-per-hour spike with threshold 10.


### Decision tree

1. Is the symptom HTTP/user-journey latency? → APM + logs first ([13](./13_Worked_Example_First_Service.md)).  
2. Is CPU high with flat DB/span time? → Universal Profiling (if Stack/ECH and Linux eBPF OK).  
3. Is the symptom BGP/link/SNMP device health? → Network Topology on **self-managed** only.  
4. Serverless-only? → Profiling and Topology out of scope; stay on APM/EDOT/Synthetics.

If you answered “enable all three,” re-read [14](./14_What_To_Enable_Next_And_When_Not.md).


**Network Topology MIB literacy.** IF-MIB (interfaces), IP-MIB (ARP/IP), BRIDGE-MIB (MAC tables), BGP4-MIB (peers), OSPF-MIB (neighbors). Enrichment maps `sysDescr` to vendor/type for Cisco, Juniper, Arista, Fortinet, Palo Alto, HPE, Aruba—and is extensible. Sample data generator exists for eval before live SNMP.

**License and feedback.** Self-managed Universal Profiling needs an appropriate subscription. Treat early profiling enablement as a canary with a feedback loop to Elastic if agent/kernel issues appear—do not silently leave broken agents on every node.

Keep a one-page RACI: who owns host-agent upgrades, who owns SNMP credentials, who gets paged.

## References

- [Universal Profiling](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/universal-profiling) · [Get started](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/get-started-with-universal-profiling) · [Self-hosted](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/run-universal-profiling-on-self-hosted-elastic-stack)  
- [Probabilistic profiling](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/configure-probabilistic-profiling) · [Profiling ILM](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/universal-profiling-index-life-cycle-management)  
- [Network Topology](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/network-topology) · [18 Security literacy](./18_Security_SIEM_Literacy.md)
