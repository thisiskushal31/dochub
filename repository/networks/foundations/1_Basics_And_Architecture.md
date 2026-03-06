# Basics & Architecture

[← Back to Foundations](./README.md)

Layer 1–3 foundations: what networks are, how they are built, and how hosts communicate.

## Table of Contents

- [Basics of computer networking](#basics-of-computer-networking)
- [Types of computer networks](#types-of-computer-networks)
- [Introduction to Internet](#introduction-to-internet)
- [Internet connection](#internet-connection)
- [Building a simple network](#building-a-simple-network)
- [Home network basics](#home-network-basics)
- [Network devices](#network-devices)
- [Client–server architecture](#clientserver-architecture)
- [Host-to-host communication](#host-to-host-communication)
- [References](#references)

---

## Basics of computer networking

A **computer network** is a group of connected devices that communicate with each other to share data and resources. It enables efficient communication and supports services like email, file sharing, and internet access.

### Core components

- **Nodes** — Devices such as computers, mobiles, printers, servers, routers, and switches that send or receive data.
- **Links** — The connections between nodes. They may be **wired** (Ethernet cables, optical fibre) or **wireless** (Wi‑Fi, Bluetooth, infrared).
- **Transmission media** — Carries data between devices. Wired media includes Ethernet and optical fibre; wireless includes Wi‑Fi, Bluetooth, and infrared.
- **Network devices** — Routers and switches control and direct the flow of information.

### How it works

A computer network operates by letting devices communicate and exchange data using a shared communication system:

1. **Data is packetized** — When data is sent, it is broken into small **packets** and transmitted across the network.
2. **Protocols define the rules** — Protocols define how packets are formatted, transmitted, received, and acknowledged so that data is accurate, efficient, and secure.
3. **Addressing** — Each device is identified by a unique **IP address**, which ensures data reaches the correct destination.
4. **Forwarding** — Network devices like switches and routers forward data packets along the best available path.
5. **Security** — Mechanisms such as firewalls monitor traffic and allow or block data based on security rules.

### Goals and uses of computer networks

| Goal | Description |
|------|-------------|
| **Communication and collaboration** | Email, messaging, video conferencing, and collaborative platforms. |
| **Resource sharing** | Multiple users share hardware, software, and data efficiently. |
| **Data access and sharing** | Easy access to stored data and exchange of information between users and systems. |
| **Internet and cloud access** | Access to the Internet, online services, and cloud-based applications. |
| **Cost efficiency** | Reduced operational and infrastructure costs through shared resources and centralized systems. |
| **Reliability and availability** | Backup paths and fault-tolerant mechanisms improve uptime. |
| **Scalability and growth** | Easy expansion by adding new devices and services. |
| **Security and control** | Authentication, access control, and monitoring to protect data and resources. |

---

## Types of computer networks

Computer networks are classified by **geographical area**, **transmission medium**, and **ownership/access control**.

### Classification by geographical area

| Type | Abbreviation | Coverage | Typical use | Technologies |
|------|----------------|----------|-------------|--------------|
| **Personal Area Network** | PAN | 1–10 m | Short-range between personal devices | Bluetooth, NFC, Infrared |
| **Local Area Network** | LAN | One room, building, or small campus | Home or office Wi‑Fi, fast local communication | Ethernet, Wi‑Fi |
| **Campus Area Network** | CAN | University or corporate campus | Interconnect LANs across a campus | Ethernet, fibre optics |
| **Metropolitan Area Network** | MAN | City or large town | High-speed connectivity across a city | Fibre, microwave, Metro Ethernet |
| **Wide Area Network** | WAN | Country, continent, or global | Long-distance and global communication | Leased lines, satellite, Internet |

**Examples:** Smartphone to wireless earbuds (PAN); home Wi‑Fi (LAN); college or corporate campus (CAN); city-wide ISP (MAN); the Internet (WAN).

### Classification by transmission technology

- **Broadcast network** — One node’s transmission is received by all other nodes. Each packet carries a destination address; only the intended device processes it. Shared medium; no dedicated path. Used in LANs (e.g. Wi‑Fi, bus Ethernet). Simple but performance drops as devices increase.
- **Point-to-point network** — Data goes from one node directly to another, often via intermediate devices (routers/switches). Dedicated or virtual links; routing algorithms choose the path. Used in WANs (e.g. telephone networks, leased lines, Internet). More scalable and secure than broadcast.

### Classification by ownership and access

- **Private network** — Owned and managed by an organization; access restricted to authorized users (auth, VPNs, tokens). Higher security and control. Examples: office LAN, corporate intranet, private cloud.
- **Public network** — Owned by service providers or government; accessible to the general public with little or no auth. Examples: public Wi‑Fi, mobile cellular networks, the Internet.
- **Hybrid network** — Mix of private and public; some parts restricted, others publicly accessible. Examples: online banking, enterprise cloud, corporate network connected to the Internet.

### Internetwork, intranet, and extranet

- **Internetwork** — Two or more independent networks connected to act as one logical network. The **Internet** is the largest internetwork.
- **Intranet** — Private network within an organization. Uses TCP/IP, HTTP, FTP; access via login; used for internal apps, policies, and collaboration.
- **Extranet** — Extension of an intranet giving limited access to external users (partners, vendors, customers). Often via VPN or secure web; used for B2B, supply chain, customer portals.

---

## Introduction to Internet

The **Internet** is a global network that connects millions of computers and devices, enabling communication, information sharing, and access to digital resources worldwide. Data travels in small **packets** between connected devices over wired and wireless networks.

### Internet vs. World Wide Web

- **Internet** — The infrastructure: the physical network of cables, satellites, routers, and links.
- **World Wide Web (WWW)** — A service that runs on the Internet: websites and web pages, accessed with browsers (Chrome, Safari, etc.).

### How the Internet works

- **Protocols** — Rules all devices follow. Key ones: **IP** (addresses and delivers packets), **TCP** (breaks data into packets and ensures delivery), **HTTP/HTTPS** (web), **SMTP** (email).
- **IP addresses** — Every connected device has a unique address (e.g. 192.168.1.1). Packets use it to know where to go and where they came from. The world is moving from **IPv4** to **IPv6** to support more devices.
- **Data packets** — Information (e.g. a photo or email) is split into **packets**. Each packet may take a different path; they are reassembled at the destination.
- **Components** — **DNS** turns names (e.g. google.com) into IP addresses. **ISPs** (e.g. Airtel, Jio, AT&T, Verizon) connect users to the Internet. **Servers** store and deliver websites, email, and media. **Routers** direct packets along efficient paths.

### Origins of the Web

In 1989–1991, Sir Tim Berners-Lee at CERN created the World Wide Web with **URLs**, **HTTP**, and **HTML**. Browsers like Mosaic and Netscape Navigator made the Internet widely usable by the mid-1990s.

---

## Internet connection

Basic requirements for getting online:

- **ISP (Internet Service Provider)** — Company that connects you to the Internet (e.g. cable, DSL, fibre, cellular).
- **Modem** — Converts digital data to/from the signals used on the line (e.g. cable or DSL). Connects the home/office to the ISP.
- **Router** — Connects the local network to the Internet, assigns IPs (often via DHCP), and forwards traffic. May include a **wireless access point** for Wi‑Fi.
- **Device** — Computer, phone, or other device with a network interface (Ethernet or Wi‑Fi).

Typical flow: **Device → Router → Modem → ISP → Internet.** For learning and labs, you can also build simulated networks (e.g. in Cisco Packet Tracer) without physical ISP access.

---

## Building a simple network

Building a simple network (simulated or physical) involves:

1. **Devices** — End devices (PCs, printers) and infrastructure devices (switches, routers).
2. **Media** — Cables (e.g. Ethernet) or wireless (Wi‑Fi). Devices must use the same physical and logical standards.
3. **Addressing** — Each device needs an identifier (IP address). Addresses can be assigned manually or via DHCP.
4. **Topology** — How devices are connected (star, bus, etc.). In a small LAN, a single switch with devices in a star is common.
5. **Simulation** — Tools like **Cisco Packet Tracer** let you create and configure a simulated network (switches, routers, PCs) to practice without hardware.

For physical labs: connect devices to a switch with Ethernet; configure IPs (or use DHCP); ensure the same subnet and gateway for connectivity. For more detail on enterprise devices and CLI, see [On-premises & enterprise networking](../advanced/4_On_Premises_Enterprise.md).

---

## Home network basics

A typical home network includes:

- **Router** — Often a combined router + modem + Wi‑Fi access point. Connects to the ISP, runs DHCP, and provides Wi‑Fi and Ethernet ports.
- **End devices** — Laptops, phones, smart TVs, IoT devices, connected via Wi‑Fi or Ethernet.
- **Switch** (optional) — Extra Ethernet ports when the router has too few.
- **Cabling** — Ethernet from router/switch to fixed devices; Wi‑Fi for portables.

Concepts that apply: one **subnet** (e.g. 192.168.1.0/24), **default gateway** (the router), **DNS** (often provided by the router or ISP). Security: strong Wi‑Fi password, change default router login, and consider firewall and guest network. See [Security](../security/README.md) and [Wireless & special networks](../advanced/5_Wireless_Special_Networks.md) for more.

---

## Network devices

Network devices are the physical equipment used for communication and interaction between computers. They are often described by the **OSI layer** they operate on.

### Layer 1 (Physical layer)

These devices handle raw electrical or optical signals (bits). They do not use IP or MAC addresses.

| Device | Function | Notes |
|--------|----------|--------|
| **Hub** | Central connection point for LAN devices | **Obsolete.** Forwards every incoming signal to all other ports; causes collisions and is insecure. Replaced by switches. |
| **Repeater** | Regenerates signals to extend range | Used to extend Wi‑Fi or cable runs (e.g. beyond 100 m for Ethernet). Receives a weak signal, amplifies it, and retransmits. |
| **Modem** | Modulator–demodulator | Converts digital data to/from analog for the line (e.g. telephone/cable). Connects the home or office to the ISP. |

### Layer 2 (Data link layer)

These devices use **MAC addresses** and are smarter than hubs.

| Device | Function | Notes |
|--------|----------|--------|
| **Switch** | Connects devices in a LAN | Learns MAC addresses per port; forwards frames only to the port of the destination. Reduces collisions and improves security and performance. Can be unmanaged (plug-and-play) or managed (VLANs, QoS). |
| **Bridge** | Connects two LAN segments | Filters by MAC to keep local traffic local; reduces congestion. Largely replaced by multi-port switches. |
| **Access Point (AP)** | Creates a WLAN | Bridges wired Ethernet and wireless Wi‑Fi. Does not route or assign IPs unless it is a combined “wireless router.” |

### Layer 3 (Network layer)

These devices use **IP addresses** and connect different networks.

| Device | Function | Notes |
|--------|----------|--------|
| **Router** | Connects multiple networks, forwards packets by IP | Uses a **routing table** to choose the best path. Stops broadcast traffic at the boundary, isolating networks. Connects e.g. home LAN to Internet WAN. |
| **Brouter** | Bridging router | Can route known protocols (e.g. TCP/IP) and bridge others. Rarely used today. |

### Layer 4–7 (Advanced)

| Device | Function | Notes |
|--------|----------|--------|
| **Gateway** | Translates between dissimilar networks | Converts protocols, data formats, or architectures (e.g. TCP/IP to legacy mainframe). “Internet gateway” often refers to NAT/router at the edge. |
| **Firewall** | Security at the network edge or host | Controls traffic by rules (packet filtering, stateful inspection). Can be hardware (appliance) or software (on a server/PC). |

### Summary: Hub vs. Switch vs. Router

| Feature | Hub | Switch | Router |
|---------|-----|--------|--------|
| **Layer** | Layer 1 (Physical) | Layer 2 (Data Link) | Layer 3 (Network) |
| **Address type** | None (bits) | MAC address | IP address |
| **Data flow** | Broadcast to all ports | Unicast to destination port | Route along best path |
| **Intelligence** | Dumb | Smart | Smarter |
| **Typical use** | Obsolete | Connect devices in a LAN | Connect networks (e.g. LAN to WAN) |

---

## Client–server architecture

The **client–server model** is a network architecture in which **clients** send requests for resources or services and **servers** process those requests and return responses.

### Roles

- **Client** — A device or program that requests data or services (e.g. web browser, email app).
- **Server** — A system that stores resources, manages data, and responds to client requests (e.g. web server, email server, database server).

### How it works

Communication follows a **request–response** cycle:

1. The server listens for requests (on a well-known port, e.g. 80 for HTTP).
2. The client sends a request (e.g. HTTP GET).
3. The server processes the request and returns a response (e.g. HTML, JSON).
4. The server can handle many clients concurrently (multi-threading, async I/O, load balancing).

**Visual (client–server request–response):**

```text
  Client                    Network                     Server
  ──────                    ───────                     ──────
  [Browser]  ─── request ───────────────────────────→  [Web Server]
              (e.g. GET /page)                              (port 80)
                                                         process
  [Browser]  ←── response ──────────────────────────  [Web Server]
              (e.g. HTML, 200 OK)
```

**Example (web):** User enters a URL → browser does **DNS** lookup (name → IP) → browser connects to that IP → sends **HTTP/HTTPS** request → server responds with HTML/CSS/JS and other resources → browser renders the page.

### Architecture tiers

- **2-tier** — Client talks directly to server; server does processing and data storage. Simple; scales poorly with many clients.
- **3-tier** — **Presentation** (client UI), **application** (business logic), **data** (database). Client talks to application server, which talks to the database. Better security and scalability; common in web and enterprise systems.

### Advantages and limitations

**Advantages:** Centralized data and management; consistent data from one source; access control and authentication on the server; many clients can use the same service; updates often done on the server.

**Limitations:** Server can become a bottleneck; requires reliable network; server hardware and availability cost; scaling may need load balancing, replication, and backups.

---

## Host-to-host communication

**Host-to-host communication** is the process by which two endpoints (e.g. two computers) exchange data across a network. It involves addressing, encapsulation, and hop-by-hop delivery.

### Key ideas

- **Endpoints** — Source and destination hosts, identified by **IP address** (and **port** for the application). Applications use **sockets** (IP + port) to communicate.
- **Hop-by-hop delivery** — Packets do not go directly end-to-end. Each packet is forwarded by **routers** (and **switches** at L2) from one hop to the next until it reaches the destination network and then the destination host.
- **Encapsulation** — Data is wrapped in headers (and trailers) at each layer. For example: application data → TCP segment (L4) → IP packet (L3) → Ethernet frame (L2) → bits on the wire (L1). Each layer adds addressing and control information needed for that hop or for the end system.
- **Addressing at each layer** — L2 uses **MAC addresses** (for the next hop on the same LAN); L3 uses **IP addresses** (for source and destination host); L4 uses **ports** (for the application on each host).

So “host-to-host” is achieved by: **application (socket) → transport (port, reliability) → network (IP, routing) → data link (MAC, local delivery) → physical (signals).** For the path a single packet takes, see [Routing example](./5_Network_Layer.md#routing-example). For transport details, see [Transport layer](../transport/README.md).

**Visual (hop-by-hop delivery):**

```text
  Host A (source)    Switch/Router 1    Router 2    Host B (dest)
  [App]→[L4]→[L3]→[L2]→[L1]  →  [L1]→[L2]→[L3]  →  ...  →  [L1]→[L2]→[L3]→[L4]→[App]
       port   IP    MAC                  Each hop: L2 (MAC) changes;
                                         L3 (IP) and L4 (ports) stay end-to-end.
```

---

## References

- [GeeksforGeeks – Basics of Computer Networking](https://www.geeksforgeeks.org/computer-networks/basics-computer-networking/)
- [GeeksforGeeks – Types of Computer Networks](https://www.geeksforgeeks.org/computer-networks/types-of-computer-networks/)
- [GeeksforGeeks – Introduction to Internet](https://www.geeksforgeeks.org/computer-science-fundamentals/introduction-to-internet/)
- [GeeksforGeeks – Network Devices](https://www.geeksforgeeks.org/computer-networks/network-devices-hub-repeater-bridge-switch-router-gateways/)
- [GeeksforGeeks – Client-Server Model](https://www.geeksforgeeks.org/system-design/client-server-model/)
