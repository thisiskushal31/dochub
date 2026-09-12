# Google Drive / file sync (Dropbox-style)

Design a file sync and storage service like Google Drive or Dropbox.

## Requirements

Functional: Upload, download, delete; sync across devices; folder hierarchy; share files; optional versioning. Non-functional: Durable storage; low metadata latency; scale to millions of users.

## High-level design

- **Client**: Detects changes, uploads blocks, fetches metadata/content.
- **API / sync service**: Auth, metadata (file tree, versions), block upload/download.
- **Metadata store**: DB for user, file tree, block list per file, sharing. Shard by user_id. See [Sharding](../Databases/4_Database_Sharding.md), [Replication](../Databases/5_Database_Replication.md).
- **Object storage**: Store blocks by content hash; dedup. [Storage systems](../Databases/3_Storage_Systems.md).
- **Sync protocol**: Client sends block hashes; server returns missing; client uploads only those.

## Key concepts

Object storage for blocks; block-level dedup; metadata DB sharded; optional CDN; rate limiting. See [Storage systems](../Databases/3_Storage_Systems.md), [Sharding](../Databases/4_Database_Sharding.md), [Rate limiting](../Performance/2_Rate_Limiting.md).

## Example: upload

Client splits file into blocks, hashes each; asks server which hashes exist; uploads missing blocks; API updates metadata (file F, block list, version).

## Real-world

Dropbox: block dedup, metadata service. Google Drive: G Suite, Colossus/GCS-style storage.

---

## Further reading (how it works in detail)

- **YouTube:** [How we've scaled Dropbox](https://www.youtube.com/watch?v=PE4gwstWhmc) — company talk on scaling. [Design Dropbox](https://www.youtube.com/watch?v=jLM1nGgsT-I). [Design file sharing like Dropbox](https://www.youtube.com/watch?v=U0xTu6E2CT8).
- **Company blog:** [Dropbox Tech Blog](https://tech.dropbox.com/) — engineering posts on storage, sync, and infrastructure.
- **More companies:** [Companies & products index](0_Companies_and_Products.md) — Dropbox, Google, and others with High Scalability / blog links.
