# Assets

Images and diagrams for **System-Design-Concepts** notes. All paths are relative to this repo root.

## Structure

- **`Assets/`** — Root for all static assets.
- **`Assets/<topic>/`** — Per-topic images. `<topic>` matches the concept folder or a clear slug.

| Folder | Use for |
|--------|--------|
| `Assets/Fundamentals/` | DNS, TCP/HTTP, CDN, load balancers, APIs, microservices, etc. |
| `Assets/Databases/` | SQL/NoSQL, sharding, replication, storage systems. |
| `Assets/Storage/` | Indexing, partitioning, materialized views, static hosting. |
| `Assets/Patterns/` | CQRS, event sourcing, gateways, sidecar, leader election. |
| `Assets/Caching/` | Cache layers, write-through, cache-aside, TTL. |
| `Assets/Messaging/` | Queues, pub/sub, backpressure, async flows. |
| `Assets/Consistency/` | CAP, consistency models, idempotency. |
| `Assets/Availability/` | Failover, circuit breaker, HA, RPO/RTO. |
| `Assets/Performance/` | Latency, throughput, antipatterns. |
| `Assets/Security/` | Auth, valet key, gatekeeper. |
| `Assets/Observability/` | Logs, metrics, traces, dashboards. |

## Adding images

1. **Download** only if the image is valid and you can save it (e.g. PNG, SVG, JPG).
2. Save under **`Assets/`** or **`Assets/<topic>/`** (e.g. `Assets/Fundamentals/dns-flow.png`).
3. In the note, reference **only with a relative path** to the local file (e.g. `../Assets/Fundamentals/dns-flow.png`). This repo is self-contained; do not reference external image URLs.
4. If the image is **invalid or unavailable**: do not add a file and do not mention external sources; omit the image and keep the note self-contained.

## Copied images

Diagrams from the karanpratapsingh/portfolio system-design course have been downloaded into the topic folders above (e.g. `Fundamentals/`, `Databases/`, `Caching/`, `Consistency/`, `Messaging/`, `Patterns/`, `Availability/`, `Performance/`, `Storage/`). They are referenced from the concept notes with relative paths (e.g. `../Assets/Databases/Sharding.png`). Topic files that use these images include: `Fundamentals/3_DNS.md`, `Fundamentals/4_CDN.md`, `Fundamentals/5_Load_Balancers.md`, `Fundamentals/13_API_Gateway.md`, `Fundamentals/14_Proxies_and_WebSockets.md`, `Availability/2_Failover.md`, `Caching/1_Caching_Overview.md`, `Caching/3_Write_Through.md`, `Databases/4_Database_Sharding.md`, `Databases/5_Database_Replication.md`, `Storage/1_Indexing.md`, `Consistency/2_CAP_Theorem.md`, `Messaging/1_Message_Queues.md`, `Patterns/4_Circuit_Breaker.md`, `Performance/2_Rate_Limiting.md`.
