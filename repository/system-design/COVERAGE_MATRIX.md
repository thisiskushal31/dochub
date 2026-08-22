# System Design — industry coverage matrix

**Purpose:** Map **2025–2026 industry checklists** (DesignGurus, FAANG prep guides, CalibreOS HLD rubric) to **this repo** so nothing is forgotten. Update when you fill a gap.

**Legend:** ✅ covered (adequate depth) · ⚠️ partial / thin · 📁 stub only · ❌ missing · 🔗 sister repo owns depth

Benchmark sources (August 2026): [DesignGurus 2026 rubric](https://www.designgurus.io/system-design-interview), [CalibreOS HLD guide](https://www.calibreos.com/blog/hld-system-design-interview-complete-guide), common FAANG topic lists (rate limiter, feed, chat, storage, search, payments).

---

## Tier 1 — Traffic & distribution (every interview)

| Industry topic | Status | Where in repo | Gap action |
|----------------|--------|---------------|------------|
| Load balancing L4/L7, algorithms | ✅ | [fundamentals/5-load-balancers.md](./fundamentals/5-load-balancers.md) | Deepen if needed |
| CDN / edge | ✅ | [fundamentals/4-cdn.md](./fundamentals/4-cdn.md) | — |
| Caching strategies (aside, through, behind) | ⚠️ | [caching/](./caching/README.md) — several thin | [THIN_TOPICS.md](./THIN_TOPICS.md) |
| Cache stampede / hot keys | 📁 | [failure-modes/1-cache-stampede-and-hot-keys.md](./failure-modes/1-cache-stampede-and-hot-keys.md) | **Fill** |
| Rate limiting (token bucket, sliding window) | ⚠️ | [performance/2-rate-limiting.md](./performance/2-rate-limiting.md) + [cases/10-rate-limiter-design.md](./cases/10-rate-limiter-design.md) | Deepen + fill case |
| Message queues / event buses | ✅ | [messaging/](./messaging/README.md) | — |
| API Gateway / BFF | ⚠️ | [fundamentals/13-api-gateway.md](./fundamentals/13-api-gateway.md) | Deepen |
| DNS (design level) | ⚠️ | [fundamentals/3-dns.md](./fundamentals/3-dns.md) | 🔗 [Networks Services/DNS](../Networks-Deep-Dive/Services/2_DNS.md) |

---

## Tier 2 — Data & state (every interview)

| Industry topic | Status | Where in repo | Gap action |
|----------------|--------|---------------|------------|
| SQL vs NoSQL selection | ✅ | [databases/2-sql-vs-nosql-selection.md](./databases/2-sql-vs-nosql-selection.md) | — |
| Sharding / partitioning | ✅ | [databases/4-database-sharding.md](./databases/4-database-sharding.md), [storage/2-partitioning.md](./storage/2-partitioning.md) | — |
| Replication & consistency | ✅ | [databases/5-database-replication.md](./databases/5-database-replication.md), [consistency/](./consistency/README.md) | Some files thin |
| CAP theorem | ✅ | [databases/6-cap-theorem.md](./databases/6-cap-theorem.md), [consistency/2-cap-theorem.md](./consistency/2-cap-theorem.md) | Add PACELC → [primer-gaps/](./primer-gaps/README.md) |
| Consistent hashing | ✅ | [fundamentals/17-consistent-hashing.md](./fundamentals/17-consistent-hashing.md) | — |
| Indexing (B-tree, LSM) | ⚠️ | [storage/1-indexing.md](./storage/1-indexing.md) | Deepen LSM |
| Search at scale (inverted index, ranking) | 📁 | [primer-gaps/3-search-at-scale.md](./primer-gaps/3-search-at-scale.md) | **Fill** — case 3 Twitter partial |
| Idempotency / exactly-once UX | ⚠️ | [consistency/4-idempotency.md](./consistency/4-idempotency.md) | Deepen; link Stripe case |
| Distributed transactions | 📁 | [primer-gaps/1-distributed-transactions-and-saga.md](./primer-gaps/1-distributed-transactions-and-saga.md) | Was only in compensating-tx |
| 2PC / 3PC | 📁 | same as above | **Fill** |
| Saga pattern | ⚠️ | [consistency/6-compensating-transactions.md](./consistency/6-compensating-transactions.md) | Standalone primer gap |
| Consensus (Raft/Paxos) | ⚠️ | [consistency/5-consensus-algorithms.md](./consistency/5-consensus-algorithms.md) | Deepen |
| Leader election | ⚠️ | [patterns/3-leader-election.md](./patterns/3-leader-election.md) | Deepen |
| Unique IDs (Snowflake, UUID) | 📁 | [primer-gaps/2-unique-ids-and-ordering.md](./primer-gaps/2-unique-ids-and-ordering.md) | **Fill** |
| Object / blob storage | ✅ | [databases/3-storage-systems.md](./databases/3-storage-systems.md) | 🔗 Databases-Deep-Dive blob-object |

---

## Tier 3 — Patterns & resilience

| Industry topic | Status | Where in repo | Gap action |
|----------------|--------|---------------|------------|
| Circuit breaker / bulkhead / retry | ⚠️ | [patterns/4-circuit-breaker.md](./patterns/4-circuit-breaker.md), [patterns/5-bulkhead-and-retry.md](./patterns/5-bulkhead-and-retry.md) | Deepen |
| CQRS / event sourcing | ✅ | [patterns/1-event-sourcing.md](./patterns/1-event-sourcing.md), [patterns/2-cqrs.md](./patterns/2-cqrs.md) | — |
| Fan-out on write vs read | ⚠️ | [cases/3-twitter.md](./cases/3-twitter.md), Instagram stub | Deepen in cases |
| Split brain / partition | 📁 | [failure-modes/2-split-brain-and-partition.md](./failure-modes/2-split-brain-and-partition.md) | **Fill** |
| Cascading failures | 📁 | [failure-modes/3-cascading-failures-and-timeout-storms.md](./failure-modes/3-cascading-failures-and-timeout-storms.md) | **Fill** |
| Data loss / RPO-RTO | 📁 | [failure-modes/4-data-loss-and-durability-gaps.md](./failure-modes/4-data-loss-and-durability-gaps.md) | **Fill** |
| Gossip protocol | 📁 | [primer-gaps/4-gossip-and-membership.md](./primer-gaps/4-gossip-and-membership.md) | **Fill** |
| Bloom filter / HyperLogLog / Count-Min | 📁 | [primer-gaps/5-probabilistic-data-structures.md](./primer-gaps/5-probabilistic-data-structures.md) | **Fill** |
| CRDT | 📁 | [primer-gaps/6-crdt-and-collaborative-state.md](./primer-gaps/6-crdt-and-collaborative-state.md) | **Fill** |
| Merkle trees | 📁 | [primer-gaps/7-merkle-trees-and-sync.md](./primer-gaps/7-merkle-trees-and-sync.md) | **Fill** — Drive case |
| Multi-region / geo | 📁 | [primer-gaps/8-multi-region-and-geo.md](./primer-gaps/8-multi-region-and-geo.md) | **Fill** |
| Multi-tenancy | 📁 | [primer-gaps/9-multi-tenancy.md](./primer-gaps/9-multi-tenancy.md) | **Fill** |
| Batch / stream processing | 📁 | [primer-gaps/10-batch-and-stream-processing.md](./primer-gaps/10-batch-and-stream-processing.md) | **Fill** — 🔗 DE repo |

---

## Tier 4 — Observability & ops (2026 rubric)

| Industry topic | Status | Where in repo | Gap action |
|----------------|--------|---------------|------------|
| Four golden signals / SLI-SLO | ⚠️ | [observability/](./observability/README.md) — **9 files thin** | **Batch deepen** [THIN_TOPICS.md](./THIN_TOPICS.md) |
| Distributed tracing | ⚠️ | [observability/9-distributed-tracing.md](./observability/9-distributed-tracing.md) | Deepen · 🔗 DevOps Observability |
| Cost vs performance | ⚠️ | [performance/4-cost-vs-performance.md](./performance/4-cost-vs-performance.md) | Deepen — **2026 rubric** |
| Back-of-envelope / capacity math | ⚠️ | [fundamentals/12-hld-and-lld.md](./fundamentals/12-hld-and-lld.md) | Add dedicated section or primer |

---

## Tier 5 — Security at design time

| Industry topic | Status | Where in repo | Gap action |
|----------------|--------|---------------|------------|
| Authn vs authz | ⚠️ | [security/7-authentication-vs-authorization.md](./security/7-authentication-vs-authorization.md) | Deepen |
| OAuth / JWT / federated identity | ⚠️ | [security/2-federated-identity.md](./security/2-federated-identity.md) | Deepen |
| TLS / encryption trade-offs | ⚠️ | [security/6-ssl-and-tls.md](./security/6-ssl-and-tls.md) | 🔗 Networks Security |
| Threat modeling | 📁 | [security-tradeoffs/1-threat-modeling-at-design-time.md](./security-tradeoffs/1-threat-modeling-at-design-time.md) | **Fill** |
| Zero trust / mTLS | 📁 | [security-tradeoffs/2-auth-design-vs-zero-trust.md](./security-tradeoffs/2-auth-design-vs-zero-trust.md) | **Fill** |
| DDoS / abuse at design level | 📁 | [primer-gaps/11-abuse-and-ddos-design.md](./primer-gaps/11-abuse-and-ddos-design.md) | **Fill** |
| Full AppSec / OWASP program | 🔗 | [Entry-Points/Security_Deep_Dive.md](./Entry-Points/Security_Deep_Dive.md) | Security-Deep-Dive capstone |

---

## Tier 6 — Modern / AI era (2024+ rubric — was not in older prep)

| Industry topic | Status | Where in repo | Gap action |
|----------------|--------|---------------|------------|
| Vector DB / embeddings storage | ⚠️ | [databases/README.md](./databases/README.md) type 10 | 🔗 Databases pgvector · DS-AI repo |
| RAG pipeline design | 📁 | [primer-gaps/12-rag-and-llm-gateway-design.md](./primer-gaps/12-rag-and-llm-gateway-design.md) | **Fill** · 🔗 DS-AI |
| LLM gateway (rate limit, cache, routing) | 📁 | same | **Fill** |
| OWASP LLM Top 10 (design angle) | 📁 | security-tradeoffs + Security-Deep-Dive | Cross-link when Security repo built |

---

## Case studies — industry “top 15” vs repo

| Common interview prompt | Status | File |
|-------------------------|--------|------|
| URL shortener | ⚠️ moderate | [cases/6-url-shortener.md](./cases/6-url-shortener.md) |
| Rate limiter | 📁 stub | [cases/10-rate-limiter-design.md](./cases/10-rate-limiter-design.md) |
| News / social feed | ⚠️ | [cases/3-twitter.md](./cases/3-twitter.md), [8-instagram-feed.md](./cases/8-instagram-feed.md) |
| Chat / messaging | ⚠️ | [cases/2-whatsapp.md](./cases/2-whatsapp.md), [7-discord.md](./cases/7-discord-messaging.md), [11-slack-realtime.md](./cases/11-slack-realtime.md) |
| Video (YouTube/Netflix) | 📁 stub | [cases/5-youtube-netflix.md](./cases/5-youtube-netflix.md) |
| File sync (Drive/Dropbox) | 📁 stub | [cases/1-google-drive-file-sync.md](./cases/1-google-drive-file-sync.md) |
| Ride-sharing / maps | 📁 stub | [cases/4-uber.md](./cases/4-uber.md) |
| Payments (Stripe) | 📁 stub | [cases/9-stripe-payments.md](./cases/9-stripe-payments.md) |
| Notification system | ❌ | [PLANNED_CASES.md](./PLANNED_CASES.md) — add case 12 |
| Search engine | ❌ | primer-gaps + planned case |
| Email service | ❌ | planned case |
| Ticket / event booking | ❌ | planned case |
| Recommendation engine | ❌ | planned case |
| Distributed cron / scheduler | ❌ | planned case |
| Web crawler | ❌ | planned case |

Full tracker: [PLANNED_CASES.md](./PLANNED_CASES.md)

---

## Verdict (August 2026)

**You are NOT missing the skeleton** — fundamentals, databases, caching, messaging, CAP, consistent hashing, and core cases exist.

**You ARE missing depth and modern tier:**

1. **~40+ thin topic files** — especially `observability/` and `security/`
2. **12 primer-gaps stubs** — gossip, bloom filters, 2PC/saga standalone, search-at-scale, etc.
3. **Cases** — most are outlines; need failure modes + capacity math
4. **2026 tier** — RAG/vector/LLM gateway design (stubs in `primer-gaps/`)
5. **Sister repos** — engine depth (Databases), wire depth (Networks), cyber capstone (Security) — by design, not duplication

**Fill order:** [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md) → [THIN_TOPICS.md](./THIN_TOPICS.md) → [primer-gaps/](./primer-gaps/README.md) → [PLANNED_CASES.md](./PLANNED_CASES.md)
