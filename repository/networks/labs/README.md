# Labs & Examples

Hands-on code, packet capture walkthroughs, simulators, and reference material. Each topic has a dedicated file for full-depth content. **Labs align with the rest of the repo:** transport and services (servers, capture), **observability** (SPAN, tcpdump, Wireshark), **security** (recon with dig/whois/nmap, blue team with Zeek/Suricata, attack/mitigation in isolated VMs), **routing & switching** (Packet Tracer/GNS3 for VLAN, STP, ACL, HSRP), and **cloud-native** (optional K8s/Cilium/Hubble).

## Topics

### [1. Code examples (UDP & TCP servers)](./1_Code_Examples.md)

UDP server (Node.js, C); TCP server (Node.js, C). Reinforces [Transport/](../Transport/README.md) concepts.

### [2. Packet capture walkthroughs](./2_Packet_Capture_Walkthroughs.md)

tcpdump: IP/ARP/ICMP, UDP, TCP, DNS, DHCP (DORA); where SPAN/RSPAN fits. Wireshark: UDP, TCP/HTTP, HTTP/2 (TLS decrypt), MongoDB, SSE.

### [3. Operational how-tos, simulators & tools](./3_Operational_Simulators_Tools.md)

Exposing local servers publicly; GNS3, Cisco Packet Tracer, Mininet; VIRL/dCloud/DevNet; traffic generators; Nmap/Zenmap. Lab themes aligned to repo: recon (dig, whois, nmap), Cisco (VLAN, STP, ACL, HSRP), optional K8s/Cilium.

### [4. Labs with VMs and test networks](./4_Labs_Vms.md)

Building test networks (VirtualBox, OpenWRT); hands-on security labs (recon, blue team with Zeek/Suricata/Security Onion, attack/mitigation in isolation). Links to [Security/8_Reconnaissance_Offensive](../Security/8_Reconnaissance_Offensive.md) and [Security/9_Blue_Team_Defensive](../Security/9_Blue_Team_Defensive.md).

### [5. Reference & practice](./5_Reference_Practice.md)

Computer network cheat sheet, last-minute notes, interview questions (aligned to repo topics), practice and CTF.

## Learning path

1. After [Transport/](../Transport/README.md) basics: [Code examples](./1_Code_Examples.md) → [Packet capture](./2_Packet_Capture_Walkthroughs.md) → [Simulators & tools](./3_Operational_Simulators_Tools.md) → [VMs & security labs](./4_Labs_Vms.md) → [Reference & practice](./5_Reference_Practice.md)

## Cross-references

- **Transport:** UDP/TCP semantics — use these labs to reinforce [Transport/](../Transport/README.md)
- **Observability:** [Observability/](../Observability/README.md) for tcpdump, Wireshark, SPAN/RSPAN/ERSPAN
- **Security:** [Security/8_Reconnaissance_Offensive](../Security/8_Reconnaissance_Offensive.md) (recon, nmap, dig, whois), [Security/9_Blue_Team_Defensive](../Security/9_Blue_Team_Defensive.md) (Zeek, Suricata, IR), [Security/4_Attacks_Mitigations](../Security/4_Attacks_Mitigations.md) (attack/mitigation labs)
- **Routing & switching, advanced:** [Routing-Switching/](../Routing-Switching/README.md), [Advanced/4_On_Premises_Enterprise](../Advanced/4_On_Premises_Enterprise.md) for Cisco/Packet Tracer labs
- **Cloud-native:** [Cloud-Native/2_Docker_Kubernetes](../Cloud-Native/2_Docker_Kubernetes.md) for optional container/K8s/Cilium labs
