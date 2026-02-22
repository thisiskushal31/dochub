# Performance vs Scalability · Latency vs Throughput

## Performance vs scalability

- **Scalable** = adding resources gives a proportional increase in **performance** (more work done, or larger work units as data grows).
- **Performance problem** → system is slow for a **single user**.
- **Scalability problem** → system is fast for one user but **slow under heavy load**.

**Use case:** Optimize single-request speed first (performance); then add capacity (scalability) when load grows.

---

## Latency vs throughput

| Term | Meaning |
|------|--------|
| **Latency** | Time for the system to **respond** to a request. |
| **Throughput** | Number of requests the system can handle **at the same time**. |

**Goal:** Maximize throughput while keeping latency acceptable.

**Trade-off:** Improving one can hurt the other (e.g. batching increases throughput but can add latency).
