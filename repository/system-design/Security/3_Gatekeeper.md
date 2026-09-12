# Gatekeeper

## What it is

The **Gatekeeper** pattern places a **dedicated component** (e.g. API gateway, proxy, or BFF) between **clients** and **internal services**. The gatekeeper validates and sanitizes requests, enforces auth and policy, and forwards only allowed traffic. Internal services are not exposed directly to clients.

## Responsibilities

- **Authentication and authorization** — Verify tokens or credentials; enforce permissions before forwarding.
- **Validation and sanitization** — Reject malformed or invalid input; reduce injection and abuse.
- **Rate limiting and throttling** — Enforce per-client or per-API limits.
- **Audit and logging** — Log access and rejections for security and compliance.
- **Reducing attack surface** — Internal APIs, ports, and error details stay hidden; only the gatekeeper’s contract is public.

## Trade-offs

**Pros:** Single place to enforce security and policy; internal architecture can change behind the gatekeeper.

**Cons:** Gatekeeper becomes critical (must be highly available and fast); can be a bottleneck if not scaled or designed well.

**Use case:** Any public or partner-facing API. Use with **Federated identity** for login and **Valet key** when delegating limited, direct access to storage (e.g. uploads) without sending data through your servers.
