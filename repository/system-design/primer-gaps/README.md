# Primer gaps — missing industry topics

Topics that appear on **2025–2026 system design checklists** but were **missing or only one-line mentions** in this repo (August 2026 audit). Each file is a stub — fill using repo style (What → Why → How → Trade-offs → When to use).

**Master map:** [COVERAGE_MATRIX.md](../COVERAGE_MATRIX.md)

---

## Topics

| # | File | Why it matters |
|---|------|----------------|
| 1 | [Distributed transactions, 2PC, saga](./1-distributed-transactions-and-saga.md) | Payments, orders, cross-service writes |
| 2 | [Unique IDs and ordering (Snowflake, UUID)](./2-unique-ids-and-ordering.md) | Sharding, Twitter/Discord IDs |
| 3 | [Search at scale](./3-search-at-scale.md) | Inverted index, ranking, Elasticsearch role |
| 4 | [Gossip and membership](./4-gossip-and-membership.md) | Cassandra, Dynamo-style clusters |
| 5 | [Probabilistic data structures](./5-probabilistic-data-structures.md) | Bloom filter, HyperLogLog, Count-Min Sketch |
| 6 | [CRDT and collaborative state](./6-crdt-and-collaborative-state.md) | Google Docs, Figma-style sync |
| 7 | [Merkle trees and sync](./7-merkle-trees-and-sync.md) | Git, Drive block dedup, integrity |
| 8 | [Multi-region and geo](./8-multi-region-and-geo.md) | Latency, consistency, failover |
| 9 | [Multi-tenancy](./9-multi-tenancy.md) | SaaS isolation, noisy neighbor |
| 10 | [Batch and stream processing](./10-batch-and-stream-processing.md) | MapReduce, Kafka, Flink — design level |
| 11 | [Abuse and DDoS at design level](./11-abuse-and-ddos-design.md) | Rate limits, WAF, edge protection |
| 12 | [RAG and LLM gateway design](./12-rag-and-llm-gateway-design.md) | 2026 rubric — vector + gateway + eval |

## Also add (short — in COVERAGE_MATRIX only for now)

- **PACELC** — extend [consistency/2-cap-theorem.md](../consistency/2-cap-theorem.md) or add § to primer 1
- **Notification system design** — planned as [cases/12-notification-system.md](../cases/12-notification-system.md)
- **Geospatial fundamentals** — extend [cases/4-uber.md](../cases/4-uber.md) or add `13-geospatial-indexing.md` here later

## Learning path

After [databases/](./databases/README.md) + [consistency/](./consistency/README.md): pick by case need (Stripe → 1,2; Twitter → 3; Discord → 2,4; Drive → 7).

## Cross-references

- [failure-modes/](../failure-modes/README.md) · [cases/](../cases/README.md) · [Databases-Deep-Dive vector](https://github.com/thisiskushal31/Databases-Deep-Dive) · [Data-Science-AI-Deep-Dive](../Data-Science-AI-Deep-Dive/CONTENT_WRITE_ORDER.md)
