# Partitioning

## Why partition

Splitting data across **multiple physical partitions** (shards, tables, or nodes) improves manageability, performance, and availability. Each partition holds a subset of the data.

## Horizontal partitioning (sharding)

- Rows are split by a **partition key** (e.g. user_id, tenant_id). Each shard holds a range or hash bucket of keys.
- **Pros:** Scale reads/writes by adding shards; smaller working sets per node.
- **Cons:** Cross-shard joins are expensive or impossible; rebalancing and schema changes are harder.

## Vertical partitioning

- Split **columns** across tables or stores (e.g. hot columns in one store, cold or large blobs in another).
- **Pros:** Limit what each query touches; separate access patterns.
- **Cons:** More tables and joins; schema evolution affects multiple stores.

## Design choices

- **Partition key** — Choose to avoid hotspots and allow efficient query patterns.
- **Rebalancing** — Plan for adding/removing nodes and moving partitions (e.g. consistent hashing, range splits).
- **Locality** — Keep related data in the same partition when possible to avoid cross-partition work.

**Use case:** Large tables or datasets that outgrow a single node; read/write scaling and isolation. See [Databases — Sharding](../databases/4-database-sharding.md) for more.
