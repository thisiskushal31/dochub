# Data Link Layer

[← Back to Foundations](./README.md)

The data link layer is the second layer in the OSI model. It is responsible for **node-to-node delivery** of data within the same local network, ensuring error-free transmission over the physical layer. It hides hardware complexity from upper layers and handles framing, addressing, access control, flow control, and error control.

## Table of Contents

- [Data link layer in OSI model](#data-link-layer-in-osi-model)
- [Switching](#switching)
- [Virtual LAN (VLAN)](#virtual-lan-vlan)
- [Framing](#framing)
- [Error detection and correction](#error-detection-and-correction)
- [Error control in data link layer](#error-control-in-data-link-layer)
- [Flow control (data link)](#flow-control-data-link)
- [Stop-and-wait ARQ, Go-Back-N, Selective Repeat](#stop-and-wait-arq-go-back-n-selective-repeat)
- [Piggybacking](#piggybacking)
- [Link aggregation (LACP)](#link-aggregation-lacp)
- [Layer 2 discovery: CDP and LLDP](#layer-2-discovery-cdp-and-lldp)
- [PPP and PPPoE (point-to-point and WAN)](#ppp-and-pppoe-point-to-point-and-wan)
- [References](#references)

---

## Data link layer in OSI model

### Role

- **Node-to-node delivery** — Transmits data between adjacent nodes (same local network). Does not route across networks; that is the network layer’s job.
- **Encoding, decoding, organizing** — Receives packets from the network layer, turns them into frames, and passes bits to the physical layer; on receive, reassembles frames and passes packets up.
- **Error-free transmission** — Uses error detection (and optionally correction) and retransmission (ARQ) to deliver frames reliably over a noisy channel.
- **Complexity hiding** — Abstracts physical layer details (media, signalling) from upper layers.

### Sub-layers

1. **Media Access Control (MAC)** — Manages how devices access the physical medium; addresses frames with MAC addresses; divides packets into frames and sends them bit-by-bit to the physical layer.
2. **Logical Link Control (LLC)** — Multiplexing; flow of data between applications and services; error reporting and acknowledgments.

### Functions

- **Framing** — Breaks the packet into frames with clear boundaries; see [Framing](#framing).
- **Physical (MAC) addressing** — Adds source and destination MAC addresses in the frame header.
- **Access control** — When the medium is shared, determines which device may transmit (e.g. CSMA/CD, token passing).
- **Flow control** — Matches send rate to receiver capacity; see [Flow control](#flow-control-data-link).
- **Error control** — Detects and corrects (via retransmission) damaged or lost frames; see [Error control](#error-control-in-data-link-layer).

### Protocols and devices

**Protocols:** PPP, HDLC, SDLC, SLIP, LAP, LCP, NCP (and Ethernet at MAC).

**Devices:** Switch, bridge, NIC, wireless access point (WAP), Layer 2 switches. All use **MAC addresses** for frame delivery.

### Limitations and security

- **No routing** — Only delivers within the same segment; cannot make routing decisions.
- **Limited scope** — No end-to-end delivery across different networks.
- **Overhead** — Headers, trailers, and redundancy (e.g. FCS) increase frame size.
- **Attacks** — MAC spoofing, ARP poisoning target this layer; understanding frames and devices helps with detection and mitigation.

### Applications

- Point-to-point links (e.g. PPP).
- LANs: switches and MAC addressing for frame forwarding.
- Wireless: IEEE 802.11 (Wi‑Fi) for media access and error control.
- Ethernet (IEEE 802.3) for wired LANs.

---

## Switching

**Switching** is the process of transferring data from one device to another within the same network (or toward a router for other networks) using **switches**. It occurs at the **Data Link Layer (Layer 2)**; data is forwarded as **frames** based on **MAC addresses**.

- A switch connects multiple devices; it reads the **destination MAC** from the frame and forwards the frame to the correct port (or floods if the MAC is unknown).
- For traffic outside the local network, the switch forwards to a **router**.
- Switching reduces interference by sending frames only to the intended device instead of broadcasting to all.

### How a switch forwards frames

1. **Frame reception** — The switch receives a frame from a port.
2. **MAC extraction** — Reads the destination MAC address from the frame header.
3. **Lookup** — Consults the MAC (switching) table for that address.
4. **Forwarding** — If the address is found, sends the frame to the corresponding port; if not found, **floods** the frame to all ports except the incoming one.
5. **Table update** — Learns the **source** MAC and port and updates the MAC table for future use.
6. **Frame transmission** — Delivers the frame to the destination device or toward the next hop.

**Visual (switch forwarding):**

```text
  [PC-A] -----port1----- [SWITCH] -----port2----- [PC-B]
    MAC-A                  |           MAC-B
                           +-----port3----- [PC-C]
                                  MAC-C

  MAC table (after learning):
    MAC-A  → port1
    MAC-B  → port2
    MAC-C  → port3

  Frame to MAC-B from port1: switch forwards only out port2 (unicast).
  Frame to unknown MAC:      switch floods out port2 and port3 (not port1).
```

### Types of switching (by path/message handling)

| Type | Description | Path | Efficiency | Typical use |
|------|-------------|------|------------|-------------|
| **Circuit switching** | Dedicated path established before transmission; reserved for the whole session. | Fixed, dedicated | Bandwidth reserved even when idle; low delay after setup | Traditional telephone networks |
| **Message switching** | Entire message stored at each intermediate node, then forwarded. | No dedicated path | Very inefficient (store-and-forward of full message) | Obsolete (e.g. old telegraph) |
| **Packet switching** | Data split into packets; each packet carries destination address; packets may take different paths; reassembled at destination. | Dynamic/virtual | High; good bandwidth use; delay varies | Internet, modern networks |

**Packet switching** is the basis of the Internet: packets may follow different routes; at the destination they are reassembled. Error control and retransmission provide reliability.

---

## Virtual LAN (VLAN)

A **Virtual LAN (VLAN)** is a **logical segmentation** of a Layer 2 network that groups devices into separate **broadcast domains** independent of physical location. VLANs are implemented on switches using **IEEE 802.1Q** frame tagging. Without VLANs, all devices on a switch share one broadcast domain; with VLANs, a single physical switch can support multiple logical networks.

- **Same VLAN** — Devices in the same VLAN communicate directly within that broadcast domain.
- **Different VLANs** — Communication between VLANs requires **inter-VLAN routing** (router or Layer 3 switch with SVI).

### VLAN ID ranges (Cisco)

- **VLAN 1** — Default VLAN; all ports belong to it by default; used for control/management (STP, CDP, VTP); cannot be deleted.
- **VLAN 2–1001** — Normal range; configurable, stored in VLAN database.
- **VLAN 1002–1005** — Reserved for legacy (FDDI, Token Ring); cannot be removed.
- **VLAN 1006–4094** — Extended range; often require VTP transparent mode; stored in running config.
- **VLAN 0, 4095** — Reserved by IEEE 802.1Q for protocol use; not configurable.

### Types of VLAN links

- **Access link** — Connects an end device (e.g. PC) to a VLAN-aware switch. Frames are **untagged** and belong to a single VLAN assigned to that port.
- **Trunk link** — Connects VLAN-aware devices (switch-to-switch, switch-to-router). Carries traffic for **multiple VLANs** using **IEEE 802.1Q tagging** (4-byte tag in the frame).
- **Hybrid link** — Supports both tagged and untagged on the same link; often vendor-specific.

**Visual (access vs trunk):**

```text
  Access link (PC to switch):     Trunk link (switch to switch):
  Frame: [Eth][Payload]           Frame: [Eth][802.1Q tag][Payload]
         no VLAN tag; port            VLAN ID in tag; one link
         defines VLAN                 carries many VLANs

  PC ──────[access, VLAN 10]────── SW1 =======[trunk]======= SW2
           untagged                         tagged (VLAN 10, 20, …)
```

### VLAN features

- **VLAN tagging (802.1Q)** — Inserts a 4-byte tag into Ethernet frames to identify the VLAN.
- **VLAN membership** — By port, MAC address, or protocol.
- **VLAN trunking** — Multiple VLANs over one physical link between switches.
- **Dynamic VLANs** — Membership assigned by policy or authentication.

### Pros and cons

**Pros:** Broadcast isolation; better security and performance; logical grouping (e.g. by department); flexibility (move devices without recabling); cost-effective (fewer physical networks).

**Cons:** More complex configuration; troubleshooting can be harder; misconfiguration can allow VLAN hopping; limited VLAN ID space in very large designs.

### Example configuration (Cisco-style)

Create VLANs, then assign access ports:

- Create VLAN 2 (e.g. name Accounts), VLAN 3 (e.g. HR).
- Set port to `switchport mode access` and `switchport access vlan 2` (or 3). Devices in different VLANs need inter-VLAN routing to talk to each other.

---

## Framing

**Framing** is the data link layer function of turning a stream of bits into **frames** — structured units with boundaries, addressing, and often error-detection information. A **frame** is the unit of transmission at Layer 2: it carries data plus control information (addresses, FCS, etc.).

### Purpose

- Define **frame boundaries** so the receiver can identify the start and end of each frame.
- Carry **source and destination addresses** for correct delivery.
- Support **error detection** (and sometimes correction) via trailer/header fields (e.g. FCS).
- Enable **synchronization** between sender and receiver.

Framing is used in Ethernet, Token Ring, Frame Relay, and in TDM (time slots). The process is transparent to the user.

**Generic frame structure:**

```text
  ┌─────────────┬─────────────┬─────────────┬──────────┬─────────────┐
  │   Header    │  Addresses  │  Length/    │  Payload │  Trailer    │
  │ (delimiter) │ (Src, Dst)  │  Type      │  (data)  │ (FCS / CRC) │
  └─────────────┴─────────────┴─────────────┴──────────┴─────────────┘
       ↑                              ↑                      ↑
  Start of frame              Optional length           Error check
  (sync / SFD)                or protocol type          (e.g. Ethernet FCS)
```

### Types of framing

#### 1. Fixed-size framing

Frames have a **fixed length**. No explicit start/end delimiters; the receiver uses the known size to find boundaries.

- **Drawback** — **Internal fragmentation**: if data is smaller than the frame size, padding is used, wasting bandwidth.
- **Advantage** — Simple; no delimiter ambiguity.

#### 2. Variable-size framing

Frame boundaries are indicated by **delimiters** or a **length field**.

- **End delimiter (ED)** — A special bit or character pattern marks the end of the frame (e.g. Token Ring). If that pattern can appear in data, **stuffing** is needed.
- **Length field** — Frame header includes the length of the frame (e.g. Ethernet). If the length field is corrupted, the receiver can misalign.

To avoid confusion when the delimiter appears in data:

- **Character/byte stuffing** — If data contains the delimiter character (e.g. `$`), an escape character (e.g. `\O`) is inserted so the receiver does not treat it as delimiter. Example: `$` in data → `\O$`. Used in character-oriented protocols; higher overhead.
- **Bit stuffing** — The delimiter is a bit pattern (e.g. `011111`). Whenever five consecutive 1s appear in data, a 0 is inserted so the pattern is not mistaken for the delimiter. Used in bit-oriented protocols (e.g. HDLC).

### Challenges in framing

- **Synchronization** — Sender and receiver must agree on frame boundaries, especially at high speed.
- **Overhead** — Headers and trailers reduce usable bandwidth.
- **Error handling** — Noise can corrupt data or delimiters; CRC/checksum in the frame helps detect errors.
- **Compatibility** — Different devices may use different framing; mismatches cause misinterpretation.
- **Efficiency** — Balancing payload size, overhead, and processing delay.

---

## Error detection and correction

**Error detection** identifies that transmitted data has been corrupted (e.g. by noise, interference, or distortion). The sender adds **redundant bits**; the receiver checks them. If an error is detected, the frame is typically discarded and retransmission is requested (see error control).

**Error correction** attempts to **fix** the error (e.g. via forward error correction, FEC) or to recover correct data by retransmission. FEC is more complex and costly and is used selectively (e.g. in wireless or deep-space links).

### Types of errors

- **Single-bit error** — Exactly one bit is flipped in the data unit.
- **Burst error** — Two or more consecutive (or nearby) bits are corrupted.

### Error detection methods

| Method | Idea | Pros | Cons |
|--------|------|-----|------|
| **Simple parity** | One extra bit so total number of 1s is even (or odd). | Simple. | Fails when an **even** number of bits are wrong; weak for noisy channels. |
| **Two-dimensional parity** | Parity per row and per column. | Can detect more multi-bit errors; can **correct** single-bit errors (locate row/column). | Parity bits themselves can be corrupted; some patterns still undetected. |
| **Checksum** | Data split into segments; segments added (e.g. 1’s complement); complement of sum sent as checksum. Receiver recomputes and checks. | Fast, simple; used in IP, TCP, UDP. | Some error patterns can cancel out; less strong than CRC. |
| **CRC (Cyclic Redundancy Check)** | Data treated as polynomial; divided by a generator polynomial; remainder (CRC) sent. Receiver divides; zero remainder ⇒ no error. | Strong detection of single-bit, multi-bit, and burst errors; used in Ethernet, HDLC, USB. | More computation; detection only (no correction by CRC alone). |

**CRC in brief:** Append (k−1) zeros to the message; perform modulo-2 division by the generator (length k); remainder is the CRC (k−1 bits). Codeword = message + CRC. Receiver divides by the same polynomial; zero remainder ⇒ accept.

---

## Error control in data link layer

**Error control** ensures that frames sent by the sender are received **correctly** by the receiver. It covers:

- **Detecting** errors (using the techniques above).
- **Correcting** errors by **retransmission** when a frame is lost or corrupted (and optionally by FEC).

The main mechanism is **ARQ (Automatic Repeat Request)**: if an error is detected or an acknowledgment is not received in time, the sender **retransmits** the frame(s) until they are successfully received.

### Stop-and-Wait ARQ

The sender sends **one frame** at a time and **waits** for an **ACK** from the receiver before sending the next. If the ACK is not received within a timeout, the sender retransmits the same frame.

- **Pros:** Simple; reliable.
- **Cons:** Poor link utilization on high-latency or high-bandwidth links because the sender is idle while waiting.

### Sliding window ARQ

The sender may have **multiple frames** in flight (within a window) without waiting for an ACK after each one. This improves utilization. Two main variants:

#### Go-Back-N ARQ

- Sender can send up to **N** frames (window size) without waiting for ACKs.
- Receiver sends ACKs for correctly received frames.
- If a frame is **lost or corrupted**, the receiver **discards that frame and all following frames** and does not accept them. The sender eventually **retransmits the lost/corrupt frame and every frame after it** in the window.
- **Pros:** Simple (receiver needs no buffer for out-of-order frames).
- **Cons:** Unnecessary retransmissions (all subsequent frames are resent even if they arrived correctly).

#### Selective Repeat ARQ

- Only **lost or corrupted** frames are retransmitted. Correctly received frames are **accepted and buffered** at the receiver even if earlier frames are missing.
- Receiver sends individual ACKs (or NAKs); sender retransmits only frames that are NAK’d or timed out.
- **Pros:** Fewer retransmissions; better efficiency.
- **Cons:** More complex (buffering and tracking at receiver; larger sequence space to avoid ambiguity).

**Summary:** In Go-Back-N, one error causes retransmission of that frame and all subsequent frames in the window. In Selective Repeat, only the bad frame(s) are retransmitted.

**Visual (sliding window and retransmit):**

```text
  Go-Back-N (frame 2 lost):
  Sender:  [0][1][2][3][4] ...  (sends 0,1,2,3,4)
  Receiver: 0  1  X  -  -       (accepts 0,1; discards 2,3,4)
  Sender gets ACK for 1; timeout → retransmits 2,3,4,5,...

  Selective Repeat (frame 2 lost):
  Sender:  [0][1][2][3][4] ...
  Receiver: 0  1  X  3  4       (buffers 3,4; NAK or no ACK for 2)
  Sender retransmits only frame 2; receiver delivers 2,3,4 in order.
```

---

## Flow control (data link)

**Flow control** is a mechanism that **controls the rate** at which the sender sends data so that the receiver is not overwhelmed. It matches the **transmission rate** to the **receiver’s capacity** (and sometimes to network conditions), preventing buffer overflow and data loss.

### Why it matters

- Prevents **buffer overflow** and **data loss** at the receiver.
- Balances **transmission rate** and **receiver memory/processing**.
- Accommodates different **speeds** and **processing capabilities** between sender and receiver.
- Regulates how many frames may be sent before acknowledgments (or other feedback).

### Approaches

**Feedback-based flow control** — The receiver sends explicit feedback (e.g. ACKs, window updates). The sender sends data only after or in line with this feedback and adjusts its rate. Used in TCP and many data link protocols.

- **Ready-signal handshaking** — Data is sent only when the receiver signals readiness.
- **Credit-based** — Receiver gives “credits” (e.g. buffer space); sender may send one frame per credit; credits are restored as the receiver consumes data. Used in high-speed protocols (e.g. Fibre Channel).

**Rate-based flow control** — The sender transmits at a **fixed or agreed rate** without continuous feedback. Used in streaming and some hardware. Techniques include traffic shaping, policing, token bucket, and leaky bucket.

### Techniques (data link context)

1. **Stop-and-wait** — Send one frame; wait for ACK; then send next. Simple but low utilization.
2. **Sliding window** — Send multiple frames (window) before ACKs; window slides as ACKs arrive. Better utilization; used with Go-Back-N or Selective Repeat for error recovery.

Flow control also helps with **fairness** (multiple connections sharing a link), **stability** (no overload), and **throughput** (efficient use without loss).

---

## Stop-and-wait ARQ, Go-Back-N, Selective Repeat

These are **ARQ** schemes that combine **flow control** (how many frames can be in flight) with **error recovery** (what to retransmit when something goes wrong). See [Error control in data link layer](#error-control-in-data-link-layer) for the main ideas; summary below.

| Scheme | Frames in flight | On error/loss | Retransmit | Complexity |
|--------|------------------|---------------|------------|------------|
| **Stop-and-Wait ARQ** | 1 | Wait for ACK or timeout | Same frame | Low |
| **Go-Back-N ARQ** | Up to N (window) | Receiver discards from error frame onward | Error frame + all subsequent in window | Medium |
| **Selective Repeat ARQ** | Up to N (window) | Receiver buffers correct frames, reports missing/corrupt | Only missing/corrupt frames | Higher (buffers, sequence numbers) |

Sliding window (Go-Back-N and Selective Repeat) allows **pipelined** transmission: multiple frames can be in transit before ACKs return, improving throughput compared to stop-and-wait.

---

## Piggybacking

**Piggybacking** is a technique in which the **receiver** does not send a **standalone ACK** immediately; instead, it **delays** the ACK and **attaches it to the next outgoing data frame** (in the same frame). So one frame carries both **data** and **acknowledgment**, reducing the number of separate control frames and improving efficiency.

### How it works

- If the receiver has **both** data to send and an ACK to send, it sends **one frame** containing both (ACK + DATA).
- If the receiver has **only** an ACK, it may wait a short time to see if data becomes ready; if not, it sends the ACK alone (to avoid excessive delay).
- If the receiver has **only** data and this is the last data (or no more data soon), it includes the **last** ACK in that data frame.

The sender identifies ACK and data from the **frame header** (e.g. sequence numbers, ACK field). Unacknowledged packets are retransmitted after a **timeout**.

### Benefits and trade-offs

**Benefits:** Fewer frames on the wire; less overhead; better use of bandwidth; lower latency in **full-duplex** links where both sides send data.

**Trade-off:** If the receiver **waits too long** for outgoing data before sending the ACK, the sender may **time out** and **retransmit** unnecessarily, reducing efficiency. So the wait time for piggybacking must be bounded (e.g. by a short timer).

Piggybacking is most useful in **bidirectional** (full-duplex) communication where both sides regularly send data; then ACKs are often carried along with data instead of in separate frames.

**Visual (piggybacking):**

```text
  Without piggybacking:          With piggybacking:
  A → B: [DATA 1]                A → B: [DATA 1]
  B → A: [ACK 1]                 (B has data to send; waits briefly)
  A → B: [DATA 2]                B → A: [ACK 1 + DATA 2']   (one frame)
  B → A: [ACK 2]                 A → B: [ACK 2' + DATA 3]   (one frame)

  Fewer frames on the wire; lower overhead when both sides send data.
```

---

## Link aggregation (LACP)

**Link Aggregation** combines **multiple physical Ethernet links** into a **single logical link** (LAG / EtherChannel). **LACP (Link Aggregation Control Protocol)** is the IEEE standard protocol that **automatically negotiates and manages** this aggregation between devices.

### Benefits

- **Higher bandwidth** — Combined capacity of the member links (e.g. 4×1 Gbps → 4 Gbps logical).
- **Redundancy** — If one physical link fails, traffic continues on the others (**failover**).
- **Load balancing** — Traffic is distributed across the active links (e.g. by hash of MAC, IP, or TCP/UDP port).
- **Single logical link** — Upper layers see one connection; no need to run a separate routing or spanning-tree topology per link.

### LACP in brief

- **Standards:** IEEE 802.3ad (original), IEEE 802.1AX (current).
- **Group size:** Up to **16** physical ports in a group; typically up to **8** active, rest standby.
- **Modes:** **Active** — port sends LACP PDUs to negotiate and maintain aggregation. **Passive** — port responds to LACP but does not initiate; aggregation forms only if the peer is active.
- **LACPDUs** — Exchanged at a multicast MAC (01:80:C2:00:00:02). **Fast** timer ≈ 1 s, **slow** (default) ≈ 30 s.
- **Failover** — If a link goes down, LACP marks it out of the bundle and traffic uses the remaining links.
- **Load distribution** — Hashing (e.g. on MAC, IP, TCP/UDP ports) decides which member link is used for each flow to avoid reordering within a flow.

### Layers involved

- **Layer 1** — Multiple physical links form one logical channel.
- **Layer 2** — Ports are grouped into one aggregation; MAC and framing handled over the logical link.
- **Layer 3** — Load balancing often uses IP (and L4) in the hash for distribution.

### Configuration (example: Cisco)

- Put interfaces in the same **channel-group** with **mode active** (LACP).
- Verify with `show etherchannel summary`.

**Limitations:** Both ends must support LACP and be configured compatibly; VLAN handling must be consistent; poor hash choice can cause reordering or uneven use of links.

---

## Layer 2 discovery: CDP and LLDP

**Layer 2 discovery protocols** let switches and routers **advertise and learn** information about **directly connected neighbors** (device type, hostname, IP address, capabilities, port, VLAN). They run over the data link layer and do not require IP to be configured. Used for **topology discovery**, **inventory**, **troubleshooting** (“what is on the other end of this port?”), and **PoE negotiation** (e.g. LLDP can carry power requirements).

### CDP (Cisco Discovery Protocol)

- **Vendor:** Cisco-proprietary; supported only on Cisco devices.
- **Default:** Enabled on **all** Cisco interfaces (unless disabled).
- **Information exchanged:** Device ID (hostname), IP address (management), capabilities (switch, router, etc.), platform, port ID, VLAN, duplex, native VLAN. Can also advertise **PoE** requirements (CDP power).
- **Transport:** Sends periodic **multicast** frames (destination MAC `01:00:0C:CC:CC:CC`); neighbors receive and process but do **not forward** CDP.
- **Security:** CDP **leaks** device and topology information. On **untrusted** or **external** ports, disable CDP (or use receive-only) so attackers cannot enumerate your gear.

**Visual (what CDP reveals):**

```text
  Switch-A (Gi0/1)  ←── CDP ──→  (Gi0/1) Switch-B
       │                                │
       │  Advertises:                   │  Advertises:
       │  - Hostname: Switch-A          │  - Hostname: Switch-B
       │  - IP: 10.0.0.1                │  - IP: 10.0.0.2
       │  - Capability: Switch          │  - Capability: Switch
       │  - Port: Gi0/1                  │  - Port: Gi0/1
       │  - Platform: Cisco C9300       │  - Platform: Cisco C9300
       └────────────────────────────────┘

  Both sides build a neighbor table; "show cdp neighbors" lists connected devices.
```

### LLDP (Link Layer Discovery Protocol)

- **Standard:** IEEE **802.1AB**; vendor-neutral. Supported by Cisco, Juniper, Aruba, and many others.
- **Default:** On Cisco, LLDP is often **disabled** by default (enable with `lldp run`).
- **Information exchanged:** Same kind of data as CDP: chassis ID, port ID, TTL, optional TLVs (management address, port description, system name, system capabilities, VLAN, **LLDP-MED** for VoIP and power). **PoE** negotiation often uses LLDP (e.g. power required, power allocated).
- **Transport:** Sends to **nearest bridge** multicast MAC `01:80:C2:00:00:0E` (and similar); not forwarded beyond the link.
- **Use in multivendor nets:** Prefer **LLDP** when you have mixed vendors; use **CDP** only between Cisco devices.

**Comparison:**

| Aspect | CDP | LLDP |
|--------|-----|------|
| **Standard** | Cisco-proprietary | IEEE 802.1AB |
| **Default (Cisco)** | Enabled | Often disabled |
| **Multivendor** | Cisco only | Yes |
| **PoE info** | Yes (CDP power) | Yes (LLDP-MED / TLV) |
| **Typical timer** | 60 s holdtime | 120 s holdtime (configurable) |

**Hands-on (Cisco IOS):** View neighbors and optionally disable CDP on untrusted ports.

```text
  ! Show CDP neighbors (summary)
  show cdp neighbors

  ! Show CDP neighbors with detail (IP, platform, capabilities)
  show cdp neighbors detail

  ! Disable CDP on an interface (e.g. toward untrusted network)
  interface GigabitEthernet0/2
   no cdp enable

  ! Enable LLDP globally, then per interface if needed
  lldp run
  show lldp neighbors
```

**Defensive takeaway:** Disable CDP/LLDP on **user-facing** or **untrusted** ports to avoid leaking device and topology data. Use them on **internal** switch-to-switch and switch-to-router links for operations and troubleshooting.

---

## PPP and PPPoE (point-to-point and WAN)

**PPP (Point-to-Point Protocol)** is a **data link** protocol for **point-to-point** links. It provides **framing**, **authentication**, and **optional encryption** over serial, DSL, or other links. **PPPoE (PPP over Ethernet)** runs PPP over **Ethernet** and is commonly used for **DSL** and **broadband** access (customer side).

### PPP in brief

- **Role:** Encapsulates **network-layer** packets (e.g. IP) over a **single** point-to-point link. Used on **serial** (e.g. T1, E1) and **DSL** (via PPPoE).
- **Components:** **LCP (Link Control Protocol)** negotiates link parameters (MRU, auth protocol, etc.). **NCP (Network Control Protocol)** negotiates network-layer options (e.g. IPCP for IP address assignment).
- **Authentication:** **PAP (Password Authentication Protocol)** — plaintext; weak. **CHAP (Challenge-Handshake Authentication Protocol)** — challenge/response with hash; preferred.
- **Framing:** PPP uses a **flag** (0x7E), **address** (0xFF for broadcast), **control** (0x03), **protocol** (e.g. 0x0021 for IP), **payload**, **FCS**. Similar in spirit to HDLC.

**Visual (PPP session and layers):**

```text
  Router A (WAN link)                    Router B (or ISP)
  ┌─────────────────────────────────────────────────────────┐
  │  IP packet                                              │
  │  ┌───────────────────────────────────────────────────┐ │
  │  │ PPP frame: [Flag][Addr][Ctrl][Protocol=IP][Payload][FCS] │
  │  └───────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────────────┘
        │ LCP: link up, auth (CHAP), options
        │ NCP (IPCP): assign IP to peer
        │ Then: IP packets inside PPP frames
```

### PPPoE (PPP over Ethernet)

- **Role:** Carries **PPP** frames over **Ethernet**. Used so that **PPP authentication and addressing** (e.g. CHAP, IP from ISP) can be used over **Ethernet-based** access (DSL modem, fibre to the home).
- **Two stages:** **Discovery** — client finds the PPPoE server (AC) and gets a **session ID** (Ethernet broadcast, then unicast). **Session** — PPP frames are sent in **Ethernet** frames with **EtherType 0x8864** (session); discovery uses **0x8863**.
- **Typical use:** Customer router or PC runs a **PPPoE client**; traffic is sent to the **DSL/fibre modem** (or directly to the ISP); the ISP assigns an IP via PPP (e.g. IPCP) and may use CHAP for authentication.

**Visual (PPPoE flow):**

```text
  Client (PC/router)                Modem / ISP (PPPoE server)

  1. Discovery:
     PADI (broadcast)  ──────────→  "I need PPPoE"
     PADO (unicast)    ←──────────  "I am AC; use me"
     PADR              ──────────→  "Start session"
     PADS              ←──────────  "Session ID = 0x1234"

  2. Session:
     PPP (LCP, CHAP, IPCP) over Ethernet (EtherType 0x8864)
     IP traffic inside PPP inside Ethernet
```

**Why it matters for networks:** PPP and PPPoE are still in use on **WAN** and **access** links (DSL, some fibre). Understanding them helps with **troubleshooting** (e.g. auth failures, no IP from ISP) and **security** (CHAP vs PAP; PPP does not encrypt payload unless combined with something like IPsec).

---

## References

- [GeeksforGeeks – Data Link Layer in OSI Model](https://www.geeksforgeeks.org/computer-networks/data-link-layer/)
- IEEE 802.1AB (LLDP); Cisco CDP; [Physical layer – PoE](./3_Physical_Layer.md#power-over-ethernet-poe) (PoE and LLDP)
- PPP: RFC 1661; PPPoE: RFC 2516; CHAP: RFC 1994
- [GeeksforGeeks – Switching](https://www.geeksforgeeks.org/computer-networks/what-is-switching/)
- [GeeksforGeeks – Virtual LAN (VLAN)](https://www.geeksforgeeks.org/computer-networks/virtual-lan-vlan/)
- [GeeksforGeeks – Framing in Data Link Layer](https://www.geeksforgeeks.org/computer-networks/framing-in-data-link-layer/)
- [GeeksforGeeks – Error Detection in Computer Networks](https://www.geeksforgeeks.org/computer-networks/error-detection-in-computer-networks/)
- [GeeksforGeeks – Error Control in Data Link Layer](https://www.geeksforgeeks.org/computer-networks/error-control-in-data-link-layer/)
- [GeeksforGeeks – Flow Control](https://www.geeksforgeeks.org/computer-networks/flow-control-in-data-link-layer/)
- [GeeksforGeeks – Piggybacking in Computer Networks](https://www.geeksforgeeks.org/computer-networks/piggybacking-in-computer-networks/)
- [GeeksforGeeks – Link Aggregation Control Protocol](https://www.geeksforgeeks.org/computer-networks/link-aggregation-control-protocol/)
