# Switching, Resiliency & Network Design

[← Back to Routing & Switching](./README.md)

STP variants, VRF/MPLS VPNs, resiliency, validation, SD-WAN.

## Table of Contents

- [Switching advanced](#switching-advanced)
- [VRF and MPLS VPNs](#vrf-and-mpls-vpns)
- [Resiliency](#resiliency)
- [Validation](#validation)
- [Network design](#network-design)
- [SD-WAN](#sd-wan)
- [References](#references)

---

## Switching advanced

### Why loops are a problem (basics)

In a switched network, if you connect switches in a **loop** (e.g. Switch A – Switch B – Switch C – Switch A), **broadcast** and **unknown-unicast** frames are **flooded** out every port. Those frames come back on another path, get flooded again, and so on. You get a **broadcast storm**: the same frame circulates forever, links get saturated, and the network can stop working. So you need **redundancy** for resilience but must **block** loops at Layer 2. That is what **Spanning Tree Protocol (STP)** does: it builds a **loop-free logical topology** by putting some ports in a **blocking** state so that exactly one path exists between any two switches.

### Spanning Tree Protocol (STP) — how it works

**STP** (IEEE 802.1D) runs on switches that exchange **BPDUs (Bridge Protocol Data Units)**. From the BPDUs, every switch agrees on:

1. **Root bridge** — One switch is elected the root (lowest bridge ID). All paths in the tree are oriented toward the root.
2. **Root port** — On each non-root switch, the port that has the **best path to the root** (lowest cost, then lowest neighbor bridge ID, then lowest port ID) becomes the **root port**. It forwards traffic toward the root.
3. **Designated port** — On each segment (link), the port that has the best path from that segment toward the root is **designated** and forwards. The other end of the segment may be **blocking** (non-designated).
4. **Blocked port** — Ports that are neither root nor designated are **blocking**: they do not forward user traffic, so the loop is broken. They still receive BPDUs so the switch can detect topology changes.

**Bridge ID** = priority (2 bytes) + MAC (6 bytes). Lower is better. **Path cost** is based on link speed (e.g. 100 Mbps = 19, 1 Gbps = 4 in the classic cost scheme). When a link or root fails, BPDUs stop or change; after a **forward delay** (typically 15–30 seconds in classic STP), blocked ports can transition to forwarding. Classic STP is **slow to converge** (up to 30–50 seconds).

### Rapid Spanning Tree (RSTP, 802.1w)

**RSTP** speeds up convergence. Port roles are similar (root, designated, **alternate** instead of “blocked” — alternate is a backup path to the root). RSTP uses **proposal/agreement** handshakes so a port can move to forwarding in a few seconds when a link comes up, instead of waiting for timers. **Edge ports** (connected only to hosts, not switches) go to forwarding immediately. RSTP is backward-compatible with STP; in practice most networks use RSTP or **Rapid PVST+** (Cisco: per-VLAN RSTP).

### Protecting STP: BPDU guard, root guard

- **BPDU guard** — On ports that should only see hosts (edge ports), if a BPDU is received, the port is **errdisabled** (or similar). This stops a user from plugging in a switch and changing the topology or becoming root.
- **Root guard** — On a port, if a better BPDU (claiming a better root) is received, the port goes to **root-inconsistent** and does not forward. This prevents a downstream switch from taking over as root. Used on ports toward parts of the network that should not be the root.

See [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md) for **STP manipulation** (attacker sending forged BPDUs) and these mitigations.

### Link aggregation (LACP, 802.1AX) and MLAG

**Link aggregation** bundles multiple physical links into one logical link: more bandwidth and redundancy if one link fails. **LACP (Link Aggregation Control Protocol)** negotiates the bundle between two devices. **MLAG/MC-LAG** (multi-chassis LAG) lets two switches appear as one LAG peer so a server or switch can dual-attach to both and still use a single LAG. Config and behavior are vendor-specific; the idea is redundant paths without STP blocking (the LAG is one logical link, so no loop).

### VXLAN and EVPN (advanced)

**VXLAN** extends L2 segments over an L3 underlay by encapsulating Ethernet frames in UDP. Used in data centers to span VLANs across racks or sites. **EVPN (Ethernet VPN)** is a control plane for VXLAN (and other overlay types): it uses BGP to advertise MAC and IP reachability so that learning and forwarding are controlled and loops are avoided. Details are in data-center and vendor docs; the repo’s [Tunneling & MPLS](./3_Tunneling_Mpls.md) and [cloud-native](../cloud-native/README.md) sections give more context.

---

## VRF and MPLS VPNs

**VRF (Virtual Routing and Forwarding)** is a way to have **multiple independent routing tables** (and forwarding instances) on the same router. Each VRF has its own interfaces, routes, and next hops so that traffic in one VRF is isolated from another. That allows **overlapping IP address space** (e.g. two customers both using 10.0.0.0/8) on the same device without conflict.

**MPLS VPN (e.g. L3VPN):** In an MPLS network, the **provider** uses **labels** to separate customer traffic. At the **PE (Provider Edge)** router, each customer is associated with a **VRF**. When a packet arrives from a CE (Customer Edge), the PE looks up the destination in that customer’s VRF, pushes an MPLS label (or stack) that identifies the path to the remote PE and the customer, and forwards into the MPLS core. The core LSRs swap labels; the egress PE pops the label and forwards the IP packet to the correct CE. So:

- **Routing and traffic** are **handled by the service provider** (unlike a customer-managed VPN over the internet).
- **MPLS does not encrypt**; it provides **traffic isolation** by keeping each customer’s traffic on its own label-switched path (LSP) and in its own VRF.
- Used to connect **multiple sites** of the same customer with a **private** (logically separated) L3 network.

**VPN vs MPLS (from source):** VPN uses encryption and runs over the public internet; the customer often manages routing. MPLS runs on the provider’s network, uses labels and VRFs for isolation, does not encrypt, and typically offers QoS and predictable paths. See [Tunneling & MPLS](./3_Tunneling_Mpls.md) for MPLS header and LSR roles.

**Visual (simplified):**

```text
  CE-A (Site 1) --- PE1 (VRF-A, push label) --- MPLS core (swap) --- PE2 (VRF-A, pop) --- CE-B (Site 2)
  Same customer, isolated from other customers’ VRFs on PE1/PE2.
```

---

## Resiliency

**Resiliency** means the network keeps working when links or devices fail. Common patterns (from concepts already in this repo):

1. **First-hop redundancy** — Hosts use a single default gateway (virtual IP). If one router fails, another takes over ([HSRP](./4_Redundancy_And_Load_Balancing.md#hsrp), [GLBP](./4_Redundancy_And_Load_Balancing.md#glbp)). Object tracking can shift the active router when an uplink fails.
2. **Link redundancy** — Multiple links between two devices: **LACP** bundles them into one logical link (more bandwidth + one link fails, traffic continues). **STP/RSTP** blocks loops but allows a backup path; when the primary path fails, a blocked port can move to forwarding.
3. **Fast reroute** — In IP or MPLS, a precomputed backup path can be used when a link or node fails so that convergence time is short (e.g. IP FRR, MPLS local protection). Details are protocol- and vendor-specific.
4. **Failure domains** — Limit the impact of a failure: e.g. use VLANs and subnets to separate segments so a broadcast storm or misconfiguration in one segment does not take down the whole network. Hierarchy (access → distribution → core) and summarization also limit how far a bad route or failure propagates.

---


## Validation

Validation is how you check that the network behaves as intended after a change or when troubleshooting.

**Basics:** **Ping** (ICMP Echo) tests reachability and round-trip time. **Traceroute** (ICMP or UDP with increasing TTL) shows the path (each hop) and where packets stop if they don’t reach the destination. Always verify from the right place: from a host, from a router, or from both sides of a link. **Control-plane checks:** On routers, `show ip route` (or equivalent) shows the routing table; confirm the expected next hop and prefix are present. **Data-plane checks:** A route in the table doesn’t guarantee forwarding works—ACLs, policy, or broken next-hop can drop traffic. Send a test packet (ping or telnet to port) and, if needed, use **packet capture** to see where it stops. Compare **before and after** a change: save “show” output before the change and compare after to spot unintended differences.

---

## Network design

**Network design** organizes the network into **zones and layers** so it is manageable, scalable, and resilient.

- **Design zones** — Separate parts of the network by function and trust: e.g. **access** (where hosts connect), **distribution** (aggregation, policy), **core** (high-speed backbone). In a data center: access (ToR), aggregation, core. Boundaries are natural places for **ACLs**, **firewalls**, and **summarization**.
- **Scaling** — Use **hierarchy** and **route summarization** so the core does not carry every subnet; use **addressing** that allows summarization (e.g. contiguous blocks per region). As the network grows, keep a clear **addressing plan** and **documentation** (see [observability/6_Network_Operations](../observability/6_Network_Operations.md)).
- **Validated designs** — Before or after changes, validate with **ping/traceroute**, **control-plane checks** (e.g. `show ip route`), and optionally **configuration analysis** (e.g. Batfish) to catch misconfigurations. Compare **before/after** state when making changes.

**Visual (simplified layered design):**

```text
  [Access] ---- [Distribution] ---- [Core] ---- [Distribution] ---- [Access]
     |                 |                |                |                |
  Hosts/VLANs     Aggregation,       High-speed         Same             Hosts
                  policy,             backbone          roles
                  summarization
```

---

## SD-WAN

**SD-WAN (Software-Defined WAN)** is an approach to the **wide-area network** where:

- **Overlay** — Traffic is carried over one or more **underlay** transports (e.g. internet, MPLS, LTE). The SD-WAN builds an **overlay** (often encrypted tunnels) between sites and can **steer traffic** by application or policy over the best available path.
- **Control plane** — A **central controller** (or cluster) often manages policy, topology, and sometimes key distribution. Edge devices (CPE) establish tunnels and apply policies so that traffic can use the best link (e.g. low latency for VoIP, high bandwidth for backup) and **fail over** when a link fails.
- **Application-aware routing** — Policies can be defined per application or SLA (e.g. send critical apps over a premium link, bulk traffic over internet).

SD-WAN solutions are offered by many vendors (e.g. Silver Peak, Cisco, VMware). They are used to **replace or complement** traditional WAN (e.g. MPLS-only) with **internet links** and **centralized, application-driven** control. See [cloud-native](../cloud-native/README.md) for related SDN/overlay concepts.

---

## References

- IEEE 802.1D (STP), 802.1w (RSTP), 802.1AX (LACP); [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md) (STP manipulation, BPDU guard, root guard)
- [foundations/4_Data_Link_Layer](../foundations/4_Data_Link_Layer.md) (switching, VLANs)
- [GeeksforGeeks – Difference between VPN and MPLS](https://www.geeksforgeeks.org/computer-networks/difference-between-virtual-private-network-vpn-and-multi-protocol-label-switching-mpls/); Network-Security (VRF/MPLS VPNs); cybersecurity-networking (SD-WAN, network design/implementation)
