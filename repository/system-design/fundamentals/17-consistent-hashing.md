# Consistent Hashing

## What it is

**Consistent hashing** is a scheme to map **keys** (e.g. cache keys, partition keys) to **nodes** (e.g. cache servers, DB shards) so that when nodes are **added or removed**, only a **small fraction** of keys move. Ordinary modulo hashing (key % N) causes most keys to remap when N changes.

## Why we need it

- **Scaling** — Adding or removing nodes (e.g. caches, shards) should not reassign all keys; only keys near the changed node should move.
- **Load** — With a good implementation (e.g. virtual nodes), load is spread evenly across nodes.
- **Use case:** Distributed caches (e.g. Memcached, Redis Cluster), CDN edge selection, sharding in distributed storage.

## How it works (concept)

1. Imagine a **ring** (hash space): 0 to 2^32 − 1 (or similar).
2. **Nodes** are hashed onto the ring (e.g. by node id or by many "virtual" nodes per physical node).
3. **Keys** are hashed onto the ring. A key belongs to the **first node clockwise** (or counterclockwise) from the key’s position.
4. When a **node is added**, only keys that now fall in that node’s segment move. When a **node is removed**, only its keys move to the next node.

## Virtual nodes (vnodes)

- Each physical node is represented by **many** points on the ring (virtual nodes). This reduces load imbalance when the number of nodes is small.
- More virtual nodes → more uniform distribution; more memory/bookkeeping.

## Trade-offs

- **Advantages:** Minimal key movement on scale in/out; good for caches and sharded storage.
- **Disadvantages:** Can still have some imbalance without vnodes; implementation is more complex than simple modulo.

**When to use:** Whenever you distribute data or load across a set of nodes that may grow or shrink (caches, shards, CDN). See [Partitioning](../storage/2-partitioning.md) for rebalancing in storage systems.
