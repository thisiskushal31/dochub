# Wide-Column Store

Wide-column stores use a table-like model where **each row can have a different set of columns**. They are designed for massive-scale reads and writes and very large partitions, with no single point of failure and linear scale-out.

## What it is

- Table-like structure: keys (row + column family/qualifier) map to values
- Rows can have different columns (sparse); no fixed schema per row
- Optimized for high write throughput and large partitions
- Often multi-datacenter with tunable consistency (e.g., quorum)

## Examples

- **Apache Cassandra** — Distributed, partition-centric, tunable consistency
- **HBase** — Hadoop ecosystem, strong consistency options
- **ScyllaDB** — C++ rewrite of Cassandra, low latency
- **Google Cloud Bigtable** — Managed wide-column service

## Why you use it (use cases)

- **Massive write throughput** — Event pipelines, IoT, clickstreams, time-ordered data per key
- **Very large partitions** — Time-series or entity-centric data where one partition can grow large
- **Multi-datacenter replication** — Active-active, tunable consistency
- **Sparse columns** — Many optional attributes per row without null-heavy relational tables
- **Scalability and availability** — No single point of failure; linear scale-out

## In this repo

- **Overview:** [Database types & use cases](../README.md#database-types--use-cases)
- **Cloud-managed:** [Cloud-managed databases](../cloud-managed/README.md) (e.g., Bigtable)
- **Concepts:** [Sharding & partitioning](../concepts/README.md), [Consistency models](../concepts/README.md)

## Databases (we're going to cover these)

- **[Cassandra](./cassandra/README.md)** — deep dive planned
- **[HBase](./hbase/README.md)** — deep dive planned
- **[ScyllaDB](./scylladb/README.md)** — deep dive planned
- **[Bigtable](./bigtable/README.md)** — deep dive planned (Google Cloud)
