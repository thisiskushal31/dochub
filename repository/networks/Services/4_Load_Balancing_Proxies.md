# Load Balancing & Proxies

[← Back to Services](./README.md)

Types of load balancing (including DNS-based), L4 vs L7, reverse proxies, and whether L4 proxies should buffer. For **DNS-based load balancing** (round-robin, weighted, geo) and how it relates to DNS records, see [DNS](./2_DNS.md#dns-based-load-balancing).

## Table of Contents

- [Types of load balancing (overview)](#types-of-load-balancing-overview)
- [Top 6 load balancing algorithms](#top-6-load-balancing-algorithms)
- [Types of load balancer (by configuration and function)](#types-of-load-balancer-by-configuration-and-function)
- [Importance of proxy and reverse proxies](#importance-of-proxy-and-reverse-proxies)
- [Load balancing at Layer 4 vs Layer 7](#load-balancing-at-layer-4-vs-layer-7)
- [Health checks, sticky sessions, weighted routing](#health-checks-sticky-sessions-weighted-routing)
- [Should Layer 4 proxies buffer segments?](#should-layer-4-proxies-buffer-segments)
- [Proxies and caching](#proxies-and-caching)
- [References](#references)

---

## Types of load balancing (overview)

Load balancing **distributes traffic** across multiple servers to improve **scalability**, **availability**, and **performance**. Types (from source):

1. **DNS-based** — Multiple A/AAAA records or weighted/geo responses so clients get different IPs; traffic is spread by where clients resolve. See [DNS](./2_DNS.md#dns-based-load-balancing). Simple but no per-request control; client caching can skew distribution.
2. **Layer 4 (transport)** — Decisions by **IP and port** (TCP/UDP). Fast, protocol-agnostic; no visibility into HTTP or application data.
3. **Layer 7 (application)** — Decisions by **HTTP** (URL, headers, cookies, method). Enables content-based routing, SSL termination, caching; more processing and latency.

**When to use which:** Use **L4** for maximum throughput, non-HTTP protocols, or TLS pass-through. Use **L7** when you need URL/path routing, SSL termination, caching, or WAF/rate limiting.

---

## Top 6 load balancing algorithms

Load balancers use **algorithms** to decide which backend receives each request. The six most common are grouped into **static** (no live backend state) and **dynamic** (use current load or performance). Content and diagram below from [ByteByteGo – Top 6 Load Balancing Algorithms](https://bytebytego.com/guides/top-6-load-balancing-algorithms/).

![Top 6 Load Balancing Algorithms (ByteByteGo)](../Assets/Services/bytebytego-top-6-load-balancing-algorithms.png)

### Static algorithms

- **Round robin** — Requests are sent to service instances in **sequential order** (A → B → C → A → …). Services are usually **stateless** so any instance can handle any request. Simple and fair if instances are equally capable.
- **Sticky round-robin (session affinity)** — Same as round-robin but **sticky**: if a client’s first request goes to instance A, **subsequent** requests from that client go to A as well. Use when the backend keeps **session state** (e.g. in-memory). See [Health checks, sticky sessions, weighted routing](#health-checks-sticky-sessions-weighted-routing).
- **Weighted round-robin** — The admin assigns a **weight** to each service instance. Instances with **higher** weight receive **more** requests. Use when instances have different capacity (e.g. larger vs smaller VMs).
- **Hash** — A **hash function** is applied to something in the request (e.g. **client IP** or **URL**). The result determines which instance handles the request. **Same key → same instance** (useful for caching or pinning). Can cause **imbalance** if the hash distribution is skewed.

### Dynamic algorithms

- **Least connections** — A new request is sent to the instance with the **fewest concurrent connections**. Suited for **long-lived** or **variable-duration** requests (e.g. TCP streams, WebSockets) so that load evens out over time.
- **Least response time** — A new request is sent to the instance with the **fastest** (e.g. lowest) **response time**. Uses **current** performance, so slower or overloaded instances get fewer new requests. Requires the LB to measure or receive response-time metrics.

**Flow (conceptual):**

```text
  Request → LB → [Static: round-robin / sticky / weighted / hash]
                [Dynamic: least connections / least response time]
                → chosen backend
```

---

## Types of load balancer (by configuration and function)

Load balancers **distribute incoming network traffic across multiple servers** to ensure **optimal resource utilization**, **minimize response time**, and **prevent server overload**. The three primary types by deployment are: **software**, **hardware**, and **virtual** load balancers. They can also be classified by **function** (layer and scope): **L4**, **L7**, and **GSLB**. Content below is from [GeeksforGeeks – Types of Load Balancer](https://www.geeksforgeeks.org/system-design/types-of-load-balancer/); the repo is standalone and the link is in [References](#references) for further reading.

### By configuration

These are categorized by **how they are set up and managed**: whether traffic distribution is handled by hardware, software, or virtualized/cloud-based configurations.

- **1. Software load balancers** — Applications or components that run on **general-purpose servers**; implemented in software, so they are **flexible and adaptable** to various environments.
  - The application maintains a list of servers, **chooses one** (e.g. first in the list or by algorithm) and requests data from it.
  - If a server **fails persistently** (after a configurable number of retries) and becomes unavailable, the application **discards that server** and chooses another from the list to continue.
  - One of the **cheapest** ways to implement load balancing (e.g. Nginx, HAProxy, Envoy).
- **2. Hardware load balancers (HLB)** — **Physical appliances** used to distribute traffic across a cluster of network servers. Also known as **Layer 4–7 routers**; capable of handling **HTTP, HTTPS, TCP, and UDP** traffic.
  - **HLBs can handle a large volume of traffic** but are **expensive** and have **limited flexibility**.
  - If a server does not produce the desired response, the HLB **immediately stops** sending traffic to it.
  - Often used **only as the first entry point** for user requests; **internal software load balancers** are then used to redirect traffic behind the infrastructure.
- **3. Virtual load balancers** — Load balancing implemented as a **virtual machine (VM) or software instance** within a virtualized environment (e.g. data centers using **VMware, Hyper-V, or KVM**). They distribute incoming network traffic across multiple servers or resources to ensure **efficient utilization**, **improve response times**, and **prevent server overload**, without dedicated physical hardware.

### By function (layer and scope)

These are classified by **how they manage and distribute** network traffic, operating at different layers to ensure efficient request handling and high availability.

- **1. Layer 4 (L4) load balancer / Network load balancer** — Operates at the **transport layer** of the OSI model. Forwarding decisions are based on **IP addresses and port numbers** (network/transport layer information).
  - **Transport layer:** Operates at TCP/UDP.
  - **Basic load balancing:** Distributes traffic based on IP addresses and port numbers.
  - **Efficiency:** Faster processing because it **does not inspect** the content of data packets.
  - **NAT:** Can perform basic **Network Address Translation** to hide server addresses.
- **2. Layer 7 (L7) load balancer / Application load balancer** — Operates at the **application layer** of the OSI model. Can make load balancing decisions based on **content**: URLs, HTTP headers, cookies.
  - **Application layer:** Operates at HTTP, HTTPS.
  - **Content-based routing:** Distributes traffic based on content-specific information.
  - **Advanced routing:** Can make intelligent routing decisions based on application-specific data.
  - **SSL termination:** Capable of terminating SSL connections.
- **3. GSLB (Global Server Load Balancer)** — Also called **multi-site load balancer**. Goes beyond local load balancing; designed to distribute traffic across **multiple data centers or geographically distributed servers**.
  - **Global load balancing:** Distributes traffic across multiple data centers or regions.
  - **Proximity-based routing:** Directs users to the **nearest or lowest-latency** server location.
  - **Health awareness:** Monitors server health and **avoids sending traffic** to unhealthy regions.
  - **Geographic intelligence:** Considers **location and performance** factors to route traffic intelligently.

**Visual (by configuration):**

```text
  Software LB:    App on commodity server  →  list of backends  →  choose & retry
  Hardware LB:    Physical appliance        →  first entry point →  internal software LBs behind
  Virtual LB:     VM / hypervisor instance  →  same logic       →  no dedicated physical box
```

**Visual (GSLB):**

```text
  User  →  GSLB (global)  →  choose region/site (proximity, health)  →  Regional LB  →  Servers
```

---

## Importance of proxy and reverse proxies

A **proxy** is an **intermediary** between clients and servers (from source).

- **Forward proxy** — Sits in front of **clients**. The client sends requests to the proxy; the proxy fetches from the server. The server sees the proxy as the client. Used for: access control, filtering, caching, hiding client IP, bypassing geo-restrictions. Controlled by the **client’s** organization.
- **Reverse proxy** — Sits in front of **servers**. The client sends requests to the proxy; the proxy forwards to one of the backends. The client sees the proxy as the server. Used for: **load balancing**, **SSL termination**, caching, hiding backend topology, WAF, compression. Controlled by the **server’s** organization.

**Visual (from source):**

```text
  Forward:  Client → Forward Proxy → Internet → Server   (proxy serves clients)
  Reverse:  Client → Internet → Reverse Proxy → Backend   (proxy serves servers)
```

Examples: Nginx, HAProxy, Cloudflare (reverse); Squid (forward). See [Load balancing at Layer 4 vs Layer 7](#load-balancing-at-layer-4-vs-layer-7) for how reverse proxies do L4 vs L7 load balancing.

---

## Load balancing at Layer 4 vs Layer 7

**Layer 4 (transport):** Routes by **IP and port** only. No inspection of HTTP; works for any TCP/UDP. **Flow:** client connects to LB; LB picks a backend and forwards segments (or connections); backend responds through the LB. **Pros:** fast, high throughput, protocol-agnostic, can pass through TLS. **Cons:** no routing by URL/header, no SSL termination or caching at LB.

**Layer 7 (application):** Routes by **HTTP** (method, path, headers, cookies). LB typically **terminates** the client connection and opens a new one to the backend. **Pros:** path-based routing (e.g. /api/* → API pool), SSL termination, caching, WAF, compression. **Cons:** more CPU, higher latency, more complex.

**Comparison (from source):**

- **Performance:** L4 can handle far more connections per second; L7 does more work per request.
- **Health checks:** L4 = TCP connect; L7 = HTTP GET /health and optionally check status/body.
- **Use L4 when:** max performance, simple distribution, non-HTTP or TLS pass-through. **Use L7 when:** content-based routing, SSL termination, caching, microservices behind one hostname.

---

## Health checks, sticky sessions, weighted routing

**Health checks:** The load balancer periodically checks if backends are up.

- **L4:** TCP connect to server:port; success = healthy, timeout/fail = unhealthy.
- **L7:** HTTP GET to a health endpoint (e.g. /health); check status (e.g. 200), optionally body or response time. **Parameters:** interval, timeout, unhealthy threshold (consecutive failures before removing), healthy threshold (consecutive successes before re-adding). Use a **lightweight** endpoint; avoid flapping (e.g. require multiple failures before marking down).

**Sticky sessions (session affinity):** Send the same client to the same backend so session state (e.g. in-memory) is preserved. **Cookie-based:** LB sets a cookie (e.g. SERVER_ID=server2); next request with that cookie goes to the same server. **IP hash:** same client IP → same server (no cookie; works for non-HTTP). **Trade-off:** uneven load and no automatic failover if that server dies.

**Weighted routing:** Assign **weights** to backends; distribute traffic in proportion (e.g. 3:2:1). Use when servers have different capacity (e.g. mixed hardware or spot instances). **Algorithms:** round-robin, least connections, weighted round-robin, IP hash, least response time — see [DNS](./2_DNS.md) and source for DNS-based variants; same ideas apply at L4/L7.

---

## Should Layer 4 proxies buffer segments?

**Context:** A Layer 4 proxy forwards TCP (or UDP) between client and backend. It can either **forward segment-by-segment** (no reassembly) or **buffer and reassemble** (e.g. full TCP stream) before sending to the other side.

- **No buffering (segment forwarding):** Lower latency, simpler, preserves backpressure; segments may be forwarded in smaller chunks, which can mean more packets and less batching.
- **Buffering/reassembly:** Can allow larger, more efficient writes to the backend and different pacing; adds latency, memory use, and complexity (e.g. handling half-closed connections, timeouts). Can also affect **correctness** if the proxy does not faithfully reflect connection state (e.g. FIN handling).

**Trade-off:** Correctness and predictable behavior usually favor **not** buffering at L4; many L4 load balancers forward at the segment level. If the goal is pure throughput and the application tolerates it, buffering can be a vendor-specific option. Design choice is implementation- and product-specific.

---

## Proxies and caching

**Forward proxies** often **cache** responses (e.g. GET) so repeated requests for the same resource are served from cache instead of the origin. **Reverse proxies** and **CDNs** cache static (or dynamic) content at the edge to reduce load and latency.

- **Cache key:** Typically URL + optionally Host, Vary headers, etc. Same key → same cached response.
- **TTL (Time to Live):** How long a cached response is considered fresh (e.g. `Cache-Control: max-age=3600`). After TTL, the proxy may revalidate (e.g. If-None-Match) or fetch again.
- **Invalidation:** Purge or expire specific URLs or prefixes when content changes so clients get updated content. CDNs and reverse proxies expose purge APIs or rules.

Caching reduces origin load and improves latency; incorrect TTL or invalidation can serve stale data. See [HTTP(S) & TLS](./3_Http_Tls.md) for `Cache-Control` and `ETag`.

---

## References

- [ByteByteGo – Top 6 Load Balancing Algorithms](https://bytebytego.com/guides/top-6-load-balancing-algorithms/) (static: round robin, sticky, weighted, hash; dynamic: least connections, least response time). Diagram: ByteByteGo, used with credit.
- [GeeksforGeeks – Types of Load Balancer](https://www.geeksforgeeks.org/system-design/types-of-load-balancer/) (by configuration: software, hardware, virtual; by function: L4, L7, GSLB)
- A-to-Z of Networking: Load Balancing (algorithms, L4 vs L7, health checks, sticky sessions); Proxies & Reverse Proxies (forward vs reverse, use cases)
- [DNS](./2_DNS.md) (DNS-based load balancing)
- [HTTP(S) & TLS](./3_Http_Tls.md) (caching headers)
