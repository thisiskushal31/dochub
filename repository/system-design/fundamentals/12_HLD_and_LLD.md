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

A **checklist** for HLD with links to concept notes in this repo. Use with [cases](../Cases/README.md).

---

### 1. Requirements and scope

Write down functional requirements, NFRs (scale, QPS, storage).  
→ [Intro and approach](1_Intro_and_Approach.md)

---

### 2. Three pillars

Scalability, reliability, performance — trade-offs drive most decisions.  
→ [Horizontal scaling](6_Horizontal_Scaling.md) | [Databases](../Databases/README.md) | [Availability](../Availability/README.md) | [Circuit breaker](../Patterns/4_Circuit_Breaker.md) | [Performance](../Performance/README.md)

---

### 3. Layers and components

API/presentation, application/services, data layer, integration.  
→ [API gateway](13_API_Gateway.md) | [Microservices](8_Microservices.md) | [Monolithic vs microservices](16_Monolithic_vs_Microservices.md) | [Databases](../Databases/README.md) | [Caching](../Caching/README.md) | [Messaging](../Messaging/README.md)

---

### 4. Data flow and communication

Sync (REST, gRPC) vs async (queues, pub/sub).  
→ [Message queues](../Messaging/1_Message_Queues.md) | [Event-driven architecture](../Patterns/6_Event_Driven_Architecture.md)

---

### 5. Data model and storage

Entities, storage choices, scaling, caching, indexing.  
→ [SQL vs NoSQL](../Databases/2_SQL_vs_NoSQL_Selection.md) | [Storage systems](../Databases/3_Storage_Systems.md) | [Replication](../Databases/5_Database_Replication.md) | [Sharding](../Databases/4_Database_Sharding.md) | [Caching](../Caching/README.md) | [Indexing](../Storage/1_Indexing.md)

---

### 6. Scalability strategies

Horizontal scaling, load balancers, caching, DB scaling, async, CDN.  
→ [Load balancers](5_Load_Balancers.md) | [Caching](../Caching/README.md) | [Message queues](../Messaging/1_Message_Queues.md) | [CDN](4_CDN.md)

---

### 7. Fault tolerance and failure modes

SPOFs, redundancy, replication, graceful degradation, idempotency, circuit breaker.  
→ [Failover](../Availability/2_Failover.md) | [CAP](../Consistency/2_CAP_Theorem.md) | [Idempotency](../Consistency/4_Idempotency.md) | [Circuit breaker](../Patterns/4_Circuit_Breaker.md) | [Bulkhead and retry](../Patterns/5_Bulkhead_and_Retry.md)

---

### 8. Security (HLD level)

Authn/authz, encryption, network segmentation.  
→ [Security](../Security/README.md)

---

### 9. Observability

Monitoring, alerting, logging, tracing, SLOs/SLIs.  
→ [Observability](../Observability/README.md) | [Distributed tracing](../Observability/9_Distributed_Tracing.md)

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

**Next:** [Concepts](../README.md) | [Cases](../Cases/README.md)
