# API Gateway

## What it is

An **API gateway** is a single entry point for client requests to your backend services. It handles routing, auth, rate limiting, and often aggregation so that clients talk to one place instead of many services.

The following diagram illustrates clients calling the gateway, which then routes to the appropriate microservices.

![API Gateway as single entry point to backend services](../assets/fundamentals/api-gateway.png)

## Why we need it

- **Single entry** — Clients call one host/URL; the gateway routes to the right service.
- **Decoupling** — Backend services can change or move without changing client contracts.
- **Cross-cutting** — Centralize authentication, authorization, rate limiting, SSL termination, request/response transformation, and logging.
- **Composition** — Aggregate multiple backend calls into one response for the client.

## How it works

1. Client sends request to the gateway (e.g. `api.example.com/orders`).
2. Gateway authenticates/authorizes, applies rate limits, and routes by path/host to a backend service (e.g. Order Service).
3. Backend responds; gateway may transform or aggregate and then responds to the client.

## Key features

- **Routing** — Path- or host-based routing to microservices.
- **Authentication / authorization** — Validate tokens (e.g. JWT), API keys; enforce permissions.
- **Rate limiting** — Throttle by client, API key, or endpoint.
- **Load balancing** — Distribute to multiple instances of a service.
- **Caching** — Cache responses for read-heavy endpoints.
- **SSL termination** — Decrypt at the gateway; backends can use plain HTTP internally.

## Trade-offs

- **Advantages:** Simplified client, centralized security and policies, easier versioning and evolution of backends.
- **Disadvantages:** Single point of failure (mitigate with multiple gateways); can become a bottleneck; operational complexity.

**When to use:** Microservices or multi-service backends where you want one public API surface and centralized auth, rate limiting, and routing.
