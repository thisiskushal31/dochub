# Routing & Switching

Control-plane, routing protocols, tunneling, first-hop redundancy, switching resiliency, and network design. Each topic has a dedicated file for full-depth content.

## Topics

### [1. Routing fundamentals](./1_Routing_Fundamentals.md)

What is routing?, static vs dynamic, distance vector, link state, routing example.

### [2. Routing protocols](./2_Routing_Protocols.md)

RIP, OSPF, IS-IS, EIGRP, BGP, IGMP, multicast routing (PIM-SM, RPF).

### [3. Tunneling & MPLS](./3_Tunneling_Mpls.md)

GRE (Generic Routing Encapsulation), MPLS, LISP (Locator/ID Separation Protocol).

### [4. First-hop redundancy & load balancing](./4_Redundancy_And_Load_Balancing.md)

HSRP, GLBP, load balancing and redundancy in L3 design.

### [5. Switching, resiliency & network design](./5_Switching_Resiliency_Design.md)

Switching advanced (STP, MLAG, VXLAN/EVPN), VRF and MPLS VPNs, resiliency, validation, network design (including **data center networking**: spine-leaf, Clos, ToR, oversubscription; **how real networks are configured**—VLAN plan, IP plan, routing, redundancy, policy; **network scale spectrum**: home lab → SOHO → campus/enterprise → data center and running your own DC), SD-WAN.

## Learning path

1. [Routing fundamentals](./1_Routing_Fundamentals.md) → [Routing protocols](./2_Routing_Protocols.md) → [Tunneling & MPLS](./3_Tunneling_Mpls.md) → [Redundancy & load balancing](./4_Redundancy_And_Load_Balancing.md) → [Switching & design](./5_Switching_Resiliency_Design.md)
2. For IP and addressing basics see [Foundations/](../Foundations/README.md).

## Cross-references

- **Foundations:** IP, addressing, first-hop routing — [Foundations/](../Foundations/README.md)
- **Observability:** Traceroute, flow logs — [Observability/](../Observability/README.md)
