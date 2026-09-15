# 10 — Edge, Proxy, and streaming

[← Previous](./09_SDKs_Backend_Frontend_And_OpenFeature.md) · [README](./README.md) · [Next: Tokens →](./11_API_Tokens_Keys_And_Service_Accounts.md)

---

## 1. Concepts

**Unleash Edge** sits between applications and the Unleash server as a fast, cacheable front for **Client** and **Frontend** APIs — similar in spirit to a CDN for flag configuration.

Why Edge exists:

- Fan-out: thousands of SDKs should not all hammer the server  
- Latency: evaluate/serve near the workload  
- Safety: expose Frontend API without exposing Admin; frontend evaluation can stay on Edge so context need not go upstream  

**Unleash Proxy** is the older frontend helper. New designs should prefer **Edge**; migrate Proxy → Edge when you still run Proxy.

**Edition literacy:** **Enterprise Edge** is where Unleash is investing (hosted or self-hosted, streaming, Admin topology views). **Unleash Edge OSS** is on long-term support with a documented end-of-life — plan migration if you still run the OSS Edge build ([OSS comparison](https://docs.getunleash.io/support/oss-comparison)).

---

## 2. Advanced concepts

### Modes and streaming

Edge can poll or use **streaming** configurations (especially Enterprise Edge) so updates propagate faster than classic poll intervals. Know your mode when debugging “toggle lag.”

### Enterprise Edge extras

Enterprise Edge adds operational depth (observability, hardened deploy guides, version upgrade notes). Treat Edge as its own deployable: images, replicas, health checks, dashboards ([18](./18_Scale_Upgrade_Operate_And_Troubleshoot.md)).

### Network placement

```text
Browser  →  Edge (public or DMZ Frontend API)
Backend  →  Edge (private Client API)  →  Unleash server (private)
```

Do not put Admin API on the public internet.

### Migrate from Proxy

Swap SDK endpoints from Proxy URL to Edge Frontend/Client endpoints; validate tokens; retire Proxy. Run both briefly only with a clear cutover checklist.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| SPA at scale | Edge Frontend API |
| Multi-region | Edge near each region |
| Simple lab | SDK → server directly (no Edge yet) |

**Staff checklist**

- Edge health and version monitored  
- Frontend never pointed at Admin API  
- Proxy retirement planned if still present  

**Good:** Edge as the only public flag endpoint. **Bad:** Client API open to the world “for convenience.”

---

## References

- [Enterprise Edge overview](https://docs.getunleash.io/enterprise-edge/overview)  
- [Edge quickstart](https://docs.getunleash.io/guides/unleash-edge-quickstart)  
- [Migrate from Proxy](https://docs.getunleash.io/enterprise-edge/migrate-from-proxy)  
- [Unleash Edge repo](https://github.com/Unleash/unleash-edge)  
