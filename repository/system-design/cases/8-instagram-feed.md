# Instagram — feed and photo storage

Design **photo sharing** like Instagram: upload, feed timeline, followers, likes — terabytes of media, high read volume.

*(Content TBD — stub created August 2026 — priority v1 in [PLANNED_CASES.md](../PLANNED_CASES.md))*

## Planned coverage

### Requirements

- Upload photo/video, follow users, home feed, profile grid
- Scale: millions of users, heavy read, global CDN

### High-level design

- Object storage for media; metadata DB sharded by user_id
- Feed: fan-out on write vs fan-out on read trade-off
- CDN for media delivery; thumbnail pipeline
- Consistent hashing for cache/shard

### Key concepts

- [caching/](../caching/README.md), [fundamentals/4-cdn.md](../fundamentals/4-cdn.md), [databases/10-denormalization.md](../databases/10-denormalization.md), [fundamentals/17-consistent-hashing.md](../fundamentals/17-consistent-hashing.md)

### Failure modes (to fill)

- Celebrity fan-out, cold start feed, storage cost explosion

### Further reading

- [Instagram Engineering — Sharding IDs](https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c)
- [Companies index](./0-companies-and-products.md)

## Checklist before marking done

- [ ] Fan-out on write vs read decision with trade-off table
- [ ] Link [cases/3-twitter.md](./3-twitter.md) for feed comparison
