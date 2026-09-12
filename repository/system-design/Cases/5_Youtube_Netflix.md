# YouTube / Netflix (video streaming)

Design a **video streaming** platform: upload (YouTube) or ingest (Netflix) video, transcode to multiple qualities, store, and stream via CDN with low latency.

## Requirements

**Functional:** Upload video; process/transcode; stream at different qualities (ABR); optional metadata, search, recommendations.

**Non-functional:** High bandwidth (CDN); CPU-heavy transcoding (workers); scale to millions of videos and viewers.

## High-level design

1. **Upload / ingest** — Client uploads raw video to **object storage**; trigger processing. [Storage systems](../Databases/3_Storage_Systems.md)
2. **Transcoding** — Workers (or serverless) transcode to multiple resolutions/formats (e.g. HLS/DASH segments). Output to object storage. Job queue: [Message queues](../Messaging/1_Message_Queues.md).
3. **Metadata store** — Video metadata (title, owner, qualities, segment URLs). [Databases](../Databases/1_Database_Design_Overview.md)
4. **CDN** — Serve segments and thumbnails from edge; origin = object storage. [CDN](../Fundamentals/4_CDN.md)
5. **Streaming** — Client gets manifest (segment URLs), fetches segments from CDN, adapts quality (ABR).

## Key concepts

- **Object storage** — Raw uploads and transcoded segments. [Storage systems](../Databases/3_Storage_Systems.md)
- **CDN** — Most bytes from edge. [CDN](../Fundamentals/4_CDN.md)
- **Message queue** — Transcode jobs (upload complete → enqueue → workers). [Message queues](../Messaging/1_Message_Queues.md)
- **Caching** — Metadata, hot manifests. [Caching](../Caching/1_Caching_Overview.md)
- **Rate limiting** — Upload and API limits. [Rate limiting](../Performance/2_Rate_Limiting.md)

## Example flows

**Upload:** File → object storage → enqueue transcode job. Worker transcodes to 360p/720p/1080p, writes segments, updates metadata.

**Watch:** Client gets metadata and manifest URL; fetches manifest then segments from CDN; player does ABR.

## Real-world

**YouTube:** Ingest, transcoding at scale, global CDN. **Netflix:** Encoding ladder, Open Connect (edge). See [CDN](../Fundamentals/4_CDN.md), [Storage systems](../Databases/3_Storage_Systems.md), [Message queues](../Messaging/1_Message_Queues.md).

---

## Further reading (how it works in detail)

- **High Scalability:** [A 360° view of the Netflix stack](http://highscalability.com/blog/2015/11/9/a-360-degree-view-of-the-entire-netflix-stack.html), [Netflix: What happens when you press Play?](http://highscalability.com/blog/2017/12/11/netflix-what-happens-when-you-press-play.html); [YouTube architecture](http://highscalability.com/youtube-architecture).
- **Company blogs:** [Netflix Tech Blog](https://netflixtechblog.com) — e.g. [Building in-video search](https://netflixtechblog.com/building-in-video-search-936766f0017c).
- **YouTube (videos):** [YouTube scalability](https://www.youtube.com/watch?v=w5WVu624fY8); [Design YouTube](https://www.youtube.com/watch?v=jPKTo1iGQiE); [Design Netflix](https://www.youtube.com/watch?v=psQzyFfsUGU). **Article:** [LeetCode – Design YouTube (detailed)](https://leetcode.com/discuss/interview-question/system-design/733520/Design-YouTube-Very-detailed-design-with-diagrams).
- **More:** [Companies & products index](0_Companies_and_Products.md) — Netflix, YouTube, and more.
