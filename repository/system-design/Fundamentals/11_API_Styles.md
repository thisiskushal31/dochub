# Communication: API Styles (RPC, REST, gRPC, GraphQL)

## RPC (Remote Procedure Call)

- Client invokes a **procedure** on a remote server as if it were local. Parameters are marshalled, sent, executed on server; result returned.
- **Focus:** Exposing **behaviour**. Often used **internally** for performance (tight, hand-crafted calls). Examples: Protobuf, Thrift, Avro.
- **Trade-offs:** Client tightly coupled to service interface; new operation = new API; debugging can be harder; caching (e.g. HTTP caches) less straightforward than with REST.

---

## REST

- **Client/server:** Client acts on **resources**; server exposes representations and actions. **Stateless**, **cacheable**.
- **Focus:** Exposing **data**. Identifies resources by URI; uses verbs (GET, POST, PUT, PATCH, DELETE), headers, status codes. Good for **public HTTP APIs** and horizontal scaling.
- **Qualities:** Same URI for a resource; use standard verbs and status codes; stateless; cacheable where appropriate.

---

## gRPC

- **RPC framework** built for performance. Uses **Protocol Buffers**; supports streaming; multiple languages. Good for **service-to-service** and when you need strong typing and efficiency.
- **Use case:** Internal APIs, mobile backends, real-time or streaming.

---

## GraphQL

- **Query language and runtime:** Client **declares the shape** of data needed; server returns exactly that. Contrast with REST’s fixed endpoints and response shapes.
- **Use case:** Flexible client needs; avoid over-fetching/under-fetching; single endpoint for many views.
- **Trade-off:** More complexity on the server (resolvers, auth, rate limiting per field).

---

## Quick comparison

| Style | Focus | Typical use |
|-------|--------|-------------|
| RPC / gRPC | Behaviour, procedures | Internal, performance-sensitive |
| REST | Resources, data | Public APIs, HTTP caching, simplicity |
| GraphQL | Client-defined data shape | Flexible queries, many client shapes |
