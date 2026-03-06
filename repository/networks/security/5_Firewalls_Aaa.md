# Firewalls & AAA (Enterprise)

[← Back to Security](./README.md)

Zone-based firewalls, DoS defense, AAA, TACACS+, RADIUS, 802.1X, ASA.

## Table of Contents

- [Zone-based policy firewalls](#zone-based-policy-firewalls)
- [Firewall rules, traffic flow, and configuration considerations](#firewall-rules-traffic-flow-and-configuration-considerations)
- [Cloud-native: VPC, subnets, and security groups](#cloud-native-vpc-subnets-and-security-groups)
- [Defense against DoS](#defense-against-dos)
- [Control plane policing (CoPP)](#control-plane-policing-copp)
- [REST API security for network devices](#rest-api-security-for-network-devices)
- [AAA](#aaa)
- [TACACS+](#tacacs)
- [RADIUS](#radius)
- [802.1X](#8021x)
- [ASA firewall](#asa-firewall)
- [References](#references)

---

## Zone-based policy firewalls

**Zone-based policy firewall (ZBFW)** groups interfaces into **security zones** (e.g. inside, outside, DMZ). Traffic is then controlled by **zone-pairs**: for each (source zone → destination zone) you attach a **policy** that classifies traffic (e.g. by protocol or ACL) and applies **inspect** (stateful), **drop**, or **pass**. There is no ACL on the interface itself; the zone-pair and policy decide what is allowed. **Class-maps** define traffic classes (e.g. HTTP, ICMP, DNS); **policy-maps** tie classes to actions (inspect, drop, police). This gives a clear model: “from PRIVATE to DMZ, allow only HTTP/HTTPS, ICMP, and email; inspect and police.” ZBFW is often used on Cisco IOS for stateful inspection and DoS hardening (e.g. SYN rate limit, ICMP police). Classical **ACL-based firewalls** apply extended ACLs in/out on interfaces and optionally **ip inspect** for stateful return traffic; ZBFW is the zone-based evolution of that model.

---

## Firewall rules, traffic flow, and configuration considerations

### How firewall rules work

Firewall **rules** (ACLs, policy-maps, or security-group rules) define **what traffic is allowed or denied**. Each rule typically has **match criteria** (source/destination IP, port, protocol, sometimes application or identity) and an **action** (allow/permit or deny/drop). **Order matters**: the first matching rule usually wins, so **more specific** rules should appear **before** broad ones. Unmatched traffic is handled by the **default policy** (often **deny** for security).

### Flow of traffic through the firewall

```text
  Packet arrives on interface
       ↓
  Classify (zone, direction, 5-tuple: src IP, dst IP, protocol, src port, dst port)
       ↓
  Look up rule set (ACL or zone-pair policy) in order
       ↓
  First match → ALLOW → forward (and optionally track state for stateful)
  First match → DENY  → drop (and optionally log)
  No match    → default policy (deny or allow)
       ↓
  If stateful: return traffic can be permitted by session table without explicit rule
```

**Stateful** firewalls keep a **session/connection table**: once outbound traffic is allowed, the **return** traffic (same flow, reverse direction) is automatically permitted. **Stateless** rules require explicit allow for both directions.

**Commands (hands-on): host firewall (Linux) — list and basic rules**

On Linux, **iptables** (legacy) or **nftables** (modern) implement host-level firewall rules. These are examples for viewing and simple allow/drop; production configs are more structured.

```bash
# List current iptables rules (filter table)
sudo iptables -L -n -v

# List NAT table (e.g. for masquerade)
sudo iptables -t nat -L -n -v

# nftables: list ruleset
sudo nft list ruleset
```

Example: allow SSH (22), drop all other inbound to a host (conceptual; default policy must be set carefully):

```bash
# Conceptual — adjust chain names and policy for your distro
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -j DROP
# (Configure default policy and other rules as needed; this is minimal.)
```

Cisco IOS, ASA, and cloud security groups use different syntax; see [Zone-based policy firewalls](#zone-based-policy-firewalls) and [Cloud-native: VPC, subnets, and security groups](#cloud-native-vpc-subnets-and-security-groups).

### What to keep in mind when configuring

- **Default deny** — Prefer **deny by default**; allow only what is needed.
- **Rule order** — Place **specific** rules above **general** ones; avoid “allow any” at the top.
- **Logging and alerting** — Log **denied** (and optionally allowed) traffic for troubleshooting and security review.
- **Testing** — Test rule changes in staging or small rollout; verify required traffic works and unwanted traffic is blocked; have a rollback plan.
- **Documentation** — Document **why** each rule exists; review and remove obsolete rules periodically.
- **Management access** — Restrict who can change firewall config; use AAA and least privilege; restrict management interfaces to trusted networks or VPN.
- **Consistency** — In cloud and hybrid, align security groups, NACLs, and on-prem policy. See [Cloud-native: VPC, subnets, and security groups](#cloud-native-vpc-subnets-and-security-groups).

---

## Cloud-native: VPC, subnets, and security groups

In **cloud** (e.g. AWS, Azure, GCP), **firewall-like** controls use **VPC**, **subnets**, and **security groups** (or **NSGs**).

- **VPC** — Isolated network with its own CIDR. Segment workloads by VPC or subnets so rules apply per segment.
- **Subnets** — Divide VPC (e.g. web, app, data). **Route tables** control forwarding (e.g. public → internet gateway; private → NAT). **NACLs** are stateless rules at **subnet** level; first match wins.
- **Security groups (SGs)** — **Stateful** rules at the **instance** (ENI) level. Allow inbound/outbound by source/dest (IP or SG), protocol, port. **Default deny**; only allow rules permit traffic. Use **least privilege** (e.g. app SG allows 443 only from LB SG). Avoid open **0.0.0.0/0** on sensitive ports; use **private subnets** and **NAT** or **VPC endpoints** for backends. Document and automate (IaC) like on-prem. See [cloud-native/1_Cloud_Networking_Overview](../cloud-native/1_Cloud_Networking_Overview.md).

---

## Defense against DoS

**Basics:** DoS (denial of service) aims to exhaust resources (bandwidth, connections, CPU) so legitimate traffic fails. Defense starts with **rate limiting** and **policing**: cap the rate of certain traffic (e.g. ICMP, SYN) so one source cannot flood the link or the state table. In a zone-based firewall, **policy-map** actions can include **police rate X burst Y** for a class (e.g. ICMP or HTTP); **inspect** with a **parameter-map** can set **tcp synwait-time** so half-open SYNs are aged quickly. **Filtering** at the edge (drop obviously spoofed or malformed traffic) and **hardening** (disable unused services, restrict management access) reduce attack surface. For **SYN flood**, reduce synwait-time and use SYN cookies or similar on the target; for **ICMP flood**, police ICMP at the perimeter. See [NIDS & DoS](./7_Nids_DoS_Identity.md) for detection and alerting.

---

## Control plane policing (CoPP)

The **control plane** of a router or switch is the **CPU** that runs **routing protocols**, **management** (SSH, SNMP, HTTP), **ARP**, **ICMP**, and other **control traffic**. If an attacker (or a misconfiguration) sends **too much** traffic that the device must **process** (e.g. millions of packets to the device’s IP or to routing protocol ports), the CPU can be **exhausted** and the device can **stop forwarding** or become unreachable. **Control Plane Policing (CoPP)** — or the vendor-equivalent feature — **rate-limits or drops** traffic destined to the control plane so that **management** and **routing** get resources and **attack traffic** does not overwhelm the device.

**Visual (where CoPP applies):**

```text
  Data plane (forwarding):     Control plane (CPU):
  Packets that are FORWARDED   Packets that are PROCESSED
  (transit traffic)            by the device itself
        │                              │
        │  Not affected by CoPP        │  CoPP policy applies here
        │  (handled in hardware/       │  (e.g. rate-limit SSH, BGP,
        │   ASIC where possible)       │   ICMP, unknown)
        v                              v
  [Interface] ──────────────────────► [CPU]
                                         │
                                         │  CoPP: classify traffic to
                                         │  control plane; police or drop
                                         │  per class (e.g. allow management
                                         │  at 10k pps, drop rest above limit)
```

**How it works (conceptually):** Traffic that is **destined to** the device (e.g. SSH to the router’s IP, BGP to the router, ICMP echo) is sent to the **control plane**. A **CoPP policy** **classifies** this traffic (e.g. “SSH,” “BGP,” “ICMP,” “everything else”) and applies **policing**: allow up to X packets per second (or bytes), **drop** or **mark** the rest. So **legitimate** management and routing get a **guaranteed** share; **flood** or **attack** traffic to the control plane is **dropped** before it starves the CPU.

**Why it matters:** Without CoPP, a single host can send **ICMP echo** or **TCP SYN** to the router’s IP at line rate and **deny service** to the whole segment. CoPP is a standard **hardening** step for enterprise and service-provider devices. Configuration is platform-specific (e.g. Cisco **control-plane** with **service-policy**); see vendor docs.

---

## REST API security for network devices

Many modern routers and switches expose a **REST API** (or **RESTCONF**) for **configuration** and **monitoring**. Securing that API is part of device hardening so that only **authorized** clients can read or change config and that **abuse** (e.g. brute force, scraping) is limited.

**What to do (from a network security perspective):**

- **Authentication** — Require **strong auth** (e.g. **tokens**, **OAuth**, or **mutual TLS**) instead of plain username/password over HTTP. Use **HTTPS** so credentials and payloads are not sent in cleartext.
- **Authorization** — **Least privilege**: API users should have only the **roles** they need (e.g. read-only for monitoring, write only for specific sections). Restrict **which** endpoints (e.g. `/restconf/data/`) are exposed and to whom.
- **Transport** — Use **TLS** (HTTPS) only; disable HTTP. Restrict **which interfaces** the API listens on (e.g. only out-of-band management VLAN).
- **Rate limiting** — Limit **requests per minute** per client or per IP so that **brute force** or **runaway scripts** cannot overwhelm the device or the API.
- **Audit and logging** — **Log** API access (who, what, when); send logs to a **SIEM** or **syslog** server so changes and failures are auditable.

**Visual (layers):**

```text
  Client (script, NMS)                Network device
  ┌─────────────────┐                ┌─────────────────┐
  │  HTTPS (TLS)     │ ──────────────►│  REST API       │
  │  Auth (token/    │   Encrypted    │  Rate limit      │
  │   mTLS)          │   channel     │  AuthZ (roles)   │
  │  Rate-limited    │                │  Audit log      │
  └─────────────────┘                └─────────────────┘
```

**Takeaway:** Treat the device’s **REST API** like a **management interface**: restrict who can reach it, require strong auth and TLS, limit rate, and log access. See [observability/6_Network_Operations](../observability/6_Network_Operations.md) for model-driven programmability (NETCONF, RESTCONF, YANG).

---

## AAA

**AAA** stands for **Authentication, Authorization, and Accounting**. It is a **framework** to control who can use network resources, what they are allowed to do, and what they did.

- **Authentication** — Verifies identity (username/password, certificates, MFA). “Who are you?”
- **Authorization** — Decides what the authenticated user is allowed to do (e.g. which commands, which networks). “What are you allowed to do?”
- **Accounting** — Records what the user did (login, commands, session start/stop). “What did you do?” Used for auditing and compliance.

On network devices (routers, switches), AAA is typically implemented by sending authentication and authorization requests to a central **AAA server** (TACACS+ or RADIUS). The device can fall back to **local** user database if the server is unreachable. Accounting records are sent to the same server or a logging host. This gives centralized access control and a single place to add/remove users and define privilege levels.

---

## TACACS+

**TACACS+ (Terminal Access Controller Access Control System Plus)** is a protocol used for **device administration**: authentication, authorization, and accounting for **login** (SSH, Telnet, console) and **commands** on routers and switches. It runs over **TCP port 49** and **encrypts** the entire packet body (unlike RADIUS, which only encrypts the password). The **NAS (network device)** sends authentication requests to the TACACS+ server; the server replies with accept/reject. For **authorization**, the server can return **privilege level** (e.g. 15 = full admin, 1 = limited) and **per-command** allow/deny (e.g. permit “show .*”, deny “configure”). **Accounting** logs session start/stop and optionally each command. TACACS+ is well suited to **administrative access** because of command-level authorization and encryption. Configuration on the device: enable **aaa new-model**, define **tacacs server** (address, key), and set **aaa authentication login**, **aaa authorization exec** and **commands**, **aaa accounting exec** and **network** to use **group tacacs+** with **local** fallback.

**Hands-on (Cisco IOS — conceptual):** Enable AAA and point login/authorization/accounting to a TACACS+ server. Replace `SERVER_IP` and `SHARED_KEY` with your server and key.

```text
aaa new-model
tacacs server TACACS-SERVER
 address ipv4 SERVER_IP
 key SHARED_KEY
exit
aaa authentication login default group tacacs+ local
aaa authorization exec default group tacacs+ local
aaa accounting exec default start-stop group tacacs+
```

---

## RADIUS

**RADIUS (Remote Authentication Dial-In User Service)** is used for **network access** authentication and accounting: VPN users, wireless (802.1X), and sometimes device admin. It uses **UDP** (auth **1812**, accounting **1813**). The **NAS** (router, switch, WLC, VPN gateway) sends **Access-Request** (username, password hashed with shared secret); the server replies **Access-Accept** or **Access-Reject**. **Access-Accept** can include **attributes** (e.g. VLAN, ACL, filter). **Accounting** uses **Accounting-Request** to report session start/stop and traffic. RADIUS encrypts only the password in Access-Request; the rest of the attributes are not encrypted. For **device admin**, RADIUS can return **Cisco-AVPair** (e.g. `shell:priv-lvl=15`) to assign privilege level. RADIUS is widely used for **802.1X** (port-based access control): the switch sends the supplicant’s credentials to RADIUS; if Accept, the port is opened. Configure **aaa new-model**, **radius server** (address, auth-port, acct-port, key), then **aaa authentication**, **aaa authorization**, **aaa accounting** with **group radius** and **local** fallback.

**Hands-on (Cisco IOS — conceptual):** Use RADIUS for login and accounting (e.g. for 802.1X or VPN). Replace `SERVER_IP` and `KEY` with your RADIUS server and shared secret.

```text
aaa new-model
radius server RADIUS-SERVER
 address ipv4 SERVER_IP auth-port 1812 acct-port 1813
 key KEY
exit
aaa authentication login default group radius local
aaa accounting exec default start-stop group radius
```

---

## 802.1X

**802.1X** is **port-based network access control**. A **supplicant** (client) on a port must **authenticate** before the switch grants **data** access. The switch (**authenticator**) relays the supplicant’s credentials to a **RADIUS** server (**authentication server**). If the server returns Accept, the switch opens the port (or assigns a VLAN/ACL). If not, the port stays in **unauthorized** state (only EAPOL and maybe DHCP). So only authenticated users get L2 access. On the switch: enable **dot1x system-auth-control**, set the port as **access**, **authentication port-control auto**, and **dot1x pae authenticator**; point **aaa authentication dot1x** to **group radius**. The RADIUS server must have the client identity and credentials. 802.1X is common for **wired and wireless** enterprise access and prevents unauthorized devices from using the LAN.

**Hands-on (Cisco IOS — conceptual):** Enable 802.1X on the switch so the port stays unauthorized until the client passes RADIUS authentication.

```text
dot1x system-auth-control
aaa authentication dot1x default group radius
interface GigabitEthernet0/1
 switchport mode access
 authentication port-control auto
 dot1x pae authenticator
```

---

## ASA firewall

**Cisco Adaptive Security Appliance (ASA)** is a dedicated firewall (and VPN) platform. Interfaces are assigned to **security levels** (e.g. inside = 100, outside = 0); by default traffic from higher to lower is allowed and the reverse is denied unless permitted by **ACL** or **NAT**. **nameif** gives logical names (inside, outside, DMZ). **ACLs** and **NAT** (static, dynamic, PAT) define what can cross. **Inspection** (e.g. DNS, HTTP) can apply to traffic. **Management:** SSH and HTTPS are configured per-interface with **ssh** and **http** commands; **aaa authentication ssh console** can use LOCAL or TACACS+/RADIUS. **ASA** also supports **VPN** (site-to-site and remote-access), **routing**, and **transparent** (L2) mode. Deployment patterns: perimeter (inside/outside/DMZ), and optionally multiple contexts (virtual firewalls). For hardening: restrict management, use strong auth (AAA), disable weak ciphers (e.g. **ssh cipher encryption custom** to allow only strong algorithms).

---

## References

- [GeeksforGeeks – Authentication in Computer Network](https://www.geeksforgeeks.org/computer-networks/authentication-in-computer-network/); [GeeksforGeeks – Introduction of Firewall](https://www.geeksforgeeks.org/computer-networks/introduction-of-firewall-in-computer-network/)
- [Network-Security (BFreitas16) — Firewalls & AAA](https://github.com/BFreitas16/Network-Security) (config concepts and ZBFW/AAA/802.1X/ASA)
- [1_Overview_Perimeter](./1_Overview_Perimeter.md) (firewall basics); [cloud-native/1_Cloud_Networking_Overview](../cloud-native/1_Cloud_Networking_Overview.md) (VPC, subnets)
- [NIDS & DoS](./7_Nids_DoS_Identity.md); [Attacks & mitigations](./4_Attacks_Mitigations.md)
