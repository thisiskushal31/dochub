# Servers, Access & End-to-End Flows

[← Back to Services](./README.md)

Listening server, network access control, data communications, and end-to-end flows.

## Table of Contents

- [Listening server](#listening-server)
- [Network access control to database servers](#network-access-control-to-database-servers)
- [Reliability patterns](#reliability-patterns)
- [How clients access internet services](#how-clients-access-internet-services)
- [Common application-layer services](#common-application-layer-services)
- [Connecting to the Internet](#connecting-to-the-internet)
- [The networking behind clicking a link](#the-networking-behind-clicking-a-link)
- [Exposing local servers publicly](#exposing-local-servers-publicly)
- [References](#references)

---

## Listening server

A **listening server** **binds** to a port and **accepts** incoming connections (TCP) or receives datagrams (UDP). For **TCP**, the typical flow is: **socket()** → **bind()** to address:port → **listen()** with a **backlog** → **accept()** (blocks until a new connection) → **read()/write()** on the accepted socket. The **backlog** limits how many **pending** connections can wait; the kernel often has a **SYN queue** (incoming SYNs not yet completed) and an **accept queue** (handshake done, not yet `accept()`ed). If the backlog or queue is full, new SYNs may be dropped. **Tuning:** Increase backlog under load; monitor overflow/drop counters (e.g. `ListenOverflows` on Linux). For **UDP**, the server **bind()**s then **recvfrom()/sendto()**; there is no `listen` or `accept`. See [Transport/4_Sockets_Kernel_Nat](../Transport/4_Sockets_Kernel_Nat.md) for kernel queues, SYN/accept queues, and NAT.

---

## Network access control to database servers

Controlling **who can reach** database (and other backend) servers reduces attack surface and limits blast radius.

- **Segmentation** — Put databases in a **separate network segment** (e.g. private VLAN or subnet) that is not directly reachable from the internet or user-facing tier. Only application servers, bastions, or management hosts that need access should have a route.
- **Allowlists** — Restrict access by **source IP** or **security group**: only known application hosts (or a load balancer) can connect to the database port (e.g. 5432, 3306). Firewalls and NAC enforce this.
- **Private endpoints / no public IP** — Database instances have **no public IP**; access is only from within the VPC or via a **private link** or VPN. Clients (e.g. app servers) reach the database over the private network.
- **Authentication and encryption** — Use strong auth (passwords, certificates, IAM) and **TLS** for the connection so that even if the network is tapped, traffic is encrypted. See [Security/5_Firewalls_Aaa](../Security/5_Firewalls_Aaa.md) and [Security/2_Encryption_Tls](../Security/2_Encryption_Tls.md).

---

## Reliability patterns

Common patterns to keep services available and avoid cascading failures:

- **Blue/green and canary** — **Blue/green:** Two identical environments (blue, green); traffic is switched from one to the other at release time for instant rollback. **Canary:** New version gets a **small fraction** of traffic; if metrics are good, increase the fraction; if not, roll back. Both rely on **routing** (load balancer or DNS) to direct traffic.
- **Circuit breaker** — If a dependency (e.g. downstream API) fails repeatedly, the **circuit opens**: calls fail fast instead of timing out. After a cooldown, the client tries again (half-open); if success, the circuit closes. Prevents a failing dependency from exhausting threads or connections.
- **Retries and backoff** — **Retry** failed requests (with a limit). **Exponential backoff** (and jitter) between retries to avoid thundering herd. Use for **transient** failures (e.g. network blip); do not retry non-idempotent operations blindly. See [Observability/6_Network_Operations](../Observability/6_Network_Operations.md) for incident and rollback workflows.

---

## How clients access internet services

A **client** (browser, app, device) accesses an **internet service** by resolving its **hostname** (DNS), establishing a **transport** connection (TCP or UDP), and often **TLS** (for HTTPS), then sending **application** requests (e.g. HTTP). The request flows **down** the client stack (Application → Transport → Internet → Link → Physical), over the **network** (routers forward by IP; only end hosts use Transport and Application), and **up** the server stack; the response returns the same way in reverse. So: **DNS** (get IP) → **TCP connect** (and **TLS handshake** if HTTPS) → **HTTP request** → **HTTP response**. See [The networking behind clicking a link](#the-networking-behind-clicking-a-link) and [Foundations/2_Models](../Foundations/2_Models.md#how-a-request-flows-through-the-tcpip-model) for the full TCP/IP flow.

---

## Common application-layer services

In practice, clients and servers use several **application-layer** protocols together:

- **DNS** — Resolves hostnames to IPs (and other records). Used before most connections. See [DNS](./2_DNS.md).
- **DHCP** — Assigns IP address, default gateway, and DNS to hosts on the local network. See [DHCP](./8_DHCP.md).
- **Web (HTTP/HTTPS)** — Browsers and APIs use HTTP over TCP (and TLS for HTTPS). See [HTTP(S) & TLS](./3_Http_Tls.md).
- **Email** — SMTP (send), POP3 or IMAP (receive). See [Web, Email & Application Protocols](./5_Web_Email_Protocols.md).

Other common services: **NTP** (time), **Syslog** (logging), **SNMP** (device monitoring). All run **on top of** TCP or UDP; the transport layer provides the port and delivery; the application layer defines the message format and behavior.

---

## Connecting to the Internet

A host or network **connects to the Internet** via an **ISP (Internet Service Provider)**. The ISP assigns **addressing** (e.g. public IP or prefix via DHCP or static config) and provides **routing** (default route to the ISP’s network). **Home/small office:** Often a single public IP (or CGNAT); a **router** does NAT so many internal devices share that IP. **Enterprise:** May have a **block of public IPs** or a **prefix**, BGP with the ISP, and firewalls at the perimeter. **Virtualization and connectivity:** VMs and containers get IPs from the host or an overlay; they reach the Internet via the host’s or gateway’s NAT and routing. See [Foundations/5_Network_Layer](../Foundations/5_Network_Layer.md) (NAT, addressing) and [Security/1_Overview_Perimeter](../Security/1_Overview_Perimeter.md) (perimeter).

---

## The networking behind clicking a link

When you **click a link** (e.g. https://example.com/page), the following happens in order. See [Foundations/2_Models – How a request flows through the TCP/IP model](../Foundations/2_Models.md#how-a-request-flows-through-the-tcpip-model).

The diagram below summarizes the journey from typing a URL to the browser rendering the page (DNS, TCP, TLS, HTTP). Source and image: [ByteByteGo – What Happens When You Type a URL Into Your Browser?](https://bytebytego.com/guides/what-happens-when-you-type-a-url-into-your-browser/).

![What happens when you type a URL into your browser (ByteByteGo)](../Assets/Services/bytebytego-what-happens-when-you-type-url.png)

**Commands (hands-on):** you can see DNS, TCP, and HTTP in action with `curl`. Use these from a terminal to mimic what the browser does (resolve, connect, TLS, request).

```bash
# Show only response headers (no body) — confirms HTTP and status
curl -I https://example.com

# Verbose: see DNS resolution, TCP connect, TLS handshake, request/response
curl -v https://example.com

# Resolve to a specific IP (skip DNS for testing)
curl -v --resolve example.com:443:93.184.216.34 https://example.com
```

```powershell
# Windows (PowerShell): headers only
curl -Method Head -Uri https://example.com
# Or use curl.exe if available
curl.exe -I https://example.com
```

**Flow (code-block):**

```text
  Click https://example.com/page
       │
       ▼
  1. DNS lookup (UDP 53)     →  Resolver → root/TLD/auth  →  A/AAAA (e.g. 93.184.216.34)
       │
       ▼
  2. TCP handshake           →  SYN → SYN-ACK → ACK  (to IP:443)
       │
       ▼
  3. TLS handshake           →  Client Hello, Server Hello, certs, key exchange, Finished
       │
       ▼
  4. HTTP request            →  GET /page HTTP/1.1, Host: example.com  (over TLS)
       │
       ▼
  5. Server processing       →  Web server builds response (HTML, headers)
       │
       ▼
  6. HTTP response           →  HTTP 200, body  (back over same TLS/TCP)
       │
       ▼
  7. Browser                 →  Decrypt (TLS) → reassemble (TCP) → render page
                                (Further assets may reuse connection or trigger more DNS/TCP/TLS/HTTP)
```

**Step-by-step:**

1. **DNS** — The browser (or OS) needs the **IP address** for **example.com**. It sends a **DNS query** (usually over UDP 53, or TCP 53 for large responses). The resolver returns the **A** or **AAAA** record (e.g. 93.184.216.34). That DNS exchange is itself a full request down and up the stack.
2. **TCP connection** — The browser opens a **TCP** connection to that IP on **port 443** (HTTPS): SYN → SYN-ACK → ACK (three-way handshake).
3. **TLS handshake** — Over the new TCP connection, **TLS** runs: Client Hello, Server Hello, certificate verification, key exchange, Finished. Application data is then **encrypted**.
4. **HTTP request** — The browser sends an **HTTP** request (e.g. GET /page HTTP/1.1, Host: example.com) over the TLS channel. The request is **application data** inside TLS inside TCP inside IP inside Ethernet (or other link).
5. **Server processing** — The server’s web process handles the request, builds the response (e.g. HTML, assets), and sends an **HTTP response** (status, headers, body) back over the same TLS/TCP connection.
6. **Response** — The response travels back: server stack (App → Transport → Internet → Link) → network → client stack (Link → Internet → Transport → App). The browser **decrypts** (TLS), **reassembles** (TCP), and **renders** the page. Further assets (images, CSS, JS) may trigger more DNS lookups and TCP/TLS/HTTP requests (or reuse the same connection with HTTP/1.1 or multiplexing with HTTP/2).

So: **DNS → TCP → TLS → HTTP** (request) → **HTTP** (response) → **render**. Each step uses the TCP/IP (and OSI) layers as described in [Foundations/2_Models](../Foundations/2_Models.md).

---

## Exposing local servers publicly

A **local server** (e.g. dev server on localhost:3000) is not reachable from the Internet because it has no public IP and is behind NAT. To **expose** it temporarily (demos, webhooks, debugging), you can use:

- **Tunnels** — A **tunnel service** (e.g. **ngrok**, **cloudflared**, **localtunnel**) runs a client on your machine. The client opens an **outbound** connection to the service’s server. The service assigns a **public URL** (e.g. https://abc123.ngrok.io) and **forwards** traffic through that connection to your local port. No port forwarding on your router is needed.

**Flow (tunnel):**

```text
  Internet (user)  →  https://abc123.ngrok.io  →  Tunnel provider’s server
       →  (existing outbound connection)  →  Your machine’s tunnel client  →  localhost:3000
  Response  ←  localhost:3000  ←  client  ←  provider  ←  user
```
- **Port forwarding** — On your **router**, you can forward **external port** (e.g. 8080) to **internal IP:port** (e.g. 192.168.1.10:3000). Then anyone reaching your **public IP:8080** is sent to the dev machine. Requires a stable public IP or DynDNS; less safe than a short-lived tunnel if left open.
- **VPN** — Put the client (e.g. colleague) on a **VPN** that can reach your LAN; they access the server by its **private** IP. No exposure to the whole Internet.

Use **tunnels** for quick, temporary exposure; use **VPN** or **private links** when you need controlled, long-term access. See [labs](../Labs/README.md) for hands-on and [Routing-Switching/3_Tunneling_Mpls](../Routing-Switching/3_Tunneling_Mpls.md) for tunneling concepts.

---

## References

- [ByteByteGo – What Happens When You Type a URL Into Your Browser?](https://bytebytego.com/guides/what-happens-when-you-type-a-url-into-your-browser/) (diagram; used with credit)
- [Transport/4_Sockets_Kernel_Nat](../Transport/4_Sockets_Kernel_Nat.md) (listening server, backlog, SYN/accept queues)
- [Foundations/2_Models – How a request flows through the TCP/IP model](../Foundations/2_Models.md#how-a-request-flows-through-the-tcpip-model)
- [DNS](./2_DNS.md), [DHCP](./8_DHCP.md), [HTTP(S) & TLS](./3_Http_Tls.md), [Web, Email & Application Protocols](./5_Web_Email_Protocols.md)
- [Security/5_Firewalls_Aaa](../Security/5_Firewalls_Aaa.md), [Security/1_Overview_Perimeter](../Security/1_Overview_Perimeter.md); [Observability/6_Network_Operations](../Observability/6_Network_Operations.md); [labs](../Labs/README.md)
