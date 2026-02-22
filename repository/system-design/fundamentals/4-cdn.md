# Content Delivery Networks (CDN)

## What a CDN is

A **CDN** is a globally distributed network of **proxy servers** that serve content from locations **closer to the user**. DNS resolution often directs the client to the nearest edge node.

The following diagram shows users hitting edge servers instead of the origin, reducing latency and load on the origin.

![CDN: edge servers between users and origin](../assets/fundamentals/cdn.png)

- Typical content: static files (HTML, CSS, JS, images, video). Some CDNs support dynamic content.
- DNS resolution tells the client which CDN node to use.

**Benefits:**

- Users get content from nearby data centers → lower latency.
- Origin servers handle fewer requests → less load and cost.

---

## Push vs pull CDNs

| | Push CDN | Pull CDN |
|---|----------|----------|
| **When content is updated** | You upload when content changes. | First request pulls from origin; then cached. |
| **Who provides content** | You push to CDN; URLs point to CDN. | Content stays on origin; URLs point to CDN. |
| **Storage** | Higher (you pre-populate). | Lower (only what was requested). |
| **Traffic** | Lower (upload only on change). | Can be redundant if TTL expires before content changes. |
| **Use case** | Low traffic or infrequent updates. | High traffic; cache fills from demand. |

**TTL:** In pull CDNs, a time-to-live controls how long content is cached before revalidation.

---

## Examples and real-world use

- **YouTube / Netflix** — Video segments and thumbnails served from CDN edge; origin is object storage or video origin. See [YouTube / Netflix case](../cases/5-youtube-netflix.md).
- **WhatsApp / social apps** — Media (images, videos) stored in object storage and served via CDN. See [WhatsApp case](../cases/2-whatsapp.md).
- **Cloudflare, Akamai, Amazon CloudFront** — Major CDN providers; used for static assets, API acceleration, and DDoS mitigation.
