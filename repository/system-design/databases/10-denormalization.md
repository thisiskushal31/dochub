# Denormalization in Databases

## What it is

**Denormalization** is the intentional **introduction of redundancy** into a database design (e.g. storing the same or derived data in more than one place) to improve **read performance** or simplify queries. It trades **normal form** (and some write consistency complexity) for faster reads and fewer joins.

## Why we use it

- **Read performance** — Avoid expensive joins or multiple round-trips; pre-join or copy data so reads are single-table or single-document.
- **Simpler queries** — Application or reporting queries become simpler and faster.
- **Scale reads** — Read replicas with denormalized views can serve heavy read load without overloading the normalized write path.

## How it works

- **Duplicate columns** — Copy a column from one table into another (e.g. `customer_name` in `orders` so you don’t join to `customers` for every order list).
- **Aggregates** — Store precomputed aggregates (e.g. count, sum) that would otherwise require scanning or joining many rows.
- **Materialized views / read models** — Maintain a separate table or view that is a denormalized projection of normalized data; refresh periodically or via events. See [CQRS](../patterns/2-cqrs.md).

## Trade-offs

- **Advantages:** Faster reads, simpler read queries, better fit for read-heavy or reporting workloads.
- **Disadvantages:** **Write path** must keep denormalized data in sync (multiple places to update); risk of **inconsistency** if updates fail partially; more **storage**. Use when read gain outweighs write and consistency cost.

## When to use

- **Read-heavy** access patterns where joins are the bottleneck.
- **Reporting or analytics** where you can tolerate eventual consistency (e.g. materialized views refreshed on a schedule).
- **CQRS** — Keep writes normalized; maintain denormalized read models for queries. See [CQRS](../patterns/2-cqrs.md) and [Database design overview](1-database-design-overview.md). Prefer **normalization** for the system of record when consistency and write simplicity matter; add denormalization where reads justify it.
