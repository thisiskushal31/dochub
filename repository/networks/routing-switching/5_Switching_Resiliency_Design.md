# Switching, Resiliency & Network Design

[← Back to Routing & Switching](./README.md)

STP variants, VRF/MPLS VPNs, resiliency, validation, SD-WAN.

## Table of Contents

- [Switching advanced](#switching-advanced)
- [VRF and MPLS VPNs](#vrf-and-mpls-vpns)
- [Resiliency](#resiliency)
- [Validation](#validation)
- [Network design](#network-design)
  - [Data center networking (spine-leaf, Clos, ToR)](#data-center-networking-spine-leaf-clos-tor)
  - [How real networks are configured (building blocks)](#how-real-networks-are-configured-building-blocks)
  - [Network scale spectrum: home lab to data center](#network-scale-spectrum-home-lab-to-data-center)
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

### Data center networking (spine-leaf, Clos, ToR)

Modern **data center** networks often use a **spine-leaf** (or **leaf-spine**) topology instead of a traditional three-tier core/distribution/access. This is the **networking level** of how today’s data centers are built.

**Why spine-leaf:**

- **Equal path counts** — Every leaf (access) is the same number of hops from every other leaf via the spine. So **east-west** traffic (server-to-server, common in DCs) has **predictable latency** and **no single choke point**.
- **Scale-out** — Add more **spine** switches to add bandwidth between leaves; add more **leaf** switches to add servers. No need to replace a single large core.
- **No STP blocking** — Spine-leaf is usually **L3 between spine and leaf** (each link is a routed link, or L2 with ECMP). So there are **no L2 loops** across the fabric and **no spanning-tree blocking**; all links can forward.
- **ToR (top-of-rack)** — The **leaf** is typically the **top-of-rack** switch: servers in the rack connect to it. The leaf connects **up** to **all** (or a set of) spine switches. So each rack’s traffic can use the full spine bandwidth.

**Clos / fat-tree:**

- A **Clos network** (or **fat-tree** in computer networks) is a **multi-stage** topology: multiple stages of switches so that between any two endpoints there are **multiple paths**. **Spine-leaf** is a **two-stage Clos**: leaf = first stage (ingress/egress), spine = middle stage. Larger DCs may use **three stages** (leaf → spine → core or super-spine).
- **Oversubscription** — The ratio of **downstream** (e.g. server) capacity to **upstream** (e.g. spine) capacity. Example: 48 servers at 25 Gbps each = 1.2 Tbps; one leaf with 4×100 Gbps uplinks = 400 Gbps to spine. Ratio 1200:400 = **3:1 oversubscription**: in the worst case (all servers sending at once to other racks), the uplinks are the bottleneck. **1:1** is non-blocking but expensive; **3:1** or **5:1** is common for cost/performance trade-off.

**Visual (spine-leaf):**

```text
  Leaf 1 (ToR)     Leaf 2 (ToR)     Leaf 3 (ToR)     Leaf 4 (ToR)
  [Server Server]  [Server Server]  [Server Server]  [Server Server]
       |                 |                 |                 |
       +--------+--------+--------+--------+--------+--------+
                |        |        |        |        |
            [Spine 1] [Spine 2] [Spine 3] [Spine 4]  ...
                |        |        |        |
       +--------+--------+--------+--------+
  Every leaf connects to every spine (or a subset). L3 or L2 with ECMP; no STP across spine.
```

**What runs in the DC at the network level:**

- **Underlay** — Usually **IP + ECMP** (equal-cost multi-path) or **BGP** for spine-leaf. Some fabrics use **VXLAN** over the underlay so L2 segments can span racks.
- **Overlay** — **VXLAN/EVPN** (see [VXLAN and EVPN](#vxlan-and-evpn-advanced)) for tenant or segment isolation. The spine-leaf underlay carries the overlay tunnels.
- **Automation** — Data center networks are often **provisioned and updated** via **automation** (NETCONF/RESTCONF, Ansible, or vendor controllers) rather than manual CLI only. See [observability/6_Network_Operations](../observability/6_Network_Operations.md) (model-driven programmability, automation).

### How real networks are configured (building blocks)

When you **configure** a real network (enterprise or data center), you typically work in layers. Nothing is “out of place” if you follow a clear order.

1. **Physical and interfaces** — Bring up ports, set speed/duplex (or auto), enable the interfaces. Without this, nothing else works.
2. **VLAN plan** — Create VLANs and assign **access** ports (one VLAN per port) or **trunk** ports (allowed VLAN list, native VLAN). Naming and numbering should match your **documentation** (e.g. VLAN 10 = HR, 20 = Engineering).
3. **IP addressing** — Assign **SVIs** (VLAN interfaces) or **L3 interfaces** with an **IP address and mask** per subnet. Use an **addressing plan** (e.g. 10.0.1.0/24 for VLAN 10, 10.0.2.0/24 for VLAN 20) so you can **summarize** at distribution/core.
4. **Routing** — Enable **static** routes or **dynamic** routing (OSPF, BGP, EIGRP). On L3 switches or routers, ensure **default gateway** or **default route** points to the right place; use **first-hop redundancy** (HSRP/VRRP/GLBP) at the access edge so hosts have one gateway IP.
5. **Redundancy and resilience** — **LACP** on links between switches; **STP/RSTP** (or disable where you use L3 only); **first-hop redundancy** for the default gateway. So the network keeps working when one link or one device fails.
6. **Policy and security** — **ACLs**, **firewall** rules, or **security groups** (in cloud) to allow only required traffic. **Management** access (SSH, SNMP) restricted to a management VLAN or ACL.
7. **Services** — **DHCP** (relay if the server is in another subnet), **DNS** (forwarding or resolver), **NTP** for time. Optional: **logging** (syslog), **monitoring** (SNMP).

**Visual (configuration layers):**

```text
  Layer 1: Interfaces up, speed/duplex
       ↓
  Layer 2: VLANs, access/trunk, STP/LACP
       ↓
  Layer 3: IP on SVIs/L3 ports, routing (static/dynamic), FHRP
       ↓
  Policy: ACLs, firewall, management access
       ↓
  Services: DHCP relay, NTP, DNS, logging
```

Document the **addressing plan**, **VLAN plan**, and **routing design** so that changes and troubleshooting are consistent. See [observability/6_Network_Operations](../observability/6_Network_Operations.md) (inventory, IPAM, change management) and [advanced/4_On_Premises_Enterprise](../advanced/4_On_Premises_Enterprise.md) (Cisco IOS, show commands).

### Network scale spectrum: home lab to data center

The **same network concepts** (L2/L3, VLANs, IP, routing, redundancy) apply at every scale. What changes is **topology**, **protocol choice**, and **automation**. Scope here is **network only**—addressing, switching, routing, and how traffic flows—so you can design or support anything from a home lab to a large data center.

**Home lab**

- **Topology:** One **router** (often combined router/switch/Wi‑Fi). One **broadband** link; one **public IP** (or CGNAT). Internal devices in one **subnet** or two (e.g. 192.168.1.0/24 and a separate VLAN for lab VMs).
- **Network level:** **NAT** at the router; **DHCP** from the router for LAN; no dynamic routing (single default route to ISP). Optional: **VLAN** on a managed switch to separate “lab” from “home” so lab traffic is isolated. No BGP/OSPF; no first-hop redundancy.
- **Use case:** Learning, labs, small services. Good for understanding IP, subnets, VLANs, and basic firewall/NAT.

**SOHO (small office / home office)**

- Similar to home lab: **single router** (or router + switch), **NAT**, **DHCP**. May have a **static public IP** from the ISP for a server or VPN. Optional **site-to-site VPN** or **client VPN** for remote access; from a network view that’s an encrypted tunnel and routing over the tunnel.
- Still **no dynamic routing** inside the LAN; optional **VLAN** for guest vs corporate. Traffic flow: LAN ↔ router ↔ internet (or VPN).

**Campus / enterprise (on-prem)**

- **Hierarchical** design: **access** (switches to desks/Wi‑Fi) → **distribution** (aggregation, VLANs, L3) → **core** (high-speed backbone). Multiple **VLANs** and **subnets**; **OSPF** or **EIGRP** (or static) for internal routing; **HSRP/VRRP** at the distribution layer so hosts have a single default gateway. **WAN** to other sites or internet via dedicated links or MPLS. **802.1X** and **ACLs** for access control. See [advanced/4_On_Premises_Enterprise](../advanced/4_On_Premises_Enterprise.md) for device-level (Cisco IOS) and [How real networks are configured](#how-real-networks-are-configured-building-blocks) for the configuration layers.

**Data center (single site, many racks)**

- **Spine-leaf** (or leaf-spine): **ToR** leaf switches per rack; **spine** layer for east-west and north-south. **L3 underlay** (BGP or OSPF) with **ECMP**; **VXLAN/EVPN** overlay for L2 segments across racks. **Automation** (NETCONF, Ansible, vendor controllers) for config and rollout. See [Data center networking (spine-leaf, Clos, ToR)](#data-center-networking-spine-leaf-clos-tor).

**Running your own data center / scaling to many racks**

- Same **spine-leaf and Clos** ideas: add **more spine** switches for bandwidth, **more leaf** switches for more racks. **Oversubscription** (e.g. 3:1) is a design choice between cost and non-blocking capacity. **Interconnect:** traffic leaves the DC via **edge routers** (BGP to ISP or exchange); **DCI (data center interconnect)** links multiple DCs (e.g. dark fibre, VXLAN or MPLS over the WAN). At “petabyte scale” or large DCs, the **network** side is still: underlay (BGP, ECMP), overlay (VXLAN/EVPN if you need L2 stretch), and **automation** for consistency. No change to the OSI stack—just more devices, more spines/leaves, and stricter operations (monitoring, flow collection, change control). See [observability/6_Network_Operations](../observability/6_Network_Operations.md).

**Visual (scale spectrum, network view):**

```text
  Home lab / SOHO          Campus / Enterprise              Data center
  ─────────────────        ─────────────────────            ─────────────
  [PCs]──[Router]──ISP     [Access]──[Dist]──[Core]──WAN    [Leaf]──[Spine]
   NAT, DHCP, 1 subnet     VLANs, OSPF, HSRP, ACLs          BGP, VXLAN, automation
   No dynamic routing      Multiple sites, 802.1X            ToR, Clos, DCI
```

**Serving clients (on-prem, VMware, vanilla VMs):** Whether the client runs **vanilla** VMs (e.g. KVM, Hyper-V), **VMware**, or physical servers, the **network** you design is the same: **VLANs** (or equivalent) for segments, **IP addressing**, **routing**, and **firewall/ACL** at the boundary. Virtualized hosts use a **virtual switch** (vSwitch) that presents **port groups** (VLANs) to VMs and **uplinks** to the physical switch; from the physical network’s view, the host is one (or a few) cables carrying tagged VLANs. See [cloud-native/1_Cloud_Networking_Overview](../cloud-native/1_Cloud_Networking_Overview.md) (virtualized hosts: network perspective).

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
