# Networks Deep Dive

Hands-on networking notes from physical and data-link layers through TCP/IP,
routing, security, and cloud-native networking. **This repo is structured for
full depth**—not high-level summaries. Each section has dedicated topic files
with definitions, how-it-works, examples, failure modes, and operational
checklists. Content is filled for real depth; placeholders (TBD) are where
additional detail will go.

**Start here:** [0_Start_Here.md](./0_Start_Here.md) · **Write order:** [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md) · **Deepen next:** [THIN_TOPICS.md](./THIN_TOPICS.md)

## Depth

- **Not high-level:** Concepts are explained in depth with packet-level detail,
  protocol behavior, trade-offs, and real-world failure cases where relevant.
- **Topic files:** Each section (e.g. `Foundations/`, `Transport/`) has a
  README that links to numbered topic files (e.g. `1_Basics_And_Architecture.md`).
  Use those files for the full treatment; section READMEs give the map and
  learning path.
- **Standalone:** Everything you need to read is here. Optional “Further
  reading” links at the end of topics are for extra detail or official docs
  only.
- **Hands-on commands:** Where a topic has a standard CLI or tool (e.g. ping, traceroute, dig, tcpdump, ip route, Cisco show commands), topic files include **copy-paste command examples** so you can run them without searching. Supports both Linux/macOS and Windows where relevant.

## Structure

| Section | Scope |
|--------|--------|
| **[Foundations/](Foundations/README.md)** | Basics & architecture, OSI & TCP/IP, physical (cabling, PoE)/data-link (CDP/LLDP, PPP/PPPoE)/network layers; IP, ICMP, ARP, addressing, subnetting, VLANs, routing examples. |
| **[Transport/](Transport/README.md)** | UDP & TCP deep dive: segment structure, flow/congestion control, connection states, NAT, sockets & kernel queues, MSS/MTU/PMTUD, Nagle, delayed ACK, TCP Fast Open, head-of-line blocking; other L4 protocols (QUIC, etc.). |
| **[Routing-Switching/](Routing-Switching/README.md)** | Routing fundamentals, protocols (RIP, OSPF, BGP, IGMP, PIM-SM/RPF, etc.), tunneling & MPLS (GRE, LISP), first-hop redundancy, switching & resiliency, network design (data center spine-leaf/Clos/ToR, how real networks configured, **scale spectrum: home lab to DC**), SD-WAN. |
| **[Services/](Services/README.md)** | Application layer, DNS (incl. DoQ), HTTP(S) & TLS, load balancing & proxies, web/email/protocols, session/presentation, servers & end-to-end flows. |
| **[Security/](Security/README.md)** | Network security overview (SASE/ZTNA), encryption & TLS, cybersecurity (threats, malware, DoS, config), L1/L2/L3 attacks & mitigations, firewalls & AAA (CoPP, REST API security), IPSec & VPNs, NIDS/DoS/identity, recon & blue team, applications (network perspective). |
| **[Cloud-Native/](Cloud-Native/README.md)** | Cloud networking, VPC/hybrid, **virtualized hosts (VMware, KVM, Hyper-V) network view**, Docker & Kubernetes networking (eBPF, Cilium, Hubble), SDN/NFV (P4), IoT & 5G slicing. |
| **[Observability/](Observability/README.md)** | Signals & performance, packet capture (tcpdump, SPAN/RSPAN/ERSPAN), Wireshark, QoS, security monitoring & threat hunting, network operations (monitoring, IP SLA, flow/NetFlow, NETCONF/YANG/gNMI, AI/ML, automation, inventory). |
| **[Advanced/](Advanced/README.md)** | Replacing TCP for datacenters, resource limits & failure modes, TLS 0-RTT, on-premises & enterprise (Cisco, IOS, troubleshooting, Packet Tracer), wireless & special networks (incl. 6G emerging). |
| **[Labs/](Labs/README.md)** | Code examples (UDP/TCP servers), packet capture walkthroughs, operational how-tos, simulators & tools, VMs & security labs, reference & practice. |
| **[labs-expanded/](labs-expanded/README.md)** *(new — stubs)* | Step-by-step capture and validation labs (TCP, DNS, Cilium/Hubble, firewall matrix). |
| **[home-lab/](home-lab/README.md)** *(new — stubs)* | Guided home/SOHO lab: topology, VirtualBox/OpenWRT, Packet Tracer basics. |
| **[service-mesh/](service-mesh/README.md)** *(new — stubs)* | Envoy, Istio/Linkerd control plane, mTLS east–west — complements Cloud-Native/2. |
| **[Entry-Points/](Entry-Points/README.md)** *(new — stubs)* | Doors to DevOps, Containerization, Security capstone, System Design. |

## How to use

1. **New?** Open [0_Start_Here.md](./0_Start_Here.md) for checkbox learning path.
2. **Foundations** — Layer 1–3, IP, ICMP, ARP, routing basics.
3. **Transport** — UDP/TCP internals, performance, kernel behavior.
4. **Routing & switching** — Control-plane, failure handling, validation.
5. **Services & security** — Application delivery and protection.
6. **Cloud-native & observability** — Cloud workloads and visibility.
7. **Advanced** — Edge cases and modern transport alternatives.
8. **Labs** — [Labs/](./Labs/README.md) + [labs-expanded/](./labs-expanded/README.md) + [home-lab/](./home-lab/README.md).
9. **Thin topics** — Prioritize files listed in [THIN_TOPICS.md](./THIN_TOPICS.md).

## Contributing

- Prefer concise diagrams and packet walks; add copy/paste commands where useful.
- Call out trade-offs (latency vs. reliability, east-west vs. north-south).
- Include failure modes and validation steps for each pattern.
- Topic files may contain “*(Content TBD)*” placeholders; replace with full-depth content (definitions, how it works, examples). Do not leave topics as high-level only.
