# Wireshark

[← Back to Observability](./README.md)

Decoding UDP, TCP/HTTP, HTTP/2 (TLS decrypt), MongoDB, SSE. Includes hands-on Wireshark/tshark usage so you can inspect traffic with a clear idea of what each step does.

## Table of Contents

- [Hands-on: Wireshark and tshark (what you're doing)](#hands-on-wireshark-and-tshark-what-youre-doing)
- [Wireshark: UDP](#wireshark-udp)
- [Wireshark: TCP/HTTP](#wireshark-tcphttp)
- [Wireshark: HTTP/2 (decrypting TLS)](#wireshark-http2-decrypting-tls)
- [Wireshark: MongoDB](#wireshark-mongodb)
- [Wireshark: Server-Sent Events (SSE)](#wireshark-server-sent-events-sse)
- [References](#references)

---

## Hands-on: Wireshark and tshark (what you're doing)

From a **network perspective**, you use Wireshark (GUI) or **tshark** (CLI) to see **what is actually on the wire**: which hosts are talking, which protocols and ports, and what the payload looks like after decoding. That lets you verify routing, firewall behaviour, and application traffic without guessing.

### What you're doing when you capture or open a file

- **Capture** — You are reading **frames** from an interface (or from a file). Each row in the packet list is one **frame**: Ethernet header (L2), then IP (L3), then TCP/UDP (L4), then application data (L5–7). Wireshark **dissects** each layer so you can expand and inspect fields (e.g. destination IP, TCP flags, HTTP method).
- **Display filter** — You are **hiding** packets that don’t match a condition. The capture still has all packets; you are just viewing a subset. Use this to focus on one host, one protocol, or one flow (e.g. all DNS, or all traffic to 8.8.8.8).
- **Capture filter** — You are telling the capture **not to store** packets that don’t match. Use this when you want a smaller file or less noise on a busy link; you cannot later “un-filter” what was never saved.
- **Follow → TCP Stream (or UDP Stream)** — You are asking Wireshark to **reassemble** all packets belonging to **one connection** (same src/dst IP and ports) and show the **application payload** in order. That’s how you see the full HTTP request/response or DNS query/answer as a single conversation.

### GUI workflow (Wireshark)

1. **Open a capture:** File → Open (or start a live capture with Capture → Start). You see the **packet list** (time, source, destination, protocol, info).
2. **Click a packet:** The **detail** pane shows the protocol tree (Ethernet → IP → TCP → HTTP, etc.). The **bytes** pane shows the raw frame; the selected part highlights in the tree. This is how you confirm **which layer** a field comes from (e.g. TTL in IP, port in TCP).
3. **Apply a display filter** in the bar (e.g. `tcp.port == 80` or `ip.addr == 8.8.8.8`) and press Enter. Only matching packets stay visible. You are **narrowing the view** to the traffic you care about.
4. **Follow a stream:** Right-click a packet in that flow → Follow → TCP Stream (or UDP Stream). A window shows the **reassembled payload** for that connection. Use this to verify what the application sent and received (e.g. HTTP request/response, DNS query/answer).

### Capture filter vs display filter (when to use which)

| Use case | Filter type | Why |
|----------|-------------|-----|
| Reduce **file size** or **live load** (e.g. only HTTP) | **Capture filter** (BPF) | Packets are dropped before storage; you never see the rest. |
| Inspect **one host** or **one protocol** after capture | **Display filter** | All packets are already in the file; you only hide rows. |
| Find **expert info** (e.g. unanswered pings, retransmissions) | **Display filter** | Requires dissector analysis (e.g. `icmp.resp_not_found`); capture filter cannot do that. |

**Capture filters** use **BPF** (same as tcpdump): e.g. `tcp port 80`, `icmp`, `host 192.168.1.1`.  
**Display filters** use Wireshark’s syntax: e.g. `tcp.port == 80`, `ip.addr == 192.168.1.1`, `http.request`.

### Display filter examples (network-focused)

Type these in the Wireshark filter bar or use with tshark `-Y`. They keep your view on the traffic that answers “who is talking, and what protocol?”

```text
# Single protocol
tcp
udp
icmp
dns
http

# One IP (to or from)
ip.addr == 8.8.8.8

# One TCP port (e.g. HTTP)
tcp.port == 80
tcp.dstport == 443

# HTTP requests only (see methods and URIs)
http.request

# DNS queries and responses
dns
dns.qry.name contains "example"

# ICMP (e.g. ping, traceroute)
icmp
icmp.type == 8    # echo request
icmp.type == 0    # echo reply

# Combine: traffic to/from 8.8.8.8 but not ping or DNS
ip.addr == 8.8.8.8 and !(icmp or dns)

# TCP flags (e.g. SYN, RST)
tcp.flags.syn == 1
tcp.flags.reset == 1
```

### tshark (command line): capture, read, filter, extract

**tshark** is the CLI version of Wireshark. Use it when you work on a server without a GUI, when you script analysis, or when you want to pipe output. Each option below is explained so you know what you’re doing.

**Capture (live interface)** — You are reading from a NIC and optionally writing to a file. Use a **capture filter** (`-f`) to avoid storing unwanted traffic.

```bash
# List interfaces (pick one for -i)
tshark -D

# Capture on eth0; save to file. -f = BPF capture filter (only store matching packets).
# Here: only ICMP and TCP port 80, so you don’t fill the file with other traffic.
sudo tshark -i eth0 -f "icmp or tcp port 80" -w capture.pcapng -c 500

# -c 500 = stop after 500 packets. Omit for continuous capture (Ctrl+C to stop).
```

**Read a file and apply a display filter** — You are reading an existing capture and showing only packets that match. The file is unchanged.

```bash
# -r = read file; -Y = display filter (same syntax as Wireshark filter bar).
tshark -r capture.pcapng -Y "tcp.port == 80"

# Only HTTP requests (method, host, URI)
tshark -r capture.pcapng -Y "http.request"

# Only DNS
tshark -r capture.pcapng -Y "dns"
```

**Extract specific fields** — You are asking tshark to **decode** the capture and print only certain fields (e.g. source IP, HTTP status code). Useful for scripting or quick stats.

```bash
# -T fields = output as columns; -e = which field(s). Header with -e frame.number.
tshark -r capture.pcapng -Y "http.response" -T fields -e ip.src -e ip.dst -e http.response.code

# List DNS query names
tshark -r capture.pcapng -Y "dns" -T fields -e dns.qry.name
```

**Discover filter fields** — When you don’t know the exact field name, list what tshark knows about a protocol:

```bash
# List protocols and their filter fields
tshark -G protocols
```

### Quick reference: tshark options

| Option | What you’re doing |
|--------|-------------------|
| `-i eth0` | Capture on interface **eth0**. |
| `-f "tcp port 443"` | **Capture filter** (BPF): only store packets matching this. |
| `-w file.pcapng` | **Write** captured packets to a file. |
| `-r file.pcapng` | **Read** from a file (no capture). |
| `-Y "http.request"` | **Display filter**: only show packets matching this. |
| `-c 100` | Stop after **100** packets (capture only). |
| `-T fields -e ip.src` | **Output** as columns; print only the chosen field(s). |

Use these with the protocol and filter concepts above so you’re not running commands blindly: you’re either **capturing** (with optional BPF), **reading and filtering** (display filter), or **extracting** fields for analysis.

---

## Wireshark: UDP

**Wireshark** decodes **UDP** (and other protocols) from a live interface or a **PCAP** file. Source: Course outline (Wiresharking UDP).

- **UDP:** In the packet list, select a UDP packet; the **detail** pane shows **User Datagram Protocol**: src/dst port, length, checksum. **Payload** is shown as data unless a **dissector** exists (e.g. DNS, DHCP). Use **Statistics → Conversations → UDP** to see flows by IP:port.
- **Decoding UDP flows:** For **DNS**, Wireshark decodes queries/responses. For **custom** protocols, you may see only raw payload; use **Follow → UDP Stream** to view the byte stream per flow. Filter: `udp.port == 53` for DNS.

---

## Wireshark: TCP/HTTP

- **TCP:** Decode shows **Transmission Control Protocol**: flags (SYN, ACK, FIN, RST), seq/ack, window. **Follow → TCP Stream** reassembles the **byte stream** for that connection and shows payload (e.g. HTTP). Useful to see **request/response** and **ordering**. Source: Course outline (Wiresharking TCP/HTTP).
- **HTTP:** When the TCP payload is HTTP, Wireshark parses **method**, **URI**, **headers**, **body**. Filter: `http` or `tcp.port == 80`. Use the **Expert** (e.g. retransmissions, duplicate ACKs) and **Statistics** (e.g. response time) for performance issues.

---

## Wireshark: HTTP/2 (decrypting TLS)

**HTTP/2** is often over **TLS** (HTTPS). To decode **encrypted** TLS payload, Wireshark needs the **session keys**. Source: Course outline (Wiresharking HTTP/2 – Decrypting TLS).

- **SSL key log:** Configure the **browser** or **application** to write **NSS Key Log** or **SSLKEYLOGFILE**. The file contains **client random** and **master secret** per TLS session. In Wireshark: **Edit → Preferences → Protocols → TLS → (Pre)-Master-Secret log filename** → set path to that file. **Reload** the capture; Wireshark will **decrypt** TLS and decode **HTTP/2** (frames, headers, body).
- **Limitation:** You must **capture** traffic that uses the same client process that wrote the key log; otherwise keys are not available. For **server-side** capture, server private key can be used in some setups.

---

## Wireshark: MongoDB

**MongoDB** wire protocol runs over **TCP** (default port 27017). Wireshark has a **MongoDB** dissector that decodes **OP_MSG**, **OP_REPLY**, **OP_QUERY**, etc. Source: Course outline (Wiresharking MongoDB).

- **Capture:** Filter `tcp.port == 27017`. Select a packet; if the dissector loads, you see **MongoDB** fields (operation type, document, reply). **Follow → TCP Stream** shows the raw stream; the dissector parses it in the detail pane when the protocol is recognized.

---

## Wireshark: Server-Sent Events (SSE)

**SSE (Server-Sent Events)** is **HTTP** with `Content-Type: text/event-stream`; the server sends **text lines** (events) over a **long-lived** connection. Source: Course outline (Wiresharking Server Sent Events).

- **Capture:** Filter `http` and look for **HTTP** responses with **event-stream** and **chunked** transfer. **Follow → HTTP Stream** (or TCP Stream) shows the **streaming** body (event lines, data, comments). Wireshark does not have a dedicated SSE dissector; the payload appears as HTTP body. Useful to confirm **one-way** server push and **event** boundaries.

---

## References

- [Wireshark User’s Guide – Display Filters](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkDisplayFilterSection.html); [tshark capture filters](https://tshark.dev/capture/capture_filters/) (BPF); [tshark man page](https://www.wireshark.org/docs/man-pages/tshark.html)
- Course outline: Wiresharking UDP, TCP/HTTP, HTTP/2 (Decrypting TLS), MongoDB, Server Sent Events
- [2_Packet_Capture](./2_Packet_Capture.md); [Services/3_Http_Tls](../Services/3_Http_Tls.md); [Labs/2_Packet_Capture_Walkthroughs](../Labs/2_Packet_Capture_Walkthroughs.md)
