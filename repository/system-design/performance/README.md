# Performance

Antipatterns, rate limiting, latency vs throughput, and cost vs performance.

## Topics

| Topic | File |
|--------|------|
| Performance antipatterns | [1-performance-antipatterns.md](1-performance-antipatterns.md) |
| Rate limiting | [2-rate-limiting.md](2-rate-limiting.md) |
| Latency and throughput | [3-latency-and-throughput.md](3-latency-and-throughput.md) |
| Cost vs performance | [4-cost-vs-performance.md](4-cost-vs-performance.md) |

## Quick reference

- **Antipatterns** — N+1, chatty I/O, no caching, busy DB/frontend, retry storms, synchronous I/O, noisy neighbor.
- **Rate limiting** — Fixed/sliding window, token bucket, leaky bucket; use a central store for global limits.
- **Latency vs throughput** — Define budgets; optimize the bottleneck; batch and cache where appropriate.
- **Cost vs performance** — Trade off spend (compute, cache, replication) with latency and availability; SLOs and right-sizing.
