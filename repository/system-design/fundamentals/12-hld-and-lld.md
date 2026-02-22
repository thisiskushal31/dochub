# High-level design (HLD)

## What HLD and LLD are

- **High-Level Design (HLD)** — System **architecture**: main components, their responsibilities, and how they interact. Focus on **what** the system does and **how it is structured** at a coarse level (services, databases, queues). Output: architecture diagrams, component list, data flow.
- **Low-Level Design (LLD)** — **Implementation-level** structure: classes, modules, interfaces, data structures. Focus on **how** each component is built in code. Output: class diagrams, sequence diagrams, API contracts, DB schemas.

**Why both:** HLD aligns everyone on the big picture; LLD guides developers and reduces rework.

| Aspect | HLD | LLD |
|--------|-----|-----|
| **Level** | System / subsystem | Module / class / interface |
| **Audience** | Architects, product, senior eng | Developers |
| **Artifacts** | Block diagrams, deployment view | Class diagrams, sequence diagrams, code structure |

**Flow:** Requirements → **HLD** (architecture, components) → **LLD** (detailed design of each component) → Implementation.

---

## HLD checklist and links

A **checklist** for HLD with links to concept notes in this repo. Use with [cases](../cases/README.md).

---

### 1. Requirements and scope

Write down functional requirements, NFRs (scale, QPS, storage).  
→ [Intro and approach](1-intro-and-approach.md)

---

### 2. Three pillars

Scalability, reliability, performance — trade-offs drive most decisions.  
→ [Horizontal scaling](6-horizontal-scaling.md) | [Databases](../databases/README.md) | [Availability](../availability/README.md) | [Circuit breaker](../patterns/4-circuit-breaker.md) | [Performance](../performance/README.md)

---

### 3. Layers and components

API/presentation, application/services, data layer, integration.  
→ [API gateway](13-api-gateway.md) | [Microservices](8-microservices.md) | [Monolithic vs microservices](16-monolithic-vs-microservices.md) | [Databases](../databases/README.md) | [Caching](../caching/README.md) | [Messaging](../messaging/README.md)

---

### 4. Data flow and communication

Sync (REST, gRPC) vs async (queues, pub/sub).  
→ [Message queues](../messaging/1-message-queues.md) | [Event-driven architecture](../patterns/6-event-driven-architecture.md)

---

### 5. Data model and storage

Entities, storage choices, scaling, caching, indexing.  
→ [SQL vs NoSQL](../databases/2-sql-vs-nosql-selection.md) | [Storage systems](../databases/3-storage-systems.md) | [Replication](../databases/5-database-replication.md) | [Sharding](../databases/4-database-sharding.md) | [Caching](../caching/README.md) | [Indexing](../storage/1-indexing.md)

---

### 6. Scalability strategies

Horizontal scaling, load balancers, caching, DB scaling, async, CDN.  
→ [Load balancers](5-load-balancers.md) | [Caching](../caching/README.md) | [Message queues](../messaging/1-message-queues.md) | [CDN](4-cdn.md)

---

### 7. Fault tolerance and failure modes

SPOFs, redundancy, replication, graceful degradation, idempotency, circuit breaker.  
→ [Failover](../availability/2-failover.md) | [CAP](../consistency/2-cap-theorem.md) | [Idempotency](../consistency/4-idempotency.md) | [Circuit breaker](../patterns/4-circuit-breaker.md) | [Bulkhead and retry](../patterns/5-bulkhead-and-retry.md)

---

### 8. Security (HLD level)

Authn/authz, encryption, network segmentation.  
→ [Security](../security/README.md)

---

### 9. Observability

Monitoring, alerting, logging, tracing, SLOs/SLIs.  
→ [Observability](../observability/README.md) | [Distributed tracing](../observability/9-distributed-tracing.md)

---

### 10. HLD interview flow

1. Clarify requirements and scale.  
2. High-level diagram and data flow.  
3. APIs / event contracts.  
4. Data model and storage.  
5. Bottlenecks and scaling.  
6. Failure modes and handling.  
7. Observability.

Justify with **trade-offs**, not memorized answers.

---

**Next:** [Concepts](../README.md) | [Cases](../cases/README.md)
