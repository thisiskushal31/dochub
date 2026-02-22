# Stateful vs Stateless Architecture

## What they mean

- **Stateless** — The server does **not** keep client-specific state between requests. Each request carries everything needed to process it (e.g. token, session id). Any server can serve any request.
- **Stateful** — The server **keeps** client-specific state (e.g. in-memory session, connection state). The same server (or same replica) is needed for that client’s requests.

## Why it matters

- **Stateless** — Easy to scale horizontally; add or remove servers; load balancers can send any request to any server. Failover is simple.
- **Stateful** — Sticky sessions or routing by identity required; scaling and failover are harder.

## Comparison

| Aspect | Stateless | Stateful |
|--------|-----------|----------|
| **Session data** | Stored externally (DB, Redis, cookie) | Held on the server (or server group) |
| **Scaling** | Add/remove instances freely | Must route same client to same instance (or replicate state) |
| **Failover** | Any instance can take over | Need session replication or reconnection |
| **Use case** | Web APIs, REST, horizontal scaling | Legacy apps, some real-time systems, WebSockets (sticky) |

## Making servers stateless

- Store **session data** in a shared store (Redis, database) or in an encrypted cookie.
- Put **identity** in every request (e.g. JWT, session id) so any server can resolve state from the store.
- Use **sticky sessions** only when necessary (e.g. WebSockets); prefer moving state out of the server.

**When to use:** Prefer **stateless** for APIs and web apps so you can scale and fail over easily. Use **stateful** only when you need server-held state (e.g. some real-time or legacy systems) and accept the scaling and failover constraints.
