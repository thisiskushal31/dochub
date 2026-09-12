# Performance

Antipatterns, rate limiting, latency vs throughput, and cost vs performance.

## Topics

| Topic | File |
|--------|------|
| Performance antipatterns | [1_Performance_Antipatterns.md](1_Performance_Antipatterns.md) |
| Rate limiting | [2_Rate_Limiting.md](2_Rate_Limiting.md) |
| Latency and throughput | [3_Latency_and_Throughput.md](3_Latency_and_Throughput.md) |
| Cost vs performance | [4_Cost_vs_Performance.md](4_Cost_vs_Performance.md) |

## Quick reference

- **Antipatterns** — N+1, chatty I/O, no caching, busy DB/frontend, retry storms, synchronous I/O, noisy neighbor.
- **Rate limiting** — Fixed/sliding window, token bucket, leaky bucket; use a central store for global limits.
- **Latency vs throughput** — Define budgets; optimize the bottleneck; batch and cache where appropriate.
- **Cost vs performance** — Trade off spend (compute, cache, replication) with latency and availability; SLOs and right-sizing.
