# Uber (ride-hailing)

Design a **ride-hailing** service like Uber or Lyft: customers see nearby drivers and ETA, request a ride, track driver; drivers accept/decline and complete trips. Real-time location and matching.

## Requirements

**Functional:** Customers see nearby drivers, ETA, price; request ride; track driver; pay. Drivers see request; accept/decline; start/end trip. Optional: ratings, surge.

**Non-functional:** Real-time location and matching; high availability; millions of DAU and rides per day.

## High-level design

1. **API gateway** — Auth, rate limit. [API Gateway](../fundamentals/13-api-gateway.md)
2. **Location service** — Ingest driver (and rider) location; store for **nearby** queries (geohash or quadtree).
3. **Matching / dispatch** — On request, find nearby available drivers (geospatial query), rank (ETA, rating), send request; on accept, assign trip.
4. **Trip service** — Create/update trip state (requested → accepted → in progress → completed); persist for history/billing.
5. **Pricing** — Fare (distance, time, surge). **Payment** — Process at trip end.
6. **Cache** — Driver locations, hot queries. [Caching](../caching/1-caching-overview.md)

## Key concepts

- **Geospatial** — “Nearby drivers” = query by (lat, lon). **Geohash** or **quadtree** for fast range query.
- **Real-time** — Driver location updates (WebSocket/HTTP); push to rider. [Proxies and WebSockets](../fundamentals/14-proxies-and-websockets.md)
- **Message queue** — Decouple location ingest and analytics. [Message queues](../messaging/1-message-queues.md)
- **DB + cache** — Trips, users; cache locations. [Sharding](../databases/4-database-sharding.md), [Caching](../caching/1-caching-overview.md)

## Example: request ride

1. Customer sends pickup + destination. Matching gets customer location, queries **geospatial index** for available drivers in radius/cell.
2. Rank drivers; send request to top N or broadcast. First accept wins; trip created.
3. Driver and customer get live updates (WebSocket). On “trip ended,” price and payment.

## Real-world

**Uber/Lyft:** Geospatial indexing (quadtree, geohash), high write throughput for locations. See [Caching](../caching/1-caching-overview.md), [Message queues](../messaging/1-message-queues.md), [Proxies and WebSockets](../fundamentals/14-proxies-and-websockets.md).

---

## Further reading (how it works in detail)

- **High Scalability:** [How Uber scales their real-time market platform](http://highscalability.com/blog/2015/9/14/how-uber-scales-their-real-time-market-platform.html), [Scaling Uber to 2000 engineers, 1000 services](http://highscalability.com/blog/2016/10/12/lessons-learned-from-scaling-uber-to-2000-engineers-1000-ser.html).
- **Company blog:** [Uber Engineering Blog](http://eng.uber.com/) — real-time, geolocation, matching, and scaling posts.
- **YouTube:** [Design Uber](https://www.youtube.com/watch?v=R_agd5qZ26Y), [Design Uber](https://www.youtube.com/watch?v=umWABit-wbk). **Similar (location/food):** [Design Yelp](https://www.youtube.com/watch?v=M4lR_Va97cQ), [Design Doordash](https://www.youtube.com/watch?v=iRhSAR3ldTw).
- **More:** [Companies & products index](0-companies-and-products.md) — Uber and other companies.
