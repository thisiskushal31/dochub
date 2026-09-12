# Distributed rate limiter

Design a **rate limiter** for an API gateway or multi-tenant SaaS: per-user, per-IP, and global limits; works across many app servers.

*(Stub — fill this case when you write it.)*

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

- [Performance/2_Rate_Limiting.md](../Performance/2_Rate_Limiting.md), [Fundamentals/13_API_Gateway.md](../Fundamentals/13_API_Gateway.md), [Caching/](../Caching/README.md)

### Failure modes (to fill)

- Redis down, clock skew, burst allowance abuse

### Further reading

- Link [Datastructures-and-Algorithms](../../Datastructures-and-Algorithms/README.md) for algorithmic variants

## Checklist before marking done

- [ ] Compare 3 algorithms in table
- [ ] Diagram: request path through limiter
