# Network Attacks & Mitigations (L1, L2 & L3)

Physical (L1), data-link and network (L2/L3) attacks and mitigations. Covers **L1** (wiretapping, rogue devices, RF jamming, physical access), **L2** (CAM overflow, DHCP, ARP, STP, VLAN), and **L3/L7** (DNS spoofing, RIP poisoning, idle scan, ICMP redirect) and the **mitigations** used in network security.

## Table of Contents

- [Summary: attack vs mitigation](#summary-attack-vs-mitigation)
- [L1 (physical layer) attacks](#l1-physical-layer-attacks)
- [CAM table overflow](#cam-table-overflow)
- [DHCP attacks](#dhcp-attacks)
- [ARP poisoning (MitM)](#arp-poisoning-mitm)
- [STP manipulation](#stp-manipulation)
- [VLAN attacks](#vlan-attacks)
- [DNS spoofing](#dns-spoofing)
- [RIP poisoning](#rip-poisoning)
- [Idle Scan](#idle-scan)
- [ICMP redirect (MitM)](#icmp-redirect-mitm)
- [References](#references)

---

## Summary: attack vs mitigation

| Attack | Layer | Main mitigation(s) |
|--------|-------|---------------------|
| **Wiretapping / cable tap** | L1 | Physical security; encryption (so tap sees ciphertext only); tamper detection |
| **Rogue device / evil twin** | L1/L2 | 802.1X, certificate-based auth; site surveys; monitor for unauthorized APs |
| **RF jamming** | L1 (wireless) | RF monitoring; frequency diversity; WIPS; physical control of space |
| **Physical access / theft** | L1 | Access control, locks, cameras; device encryption; asset tracking |
| **CAM table overflow** | L2 (switch) | Port security (limit MACs per port); sticky/static MAC |
| **DHCP spoofing / starvation** | L2/L7 | DHCP snooping (trusted/untrusted ports); rate limiting |
| **ARP poisoning (MitM)** | L2/L3 | Dynamic ARP Inspection (DAI) using DHCP snooping table; static ARP where needed |
| **STP manipulation** | L2 | BPDU guard (edge ports); root guard (ports that must not become root) |
| **VLAN hopping** (DTP / double-tag) | L2 | Disable DTP; set access ports explicitly; native VLAN best practices |
| **DNS spoofing / cache poisoning** | L7 | DNSSEC; DoH/DoT; trusted DHCP so clients get trusted DNS |
| **RIP poisoning** | L3 | RIP authentication (RIPv2); segment routing; prefer OSPF/BGP with auth |
| **Idle scan** | L3/L4 | Ingress filtering (BCP 38); detect anomalous scan behavior |
| **ICMP redirect (MitM)** | L3 | Disable acceptance of ICMP redirects on hosts; restrict redirects on routers |

---

## L1 (physical layer) attacks

**Layer 1** deals with **physical media**: cables, connectors, radio waves, and the physical environment. Attacks at L1 target the **medium** or **physical access** to devices and links. Understanding these helps you defend the perimeter and sensitive areas.

### Wiretapping and cable tapping

**Basics:** An attacker **intercepts** traffic by gaining **physical access** to the cable (copper or fibre) or by **eavesdropping** on **wireless** transmissions (Wi‑Fi, Bluetooth, cellular) without joining the network. **Passive** wiretapping reads traffic; **active** tapping can inject or modify in some setups. On **unencrypted** links, the attacker sees all data. On **encrypted** links (e.g. TLS, IPSec), they see ciphertext unless they can compromise keys or endpoints.

**Mitigation:** **Encrypt** traffic so that a tap only sees ciphertext. **Physical security**: secure cabling in conduits, locked closets, and controlled access to data centres and wiring. **Tamper detection**: monitor for link drops or unexpected optical/electrical changes that can indicate a tap. **Optical** fibre is harder to tap without detection than copper; still, protect splice points and patch panels.

### Rogue devices and evil twin (wireless)

**Basics:** A **rogue device** is an **unauthorized** piece of equipment on or near the network: a **rogue AP** (evil twin) that mimics a legitimate SSID to steal credentials or traffic, a **rogue DHCP server** (see [DHCP attacks](#dhcp-attacks)), or a **rogue modem** / **cell-site simulator** (e.g. IMSI catcher) in wireless. Users may **associate** to the rogue AP; traffic is then in the attacker’s hands.

**Mitigation:** **802.1X** and **certificate-based authentication** so that only authorized clients and APs are trusted. **Wireless intrusion prevention (WIPS)** and **site surveys** to detect and locate rogue APs. **Physical control**: restrict who can install or connect equipment. For cellular, **encryption** and **network-level authentication** reduce the value of rogue base stations.

### RF jamming (wireless L1)

**Basics:** **Jamming** is an **active** L1 attack: the attacker **transmits** noise or signals on the same (or nearby) **frequency band** to **disrupt** communications. Wi‑Fi (2.4 / 5 GHz), Bluetooth, and cellular can be jammed; the target link or cell becomes **unusable** (DoS). Jammers can be broad-band or targeted; some are protocol-aware.

**Mitigation:** **RF monitoring** to detect jamming (e.g. sudden rise in noise, loss of signal). **Frequency diversity** (e.g. multiple bands, channel agility) so that not all links fail at once. **Physical security** to prevent deployment of jammers in critical areas. **Regulatory**: jamming is illegal in many jurisdictions; report suspected jamming.

### Physical access, theft, and damage

**Basics:** **Physical access** to a device allows **theft**, **tampering** (e.g. USB boot, replacement of firmware), **connection** of rogue devices (see above), or **destruction** of equipment (cut cables, damage switches). Insiders or break-ins can cause **outages** or **data loss**.

**Mitigation:** **Access control** (badges, locks, cameras, guards) for data centres, wiring closets, and sensitive areas. **Device encryption** and **secure boot** so that stolen equipment does not expose data or trust. **Asset tracking** and **inventory** to detect missing or unauthorized devices. **Cable and port labelling** and **change management** to spot unauthorized changes.

---

## CAM table overflow

**Basics:** A switch learns **source MAC addresses** from incoming frames and stores them in its **CAM (Content Addressable Memory) table** (often called the MAC table). The table has a fixed size. In a **CAM table overflow** attack, the attacker sends many frames with **spoofed source MACs** (each frame with a different MAC). The switch fills its table; once full, it may **flood** new unknown unicast traffic out all ports (fail-open behavior), so the attacker can **sniff** traffic that would otherwise be switched only to the correct port. In some implementations, new MACs are not learned when the table is full, causing **denial of service** (legitimate hosts cannot be learned).

**Visual (overflow → flood):**

```text
  Attacker sends many frames: src MAC = M1, M2, M3, ... (spoofed)
       │
       ▼
  Switch CAM table fills (M1→port2, M2→port2, ... all on attacker's port)
       │
       ▼
  Table full → new unknown unicast (e.g. dst MAC = Victim) has no entry
       │
       ▼
  Switch floods frame out all ports (except ingress) → Attacker on port2 receives it
  (Normal behavior: unicast to Victim would go only to Victim's port.)
```

**Mitigation:** **Port security** (Cisco and similar): limit the number of MAC addresses per port (e.g. 1 for an access port). Excess MACs cause the port to be disabled or to drop traffic. Use **sticky MAC** or static entries for critical ports. **Detection:** Monitor CAM table size and port-security violations; alert on sudden growth or many new MACs on a single port.

**Hands-on (Cisco IOS):** Verify port security and CAM/MAC table. You are checking how many MACs are allowed per port and whether any violations occurred.

```text
! Show MAC address table (CAM); see which ports have learned which MACs
show mac address-table

! Show port security status and violations per interface
show port-security
show port-security interface GigabitEthernet0/1
```

---

## DHCP attacks

**DHCP spoofing (rogue DHCP server):** An attacker runs a DHCP server on the LAN. Clients that request an address may get a **wrong default gateway** or **DNS** from the attacker, so traffic is sent to the attacker (man-in-the-middle) or to a malicious site. **DHCP starvation:** The attacker sends many DHCP Discover/Request messages with **spoofed MAC addresses**, exhausting the pool of addresses. Legitimate clients then get no address (DoS).

**Visual (DHCP spoofing — wrong gateway):**

```text
  Client (no IP)          Attacker (rogue DHCP server)      Real gateway
        |                          |                             |
        |  DHCP Discover (broadcast)                             |
        |─────────────────────────>|                             |
        |  DHCP Offer (gateway = attacker's IP, DNS = attacker)  |
        |<─────────────────────────|                             |
        |  Client accepts; now uses attacker as gateway          |
        |  All client traffic to internet goes via attacker → MitM
```

**Mitigation:** **DHCP snooping** on switches: configure **trusted** ports (only toward the real DHCP server). On **untrusted** ports, the switch drops DHCP server messages (Offer, ACK) from clients; only client messages (Discover, Request) are allowed. The switch can also build a **snooping binding table** (IP, MAC, port, VLAN) and use it for **Dynamic ARP Inspection (DAI)** or IP Source Guard. **Rate limiting** and **port security** reduce starvation. See [services/8_DHCP](../services/8_DHCP.md) for DHCP basics and security.

**Hands-on (Cisco IOS):** Verify DHCP snooping. You are checking which ports are trusted and that the binding table is populated (used later by DAI).

```text
! Show DHCP snooping status and binding table (IP, MAC, VLAN, port)
show ip dhcp snooping
show ip dhcp snooping binding
```

---

## ARP poisoning (MitM)

**Basics:** On the local segment, hosts use **ARP** to resolve an IP to a MAC address. There is **no authentication** in ARP. An attacker sends **fake ARP replies** (or gratuitous ARPs) claiming “IP X has MAC Y” where Y is the attacker’s MAC. The victim then sends traffic for X to the attacker; the attacker can forward it (transparent MitM) or drop it (DoS). **ARP spoofing** is the same idea: corrupting the victim’s ARP cache so that traffic to a legitimate host goes to the attacker.

**Visual (ARP poisoning flow):**

```text
  Victim (10.0.0.5)     Attacker (10.0.0.99)     Gateway (10.0.0.1)
        |                      |                          |
        |  Normal: Victim's ARP cache: 10.0.0.1 → MAC_GW  |
        |  Attacker sends: "10.0.0.1 has MAC_ATTACKER"    |
        |  (gratuitous ARP or reply to Victim's request)  |
        |<─────────────────────|                          |
        |  Victim's cache now: 10.0.0.1 → MAC_ATTACKER    |
        |  Traffic to gateway  ──────────> Attacker ──────> (forwards to Gateway)
        |  Attacker sees all victim↔internet traffic (MitM)
```

**Mitigation:** **Dynamic ARP Inspection (DAI):** The switch uses the **DHCP snooping binding table** (or static entries) to check that ARP packets are consistent (e.g. this IP is allowed on this port with this MAC). Invalid ARP is dropped. **Static ARP** on critical hosts is possible but doesn’t scale. **Detection:** Monitor for duplicate IP (same IP, different MAC) or sudden ARP changes. See [foundations/5_Network_Layer](../foundations/5_Network_Layer.md) for ARP.

**Hands-on (host):** View ARP cache to see current IP→MAC mappings. See [foundations/5_Network_Layer — ARP](../foundations/5_Network_Layer.md#arp-and-nd-for-ipv6): Linux `ip neigh show` or `arp -n`; Windows `arp -a`.

---

## STP manipulation

**Basics:** Spanning Tree uses **BPDUs** to elect the root and decide which ports forward or block. If an attacker can **inject forged BPDUs** (e.g. claiming to be the root with a better bridge ID), the topology can change: the attacker’s port might become root or designated, so traffic is redirected toward the attacker, or the network can be disrupted (repeated topology changes, blocking of legitimate paths).

**Mitigation:** **BPDU guard** on **edge ports** (ports that should only see hosts): if a BPDU is received, the port is disabled (errdisabled). This stops someone from adding a switch or a BPDU-injecting tool. **Root guard** on ports that must not accept a better root: if a superior BPDU is received, the port goes to root-inconsistent and does not forward. Use root guard on ports toward parts of the network that should not become root. See [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) for STP/RSTP and BPDU/root guard.

---

## VLAN attacks

**Basics:** VLANs segment traffic at L2. **VLAN hopping** can be done in two main ways. (1) **DTP (Dynamic Trunking Protocol) abuse:** If a port is in auto/desirable mode and the attacker’s host can send DTP to negotiate a trunk, the attacker gets access to all VLANs on the trunk. (2) **Double-tagging (double-encapsulation):** The attacker sends a frame with **two** 802.1Q tags. The first tag (attacker’s access VLAN) is stripped by the first switch; the second tag is then used by the next switch, so the frame is forwarded in a different VLAN. This works only in specific topologies (attacker and target on different switches with an intermediate trunk).

**Mitigation:** On **access ports**, disable DTP and set the port as **access** (no trunk). Do not use VLAN 1 for user traffic. For double-tagging, put sensitive VLANs on switches that do not share a trunk with untrusted ports, or use **native VLAN** best practices (don’t use default native VLAN for sensitive traffic; some vendors allow disabling native VLAN on trunks). **Voice VLAN** and similar features should be locked down so only authorized gear can use them.

---

## DNS spoofing

**Basics:** **DNS spoofing** (or **DNS cache poisoning**) means an attacker causes a resolver or client to get a **wrong IP** for a domain (e.g. example.com → attacker’s IP). The user then connects to the attacker’s server (phishing, MitM). Attack methods include: rogue DNS server on the LAN (e.g. via DHCP), poisoning the resolver’s cache with a forged response, or MitM on DNS traffic. **DNS hijacking** (changing authoritative or resolver config) is a related threat.

**Mitigation:** **DNSSEC** lets resolvers **verify** that DNS responses are signed by the zone’s key; if the response is tampered with, verification fails. Deploy DNSSEC on authoritative servers and use validating resolvers. **DNS over HTTPS (DoH)** or **DNS over TLS (DoT)** encrypts DNS queries so on-path attackers cannot see or easily modify them. **Hardening:** Restrict which hosts can act as DNS; use trusted DHCP so clients get trusted DNS server addresses; monitor for unexpected DNS changes. See [services/2_DNS](../services/2_DNS.md) for DNS and DoH/DoT.

---

## RIP poisoning

**Basics:** **RIP** is a distance-vector protocol: routers advertise their routing table to neighbours. There is **no cryptographic authentication** in RIPv1; RIPv2 supports a **plaintext password** (often not used or weak). An attacker on a segment where RIP runs can **send forged RIP updates** (e.g. “I have a route to 0.0.0.0/0 with metric 1”). Neighbouring routers may install the route and send traffic to the attacker or to a black hole.

**Mitigation:** Use **RIP authentication** (RIPv2): configure a shared key so routers only accept updates from trusted neighbours. Prefer **OSPF** or **BGP** with authentication in production. **Segment** routing protocol traffic: do not run RIP on untrusted access segments; use passive interfaces and ACLs so only authorized peers can send/receive routing updates.

---

## Idle Scan

**Basics:** **Idle scan** (e.g. **Nmap -sI**) uses a **zombie host** (a host that is mostly idle and that increments its IP ID for each packet) to scan a target **indirectly**. The scanner sends a SYN to the target with a **spoofed source IP** (the zombie’s IP). If the target’s port is open, the target sends SYN-ACK to the zombie; the zombie then sends RST (it didn’t start a connection). The scanner probes the zombie’s IP ID before and after; an increment of 2 suggests the zombie received one packet (the SYN-ACK from the target). If the port is closed, the target sends RST to the zombie and the zombie doesn’t respond; IP ID increments by 1. So the scanner can infer open/closed ports on the target without sending packets from its own IP. Used for **evasion** (hiding the scanner’s address).

**Mitigation:** **Ingress filtering** (BCP 38): drop packets that have a source IP that is not valid for the incoming link, so spoofed source IPs don’t reach the target. **Monitoring:** Detect anomalous IP ID patterns or traffic from zombie-like hosts. Idle scan is less common than direct scanning; defending against spoofing and detecting scanning in general helps.

---

## ICMP redirect (MitM)

**Basics:** **ICMP Redirect** is used by a router to tell a host: “for this destination, use a better next hop” (e.g. another router on the same segment). The host then sends subsequent packets for that destination to the new next hop. An attacker on the same L2 segment can send **forged ICMP redirects** to the victim, telling it to use the **attacker’s IP** as the next hop for a given destination. The victim then sends traffic for that destination to the attacker (MitM).

**Mitigation:** **Disable acceptance of ICMP redirects** on hosts (most modern OSes allow this; redirects are rarely needed when the default gateway is correct). On routers, restrict which redirects are sent. **Layer 2 security:** Limit who can send redirects to the victim (e.g. same VLAN as gateway only; no untrusted devices on that segment). **Monitoring:** Alert on ICMP redirects if they are not expected in your design.

---

## References

- Physical layer security: RF jamming, wiretapping, rogue devices — see [1_Overview_Perimeter](./1_Overview_Perimeter.md) (physical controls); [3_Cybersecurity_Threats_Config](./3_Cybersecurity_Threats_Config.md) (wireless security)
- [GeeksforGeeks – DHCP Snooping](https://www.geeksforgeeks.org/computer-networks/dhcp-snooping/); [GeeksforGeeks – ARP Spoofing and ARP Poisoning](https://www.geeksforgeeks.org/computer-networks/arp-spoofing-and-arp-poisoning/); [GeeksforGeeks – Dynamic ARP Inspection](https://www.geeksforgeeks.org/what-is-dynamic-arp-inspection/)
- [services/8_DHCP](../services/8_DHCP.md) (DHCP security); [services/2_DNS](../services/2_DNS.md) (DNS, DoH/DoT)
- [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) (STP, BPDU guard, root guard)
- [foundations/5_Network_Layer](../foundations/5_Network_Layer.md) (ARP)
