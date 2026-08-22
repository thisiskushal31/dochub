# Cache stampede and hot keys

[← failure-modes](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- **Cache stampede:** many requests miss cache simultaneously; DB overload
- Mitigations: probabilistic early expiration, request coalescing (singleflight), mutex per key
- **Hot keys:** skewed access (celebrity tweet, viral product); single shard/node saturation
- Mitigations: local cache layer, key splitting, read replicas, CDN edge
- Case links: [Twitter](../cases/3-twitter.md), [URL shortener](../cases/6-url-shortener.md)
- Validation: load test with Zipf distribution; monitor cache hit rate and DB QPS spike

## Cross-references

- [caching/](../caching/README.md) · [databases/4-database-sharding.md](../databases/4-database-sharding.md)

## Checklist before marking done

- [ ] Diagram: stampede timeline
- [ ] Table: mitigation → latency vs consistency cost
