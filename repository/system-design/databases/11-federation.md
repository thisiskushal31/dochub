# Database Federation

## What it is

**Federation** (or **database federation**) is the use of a **single logical interface** to query or write to **multiple distinct databases** (often different instances, types, or owners). The federated layer routes requests to the right database and can combine or proxy results so the application sees one logical data source.

## Why we need it

- **Multiple backends** — Data lives in different systems (e.g. legacy DB, new microservice DB, external API); the application does not want to manage multiple connections and query languages.
- **Separation of concerns** — Different teams or services own different databases; federation provides a unified view or gateway without moving data.
- **Gradual migration** — Route some tables or queries to a new database while others stay on the old one.

## How it works

1. Application (or a **federated query engine**) sends a query to the federated layer.
2. The layer **determines** which underlying database(s) hold the relevant data (via configuration, schema mapping, or routing rules).
3. The layer **executes** the query against that database (or multiple) and may **combine** or **proxy** results back to the application.

## Trade-offs

- **Advantages:** Single entry point, ability to integrate heterogeneous sources, flexibility in where data lives.
- **Disadvantages:** Extra hop and complexity, limited join/transaction support across sources, potential performance and consistency issues. Not a replacement for proper data modeling and replication when you need strong consistency across data.

## When to use

Use federation when you must **query or write across multiple independent databases** through one interface (e.g. reporting across systems, legacy integration). Prefer **single ownership of data** and **replication or events** when you need strong consistency and simple operations. See [Sharding](4-database-sharding.md) for splitting one dataset; federation is about **multiple** datasets or systems.
