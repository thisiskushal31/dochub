# Reconnaissance & Network Offensive Basics

Reconnaissance (passive and active), scanning, and network-level offensive measures from a **defensive and awareness** perspective. Understanding what attackers do helps you **harden**, **monitor**, and **respond**. This document is a **deep dive**: we walk through each phase like a professor in a lab—what you run, what each flag does, and what you’re actually seeing. **Only run these techniques on systems you own or have explicit written authorization to test.** Unauthorized scanning can be illegal and can trigger IDS alerts or crash fragile systems.

## Table of Contents

- [Why this belongs in network security](#why-this-belongs-in-network-security)
- [Penetration testing workflow (network perspective)](#penetration-testing-workflow-network-perspective)
- [Reconnaissance: passive and active](#reconnaissance-passive-and-active)
- [DNS and domain enumeration (deep dive)](#dns-and-domain-enumeration-deep-dive)
- [WHOIS and public registries (deep dive)](#whois-and-public-registries-deep-dive)
- [Network and host scanning (deep dive)](#network-and-host-scanning-deep-dive)
- [Service and OS detection (deep dive)](#service-and-os-detection-deep-dive)
- [Output, timing, and saving results](#output-timing-and-saving-results)
- [Other network-level offensive measures](#other-network-level-offensive-measures)
- [Defensive perspective: how to defend and detect](#defensive-perspective-how-to-defend-and-detect)
- [References](#references)

---

## Why this belongs in network security

**Offensive hacking** (ethical penetration testing, red team, or threat modelling) often follows a **lifecycle**: **reconnaissance** → **scanning** → **gaining access** → **maintaining access** → **covering tracks**. The **network** is central: attackers **discover** hosts and services, **map** the perimeter, and **exploit** weak or misconfigured services.

As a **network engineer** or **security practitioner**, you need to know:

- **What** reconnaissance and scanning look like in practice—the actual commands and traffic patterns.
- **How** to **defend** (reduce exposure, segment, monitor) and **detect** (IDS/IPS, flow analysis, log correlation).
- **When** these activities are **authorized** (e.g. internal pentest, bug bounty scope) vs **malicious**.

This file is a **practical deep dive**: we treat you like a student in a lab. We show you the commands, explain each option, and interpret the output. All essential content is **in this document** so you don’t need to leave the repository. L1/L2/L3 attacks (e.g. ARP poisoning, DNS spoofing, CAM table overflow) and NIDS/DoS are covered in other security files in this repo; we focus here on recon and scanning from a network perspective.

---

## Penetration testing workflow (network perspective)

A **penetration tester** (or red team) typically follows a **structured methodology**. From a **network** perspective, here is how the phases look and what you, as a defender or as an authorized tester, need to know. Everything below is framed around **what happens on the network** and **what traffic and logs look like**.

### 1. Planning and scoping

**What happens:** Scope (IP ranges, domains, in-scope vs out-of-scope), rules of engagement, and **written authorization** are agreed. No network activity yet.

**Network angle:** Scope defines **which IPs and hosts** you are allowed to scan and test. As a defender, your **monitoring** should treat in-scope pentest traffic differently from unknown scanners (e.g. exclude test IPs from automatic blocking, or tag them in the SIEM).

### 2. Reconnaissance (intelligence gathering)

**What happens:** Gather information **without** (passive) or **with** (active) touching the target. Passive: WHOIS, DNS from public resolvers, Shodan, search engines, certificate transparency. Active: DNS zone transfers, subdomain enumeration, port scans (covered in detail later in this document).

**Network angle:** Passive recon is hard to see on your side (the target isn’t probed by you). Active recon **does** generate traffic: DNS queries to your nameservers, SYN packets to your hosts. **IDS and flow** can detect bulk DNS (e.g. AXFR, subdomain brute-force) and port scans (many ports or hosts from one source in short time). This document gives you the **same commands** a tester uses so you can interpret that traffic.

### 3. Scanning and enumeration

**What happens:** Host discovery (who is up?), port scanning (which ports are open?), service and version detection (-sV), OS detection (-O). Optional: vulnerability scanning (e.g. Nessus, OpenVAS) and NSE scripts.

**Network angle:** This is the **noisiest** phase on the wire. You see: many SYNs to many ports, banner grabs (TCP connections that read a few bytes then close), and sometimes vulnerability-scanner payloads. **Defense:** Segment; minimize open ports; use IDS/IPS and flow to detect scan patterns (e.g. “20+ ports from one IP in 60 seconds”). The exact Nmap and dig commands are in the sections below.

### 4. Gaining access (network view)

**What happens:** The tester (or attacker) uses the information from recon and scanning to **exploit** a service (e.g. weak SSH creds, vulnerable web app, misconfigured service). From the **network** you don’t see “exploitation” as a single event; you see **new connections** (e.g. SSH from an unexpected IP, HTTP requests to an admin path, or a reverse shell connection).

**Network angle:** **Detect** by correlating: new **outbound** connections from internal hosts (e.g. reverse shell to the internet), **auth failures** (SSH, RDP, web login), and **anomalous** traffic to sensitive ports (SMB, RDP, database). L2/L3 attacks (ARP poisoning, DNS spoofing) that enable credential capture or MitM are described in the **Attacks & mitigations** file in this repo; the **network** impact is: traffic redirected or altered, or credentials captured on the wire if unencrypted.

### 5. Maintaining access (network view)

**What happens:** Attacker may install **persistence**: backdoors, C2 beacons, scheduled tasks. On the **network** this often looks like **periodic outbound** connections (beaconing) to a fixed IP or domain, or **unexpected listeners** on a host.

**Network angle:** **Detect** beaconing (same internal IP talking to the same external IP/domain on a regular interval), **new listening ports** on a host (netstat, ss), and **DNS** queries to known-bad or dynamic-DNS domains. Flow and Zeek conn.log/dns.log are the main data sources; see the **Blue team & defensive** file in this repo for how to search them.

### 6. Covering tracks and reporting

**What happens:** Attacker may clear logs or tamper with evidence; in an **ethical** pentest, the tester **documents** everything and produces a report. From the **network** you may see **log deletion** (fewer events from a host) or no special traffic.

**Network angle:** Ensure **centralized logging** (logs shipped off the host) so that local tampering doesn’t erase history. **Report** from the tester should list findings and **recommendations**; many of those will be network-related (close ports, segment, harden DNS, add detection for scan and C2).

**Summary for defenders:** The pen-test lifecycle (recon → scan → exploit → persist → report) is visible on the **network** as: recon/scan traffic first, then new or anomalous connections, then periodic C2-like traffic. Your job is to **reduce exposure** (firewall, segment, harden), **monitor** (IDS, flow, Zeek), and **respond** (incident response, containment). The rest of this document gives you the **recon and scanning** detail; the **Blue team** document gives you the **response** workflows.

---

## Reconnaissance: passive and active

**Reconnaissance (recon)** is the **information-gathering** phase before deeper attacks. Think of it as “homework” before the exam: the more an attacker knows about your domains, IPs, and open services, the better they can choose where to focus.

**Passive recon** uses **publicly available** information and **no direct interaction** with your infrastructure. Examples: **WHOIS**, **DNS** lookups from public resolvers (e.g. 8.8.8.8), **search engines**, **Shodan/Censys**, **SSL certificate transparency logs**, **job postings**, **social media**. The target usually **cannot see** who is querying; it’s hard to detect. Assume that passive recon has **already** happened—your domain and IP ranges are often public.

**Active recon** means **direct interaction** with the target: **port scans**, **banner grabbing**, **DNS zone transfer** attempts, **subdomain brute-force**, **vulnerability scans**. The target **can** see this (firewall logs, IDS, flow data). Defenders should **monitor** for active recon to catch early-stage attacks.

---

## DNS and domain enumeration (deep dive)

**Goal (attacker):** Discover **subdomains**, **hostnames**, and **IP ranges** tied to an organization to **expand attack surface**—e.g. forgotten dev/staging servers, old DNS records, or mail/VPN endpoints.

**Goal (you as defender):** Understand exactly what an attacker can learn with a few commands, so you can **minimize** what you expose and **detect** when someone is enumerating you.

### What you’re really doing with `dig`

`dig` (domain information groper) sends **DNS queries** to a nameserver and prints the **response**. You’re not “hacking” the server; you’re asking it the same questions any resolver would. The difference is you’re doing it **systematically** to map everything.

**Basic syntax:** `dig [@server] name [type] [+options]`

- **@server** — Which nameserver to ask. If you omit it, your system’s default resolver is used (e.g. your ISP or 8.8.8.8).
- **name** — The domain or hostname (e.g. `example.com`, `mail.example.com`).
- **type** — The record type: **A** (IPv4), **AAAA** (IPv6), **NS** (nameservers), **MX** (mail), **TXT**, **ANY**, etc.
- **+short** — Only print the answer section (one line per record). Very useful for scripting.
- **+noall +answer** — Suppress everything except the answer lines (clean output).

### Step-by-step: mapping a domain

**1. Get the nameservers.**  
You need to know *who* is authoritative for the domain. Then you can query *them* directly (sometimes you get more or different data than from a cached resolver).

```bash
dig example.com NS +short
# Example output:
# a.iana-servers.net.
# b.iana-servers.net.
```

**2. Get the A record (IPv4).**  
“What IP does this hostname resolve to?”

```bash
dig example.com A +short
# 93.184.216.34
```

**3. Get AAAA (IPv6), if you care about dual-stack.**

```bash
dig example.com AAAA +short
```

**4. Get MX (mail servers).**  
Reveals where email is handled; often a valuable target.

```bash
dig example.com MX +short
# 0 .
# 10 mail.example.com.
```

**5. Get TXT records.**  
Often used for SPF, DKIM, or verification strings; sometimes leak subdomains or info.

```bash
dig example.com TXT +short
```

**6. Ask for “ANY” (all record types).**  
Some servers return multiple types in one go. Note: many modern resolvers restrict ANY for abuse reasons; you may get a reduced set.

```bash
dig example.com ANY +noall +answer
```

**7. Zone transfer (AXFR)—the big one.**  
A **zone transfer** asks the nameserver: “Give me your **entire** zone file.” That’s the list of *all* hostnames and records the server knows for that domain. If the server is **misconfigured** and allows AXFR to anyone, you get a full map: internal hostnames, dev/staging servers, mail, VPN, etc.

```bash
# First get the nameserver
dig example.com NS +short

# Then ask THAT nameserver for a zone transfer (replace with real NS)
dig axfr @a.iana-servers.net example.com
```

- If you see **many lines** of records, the zone transfer **succeeded**—that’s a misconfiguration.
- If you see **transfer failed** or a **refused** response, the server correctly **rejected** the request.

**Defensive takeaway:** Restrict **zone transfers** to known secondaries only. Monitor for **AXFR** requests from unexpected IPs; they’re a strong sign of recon.

**8. Reverse DNS (PTR).**  
Given an IP, “what hostname points to it?” Often reveals internal naming (e.g. `mail.corp.com`, `vpn.corp.com`).

```bash
dig -x 93.184.216.34 +short
# 93.184.216.34.in-addr.arpa. might return something like mail.example.com.
```

**9. Subdomain checks (manual).**  
Try common names; in real engagements, people use wordlists and tools (Amass, Sublist3r, Subfinder).

```bash
dig www.example.com A +short
dig mail.example.com A +short
dig vpn.example.com A +short
dig dev.example.com A +short
dig staging.example.com A +short
```

### Using a specific resolver

Sometimes you want to **avoid** your local cache and ask an **authoritative** server or a **public** resolver to see what the “outside world” sees.

```bash
# Query Google DNS
dig @8.8.8.8 example.com A +short

# Query the domain’s own nameserver (after you got it from NS lookup)
dig @a.iana-servers.net example.com A +short
```

### Quick reference: `dig` one-liners

| What you want | Command |
|---------------|--------|
| A record (short) | `dig example.com A +short` |
| Nameservers | `dig example.com NS +short` |
| Mail servers | `dig example.com MX +short` |
| Zone transfer attempt | `dig axfr @ns1.example.com example.com` |
| Reverse (IP → name) | `dig -x 93.184.216.34 +short` |
| All types (answer only) | `dig example.com ANY +noall +answer` |

**Defensive:** Minimize public DNS records; don’t expose internal hostnames. Restrict AXFR. Monitor for bulk DNS queries or AXFR from unknown sources. DNS spoofing (and how to mitigate it with DNSSEC, secure resolvers) is covered in the **Attacks & mitigations** file in this repo.

---

## WHOIS and public registries (deep dive)

**Goal (attacker):** Get **registrant** info, **name servers**, **creation/expiry dates**, and **IP allocations** (which org owns which IP range). This helps map ownership and find more targets.

**Goal (you):** Understand how much is **already public**. There’s no “hack” here—WHOIS is a public protocol. Use **privacy/proxy** registration where possible and keep **abuse contact** valid so others can report issues.

### Domain WHOIS

```bash
whois example.com
```

**What you’ll see (typical):**

- **Registrar** — Who sold the domain (e.g. GoDaddy, Namecheap).
- **Creation / Expiration date** — When the domain was registered and when it expires (expired domains sometimes get dropped and re-registered by attackers).
- **Name Server** — The DNS servers for the domain (same as `dig NS` but in one place).
- **Registrant / Admin / Tech** — Contact names, org, email. Many registrars offer “WHOIS privacy” so these show a proxy.

**Why it matters for attackers:** Registrant org name and name servers can point to **other domains** or **hosting providers**; creation dates can hint at “new” or “forgotten” assets.

### IP WHOIS (ARIN, RIPE, APNIC, etc.)

```bash
whois 93.184.216.34
```

**What you’ll see:**

- **NetRange / CIDR** — The block this IP belongs to (e.g. 93.184.216.0/24).
- **Organization** — Company or ISP that owns the block.
- **Abuse contact** — Email for reporting abuse. As a defender, **keep this valid** so you get abuse reports.
- **Country** — Often present for geo and compliance.

**Why it matters:** Attackers use this to **map your IP space** (allocation size, org name) and to find **other IPs in the same netblock** to scan.

**Defensive:** Assume WHOIS data is public. Use privacy where available. Maintain a valid abuse contact and **monitor** it.

---

## Network and host scanning (deep dive)

**Goal (attacker):** Discover **live hosts** and **open ports** to identify **services** and **potential entry points**.

**Goal (you):** Know exactly what Nmap is doing under the hood so you can **interpret** results, **defend** (firewall, segment, minimize ports), and **detect** (IDS rules for port scans, flow anomalies).

### Host discovery: “Who is up?”

Before scanning ports, you often want to know **which IPs are alive**. Nmap can do **host discovery only** (no port scan) with **-sn**. Historically this was “ping sweep”; today **-sn** uses ICMP echo, TCP SYN to port 443, TCP SYN to port 80, and ICMP timestamp by default (depending on privileges).

**What you’re doing:** Sending a small set of probes to each IP. If you get a response, the host is considered “up.”

```bash
# Discover hosts in 192.168.1.0/24 (no port scan). Use only on networks you’re allowed to scan.
nmap -sn 192.168.1.0/24
```

**Example output:**

```
Nmap scan report for 192.168.1.1
Host is up (0.0020s latency).
Nmap scan report for 192.168.1.50
Host is up (0.0015s latency).
```

**-sn** is **faster** and **less noisy** than a full port scan. Defenders often alert on “many hosts probed in a short time” (sweep) or “one host probing many ports” (port scan).

### Port scan types (what’s really happening)

**TCP Connect scan (-sT)**  
Nmap asks the OS to perform a **full TCP 3-way handshake** (SYN → SYN-ACK → ACK) to each target port. If the connection succeeds, the port is **open**. No root needed, but **every open port** shows up in the target’s connection logs (e.g. netstat, ss). So it’s **easy to detect**.

```bash
nmap -sT 192.168.1.1
# Scans default set of ~1000 common ports. Add -p 80,443 for just those.
```

**TCP SYN scan (-sS, “half-open”)**  
Nmap sends a **SYN** packet; if it gets **SYN-ACK**, it considers the port open and sends **RST** to tear down without completing the handshake. So the target sees **SYN** and **RST**, and many stacks don’t log “completed” connections for that. **Requires root** (to send raw packets). Often called “stealth” (less so today; IDS still see SYN probes).

```bash
sudo nmap -sS 192.168.1.1
```

**UDP scan (-sU)**  
UDP has no handshake. Nmap sends a UDP packet; “no response” can mean **open** (service didn’t reply) or **filtered** (firewall dropped it). So UDP scanning is **slower** and **noisier** (you may need to retry). Use **-F** for “fast” (fewer ports) to keep it practical.

```bash
sudo nmap -sU -F 192.168.1.1
```

**Why it matters:** DNS (53), DHCP (67/68), SNMP (161), and many custom apps use UDP. As a defender, expect UDP probes in recon; monitor and restrict UDP to what’s needed.

### Port selection

- **Default** — Nmap scans a **list of ~1000 common ports**.
- **-F (fast)** — About **100** most common ports.
- **-p 80,443,22** — Only those ports.
- **-p 1-1000** — Range.
- **--top-ports 100** — Top 100 by frequency in the Nmap database.

```bash
# Only web and SSH
nmap -p 80,443,22 192.168.1.1

# Top 100 ports, with service/version detection (see below)
sudo nmap -sS --top-ports 100 -sV 192.168.1.1
```

### Putting it together: a realistic recon scan

**What you’re doing:** Host discovery, then SYN scan on top ports, then **service/version** detection. **-sV** makes Nmap connect and read **banners** (e.g. “Apache/2.4.41”) to identify software. This is **noisier** but very informative.

```bash
# 1) Find live hosts (replace with your allowed range)
nmap -sn 192.168.1.0/24 -oG - | grep "Up" | cut -d" " -f2 > hosts.txt

# 2) Scan those hosts: SYN, top 100 ports, service detection, reasonable timing
sudo nmap -sS --top-ports 100 -sV -iL hosts.txt -oA scan_result
```

**-oA scan_result** writes **normal**, **XML**, and **grepable** files: `scan_result.nmap`, `scan_result.xml`, `scan_result.gnmap`. You can re-use these for reports or further tooling.

**Defensive:** Segment networks; firewall to allow only required ports. Monitor for **port scans** (many ports or many hosts in short time) via IDS/IPS (e.g. Snort, Suricata) or flow data; the **NIDS & identity** and **Security monitoring** files in this repo describe detection and Zeek/Suricata in more detail.

---

## Service and OS detection (deep dive)

**Goal (attacker):** Identify **service type and version** (e.g. Apache 2.4.41, OpenSSH 8.2) and **OS** (e.g. Linux 3.x, Windows 10) to choose **exploits** or **default creds**.

**How it works:** **Banner grabbing** = connect and read the first response (many services send a version string). **Probes** = send malformed or specific packets and match responses against a **fingerprint** database. Nmap’s **-sV** (version) and **-O** (OS detection) do exactly that.

### Service version (-sV)

Nmap connects to open ports and tries to **parse the banner** or send probes; it then matches the response to **nmap-service-probes**. You get lines like:

```
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
80/tcp   open  http    nginx 1.18.0
```

**Command:**

```bash
sudo nmap -sV 192.168.1.1
```

Combine with a port list to save time:

```bash
sudo nmap -sV -p 22,80,443,3306 192.168.1.1
```

### OS detection (-O)

Nmap sends **TCP/IP stack probes** (e.g. TCP options, window size, TTL) and compares responses to **nmap-os-db**. It often needs **at least one open and one closed** port to guess reliably. **Requires root.**

```bash
sudo nmap -O 192.168.1.1
```

**Combined (noisy but very informative):**

```bash
sudo nmap -sV -O 192.168.1.1
```

**Defensive:** Harden services (disable or obscure version banners where possible). Patch and minimize exposed services. Detect version/OS probing via IDS (e.g. Suricata/Snort rules for Nmap).

---

## Output, timing, and saving results

### Saving output

- **-oN file.nmap** — **Normal** (human-readable, like the screen).
- **-oX file.xml** — **XML** (for parsing, import into tools).
- **-oG file.gnmap** — **Grepable** (one line per host, easy for `grep`/scripts).
- **-oA base** — **All three** (base.nmap, base.xml, base.gnmap).

```bash
sudo nmap -sS -sV -oA my_scan 192.168.1.0/24
# Creates my_scan.nmap, my_scan.xml, my_scan.gnmap
```

### Timing (-T0 to -T5)

Nmap has **timing templates** that control how **aggressive** the scan is (delays between probes, retries, etc.).

- **-T2 (Polite)** — Slower; less likely to overload fragile systems or trigger rate-based IDS. Good for **sensitive** or **legacy** environments.
- **-T3 (Normal)** — Default. Balanced.
- **-T4 (Aggressive)** — Faster; more common in internal pentests.
- **-T5 (Insane)** — Very fast; high risk of **dropping** packets or **triggering** IDS.

**Practical advice:** Use **-T3** by default. Use **-T2** when the target is fragile or you want to be stealthier. Avoid **-T5** unless you have a good reason.

```bash
sudo nmap -sS -T3 -p 80,443 192.168.1.1
```

### NSE scripts (brief)

Nmap **Scripting Engine (NSE)** runs **Lua scripts** that can do things like: check for vulnerable SSL, enumerate HTTP paths, detect SMB versions. **-sC** runs the **default** set of safe scripts (equivalent to `--script=default`).

```bash
# Default scripts (often “safe” category)
sudo nmap -sC -sV -p 80,443 192.168.1.1

# One specific script
sudo nmap --script http-title -p 80 192.168.1.1
```

**Defensive:** Such scripts generate **additional traffic** and can be **noisy**. IDS can detect known NSE patterns; monitor for them.

---

## Other network-level offensive measures

These are **additional** offensive actions that occur **on the network**; defences are covered elsewhere in this repo.

| Measure | What it is | Where to defend / detect |
|--------|------------|---------------------------|
| **Sniffing / packet capture** | Capture traffic on the wire (promiscuous mode or span/tap). Sees **unencrypted** traffic (HTTP, plain DNS). | Encrypt (TLS, IPSec); segment; restrict span/tap access. Packet capture for lawful investigation is covered in the **Packet capture** section of the observability area in this repo. |
| **Man-in-the-middle (MitM)** | Attacker between two parties; relay or alter traffic. Via **ARP poisoning**, **DNS spoofing**, **rogue AP**, or **BGP hijacking**. | Defences: 802.1X; DNSSEC; encryption and cert pinning. ARP, DNS, and ICMP redirect attacks and mitigations (DAI, DHCP snooping, etc.) are fully described in the **Attacks & mitigations** file in this repo. |
| **Session hijacking** | Steal or reuse **session token** (cookie, session ID). Can involve **sniffing** or **XSS**. | HTTPS; secure cookies (HttpOnly, Secure, SameSite); short session lifetime; WAF and monitoring (covered in **NIDS & identity** in this repo). |
| **Credential capture** | Capture **passwords** or **hashes** (on the wire if plaintext, or via **phishing**). | Encryption; MFA; avoid plaintext protocols; monitor auth failures. |
| **Lateral movement** | After initial access, attacker **scans** and **exploits** internal hosts. Same **recon and scanning** inside the network. | Segmentation; internal IDS; least privilege; L2/L3 hardening (port security, DHCP snooping, DAI, etc.) is in the **Attacks & mitigations** file in this repo. |

---

## Defensive perspective: how to defend and detect

All of the following can be done **within this repository**—the concepts and workflows are described in the security and observability files. You do not need to go elsewhere for the essentials.

- **Reduce attack surface** — Expose only necessary **ports** and **hosts**; use **firewalls** and **segmentation**. Firewall types, zone-based firewalls, and segmentation are covered in the **Firewalls & AAA** file in this repo.
- **Harden** — Patch, disable unused services, strong auth (802.1X, MFA), encryption (TLS, IPSec). **Encryption & TLS** and **IPSec & VPNs** in this repo cover TLS and VPNs; **Firewalls & AAA** covers 802.1X and AAA.
- **Monitor and detect** — **IDS/IPS** (Snort, Suricata), **flow data** (NetFlow), **logs** (auth, firewall, DNS). Tune alerts for **recon** (bulk DNS, AXFR, port scans) and **exploitation** patterns. **NIDS & identity** covers Snort and detection; **Security monitoring** in the observability area covers Zeek and Suricata.
- **Respond** — Have **incident response** and **threat hunting** workflows; use the same **recon and scanning** tools (with authorization) to **validate** and **hunt**. **Network operations** (observability) and **Blue team & defensive** in this repo describe incident workflows and containment (block IP, isolate host, search Zeek logs, tcpdump).

---

## Further reading (optional)

Everything you need to use this material is **in this repository**. The links below are for optional deeper detail or external references.

- **In this repo:** [4_Attacks_Mitigations](./4_Attacks_Mitigations.md) (L1–L3 attacks, DNS/ARP, mitigations); [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md) (Snort, WAF, baselines); [9_Blue_Team_Defensive](./9_Blue_Team_Defensive.md) (blue team, NSM, incident response); [observability/5_Security_Monitoring](../observability/5_Security_Monitoring.md) (Zeek, Suricata); [labs/3_Operational_Simulators_Tools](../labs/3_Operational_Simulators_Tools.md) (Nmap in labs).
- **External (optional):** Nmap docs (scan types, timing, output); Suricata rule format; DNS zone transfer guides.
