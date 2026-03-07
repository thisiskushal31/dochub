# Sockets, Kernel Queues, and NAT

[← Back to Transport](./README.md)

How the kernel manages connections, listening servers, and address translation. Covers sockets, accept/SYN queues, listening servers, and NAT types and behaviour.

## Table of Contents

- [Sockets, connections, and kernel queues](#sockets-connections-and-kernel-queues)
- [Listening server](#listening-server)
- [How the kernel manages TCP connections](#how-the-kernel-manages-tcp-connections)
- [NAT](#nat)
- [Private IP addresses](#private-ip-addresses)
- [References](#references)

---

## Sockets, connections, and kernel queues

A **socket** is an endpoint for communication: the combination of **IP address** and **port** (and for TCP, the connection state). The kernel maintains **queues** for listening sockets and in-flight connections.

- **Socket** — (IP, port) for UDP; for TCP, a socket is associated with a **connection** (client IP, client port, server IP, server port) once accepted. Applications use the socket API (`socket`, `bind`, `listen`, `accept`, `connect`, `send`, `recv`) to create and use these endpoints.
- **Listen backlog** — For a TCP server, `listen(sock, backlog)` sets how many **pending** connections can wait. The kernel often maintains two queues: a **SYN queue** (incoming SYNs not yet completed) and an **accept queue** (connections that have completed the three-way handshake but have not yet been `accept()`ed by the application).
- **SYN queue** — When a SYN arrives, the kernel can store it in a SYN queue (or equivalent) while replying with SYN-ACK. If the backlog is full or the queue overflows, new SYNs may be dropped or ignored.
- **Accept queue** — Once the three-way handshake completes, the connection moves to the accept queue. When the server calls `accept()`, it takes a connection from this queue. If the accept queue is full, the kernel may drop incoming SYNs or delay completion; behaviour is OS-dependent.

Tuning **backlog** and understanding **SYN flood** protection (e.g. SYN cookies) matters for high-load servers. See [Listening server](#listening-server) and [Labs/](../Labs/README.md) for server examples.

**Hands-on: what you're doing when you list sockets and connections**

From a **network perspective**, you are inspecting **what the kernel thinks** about L4: which **ports** are in **LISTEN** (services waiting for connections), and which **connections** are **established** (active TCP/UDP flows). That answers “is my service listening?” and “who is connected to whom?” without guessing.

**Linux: ss (preferred) and netstat**

```bash
# List all listening TCP sockets. You are seeing: which (address, port) pairs have a server
# bound and waiting for connections. -n = numeric (no DNS); -l = listening.
ss -tlnp
# -t = TCP, -l = listen, -n = no resolve, -p = process using the socket

# List all listening UDP sockets (e.g. DNS, DHCP, custom UDP services).
ss -ulnp

# List established TCP connections. You are seeing active connections: local and remote
# address:port, state (ESTAB, TIME-WAIT, etc.).
ss -tnp

# Filter to one port (e.g. 443). You are checking "who is using 443?"
ss -tlnp 'sport = :443'
```

**What you're doing:**

- **ss -tlnp** — “Which **TCP** ports are **listening** and which process bound them?” Use it to confirm a service (e.g. web server on 80, SSH on 22) is up and bound to the expected address.
- **ss -tnp** (no -l) — “Which **TCP connections** are **established** (or in another state) right now?” Use it to see client↔server pairs and connection state.
- **ss -ulnp** — Same idea for **UDP**: which ports have a process bound (UDP has no “established” in the same way; you see bound ports and, with other tools, traffic).

**Legacy: netstat** (still common; ss is faster and more complete):

```bash
# Listening TCP
netstat -tlnp

# All TCP connections (established, time-wait, etc.)
netstat -tnp
```

**Windows:** Use **netstat** to see listening ports and active connections (run CMD or PowerShell; may need elevation for -o to show process).

```powershell
# Listening TCP
netstat -an | findstr LISTENING

# All connections with process ID (-o)
netstat -ano
```

So when you run these, you’re **inspecting the kernel’s view** of L4: listeners (what’s accepting) and connections (what’s active). That’s the right place to look before you blame routing or firewall for “connection refused” or “nothing listening.”

---

## Listening server

A **listening server** binds to a port and accepts incoming TCP connections (or receives UDP datagrams).

**Typical TCP server flow:**

1. **socket()** — Create a socket (e.g. TCP).
2. **bind()** — Bind to an address and port (e.g. 0.0.0.0:80 or a specific IP).
3. **listen()** — Mark the socket as listening; set **backlog** (size of the accept queue, or combined limit depending on OS).
4. **accept()** — Block (or poll) until a new connection is available; returns a new socket for that connection. The listening socket continues to accept more connections.
5. **read() / write()** (or **recv() / send()**) — Exchange data on the accepted socket.
6. **close()** — Close the connection.

**Backlog tuning:** If connections are dropped under load, increasing the **listen backlog** can help, but the kernel may cap it or use it for both SYN and accept queues. Some systems allow tuning SYN and accept queue sizes separately. Monitoring **overflow** or **drop** counters (e.g. `ListenOverflows`, `ListenDrops` on Linux) helps.

For UDP, the server typically **bind()**s and then **recvfrom()** / **sendto()**; there is no `listen` or `accept`. See [Labs/](../Labs/README.md) for code examples.

---

## How the kernel manages TCP connections

The kernel maintains **per-connection state** for each TCP connection: sequence numbers, receive and send windows, timers (retransmit, keepalive, TIME_WAIT), and buffers.

- **Buffers** — Send and receive buffers for each socket; data not yet sent or not yet delivered to the application. Buffer sizes can be tuned (e.g. `SO_RCVBUF`, `SO_SNDBUF`).
- **Timers** — Retransmission timer (RTO), keepalive, and for the closing side, TIME_WAIT (e.g. 2×MSL) so that delayed segments are discarded before the same four-tuple (src IP, src port, dst IP, dst port) is reused.
- **Connection limit** — The kernel has a finite number of file descriptors and connection structures; too many connections or too small a backlog can cause failures or drops.

Understanding this helps when debugging connection failures, port exhaustion, or high latency. See [Advanced/](../Advanced/README.md) for port exhaustion and TCP failure case studies.

---

## NAT

**NAT (Network Address Translation)** allows many devices in a **private network** to use a **single public IP** (or a small pool) to access the internet. The NAT device (usually a router or firewall) **translates** private (inside) addresses and often **ports** to public (outside) addresses and ports, and maintains a **mapping** so that return traffic can be sent back to the correct internal host.

- **Conserves public IPs** — Many hosts share one or a few public addresses.
- **Hides internal topology** — External hosts see only the public IP (and translated port), not internal IPs.
- **Translation** — Outbound: source (private IP, port) → (public IP, port). Inbound: (public IP, port) → (private IP, port) using the stored mapping.

**How NAT works (typical flow):**

1. An internal device sends a packet to the internet (e.g. to a web server). Source: (private IP, source port).
2. The NAT router receives it, allocates or reuses a **public (outside) IP and port**, and stores a mapping: (private IP, private port) ↔ (public IP, public port) for that flow.
3. The router rewrites the packet: source becomes (public IP, assigned port) and forwards it.
4. When the reply comes back to (public IP, assigned port), the router looks up the mapping, rewrites the destination to (private IP, private port), and forwards inside the network.

If two internal hosts use the same source port to the same destination, NAT must use **different** external ports so that replies can be demultiplexed; that is why NAT often changes **both** IP and port (PAT).

### NAT inside and outside addresses

| Term | Meaning |
|------|---------|
| **Inside local** | Private IP of the host inside the network. |
| **Inside global** | Public IP (and port) used to represent that host on the outside. |
| **Outside local** | Destination as seen from inside (often same as outside global for simple internet access). |
| **Outside global** | Real IP of the external host (e.g. server on the internet). |

### Types of NAT

- **Static NAT** — One-to-one: one private IP is always mapped to one fixed public IP. Used for servers that must be reachable from the internet at a stable address.
- **Dynamic NAT** — Private IPs are mapped to public IPs from a **pool**. When a host starts a session, it gets an address from the pool; when the session ends, the address returns to the pool. Limited by pool size.
- **PAT (Port Address Translation) / NAT overload** — Many private IPs share **one** public IP; **ports** distinguish flows. Each outbound connection gets a unique (public IP, port). Most home and small-office routers use PAT.

### Pros and cons of NAT

**Pros:** Saves public IPv4 addresses; hides internal addresses; single point of control at the border.

**Cons:** Breaks **end-to-end** addressing (hosts behind NAT are not directly addressable); can complicate **peer-to-peer** and some protocols (VoIP, gaming); requires **state** (mapping table); can cause **port exhaustion** when many connections use one public IP. IPv6 reduces the need for NAT; see [Foundations/5_Network_Layer](../Foundations/5_Network_Layer.md).

---

## Private IP addresses

**Private IP addresses** (RFC 1918) are not routable on the public internet. They are used **inside** a network (home, office, or other private space). NAT (or a proxy) at the border translates between private and public so that internal hosts can reach the internet.

- **Ranges (IPv4):** 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. See [Foundations/5_Network_Layer — Public and private IPs](../Foundations/5_Network_Layer.md#public-and-private-ip-addresses).
- **Use cases:** Home and office LANs, in-flight or hotel Wi‑Fi, corporate intranets. Devices get private IPs via DHCP; the gateway does NAT for outbound traffic.

Private IPs are **not** inherently secure; security comes from firewalls, access control, and encryption (e.g. TLS). See [Security/](../Security/README.md).

---

## References

- `ss(8)` and `netstat(8)` man pages (listening sockets and connections)
- [GeeksforGeeks – Network Address Translation (NAT)](https://www.geeksforgeeks.org/computer-networks/network-address-translation-nat/)
- RFC 1918 – Address Allocation for Private Internets
- [Foundations – Public and private IP addresses](../Foundations/5_Network_Layer.md#public-and-private-ip-addresses)
