# On-Premises & Enterprise Networking

[← Back to Advanced](./README.md)

Building networks with enterprise devices; Cisco switches, IOS, routers; console; troubleshooting; Packet Tracer.

## Table of Contents

- [Building a network with enterprise devices](#building-a-network-with-enterprise-devices)
- [Cisco switches](#cisco-switches)
- [Cisco IOS](#cisco-ios)
- [Cisco routers](#cisco-routers)
- [Console connection to Cisco devices](#console-connection-to-cisco-devices)
- [Troubleshooting](#troubleshooting)
- [Packet Tracer and simulation](#packet-tracer-and-simulation)
- [References](#references)

---

## Building a network with enterprise devices

**Enterprise** networks are built with **switches** (L2, access/aggregation) and **routers** (L3, WAN, internet edge). **Physical topology**: devices are **cabled** (copper or fiber); **hierarchical** design (access → distribution → core) scales and isolates failure domains. Source: Networking-Essentials (Cisco), [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md).

---

## Cisco switches

**Cisco LAN switches** provide **access-layer** connectivity: many devices connect to the **LAN** via switch ports. Source: Networking-Essentials (Cisco LAN Switches).

- **Ports:** **Copper** (twisted-pair) for most access; **fiber** for **uplinks** or long runs. **Speed**: 10/100, **Gigabit** (10/100/1000), or higher (e.g. 40 Gbps uplinks on Catalyst 9300 48S). Choose **ports** and **speed** to match **bandwidth** needs (e.g. gigabit if internet or uplink > 100 Mbps).
- **Expandability:** **Fixed** (fixed number/type of ports) vs **modular** (chassis with **expansion** slots for line cards).
- **Manageability:** **Managed** switches run **Cisco IOS** (or similar); you can configure **VLANs**, **port security**, **STP**, and **monitoring**. **Unmanaged** switches have no config. **In-band** management: over the **network** (SSH, Telnet, HTTP). **Out-of-band**: **console** (serial) so you can access the device even when the network is down. See [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md).

---

## Cisco IOS

**Cisco IOS (Internetwork Operating System)** is the **OS** for most Cisco **routers** and **switches**. It provides **CLI** (command-line interface) for configuration and troubleshooting. Source: Networking-Essentials (Router Components, Cisco IOS).

- **CLI:** **User EXEC** (limited, `>` prompt), **Privileged EXEC** (enable, `#`), **Global config** (`config t`), **Interface/config** modes. **Command structure**: e.g. `show running-config`, `interface GigabitEthernet0/1`, `ip address 10.0.0.1 255.255.255.0`.
- **Command modes:** **Enable** to get privilege; **configure terminal** to change config; **write** or `copy run start` to save. **Abbreviation** and **tab** completion are supported.

**Useful Cisco IOS commands (hands-on):** run these in **Privileged EXEC** (`enable` first) for troubleshooting and verification. Exact syntax may vary by IOS version and device (router vs switch).

```text
# Routing table
show ip route

# Interface status and IP
show ip interface brief
show interfaces

# ARP cache
show ip arp

# Running configuration
show running-config

# Save config to NVRAM
write memory
# or
copy running-config startup-config

# Ping from the device (diagnostic)
ping 10.0.0.1
ping 8.8.8.8

# Traceroute from the device
traceroute 8.8.8.8
```

**Configuration example (static IP on an interface):**

```text
configure terminal
interface GigabitEthernet0/1
 ip address 10.0.0.1 255.255.255.0
 no shutdown
exit
write memory
```

---

## Cisco routers

**Routers** are **computers** with **CPU**, **RAM**, **ROM**, **NVRAM**, and an **OS** (e.g. **Cisco IOS**). They **route** between **networks** and connect the **LAN** to the **WAN** or internet. Source: Networking-Essentials (Router Components).

- **Components:** **CPU** (routing, switching), **RAM** (running config, tables), **ROM** (bootstrap), **NVRAM** (startup config). **Interface ports**: **Ethernet**, **serial** (WAN), **console**, **aux**.
- **Boot process:** Router **powers on**, loads **IOS** from flash, loads **startup-config** from NVRAM (or enters setup if none). See Networking-Essentials (Router Boot Process).

---

## Console connection to Cisco devices

**Console** access is **out-of-band**: you connect a **PC** (with a **serial** or **USB-to-serial** adapter) to the device’s **console port** using a **console cable** (e.g. RJ-45 to DB-9 or USB). **Terminal** settings: typically **9600 8N1**. This gives **CLI** access **before** the device has an **IP** or working **network**, so you can **recover** or **configure** when the network is down.

---

## Troubleshooting

When **configuration does not work**, use a **structured** approach: Source: observability and operations best practices.

- **Gather information:** What **changed**? What **symptoms**? **Ping**, **traceroute**, **show** commands (interfaces, routes, ARP, MAC).
- **Layer-by-layer:** **Physical** (link up? cable? wrong port?), **L2** (VLAN, STP, MAC), **L3** (IP, routing, ACL), **L4** (firewall, NAT, port). See [observability/6_Network_Operations](../observability/6_Network_Operations.md) (troubleshooting methodology).
- **Common issues:** **Wrong IP/mask/gateway**, **ACL** blocking, **VLAN** mismatch, **duplicate IP**, **routing loop**, **MTU** mismatch, **device** or **link** failure.

---

## Packet Tracer and simulation

**Cisco Packet Tracer** is a **simulator** for building and testing **small** networks (switches, routers, PCs, cables). You can **design** topology, **configure** devices (CLI or GUI), and **verify** connectivity (ping, trace). Useful for **learning** IOS basics, **subnetting**, **VLANs**, and **routing** without physical hardware. Source: Networking-Essentials (Cisco Packet Tracer). See [labs/3_Operational_Simulators_Tools](../labs/3_Operational_Simulators_Tools.md).

---

## References

- Networking-Essentials (Cisco): Cisco LAN Switches, Router Components, Cisco IOS, Router Boot Process, Packet Tracer
- [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md); [observability/6_Network_Operations](../observability/6_Network_Operations.md); [labs/3_Operational_Simulators_Tools](../labs/3_Operational_Simulators_Tools.md)
