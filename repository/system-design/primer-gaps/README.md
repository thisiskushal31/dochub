# Primer gaps — missing industry topics

Topics that appear on **2025–2026 system design checklists** but were **missing or only one-line mentions** in this repo (August 2026 audit). Each file is a stub — fill using repo style (What → Why → How → Trade-offs → When to use).

---

## Topics

| # | File | Why it matters |
|---|------|----------------|
| 1 | [Distributed transactions, 2PC, saga](./1_Distributed_Transactions_and_Saga.md) | Payments, orders, cross-service writes |
| 2 | [Unique IDs and ordering (Snowflake, UUID)](./2_Unique_Ids_and_Ordering.md) | Sharding, Twitter/Discord IDs |
| 3 | [Search at scale](./3_Search_At_Scale.md) | Inverted index, ranking, Elasticsearch role |
| 4 | [Gossip and membership](./4_Gossip_and_Membership.md) | Cassandra, Dynamo-style clusters |
| 5 | [Probabilistic data structures](./5_Probabilistic_Data_Structures.md) | Bloom filter, HyperLogLog, Count-Min Sketch |
| 6 | [CRDT and collaborative state](./6_Crdt_and_Collaborative_State.md) | Google Docs, Figma-style sync |
| 7 | [Merkle trees and sync](./7_Merkle_Trees_and_Sync.md) | Git, Drive block dedup, integrity |
| 8 | [Multi-region and geo](./8_Multi_Region_and_Geo.md) | Latency, consistency, failover |
| 9 | [Multi-tenancy](./9_Multi_Tenancy.md) | SaaS isolation, noisy neighbor |
| 10 | [Batch and stream processing](./10_Batch_and_Stream_Processing.md) | MapReduce, Kafka, Flink — design level |
| 11 | [Abuse and DDoS at design level](./11_Abuse_and_Ddos_Design.md) | Rate limits, WAF, edge protection |
| 12 | [RAG and LLM gateway design](./12_RAG_and_LLM_Gateway_Design.md) | 2026 rubric — vector + gateway + eval |

## Also add later

- **PACELC** — extend [Consistency/2_CAP_Theorem.md](../Consistency/2_CAP_Theorem.md) or add § to primer 1
- **Notification system design** — planned as [Cases/12_Notification_System.md](../Cases/12_Notification_System.md)
- **Geospatial fundamentals** — extend [Cases/4_Uber.md](../Cases/4_Uber.md) or add `13-geospatial-indexing.md` here later

## Learning path

After [Databases/](./Databases/README.md) + [Consistency/](./Consistency/README.md): pick by case need (Stripe → 1,2; Twitter → 3; Discord → 2,4; Drive → 7).

## Cross-references

- [Failure-Modes/](../Failure-Modes/README.md) · [Cases/](../Cases/README.md) · [Databases-Deep-Dive vector](https://github.com/thisiskushal31/Databases-Deep-Dive) · [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive)
