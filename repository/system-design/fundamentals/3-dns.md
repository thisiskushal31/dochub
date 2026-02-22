# Domain Name System (DNS)

## What it does

DNS translates a **domain name** (e.g. `www.example.com`) to an **IP address**. Resolution is **hierarchical**: top-level authoritative servers; your router/ISP say which DNS server to use. Lower-level servers cache mappings (can be stale due to TTL/propagation). Browser and OS can also cache DNS results.

The diagram below shows the typical resolution path from browser to root, TLD, and authoritative name servers.

![How DNS works: resolution path from domain to IP](../assets/fundamentals/how-dns-works.png)

---

## Common record types

| Record | Purpose |
|--------|--------|
| **A** | Name → IPv4 address |
| **CNAME** | Name → another name or A record (e.g. `example.com` → `www.example.com`) |
| **NS** | Name server for domain/subdomain |
| **MX** | Mail servers for the domain |

---

## Routing (managed DNS)

Managed DNS (e.g. Cloudflare, Route53) can route traffic by:

- **Weighted round robin** — Balance traffic, maintenance, A/B tests.
- **Latency-based** — Send user to lowest-latency region.
- **Geolocation** — Route by user location.

**Use case:** Global apps use DNS for failover, load balancing, and directing users to the nearest edge.
