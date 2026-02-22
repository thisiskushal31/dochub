# Latency and Throughput

## Definitions

- **Latency** — Time from request start to response (e.g. p50, p99). User-visible delay.
- **Throughput** — Number of requests (or operations) completed per unit time (e.g. QPS, TPS). System capacity.

## Trade-off

Improving one can hurt the other. Examples:

- **Batching** — Increases throughput (fewer round-trips, better utilization) but can add latency (wait to fill a batch).
- **More replicas** — Can increase throughput and sometimes reduce latency (less queueing) but adds cost and complexity.
- **Caching** — Lowers latency and often increases effective throughput by reducing load on the backend.
- **Async processing** — Keeps request latency low by moving work to background; throughput of the async path is separate.

## Latency budgets

For a user-facing request, allocate a **budget** across stages (e.g. 50 ms DB, 30 ms cache, 20 ms network). That keeps total latency under a target (e.g. 200 ms p99) and guides where to optimize. If one stage exceeds its budget, it’s the first candidate for optimization or scaling.

## Use case

Set SLOs for latency and throughput; measure and alert. Optimize the bottleneck: if the system is latency-bound, reduce critical-path work; if it’s throughput-bound, add capacity or reduce work per request. See [Fundamentals — Performance and latency](../fundamentals/2-performance-and-latency.md) and [Antipatterns](1-performance-antipatterns.md).
