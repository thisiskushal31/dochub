# Security Monitoring & Threat Hunting

[← Back to Observability](./README.md)

Threat hunting, enterprise security monitoring, Zeek, Suricata, SIEM/ELK.

## Table of Contents

- [Threat hunting](#threat-hunting)
- [Enterprise security monitoring](#enterprise-security-monitoring)
- [Zeek](#zeek)
- [Suricata](#suricata)
- [SIEM and log analysis](#siem-and-log-analysis)
- [AI-assisted security monitoring](#ai-assisted-security-monitoring)
- [References](#references)

---

## Threat hunting

**Threat hunting** is **proactive** search for threats that may have evaded automated detection. Instead of waiting for alerts, analysts form **hypotheses** (e.g. “lateral movement from this subnet,” “beaconing to this domain”) and **query** logs, flows, and packet data to confirm or refute. It uses the same data as NSM (Zeek, Suricata, flow, PCAP) and SIEM; the difference is hypothesis-driven investigation and iterative refinement. Platforms like **Security Onion** combine full-packet capture, Zeek, Suricata, and Elastic/Kibana so hunters can pivot from alert to session to packet. Hunting workflows: start from a **indicator** (IP, hash, domain), expand to **related** hosts and sessions, then **inspect** payloads and timelines.

---

## Enterprise security monitoring

**Enterprise security monitoring** centralizes **log management** and **visibility** for network and security events. **Full-packet capture** (PCAP) and **flow data** (NetFlow, IPFIX) feed **network security monitoring (NSM)**. Tools like **Zeek** and **Suricata** generate **structured logs** and **alerts** from live traffic; those logs are stored and indexed (e.g. in Elasticsearch) for search and dashboards. **SIEM** (Security Information and Event Management) correlates events from many sources (network, host, auth, firewall) to detect anomalies and known attack patterns. **Security Onion** is an open platform that bundles Zeek, Suricata, Wireshark, Kibana, and other components for NSM and threat hunting in one deployment.

---

## Zeek

**Zeek** (formerly Bro) is a **network security monitoring** platform that runs as a passive sensor on a span port or tap. It **generates logs** from traffic: connections (conn.log), HTTP (http.log), DNS (dns.log), SSL/TLS (ssl.log), and many other protocols. It is **scriptable** (Zeek script) so you can add custom analysis and alerts. Zeek does not block traffic; it observes and logs. Output is typically shipped to a SIEM or search engine (e.g. Elasticsearch) for analysis. Used in enterprise and research for visibility and incident response.

**Hands-on: what you're doing when you run Zeek**

From a **network perspective**, you are running a **passive sensor**: Zeek reads traffic from an interface (or a PCAP file) and turns it into **structured logs** (who talked to whom, when, which protocol, and often application-level detail like HTTP URIs or DNS queries). You are **not** blocking or forwarding packets; you are **observing** and **logging** for later analysis or alerting.

**Commands (run with appropriate permissions; typically root or capability for raw capture):**

```bash
# Run Zeek on interface eth0. It will create log files in the current directory (or $ZEEK_LOG_PATH).
# You are telling Zeek: "read all traffic from eth0 and generate conn.log, dns.log, http.log, etc."
sudo zeek -i eth0

# Stop with Ctrl+C. Then inspect the logs:
ls -la *.log
# conn.log  = TCP/UDP connections (src/dst IP:port, duration, bytes, protocol)
# dns.log   = DNS queries and responses
# http.log  = HTTP requests (host, URI, method, etc.)
# ssl.log   = TLS connections (server name, JA3, etc.)
```

**What the logs represent (network view):**

- **conn.log** — Each line is a **connection** (or UDP “session”): originator/responder IP and port, protocol, start/end time, duration, bytes sent each way. Use it to answer “who talked to whom and how much?”
- **dns.log** — Each line is a **DNS transaction**: query name, type (A, AAAA, etc.), response, TTL. Use it to see what names were resolved and which IPs were returned.
- **http.log** — Each line is an **HTTP request**: host, URI, method, user-agent. Use it to see what was requested over the wire.

**Process a PCAP file (offline):** You are running Zeek in **offline** mode so it doesn’t need an interface; it reads a capture file and produces the same logs. Useful for replay or forensics.

```bash
# -r = read pcap; Zeek will write logs next to the pcap or in current dir
sudo zeek -r capture.pcap
```

**ZeekControl (managed deployment):** In production, Zeek is often run via **ZeekControl** (`zeekctl`), which manages config (e.g. `node.cfg` with interface), starts/stops nodes, and deploys scripts. You configure the interface in `node.cfg`, then `zeekctl deploy` and `zeekctl start`. The above one-off commands are for learning or ad-hoc analysis.

---

## Suricata

**Suricata** is an **IDS/IPS** engine: it matches traffic against **rule sets** (e.g. Suricata rules, ET Open, or custom) and can **alert** (IDS) or **drop** (IPS). It supports **multithreading**, **flow** and **protocol** parsing, and **file extraction**. Often deployed at the perimeter or on critical segments (e.g. with **pfSense** or as a standalone sensor). Rules describe patterns (signature, protocol, flow); when a packet or stream matches, Suricata logs the event and can trigger an alert. Deployed alongside Zeek in many NSM stacks (Zeek for rich logging, Suricata for signature-based detection and blocking).

**Hands-on: what you're doing when you run Suricata**

From a **network perspective**, you are running a **signature-based** engine: Suricata reads traffic (live or from a PCAP), matches it against **rules** (e.g. “this pattern = known exploit or C2”), and writes **alerts** and **logs**. In IDS mode it only logs; in IPS mode it can drop packets. You need a **config file** (e.g. `suricata.yaml`) and a **rule set** (e.g. ET Open) so Suricata knows what to look for.

**Commands (config and rules must be in place; run with appropriate permissions for live capture):**

```bash
# Test the config file. You are checking that Suricata can parse suricata.yaml and rules.
suricata -T -c /etc/suricata/suricata.yaml

# Run on interface eth0 (live IDS). You are telling Suricata: "read traffic from eth0,
# match against rules, write alerts to eve.json (or as configured)."
sudo suricata -c /etc/suricata/suricata.yaml -i eth0

# Run in offline mode: read a PCAP and generate alerts. You are replaying traffic
# so Suricata can detect what would have been flagged in real time.
sudo suricata -c /etc/suricata/suricata.yaml -r capture.pcap -l /tmp/suricata-log
# -l = log directory; alerts and eve.json go there
```

**What you're doing with each option:**

| Option | What you're doing |
|--------|-------------------|
| `-T` | **Test** config and rules; no capture. Use before starting live run. |
| `-c path` | Use this **config file** (interfaces, rule paths, output, etc.). |
| `-i eth0` | **Live capture** on interface eth0 (IDS/IPS). |
| `-r capture.pcap` | **Offline** mode: read PCAP and match rules; no live traffic. |
| `-l /path` | **Log directory** for eve.json, alerts, and other output. |

**Typical workflow:** (1) Install Suricata and a rule set (e.g. ET Open). (2) Edit `suricata.yaml` (set interface, rule path). (3) `suricata -T -c suricata.yaml`. (4) Run with `-i` for live or `-r` for PCAP; then inspect `eve.json` or alert logs. This way you know you’re either **testing config**, **watching live traffic**, or **replaying a capture** for analysis.

---

## SIEM and log analysis

A **SIEM** aggregates **logs** from network devices, servers, applications, and security tools, **normalizes** them, and supports **correlation rules** and **dashboards**. The **ELK stack** (Elasticsearch, Logstash, Kibana) is often used for log storage and visualization: Logstash or Beats **ingest** logs, Elasticsearch **indexes** them, Kibana provides **search** and **dashboards**. For network and security, events from Zeek, Suricata, firewalls, and auth (e.g. RADIUS, 802.1X) are ingested so analysts can search by IP, user, or alert type and correlate across time and sources.

---

## AI-assisted security monitoring

**AI-assisted** features in security monitoring help analysts **prioritize** and **understand** alerts and evidence. In platforms such as **Security Onion**, **AI** can be used to: (1) **summarize** detection rules or alerts (e.g. “AI summaries” for Suricata/Zeek/ElastAlert rules) so analysts quickly see what a rule does or what an alert might mean; (2) **assist investigation** (e.g. an “Onion AI”–style assistant that can answer questions about the deployment or suggest next steps); (3) **pull in AI models** from a repository for use in detection or scoring. These features are **additions** to the core NSM pipeline (Zeek, Suricata, SIEM); they do not replace rule-based or flow-based detection but can speed up triage and context. When using such tools, ensure prompts and data stay within your security and privacy policy.

---

## References

- [Zeek Quick Start](https://docs.zeek.org/en/current/quickstart.html); [Zeek logs (conn.log, dns.log)](https://docs.zeek.org/en/current/logs/conn.html); [Suricata command-line options](https://docs.suricata.io/en/latest/command-line-options.html)
- Security Onion: threat hunting, Zeek, Suricata, Kibana, AI-assisted features
- [Network operations](./6_Network_Operations.md); [Packet capture](./2_Packet_Capture.md)
