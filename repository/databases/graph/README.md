# Graph Database

Graph databases store data as **nodes** (entities) and **edges** (relationships). They are built for highly connected data where **traversing relationships** is the primary operation.

## What it is

- **Nodes** — Entities (users, products, accounts)
- **Edges** — Relationships (follows, bought, owns) with optional direction and properties
- Queries traverse the graph (e.g., “friends of friends”, shortest path, pattern matching)
- Often use dedicated query languages (Cypher, Gremlin, SPARQL)

## Examples

- **Neo4j** — Property graph, Cypher query language
- **Amazon Neptune** — Managed, supports Gremlin and SPARQL
- **ArangoDB** — Multi-model (document + graph)

## Why you use it (use cases)

- **Relationship-heavy data** — Social graphs, followers, collaborations
- **Recommendations** — “Users who bought this also bought”, multi-hop similarity
- **Fraud and identity** — Detecting rings, connected accounts, suspicious paths
- **Knowledge graphs** — Ontologies, taxonomies, linked entities
- **Network and dependency analysis** — IT topology, supply chain, org charts

## In this repo

- **Overview:** [Database types & use cases](../README.md#database-types--use-cases)
- **Cloud-managed:** [Cloud-managed databases](../cloud-managed/README.md) (e.g., Neptune)
- **Concepts:** [Database concepts](../concepts/README.md)

## Databases (we're going to cover these)

- **[Neo4j](./neo4j/README.md)** — deep dive planned
- **[Neptune](./neptune/README.md)** — deep dive planned (Amazon)
- **[ArangoDB](./arangodb/README.md)** — deep dive planned
