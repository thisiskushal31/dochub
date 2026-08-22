# System Design Concepts

Concise, use-case driven notes for system design: core principles, building blocks, and when to apply each technique. This repo is a self-contained reference. Topic files follow a consistent flow: What → Why → How → Details → Trade-offs → When to use; diagrams are Mermaid or ASCII so everything stays local.

**Start here:** [0_Start_Here.md](./0_Start_Here.md) · **Write order:** [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md) · **Industry checklist:** [COVERAGE_MATRIX.md](./COVERAGE_MATRIX.md) · **Deepen next:** [THIN_TOPICS.md](./THIN_TOPICS.md) · **Cases tracker:** [PLANNED_CASES.md](./PLANNED_CASES.md)

---

## Structure

Topics are organized into these folders:

| Folder | Covers |
|--------|--------|
| **`fundamentals/`** | DNS, HTTP, load balancers, CDNs, HLD/LLD, API gateway, proxies, WebSockets, scaling, monolithic vs microservices, stateful vs stateless, consistent hashing. |
| **`databases/`** | SQL vs NoSQL, sharding, replication, CAP, storage systems, denormalization; [10-type taxonomy & flowchart](databases/README.md#database-types--use-cases). |
| **`storage/`** | Indexing, partitioning, WAL/backups, OLTP vs OLAP. |
| **`patterns/`** | Event sourcing, CQRS, leader election, circuit breaker, bulkhead/retry, event-driven architecture, serverless, event sourcing vs streaming. |
| **`caching/`** | Cache strategies, eviction (LRU/LFU/TTL), edge caching, cold/warm cache, cache layers. |
| **`messaging/`** | Message queues, task queues, point-to-point vs pub/sub, types and routing, scaling, queues vs streams, DLQ, backpressure, database-as-queue anti-pattern. |
| **`consistency/`** | CAP, consistency patterns, idempotency, consensus algorithms. |
| **`availability/`** | HA/DR, failover, replication, fault tolerance, reliability, maintainability, LB vs failover. |
| **`performance/`** | Antipatterns, rate limiting, latency/throughput, cost vs performance. |
| **`security/`** | Authn/authz, federated identity, gatekeeper, valet key, backup/DR, SSL/TLS. |
| **`observability/`** | Monitoring, health, availability, performance, security, usage, instrumentation, distributed tracing, visualization and alerts. |
| **`cases/`** | **Product system design cases**: how major systems are built (Google Drive/Dropbox, WhatsApp, Twitter, Uber, YouTube/Netflix, URL shortener). Requirements, high-level design, and links to concept notes. **Planned:** Discord, Instagram, Stripe, rate limiter, Slack — [PLANNED_CASES.md](./PLANNED_CASES.md). |
| **`failure-modes/`** *(new — stubs)* | Cache stampede, split brain, cascading failures, durability gaps — design-time failure analysis. |
| **`security-tradeoffs/`** *(new — stubs)* | Threat modeling, auth vs zero trust, encryption trade-offs — extends `security/` toward Security-Deep-Dive. |
| **`primer-gaps/`** *(new — stubs)* | Industry topics missing from repo: gossip, Bloom filters, 2PC/saga, search-at-scale, RAG/LLM gateway — see [COVERAGE_MATRIX.md](./COVERAGE_MATRIX.md). |
| **`Entry-Points/`** *(new — stubs)* | Doors to Networks, Databases, DevOps, Security capstone, DSA, Containerization. |

---

## Status

Progress on coverage. Update as topics and database types are completed.

| Area | Status | Notes |
|------|--------|--------|
| **Databases — learning path** | ✅ 12/12 topics | Overview, SQL vs NoSQL, storage, sharding, replication, CAP, selection, challenges, best practices, denormalization, federation, SQL tuning — in [databases/](databases/README.md) (1–12 + README). |
| **Databases — 10 types (concepts)** | ✅ Covered | All 10 types, use cases, and flowchart in [databases/README.md](databases/README.md#database-types--use-cases). Deep dives live in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). |

Full status: [databases/README.md#status](databases/README.md#status).

---

## Content and images

- **Style:** Concise examples; tie each technique to a use case. Prefer checklists and diagrams; call out trade-offs (e.g. consistency vs availability, latency vs cost).
- **Images:** Store under `assets/` or `assets/<topic>/` (e.g. `assets/fundamentals/`, `assets/caching/`). Reference only with **relative paths** to local files. When you add an image, introduce it with a short sentence (what the diagram shows) and place it **after** the explanation (what the concept is, use case, then the image). This repo is self-contained: if an image cannot be stored locally, omit it—do not reference external URLs.
- **PDFs:** System design books (e.g. **System Design Interview** by Alex Xu, Vol 1 & 2) are in [`resources/PDFs/`](resources/PDFs/). See that folder’s [README](resources/PDFs/README.md): **I do not own those PDFs**; full credit goes to the original authors. They are shared strictly for educational use.

---

## For maintainers

- **Context folder:** A sibling folder `system-design/` may hold gathered material (deep-dives, repo list, cloned repos). Use it only as **reference**; do not put final curated notes there.
- **This repo:** All final notes, new files, and edits go **only here**. Keep content self-contained (no external image links; no dependency on roadmap numbering or external maps).
- **Fill order:** [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md) — deepen [THIN_TOPICS.md](./THIN_TOPICS.md) before writing new case bodies.
