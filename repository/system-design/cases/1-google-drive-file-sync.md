# Google Drive / file sync (Dropbox-style)

Design a file sync and storage service like Google Drive or Dropbox.

## Requirements

Functional: Upload, download, delete; sync across devices; folder hierarchy; share files; optional versioning. Non-functional: Durable storage; low metadata latency; scale to millions of users.

## High-level design

- **Client**: Detects changes, uploads blocks, fetches metadata/content.
- **API / sync service**: Auth, metadata (file tree, versions), block upload/download.
- **Metadata store**: DB for user, file tree, block list per file, sharing. Shard by user_id. See [Sharding](../databases/4-database-sharding.md), [Replication](../databases/5-database-replication.md).
- **Object storage**: Store blocks by content hash; dedup. [Storage systems](../databases/3-storage-systems.md).
- **Sync protocol**: Client sends block hashes; server returns missing; client uploads only those.

## Key concepts

Object storage for blocks; block-level dedup; metadata DB sharded; optional CDN; rate limiting. See [Storage systems](../databases/3-storage-systems.md), [Sharding](../databases/4-database-sharding.md), [Rate limiting](../performance/2-rate-limiting.md).

## Example: upload

Client splits file into blocks, hashes each; asks server which hashes exist; uploads missing blocks; API updates metadata (file F, block list, version).

## Real-world

Dropbox: block dedup, metadata service. Google Drive: G Suite, Colossus/GCS-style storage.

---

## Further reading (how it works in detail)

- **YouTube:** [How we've scaled Dropbox](https://www.youtube.com/watch?v=PE4gwstWhmc) — company talk on scaling. [Design Dropbox](https://www.youtube.com/watch?v=jLM1nGgsT-I). [Design file sharing like Dropbox](https://www.youtube.com/watch?v=U0xTu6E2CT8).
- **Company blog:** [Dropbox Tech Blog](https://tech.dropbox.com/) — engineering posts on storage, sync, and infrastructure.
- **More companies:** [Companies & products index](0-companies-and-products.md) — Dropbox, Google, and others with High Scalability / blog links.
