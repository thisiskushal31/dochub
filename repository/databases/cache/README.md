# In-Memory Cache

Data stored entirely in **RAM** for sub-millisecond latency. Used as a layer in front of slower databases or services.

## What it is

- Data lives in memory; optional persistence (e.g. Redis RDB/AOF)
- Very low latency; reduces load on primary store
- Typical use: cache DB/API results, sessions, rate limiters, pub/sub

## Examples

- **Redis** — Primary deep dive in this repo (key-value + cache)
- **Memcached** — Simple in-memory cache
- **Hazelcast** — Distributed in-memory data grid

## Why you use it (use cases)

- Reduce latency and protect primary DB from read spikes
- Session and short-lived state
- Rate limiting and counters
- Pub/sub and lightweight queues

## Databases (covered + planned)

- **[Redis](../key-value/redis/README.md)** — full deep dive (key-value + cache)
- **[Memcached](./memcached/README.md)** — deep dive planned
- **[Hazelcast](./hazelcast/README.md)** — deep dive planned

**Overview:** [Database types & use cases](../README.md#database-types--use-cases).
