# Edge Caching

## What it is

**Edge caching** is caching **close to the client**—at the **edge** of the network (e.g. CDN points of presence, or PoPs). Content is stored and served from edge nodes so users get low latency and the origin gets less load.

## Why we need it

- **Latency** — Edge nodes are geographically distributed; users hit a nearby node instead of a central origin.
- **Origin offload** — Static assets and (with care) some dynamic or API responses are served from the edge, reducing load on the origin.
- **Availability** — Edge can serve cached content even if the origin is temporarily unavailable.

## How it works

1. First request for a resource goes to the **edge**; on **miss**, edge fetches from **origin** and caches the response (subject to headers and CDN config).
2. Subsequent requests for the same resource (same URL/key, within TTL) are **served from the edge** without hitting the origin.
3. **Invalidation** — Purge or shorten TTL when content changes; some CDNs support purge APIs or versioned URLs.

## What to cache at the edge

- **Static assets** — Images, JS, CSS, fonts (long TTL or versioned URLs).
- **Public API responses** — When response is same for many users and can tolerate staleness (e.g. product catalog, leaderboard).
- **Dynamic content** — Only when cache key and TTL are well defined (e.g. per-user with short TTL or don't cache).

## Trade-offs

- **Advantages:** Lower latency, less origin load, better resilience for cached content.
- **Disadvantages:** Staleness until TTL or purge; complexity of invalidation and cache keys for dynamic content.

**When to use:** Use edge caching (e.g. via CDN) for static assets and for dynamic content that can tolerate edge TTLs. See [CDN](../fundamentals/4-cdn.md) and [Cache layers](6-cache-layers.md).
