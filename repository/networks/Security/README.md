# Security

Network security, encryption, and access control. Each topic has a dedicated file for full-depth content (definitions, attacks, mitigations, configurations). Together these cover **network security in full**: from what network security is and how it works, through encryption and TLS, threats, **L1/L2/L3 attacks**, firewalls and AAA, VPNs (IPSec and beyond), NIDS/NIPS, DoS, identity, **reconnaissance and offensive measures** (from a defensive perspective), **blue team / defensive security** (NSM, detection, incident response, hardening, threat intel), and **applications from a network perspective** (web, mobile, AI, containers). **Standalone:** all essential content lives in this repository; you do not need to follow external links to understand or use the material. Optional “Further reading” links are for deeper or external reference only.

## Network security at a glance

| Area | What it covers | File |
|------|----------------|------|
| **Overview & perimeter** | What is network security; firewalls, MAC filtering, VPN, IDS/IPS; SASE and ZTNA (network perspective) | [1_Overview_Perimeter](./1_Overview_Perimeter.md) |
| **Encryption & TLS** | TLS/mTLS, handshake, SNI, 0-RTT, SSL/PPTP | [2_Encryption_Tls](./2_Encryption_Tls.md) |
| **Threats & config** | Social engineering, malware, DoS/DDoS, wireless/firewall config, best practices | [3_Cybersecurity_Threats_Config](./3_Cybersecurity_Threats_Config.md) |
| **L1/L2/L3 attacks** | L1 (wiretap, rogue device, RF jamming, physical); L2 (CAM, DHCP, ARP, STP, VLAN); L3 (DNS, RIP, idle scan, ICMP redirect); mitigations | [4_Attacks_Mitigations](./4_Attacks_Mitigations.md) |
| **Firewalls & AAA** | Zone-based firewalls, ACLs, cloud (VPC/SGs), DoS defense, CoPP, REST API security for devices, TACACS+, RADIUS, 802.1X, ASA | [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) |
| **IPSec & VPNs** | Tunneling, IPSec (ESP/AH, IKE, NAT-T), GRE over IPSec, DMVPN, GETVPN | [6_Ipsec_Vpns](./6_Ipsec_Vpns.md) |
| **NIDS & identity** | Snort, DoS types, authentication, Zero Trust, WAF, rate limiting, baselines, audits | [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md) |
| **Recon & offensive** | Reconnaissance (passive/active), DNS/WHOIS enum, port/service/OS scanning; pen-test workflow (network); sniffing/MitM/session hijacking; defensive view | [8_Reconnaissance_Offensive](./8_Reconnaissance_Offensive.md) |
| **Blue team & defensive** | Security engineer workflow (network); NSM, visibility (flow, Zeek, Suricata), detection/alerting, incident response (network), hardening, threat intel/IOCs, log investigation | [9_Blue_Team_Defensive](./9_Blue_Team_Defensive.md) |
| **Applications (network)** | Web (WAF, TLS, API, rate limit); mobile/iOS (device on network, cert pinning, NAC/MDM); AI/API (rate limit, endpoints); containers (NetworkPolicy, visibility) | [10_Applications_Network_Perspective](./10_Applications_Network_Perspective.md) |

Use the learning path below to go from basics to enterprise and VPNs; cross-references link to [Services/](../Services/) (HTTPS, TLS) and [Observability/](../Observability/) (security monitoring, Zeek, Suricata).

## Topics

### [1. Overview & perimeter](./1_Overview_Perimeter.md)

What is network security?; firewalls, MAC filtering, VPN, IDS/IPS.

### [2. Encryption & TLS](./2_Encryption_Tls.md)

Encryption algorithms, TLS/mTLS, SNI, TLS 0-RTT, SSL/PPTP.

### [3. Cybersecurity: threats & config](./3_Cybersecurity_Threats_Config.md)

Security threats, social engineering, malware, DoS/DDoS, antimalware; wireless security and authentication; firewall configuration; security best practices.

### [4. Network attacks & mitigations (L1, L2 & L3)](./4_Attacks_Mitigations.md)

L1 (wiretapping, rogue devices, RF jamming, physical access); CAM overflow, DHCP attacks, ARP poisoning, STP manipulation, VLAN attacks, DNS spoofing, RIP poisoning, idle scan, ICMP redirect.

### [5. Firewalls & AAA (enterprise)](./5_Firewalls_Aaa.md)

Zone-based firewalls, DoS defense, AAA, TACACS+, RADIUS, 802.1X, ASA firewall.

### [6. IPSec & VPNs (deep dive)](./6_Ipsec_Vpns.md)

Tunneling, IPSec (ESP/AH, NAT-T), GRE over IPSec, DMVPN, GETVPN.

### [7. NIDS/NIPS, DoS types & identity](./7_Nids_DoS_Identity.md)

Snort and NIDS, DoS attack types, authentication, Zero Trust, WAF, rate limiting, security baselines and audits.

### [8. Reconnaissance & network offensive basics](./8_Reconnaissance_Offensive.md)

**Deep dive with commands.** Passive and active recon; DNS enumeration (dig, zone transfer, reverse DNS) and WHOIS; Nmap host discovery, port scan types (TCP Connect, SYN, UDP), service/version and OS detection; output and timing; defensive perspective. Written for hands-on learning with copy-paste examples.

### [9. Blue team & defensive security](./9_Blue_Team_Defensive.md)

**Deep dive with commands.** Security engineer workflow (network perspective); NSM and visibility; Zeek conn.log and dns.log (fields, zeek-cut, investigation); detection and alerting (with Suricata rule example); incident response step-by-step (identify, contain with iptables, investigate with tcpdump, eradicate/recover); hardening and baselines; threat intel and IOCs; log management; hands-on defensive workflows (copy-paste). Written for practitioners and students.

### [10. Applications & security (network perspective)](./10_Applications_Network_Perspective.md)

**Standalone, network lens.** Web (HTTPS, WAF, API traffic, rate limiting, L7 DDoS); mobile/iOS (device as host, TLS, certificate pinning, NAC, MDM); AI/API (model endpoints, rate limiting by request and token, securing APIs); containers/Kubernetes (pod networking, NetworkPolicy, visibility and IDS). All from a network perspective—what traffic looks like and how you protect and monitor it.

## Learning path

1. [Overview & perimeter](./1_Overview_Perimeter.md) → [Encryption & TLS](./2_Encryption_Tls.md) → [Cybersecurity threats & config](./3_Cybersecurity_Threats_Config.md) → [Attacks & mitigations (L1–L3)](./4_Attacks_Mitigations.md) → [Firewalls & AAA](./5_Firewalls_Aaa.md) → [IPSec & VPNs](./6_Ipsec_Vpns.md) → [NIDS & identity](./7_Nids_DoS_Identity.md) → [Recon & offensive](./8_Reconnaissance_Offensive.md) → [Blue team & defensive](./9_Blue_Team_Defensive.md) → [Applications (network)](./10_Applications_Network_Perspective.md)
2. For HTTPS and TLS termination see [Services/](../Services/README.md).

## Cross-references

- **Services:** HTTPS, TLS termination, proxies — [Services/](../Services/README.md)
- **Advanced:** TLS 0-RTT details — [Advanced/](../Advanced/README.md)
- **Cloud-native:** Container/Kubernetes networking — [Cloud-Native/](../Cloud-Native/README.md); application security from network perspective — [10_Applications_Network_Perspective](./10_Applications_Network_Perspective.md)
