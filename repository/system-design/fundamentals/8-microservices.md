# Microservices

## What they are

**Microservices** = suite of **small, modular services** that are:

- **Independently deployable**
- Each run a **single process**
- Communicate via a **well-defined, lightweight** mechanism (HTTP, gRPC, messaging)
- Aligned to **business capabilities**

Example (e.g. a product like Pinterest): separate services for user profile, followers, feed, search, photo upload, etc.

---

## When to use

- **Use:** Large domains; need independent scaling, tech diversity, or team autonomy; willing to invest in deployment and observability.
- **Avoid:** Small product or team; need simplicity and fast iteration without distributed-system overhead.

**Trade-off:** More services → more network calls, eventual consistency, and operational complexity (deployments, discovery, tracing).
