# System design cases

Real-world and interview-style **product system design** cases: how major systems are (or could be) built. Each case ties back to the concept notes (databases, caching, messaging, etc.) and includes **Further reading** links to **Medium**, **YouTube**, **company engineering blogs**, and **High Scalability** — not just GitHub repos.

**Use:** Study one product at a time; map requirements → high-level design → components → bottlenecks. Use the links for "how it actually works." Good prep for "Design X like Y" interviews.

---

## Companies & products index

**[Companies & products — system design resources](0_Companies_and_Products.md)** — One place for **many companies**: Amazon, Airbnb, Discord, Dropbox, Facebook, Instagram, Netflix, Slack, Stripe, Twitter, Uber, WhatsApp, YouTube, and more. Links to High Scalability, YouTube, Medium, and company blogs (e.g. Netflix Tech Blog, Uber Engineering, Dropbox Tech Blog).

---

## Case studies (with concept links + external links)

| Case | Product | Key concepts |
|------|--------|--------------|
| [Google Drive / file sync](1_Google_Drive_File_Sync.md) | Google Drive, Dropbox | Object storage, block dedup, metadata DB, sync protocol |
| [WhatsApp](2_Whatsapp.md) | WhatsApp, Messenger, WeChat | Messaging, presence, media storage, CDN |
| [Twitter](3_Twitter.md) | Twitter, feed systems | Read-heavy, fan-out, timeline, search |
| [Uber](4_Uber.md) | Uber, Lyft | Geospatial (geohash, quadtree), real-time location, matching |
| [YouTube / Netflix](5_Youtube_Netflix.md) | YouTube, Netflix | Video ingest, transcoding, CDN, streaming |
| [URL shortener](6_URL_Shortener.md) | Bitly, Pastebin | Key generation, KV store, object store, caching |

### Planned cases *(stubs)*

| Case | Product | Status |
|------|---------|--------|
| [Discord messaging](7_Discord_Messaging.md) | Discord | 📁 stub |
| [Instagram feed](8_Instagram_Feed.md) | Instagram | 📁 stub |
| [Stripe payments](9_Stripe_Payments.md) | Stripe | 📁 stub |
| [Rate limiter](10_Rate_Limiter_Design.md) | API GW pattern | 📁 stub |
| [Slack realtime](11_Slack_Realtime.md) | Slack | 📁 stub |

When writing any case, include **Failure modes** → link [Failure-Modes/](../Failure-Modes/README.md).

---

## How to use

1. **Read the case** — Requirements, scale, and high-level design.
2. **Map to concepts** — Links in each file point to `../Databases/`, `../Caching/`, etc.
3. **Deep-dive** — Use the concept notes for details (e.g. sharding, replication, rate limiting).
4. **Further reading** — Each case has a **Further reading** section with links to blog posts, videos, and in-repo solutions that explain in detail how each system works.

Source material for these summaries: cloned repos in the `system-design/` context folder (e.g. TuShArBhArDwA-System-Design, donnemartin-system-design-primer). Full credit to those authors and to companies’ public engineering blogs.
