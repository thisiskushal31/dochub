# Horizontal Scaling

## Idea

Add **more machines** (scale out) instead of making one machine bigger (scale up / vertical scaling).

- Load balancers distribute traffic across these machines.
- **Benefits:** Often cheaper (commodity hardware), higher availability (no single big box). Easier to find talent for common stacks.
- **Trade-off:** More operational complexity; need to manage many nodes.

---

## Requirements for horizontal scaling

- **Stateless app servers** — No user/session data stored locally. Sessions in a **central store** (DB, Redis, Memcached) so any server can serve any user.
- **Downstream capacity** — Caches and databases must handle **more connections** as you add app servers.

**Use case:** Web/API tiers; scale by adding instances behind a load balancer.
