# Databases Deep Dive — content write order

**Created:** August 2026  
**Repo #3** after [DevOps-Handbook](../DevOps-Handbook/CONTENT_WRITE_ORDER.md) and [Containerization-Deep-Dive](../Containerization-Deep-Dive/CONTENT_WRITE_ORDER.md).

---

## What is already solid (maintain / fix links only)

| Section | Status |
|---------|--------|
| [relational/mysql/](./relational/mysql/README.md) | **Written** (7 topics) + blog series |
| [relational/postgresql/](./relational/postgresql/README.md) | **Written** (10 topics) |
| [document/mongodb/](./document/mongodb/README.md) | **Written** (7 topics) + blog series |
| [key-value/redis/](./key-value/redis/README.md) | **Written** (7 topics) + blog series |
| [key-value/aerospike/](./key-value/aerospike/README.md) | **Written** (7 topics) + blog series |
| [search-engine/elasticsearch/](./search-engine/elasticsearch/README.md) | **Written** (7 topics) + blog |
| [concepts/dbms-fundamentals/](./concepts/dbms-fundamentals/README.md) | **Written** (7 topics) |
| [cloud-managed/README.md](./cloud-managed/README.md) | **Written** (single long guide) |
| [concepts/README.md](./concepts/README.md) | **Written** — fix stale links to old `nosql/*.md` paths (see step 0) |

**~103 markdown files today.** Majority of **engine depth** lives in 6 engines above.

---

## Lane C — recommended fill order

| Step | Focus | Why |
|------|--------|-----|
| 0 | Fix [concepts/README.md](./concepts/README.md) broken links | Points to removed `nosql/1-mysql.md` paths |
| 1 | [0_Start_Here.md](./0_Start_Here.md) + [Entry-Points/](./Entry-Points/README.md) | Navigation + sister repos |
| 2 | **Vector** — [pgvector](./vector/pgvector/README.md) first, then Weaviate/Milvus/Pinecone | RAG / DS-AI path |
| 3 | **Blob/object** — [gcs/](./blob-object/gcs/README.md), [s3/](./blob-object/s3/README.md), MinIO | DE + backups + static assets |
| 4 | [data-platform/](./data-platform/README.md) | Pipelines, migrations, ops at platform layer → DE repo |
| 5 | **Wide-column** — Cassandra, ScyllaDB | Scale-out patterns |
| 6 | **Key-value** — DynamoDB | Cloud-native apps |
| 7 | **Relational** — SQLite, SQL Server, Oracle (by need) |
| 8 | Graph, time-series, search (Solr, Meilisearch), cache (Memcached, Hazelcast) |
| 9 | Split [cloud-managed/](./cloud-managed/README.md) into topic files (optional refactor) |

Track per-engine progress in [PLANNED_ENGINES.md](./PLANNED_ENGINES.md).

---

## Sister repos

| Domain | Repository | Entry |
|--------|------------|-------|
| Data engineering pipelines | [Data-Engineering-Deep-Dive](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive) | [Entry-Points/Data_Engineering.md](./Entry-Points/Data_Engineering.md) |
| ML / RAG / embeddings science | [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive) | [Entry-Points/Data_Science_AI.md](./Entry-Points/Data_Science_AI.md) |
| System design (caching, sharding cases) | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) | [Entry-Points/System_Design.md](./Entry-Points/System_Design.md) |
| Delivery / managed DB ops | [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook) | [Entry-Points/DevOps_Handbook.md](./Entry-Points/DevOps_Handbook.md) |
| Blog narratives | [blog](https://thisiskushal31.github.io/blog/) | linked from root README |

---

## Stub convention (planned engines)

Each **📁 planned** engine README now lists:

- **Planned coverage** bullets  
- **Topic files** table (`1-*.md`, …)  
- **Checklist before marking done**  

Topic files marked `*(Content TBD)*` — fill using same style as MySQL/PostgreSQL topics.

---

## Repo #3 done when

- [ ] All 📁 engines have ≥1 filled topic (not just README)
- [ ] pgvector + GCS/S3 v1 complete (your GCP + RAG path)
- [ ] concepts/README links fixed
- [ ] data-platform/ links DE repo without duplicating pipeline authoring
