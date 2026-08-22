# Distributed rate limiter

Design a **rate limiter** for an API gateway or multi-tenant SaaS: per-user, per-IP, and global limits; works across many app servers.

*(Content TBD — stub created August 2026 — priority v2 in [PLANNED_CASES.md](../PLANNED_CASES.md))*

## Planned coverage

### Requirements

- Limit requests per client/key; configurable windows; low latency on hot path
- Distributed: consistent limits across N servers

### High-level design

- Token bucket vs sliding window vs fixed window
- Central store (Redis) vs edge (CDN/API GW) vs hybrid
- Race conditions and atomic increment
- Fail open vs fail closed trade-off

### Key concepts

- [performance/2-rate-limiting.md](../performance/2-rate-limiting.md), [fundamentals/13-api-gateway.md](../fundamentals/13-api-gateway.md), [caching/](../caching/README.md)

### Failure modes (to fill)

- Redis down, clock skew, burst allowance abuse

### Further reading

- Link [DSA Entry-Point](../Entry-Points/DSA.md) for algorithmic variants

## Checklist before marking done

- [ ] Compare 3 algorithms in table
- [ ] Diagram: request path through limiter
