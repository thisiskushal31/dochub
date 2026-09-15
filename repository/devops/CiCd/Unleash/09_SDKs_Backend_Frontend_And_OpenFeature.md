# 09 — SDKs: backend, frontend, and OpenFeature

[← Previous](./08_Context_Constraints_And_Segments.md) · [README](./README.md) · [Next: Edge →](./10_Edge_Proxy_And_Streaming.md)

---

## 1. Concepts

Unleash ships official **backend** and **frontend** SDKs. You do not need every language encyclopedia memorized — you need the **evaluation model**.

| SDK class | Fetches | Evaluates |
|-----------|---------|-----------|
| **Backend** | Full flag config via **Client API** | Locally in-process |
| **Frontend / mobile** | Evaluated flags via **Frontend API** | Server/Edge evaluates; client consumes results |

Backend languages commonly include Node, Go, Java, Python, .NET, PHP, Ruby, Rust, …  
Frontend includes browser JS, React, Vue, Svelte, Next.js, iOS, Android, Flutter, …

### OpenFeature

[OpenFeature](https://openfeature.dev/) is a vendor-neutral API. Unleash provides providers (Node, Python, …). App code talks OpenFeature; the provider talks Unleash. Switch providers later without rewriting every `if`.

### Client specification

SDKs aim to honor a shared **client specification** so strategy evaluation stays consistent across languages. When writing custom strategies or debugging mismatches, think “spec conformance,” not “my SDK is special.”

---

## 2. Advanced concepts

### Bootstrap, metrics, impressions

SDKs can bootstrap from file/URL, emit metrics back to Unleash, and emit **impression** events for analytics ([14](./14_Impression_Analytics_Impact_And_Playground.md)). Turn impressions on per flag when you need experiment fidelity.

### Version skew

Pin SDK versions in apps. Old SDKs may miss strategy features. Track connected applications ([05](./05_Projects_Environments_And_Applications.md)).

### Serverless

Cold starts + polling: use bootstrap, Edge, or short-lived caching patterns so Lambda/functions do not stampede the API ([guides in official docs](https://docs.getunleash.io/guides)).

### What stays upstream

Per-language install snippets and API digests stay in official SDK pages — this track teaches the model; pick your language’s page when coding.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Monolith API | Backend SDK + Client token |
| SPA | Frontend SDK via Edge Frontend API |
| Polyglot org | OpenFeature everywhere possible |
| Consistency bugs | Compare context + strategy against client spec |

**Staff checklist**

- Backend vs frontend choice explicit per app  
- Tokens match API class ([11](./11_API_Tokens_Keys_And_Service_Accounts.md))  
- OpenFeature adopted where multi-provider risk exists  

**Good:** one evaluation model across services. **Bad:** ad-hoc REST calls to Admin API from request path.

---

## References

- [SDKs overview](https://docs.getunleash.io/sdks)  
- [OpenFeature](https://openfeature.dev/)  
- [Client specification](https://github.com/Unleash/client-specification)  
