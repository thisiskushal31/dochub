# Caching

Cache strategies, eviction, edge caching, cold/warm cache, and where to place caches in the stack.

## Topics

| Topic | File |
|--------|------|
| Caching overview and strategies | [1-caching-overview.md](1-caching-overview.md) |
| Cache-aside (lazy loading) | [2-cache-aside.md](2-cache-aside.md) |
| Write-through | [3-write-through.md](3-write-through.md) |
| Write-behind (write-back) | [4-write-behind.md](4-write-behind.md) |
| Refresh-ahead | [5-refresh-ahead.md](5-refresh-ahead.md) |
| Cache layers (client, CDN, web, app, DB) | [6-cache-layers.md](6-cache-layers.md) |
| Cache eviction policies (LRU, LFU, TTL) | [7-cache-eviction-policies.md](7-cache-eviction-policies.md) |
| Edge caching | [8-edge-caching.md](8-edge-caching.md) |
| Cold and warm cache | [9-cold-and-warm-cache.md](9-cold-and-warm-cache.md) |

## Quick reference

- **Strategies:** Cache-aside (app-managed), write-through (sync to store), write-behind (async to store), refresh-ahead (pre-refresh before expiry).
- **Eviction:** LRU, LFU, FIFO, TTL; choose by workload.
- **Edge caching:** Cache at CDN/edge for low latency and origin offload.
- **Cold/warm:** Design for cold start; use eager warming or refresh-ahead to reduce cold impact.
- **Layers:** Client → CDN → web server → application → database. Combine and set TTLs/invalidation per layer.
