# Twitter (social feed / timeline)

Design a **social media feed** service like Twitter (or Facebook feed, Instagram): users post short messages (tweets), follow others, and see a timeline of tweets from people they follow. Optional: search and trending.

---

## Requirements

### Functional

- Post tweets (text, optional media).
- Follow/unfollow users.
- Timeline: chronological (or ranked) feed of tweets from followed users.
- Search tweets (optional).
- Like, retweet, reply (optional).

### Non-functional

- **Read-heavy** — Many more timeline reads than writes. Optimize for fast feed load.
- High availability and low latency for feed.
- Scale to hundreds of millions of users and billions of tweets.

---

## High-level design

1. **API layer** — Post tweet, follow/unfollow, get timeline, search. [API Gateway](../fundamentals/13-api-gateway.md), [Rate limiting](../performance/2-rate-limiting.md)
2. **Tweet service** — Writes tweets to a **tweet store** (sharded by user_id or tweet_id). On post, may push to a **fan-out** pipeline (write to followers’ timelines or a timeline builder).
3. **Timeline service** — Serves the user’s feed. Two main approaches:
   - **Fan-out on write**: When user A posts, push the tweet into a prebuilt timeline for each follower. Read is a simple lookup (timeline table/key). Fast read, heavier write.
   - **Fan-out on read**: When user opens timeline, fetch list of followed users, then fetch their recent tweets and merge/sort. Lighter write, heavier read.
4. **Follow graph** — Store who follows whom (e.g. graph DB or relational). Used for fan-out and for “follow” queries.
5. **Search** — Index tweets (full-text); use a search engine (e.g. Elasticsearch) or similar. [Indexing](../storage/1-indexing.md)
6. **Media** — Store images/videos in **object storage**, serve via **CDN**. [Storage](../databases/3-storage-systems.md), [CDN](../fundamentals/4-cdn.md)
7. **Cache** — Cache hot timelines and tweet content. [Caching](../caching/1-caching-overview.md)

---

## Key concepts used

| Concept | Where it fits |
|--------|----------------|
| **Read-heavy + caching** | Timeline and tweet reads dominate; cache timelines and recent tweets. [Caching](../caching/1-caching-overview.md) |
| **Fan-out on write vs read** | Trade-off: precompute timelines (write path) vs compute on read. [Database design](../databases/1-database-design-overview.md) |
| **Sharding** | Tweets and timelines sharded by user_id or tweet_id. [Sharding](../databases/4-database-sharding.md) |
| **Denormalization** | Store tweet copy in each follower’s timeline for fast read. [Denormalization](../databases/10-denormalization.md) |
| **Message queue** | Async fan-out: post event → queue → timeline builders. [Message queues](../messaging/1-message-queues.md) |

---

## Example: post tweet and timeline read

**Post:** User A posts. Tweet service saves tweet, publishes “tweet created” event. Timeline workers (or sync path) push the tweet into timeline tables/cache for each of A’s followers.

**Read:** User B opens app. Timeline service reads B’s timeline from cache or DB (prebuilt list of tweet IDs or blobs). If cache miss, fall back to fan-out on read (fetch followed users’ recent tweets, merge, sort). Return page of tweets; optionally fill media URLs from CDN.

---

## Real-world notes

- **Twitter** has moved between fan-out on write and hybrid approaches at scale; timeline ranking (relevance) adds another layer (e.g. scoring, ML).
- **Facebook feed**: Similar fan-out and ranking; EdgeRank and later ML-based ranking.

For more: [Caching](../caching/1-caching-overview.md), [Sharding](../databases/4-database-sharding.md), [Denormalization](../databases/10-denormalization.md), [Message queues](../messaging/1-message-queues.md).

---

## Further reading (how it works in detail)

- **High Scalability:** [Making Twitter 10,000% faster](http://highscalability.com/scaling-twitter-making-twitter-10000-percent-faster), [Storing 250M tweets/day using MySQL](http://highscalability.com/blog/2011/12/19/how-twitter-stores-250-million-tweets-a-day-using-mysql.html), [150M users, 300K QPS](http://highscalability.com/blog/2013/7/8/the-architecture-twitter-uses-to-deal-with-150m-active-users.html).
- **InfoQ (video):** [Twitter timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability).
- **Facebook feed / timeline:** [High Scalability – Facebook timeline](http://highscalability.com/blog/2012/1/23/facebook-timeline-brought-to-you-by-the-power-of-denormaliza.html); [Quora – News Feed best practices](http://www.quora.com/What-are-best-practices-for-building-something-like-a-News-Feed).
- **YouTube:** [Design Twitter](https://www.youtube.com/watch?v=o5n85GRKuzk), [Design Twitter](https://www.youtube.com/watch?v=wYk0xPP_P_8). **Twitter Engineering:** [blog.twitter.com/engineering](https://blog.twitter.com/engineering/).
- **More:** [Companies & products index](0-companies-and-products.md) — Twitter, Facebook, Pinterest, Instagram.
