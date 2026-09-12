# Instagram — feed and photo storage

Design **photo sharing** like Instagram: upload, feed timeline, followers, likes — terabytes of media, high read volume.

*(Stub — fill this case when you write it.)*

## Planned coverage

### Requirements

- Upload photo/video, follow users, home feed, profile grid
- Scale: millions of users, heavy read, global CDN

### High-level design

- Object storage for media; metadata DB sharded by user_id
- Feed: fan-out on write vs fan-out on read trade-off
- CDN for media delivery; thumbnail pipeline
- Consistent hashing for Cache/shard

### Key concepts

- [Caching/](../Caching/README.md), [Fundamentals/4_CDN.md](../Fundamentals/4_CDN.md), [Databases/10_Denormalization.md](../Databases/10_Denormalization.md), [Fundamentals/17_Consistent_Hashing.md](../Fundamentals/17_Consistent_Hashing.md)

### Failure modes (to fill)

- Celebrity fan-out, cold start feed, storage cost explosion

### Further reading

- [Instagram Engineering — Sharding IDs](https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c)
- [Companies index](./0_Companies_and_Products.md)

## Checklist before marking done

- [ ] Fan-out on write vs read decision with trade-off table
- [ ] Link [Cases/3_Twitter.md](./3_Twitter.md) for feed comparison
