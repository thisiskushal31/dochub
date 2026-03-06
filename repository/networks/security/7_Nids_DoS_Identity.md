# NIDS/NIPS, DoS Types & Identity

[← Back to Security](./README.md)

Snort, DoS attack types, Zero Trust, WAF, rate limiting, baselines, audits.

## Table of Contents

- [Snort and NIDS](#snort-and-nids)
- [DoS attack types](#dos-attack-types)
- [Authentication](#authentication)
- [Zero Trust and identity](#zero-trust-and-identity)
- [Threat protection](#threat-protection)
- [Security baselines and audits](#security-baselines-and-audits)
- [References](#references)

---

## Snort and NIDS

**Snort** is an open-source **NIDS/NIPS** (Network Intrusion Detection/Prevention System). It inspects traffic against **rules** (signatures and protocol/flow conditions) and can **alert** (IDS) or **drop** (IPS). Source: Network-Security (BFreitas16).

- **Rule-based detection** — Rules describe patterns (e.g. suspicious payload, port scan, known exploit). When traffic matches, Snort logs the event and can generate **alerts**. Rules can be tuned for **DoS** patterns (e.g. SYN flood, ICMP flood) so that high rates or malformed packets trigger alerts.
- **Alerting for DoS** — Snort rules can detect DoS behaviors (e.g. threshold on SYN rate, ICMP rate, oversized ICMP). Alerts feed into a SIEM or dashboard for **incident response**. See [observability/5_Security_Monitoring](../observability/5_Security_Monitoring.md) for Zeek, Suricata, and SIEM; Suricata is a similar rule-based IDS/IPS.

**Hands-on: what you're doing when you run Snort**

From a **network security** perspective, you are running a **signature-based** NIDS/NIPS: Snort reads traffic (live or from a PCAP), matches it against **rules**, and **alerts** (or drops in IPS mode). You need a **config file** (e.g. `snort.lua` for Snort 3) and **rules** so Snort knows what to detect.

```bash
# Test config only. You are validating that Snort can load the config and rules.
snort -c /etc/snort/snort.lua -T

# Run on interface (live IDS). You are watching traffic and alerting on rule matches.
sudo snort -c /etc/snort/snort.lua -i eth0

# Run on a PCAP file (offline). You are replaying traffic to generate alerts.
sudo snort -c /etc/snort/snort.lua -r capture.pcap

# Use a specific rule file (e.g. for testing). -R = rule file.
sudo snort -c /etc/snort/snort.lua -R custom.rules -r capture.pcap
```

**What you're doing:** `-T` = test only; `-i eth0` = live capture on that interface; `-r file` = read PCAP (offline analysis). Alerts go to the console or to the log directory depending on config. See [observability/5_Security_Monitoring](../observability/5_Security_Monitoring.md) for Suricata (similar workflow) and Zeek (log-based).

---

## DoS attack types

The following DoS types are commonly described in security curricula and can be **detected** (e.g. by NIDS rules) and **mitigated** (rate limiting, filtering, hardening). Source: Network-Security (Snort – alerting DoS attacks), [3_Cybersecurity_Threats_Config](./3_Cybersecurity_Threats_Config.md), [5_Firewalls_Aaa](./5_Firewalls_Aaa.md).

| Type | Description | Detection / mitigation |
|------|-------------|------------------------|
| **ICMP flood** | Large volume of ICMP (e.g. ping) to exhaust bandwidth or host | Rate-limit ICMP at perimeter; NIDS threshold on ICMP rate |
| **SYN flood** | Many TCP SYNs with invalid/fake source IPs; server exhausts half-open connections | SYN cookies; reduce synwait-time; rate-limit SYNs; NIDS on SYN rate |
| **Ping of death** | ICMP packet **larger than** 65,535 bytes; can crash older stacks | Drop oversized packets at firewall; modern stacks often resilient |
| **Land attack** | Packet with **source IP = destination IP** (and same port); can confuse stack | Filter packets with src = dst |
| **HTTP flooding** | Many HTTP requests to exhaust server or application | WAF, rate limiting, CAPTCHA; scale application |
| **TCP reset attack** | Forged RST segments to tear down connections | Harder to mitigate; use encryption and integrity so RSTs can be validated |
| **Christmas tree** | TCP packet with many options set (flags); can stress parsing | Filter or normalize at perimeter |
| **UDP flood** | High volume of UDP to exhaust bandwidth or state | Rate-limit UDP; no state to exhaust on stateless services |
| **DNS flood** | High volume of DNS queries (often amplified) to exhaust resolver or bandwidth | Rate-limit; use DNS filtering; DNSSEC and hardened resolvers |
| **Smurf** | **Amplification**: send ICMP with **spoofed victim source IP** to broadcast; many hosts reply to victim | Disable directed broadcast; anti-spoofing (BCP 38) |

**DDoS** uses many sources (e.g. botnet); mitigation often involves **scrubbing** (upstream or cloud) and **rate limiting** at the edge. See [Threat protection](#threat-protection) and [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) (Defense against DoS).

---

## Authentication

**Authentication** verifies **identity** (“who are you?”) before granting access. In **networks**, it is used for **user/device** access (e.g. Wi‑Fi, VPN, admin login) and for **service-to-service** (e.g. mTLS, API keys).

- **Methods:** Passwords, **certificates**, **MFA** (multi-factor), **802.1X** (network access with RADIUS), **TACACS+/RADIUS** for device administration. See [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) (AAA, TACACS+, RADIUS, 802.1X).
- **Network authentication** — Device or user is verified before getting an IP (DHCP after 802.1X) or before accessing internal resources (VPN, firewall policy). Identity is then used for **authorization** (what you can do) and **accounting** (what you did).

---

## Zero Trust and identity

**Zero Trust** is a model where **no** user or device is trusted by default; access is **verified per request** based on **identity**, **context**, and **policy**.

- **Principles:** Verify explicitly; least privilege; assume breach; segment; encrypt. **Identity** (user, device, service) is central: every access decision uses identity and context (e.g. device posture, location, app).
- **Network implications:** **Microsegmentation** (firewall/identity at workload or segment level); **identity-aware** gateways and proxies; **continuous verification** (not “trust after first login”). **Service identity** (e.g. mTLS, workload certs) ensures services only talk to authorized peers. See [1_Overview_Perimeter](./1_Overview_Perimeter.md), [5_Firewalls_Aaa](./5_Firewalls_Aaa.md).

---

## Threat protection

- **WAF (Web Application Firewall)** — Sits in front of web apps; **filters** HTTP/HTTPS by rules (signatures, rate, geo, behavior). Blocks common web attacks (injection, XSS, some DDoS). Can be cloud or on-prem.
- **Rate limiting** — Caps **request rate** per client, IP, or API key to prevent abuse and **flooding**. Applied at LB, API gateway, or WAF. Complements DoS/DDoS mitigation.
- **DDoS mitigation** — **Scrubbing** (traffic diverted to scrubber, bad traffic dropped); **anycast** and **overcapacity**; **rate limiting** and **blacklisting** at edge; **SYN cookies** or similar for SYN flood. Large attacks often handled by **cloud DDoS** services.

---

## Security baselines and audits

- **Security baselines** — Standard **hardened** configuration for devices and systems (e.g. disable unused services, strong auth, logging). Used to keep **consistency** and reduce **attack surface**.
- **Audits** — **Validate** that controls are in place: firewall rules, access controls, patching, logging. **Logging and alerting** for network controls (e.g. firewall deny, auth failure, admin login) feed **audit trails** and **SIEM**. Regular **reviews** of rules and access (e.g. who can access what) support compliance and incident response. See [observability/6_Network_Operations](../observability/6_Network_Operations.md) (change management, compliance).

---

## References

- [Snort 3 — Command line](https://docs.snort.org/start/help.html); [Snort 3 — Rules](https://docs.snort.org/start/rules.html)
- Network-Security (BFreitas16): Snort – alerting DoS attacks (ICMP flood, SYN flood, ping of death, land, HTTP flooding, TCP reset, Christmas tree, UDP flood, DNS flood, Smurf)
- [3_Cybersecurity_Threats_Config](./3_Cybersecurity_Threats_Config.md); [5_Firewalls_Aaa](./5_Firewalls_Aaa.md); [1_Overview_Perimeter](./1_Overview_Perimeter.md); [observability/5_Security_Monitoring](../observability/5_Security_Monitoring.md); [observability/6_Network_Operations](../observability/6_Network_Operations.md)
