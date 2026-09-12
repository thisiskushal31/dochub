# Companies & products — system design resources

Links to **Medium**, **YouTube**, **company engineering blogs**, and **High Scalability** (and similar) for how real systems are built. Use these alongside the [case studies](README.md) in this folder.

**I do not own these resources.** Full credit to the authors and companies. Links are for educational use.

---

## Company engineering blogs and vlogs

These are the **official engineering blogs / vlogs** of the companies below. Use them to see how these companies build and operate systems (both high-level and low-level perspectives).

| Company | Engineering blog / vlog |
|---------|--------------------------|
| **Notion** | [Notion – Engineering guides](https://www.notion.com/help/guides/category/engineering) |
| **Uber** | [Uber Engineering Blog](https://www.uber.com/en-IN/blog/engineering/) |
| **Swiggy** | [Bytes by Swiggy](https://bytes.swiggy.com/) |
| **Zomato** | [Zomato Blog – Technology](https://www.zomato.com/blog/category/technology/) |

*(The sections below list additional company architectures, design walkthroughs, and third-party articles — unchanged.)*

---

## Company architectures & deep dives (High Scalability, YouTube, blogs)

| Company / product | Resource(s) |
|-------------------|-------------|
| **Amazon** | [Amazon architecture](http://highscalability.com/amazon-architecture) (High Scalability) |
| **Airbnb** | [Airbnb Engineering](http://nerds.airbnb.com/); [Avoiding double payments in distributed payments](https://medium.com/airbnb-engineering/avoiding-double-payments-in-a-distributed-payments-system-2981f6b070bb) (Medium) |
| **Bitly** | [Bitly Engineering Blog](http://word.bitly.com/) |
| **Canva** | [Scaling media uploads: Zero to 50M per day](https://www.canva.dev/blog/engineering/from-zero-to-50-million-uploads-per-day-scaling-media-at-canva/) (Canva Dev) |
| **Discord** | [How Discord stores trillions of messages](https://discord.com/blog/how-discord-stores-trillions-of-messages) (Discord Blog) |
| **Dropbox** | [How we've scaled Dropbox](https://www.youtube.com/watch?v=PE4gwstWhmc) (YouTube); [Dropbox Tech Blog](https://tech.dropbox.com/) |
| **ESPN** | [Operating at 100,000 duh nuh nuhs per second](http://highscalability.com/blog/2013/11/4/espns-architecture-at-scale-operating-at-100000-duh-nuh-nuhs.html) (High Scalability) |
| **Facebook** | [Scaling memcached at Facebook](https://cs.uwaterloo.ca/~brecht/courses/854-Emerging-2014/readings/key-value/fb-memcached-nsdi-2013.pdf); [How Facebook Live streams to 800K viewers](http://highscalability.com/blog/2016/6/27/how-facebook-live-streams-to-800000-simultaneous-viewers.html); [Facebook Engineering](https://www.facebook.com/Engineering) |
| **Flickr** | [Flickr architecture](http://highscalability.com/flickr-architecture) (High Scalability) |
| **Google** | [Google architecture](http://highscalability.com/google-architecture); [Google Research Blog](http://googleresearch.blogspot.com) |
| **Instagram** | [14M users, terabytes of photos](http://highscalability.com/blog/2011/12/6/instagram-architecture-14-million-users-terabytes-of-photos.html); [What powers Instagram](http://instagram-engineering.tumblr.com/post/13649370142/what-powers-instagram-hundreds-of-instances); [Sharding & IDs at Instagram](https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c) |
| **LinkedIn** | [LinkedIn Engineering](http://engineering.linkedin.com/blog) |
| **Mailbox** | [From 0 to 1M users in 6 weeks](http://highscalability.com/blog/2013/6/18/scaling-mailbox-from-0-to-one-million-users-in-6-weeks-and-1.html) (High Scalability) |
| **Microsoft** | [Microsoft Engineering](https://engineering.microsoft.com) |
| **Netflix** | [A 360° view of the Netflix stack](http://highscalability.com/blog/2015/11/9/a-360-degree-view-of-the-entire-netflix-stack.html); [What happens when you press Play?](http://highscalability.com/blog/2017/12/11/netflix-what-happens-when-you-press-play.html); [Building in-video search](https://netflixtechblog.com/building-in-video-search-936766f0017c) (Netflix Tech Blog); [Netflix Tech Blog](http://techblog.netflix.com) |
| **Pinterest** | [From 0 to 10s of billions of page views](http://highscalability.com/blog/2013/4/15/scaling-pinterest-from-0-to-10s-of-billions-of-page-views-a.html); [Pinterest Engineering](https://medium.com/@Pinterest_Engineering) (Medium) |
| **Salesforce** | [How they handle 1.3B transactions/day](http://highscalability.com/blog/2013/9/23/salesforce-architecture-how-they-handle-13-billion-transacti.html) (High Scalability) |
| **Slack** | [Real-time messaging at Slack](https://slack.engineering/real-time-messaging/) (Slack Engineering); [Slack Engineering Blog](https://slack.engineering/) |
| **Spotify** | [Spotify Labs](https://labs.spotify.com/) |
| **Stack Overflow** | [Stack Overflow architecture](http://highscalability.com/blog/2009/8/5/stack-overflow-architecture.html) (High Scalability) |
| **Stripe** | [Stripe’s payments APIs: the first 10 years](https://stripe.com/blog/payment-api-design) (Stripe Blog); [Stripe Engineering](https://stripe.com/blog/engineering) |
| **TripAdvisor** | [40M visitors, 200M page views, 30TB data](http://highscalability.com/blog/2011/6/27/tripadvisor-architecture-40m-visitors-200m-dynamic-page-view.html) (High Scalability) |
| **Tumblr** | [15B page views a month](http://highscalability.com/blog/2012/2/13/tumblr-architecture-15-billion-page-views-a-month-and-harder.html) (High Scalability) |
| **Twitter** | [Making Twitter 10,000% faster](http://highscalability.com/scaling-twitter-making-twitter-10000-percent-faster); [Storing 250M tweets/day with MySQL](http://highscalability.com/blog/2011/12/19/how-twitter-stores-250-million-tweets-a-day-using-mysql.html); [150M users, 300K QPS](http://highscalability.com/blog/2013/7/8/the-architecture-twitter-uses-to-deal-with-150m-active-users.html); [Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability) (InfoQ); [Twitter Engineering](https://blog.twitter.com/engineering/) |
| **Uber** | [How Uber scales their real-time market platform](http://highscalability.com/blog/2015/9/14/how-uber-scales-their-real-time-market-platform.html); [Scaling Uber to 2000 engineers, 1000 services](http://highscalability.com/blog/2016/10/12/lessons-learned-from-scaling-uber-to-2000-engineers-1000-ser.html); [Uber Engineering Blog](http://eng.uber.com/) |
| **WhatsApp** | [The WhatsApp architecture Facebook bought for $19B](http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html) (High Scalability) |
| **YouTube** | [YouTube scalability](https://www.youtube.com/watch?v=w5WVu624fY8) (YouTube); [YouTube architecture](http://highscalability.com/youtube-architecture) (High Scalability) |

---

## Engineering blogs (curated)

Same format as the company architectures table below: company / product and direct link(s) to their engineering blog.

| Company / product | Resource(s) |
|-------------------|-------------|
| **Airbnb** | [Airbnb Engineering](https://medium.com/airbnb-engineering) |
| **Bitly** | [Bitly Engineering Blog](https://word.bitly.com/) |
| **Canva** | [Canva Engineering Blog](https://www.canva.dev/blog/engineering/) |
| **Discord** | [Discord Blog](https://discord.com/blog) |
| **Dropbox** | [Dropbox Tech Blog](https://tech.dropbox.com/) |
| **Facebook** | [Facebook Engineering](https://engineering.fb.com/) |
| **Google** | [Google Research Blog](https://research.google/blog/) |
| **Instagram** | [Instagram Engineering](https://instagram-engineering.com/) |
| **LinkedIn** | [LinkedIn Engineering](https://engineering.linkedin.com/blog) |
| **Microsoft** | [Microsoft Engineering](https://engineering.microsoft.com/) |
| **Netflix** | [Netflix Tech Blog](https://netflixtechblog.com/) |
| **Notion** | [Notion – Engineering guides](https://www.notion.com/help/guides/category/engineering) |
| **Pinterest** | [Pinterest Engineering](https://medium.com/@Pinterest_Engineering) |
| **Slack** | [Slack Engineering](https://slack.engineering/) |
| **Spotify** | [Spotify Labs](https://labs.spotify.com/) |
| **Stripe** | [Stripe Engineering](https://stripe.com/blog/engineering) |
| **Swiggy** | [Bytes by Swiggy](https://bytes.swiggy.com/) |
| **Twitter** | [Twitter Engineering](https://blog.twitter.com/engineering/) |
| **Uber** | [Uber Engineering Blog](https://www.uber.com/en-IN/blog/engineering/) |
| **Yelp** | [Yelp Engineering Blog](https://engineeringblog.yelp.com/) |
| **Zomato** | [Zomato Blog – Technology](https://www.zomato.com/blog/category/technology/) |

---

## General hubs (not company-specific)

- **[High Scalability](http://highscalability.com/)** — Real-world architecture articles (many companies above linked from here).
- **YouTube:** Search “system design [company name]” or “design [product] system design” for walkthroughs (e.g. ByteByteGo, Gaurav Sen, Tech Dummies, System Design Interview channel).

---

## Design-X-like-Y (videos & articles)

Common “design like X” topics with **YouTube** and **Medium** (and similar) links — use for deep dives on how it works:

- **File sync / Drive / Dropbox:** [YouTube – How we've scaled Dropbox](https://www.youtube.com/watch?v=PE4gwstWhmc); [YouTube – Design Dropbox](https://www.youtube.com/watch?v=jLM1nGgsT-I); [YouTube – Design file sharing like Dropbox](https://www.youtube.com/watch?v=U0xTu6E2CT8).
- **Chat / WhatsApp:** [High Scalability – WhatsApp architecture](http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html).
- **Twitter / feed:** [InfoQ – Twitter timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability); [High Scalability – Twitter](http://highscalability.com/scaling-twitter-making-twitter-10000-percent-faster); YouTube: “Design Twitter system design”.
- **Uber / ride-hailing:** [High Scalability – How Uber scales](http://highscalability.com/blog/2015/9/14/how-uber-scales-their-real-time-market-platform.html); [YouTube – Design Uber](https://www.youtube.com/watch?v=R_agd5qZ26Y).
- **YouTube / Netflix / video:** [High Scalability – Netflix stack](http://highscalability.com/blog/2015/11/9/a-360-degree-view-of-the-entire-netflix-stack.html); [Netflix Tech Blog](https://netflixtechblog.com); [YouTube – YouTube scalability](https://www.youtube.com/watch?v=w5WVu624fY8).
- **URL shortener / TinyURL:** [Bitly Engineering Blog](http://word.bitly.com/); YouTube: “Design URL shortener” or “Design TinyURL”.
- **Others (YouTube):** Design [Google Maps](https://www.youtube.com/watch?v=jk3yvVfNvds), [Spotify](https://www.youtube.com/watch?v=_K-eupuDVEc), [TikTok](https://www.youtube.com/watch?v=Z-0g_aJL5Fw), [Instagram](https://www.youtube.com/watch?v=wYk0xPP_P_8), [Airbnb](https://www.youtube.com/watch?v=YyOXt2MEkv4), [Doordash](https://www.youtube.com/watch?v=iRhSAR3ldTw), [Yelp](https://www.youtube.com/watch?v=M4lR_Va97cQ), [Slack](https://www.youtube.com/watch?v=G32ThJakeHk), [Google Docs](https://www.youtube.com/watch?v=2auwirNBvGg), [Amazon / e-commerce](https://www.youtube.com/watch?v=EpASu_1dUdE), [Reddit](https://www.youtube.com/watch?v=KYExYE_9nIY), [Tinder](https://www.youtube.com/watch?v=tndzLznxq40), [Zoom](https://www.youtube.com/watch?v=G32ThJakeHk), [Payment system](https://www.youtube.com/watch?v=olfaBgJrUBI), [Rate limiter](https://www.youtube.com/watch?v=FU4WlwfS3G0), [Distributed cache](https://www.youtube.com/watch?v=iuqZvajTOyA), [Message queue / Kafka](https://www.youtube.com/watch?v=iJLL-KPqBpM).

---

## More products (design walkthroughs — YouTube / Medium / courses)

| Product | Type | Sample links |
|---------|------|--------------|
| **Airbnb** | Lodging, search | [YouTube – Design Airbnb](https://www.youtube.com/watch?v=YyOXt2MEkv4) |
| **Amazon / e-commerce** | E-commerce | [YouTube – Design e-commerce like Amazon](https://www.youtube.com/watch?v=EpASu_1dUdE) |
| **Doordash / food delivery** | Delivery, matching | [YouTube – Design Doordash](https://www.youtube.com/watch?v=iRhSAR3ldTw); [High Scalability – similar](http://highscalability.com/) |
| **Google Docs** | Collaborative editing | [YouTube – Design Google Docs](https://www.youtube.com/watch?v=2auwirNBvGg) |
| **Google Maps** | Maps, geolocation | [YouTube – Design Google Maps](https://www.youtube.com/watch?v=jk3yvVfNvds) |
| **Instagram** | Social, media | [High Scalability – Instagram](http://highscalability.com/blog/2011/12/6/instagram-architecture-14-million-users-terabytes-of-photos.html); [YouTube – Design Instagram](https://www.youtube.com/watch?v=wYk0xPP_P_8) |
| **Pinterest** | Social, feed | [High Scalability – Pinterest](http://highscalability.com/blog/2013/4/15/scaling-pinterest-from-0-to-10s-of-billions-of-page-views-a.html); [YouTube – Design Pinterest](https://www.youtube.com/watch?v=TlkTbkM69ns) |
| **Reddit** | Social, feed | [YouTube – Design Reddit](https://www.youtube.com/watch?v=KYExYE_9nIY) |
| **Shopify** | E-commerce | [YouTube – Design Shopify](https://www.youtube.com/watch?v=lEL4F_0J3l8) |
| **Spotify** | Music, streaming | [YouTube – Design Spotify](https://www.youtube.com/watch?v=_K-eupuDVEc); [Spotify Labs](https://labs.spotify.com/) |
| **TikTok** | Short video | [YouTube – Design TikTok](https://www.youtube.com/watch?v=Z-0g_aJL5Fw) |
| **Tinder** | Dating, matching | [YouTube – Design Tinder](https://www.youtube.com/watch?v=tndzLznxq40) |
| **Yelp** | Location, search | [YouTube – Design Yelp](https://www.youtube.com/watch?v=M4lR_Va97cQ); [Yelp Engineering](http://engineeringblog.yelp.com/) |
| **Zoom** | Video conferencing | [YouTube – Design Zoom](https://www.youtube.com/watch?v=G32ThJakeHk) |
| **Payment / wallet** | Payments | [YouTube – Design payment system](https://www.youtube.com/watch?v=olfaBgJrUBI); [Stripe – payment API design](https://stripe.com/blog/payment-api-design); [Medium – Airbnb double payments](https://medium.com/airbnb-engineering/avoiding-double-payments-in-a-distributed-payments-system-2981f6b070bb) |
| **Rate limiter** | API / reliability | [YouTube – Design rate limiter](https://www.youtube.com/watch?v=FU4WlwfS3G0); [Stripe – rate limiters](https://stripe.com/blog/rate-limiters) |
| **Distributed cache** | Caching | [YouTube – Design distributed cache](https://www.youtube.com/watch?v=iuqZvajTOyA) |
| **Message queue / Kafka** | Messaging | [YouTube – Design message queue like Kafka](https://www.youtube.com/watch?v=iJLL-KPqBpM); [Why is Kafka fast?](https://www.youtube.com/watch?v=UNUz1-msbOM) |

For structured case notes and concept links, see the [case studies](README.md) in this folder.
