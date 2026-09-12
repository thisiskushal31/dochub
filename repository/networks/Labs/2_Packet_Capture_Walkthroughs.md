# Packet Capture Walkthroughs

[← Back to Labs](./README.md)

Step-by-step tcpdump and Wireshark walkthroughs.

## Table of Contents

- [Capturing IP, ARP, and ICMP with tcpdump](#capturing-ip-arp-and-icmp-with-tcpdump)
- [Capturing UDP traffic with tcpdump](#capturing-udp-traffic-with-tcpdump)
- [Capturing DNS and DHCP (DORA) with tcpdump](#capturing-dns-and-dhcp-dora-with-tcpdump)
- [Getting traffic: SPAN and capture from a switch](#getting-traffic-span-and-capture-from-a-switch)
- [Capturing TCP segments with tcpdump](#capturing-tcp-segments-with-tcpdump)
- [Wireshark: UDP](#wireshark-udp)
- [Wireshark: TCP/HTTP](#wireshark-tcphttp)
- [Wireshark: HTTP/2 (decrypting TLS)](#wireshark-http2-decrypting-tls)
- [Wireshark: MongoDB](#wireshark-mongodb)
- [Wireshark: Server-Sent Events (SSE)](#wireshark-server-sent-events-sse)
- [References](#references)

---

## Capturing IP, ARP, and ICMP with tcpdump

**Steps:** (1) Choose interface: `tcpdump -i eth0`. (2) Filter: `tcpdump -i eth0 -n 'icmp or arp'` for ping and ARP. (3) Optional: `-v` for more detail; `-w capture.pcap` to save. **Example:** Run **ping** from another terminal; you should see **echo request/reply** (ICMP). For **ARP**, trigger resolution (e.g. ping to a host on the same LAN); you see **who-has / tell**. See [Observability/2_Packet_Capture](../Observability/2_Packet_Capture.md). Source: Course outline (Capturing IP, ARP and ICMP Packets with TCPDUMP).

---

## Capturing UDP traffic with tcpdump

**Steps:** (1) Filter: `tcpdump -i eth0 -n udp` or `udp port 53` for DNS. (2) Run a **UDP** client/server (e.g. from [1_Code_Examples](./1_Code_Examples.md)) or **DNS** lookup. (3) Identify **flows** by **src/dst IP:port**. **Interpretation:** No flags or seq; check **length** and **rate**. See [Observability/2_Packet_Capture](../Observability/2_Packet_Capture.md). Source: Course outline (Capturing UDP traffic with TCPDUMP).

---

## Capturing DNS and DHCP (DORA) with tcpdump

**DNS:** (1) Filter: `tcpdump -i eth0 -n 'udp port 53'`. (2) From another terminal run `dig example.com` or `nslookup example.com`. (3) You should see **query** (client → resolver) and **response** (resolver → client); with `-v` you may see query name and response records. Reinforces [Services/2_DNS](../Services/2_DNS.md). For **DoH/DoT/DoQ**, traffic is on 443 or 853 and encrypted; you will see TLS, not plain DNS.

**DHCP (DORA):** (1) Filter: `tcpdump -i eth0 -n 'udp port 67 or udp port 68'`. (2) Release and renew the lease on this host (e.g. `sudo dhclient -r eth0 && sudo dhclient -v eth0` on Linux, or `ipconfig /release` then `ipconfig /renew` on Windows). (3) You should see **Discover** (broadcast), **Offer**, **Request**, **ACK** in order. Reinforces [Services/8_DHCP](../Services/8_DHCP.md) and [Security/4_Attacks_Mitigations](../Security/4_Attacks_Mitigations.md) (rogue DHCP).

---

## Getting traffic: SPAN and capture from a switch

When the traffic you need is **between two other devices** (e.g. server and router), capture on a **host** attached to a **SPAN/RSPAN/ERSPAN destination port** on the switch. (1) Configure a **monitor session** on the switch (source = port or VLAN, destination = port where your capture host is connected). (2) On the capture host, run tcpdump or Wireshark on the interface connected to that port. See [Observability/2_Packet_Capture](../Observability/2_Packet_Capture.md#getting-traffic-to-your-capture-tool-span-rspan-erspan) for SPAN/RSPAN/ERSPAN concepts and Cisco-style config.

---

## Capturing TCP segments with tcpdump

**Steps:** (1) Filter: `tcpdump -i eth0 -n 'tcp port 80'` for HTTP. (2) Generate traffic (e.g. **curl** or TCP server from [1_Code_Examples](./1_Code_Examples.md)). (3) Observe **flags**: **S** (SYN), **.** (ACK), **F** (FIN), **R** (RST); **seq/ack** numbers; **retransmits** (same seq again). See [Observability/2_Packet_Capture](../Observability/2_Packet_Capture.md). Source: Course outline (Capturing TCP Segments with TCPDUMP).

---

## Wireshark: UDP

**Steps:** (1) Capture or open PCAP with **UDP** traffic. (2) Select a UDP packet; in **detail** pane see **User Datagram Protocol** (ports, length). (3) **Follow → UDP Stream** for the byte stream of that flow. (4) If **DNS**, Wireshark decodes queries/responses. See [Observability/3_Wireshark](../Observability/3_Wireshark.md). Source: Course outline (Wiresharking UDP).

---

## Wireshark: TCP/HTTP

**Steps:** (1) Capture **TCP** (e.g. port 80). (2) **Follow → TCP Stream** to see **reassembled** payload. (3) If payload is **HTTP**, Wireshark decodes method, URI, headers. (4) Use **Statistics** or **Expert** for retransmissions, RTT. See [Observability/3_Wireshark](../Observability/3_Wireshark.md). Source: Course outline (Wiresharking TCP/HTTP).

---

## Wireshark: HTTP/2 (decrypting TLS)

**Steps:** (1) Set **SSLKEYLOGFILE** in browser (or app) and capture **HTTPS**. (2) In Wireshark: **Preferences → Protocols → TLS** → set **(Pre)-Master-Secret log** to that file. (3) Reload capture; **HTTP/2** frames and bodies are **decrypted**. See [Observability/3_Wireshark](../Observability/3_Wireshark.md), [Security/2_Encryption_Tls](../Security/2_Encryption_Tls.md). Source: Course outline (Wiresharking HTTP/2 – Decrypting TLS).

---

## Wireshark: MongoDB

**Steps:** (1) Capture **TCP port 27017** (MongoDB default). (2) Wireshark’s **MongoDB** dissector decodes **OP_MSG**, **OP_REPLY**, etc. (3) **Follow → TCP Stream** for raw bytes; detail pane shows parsed operations. See [Observability/3_Wireshark](../Observability/3_Wireshark.md). Source: Course outline (Wiresharking MongoDB).

---

## Wireshark: Server-Sent Events (SSE)

**Steps:** (1) Capture **HTTP** traffic to an **SSE** endpoint. (2) Find response with **Content-Type: text/event-stream**. (3) **Follow → HTTP Stream** (or TCP Stream) to see **event** lines (data, id, event) in the body. See [Observability/3_Wireshark](../Observability/3_Wireshark.md). Source: Course outline (Wiresharking Server Sent Events).

---

## References

- Course outline: Capturing IP/ARP/ICMP, UDP, TCP with TCPDUMP; Wiresharking UDP, TCP/HTTP, HTTP/2 (TLS), MongoDB, SSE
- [Observability/2_Packet_Capture](../Observability/2_Packet_Capture.md) (tcpdump, SPAN/RSPAN/ERSPAN); [Observability/3_Wireshark](../Observability/3_Wireshark.md); [Services/2_DNS](../Services/2_DNS.md); [Services/8_DHCP](../Services/8_DHCP.md)
