# Cloud Networking Overview

[← Back to Cloud-Native](./README.md)

Cloud vs on-prem, types of cloud services, VPC/VNet, hybrid connectivity.

## Table of Contents

- [Cloud networking](#cloud-networking)
- [Types of cloud services](#types-of-cloud-services)
- [VPC / VNet](#vpc--vnet)
- [Typical AWS network architecture (diagram)](#typical-aws-network-architecture-diagram)
- [Hybrid connectivity](#hybrid-connectivity)
- [Virtualized hosts (VMware, KVM, Hyper-V): network perspective](#virtualized-hosts-vmware-kvm-hyper-v-network-perspective)
  - [Physical layer: server to switch](#physical-layer-server-to-switch)
  - [Virtual switch (vSwitch)](#virtual-switch-vswitch)
  - [Port groups and VLANs](#port-groups-and-vlans)
  - [Uplinks and L2 connectivity](#uplinks-and-l2-connectivity)
  - [Why this matters for design and operations](#why-this-matters-for-design-and-operations)
- [On-prem VM hosting](#on-prem-vm-hosting)
  - [End-to-end picture](#end-to-end-picture-what-you-are-building)
  - [Step 1: Physical layer](#step-1-physical-layer-recap-and-checklist)
  - [Step 2: VLAN plan](#step-2-vlan-plan-for-on-prem-virtualization)
  - [Step 3: IP addressing and default gateway](#step-3-ip-addressing-and-default-gateway)
  - [Step 4: Routing and internet/WAN](#step-4-routing-and-internetwan-access)
  - [Step 5: Security](#step-5-security-acls-and-firewall)
  - [Step 6: Redundancy](#step-6-redundancy-at-the-host-and-switch)
  - [Step 7: Workflow summary](#step-7-workflow-summary-what-you-do-in-order)
  - [Verification and troubleshooting](#verification-and-troubleshooting-network-side)
  - [Where to read more](#where-to-read-more-in-this-repository)
- [References](#references)

---

## Cloud networking

**Cloud networking** is the practice of **designing, deploying, and managing** network resources and services in a **cloud computing** environment. It uses **virtualized** technologies (VPCs, SDN, load balancing) for **secure, scalable** connectivity between cloud and on-premises systems. Source: [GeeksforGeeks – Cloud Networking](https://www.geeksforgeeks.org/computer-networks/cloud-networking/).

- **Cloud vs on-prem:** On-prem: you own and manage physical devices (routers, switches, cables). Cloud: the provider runs the **underlay**; you get **virtual** networks (VPCs), subnets, route tables, and managed services. You still define **logical** topology, **security** (e.g. security groups), and **hybrid** links (VPN, dedicated connect).
- **Core components (from source):** **VPCs** — isolated networks with custom IP ranges, subnets, route tables. **SDN** — centralized control and automation. **Load balancing** — traffic distribution for performance and fault tolerance. **Monitoring and optimization** — track traffic, bottlenecks, and utilization. **Virtualization** — virtual networks, subnets, and interfaces for flexible allocation and isolation.

---

## Types of cloud services

- **IaaS (Infrastructure as a Service)** — You get **VMs**, **networks** (VPC, subnets, firewalls), and storage. You manage OS, apps, and **network config** (routes, NACLs, security groups). Networking: you define VPCs, subnets, routing, and hybrid connectivity.
- **PaaS (Platform as a Service)** — You deploy **applications**; the provider runs runtimes, DBs, and often **networking** (e.g. app-level LB, private endpoints). You focus on app config; network is mostly managed.
- **SaaS (Software as a Service)** — You use **applications** over the internet. Networking is mainly **internet access**, **identity**, and optional **private access** (e.g. private link to SaaS).

---

## VPC / VNet

**VPC (Virtual Private Cloud)** or **VNet** is an **isolated** logical network in the cloud with your own **IP range**, **subnets**, and **route tables**. Source: GFG Cloud Networking.

- **Subnets** — Segments of the VPC (e.g. per tier or AZ). You assign CIDR blocks; instances get IPs from their subnet.
- **Route tables** — Define how traffic is forwarded (e.g. default route to internet gateway, or to a virtual appliance, or to a peering/transit).
- **Peering** — Connect two VPCs (same or different accounts/regions); traffic stays on the provider backbone. **Shared VPC** (e.g. GCP) or **resource sharing** lets one VPC be used by multiple projects/teams.
- **Private endpoints / Private Link** — Connect to services (e.g. object storage, PaaS) over **private IP** inside your VPC, without crossing the public internet. Improves security and can reduce exposure.

---

## Typical AWS network architecture (diagram)

AWS provides networking building blocks for secure, scalable connectivity between the internet, remote workers, data centers, and within AWS. The diagram below shows a **typical AWS network architecture** with key components. Source and image: [ByteByteGo – Typical AWS Network Architecture](https://bytebytego.com/guides/typical-aws-network-architecture-in-one-diagram/).

![Typical AWS network architecture (ByteByteGo)](../assets/cloud-native/bytebytego-typical-aws-network-architecture.png)

**Key components:**

- **VPC (Virtual Private Cloud)** — Logically isolated section of the AWS Cloud where you define a virtual network and launch resources (e.g. subnets, route tables, gateways).
- **AZ (Availability Zone)** — One or more discrete data centers in a region with redundant power, networking, and connectivity; you place subnets in one or more AZs for resilience.

**Network connectivity (flow):**

```text
  1. Internet access        →  Internet Gateway (IGW): bidirectional door between VPC and internet
  2. Remote workers         →  Client VPN Endpoint: secure access to VPC or on-prem over internet
  3. Corporate data center  →  Virtual Gateway (VGW): VPN concentrator for Site-to-Site VPN
  4. VPC to VPC            →  VPC Peering: route traffic between two VPCs via private IPv4/IPv6
  5. Many VPCs/VPNs        →  Transit Gateway: hub to connect VPCs, VPNs, and accounts
  6. AWS services (gateway)→  VPC Endpoint (Gateway): private link to S3, DynamoDB, etc. (no IGW)
  7. AWS/partner services  →  VPC Endpoint (Interface): PrivateLink for private connection (no IGW/VGW/NAT)
  8. SaaS private access   →  PrivateLink: private connectivity to SaaS on AWS or on-prem
```

Use this as a reference when designing VPCs, subnets, and hybrid connectivity; see [Hybrid connectivity](#hybrid-connectivity) and [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md) (cloud-native security groups).

---

## Hybrid connectivity

**Hybrid connectivity** links **on-premises** networks to **cloud** VPCs so workloads can communicate securely.

- **VPN** — **Site-to-site** VPN (e.g. IPSec over the internet) between your router/firewall and the cloud **VPN gateway**. Lower bandwidth, higher latency than dedicated; good for backup or small sites. See [security/6_Ipsec_Vpns](../security/6_Ipsec_Vpns.md).
- **Dedicated connections** — **AWS Direct Connect**, **Azure ExpressRoute**, **GCP Partner Interconnect**: a **private** link (e.g. from your colo or ISP) into the provider. **Higher** bandwidth, **lower** latency, more predictable; often used with **redundant** circuits and **HA** (e.g. two links, BGP).
- **HA and failover** — Use **redundant** VPN tunnels or **multiple** dedicated connections with **BGP** so that if one path fails, traffic fails over. Some designs use VPN as backup when the primary dedicated link is down.

---

## Virtualized hosts (VMware, KVM, Hyper-V): network perspective

A common scenario: a **client** has one or more **physical servers** and wants to **host** workloads on them—**VMs** (e.g. **VMware**, **Windows** guests, **Linux** guests) or server roles (e.g. application or database servers). From a **network** perspective you need to provide connectivity and segmentation from the **physical layer** (cables, NICs, switch ports) through **L2** (VLANs, vSwitch) and **L3** (IP, routing, firewall). This section covers that end-to-end at the **network** level—no deep dive into the host OS or application software.

---

### Physical layer: server to switch

Before any VM traffic can leave the host, the **physical path** must be in place. This is the same **physical layer** as in any wired network: medium, connectors, and the first point of connection to the LAN.

**Server NICs (physical network adapters)**

- The **server** has one or more **physical NICs** (network interface cards). They may be **onboard** (on the motherboard) or **add-in** (PCIe). Each NIC has one or more **ports** (RJ-45 for copper, or SFP/SFP+/QSFP cages for fibre).
- **Speed and capability:** 1 Gbps (copper, common for management or small labs), **10 Gbps**, **25 Gbps**, or higher for data. The NIC **driver** and **firmware** must match the hypervisor (e.g. VMware compatibility); from a network perspective you care that **speed/duplex** on the server side matches (or autonegotiates with) the **switch port**.
- **Uplinks** in the hypervisor are bound to these **physical NICs**. So "uplink" = logical use of a physical NIC (or a bond of several NICs) to carry VM traffic to the switch.

**Cabling: server NIC to switch port**

- **Copper** — **RJ-45** patch cable (e.g. Cat 6, Cat 6a) from the server NIC to the **switch port**. Typical for 1 Gbps and short runs (up to 100 m). Same **cabling standards** as elsewhere: correct category for the speed, good termination, no kinks or sharp bends. See [foundations/3_Physical_Layer](../foundations/3_Physical_Layer.md) (cabling standards).
- **Fibre** — **SFP/SFP+** (or QSFP for higher speeds) **transceivers** in the NIC and in the switch; **fibre patch** (multimode or single-mode) between them. Used for 10G+ and longer runs, or where electrical isolation is required. Connector type (LC, SC, etc.) and fibre type must match the transceivers.
- **One cable per physical link.** If the host has two NICs used as uplinks, you run **two cables** to the switch (or one to each of two switches for redundancy).

**Switch port (physical connection point)**

- The **switch port** that the server plugs into is the **first L2 device** in the path. It must be configured for:
  - **Speed and duplex** — Match the server (or use **autonegotiation** on both sides). Mismatch causes errors, drops, or poor performance.
  - **Trunk vs access** — For virtualized hosts you usually use a **trunk** port: **allowed VLANs** (e.g. 10, 20, 30) and optionally a **native VLAN**. The vSwitch will send **tagged** frames (802.1Q) for each VM port group; the switch must allow those VLANs. **Access** (single VLAN) is used only if the host carries one VLAN.
- **Physical placement:** In a rack, the server typically connects to the **top-of-rack (ToR)** or **access** switch. Cable length and quality matter for signal integrity; label both ends (server name, port; switch name, port) for operations.

**End-to-end path (physical layer view)**

- Traffic path from the VM to the wire: **VM** → **vNIC** (virtual adapter in the VM) → **vSwitch** (in hypervisor) → **uplink** → **physical NIC** (driver, hardware) → **cable** → **switch port**. At the **physical layer**, the bit stream leaves the **physical NIC**, travels over the **cable**, and arrives at the **switch port**. The same in reverse for receive. So when you troubleshoot "VM has no connectivity," the first checks are **physical**: link light on NIC and switch port, cable seated, correct port, speed/duplex.

**Redundancy at the physical layer**

- **Multiple NICs:** Two (or more) physical NICs on the server, each cabled to the **same switch** (different ports) or to **two different switches** (e.g. for redundancy). The hypervisor **teams** or **bonds** them: **active/standby** (one link used, the other backup) or **LACP** (both active if the switch supports LACP). From a **physical** perspective: two cables, two switch ports (or two switches); if one cable or one port fails, the other path still carries traffic.

**Visual (physical layer: server to switch):**

```text
  [VM] → vNIC → [vSwitch] → uplink → [Physical NIC] ── cable ── [Switch port]
                                      │
                                      └── One or more NICs; each NIC → one cable → one switch port.
                                          Trunk port: allows VLANs 10, 20, ... so vSwitch tagging works.
```

---

### Virtual switch (vSwitch)

- A **virtual switch** is an L2 switch **inside the hypervisor**. It connects **vNICs** (virtual NICs) of VMs to each other and to **uplinks** (physical NICs or bonds). So VM-to-VM traffic on the same host can stay local; VM-to-external traffic goes out an uplink to the **physical switch**.
- **VMware:** **vSphere Standard Switch (vSS)** per host or **vSphere Distributed Switch (vDS)** across hosts (centralized config, same concepts). **KVM:** **Linux bridge** or **Open vSwitch (OVS)**. **Hyper-V:** **Virtual Switch**. In all cases the **network** view is: VMs attach to a logical switch; that switch has **ports** (or port groups) and **uplinks** to the physical network.

**Port groups and VLANs**

- **Port group** (VMware) or equivalent is a **logical grouping** of ports with a **VLAN** and policy (e.g. “Production”, “DMZ”). You assign a VM’s vNIC to a port group; the hypervisor tags traffic from that VM with the **VLAN ID** (e.g. 802.1Q) when sending out an uplink, or leaves it untagged if the port group is for the native VLAN. So the **physical switch** sees normal **VLAN-tagged** (or untagged) frames and can put them in the right VLAN. From the physical network’s point of view, the host is a **trunk** (or access) port carrying one or more VLANs.

### Uplinks and L2 connectivity

- **Uplinks** are the **physical NICs** (or bonded NICs) that the vSwitch uses to send traffic to the **physical switch**. Traffic from VMs goes: vNIC → vSwitch → uplink → **physical NIC** → **cable** → **physical switch port**. The switch port must be configured as **trunk** (allowed VLANs) or **access** (single VLAN) to match what the vSwitch sends. **Teaming** (multiple uplinks) gives redundancy and sometimes load spreading; behavior is vendor-specific (e.g. active/standby or LACP if the physical switch supports it).

### Why this matters for design and operations

- When you **design** an on-prem network for a **client hosting VMs or server workloads**, you still define: **physical** (NIC count, cable type, switch port speed/trunk), **VLANs**, **subnets**, **routing**, and **ACLs** on the physical network. The hypervisor is an **L2 edge**: it presents one (or a few) **trunk** links to the switch. You do **not** configure the OS or applications inside the VM for basic connectivity—that is the client's responsibility. You **do** ensure: **(1)** correct **cabling** and **switch port** config (trunk, allowed VLANs, speed), **(2)** **VLAN IDs** in the vSwitch/port groups match the physical network, and **(3)** **firewall/ACL** rules apply to the VM subnets as to any other segment.
- **Deploying for a client** (VMware, Windows VMs, Linux VMs, or mixed workloads): from a **network** perspective you provide: **physical** connectivity (server NICs cabled to the right switch ports; trunk with correct VLANs); **VLAN plan** (which VLAN for which tier—e.g. management, app, data); **IP addressing** (subnets for those VLANs); **routing** (default gateway, static or dynamic routes); and **security** (ACLs/firewall at the boundary). The client's vSwitch/port group config must use the same **VLAN IDs**; the **physical layer** (cables, link up, speed) must be verified first.

**Visual (VM traffic to physical network, full path):**

```text
  VM A (vNIC) ──┐
                ├── [vSwitch] ── uplink ── [Physical NIC] ── cable ── [Switch port] ── rest of LAN
  VM B (vNIC) ──┘
  Port groups = VLAN mapping (e.g. Production = VLAN 10, DMZ = VLAN 20).
  Physical port = trunk with VLANs 10, 20 allowed; cable from server NIC to this port.
```

See [foundations/3_Physical_Layer](../foundations/3_Physical_Layer.md) for cabling and physical layer basics; [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) (Network scale spectrum, How real networks are configured) for how this fits home lab to data center; [2_Docker_Kubernetes](./2_Docker_Kubernetes.md) for **containers** (different abstraction, same need for IP/VLAN/security at the network edge).

---

## On-prem VM hosting

If you read this section and the linked topics in this repository (physical layer, VLANs, IP addressing, routing, security), you will have the **network** knowledge to **design and implement** the network for an **on-premises** environment where a **client or organization hosts everything on their own servers**—including **virtual machines** (VMware, Hyper-V, KVM, or other hypervisors) and the workloads running inside those VMs. For **on-prem container hosting** (Docker) and **on-prem container orchestration** (Kubernetes), see [2_Docker_Kubernetes](./2_Docker_Kubernetes.md) (On-prem container and orchestration hosting). This section is **factual** and **network-scoped**: it does not cover hypervisor or guest OS configuration in depth, but it does cover every **networking** step from physical cabling through L3 routing and firewall policy so that you can deliver a working, supportable design.

**Why on-prem VM hosting:** Some organizations keep workloads on-premises for **data residency**, **compliance**, **latency**, or **cost** reasons. The **network** you provide must give: **(1)** reliable **physical** connectivity from each hypervisor host to the LAN, **(2)** **segmentation** (VLANs) so that management, VM traffic, and optional specialized traffic (e.g. vMotion, storage) are separated, **(3)** **IP addressing and routing** so that VMs and management can reach each other and the rest of the world as required, and **(4)** **security** (ACLs/firewall) so that only allowed traffic flows between segments and to/from the internet.

---

### End-to-end picture: what you are building

At the end of the day, the **network** for on-prem VM hosting looks like this from your perspective:

- **Physical:** Each hypervisor server has one or more **physical NICs** connected by **cables** (copper or fibre) to **switch ports** on an **access** or **top-of-rack (ToR)** switch. That switch is part of the client’s LAN (often with an **uplink** to a **distribution** or **core** switch and then to a **firewall** or **router** for internet/WAN).
- **Layer 2:** The switch ports that the hypervisors plug into are **trunk** ports carrying **multiple VLANs**. Inside each hypervisor, a **virtual switch** (vSwitch) has **port groups** mapped to those **VLAN IDs**. So: VM in port group “Production” → VLAN 20 → tagged on the uplink → switch receives frame on VLAN 20 → forwards to the rest of the VLAN 20 segment (other VMs, or the gateway).
- **Layer 3:** Each **VLAN** has a **subnet** and a **default gateway** (usually an **SVI** on the L3 switch or an interface on the firewall). VMs get an **IP** in their subnet (via DHCP or static) and use the gateway to reach other subnets and the internet. **Routing** (static or dynamic, e.g. OSPF) connects the VM VLANs to the rest of the network and to the internet edge.
- **Security:** **ACLs** or a **firewall** restrict which traffic is allowed: e.g. **management** VLAN only from a jump host or admin subnet; **VM VLANs** allowed to talk to each other or to specific services as per policy; **internet** access via NAT/firewall with allow/deny rules.

**Visual (on-prem VM hosting, network view):**

```text
  [Hypervisor 1]                    [Hypervisor 2]
  VM-A (VLAN 20) ──┐                VM-C (VLAN 20) ──┐
  VM-B (VLAN 30) ──┼── vSwitch ──┬── uplinks ──┐     ├── vSwitch ── uplinks ──┐
  Mgmt (VLAN 10) ──┘             │             │     └────────────────────────┤
                                 │             │                              │
                    [Physical NICs]── cables  ──  [Access/ToR Switch] ◄────────┘
                                    trunk: VLANs 10, 20, 30 allowed
                                              │
                                              │ uplink
                                              ▼
                                    [Distribution / Core] ── [Firewall/Router] ── WAN/Internet
                                    SVIs: VLAN 10 → 10.0.1.0/24 gw .1
                                          VLAN 20 → 10.0.2.0/24 gw .1
                                          VLAN 30 → 10.0.3.0/24 gw .1
```

---

### Step 1: Physical layer (recap and checklist)

Before any VLAN or IP config, the **physical path** must be correct. See [Physical layer: server to switch](#physical-layer-server-to-switch) for full detail; summary here.

- **Server NICs:** Confirm each hypervisor has enough **physical NICs** for your design (e.g. two for redundancy, or more if you separate management from VM traffic on different NICs). Speed (1G, 10G, 25G) must match what the switch supports and what the client needs.
- **Cabling:** Run **one cable per NIC** (or per port used) from the **server** to the **switch**. Use **copper** (Cat 6/6a for 1G/10G) or **fibre** (SFP+/QSFP for 10G+) as appropriate; correct length and type for the run. Label both ends (server name + port, switch name + port).
- **Switch ports:** Configure the ports that the hypervisors plug into as **trunk** ports. **Allowed VLANs** must include every VLAN that the vSwitch will use (e.g. 10, 20, 30). **Speed and duplex** must match the server (or use autonegotiation on both sides). **No** mis-cabling: ensure each cable goes to the intended port.
- **Verification:** After cabling, confirm **link is up** on both the server (OS/hypervisor) and the switch (`show interface` or equivalent). If link is down, check cable, connector, and port; fix before proceeding.

---

### Step 2: VLAN plan for on-prem virtualization

You need a **VLAN plan** that both the **physical network** (switch) and the **virtual switch** (port groups) will use. The following is **common practice**; exact VLAN IDs and names are design choices—what matters is that **switch and vSwitch use the same VLAN IDs** and that traffic is segmented as required.

**Typical VLANs in an on-prem VM hosting design:**

| Purpose | Typical use | Notes (network perspective) |
|--------|-------------|-----------------------------|
| **Management** | Hypervisor management (e.g. vSphere, Hyper-V manager), vCenter if used | Restrict access (ACL/firewall): only from jump host or admin subnet. Isolated from general VM traffic. |
| **VM traffic (production)** | VMs that run applications, databases, or other workloads | One VLAN or several (e.g. app VLAN, DB VLAN) depending on segmentation. These need a default gateway and routing to the rest of the LAN and optionally the internet. |
| **vMotion / migration** (VMware) | Live migration traffic between hosts | Often a dedicated VLAN with no routing to user networks; high bandwidth, low latency. Optional if not using VMware or not using vMotion. |
| **Storage** (if iSCSI/NFS over Ethernet) | Storage traffic between hosts and storage targets | Often a dedicated VLAN; sometimes no default gateway (no routing) for security. Optional if storage is FC or local. |
| **DMZ** (optional) | VMs that need to be exposed to the internet or a less trusted zone | Separate VLAN; firewall rules control what can reach DMZ and what DMZ can reach. |

You **document** the plan (e.g. “VLAN 10 = Management, VLAN 20 = VM Production, VLAN 30 = vMotion”) and then:

- **On the switch:** Create the VLANs (if not already present) and ensure the **trunk** ports to the hypervisors **allow** these VLANs. Ensure the **native VLAN** (if used) is consistent and understood.
- **On the vSwitch:** Create **port groups** with the **same VLAN IDs** (e.g. port group “Management” → VLAN 10, “Production” → VLAN 20). Assign each VM’s vNIC to the correct port group. See [Port groups and VLANs](#port-groups-and-vlans).

**Fact:** Frames that leave the hypervisor’s uplink are **802.1Q-tagged** with the VLAN ID of the port group. The switch receives them on the trunk and forwards them only within that VLAN. So **VLAN ID consistency** between switch and vSwitch is mandatory.

---

### Step 3: IP addressing and default gateway

Each **VLAN** that needs to talk to other subnets or the internet needs an **IP subnet** and a **default gateway**.

- **Subnet per VLAN:** Assign a **CIDR block** to each VLAN (e.g. Management 10.0.1.0/24, VM Production 10.0.2.0/24). Size the subnet for the number of hosts (hypervisor management IPs, VMs, future growth). Use a consistent **addressing plan** so you can summarize or document clearly. See [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) (How real networks are configured).
- **Default gateway:** The **default gateway** for each subnet is usually the **SVI** (Switched Virtual Interface) on the **L3 switch** that has that VLAN—e.g. VLAN 10 SVI = 10.0.1.1/24, VLAN 20 SVI = 10.0.2.1/24. Alternatively, the gateway can be a **firewall** or **router** interface. VMs and hypervisor management get an IP in the subnet (e.g. 10.0.2.10) and **gateway** = 10.0.2.1. The client (or you) configures this in the guest OS or in the hypervisor for the management interface.
- **DHCP (optional):** For VM subnets, you can run **DHCP** (e.g. from a server or from the L3 switch if it supports it) so VMs get an IP automatically. **Reservations** for hypervisor management IPs are recommended so they are stable. For management and vMotion VLANs, **static** IPs are common.
- **Documentation:** Maintain an **IPAM** or spreadsheet: which subnet per VLAN, which IP is the gateway, which IPs are reserved for management, and (if applicable) DHCP range. See [observability/6_Network_Operations](../observability/6_Network_Operations.md) (inventory, IPAM).

---

### Step 4: Routing and internet/WAN access

- **Where routing runs:** The **L3 switch** (or firewall) that has the **SVIs** for the VM and management VLANs must have **routes** to the rest of the network. Typically: **default route** (0.0.0.0/0) toward the **firewall** or **internet router**; **static** or **dynamic** (OSPF, EIGRP) routes for other internal networks. So: VM → gateway (SVI) → L3 switch routing table → next hop (e.g. firewall) → internet or other site.
- **First-hop redundancy (optional but recommended):** If the gateway is on a single device and that device fails, all VMs in that subnet lose their gateway. Use **HSRP**, **VRRP**, or **GLBP** on a **pair** of L3 switches (or firewalls) so that the subnet has a **virtual gateway IP** and the other device takes over if one fails. See [routing-switching/4_Redundancy_And_Load_Balancing](../routing-switching/4_Redundancy_And_Load_Balancing.md).
- **NAT and internet:** For VMs to reach the internet, the **firewall** (or router) at the edge typically does **NAT** (e.g. PAT so many private IPs share one public IP) and **allow/deny** rules. From a network perspective, you ensure the **default route** from the VM VLANs points to that firewall and that the firewall has a **route** back to the VM subnets (or a default). The firewall config (which ports/protocols are allowed) is part of [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md).

---

### Step 5: Security (ACLs and firewall)

- **Segmentation:** Use **ACLs** on the L3 switch or **firewall rules** to control what can reach what. **Management** VLAN: allow only from a **jump host** or **admin subnet** (e.g. SSH, HTTPS to vCenter). **VM VLANs:** allow as needed (e.g. VM subnet A can talk to VM subnet B and to the internet on 80/443; block everything else by default). **vMotion/storage** VLANs: often **no routing** to user networks (stay L2-only within the segment) or only between trusted hosts.
- **Principle of least privilege:** Only open the **ports and sources** that are required. Document the rules so that changes and audits are straightforward. See [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md) and [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md) for L2/L3 hardening (e.g. DHCP snooping, ARP inspection) if the client needs them.

---

### Step 6: Redundancy at the host and switch

- **NIC teaming on the hypervisor:** Use **two or more** physical NICs per host, each cabled to the switch (or one to each of two switches). Configure **teaming** in the vSwitch: **active/standby** or **LACP**. If LACP, the **switch port** side must be in an **LACP port-channel** (two ports bundled). So: one link fails → traffic continues over the other. See [Physical layer: server to switch](#physical-layer-server-to-switch) (Redundancy at the physical layer).
- **Switch and gateway redundancy:** **Two** access switches (or ToR) with **LACP** or **STP** so the host can reach the network even if one switch fails. **First-hop redundancy** (HSRP/VRRP) so the gateway IP is always reachable. See [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) (Resiliency).

---

### Step 7: Workflow summary (what you do, in order)

1. **Gather requirements:** How many hosts? How many VLANs (management, VM, vMotion, storage, DMZ)? What subnets and gateway placement? Any compliance or firewall rules?
2. **Document:** Write down **VLAN plan** (ID and purpose) and **IP plan** (subnet per VLAN, gateway IP, DHCP range if any).
3. **Physical:** Cable each host to the switch; configure switch ports as **trunk**, **allowed VLANs**, **speed**. Verify **link up**.
4. **L2 on switch:** Create VLANs on the switch if needed; ensure trunk ports allow them. No L3 yet on VLANs that are vMotion-only or storage-only if you intend no routing.
5. **L3 on switch/firewall:** Create **SVIs** (or equivalent) for VLANs that need routing; assign **IP address** per subnet; configure **routing** (default route, static or OSPF). If using HSRP/VRRP, configure it on the pair.
6. **vSwitch (hand-off or you do it):** Create **port groups** with the **same VLAN IDs** as the switch. Bind uplinks to the correct physical NICs (or team). Assign management interface and VM vNICs to the right port groups.
7. **IP in VMs:** Configure **static** or **DHCP** in the guest (or via hypervisor) so each VM has an IP in the correct subnet and **default gateway** = that subnet’s gateway.
8. **Security:** Apply **ACLs** or **firewall** rules so management, VM, and DMZ traffic are restricted as designed.
9. **Verify:** From a VM, **ping** the gateway; **ping** another VM (same or different VLAN as allowed); **traceroute** to the internet if applicable. On the switch: `show interface`, `show vlan`, `show ip route`, `show arp`. Fix any misconfig (wrong VLAN, wrong gateway, missing route, or ACL blocking).

---

### Verification and troubleshooting (network side)

- **VM has no connectivity:** Check **physical** first (link light on NIC and switch port; cable; correct port). Then **L2:** Is the VM’s port group VLAN the same as what the switch allows on that trunk? Then **L3:** Does the VM have the correct **IP and gateway**? Can the gateway be pinged from the VM? Is there a **route** on the gateway to the VM’s subnet and back? **ACL/firewall** blocking?
- **VM cannot reach the internet:** Check **default route** on the VM (must point to the gateway). On the gateway (L3 switch/firewall): **default route** to the internet edge? **NAT** and **allow** rules on the firewall for outbound?
- **Management (vCenter, hypervisor) unreachable:** Confirm **management** is on the right VLAN and that the **trunk** allows that VLAN. Confirm **ACL/firewall** allows your **admin subnet** to reach the management VLAN on the required ports (e.g. 443, 22).

See [observability/6_Network_Operations](../observability/6_Network_Operations.md) (troubleshooting methodology) and [advanced/4_On_Premises_Enterprise](../advanced/4_On_Premises_Enterprise.md) (Cisco IOS `show` commands, console access).

---

### Where to read more in this repository

| Goal | Where to read |
|------|----------------|
| Physical cabling, NICs, link speed/duplex | [foundations/3_Physical_Layer](../foundations/3_Physical_Layer.md); this file [Physical layer: server to switch](#physical-layer-server-to-switch) |
| VLANs, trunk, 802.1Q, switch config | [foundations/4_Data_Link_Layer](../foundations/4_Data_Link_Layer.md); [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) (How real networks are configured) |
| IP addressing, subnetting, gateway | [foundations/5_Network_Layer](../foundations/5_Network_Layer.md); [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md) |
| Routing, HSRP, default route | [routing-switching/1_Routing_Fundamentals](../routing-switching/1_Routing_Fundamentals.md); [routing-switching/4_Redundancy_And_Load_Balancing](../routing-switching/4_Redundancy_And_Load_Balancing.md) |
| Firewall, ACLs, security | [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md); [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md) |
| Cisco IOS (show commands, config) | [advanced/4_On_Premises_Enterprise](../advanced/4_On_Premises_Enterprise.md) |
| Operations (IPAM, change management, troubleshooting) | [observability/6_Network_Operations](../observability/6_Network_Operations.md) |

---

## References

- [ByteByteGo – Typical AWS Network Architecture](https://bytebytego.com/guides/typical-aws-network-architecture-in-one-diagram/) (diagram; used with credit)
- [GeeksforGeeks – Cloud Networking](https://www.geeksforgeeks.org/computer-networks/cloud-networking/)
- [2_Docker_Kubernetes](./2_Docker_Kubernetes.md); [3_Sdn_Nfv](./3_Sdn_Nfv.md); [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md); [security/6_Ipsec_Vpns](../security/6_Ipsec_Vpns.md)
