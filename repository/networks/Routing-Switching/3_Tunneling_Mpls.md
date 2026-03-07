# Tunneling & MPLS

[← Back to Routing & Switching](./README.md)

GRE and Multi-Protocol Label Switching.

## Table of Contents

- [GRE (Generic Routing Encapsulation)](#gre-generic-routing-encapsulation)
- [MPLS](#mpls)
- [LISP (Locator/ID Separation Protocol)](#lisp-locatorid-separation-protocol)
- [References](#references)

---

## GRE (Generic Routing Encapsulation)

**GRE** is a **tunneling protocol** that wraps one network protocol inside another. It carries an **inner packet** (e.g. IP, IPv6) inside an **outer IP** packet so the inner packet can be sent across a network that might not otherwise support it. GRE itself **does not encrypt**; it only encapsulates. For security, GRE is often used together with **IPSec** (GRE over IPSec).

**Packet structure (from source):**

```text
  Outer (for routing)     Tunnel         Inner (original)
  [IP Header: GW1 → GW2] [GRE Header] [Inner Packet]
```

**Characteristics:**

- **No encryption** — Plaintext; use with IPSec if you need confidentiality.
- **Stateless** — No session or handshake; each packet is independent.
- **Low overhead** — Small GRE header.
- **Use case:** Connect branch and HQ networks over the internet so they appear directly connected (e.g. branch 10.0.0.0/24 ↔ HQ 192.168.0.0/16 over a GRE tunnel).

**Why tunneling (from source):**

1. **Protocol compatibility** — Send IPv6 over IPv4, or non-IP over IP (e.g. GRE).
2. **Network extension** — Connect remote networks as if local (site-to-site).
3. **Security** — When combined with encryption (e.g. IPSec), private traffic over public links.

**Visual flow:**

```text
  Branch (10.0.0.0/24)             Internet           HQ (192.168.0.0/16)
        |                             |                        |
        |  IP packet (inner)          |                        |
        |  src 10.0.0.1 → 192.168.1.1 |                        |
        v                             v                        v
      [GW1] ---- encapsulate ----> [IP: GW1→GW2][GRE][inner] ----> [GW2] ---- decapsulate ----> forward inner to 192.168.1.1
```

---

## MPLS

**MPLS (Multi-Protocol Label Switching)** is a packet-forwarding technique that uses **labels** instead of full IP table lookups. It sits between Layer 2 and Layer 3 (“Layer 2.5”). Routers in the MPLS core **swap labels**; the path is determined by **label distribution** (e.g. LDP — Label Distribution Protocol), so forwarding is fast and supports **traffic engineering** and **VPNs** (e.g. MPLS L3VPN).

**Why MPLS:**

- **Faster forwarding** — Short, fixed-length label lookup instead of longest-prefix match on full IP.
- **QoS and traffic engineering** — Route flows along chosen paths.
- **VPNs** — Separate customer traffic by label (MPLS does not encrypt; it isolates by path).

**MPLS header (32 bits, between L2 and L3):**

| Field | Size | Description |
|-------|------|-------------|
| **Label** | 20 bits | Identifier for forwarding (0 to 2^20−1). |
| **Exp** | 3 bits | Experimental; used for QoS / priority. |
| **S (Bottom of Stack)** | 1 bit | 1 = last label in stack. |
| **TTL** | 8 bits | Time to live; decremented each hop to prevent loops. |

Multiple labels can be **stacked** for hierarchical routing.

**Key terms:**

- **Ingress LSR** — First MPLS router; **pushes** (adds) the label.
- **Intermediate LSR** — **Swaps** label according to LFIB (Label Forwarding Information Base).
- **Egress LSR** — **Pops** (removes) the label and forwards the original IP packet.
- **CE (Customer Edge)** — Customer router at the edge.
- **PE (Provider Edge)** — Provider router at the edge; adds/removes labels.

**Forwarding process:**

1. **Ingress (Push):** CE sends IP packet to PE (ingress LSR). PE assigns a label and **pushes** the MPLS header.
2. **Core (Swap):** Intermediate LSRs forward by **label only**; each **swaps** the label to the next hop’s label.
3. **Egress (Pop):** Egress PE **pops** the MPLS header and forwards the IP packet to the CE.

**Visual flow:**

```text
  CE --[IP]--> PE (Ingress) --[push label]--> LSR --[swap]--> LSR --[swap]--> PE (Egress) --[pop]--> CE
                  |                |              |                |                |
                  +----------------+--------------+----------------+----------------+
                                    MPLS core (label switching)
```

**MPLS and VPN:**

- Traffic for different customers is isolated by **label-switched path (LSP)**; no encryption, but separation from other customers.
- Used for **Layer 3 VPNs** (L3VPN) and traffic engineering.

**Advantages:** Fast forwarding, QoS, traffic engineering, scalable L3 VPNs, loop prevention (TTL).

**Disadvantages:** More complex to configure and manage; typically used in provider/large networks; no built-in encryption (unlike VPN with encryption).

---

## LISP (Locator/ID Separation Protocol)

**LISP** separates **identity** from **location** in the network. In traditional IP, an address both **identifies** the host and **locates** it (routing is by address). LISP splits this: **EID (Endpoint Identifier)** is the “identity” (e.g. the host’s address that applications use); **RLOC (Routing Locator)** is the “location” (the address of the router that can reach that EID). The core network **routes by RLOC**; at the edge, **LISP** encapsulates packets so that **EID→EID** traffic is carried inside **RLOC→RLOC** outer headers. That allows **mobility** and **multihoming** without renumbering: when a host moves, only the **EID-to-RLOC mapping** changes; the EID itself stays the same.

### Why LISP exists

- **Mobility:** A host (or site) can change its **attachment point** (new RLOC) while keeping the same **EID**. Applications and DNS do not need to change; only the mapping database is updated.
- **Multihoming:** A site can have **multiple RLOCs** (e.g. two ISPs); the mapping can return multiple RLOCs and the sender (or ingress tunnel router) can choose or load-balance.
- **Traffic engineering:** The mapping can steer traffic by returning different RLOCs depending on policy.
- **Use in practice:** LISP is used in some **data centre** and **campus** designs (e.g. Cisco SD-Access can use LISP for host tracking and mobility).

### How it works (conceptually)

1. **Host A (EID_A)** wants to send to **Host B (EID_B)**. The packet has src = EID_A, dst = EID_B.
2. The **ingress** router (ITR — Ingress Tunnel Router) for A does an **EID-to-RLOC** lookup: “What RLOC(s) can reach EID_B?” It queries a **mapping system** (e.g. DDT, or Map-Server/Map-Resolver).
3. The mapping returns **RLOC_B** (the address of the **egress** router, ETR, that serves EID_B). The ITR **encapsulates** the original packet: **outer** header src = RLOC_A (ITR), dst = RLOC_B (ETR); **inner** header remains src = EID_A, dst = EID_B.
4. The **network core** forwards the packet by **outer** (RLOC) address. The **egress** router (ETR) **decapsulates** and forwards the inner packet toward EID_B.
5. Return traffic: ETR for B becomes ITR for the return; it looks up EID_A’s RLOC and encapsulates back.

**Visual (LISP encapsulation):**

```text
  Host A (EID_A)                Core (routes by RLOC)              Host B (EID_B)
       |                                    |                            |
       |  Packet: [src=EID_A][dst=EID_B]    |                            |
       v                                    v                            v
  [ITR] ── EID-to-RLOC lookup for EID_B ──→ Map system returns RLOC_B
       |
       |  Encapsulate:
       |  Outer: [src=RLOC_ITR][dst=RLOC_ETR]
       |  Inner: [src=EID_A][dst=EID_B]
       |
       +=========> [RLOC header][EID packet] ========> [ETR] ── decap ──→ to EID_B
                         (core forwards by RLOC only)
```

**Summary:** **EID** = who you are (identity); **RLOC** = where you are (routing locator). LISP **encapsulates** EID traffic in RLOC-addressed packets so the core can route without knowing EIDs; mapping is updated when endpoints move. Used in some SDN and campus/mobility designs.

---

## References

- [GeeksforGeeks – Multi-Protocol Label Switching (MPLS)](https://www.geeksforgeeks.org/multi-protocol-label-switching-mpls/)
- A-to-Z of Networking: VPN & Tunneling (GRE, tunneling concepts)
- [Security/6_Ipsec_Vpns](../Security/6_Ipsec_Vpns.md) (GRE over IPSec)
