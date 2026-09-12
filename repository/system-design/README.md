# System Design Concepts

Concise, use-case driven notes for system design: core principles, building blocks, and when to apply each technique. This repo is a self-contained reference. Topic files follow a consistent flow: What → Why → How → Details → Trade-offs → When to use; diagrams are Mermaid or ASCII so everything stays local.

This repo is how to **design a product system** — HLD/LLD, scale, and trade-offs. Engine internals live in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). Packets live in [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Coding patterns that show up in interviews live in [DSA SystemDesignBridge](https://github.com/thisiskushal31/Datastructures-and-Algorithms/tree/main/SystemDesignBridge). Draw while you read in [Tooling Diagramming](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Diagramming).

New here? Start at [Fundamentals/0 — Requirements and Constraints](./Fundamentals/0_Requirements_and_Constraints.md), then [Fundamentals](./Fundamentals/README.md).

---

## Structure

Topics are organized into these folders:

| Folder | Covers |
|--------|--------|
| **[`Fundamentals/`](./Fundamentals/README.md)** | DNS, HTTP, load balancers, CDNs, HLD/LLD, API gateway, proxies, WebSockets, scaling, monolithic vs microservices, stateful vs stateless, consistent hashing. |
| **[`Databases/`](./Databases/README.md)** | SQL vs NoSQL, sharding, replication, CAP, storage systems, denormalization; [10-type taxonomy & flowchart](./Databases/README.md#database-types--use-cases). |
| **[`Storage/`](./Storage/README.md)** | Indexing, partitioning, WAL/backups, OLTP vs OLAP. |
| **[`Patterns/`](./Patterns/README.md)** | Event sourcing, CQRS, leader election, circuit breaker, bulkhead/retry, event-driven architecture, serverless, event sourcing vs streaming. |
| **[`Caching/`](./Caching/README.md)** | Cache strategies, eviction (LRU/LFU/TTL), edge caching, cold/warm cache, cache layers. |
| **[`Messaging/`](./Messaging/README.md)** | Message queues, task queues, point-to-point vs pub/sub, types and routing, scaling, queues vs streams, DLQ, backpressure, database-as-queue anti-pattern. |
| **[`Consistency/`](./Consistency/README.md)** | CAP, consistency patterns, idempotency, consensus algorithms. |
| **[`Availability/`](./Availability/README.md)** | HA/DR, failover, replication, fault tolerance, reliability, maintainability, LB vs failover. |
| **[`Performance/`](./Performance/README.md)** | Antipatterns, rate limiting, latency/throughput, cost vs performance. |
| **[`Security/`](./Security/README.md)** | Authn/authz, federated identity, gatekeeper, valet key, backup/DR, SSL/TLS. |
| **[`Observability/`](./Observability/README.md)** | Monitoring, health, availability, performance, security, usage, instrumentation, distributed tracing, visualization and alerts. |
| **[`Cases/`](./Cases/README.md)** | **Product system design cases**: how major systems are built (Google Drive/Dropbox, WhatsApp, Twitter, Uber, YouTube/Netflix, URL shortener). Discord, Instagram, Stripe, rate limiter, Slack are stubs. |
| **[`Failure-Modes/`](./Failure-Modes/README.md)** | Cache stampede, split brain, cascading failures, durability gaps — design-time failure analysis. |
| **[`Security-Tradeoffs/`](./Security-Tradeoffs/README.md)** | Threat modeling, auth vs zero trust, encryption trade-offs — extends `Security/` toward Security-Deep-Dive. |
| **[`Primer-Gaps/`](./Primer-Gaps/README.md)** | Industry topics still being filled: gossip, Bloom filters, 2PC/saga, search-at-scale, RAG/LLM gateway. |

Sister repos: [Networks](https://github.com/thisiskushal31/Networks-Deep-Dive) (wire) · [Databases](https://github.com/thisiskushal31/Databases-Deep-Dive) (engine ops) · [DevOps](https://github.com/thisiskushal31/DevOps-Handbook) (delivery / SLOs) · [Security](https://github.com/thisiskushal31/Security-Deep-Dive) (program) · [DSA](https://github.com/thisiskushal31/Datastructures-and-Algorithms) · [Containerization](https://github.com/thisiskushal31/Containerization-Deep-Dive) · [Diagramming](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive) (`Diagramming/` — draw while you read).

---

## Status

Progress on coverage. Update as topics and database types are completed.

| Area | Status | Notes |
|------|--------|--------|
| **Databases — learning path** | ✅ 12/12 topics | Overview, SQL vs NoSQL, storage, sharding, replication, CAP, selection, challenges, best practices, denormalization, federation, SQL tuning — in [Databases/](Databases/README.md) (1–12 + README). |
| **Databases — 10 types (concepts)** | ✅ Covered | All 10 types, use cases, and flowchart in [Databases/README.md](Databases/README.md#database-types--use-cases). Deep dives live in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). |

Full status: [Databases/README.md#status](Databases/README.md#status).

---

## Content and images

- **Style:** Concise examples; tie each technique to a use case. Prefer checklists and diagrams; call out trade-offs (e.g. consistency vs availability, latency vs cost).
- **Images:** Store under `Assets/` or `Assets/<topic>/` (e.g. `Assets/Fundamentals/`, `Assets/Caching/`). Reference only with **relative paths** to local files. When you add an image, introduce it with a short sentence (what the diagram shows) and place it **after** the explanation (what the concept is, use case, then the image). This repo is self-contained: if an image cannot be stored locally, omit it—do not reference external URLs.
- **PDFs:** System design books (e.g. **System Design Interview** by Alex Xu, Vol 1 & 2) are in [`Resources/PDFs/`](Resources/PDFs/). See that folder’s [README](Resources/PDFs/README.md): **I do not own those PDFs**; full credit goes to the original authors. They are shared strictly for educational use.

---

## For maintainers

- **Context folder:** A sibling folder `system-design/` may hold gathered material (deep-dives, repo list, cloned repos). Use it only as **reference**; do not put final curated notes there.
- **This repo:** All final notes, new files, and edits go **only here**. Keep content self-contained (no external image links; no dependency on roadmap numbering or external maps).
- **This file is the public map.** Folder READMEs list the notes that already exist.
