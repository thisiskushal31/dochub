# Performance Antipatterns

## What they are

**Performance antipatterns** are common design or implementation choices that hurt performance: extra latency, low throughput, or wasted resources. Recognizing them helps you avoid or fix bottlenecks.

## Common antipatterns

| Antipattern | What goes wrong | Mitigation |
|-------------|------------------|------------|
| **N+1 queries** | One query per parent row to load related data instead of one batched/joined query. | Batch loads, JOINs, or data loaders. |
| **Chatty I/O** | Many small requests (DB, API, or file) instead of fewer, larger ones. | Batch, aggregate, or cache. |
| **Extraneous fetching** | Reading more data than needed (full table, all columns, or huge payloads). | Select only needed columns; paginate; filter at source. |
| **Busy database** | DB overloaded by too many connections, heavy queries, or missing indexes. | Scale read replicas, cache, index, optimize queries, connection pooling. |
| **Busy frontend** | Too much work on the client or at the edge: large assets, heavy JS, or too many API calls. | CDN, lazy load, code split, reduce round-trips. |
| **No caching** | Repeatedly fetching the same data or recomputing the same result. | Cache at the right layer (client, CDN, app, DB). |
| **Synchronous I/O** | Blocking the thread on every I/O call; under load, threads are exhausted. | Async I/O, non-blocking APIs, or more workers with pooling. |
| **Monolithic persistence** | One big database for everything; becomes a bottleneck and single point of failure. | Shard, split by service, or use purpose-built stores. |
| **Noisy neighbor** | One tenant or job consumes most of the shared resources (CPU, I/O, network). | Quotas, rate limits, isolation (pools, bulkheads), or dedicated capacity. |
| **Retry storm** | Many clients retrying at once when a dependency fails; amplifies load and delays recovery. | Exponential backoff, jitter, circuit breakers. |

**Use case:** Review designs and code for these patterns; fix hot paths first. See [Rate limiting](2-rate-limiting.md) for protecting APIs and [Caching](../caching/README.md) for reducing load.
