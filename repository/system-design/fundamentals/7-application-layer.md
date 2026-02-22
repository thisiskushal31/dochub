# Application Layer

## Separation of web and application layer

Splitting the **web layer** (presentation, routing) from the **application/platform layer** (business logic, APIs) lets you:

- **Scale independently** — Add API servers without adding more web servers (or the reverse).
- **Single responsibility** — Small, autonomous services that collaborate. Teams can own and ship services separately.

**Use case:** Adding a new API = adding application servers; web layer stays focused on entry and routing.

---

## Trade-offs

- Loosely coupled app layer requires different architecture, ops, and processes than a monolith.
- Microservices add deployment and operational complexity (see [Microservices](8-microservices.md)).
