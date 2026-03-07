# Blue Team & Defensive Security

[← Back to Networks](https://thisiskushal31.github.io/dochub/#/networks)

Defensive security operations from a **blue team** perspective: what defenders do on the **network** to **monitor**, **detect**, **respond**, and **harden**. This document is a **deep dive** with a **teacher’s mindset**: we walk through *why* we do each step, *what* the commands actually do, and *how* to interpret the results. You’ll get copy-paste commands and enough context to use them with a clear head—like a professor and engineer in the same room.

## Table of Contents

- [What blue team / defensive security is](#what-blue-team--defensive-security-is)
- [Security engineer workflow (network perspective)](#security-engineer-workflow-network-perspective)
- [Network security monitoring (NSM) and visibility](#network-security-monitoring-nsm-and-visibility)
- [Working with Zeek logs: conn.log and dns.log](#working-with-zeek-logs-connlog-and-dnslog)
- [Detection and alerting (with examples)](#detection-and-alerting-with-examples)
- [Incident response: step-by-step with commands](#incident-response-step-by-step-with-commands)
- [Hardening and security baselines](#hardening-and-security-baselines)
- [Threat intelligence and IOCs](#threat-intelligence-and-iocs)
- [Log management and investigation](#log-management-and-investigation)
- [Hands-on: defensive workflows (copy-paste)](#hands-on-defensive-workflows-copy-paste)
- [References](#references)

---

## What blue team / defensive security is

**Blue team** is the **defensive** side of security: you **protect** and **defend** the organization’s systems and networks. You don’t attack; you **harden**, **monitor**, **detect**, and **respond** to attacks and incidents.

**In the network context**, blue teamers:

- **Build and maintain visibility** — So you can see what traffic and devices exist and spot anomalies. That means **flow data**, **logs** (firewall, DNS, auth, Zeek/Suricata), and sometimes **full-packet capture**.
- **Design and tune detection** — Turn visibility into **alerts** that matter: recon, exploitation, C2, lateral movement, data exfil. Reduce **false positives** so the team can act on real threats.
- **Respond to incidents** — When an alert fires or a breach is suspected, **triage**, **contain** (e.g. block IP, isolate host), **investigate** (logs, PCAP, flow), and **recover**.
- **Harden the environment** — Apply **security baselines**, **segmentation**, **patch**, and **least privilege** so the attack surface is smaller.
- **Use threat intelligence** — Feed **IOCs** (IPs, domains, hashes) into the SIEM and IDS so known-bad activity is detected and blocked where possible.

This file focuses on **network-level** defensive work: visibility, detection, response, and hardening that depend on the network. We stay practical—commands you can run, logs you can query, and steps you can follow. All essential content is **in this repository**; you don’t need to leave it to understand and use this material.

---

## Security engineer workflow (network perspective)

A **security engineer** (or SOC engineer) in a company typically combines **monitoring**, **detection**, **incident response**, and **hardening**. From a **network** perspective, here is how that looks day to day. Everything below is self-contained so you can follow the workflow without going to other links.

### Morning: alert review and triage

**What happens:** You review overnight alerts from the SIEM, IDS (e.g. Suricata, Snort), and possibly firewall or flow alerts. You **triage**: is this a true positive (real threat) or false positive (benign activity that triggered a rule)?

**Network angle:** Alerts are often **network-derived**: “internal IP 10.0.1.50 talked to known-bad IP 1.2.3.4,” “port scan from 192.168.1.100,” “unusual DNS query volume from 10.0.1.20.” You use **Zeek conn.log and dns.log** (or equivalent flow/log data) to **verify**: did that host really connect there? When? How much? The commands in the “Working with Zeek logs” and “Hands-on” sections below give you exactly how to do that. No need to leave this doc: the workflow is **identify** (search logs for the IP/domain) → **contain** (block IP, isolate host) → **investigate** (capture traffic, check other logs) → **eradicate and recover** (clean host, update detection).

### Midday: tuning and operations

**What happens:** You **tune** detection rules (e.g. Suricata) to reduce false positives or add new rules for new threats. You might **onboard** new log sources (firewall, DNS, another segment) into the SIEM. You respond to **new tickets** (e.g. “can we allow this IP?” or “investigate this spike”).

**Network angle:** Tuning often means **thresholds** (e.g. “alert after 20 ports in 60 seconds” for port-scan detection) or **exceptions** (e.g. exclude your vulnerability scanner IP from scan alerts). You work with **network** data: IPs, ports, protocols, flow volume. Rule syntax and examples are in the “Detection and alerting” section below. Operations include **firewall change requests** (allow/deny IP or port) and **network segmentation** (which VLAN or segment a new server should be in); those concepts are in the **Firewalls & AAA** and **Attacks & mitigations** files in this repo, but the **decision** (what to block, what to allow) is driven by policy and threat intel you already have in this doc (IOCs, containment).

### Incident response (when something is wrong)

**What happens:** An alert is confirmed as a **true positive** (e.g. C2 callback, malware, or breach). You run the **incident response** process: identify scope (which hosts?), contain (block IP, isolate host), investigate (logs, PCAP), eradicate (remove cause), recover (restore, monitor), and document.

**Network angle:** **Identify** = search Zeek (or SIEM) for the malicious IP/domain and list affected internal IPs. **Contain** = add firewall rule to **block** the malicious IP (we give iptables and the idea for Cisco/cloud below) and **isolate** the compromised host (quarantine VLAN or segment). **Investigate** = capture traffic for that host (tcpdump) and inspect conn.log/dns.log for full picture. **Eradicate** = from the network side, ensure no backdoors (unexpected listeners, tunnels); re-image or patch as needed. This is all spelled out with **commands** in the “Incident response: step-by-step with commands” section below—standalone, no external links required.

### Hardening and threat intelligence

**What happens:** You **harden** the environment (segment, least privilege, patch, disable unused services) and **ingest threat intel** (IOCs: IPs, domains) into the SIEM and IDS so that known-bad activity is detected and, where possible, blocked.

**Network angle:** Hardening means **firewall rules** (allow only needed ports), **L2 controls** (port security, DHCP snooping, DAI) on switches, and **encryption** (TLS, VPN). Those are described in the **Firewalls & AAA**, **Attacks & mitigations**, and **Encryption & TLS** / **IPSec & VPNs** files in this repo; here we summarize so you know what to do. Threat intel: you **add IOCs** to your blocklist or IDS rule set and **search** historical logs (“have we ever seen this IP?”) using the same Zeek and grep commands in this document.

**Summary:** As a security engineer you **monitor** (alerts, dashboards), **triage** (logs and flow), **respond** (contain, investigate, eradicate), and **harden** (segment, firewall, intel). All of that from a **network** perspective is covered in this file with commands and workflows you can run without leaving the repository.

---

## Network security monitoring (NSM) and visibility

**NSM** is the practice of **collecting and analyzing** network data to **detect and investigate** threats. Think of it as “we need to be able to answer: who talked to whom, when, and what did they do?” Without that, you’re defending blind.

**What to collect (network-centric):**

| Data type | What it gives you | Tools / sources |
|----------|-------------------|-----------------|
| **Flow data** | Who talked to whom, when, how much (IP, port, bytes). Good for **anomaly**, **scanning**, top talkers, exfil patterns. | NetFlow, sFlow, IPFIX from routers; pmacct; VPC Flow Logs |
| **Zeek logs** | Structured logs per connection (conn.log), DNS (dns.log), HTTP (http.log), TLS (ssl.log). Rich **protocol-level** visibility; we cover conn.log and dns.log fields and zeek-cut in this document. | Zeek (run on interface or PCAP); logs in repo observability area |
| **Suricata / Snort alerts** | **Signature-based** alerts when traffic matches known bad patterns (exploits, C2, scans). Rule example for port-scan detection is in this document; full NIDS coverage is in **NIDS & identity** in this repo. | Suricata/Snort with rule sets (e.g. ET Open) |
| **Firewall logs** | Allowed/denied sessions, IPs, ports. Essential for **policy** review and “what was allowed to where.” | Firewall (on-prem, cloud SGs/NSGs); ship to SIEM |
| **DNS logs** | Queries and responses. Detect **DNS tunneling**, **C2**, **phishing** domains, **recon**. | Recursor logs; Zeek dns.log; DNS firewall/proxy |
| **Full-packet capture (PCAP)** | Full traffic for **deep investigation** after an alert. Expensive; often short retention or on-demand. We give tcpdump commands in this document; more capture options are in the **Packet capture** section in the observability area of this repo. | tcpdump, Wireshark |

**Defensive mindset:** Collect **once**, use **many times**. The same flow and Zeek logs feed **detection**, **investigation**, and **hunting**. Retain long enough to investigate incidents (often 30–90 days for flow/logs; PCAP per policy).

---

## Working with Zeek logs: conn.log and dns.log

Zeek produces **tab-delimited** or **JSON** logs. Two you’ll use every day for network defense: **conn.log** (every connection) and **dns.log** (every DNS transaction). Here we focus on **what each field means** and **how to query them** so you’re not guessing.

### conn.log: “Who talked to whom, when, how much?”

Each line is one **connection** (TCP or UDP “session”). Key fields you’ll care about:

| Field | Meaning |
|-------|--------|
| **ts** | Timestamp (epoch) when the connection started. |
| **uid** | Unique connection ID (use to tie to other Zeek logs, e.g. http.log). |
| **id.orig_h** | Originator IP (the one that initiated). |
| **id.orig_p** | Originator port. |
| **id.resp_h** | Responder IP (the one that received the connection). |
| **id.resp_p** | Responder port (e.g. 443 = HTTPS). |
| **proto** | Protocol: tcp, udp, icmp. |
| **duration** | How long the connection lasted. |
| **orig_bytes / resp_bytes** | Bytes sent by originator / responder. |
| **conn_state** | TCP state (e.g. SF = normal close, S0 = no response, REJ = rejected). |

**Why it matters:** When an alert says “internal host 10.0.1.50 talked to known-bad IP 1.2.3.4,” the **first** thing you do is search **conn.log** for those IPs. You get time, port, duration, and bytes—enough to see *what* that host was doing.

### dns.log: “What names were resolved, and what did they return?”

Each line is one **DNS transaction** (query + response). Key fields:

| Field | Meaning |
|-------|--------|
| **ts** | Timestamp. |
| **uid** | Links to conn.log. |
| **id.orig_h / id.resp_h** | Client IP / DNS server IP. |
| **query** | The domain that was queried (e.g. evil-c2.com). |
| **qtype** | Query type: A, AAAA, NS, MX, TXT, etc. |
| **rcode** | Response code: NOERROR, NXDOMAIN, etc. |
| **answers** | The resolved IP(s) or records returned. |

**Why it matters:** For C2, phishing, or recon you often search **dns.log** by **query** (domain) or **id.orig_h** (which internal host asked for that domain). “Did any host ever resolve this known-bad domain?” is a standard hunt.

### Using zeek-cut to pull columns

**zeek-cut** (or **bro-cut** on older installs) reads Zeek’s tab-delimited logs and prints **only the columns you ask for**. That keeps output readable and scriptable.

**Basic usage:** `cat conn.log | zeek-cut [options] field1 field2 ...`

**Useful options:**

- **-d** — Convert **ts** to human-readable time.
- **-C** — Print the **header line** (field names) so you know the column order.
- **-F ','** — Use comma (or another char) as separator instead of tab.

**Examples:**

```bash
# Show timestamp (readable), originator IP, responder IP, responder port, duration
cat conn.log | zeek-cut -d ts id.orig_h id.resp_h id.resp_p duration

# Same but only for a specific internal host (e.g. 10.0.1.50)
cat conn.log | zeek-cut -d ts id.orig_h id.resp_h id.resp_p proto duration | awk '$2 == "10.0.1.50"'

# All connections TO or FROM a suspicious IP (1.2.3.4)
cat conn.log | zeek-cut -d ts id.orig_h id.orig_p id.resp_h id.resp_p proto conn_state | grep "1.2.3.4"

# DNS: who asked for what? (query, client IP, answers)
cat dns.log | zeek-cut -d ts id.orig_h query qtype answers
```

**If your Zeek logs are JSON** (e.g. `conn.log` as JSON), use **jq** instead:

```bash
# All connections where responder IP is 1.2.3.4
jq -r 'select(.id.resp_h == "1.2.3.4" or .id.orig_h == "1.2.3.4") | "\(.ts) \(.id.orig_h) \(.id.resp_h) \(.id.resp_p)"' conn.log
```

**Compressed logs:** Zeek often rotates and compresses; use **zcat** or **zgrep**:

```bash
zcat conn.log.gz | zeek-cut -d ts id.orig_h id.resp_h id.resp_p | grep "1.2.3.4"
```

---

## Detection and alerting (with examples)

**Detection** turns raw data into **actionable alerts**. As a blue teamer you **design rules** and **tune** them so real threats surface and **false positives** don’t flood the queue.

**Network-focused use cases:**

- **Reconnaissance** — Bulk port scans, host discovery, DNS enumeration. Detect: many ports or hosts probed from one source in a short window; unusual DNS query volume or AXFR.
- **Exploitation** — Known exploit signatures (Snort/Suricata); anomalous traffic to sensitive ports (SMB, RDP) from unexpected sources.
- **C2 (command and control)** — Beaconing (regular outbound to same IP/domain); DNS tunneling; connections to known-bad IPs/domains from threat intel.
- **Lateral movement** — Internal host scanning; RDP/SMB from workstations to many hosts; auth from unexpected sources.
- **Data exfiltration** — Large or unusual outbound flows to the internet; connections to cloud storage or unknown IPs from sensitive segments.

**Example: Suricata rule for port scan detection**

Suricata (and Snort) rules have a **header** (protocol, IPs, ports, direction) and **options** (msg, flow, content, etc.). A simple “many ports in short time” style detection might look like this (conceptually; exact syntax depends on your Suricata version and rule set):

```
alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"Possible port scan"; flow:stateless; threshold:type threshold, track by_src, count 20, seconds 60; classtype:network-scan; sid:1000001; rev:1;)
```

**What this does:** Alerts when a single **source** (e.g. internal IP) tries to connect to **20 or more different destination ports** within **60 seconds**. That’s a strong signal of a port scan. You’d put **$HOME_NET** and **$EXTERNAL_NET** in your Suricata config (your internal subnets vs “everyone else”).

**Tuning:** Start with **high-fidelity** rules (e.g. known C2). Add **behavioral** rules (e.g. “first time this internal IP talked to this country”) and **tune** thresholds so normal business traffic doesn’t trigger. Document **why** each rule exists and **what to do** when it fires (runbook). NIDS and Snort in more depth, plus WAF and baselines, are in the **NIDS & identity** file in this repo; Zeek and Suricata deployment are in the **Security monitoring** section of the observability area.

---

## Incident response: step-by-step with commands

When an **incident** is declared (alert, breach report, or hunt finding), the **network** is often involved. Below is a **practical** flow: **identify** → **contain** → **investigate** → **eradicate** → **recover**, with **commands** you can run.

### 1. Identify — Confirm the incident

**Goal:** Make sure the alert or report is **real** (true positive). Use logs and flow to verify: “Did this host really talk to that IP? When? How much?”

**Commands:**

```bash
# Zeek conn.log: all connections involving the suspicious IP (e.g. 1.2.3.4)
grep "1.2.3.4" conn.log
# Or with zeek-cut for readability:
cat conn.log | zeek-cut -d ts id.orig_h id.resp_h id.resp_p proto duration | grep "1.2.3.4"

# Which internal hosts talked to 1.2.3.4? (originators only)
cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p | grep "1.2.3.4" | awk '{print $1}' | sort -u
```

If you have **threat intel** (e.g. “IP 1.2.3.4 is C2”), this confirms **which of your hosts** contacted it. That’s your **containment list**.

### 2. Contain — Limit damage

**Goal:** Stop further harm: block the malicious IP so no one else can reach it, and **isolate** the compromised host(s) so they can’t spread or keep talking to C2.

**Block the malicious IP (Linux host firewall with iptables):**

```bash
# Block all traffic TO and FROM 1.2.3.4 (replace with real IOC)
sudo iptables -A OUTPUT -d 1.2.3.4 -j DROP
sudo iptables -A INPUT -s 1.2.3.4 -j DROP
```

**What you’re doing:** **-A OUTPUT** appends a rule to the OUTPUT chain: “any packet **destined** for 1.2.3.4, **DROP** it.” **-A INPUT** does the same for packets **from** 1.2.3.4. The host will no longer send to or receive from that IP.

**Optional but recommended: log before drop** so you have a record of who tried to connect:

```bash
sudo iptables -I OUTPUT 1 -d 1.2.3.4 -j LOG --log-prefix "BLOCK-OUT: "
sudo iptables -I OUTPUT 2 -d 1.2.3.4 -j DROP
```

**Persistence:** iptables rules are **lost on reboot** unless you save them. On Debian/Ubuntu: `sudo netfilter-persistent save` or `sudo iptables-save > /etc/iptables/rules.v4`. On RHEL/CentOS: `sudo service iptables save` (if using iptables-service).

**Isolate the host:** Put the compromised machine in a **quarantine VLAN** or **segment** with no internet and no access to critical systems. That’s usually done on the **switch** or **firewall** (change VLAN, or add a deny rule for that host’s IP). We don’t show switch config here; the key idea is “this host can’t talk to the rest of the network or the internet until we’ve cleaned it.”

### 3. Investigate — Gather evidence

**Goal:** Understand **what** happened: what ports, what protocols, and if possible **what data** was sent. Use Zeek logs first; if you need payloads, use **tcpdump** (or Wireshark) to capture traffic for that host.

**Capture traffic for a specific host (evidence):**

```bash
# Capture 5 minutes of traffic to/from 10.0.1.50; save to file (adjust interface)
sudo timeout 300 tcpdump -i eth0 -w investigation_10.0.1.50.pcap host 10.0.1.50
```

**What you’re doing:** **-i eth0** = use interface eth0; **-w file** = write raw packets to a PCAP file; **host 10.0.1.50** = only packets to or from that IP. **timeout 300** stops after 5 minutes so the disk doesn’t fill. Analyze later with `tcpdump -r investigation_10.0.1.50.pcap` or Wireshark.

**Filter an existing PCAP by IP and port:**

```bash
# Read a capture and show only packets involving 10.0.1.50 and port 443
tcpdump -r investigation.pcap -n 'host 10.0.1.50 and port 443'
```

### 4. Eradicate and recover

**Eradicate:** Remove the cause (malware, weak creds, misconfig). From the **network** side: ensure no lingering backdoors (unexpected listeners, tunnels); **re-image** or rebuild hosts if needed; **patch** and **harden** so the same vector can’t be reused.

**Recover:** Restore services and **monitor** for return of the threat. Re-enable isolated hosts only after they’re clean. **Document** what happened and update **runbooks** and **detection**. Incident workflows and troubleshooting methodology are also described in the **Network operations** file in the observability area of this repo.

---

## Hardening and security baselines

**Hardening** reduces **attack surface**. **Security baselines** are standard **hardened** configs (and sometimes compliance checklists) applied consistently.

**Network hardening (summary):**

- **Segment** — Separate user, server, and management networks. Use **firewalls** and **ACLs** (or cloud SGs/NACLs). Firewall types and zone-based design are in the **Firewalls & AAA** file in this repo.
- **Least privilege** — Allow only the **ports and IPs** that are needed. Block by default; allow by exception.
- **Harden devices** — Disable unused services (Telnet, HTTP admin); strong auth (SSH keys, AAA with TACACS+/RADIUS); **patch** and **upgrade** firmware. AAA and 802.1X are in **Firewalls & AAA** in this repo.
- **L2/L3 controls** — **Port security**, **DHCP snooping**, **DAI**, **BPDU guard** to mitigate L2 attacks. Full list of L2/L3 attacks and mitigations is in the **Attacks & mitigations** file in this repo.
- **Encryption** — TLS for management; IPSec or WireGuard for VPNs. **Encryption & TLS** and **IPSec & VPNs** in this repo cover both.

**Baselines and audits** — Define a baseline (e.g. “no Telnet; SSH only; these ACLs”) and **audit** periodically (manual or automation) to find drift. Security baselines and audits are also covered in **NIDS & identity** in this repo.

---

## Threat intelligence and IOCs

**Threat intelligence** is **information about threats** (actors, campaigns, TTPs, IOCs) that defenders use to **detect** and **block** known-bad activity.

**IOCs (Indicators of Compromise):**

- **IP addresses** — Malicious C2, scanners, phishing hosts. Block at firewall; search flow and Zeek conn.log.
- **Domains** — Malicious or phishing domains. Block at DNS or proxy; search Zeek dns.log and HTTP logs.
- **URLs** — Phishing or malware download URLs. Match in HTTP/proxy logs.
- **Hashes** — File hashes (malware). Often used on **endpoint** (EDR); still useful for “this hash was seen in this transfer.”

**Feeds:** Many teams subscribe to **threat intel feeds** (e.g. abuse.ch, MISP, commercial) that publish IP/domain/hash lists. **Integrate** into SIEM and IDS: automatic **blocklist** or **alert** when traffic matches.

**Defensive use:** **Ingest** IOCs into SIEM/IDS; **run historical searches** (“did we ever see this IP?”) for **incident investigation** and **hunting**. **Triage** feed quality to avoid blocking legitimate services.

**Hands-on: search logs for an IOC (e.g. IP):**

```bash
# Have we ever seen this IP in our Zeek conn.log?
grep "1.2.3.4" conn.log
# Or across all rotated logs:
zgrep "1.2.3.4" /path/to/zeek/logs/*/conn.log.gz
```

---

## Log management and investigation

**Log management** — **Collect** logs from network devices (firewalls, routers, Zeek, Suricata, DNS) into a **central** store (SIEM or log platform). **Retain** per policy (often 30–90 days). **Index** so you can search by IP, domain, user, or time.

**Investigation** — When an **alert** fires or you’re **hunting**, you **query** logs to answer: **Who** (IP, host, user) did **what** (connection, DNS query, HTTP request) **when** and **to whom** (destination IP/domain)?

**Typical flow:** Alert says “internal host 10.0.1.50 talked to known-bad IP 1.2.3.4.” You: (1) Search **Zeek conn.log** (and dns.log, http.log) for those IPs—commands are in this document. (2) Check **firewall** logs: was this allowed? (3) Check **flow**: volume and duration. (4) If you have **PCAP**, extract the stream for that pair (tcpdump -r, or Wireshark). (5) **Contain** (block 1.2.3.4, isolate 10.0.1.50) and **eradicate** (clean or rebuild host). Security monitoring and incident workflows are also described in the observability area of this repo.

---

## Hands-on: defensive workflows (copy-paste)

These are **defensive** actions you might take on the **network**: investigating an indicator, blocking a malicious IP, or checking what a host talked to. Use only in environments you’re **authorized** to operate.

### 1. Search Zeek conn.log for a suspicious IP

**What you’re doing:** Checking whether any internal host has talked to a known-bad or suspicious IP.

```bash
# Plain grep
grep "1.2.3.4" conn.log

# With zeek-cut (readable columns: time, orig, resp, port, duration)
cat conn.log | zeek-cut -d ts id.orig_h id.resp_h id.resp_p duration | grep "1.2.3.4"

# If logs are JSON
jq 'select(.id.resp_h == "1.2.3.4" or .id.orig_h == "1.2.3.4")' conn.log
```

### 2. List all destinations a host has talked to

**What you’re doing:** For a given internal IP (e.g. 10.0.1.50), list **unique responder IP:port** so you can see “where did this host connect?”

```bash
cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p | awk '$1 == "10.0.1.50" {print $2, $3}' | sort -u
```

### 3. Search DNS logs for a domain (e.g. C2 or phishing)

**What you’re doing:** “Which internal hosts ever resolved this domain?”

```bash
cat dns.log | zeek-cut -d ts id.orig_h query answers | grep "evil-domain.com"
```

### 4. Block an IP at the host firewall (containment)

**What you’re doing:** Adding a **deny** rule so no further traffic goes to or from that IP.

```bash
# Block outbound and inbound to/from 1.2.3.4
sudo iptables -A OUTPUT -d 1.2.3.4 -j DROP
sudo iptables -A INPUT -s 1.2.3.4 -j DROP

# Verify rules
sudo iptables -L -v -n
```

On **Cisco ASA/IOS** you’d add an ACL line denying that host. In the **cloud**, add the IP to a **blocklist** or **security group / NACL** rule.

### 5. Capture traffic for a specific host (evidence)

**What you’re doing:** Recording **PCAP** for a host under investigation. Use a **span/tap** or run tcpdump on the host if authorized.

```bash
# 5 minutes of traffic to/from 10.0.1.50 (adjust interface)
sudo timeout 300 tcpdump -i eth0 -w investigation.pcap host 10.0.1.50
```

### 6. Verify a firewall block

**What you’re doing:** Confirming that traffic to the blocked IP is **actually dropped**. From an internal host, try to reach the IP (e.g. curl or nc); connection should fail. Then check **firewall logs** (or iptables LOG) to see the deny entry.

```bash
# From a host that should be blocking 1.2.3.4:
curl -v --connect-timeout 5 http://1.2.3.4/
# Expect: connection timeout or failure. Then:
sudo iptables -L -v -n | head -20
```

---

## Further reading (optional)

Everything you need to use this material is **in this repository**. The links below are for optional deeper detail or external references.

- **In this repo:** [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md) (NIDS, Snort, baselines, audits); [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) (firewalls, AAA); [4_Attacks_Mitigations](./4_Attacks_Mitigations.md) (what you’re defending against); [8_Reconnaissance_Offensive](./8_Reconnaissance_Offensive.md) (recon and scanning from defender view); observability area (Security monitoring, Network operations, Packet capture).
- **External (optional):** Zeek conn.log/dns.log docs; zeek-cut; Suricata rule format; iptables man page.
