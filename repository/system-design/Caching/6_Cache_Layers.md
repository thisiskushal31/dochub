# Cache Layers

## Where to put the cache

Caches can sit at several layers between the user and the data. Each layer serves different content and has different trade-offs.

---

## Client caching

- **Where:** Browser, mobile app, or desktop client.
- **What:** Pages, assets (JS, CSS, images), or API responses (e.g. with `Cache-Control`).
- **Pros:** No network round-trip for hits; less server load.
- **Cons:** Stale data if not invalidated; uses client memory/disk. Hard to invalidate globally.

**Use case:** Static assets, optional API caching with short TTL or versioned URLs.

---

## CDN caching

- **Where:** Edge servers in a CDN.
- **What:** Static or dynamic content (HTML, images, video, API responses).
- **Pros:** Low latency; origin load reduced.
- **Cons:** Invalidation can be delayed; need TTL or purge API.

**Use case:** Static files, media, and optionally read-heavy API responses.

---

## Web server / reverse proxy caching

- **Where:** Reverse proxy (e.g. Varnish, NGINX) in front of app servers.
- **What:** Full responses or fragments (static and dynamic).
- **Pros:** App servers do less work; single place to tune.
- **Cons:** Another hop; invalidation and memory limits.

**Use case:** Caching full pages or responses that are same for many users.

---

## Application caching

- **Where:** In-process memory or a dedicated cache (e.g. Redis, Memcached) used by the app.
- **What:** Database results, computed values, sessions.
- **Pros:** Very low latency; flexible keys and TTLs.
- **Cons:** Memory limit; cache-aside or write-through logic in app; cold start or new nodes need to warm.

**Use case:** DB query results, session data, rate-limit counters.

---

## Database caching

- **Where:** Inside the DB (buffer pool, query cache) or a cache layer in front of the DB.
- **What:** Pages, query results, or hot rows.
- **Pros:** Transparent or semi-transparent; reduces disk I/O.
- **Cons:** Tied to DB capacity and eviction policy; less control from the app.

**Use case:** Reducing DB load; often used together with application cache for hot data.

---

**Layering:** Combine layers (e.g. client + CDN + app cache) and set TTLs and invalidation per layer so consistency and freshness match your requirements.
