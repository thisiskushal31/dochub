# Caching Overview

## What caching is

**Caching** is storing frequently used data in a **temporary**, fast store (the cache) so it can be read without hitting the primary source every time. That reduces latency, load on the source, and often cost.

The following diagram illustrates a typical setup: clients read from the cache when possible, and the cache sits in front of the primary data source (e.g. database or API).

![Caching: cache layer between clients and primary data source](../assets/caching/caching.png)

## Why use it

- **Lower latency** — Cache is usually in-memory or closer to the client.
- **Less load** — Fewer queries to the database or origin.
- **Hotspot protection** — Popular keys don’t overwhelm the backend.
- **Cost** — Cheaper to serve from cache than to recompute or read from primary storage.

## Main strategies

- **Cache-aside** — App manages cache; on miss, load from DB and fill cache.
- **Read-through** — Cache sits in front of storage; cache loads from storage on miss.
- **Write-through** — Writes go to cache and synchronously to storage.
- **Write-behind** — Writes go to cache; storage is updated asynchronously.
- **Refresh-ahead** — Cache refreshes entries before they expire based on access.

Choosing a strategy depends on read/write mix, consistency needs, and failure tolerance. See the topic files for each pattern and where to place caches (layers).

---

## Examples and real-world use

- **URL shortener (Bitly)** — Resolve (short link → long URL) is read-heavy; cache short_id → URL for fast redirects. See [URL shortener case](../cases/6-url-shortener.md).
- **Twitter / feed** — Cache prebuilt timelines and recent tweets to serve read-heavy feeds. See [Twitter case](../cases/3-twitter.md).
- **Uber** — Cache driver locations and nearby-driver queries for real-time matching. See [Uber case](../cases/4-uber.md).
- **Redis, Memcached** — Common in-memory caches; used at scale by many companies (e.g. Twitter’s cache layer, session stores).
