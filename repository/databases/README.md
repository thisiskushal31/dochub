# Databases Deep Dive

Hands-on notes for databases in general—relational, NoSQL, analytical, and
cloud-managed services. Includes fundamentals, design patterns, operations,
and troubleshooting checklists to help you solidify concepts across engines.

## Structure

- `relational/` — SQL fundamentals, schema design, indexing, transactions, HA/DR.
- `nosql/` — key-value, document, wide-column, graph, time-series basics and trade-offs.
- `cloud-managed/` — managed offerings (RDS/Cloud SQL/Spanner/Bigtable/DynamoDB) and migrations.
- `concepts/` — cross-cutting topics: replication, sharding, consistency, backups, performance tuning.

## How to use

1. Start with `concepts/` to refresh fundamentals.
2. Jump into `relational/` or `nosql/` based on the workload you’re exploring.
3. For hosted options, see `cloud-managed/` for service-specific notes and pitfalls.
4. Keep the checklists handy for ops tasks (backup/restore, migrations, performance).

## Contributing

- Prefer concise, copy/paste-ready commands and checklists.
- Call out trade-offs and defaults that commonly surprise people.
- Keep examples minimal and runnable; include links or diagrams when they clarify.
