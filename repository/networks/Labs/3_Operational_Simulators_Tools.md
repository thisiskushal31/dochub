# Operational How-tos, Simulators & Tools

[← Back to Labs](./README.md)

Exposing local servers; GNS3, Packet Tracer, Mininet; traffic generators; Nmap.

## Table of Contents

- [Exposing local servers publicly](#exposing-local-servers-publicly)
- [GNS3](#gns3)
- [Cisco Packet Tracer](#cisco-packet-tracer)
- [Mininet](#mininet)
- [VIRL, dCloud, Cisco DevNet sandbox](#virl-dcloud-cisco-devnet-sandbox)
- [Traffic generators](#traffic-generators)
- [Nmap / Zenmap](#nmap--zenmap)
- [Lab themes aligned to repo topics](#lab-themes-aligned-to-repo-topics)
- [References](#references)

---

## Exposing local servers publicly

To make a **local** server (e.g. dev app on localhost:8080) reachable from the **internet**: **Tunnels** (e.g. **ngrok**, **cloudflared**) create a **public URL** that forwards to your machine; **SSH reverse tunnel** (`ssh -R 80:localhost:8080 user@public-server`) uses a VPS; **port forwarding** on the **router** maps a public port to a local IP:port (less secure; use with care). See [Services/7_Servers_Access_Flows](../Services/7_Servers_Access_Flows.md) (Exposing local servers publicly). Source: Course outline (Exposing local servers publicly).

---

## GNS3

**GNS3** is a **network emulator** that runs **real** or **virtual** device images (e.g. Cisco IOS, VyOS, Docker) and connects them in **topologies**. You build **complex** multi-node networks, configure routing/switching, and **test** without physical hardware. Used for **certification** study and **design** validation. Compare **Packet Tracer** (simulation, simpler) vs **GNS3** (emulation, more flexible). Source: cybersecurity-networking, common lab references.

---

## Cisco Packet Tracer

**Cisco Packet Tracer** is a **visual** network **simulator** for **learning**: drag **switches**, **routers**, **PCs**, **cables**; configure devices via **CLI** or **GUI**; **ping** and **traceroute** to verify. Lighter than GNS3; good for **intro** and **CCNA**-style labs. See [Advanced/4_On_Premises_Enterprise](../Advanced/4_On_Premises_Enterprise.md). Source: Networking-Essentials (Cisco Packet Tracer).

---

## Mininet

**Mininet** creates **virtual** networks on a **single** machine: **hosts**, **switches**, and **links** are **processes**/namespaces. Used for **SDN** (OpenFlow) and **protocol** testing: run **controllers** (e.g. OpenDaylight) and **mininet** topologies to experiment with **programmable** forwarding. Source: SDN/Mininet documentation, cybersecurity-networking.

---

## VIRL, dCloud, Cisco DevNet sandbox

**Cisco VIRL** (Virtual Internet Routing Lab) and **dCloud** / **Cisco DevNet Sandbox** provide **official** or **cloud** labs: **pre-built** topologies (routers, switches, servers) for **Cisco** technologies, **API**, and **automation**. **DevNet** sandboxes are **browser-based** or **reservable**; useful for **practice** without local install. Source: Cisco DevNet, cybersecurity-networking (DevNet tools).

---

## Traffic generators

**Traffic generators** produce **controlled** load for **testing**: **Ostinato** (GUI, packet crafting), **iperf**/ **iperf3** (throughput), **SIPp** (SIP/VoIP), **WANem** (WAN delay/loss). Use for **QoS**, **capacity**, and **stress** tests. Source: cybersecurity-networking (traffic generators).

---

## Nmap / Zenmap

**Nmap** is a **network discovery** and **port-scanning** tool: **host discovery** (ping sweep), **port** scan (TCP/UDP), **service** and **OS** detection. **Zenmap** is the **GUI**. Used for **security** auditing, **inventory**, and **troubleshooting** (e.g. “is port 443 open?”). Run with **appropriate** authorization only (only on networks you own or have permission to scan). Source: cybersecurity-networking, common security tools.

**Commands (hands-on):** replace `target` with a hostname or IP (e.g. your own server or lab host).

```bash
# Ping sweep: which hosts are up in a subnet
nmap -sn 192.168.1.0/24

# TCP port scan: common ports on one host
nmap target
nmap -p 22,80,443 target

# Quick scan (fewer probes, faster)
nmap -T4 -F target

# Service/version detection
nmap -sV -p 22,80,443 target

# Show open ports only (quiet)
nmap --open target
```

---

## Lab themes aligned to repo topics

Use these tools together with the **concepts** in the repo for focused practice.

| Theme | What to practice | Repo reference |
|-------|------------------|----------------|
| **Recon & scanning** | `dig`, `whois`, `nmap` (host discovery, port scan, service/OS detection) on **your own** lab hosts or DevNet sandbox. Understand what each command does before running. | [Security/8_Reconnaissance_Offensive](../Security/8_Reconnaissance_Offensive.md) |
| **Cisco / enterprise** | In **Packet Tracer** or **GNS3**: VLANs, trunk/access, STP, ACLs, HSRP, basic routing (static, OSPF), `show` commands. Matches on-prem and CCNA-style content. | [Routing-Switching/](../Routing-Switching/README.md), [Advanced/4_On_Premises_Enterprise](../Advanced/4_On_Premises_Enterprise.md) |
| **SDN / programmable** | **Mininet** + OpenFlow controller (e.g. OpenDaylight) for custom forwarding and topology. | [Cloud-Native/3_Sdn_Nfv](../Cloud-Native/3_Sdn_Nfv.md) |
| **Containers / K8s (optional)** | **minikube** or **kind** with **Cilium** CNI; run `hubble observe` for flow visibility. Reinforces eBPF, Services, NetworkPolicy. | [Cloud-Native/2_Docker_Kubernetes](../Cloud-Native/2_Docker_Kubernetes.md#ebpf-cilium-and-hubble) |

---

## References

- Course outline: Exposing local servers publicly; Networking-Essentials: Packet Tracer
- [Services/7_Servers_Access_Flows](../Services/7_Servers_Access_Flows.md); [Advanced/4_On_Premises_Enterprise](../Advanced/4_On_Premises_Enterprise.md); cybersecurity-networking (GNS3, Mininet, DevNet, Nmap)
