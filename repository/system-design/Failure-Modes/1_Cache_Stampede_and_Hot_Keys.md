# Cache stampede and hot keys

[← failure-modes](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- **Cache stampede:** many requests miss cache simultaneously; DB overload
- Mitigations: probabilistic early expiration, request coalescing (singleflight), mutex per key
- **Hot keys:** skewed access (celebrity tweet, viral product); single shard/node saturation
- Mitigations: local cache layer, key splitting, read replicas, CDN edge
- Case links: [Twitter](../Cases/3_Twitter.md), [URL shortener](../Cases/6_URL_Shortener.md)
- Validation: load test with Zipf distribution; monitor cache hit rate and DB QPS spike

## Cross-references

- [Caching/](../Caching/README.md) · [Databases/4_Database_Sharding.md](../Databases/4_Database_Sharding.md)

## Checklist before marking done

- [ ] Diagram: stampede timeline
- [ ] Table: mitigation → latency vs consistency cost
