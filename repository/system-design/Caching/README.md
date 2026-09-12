# Caching

Cache strategies, eviction, edge caching, cold/warm cache, and where to place caches in the stack.

## Topics

| Topic | File |
|--------|------|
| Caching overview and strategies | [1_Caching_Overview.md](1_Caching_Overview.md) |
| Cache-aside (lazy loading) | [2_Cache_Aside.md](2_Cache_Aside.md) |
| Write-through | [3_Write_Through.md](3_Write_Through.md) |
| Write-behind (write-back) | [4_Write_Behind.md](4_Write_Behind.md) |
| Refresh-ahead | [5_Refresh_Ahead.md](5_Refresh_Ahead.md) |
| Cache layers (client, CDN, web, app, DB) | [6_Cache_Layers.md](6_Cache_Layers.md) |
| Cache eviction policies (LRU, LFU, TTL) | [7_Cache_Eviction_Policies.md](7_Cache_Eviction_Policies.md) |
| Edge caching | [8_Edge_Caching.md](8_Edge_Caching.md) |
| Cold and warm cache | [9_Cold_and_Warm_Cache.md](9_Cold_and_Warm_Cache.md) |

## Quick reference

- **Strategies:** Cache-aside (app-managed), write-through (sync to store), write-behind (async to store), refresh-ahead (pre-refresh before expiry).
- **Eviction:** LRU, LFU, FIFO, TTL; choose by workload.
- **Edge caching:** Cache at CDN/edge for low latency and origin offload.
- **Cold/warm:** Design for cold start; use eager warming or refresh-ahead to reduce cold impact.
- **Layers:** Client → CDN → web server → application → database. Combine and set TTLs/invalidation per layer.
