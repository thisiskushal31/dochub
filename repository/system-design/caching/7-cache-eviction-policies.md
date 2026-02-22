# Cache Eviction Policies

## What they are

When a cache is **full** (or near a memory/entry limit), **eviction** decides **which entries to remove** to make room for new ones. The **eviction policy** is the rule used to choose victims.

## Why we need them

- Caches have **limited size**; without eviction, the cache would grow without bound or reject new entries.
- A good policy **keeps hot data** and evicts data that is less likely to be used again, improving hit rate.

## Common policies

| Policy | Rule | Use case |
|--------|------|----------|
| **LRU (Least Recently Used)** | Evict the entry **least recently** accessed. | General-purpose; good when recent access predicts future use. |
| **LFU (Least Frequently Used)** | Evict the entry with the **lowest access count**. | When frequency matters more than recency; can need aging so old hot data can be evicted. |
| **FIFO (First In First Out)** | Evict the **oldest** inserted entry. | Simple; no access tracking. |
| **TTL (Time To Live)** | Entries **expire** after a fixed (or per-entry) time; expired entries are evicted (or lazily removed on access). | When freshness matters; often combined with LRU for size limit. |
| **Random** | Evict a **random** entry. | Simple; sometimes used to avoid worst-case behavior of LRU. |

## Trade-offs

- **LRU** — Simple and effective for many workloads; can suffer when access pattern is scan or cyclical.
- **LFU** — Good for stable hot set; needs aging or decay so new items get a chance.
- **TTL** — Ensures freshness; eviction is time-based, so size may still need a capacity policy (e.g. LRU + TTL).

**When to use:** Choose based on workload: LRU for general caches; TTL when data has a natural expiry; LFU when frequency is a better predictor than recency. See [Caching overview](1-caching-overview.md) and [Cache layers](6-cache-layers.md).
