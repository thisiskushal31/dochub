# DHCP (Dynamic Host Configuration Protocol)

[← Back to Services](./README.md)

How DHCP assigns IP addresses and other network configuration to hosts. Covers components, DORA, message types, relay, lease, and security.

## Table of Contents

- [Where does DHCP sit in the TCP/IP and OSI models?](#where-does-dhcp-sit-in-the-tcpip-and-osi-models)
- [What is DHCP and why is it used?](#what-is-dhcp-and-why-is-it-used)
- [Components of DHCP](#components-of-dhcp)
- [DHCP packet format](#dhcp-packet-format)
- [Working of DHCP: DORA](#working-of-dhcp-dora)
- [Other DHCP messages](#other-dhcp-messages)
- [DHCP relay](#dhcp-relay)
- [Lease and renewal](#lease-and-renewal)
- [DHCP and IPv6 (DHCPv6)](#dhcp-and-ipv6-dhcpv6)
- [Security concerns and mitigations](#security-concerns-and-mitigations)
- [References](#references)

---

## Where does DHCP sit in the TCP/IP and OSI models?

**DHCP is an application-layer protocol**, not a transport-layer protocol. In both the **TCP/IP model** and the **OSI model**:

- **Application layer** — DHCP defines the **message format** (Discover, Offer, Request, ACK, etc.), **options** (gateway, DNS, lease time), and **client–server behaviour**. That is application-layer semantics.
- **Transport layer** — DHCP **uses** the transport layer to carry its messages. It runs over **UDP** (server port **67**, client port **68**). So the **transport layer** provides UDP; DHCP is one of the **applications** that sit on top of it, like DNS (also over UDP) or HTTP (over TCP).

So: **DHCP belongs in the Application layer**; it is documented under [Services](../README.md) (application-layer services). The **Transport layer** section in this repo covers **UDP and TCP** themselves—the protocols that DHCP and other applications use. You are not wrong to associate DHCP with “getting an IP” (network configuration); the point is that the **protocol that does the configuration** (DHCP) is implemented at the application layer and uses UDP as its transport.

---

## What is DHCP and why is it used?

**DHCP (Dynamic Host Configuration Protocol)** automatically assigns **IP address**, **subnet mask**, **default gateway**, **DNS servers**, and other options to hosts so they can join a network without manual configuration. It runs at the application layer over **UDP**: server port **67**, client port **68**. Without DHCP, every device would need a static IP and gateway/DNS entered by hand; DHCP centralizes configuration and avoids address conflicts when hosts join or leave.

---

## Components of DHCP

- **DHCP client** — Any device (PC, phone, printer, IoT) that requests an IP and options. Sends Discover; receives Offer; sends Request; receives Acknowledge (or NAK).
- **DHCP server** — Holds an **IP address pool** (scope), optional **reservations** (fixed IP for a MAC), and **options** (gateway, DNS, domain name, NTP, etc.). Allocates leases and responds to Discover/Request.
- **DHCP relay** — Router or switch that **forwards** DHCP messages between clients and server when they are on **different subnets**. The client still broadcasts Discover; the relay sends it (usually unicast) to a configured server and forwards replies back.
- **Lease** — Time period for which the assigned IP is valid. The client must **renew** (or rebind) before expiry to keep the same address.
- **Options** — Additional parameters in DHCP messages: default gateway (option 3), DNS servers (option 6), domain name (option 15), and many others (RFC 2132).

**Commands (hands-on): DHCP client — request or release a lease**

```bash
# Linux (dhclient): request a new lease on interface eth0
sudo dhclient -v eth0

# Release lease
sudo dhclient -r eth0

# Some distros use NetworkManager; then:
nmcli general status
nmcli device status
# Renew via NM: reconnect the connection for that device, or
sudo nmcli connection down "Wired connection 1" && sudo nmcli connection up "Wired connection 1"
```

```powershell
# Windows: release and renew all adapters
ipconfig /release
ipconfig /renew

# For a specific adapter (e.g. "Ethernet")
ipconfig /release "Ethernet"
ipconfig /renew "Ethernet"
```

Use these when troubleshooting “no IP” or after changing DHCP server or scope; the client will go through DORA again.

---

## DHCP packet format

DHCP reuses the **BOOTP** message format. Main fields:

| Field | Size | Purpose |
|-------|------|---------|
| **op** | 8 bits | Message type: 1 = Boot Request (client→server), 2 = Boot Reply (server→client). |
| **htype, hlen** | 8+8 bits | Hardware type and length (e.g. Ethernet: 1, 6). |
| **hops** | 8 bits | Set by relays; incremented per relay. |
| **xid** | 32 bits | **Transaction ID** — client sets it; request and reply share it so client can match them. |
| **secs** | 16 bits | Seconds since client started trying to acquire/renew. |
| **flags** | 16 bits | e.g. broadcast flag (client has no IP yet, so server may need to broadcast reply). |
| **ciaddr** | 4 bytes | **Client IP address** — filled if client already has an IP (e.g. renewal). |
| **yiaddr** | 4 bytes | **Your IP address** — the address offered/assigned by the server. |
| **siaddr** | 4 bytes | **Server IP address** — DHCP server that sent the reply. |
| **giaddr** | 4 bytes | **Gateway IP address** — set by **relay**; server uses it to know which subnet the client is on and to send reply back. |
| **chaddr** | 16 bytes | **Client hardware address** (e.g. MAC). |
| **sname, file** | 64+128 bytes | Optional server hostname and boot file (legacy BOOTP). |
| **options** | Variable | DHCP options (message type, lease time, gateway, DNS, etc.). |

**Message type** is carried in options as **option 53** (DHCP Message Type): Discover (1), Offer (2), Request (3), ACK (5), NAK (6), Decline (4), Release (7), Inform (8).

---

## Working of DHCP: DORA

The normal sequence for a client that has **no IP** is **DORA**: Discover → Offer → Request → Acknowledge.

```
  Client (no IP)                   Network                         DHCP Server
  ─────────────                    ───────                        ────────────
       |                             |                                  |
       |  DHCP Discover (broadcast)  |                                  |
       |  src: 0.0.0.0, dst: 255.255.255.255:67                         |
       |  xid = X, chaddr = MAC      |                                  |
       |─────────────────────────────|────────────────────────────────> |
       |                             |   DHCP Offer (unicast or bcast)  |
       |<────────────────────────────|──────────────────────────────────|
       |  yiaddr = offered IP        |   xid = X                        |
       |                             |                                  |
       |  DHCP Request (broadcast)   |                                  |
       |  "I choose this server & IP"|                                  |
       |  xid = X, requested IP      |                                  |
       |─────────────────────────────|─────────────────────────────────>|
       |                             |   DHCP ACK                       |
       |<────────────────────────────|──────────────────────────────────|
       |  yiaddr = assigned IP       |   lease, gateway, DNS            |
       |                             |                                  |

  Client configures interface with assigned IP and options.
```

1. **DHCP Discover** — Client **broadcasts** (src 0.0.0.0, dst 255.255.255.255:67) because it has no IP and does not know the server. Contains **Transaction ID (xid)** and **chaddr** (MAC). Any DHCP server (or relay) can receive it.
2. **DHCP Offer** — Server (or relay) replies with an **offered IP** in **yiaddr**, lease time, gateway, DNS, and **Server Identifier** (option 54). Reply can be unicast to the client’s MAC or broadcast (e.g. if client set broadcast flag). **xid** matches Discover.
3. **DHCP Request** — Client **broadcasts** again to say “I accept this offer from this server.” Contains **Requested IP** (option 50) and **Server Identifier** (option 54). Other servers that had offered see this and release their offered addresses.
4. **DHCP Acknowledgment (ACK)** — The chosen server confirms and sends final **yiaddr**, lease, and all options. Client **configures** its interface and starts using the IP. If the server cannot grant (e.g. address now in use), it sends **NAK** instead.

---

## Other DHCP messages

- **DHCP NAK (Negative Acknowledgment)** — Server sends NAK when the client’s Request is invalid: e.g. requested IP not in scope, already leased to someone else, or client moved to another subnet. Client must **restart** from Discover.
- **DHCP Decline** — Client sends Decline when it finds the offered IP **already in use** (e.g. after gratuitous ARP / conflict detection). Server marks the address as unavailable and may offer another.
- **DHCP Release** — Client voluntarily **releases** its lease (e.g. on shutdown or disable interface). Server can reuse the IP. Often omitted on ungraceful disconnect; server relies on **lease expiry**.
- **DHCP Inform** — Client **already has** an IP (e.g. static or from another source) and only wants **options** (DNS, domain, NTP). Server replies with ACK containing options only; no address assignment.

---

## DHCP relay

When the **DHCP server** is on a **different subnet** than the client, **broadcasts** (Discover/Request) do not cross routers. A **DHCP relay agent** (on the client’s subnet, usually on the router) listens for DHCP client messages (UDP 67/68), puts its own IP in **giaddr**, and **forwards** the message **unicast** to one or more configured DHCP servers. The server uses **giaddr** to know the client’s subnet, chooses an address from the matching scope, and sends the reply to **giaddr** (the relay). The relay then delivers it to the client (broadcast on the local segment if needed). So a single central DHCP server can serve many subnets.

---

## Lease and renewal

- **Lease time** — Configured on the server (e.g. 24 hours). Stored in the lease and sent in options (e.g. option 51).
- **Renewal (T1)** — Typically at **50%** of lease, the client sends **Request** (unicast) to the server that gave the lease. If the server ACKs, lease is extended.
- **Rebind (T2)** — If renewal fails, at **87.5%** of lease the client **broadcasts** Request to reach any server. If a server ACKs, lease continues; otherwise the client stops using the IP after lease expiry and can restart DORA.

---

## DHCP and IPv6 (DHCPv6)

**DHCPv6** (RFC 8415) assigns IPv6 addresses and options (e.g. DNS) in IPv6 networks. It uses **UDP ports 546 (client)** and **547 (server)** and can work alongside **SLAAC** (Stateless Address Autoconfiguration). **Prefix delegation** (DHCPv6-PD) allows a router to get a prefix from an ISP and assign /64s to subnets. Message types include Solicit, Advertise, Request, Reply, Renew, Rebind, Release, and Information-Request (similar to Inform).

---

## Security concerns and mitigations

- **No built-in authentication** — Anyone on the LAN can send Discover/Request; a **rogue DHCP server** can offer malicious gateway/DNS and intercept or redirect traffic (MITM).
- **Rogue DHCP server** — Attacker runs a server and gives clients a bad gateway/DNS (e.g. for phishing). **Mitigation:** **DHCP Snooping** on switches: only **trusted** ports (toward the real DHCP server) are allowed to send DHCP replies; client ports only accept DHCP and only from trusted direction.
- **DHCP starvation** — Attacker sends many Discover/Request with **spoofed MACs** to exhaust the pool; legitimate clients get no address. **Mitigation:** Rate limiting, port security (limit MACs per port), and DHCP snooping with limits on leases per port.
- **Malicious options** — Wrong DNS (option 6) can redirect traffic. Snooping and monitoring (e.g. audit logs of assigned IPs and options) help detect abuse.

See [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md) for DHCP attacks in the security section.

---

## References

- [GeeksforGeeks – Dynamic Host Configuration Protocol (DHCP)](https://www.geeksforgeeks.org/computer-networks/dynamic-host-configuration-protocol-dhcp/)
- RFC 2131 – DHCP; RFC 2132 – DHCP options; RFC 8415 – DHCPv6
- [Application overview – protocols](./1_Application_Overview.md); [Security – DHCP attacks](../security/4_Attacks_Mitigations.md)
