# SDN & NFV

[← Back to Cloud-Native](./README.md)

Software-defined networking and network functions virtualization.

## Table of Contents

- [SDN (Software-Defined Networking)](#sdn-software-defined-networking)
- [NFV (Network Functions Virtualization)](#nfv-network-functions-virtualization)
- [Programmable data plane (P4, optional)](#programmable-data-plane-p4-optional)
- [References](#references)

---

## SDN (Software-Defined Networking)

**SDN** separates the **control plane** (deciding how traffic should flow) from the **data plane** (forwarding packets). The **control plane** is moved to a **centralized controller** (or distributed control cluster); **switches and routers** become **forwarding elements** that receive rules from the controller. Source: Networking-Essentials (Cisco), GFG Cloud Networking.

- **Traditional:** Each device runs its own **control plane** (routing protocols, ACL logic) and **data plane** (forwarding). Config is **per device**.
- **SDN:** A **centralized SDN controller** (typically on a server) **manages** how the data plane of switches and routers handles traffic. The controller **orchestrates** communication between **applications** and **network elements**. Benefits: **centralized** management, **automation**, **programmability** (APIs), **agility** (change policy without touching every box). Used in data centers (e.g. OpenFlow-style or vendor SDN) and **cloud** (virtual networks, overlay control). See [Routing-Switching/5_Switching_Resiliency_Design](../Routing-Switching/5_Switching_Resiliency_Design.md) (SD-WAN).

**Visual (control vs data plane):**

```text
  Traditional:                    SDN:
  ┌─────────────────┐             ┌─────────────────┐
  │ Control plane   │             │ Central         │
  │ (per device)    │             │ controller      │
  └────────┬────────┘             └────────┬────────┘
           │                                │ rules / flow table
  ┌────────▼────────┐             ┌────────▼────────┐
  │ Data plane      │             │ Switches (data   │
  │ (forwarding)    │             │  plane only)     │
  └─────────────────┘             └─────────────────┘
```

---

## NFV (Network Functions Virtualization)

**NFV** runs **network functions** (firewall, load balancer, router, DPI, etc.) as **software** on **standard hardware** (e.g. x86 servers) instead of **dedicated appliances**. Source: GFG Cloud Networking (virtualized infrastructure), common NFV definitions.

- **Virtualized network functions (VNFs)** — Each function (e.g. vFirewall, vLB) runs in a **VM or container**. They can be **scaled**, **placed**, and **chained** (e.g. traffic → vFirewall → vLB → app) via orchestration.
- **Relation to SDN:** SDN controls **forwarding and topology**; NFV provides **flexible deployment of functions**. They are often used together: SDN steers traffic to the right **VNF** and between segments.

---

## Programmable data plane (P4, optional)

**P4 (Programming Protocol-Independent Packet Processors)** is a **language** and **model** for describing how **programmable switches** and **NICs** process packets. It sits at the **data plane**: you **define** the **parser** (which headers to extract), **match-action** tables (e.g. match on L2/L3/L4, then forward, drop, or modify), and **control flow** in code; the **target** (e.g. Tofino, BMv2 software switch) compiles and runs it. From a **network** perspective, P4 enables **custom** forwarding logic (e.g. in-band telemetry, load balancing, firewalling) **without** changing silicon for each use case.

**Why it matters (optional / advanced):**

- **Protocol independence** — You are not limited to “fixed” Ethernet + IP + TCP; you can **parse** and **act** on custom headers or new protocols (e.g. INT — In-band Network Telemetry).
- **Research and niche deployment** — P4 is used in **academic** and **data centre** projects (e.g. programmable load balancers, congestion control, visibility). It is **not** required for CCNA/CCNP or typical enterprise roles but appears in **advanced** SDN and **network systems** curricula.
- **Relation to SDN** — The **control plane** (e.g. SDN controller) can **populate** P4 tables (via **P4Runtime** or similar); the **data plane** is **programmed** in P4. So: **P4 = programmable data plane**; **SDN = who controls it**.

**Visual (P4 pipeline):**

```text
  Packet in
       │
       ▼
  ┌─────────────┐
  │ P4 parser    │  Extract headers (Eth, IP, TCP, custom, …)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Match-action │  Table 1: L2? → output port
  │ tables       │  Table 2: L3? → next hop, decrement TTL
  │ (programmable)  Table 3: custom logic
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Deparser    │  Emit modified headers
  └──────┬──────┘
         │
         ▼
  Packet out
```

**Takeaway:** P4 is **optional** for a general networking overview; it is useful to **know it exists** for **programmable data planes** and **advanced** SDN. For hands-on, see P4 tutorials and BMv2; for production, it is mostly in **specialized** or **research** environments.

---

## References

- Networking-Essentials (Cisco): Network Virtualization and SDN, SDN Architecture
- [GeeksforGeeks – Cloud Networking](https://www.geeksforgeeks.org/computer-networks/cloud-networking/)
- [1_Cloud_Networking_Overview](./1_Cloud_Networking_Overview.md); [Routing-Switching/5_Switching_Resiliency_Design](../Routing-Switching/5_Switching_Resiliency_Design.md)
