# 02 — Architecture: server, SDK, Edge, and APIs

[← Previous](./01_What_Is_Unleash_And_Feature_Flags.md) · [README](./README.md) · [Next: Install →](./03_Install_Hosting_And_Configuration.md)

---

## 1. Concepts

Unleash is built so **flag evaluation is fast and private**: SDKs (or Edge) evaluate against **cached configuration**. Your request path does not wait on the Unleash database for every `isEnabled`.

### Main pieces

| Piece | Role |
|-------|------|
| **Unleash API server** | System of record for flags, strategies, projects, tokens, admin APIs |
| **Admin UI** | Humans toggle, target, approve, inspect |
| **Backend SDKs** | Fetch full flag config via **Client API**; evaluate locally |
| **Frontend / mobile SDKs** | Fetch **evaluated** flags via **Frontend API** (context-aware) |
| **Unleash Edge** | Edge/read-replica style layer near apps; serves Client/Frontend APIs with low latency |
| **Unleash Proxy** (legacy) | Older frontend-facing helper — prefer Edge for new work ([10](./10_Edge_Proxy_And_Streaming.md)) |

### API families

| API | Who calls it |
|-----|----------------|
| **Admin API** | UI, automation, Terraform, change-request tooling |
| **Client API** | Backend SDKs / Edge (full definitions) |
| **Frontend API** | Browser/mobile SDKs / Edge (evaluated results) |
| **Edge API** | Operating and querying Edge itself |

Backend evaluation is in-process (nanoseconds once cached). Config updates propagate on a poll/stream interval — expect a short delay, not instant global consistency by default.

**Frontend API** is built into the Unleash server (and Edge): the client sends context, the server/Edge returns **already evaluated** flags. Talking Frontend API **directly** to the central server sends context (possible PII) upstream — Edge keeps that evaluation off the origin ([10](./10_Edge_Proxy_And_Streaming.md), [17](./17_Security_Privacy_And_Compliance.md)). SDKs also **register** and post **metrics** (Client/Frontend); custom metrics feed impact metrics ([14](./14_Impression_Analytics_Impact_And_Playground.md)).

Every documented HTTP operation (Client 5, Frontend 4, Edge 14, Admin 376 as of OpenAPI v8.0.3) is listed in [23](./23_Admin_Client_Frontend_And_Edge_APIs.md). SDK method names live in [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md).

---

## 2. Advanced concepts

### Privacy shape

Context used for evaluation (userId, sessionId, custom fields) stays in **your** runtime. The server distributes **definitions**; it is not a per-request decision oracle that must see PII on every check. Design custom context fields carefully anyway ([08](./08_Context_Constraints_And_Segments.md), [17](./17_Security_Privacy_And_Compliance.md)).

### Resilience

SDKs keep an in-memory snapshot. If Unleash or Edge is unreachable, apps continue with the last known config (and configurable bootstrapping / defaults). Plan failure modes: stale “on” can be as dangerous as stale “off.”

### Topology patterns

```text
Admin UI / Terraform  →  Unleash server
                              ↓
                    Edge (optional, recommended at scale)
                         ↙        ↘
              Backend SDKs     Frontend SDKs
```

Small labs often point SDKs straight at the server. Production estates usually put **Edge** in front for fan-out, caching, and frontend exposure without opening Admin/Client broadly.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Single service lab | SDK → server Client API |
| Many services + browsers | Edge; backend Client + frontend Frontend |
| Strict network zones | Edge in app VPC; server private |
| Multi-runtime apps | OpenFeature + Unleash provider ([09](./09_SDKs_Backend_Frontend_And_OpenFeature.md)) |

**Staff checklist**

- Document which API each workload uses  
- Know poll/stream lag for “I toggled but still off” tickets  
- Prefer Edge over Proxy for new frontend paths  

**Good:** evaluate locally, sync definitions. **Bad:** HTTP round-trip to Unleash on every business request.

---

## References

- [Architecture overview](https://docs.getunleash.io/get-started/unleash-overview)  
- [Admin API overview](https://docs.getunleash.io/api/admin-api-overview)  
- [Client API overview](https://docs.getunleash.io/api/client-api-overview)  
- [Frontend API overview](https://docs.getunleash.io/api/frontend-api-overview)  
- [Edge API overview](https://docs.getunleash.io/api/edge-api-overview)  
- [Frontend API concept](https://docs.getunleash.io/concepts/front-end-api)  
- [SDKs overview](https://docs.getunleash.io/sdks)  
