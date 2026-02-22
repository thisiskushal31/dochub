# Load Balancers

## Role of a load balancer

A load balancer **distributes incoming client requests** across servers (app servers, databases) and returns the chosen server’s response to the client. That avoids overloading a single server and can hide unhealthy backends.

The diagram below shows traffic from clients going through the load balancer to a pool of backend servers.

![Load balancer distributing requests across backends](../assets/fundamentals/load-balancer.png)

**Benefits:**

- Avoid sending traffic to **unhealthy** servers.
- Avoid **overloading** any single resource.
- Reduce **single point of failure** (when used with multiple backends).

Can be **hardware** or **software** (e.g. HAProxy). Often also provides:

- **SSL termination** — Decrypt/encrypt at the LB so backends don’t; single place for certificates.
- **Session persistence** — Route same client to same instance (e.g. via cookies) when app doesn’t manage session affinity.

**Trade-offs:**

- LB can become a bottleneck if under-provisioned.
- Adds complexity; a single LB is itself a SPOF (use multiple LBs for HA).

---

## Load balancer vs reverse proxy

| | Load balancer | Reverse proxy |
|---|----------------|----------------|
| **Typical use** | Multiple servers doing the same job. | Often one server; still useful for SSL, caching, routing. |
| **Main job** | Distribute load across a pool. | Single entry point; can do LB as well. |
| **Tools** | NGINX, HAProxy can do both. | Same. |

Reverse proxy adds complexity and can be a SPOF; use multiple with failover if needed.

---

## Load balancing algorithms

The **algorithm** is the set of rules used to choose a server.

- **Static:** Fixed rule (e.g. round robin, random). No feedback from server state.
- **Dynamic:** Uses current server state (e.g. least connections, response time) to decide.

---

## Layer 4 vs Layer 7

| | Layer 4 (transport) | Layer 7 (application) |
|---|---------------------|------------------------|
| **What is inspected** | IP + port (and TCP/UDP). | Headers, message body, cookies. |
| **Behavior** | Forwards packets; often does NAT. | Terminates connection; can route by URL, host, cookie. |
| **Use case** | Fast, simple; same treatment for all traffic. | Route by path (e.g. /video vs /billing), A/B, canary. |
| **Cost** | Less CPU/memory. | More work per request. |

**Use case:** L4 for raw throughput; L7 when you need content-based routing or HTTP-level features.

---

## Examples and real-world use

- **HAProxy, NGINX** — Common software load balancers; used in front of web apps, APIs, and microservices.
- **Multi-datacenter** — LBs route traffic to the nearest or healthiest region; see [Failover](../availability/2-failover.md) and active-active setups.
- **Product cases** — Every large system (WhatsApp, Uber, Twitter, YouTube) uses load balancers in front of API and backend pools. See [cases/](../cases/README.md).
