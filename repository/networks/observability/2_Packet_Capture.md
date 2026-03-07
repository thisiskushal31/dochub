# Packet Capture (tcpdump)

[← Back to Observability](./README.md)

tcpdump basics, filters, capturing IP/ARP/ICMP/UDP/TCP; see labs for walkthroughs.

## Table of Contents

- [Packet analysis and tcpdump basics](#packet-analysis-and-tcpdump-basics)
- [Getting traffic to your capture tool: SPAN, RSPAN, ERSPAN](#getting-traffic-to-your-capture-tool-span-rspan-erspan)
- [Capturing IP, ARP, ICMP with tcpdump](#capturing-ip-arp-icmp-with-tcpdump)
- [Capturing UDP traffic with tcpdump](#capturing-udp-traffic-with-tcpdump)
- [Capturing TCP segments with tcpdump](#capturing-tcp-segments-with-tcpdump)
- [References](#references)

---

## Packet analysis and tcpdump basics

**tcpdump** is a **command-line** packet capture tool. It reads packets from an interface (or a **PCAP file**) and can **filter** and **display** them. Source: Course outline (Capturing IP, ARP and ICMP / UDP / TCP with tcpdump).

- **Basics:** Run as root (or with capability): `tcpdump -i eth0`. **-i** selects interface; **-w file.pcap** writes raw packets to a file; **-r file.pcap** reads from file. **-n** avoids DNS lookups; **-v** / **-vv** increase verbosity.
- **Filters** — **BPF (Berkeley Packet Filter)** syntax: `host 192.168.1.1`, `port 80`, `tcp`, `icmp`, `arp`, `net 10.0.0.0/24`, `src/dst` qualifiers. Example: `tcpdump -i eth0 'tcp port 443'`. Filters reduce **capture volume** and focus on the traffic of interest.
- **Capture points** — Capture on the **host** (e.g. loopback, main NIC) or on a **tap/span** port that sees traffic to/from other devices. Be aware of **VLANs** and **encryption** (TLS hides payload unless decrypted elsewhere).
- **PCAP hygiene** — Limit **size** (`-C`, `-W`) or **duration** to avoid filling disk. Store only what you need (filter early). Anonymize or restrict access to PCAPs that may contain sensitive data.

**Command reference (copy-paste for hands-on):**

```bash
# List interfaces (pick one for -i, e.g. eth0 or en0)
tcpdump -D

# Capture on interface; -n = no DNS lookup; -v = verbose
sudo tcpdump -i eth0 -n

# ICMP and ARP (e.g. while you ping from another terminal)
sudo tcpdump -i eth0 -n 'icmp or arp'

# TCP to port 80 (HTTP)
sudo tcpdump -i eth0 -n 'tcp port 80'

# TCP to port 443 (HTTPS)
sudo tcpdump -i eth0 -n 'tcp port 443'

# UDP DNS (port 53)
sudo tcpdump -i eth0 -n 'udp port 53'

# Save to file for later analysis (e.g. in Wireshark)
sudo tcpdump -i eth0 -w capture.pcap -c 100 'tcp port 80'

# Read from file
tcpdump -r capture.pcap -n
```

Replace `eth0` with your interface (e.g. `en0` on macOS, `any` for all). Run with sufficient privileges (e.g. `sudo` on Linux).

---

## Getting traffic to your capture tool: SPAN, RSPAN, ERSPAN

To capture traffic that is **not** local to your host (e.g. traffic between two other devices), you need the switch to **copy** that traffic to a port where your capture host is attached. That is **port mirroring**. On Cisco (and similarly on other vendors), the feature is **SPAN**, **RSPAN**, or **ERSPAN**.

### What each does

| Type | Scope | How mirrored traffic reaches the capture host |
|------|--------|-----------------------------------------------|
| **Local SPAN** | Same switch | Source port(s) or VLAN(s) are copied to a **destination port** on the **same** switch. The capture host is connected to the destination port. |
| **RSPAN (Remote SPAN)** | Across switches | Mirrored traffic is sent over a **dedicated RSPAN VLAN** to another switch; that switch has the **destination port** where the capture host is connected. Multiple switches can participate. |
| **ERSPAN (Encapsulated RSPAN)** | Across routed network | Mirrored traffic is **encapsulated in GRE** and sent to an **IP address** (the capture host or a collector). No dedicated VLAN; works across **Layer 3** (routed) networks. |

**Visual (where traffic comes from):**

```text
  Local SPAN:
  [Server] ──port1── [Switch] ──port2── [Router]
                │
                │  mirror port1 (and/or port2) → port3
                │
                └──port3── [Your capture host: tcpdump -i eth0]

  RSPAN:
  [Switch A] ── RSPAN VLAN ── [Switch B] ── dest port ── [Capture host]
       source port(s) copied into RSPAN VLAN; Switch B forwards to its SPAN dest port.

  ERSPAN:
  [Switch A] ── GRE to 10.0.0.50 ── [Network] ── [Capture host 10.0.0.50]
       mirrored traffic in GRE; capture host receives and can decode ERSPAN (e.g. Wireshark).
```

### Important details

- **Destination port** (local SPAN or RSPAN) is **receive-only** for the mirrored traffic; do not use it for normal traffic. It is often **excluded** from the source VLAN so the host does not receive its own traffic twice.
- **Source** can be one or more **ports** or **VLANs**. Direction can be **rx**, **tx**, or **both**. Avoid mirroring **too much** (e.g. whole trunk) or the destination link or capture host can be overloaded.
- **RSPAN VLAN:** All switches that carry RSPAN traffic must have that VLAN; only the **destination** switch forwards the VLAN to the SPAN destination port. RSPAN VLAN has special handling (no learning, etc.) on some platforms.
- **ERSPAN:** Requires support on the switch (e.g. Cisco); the capture host may need to understand ERSPAN/GRE or you use a middle appliance that decapsulates and forwards.

### Example (Cisco IOS-style local SPAN)

Conceptual: mirror traffic **from** port Gi0/1 (and optionally Gi0/2) **to** port Gi0/10 where the capture host is connected.

```text
  monitor session 1 source interface Gi0/1 , Gi0/2
  monitor session 1 destination interface Gi0/10

  ! Optional: limit direction (rx = ingress, tx = egress, both)
  monitor session 1 source interface Gi0/1 rx
  monitor session 1 destination interface Gi0/10
```

Then on the **capture host** connected to Gi0/10, run `tcpdump -i eth0 -w capture.pcap` (or Wireshark). You will see a copy of all traffic that passed through the source port(s).

**Security and impact:** Mirroring can expose **sensitive** traffic; restrict who can configure SPAN and who has access to the capture host. Heavy mirroring can **impact** switch CPU or the destination link; mirror only what you need and for as long as needed.

---

## Capturing IP, ARP, ICMP with tcpdump

- **IP:** Filter with `ip` (all IP) or `host <addr>`, `net <prefix>`. Inspect **TTL**, **protocol** (e.g. 1=ICMP, 6=TCP, 17=UDP), **src/dst** in the output.
- **ARP:** Filter with `arp`. You see **request/reply** (who-has / tell), **MAC–IP** mapping. Useful for **L2/L3** debugging and **ARP spoofing** detection.
- **ICMP:** Filter with `icmp`. You see **echo request/reply** (ping), **type/code** (e.g. unreachable, TTL exceeded for traceroute). Use to verify **reachability** and **path**.

Example: `tcpdump -i eth0 -n 'icmp or arp'`. See [Labs/2_Packet_Capture_Walkthroughs](../Labs/2_Packet_Capture_Walkthroughs.md) for step-by-step walkthroughs.

---

## Capturing UDP traffic with tcpdump

- **UDP:** Filter with `udp` or `udp port <port>`. tcpdump shows **src/dst IP:port**, **length**. No flags or sequence numbers (unlike TCP). Common for **DNS** (53), **DHCP** (67/68), **NTP** (123), **custom** app protocols.
- **Interpretation:** Check **direction** (who sent what), **payload length**, and **rate** (e.g. for DNS or DoS patterns). For **DNS**, inspect payload in verbose mode or use Wireshark for full decode. See [Labs/2_Packet_Capture_Walkthroughs](../Labs/2_Packet_Capture_Walkthroughs.md).

---

## Capturing TCP segments with tcpdump

- **TCP:** Filter with `tcp` or `tcp port 80`. tcpdump shows **flags** (S=SYN, F=FIN, P=PUSH, R=RST), **seq/ack** numbers, **window**. **SYN/SYN-ACK/ACK** indicate handshake; **FIN** or **RST** indicate teardown or abort.
- **Flags and retransmits** — **Retransmissions** (same seq reappearing) suggest **loss** or **congestion**. **RST** can mean connection refused or reset by peer or firewall. Use **-v** or **-vv** for more detail; for **full stream** reassembly and payload use **Wireshark** (Follow → TCP Stream). See [3_Wireshark](./3_Wireshark.md) and [Labs/2_Packet_Capture_Walkthroughs](../Labs/2_Packet_Capture_Walkthroughs.md).

---

## References

- [1_Signals_Performance](./1_Signals_Performance.md); [3_Wireshark](./3_Wireshark.md); [Labs/2_Packet_Capture_Walkthroughs](../Labs/2_Packet_Capture_Walkthroughs.md)
