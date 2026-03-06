# Routing Protocols

[← Back to Routing & Switching](./README.md)

RIP, OSPF, IS-IS, EIGRP, BGP, IGMP.

## Table of Contents

- [RIP](#rip)
- [OSPF](#ospf)
- [IS-IS](#is-is)
- [EIGRP](#eigrp)
- [BGP](#bgp)
- [IGMP](#igmp)
- [Multicast routing: PIM-SM and RPF](#multicast-routing-pim-sm-and-rpf)
- [References](#references)

---

## RIP

**RIP (Routing Information Protocol)** is a **distance-vector** protocol. Routers advertise their routing table to neighbours periodically (e.g. every 30 s). Metric is **hop count**; maximum is **15** (16 = unreachable). Uses **Bellman–Ford**; slow convergence; **split horizon** and **poison reverse** reduce loops. **RIPv1** is classful; **RIPv2** supports VLSM and sends updates to multicast. Simple but not suitable for large or fast-changing networks. See [Routing fundamentals](./1_Routing_Fundamentals.md#distance-vector-routing).

---

## OSPF

**OSPF (Open Shortest Path First)** is a **link-state** protocol. Each router floods **link-state advertisements (LSAs)** so all routers in an **area** have the same topology; each runs **Dijkstra** to compute shortest paths. **Cost** is typically derived from link bandwidth. Supports **areas** (backbone area 0, stub areas) to scale. **Hello** packets maintain neighbour relationships; updates are **incremental** on topology change. Supports VLSM and converges quickly. Common in enterprise and ISP internal networks.

---

## IS-IS

**IS-IS (Intermediate System to Intermediate System)** is also **link-state**. Originally for ISO CLNP; extended for IP (**Integrated IS-IS**). Uses **level** hierarchy (Level 1 within an area, Level 2 between areas). Like OSPF: each node floods link state, runs a shortest-path algorithm (often Dijkstra). Widely used in **ISP backbones** and large carrier networks. No IP dependency in the base protocol; runs over Layer 2.

---

## EIGRP

**EIGRP (Enhanced Interior Gateway Routing Protocol)** is a **hybrid** protocol (Cisco-proprietary, now partly documented). Combines distance-vector behaviour with **DUAL** (Diffusing Update Algorithm) for loop-free convergence. Sends **partial** updates only when topology changes; uses **composite metric** (bandwidth, delay, load, reliability). **Neighbour table** and **topology table**; no periodic full-table advertisements. Fast convergence; supports VLSM and unequal-cost load balancing.

---

## BGP

**BGP (Border Gateway Protocol)** is a **path-vector** protocol used for **inter-domain** routing (between **autonomous systems**, ASes). Routers exchange **path attributes** (AS path, next hop, communities, etc.); **path selection** uses a defined order (e.g. local preference, AS path length, origin, MED). **Route filtering**, **communities**, and **graceful shutdown** (send withdraws before going down) are common in practice. BGP does not guarantee shortest path; policy (business relationships) drives many decisions. The de facto protocol for the global internet routing table.

---

## IGMP

**IGMP (Internet Group Management Protocol)** is used for **multicast** group membership: hosts tell their local **multicast router** which multicast groups they want to receive. The router then forwards multicast traffic for those groups onto the LAN. Works with multicast routing (e.g. PIM). **IGMP snooping** on switches restricts multicast forwarding to ports with interested hosts. See [foundations/5_Network_Layer](../foundations/5_Network_Layer.md) for multicast addressing; network layer protocols (ICMP, IGMP) are also covered there.

---

## Multicast routing: PIM-SM and RPF

**IGMP** handles **host membership** on the LAN (“I want group G”). **Multicast routing** decides **how** multicast packets from a **source** are delivered to **all routers** that have interested receivers. **PIM (Protocol Independent Multicast)** is the common protocol; **PIM-SM (Sparse Mode)** is widely used in enterprise. **RPF (Reverse Path Forwarding)** is the rule that prevents loops and ensures each multicast packet is accepted only on the “correct” interface (the one toward the source).

### Why multicast routing is different

Unicast routing answers: “what is the **one** next hop toward destination D?” Multicast routing answers: “given **source S** and **group G**, which **interfaces** should forward this packet?” Traffic flows along a **tree** (shared or source-based) from the source to all receivers. Routers must **not** forward the same packet back toward the source (that would create loops). **RPF** enforces that: accept a multicast packet only if it **arrived on the interface that is the next hop toward the source** (in the unicast routing table).

**Visual (RPF check):**

```text
  Multicast packet from source S (e.g. 192.168.1.10) for group 239.1.1.1
  arrives on interface Eth1.

  Router's unicast table: "To reach 192.168.1.10, next hop is out Eth1."

  RPF check: Did the packet arrive on Eth1?  YES → accept and forward per PIM tree.
             Did the packet arrive on Eth2?  NO  → drop (would be loop or wrong path).
```

If the packet arrives on the **wrong** interface (e.g. it came from a path that is not the shortest to the source), the router **drops** it. So every router accepts a given (S, G) packet on **at most one** interface, and forwards it out **downstream** interfaces that have interested receivers or downstream PIM neighbors. That gives **loop-free** multicast forwarding.

### PIM-SM (Sparse Mode) in brief

- **Sparse** means: receivers are **spread out**; we do not assume every router might want every group. So we use a **meeting point**: the **RP (Rendezvous Point)**.
- **Flow:** A **receiver** (or its DR) sends **IGMP** for group G. The **last-hop router** (toward the receiver) sends a **PIM Join** toward the **RP** for group G. The **first-hop router** (near the source) **registers** the source with the RP (sends unicast to RP; RP joins back toward the source). Multicast traffic from the source flows **to the RP** and then **down the shared tree** to receivers. Optionally, the last-hop router can **switch** to a **shortest-path tree** (SPT) directly to the source for lower latency.
- **RP:** Can be **static** (configured on all routers) or **dynamic** (e.g. BSR — Bootstrap Router — or Anycast RP). All joins and registers go toward the RP so the tree is built.

**Visual (PIM-SM tree):**

```text
  Source S (192.168.1.10)                    RP (Rendezvous Point)
        |                                            |
        |  Register (unicast to RP)                   |
        |  ────────────────────────────────────────→|
        |                                            |
        |  (S,G) or (*,G) traffic                    |
        |  ←─────────────────────────────────────────  (shared tree: RP → R)
        |                                            |
        v                                            v
  First-hop router                            Last-hop router
  (near source)                               (near receiver R)
                                                    |
                                              IGMP Join from R
                                                    |
                                                    v
                                              Receiver R (group G)

  Tree: S → first-hop → … → RP → … → last-hop → R.
  RPF at each hop: packet from S must arrive on interface toward S.
```

### RPF check in practice

- **Input:** Multicast packet with **source S** and **group G**; it **arrived on interface I**.
- **Lookup:** Use **unicast** routing table (or separate multicast RIB) to find: “which interface is the **next hop toward S**?”
- **Decision:** If that interface is **I**, the packet **passed** RPF; forward it out downstream interfaces (per PIM state). If not, **drop** the packet (failed RPF).
- **Result:** No duplicate receipt of the same packet; no loops.

**Summary:** **IGMP** = “who on the LAN wants group G?” **PIM-SM** = “how do we build a tree from source (or RP) to all receivers?” **RPF** = “accept packet only on the interface that is toward the source,” which keeps multicast loop-free and correct.

---

## References

- [GeeksforGeeks – What is Routing?](https://www.geeksforgeeks.org/computer-networks/what-is-routing/) (main protocols)
- [GeeksforGeeks – Network Layer Protocols](https://www.geeksforgeeks.org/computer-networks/network-layer-protocols/) (IGMP, ICMP)
- [Routing fundamentals](./1_Routing_Fundamentals.md)
