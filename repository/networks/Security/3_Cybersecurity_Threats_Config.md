# Cybersecurity: Threats & Security Configuration

[← Back to Security](./README.md)

Security threats, social engineering, malware, DoS/DDoS, antimalware; wireless and firewall configuration.

## Table of Contents

- [Security threats](#security-threats)
- [Social engineering attacks](#social-engineering-attacks)
- [Malware](#malware)
- [Denial of Service (DoS) and DDoS](#denial-of-service-dos-and-ddos)
- [Antimalware](#antimalware)
- [Wireless security measures](#wireless-security-measures)
- [Wireless authentication](#wireless-authentication)
- [Firewall configuration](#firewall-configuration)
- [Security best practices](#security-best-practices)
- [References](#references)

---

## Security threats

**Threats** to networks include unauthorized access, data theft, and service disruption. Intruders can gain access via **software vulnerabilities**, **hardware attacks**, or low-tech methods (e.g. guessing passwords). Those who exploit software are often called **threat actors**. Source: Networking-Essentials (Cisco).

**Four types of threat (from source):**

1. **Information theft** — Breaking in to obtain confidential information (e.g. proprietary or R&D data) for use or sale.
2. **Data loss and manipulation** — Destroying or altering data (e.g. virus that reformats a drive; changing records such as prices).
3. **Identity theft** — Stealing personal information to assume someone’s identity (e.g. obtain documents, credit, make purchases).
4. **Disruption of service** — Preventing legitimate users from accessing services (e.g. DoS on servers, devices, or links).

**Internal vs external:** Threats can come from inside (insiders, compromised accounts) or outside (attackers on the internet). See [4_Attacks_Mitigations](./4_Attacks_Mitigations.md) for L2/L3 attacks.

---

## Social engineering attacks

**Social engineering** uses **human behavior** to gain access: attackers **deceive** users into performing actions or **revealing confidential information** (e.g. passwords, bank details). Users are often the **weakest link**; attackers may be internal or external and often do not meet victims face-to-face. Source: Networking-Essentials.

**Types (from source):**

- **Pretexting** — An invented scenario (pretext) is used to get the victim to release information or perform an action, often by **phone**. The attacker establishes legitimacy (e.g. using prior knowledge) so the target is more likely to comply.
- **Phishing** — Attacker pretends to represent a legitimate organization, usually via **email or text**, and asks for verification of information (e.g. passwords) to “prevent” a bad outcome.
- **Vishing (voice phishing)** — Uses **VoIP**; victims get a voicemail asking them to call a number that looks like a real service. The call is intercepted and data entered (e.g. bank details) is stolen.

**Mitigation:** Security awareness training; verify identities and requests through trusted channels; do not share credentials or sensitive data in response to unsolicited contact.

---

## Malware

**Malware (malicious software)** exploits **software vulnerabilities** and can damage systems, destroy data, deny access, or exfiltrate data. It is often combined with **social engineering** (e.g. tricking a user into opening a file). Source: Networking-Essentials.

- **Virus** — Replicates and spreads; can corrupt OS, alter applications, destroy data.
- **Worm** — Self-propagates across the network without user action.
- **Trojan horse** — Appears legitimate but performs malicious actions.
- **Spyware** — Collects information without consent.
- **Adware** — Pushes unwanted ads; can be bundled with spyware.
- **Botnets** — Compromised hosts (“zombies”) are controlled remotely (e.g. for DDoS, spam). Source: Networking-Essentials (Botnets and Zombies).

See [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md) for DoS and [Antimalware](#antimalware) below.

---

## Denial of Service (DoS) and DDoS

**DoS attacks** aim to **deny services** to intended users by flooding or disrupting targets (end systems, servers, routers, links). They can be simple to launch. Source: Networking-Essentials.

- **Goal:** Flood a network, host, or application so **legitimate traffic** cannot flow; or **disrupt** client–server connections.
- **DDoS (Distributed DoS)** — Many sources (e.g. a botnet) attack at once; harder to mitigate than a single source.

**Examples (from source):** **SYN flooding** — Many connection requests with **invalid source IPs**; the server is busy responding to fake requests and cannot serve legitimate ones. **Ping of death** — A packet **larger than** the IP maximum (65,535 bytes) is sent, which can **crash** the receiving system. See [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md) for more DoS types and [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) for defense against DoS.

---

## Antimalware

**Antimalware** includes software that **detects and prevents** intrusions and infections. Source: Networking-Essentials.

- **Antivirus** — Scans for and removes viruses, Trojans, worms, ransomware.
- **Antispyware** — Detects and blocks spyware.
- **Antispam** — Filters unsolicited or malicious email.

**Signs of infection (from source):** Computer acts abnormally; programs not responding or starting/stopping on their own; email sending large volumes; very high CPU usage; many or unidentifiable processes; slow performance or crashes (e.g. BSoD). **Safeguards:** Keep OS and applications **patched**; run antimalware and keep it updated; avoid opening suspicious attachments or links; use principle of least privilege.

---

## Wireless security measures

**Wireless** networks are vulnerable because traffic travels **over the air** and can be **intercepted**; attackers do not need a physical connection. Source: Networking-Essentials.

- **War-driving / war-walking** — Searching for WLANs (by driving or walking) and logging or sharing their locations; goal may be to access the WLAN or demonstrate insecurity.
- **Mitigations:** Plan security **before** deployment. Use a **security plan**; change **default** passwords and settings; consider **SSID** (e.g. disable broadcast if appropriate); use **MAC filtering** as an extra layer (see [1_Overview_Perimeter](./1_Overview_Perimeter.md)); use **strong encryption and authentication** (e.g. WPA3). See [Advanced/5_Wireless_Special_Networks](../Advanced/5_Wireless_Special_Networks.md).

---

## Wireless authentication

**Authentication** controls **who can connect** by verifying **credentials**. In wireless, authentication can occur **before** the client is allowed on the WLAN. Source: Networking-Essentials.

- **Open authentication** — **No** authentication; any client can **associate**. Use only on **public** networks (e.g. guest Wi‑Fi) or where authentication is done by other means after connection. Most routers disable open auth by default and use a more secure method.
- **Other methods:** **PSK** (pre-shared key), **EAP** (Extensible Authentication Protocol), **SAE** (Simultaneous Authentication of Equals, used in WPA3). **802.1X** ties wireless to a RADIUS server for enterprise auth. See [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) (802.1X).

---

## Firewall configuration

**Operation:** Firewalls **filter** traffic by rules (e.g. by IP, port, protocol). Default policy (allow or deny) applies when no rule matches. Source: Networking-Essentials, GFG Firewall.

- **DMZ (demilitarized zone)** — A **semi-trusted** zone between internal and external networks. Servers that must be reached from the **internet** (e.g. web, game servers) are placed in the DMZ so that only they are exposed; internal hosts stay protected. On a home router, a **DMZ host** can be set to a static IP so that all inbound traffic not otherwise forwarded goes to that host (less secure than port forwarding). Source: Networking-Essentials (The DMZ).
- **Port forwarding** — **Rule-based** forwarding of inbound traffic to a specific **internal** host and port. When the router receives traffic for a given **destination port** (e.g. 80 for HTTP), it forwards to the configured device. Safer than exposing the whole host via DMZ. Source: Networking-Essentials (Port Forwarding).
- **Port triggering** — Outbound traffic on a **trigger** port opens an inbound rule temporarily so a service (e.g. a game) can receive a response; the rule closes after inactivity. Useful when the internal client does not have a fixed port.

---

## Security best practices

- **Layered controls** — Firewall, segmentation, access control, encryption, IDS/IPS, antimalware. See [1_Overview_Perimeter](./1_Overview_Perimeter.md).
- **Patching** — Keep OS and applications updated to reduce vulnerability to malware and exploitation.
- **Strong authentication** — Avoid default passwords; use MFA where possible; 802.1X for network access where appropriate.
- **Principle of least privilege** — Users and services get only the access they need.
- **Monitoring and response** — Log and monitor; tune IDS/IPS; have an incident response process. See [Observability/5_Security_Monitoring](../Observability/5_Security_Monitoring.md) and [Observability/6_Network_Operations](../Observability/6_Network_Operations.md).

---

## References

- [GeeksforGeeks – Introduction of Firewall](https://www.geeksforgeeks.org/computer-networks/introduction-of-firewall-in-computer-network/); [GeeksforGeeks – What is Network Security?](https://www.geeksforgeeks.org/computer-networks/network-Security/)
- Networking-Essentials (Cisco): Security Threats, Social Engineering, Malware, DoS, Antimalware, Wireless Security, Wireless Authentication, Firewall (DMZ, Port Forwarding)
- [1_Overview_Perimeter](./1_Overview_Perimeter.md); [4_Attacks_Mitigations](./4_Attacks_Mitigations.md); [5_Firewalls_Aaa](./5_Firewalls_Aaa.md); [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md); [Observability/5_Security_Monitoring](../Observability/5_Security_Monitoring.md); [Advanced/5_Wireless_Special_Networks](../Advanced/5_Wireless_Special_Networks.md) (wireless)
