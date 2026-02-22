# Indexing

## What indexes do

Indexes speed up **data retrieval** by maintaining a structure (e.g. B-tree, LSM) that maps search keys to the location of rows or records. The trade-off: **faster reads**, **slower writes** (every insert/update/delete must update the index), and **extra storage**.

The diagram below illustrates how indexes sit alongside data and map keys to storage locations.

![Indexes: key-to-location mapping for faster lookup](../assets/storage/indexes.png)

## Dense vs sparse

- **Dense index** — One index entry per row. Fast lookup (e.g. binary search); more memory and write overhead.
- **Sparse index** — One entry per block or page. Less memory and write cost; after finding the block, a scan may be needed. Suited to **ordered** data.

## Common index types

- **B-tree** — Good for range queries and ordered access; standard in many RDBMSs.
- **Hash** — Good for equality lookups; no range scan.
- **Secondary indexes** — Index on non-primary columns; can be covering (include all needed columns) to avoid table lookups.
- **Full-text search (FTS)** — For text search; often inverted index.

**Use case:** Add indexes for hot query patterns; avoid over-indexing write-heavy tables. See also [Partitioning](2-partitioning.md) and [OLTP vs OLAP](4-oltp-vs-olap.md).
