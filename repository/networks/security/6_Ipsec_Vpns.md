# IPSec & VPNs (Deep Dive)

Tunneling, IPSec (ESP/AH, NAT-T), GRE over IPSec, DMVPN, GETVPN.

## Table of Contents

- [Tunneling](#tunneling)
- [IPSec](#ipsec)
- [GRE over IPSec](#gre-over-ipsec)
- [DMVPN](#dmvpn)
- [GETVPN](#getvpn)
- [References](#references)

---

## Tunneling

**Tunneling** encapsulates one protocol inside another so traffic can cross a network that does not natively support it. Source: Network-Security (BFreitas16), A-to-Z VPN & Tunneling.

- **GRE (Generic Routing Encapsulation)** — Encapsulates an inner packet (e.g. IP) in an outer IP packet. **No encryption**; often used with **IPSec** for security. See [routing-switching/3_Tunneling_Mpls](../routing-switching/3_Tunneling_Mpls.md).
- **IPv6 over IPv4** — IPv6 packets are carried inside IPv4 tunnels (e.g. 6to4, 6in4) so IPv6 can traverse IPv4-only networks. Tunnel endpoints encapsulate/decapsulate.

```text
  Inner packet (e.g. IP) → [Outer IP][Tunnel header][Inner packet] → decapsulate at other end
```

---

## IPSec

**IPSec (Internet Protocol Security)** is an **industry-standard** suite of protocols for **authenticating** and **encrypting** IP traffic. It is built into many OSes and used for **site-to-site** and **remote-access** VPNs. Source: A-to-Z VPN & Tunneling, Network-Security.

**Modes:**

- **Transport mode** — Only the **payload** (e.g. TCP segment + data) is encrypted; the **original IP header** is unchanged. Used for **host-to-host**.
- **Tunnel mode** — The **entire** original IP packet is encrypted and wrapped in a **new IP header** (gateway addresses). Used for **gateway-to-gateway** and **site-to-site** VPNs.

**Components (from source):**

- **AH (Authentication Header)** — Integrity and authentication; **no encryption**; protects the whole packet; rarely used alone.
- **ESP (Encapsulating Security Payload)** — **Encryption and authentication**; most common; protects the payload.
- **IKE (Internet Key Exchange)** — **Phase 1:** Establish a secure channel (authenticate peers, negotiate algorithms, exchange keys). **Phase 2:** Create **IPSec Security Associations (SAs)** and session keys. Both sides must agree on IKE version (IKEv1/IKEv2), auth (pre-shared key or certificates), ciphers, hashes, DH group, and options like **NAT Traversal (NAT-T)**.

**Visual (IKE Phase 1 & 2, then ESP):**

```text
  Initiator                                                            Responder
       |                                                                   |
       |  IKE Phase 1: SA negotiation, auth, key exchange                  |
       |  (e.g. IKE_SA_INIT, IKE_AUTH)                                     |
       |<=================================================================>|
       |  IKE Phase 2: Create IPSec SAs (child SAs)                        |
       |  (e.g. CREATE_CHILD_SA)                                           |
       |<=================================================================>|
       |  Data: IP packet → ESP encrypt → [Outer IP][ESP][encrypted inner] |
       |  ────────────────────────────────────────────────────────────────>|
       |  Responder decrypts, forwards inner packet
```

**NAT-T (NAT Traversal):** When IPSec peers are behind **NAT**, ESP can be **encapsulated in UDP** (usually port 4500) so NAT can translate the outer address without breaking the ESP integrity. NAT-T is often required for remote-access or site-to-site when one or both ends are behind NAT.

**Hands-on (WireGuard — modern VPN):** WireGuard is a **simple, fast** VPN that uses UDP and modern crypto. From a **network security** perspective, you are bringing up an **encrypted tunnel** so that traffic to the peer is encrypted and authenticated. Useful for remote access or site-to-site without the complexity of full IPSec/IKE.

```bash
# List WireGuard interfaces and status. You are checking whether the tunnel is up and what the last handshake was.
sudo wg show

# Bring up a tunnel using a config file. You are starting the VPN; traffic matching the config's AllowedIPs is routed through the tunnel.
sudo wg-quick up wg0

# Tear down the tunnel.
sudo wg-quick down wg0
```

**IPSec on Linux (strongswan/libreswan):** Site-to-site and remote-access VPNs often use **strongswan** or **libreswan** with IKEv2. Config is in `/etc/ipsec.conf` and `/etc/ipsec.secrets`; you then run `ipsec start` and `ipsec up connection_name`. This is more involved than WireGuard; see your distro's IPSec docs for full setup. The **concept** is the same: you are establishing an **IPSec SA** (security association) so that traffic between peers is encrypted (ESP) and authenticated.

---

## GRE over IPSec

**GRE** provides **tunneling** (e.g. to carry routing protocols or non-IP traffic) but **no encryption**. **IPSec** provides **encryption and integrity**. **GRE over IPSec** means: the **inner** packet is encapsulated in **GRE**; the **GRE packet** is then encrypted and sent inside an **IPSec** (usually ESP) tunnel. So you get **multipoint or flexible routing** over the GRE tunnel with **confidentiality** from IPSec. Source: Network-Security (IPSec & VPNs), A-to-Z.

```text
  Original packet → GRE encapsulate → IPSec encrypt (ESP) → Outer IP → network
```

---

## DMVPN

**DMVPN (Dynamic Multipoint VPN)** is a **Cisco** design for **scalable**, **dynamic** site-to-site VPNs. Instead of a **full mesh** of static tunnels, **spokes** register with a **hub**; **tunnels** are built **on demand** between spokes (via NHRP and multipoint GRE). **IPSec** is typically used to **encrypt** the GRE traffic (**DMVPN over IPSec**). New sites can be added without reconfiguring every other site. Source: Network-Security (DMVPN, DMVPN over IPSec).

---

## GETVPN

**GETVPN (Group Encrypted Transport VPN)** is a **Cisco** design for **encrypting traffic** over a **private WAN** (e.g. MPLS) where **routing** is unchanged. Members of a **group** share a **group key** (distributed by a key server). Traffic between group members is encrypted (e.g. with IPSec) **in the path** without building point-to-point tunnels; **no tunnel IP overlay**. Used when the underlay is already trusted but **encryption in transit** is required. Source: Network-Security (GETVPN).

---

## References

- [GeeksforGeeks – PPTP](https://www.geeksforgeeks.org/computer-networks/pptp-full-form/) (tunneling); [WireGuard](https://www.wireguard.com/quickstart/) (quick start)
- A-to-Z of Networking: VPN & Tunneling (IPSec modes, AH, ESP, IKE, GRE)
- Network-Security (BFreitas16): IPSec & VPNs (Tunneling, GRE, IPv6 over IPv4, IPSec ESP/AH, NAT-T, GRE over IPSec, DMVPN, GETVPN)
- [routing-switching/3_Tunneling_Mpls](../routing-switching/3_Tunneling_Mpls.md); [security/2_Encryption_Tls](./2_Encryption_Tls.md); [security/1_Overview_Perimeter](./1_Overview_Perimeter.md)
