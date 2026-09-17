# 09 — SDKs: backend, frontend, and OpenFeature

[← Previous](./08_Context_Constraints_And_Segments.md) · [README](./README.md) · [Next: Edge →](./10_Edge_Proxy_And_Streaming.md)

---

## 1. Concepts

Unleash ships official **backend** and **frontend** SDKs. HTTP endpoints those SDKs call are in [23](./23_Admin_Client_Frontend_And_Edge_APIs.md). This chapter is the **method surface** apps call — you do not need to open each language’s GitHub README first.

| SDK class | Fetches | Evaluates | Token |
|-----------|---------|-----------|-------|
| **Backend** | Full flag config via **Client API** | Locally in-process | Backend (secret) |
| **Frontend / mobile** | Evaluated flags via **Frontend API** | Server or Edge evaluates; client consumes results | Frontend (not a secret) |

Once initialized, SDKs cache in memory and keep working if Unleash is unreachable. Without bootstrap or a prior cache, unknown flags evaluate **disabled** (or the fallback you pass).

### Official SDKs

**Backend:** Go, Java, Node.js, PHP, Python, Ruby, Rust, .NET.

**Frontend:** Android, Flutter, iOS, JavaScript (browser), Next.js, React, React Native, Svelte, Vue.

Community SDKs exist for Angular, Clojure, C++, Elixir, Haskell, Kotlin, NestJS, Solid, and others — treat them as unofficial unless you own the risk.

### The shared contract

Every official SDK implements the same evaluation idea. Names snake_case or PascalCase by language:

| Job | Typical names |
|-----|----------------|
| Boolean check | `isEnabled` / `is_enabled` / `IsEnabled` / `is_enabled?` |
| Variant | `getVariant` / `get_variant` / `GetVariant` |
| Context | passed into the check, or a context provider / `updateContext` |
| Lifecycle | initialize / start / ready; destroy / stop / shutdown / Close / Dispose |
| Metrics | sent on an interval; impact metrics as counters/gauges/histograms |
| Offline | bootstrap from file / URL / inline JSON; local backup |

OpenFeature is a **vendor-neutral wrapper** over that contract. Unleash still evaluates; your code calls `getBooleanValue` instead of `isEnabled`. Impression data and impact metrics are Unleash-specific — OpenFeature does not model them. Prefer native SDKs when you need those.

### Client specification

Official backends honor a shared **client specification** so a 10% rollout hits the same users across languages. Spec files **01–22**: simple examples, user-with-id, gradual rollout (user / session / random), remote address, multiple strategies, variants, constraints, flexible rollout, constraint edge cases, custom stickiness, operators, semver operators, global constraints, strategy variants, dependent features, UTF-8 flag names, delta API hydration/events, regex operators, CIDR operators.

---

## 2. Advanced concepts

### Identification headers (all SDKs)

Every Client/Frontend request should send:

| Header | Meaning |
|--------|---------|
| `unleash-sdk` | Language + semver, e.g. `unleash-client-node@6.4.4` |
| `unleash-connection-id` | UUID for this SDK **instance** (not for short-lived PHP/Next request models) |
| `unleash-appname` | Optional app name |

`unleash-connection-id` replaces legacy `unleash-instanceid` (clients could overwrite that).

### Default poll / metrics intervals

**Backend** refresh **15s**, metrics **60s** (Rust metrics default **15s**). **Frontend:** Android 60s/60s; Flutter 30s/30s; iOS 15s/30s; JS family (browser, Next, React, RN, Svelte, Vue) 30s refresh / 60s metrics.

### Backend capability matrix (official)

All backends: built-in strategies (gradual + custom stickiness, IP/hostname, CIDR), basic constraints (`IN` / `NOT_IN`), static + custom context, custom strategies (basic), usage metrics.

| Capability | Java | Node | Go | Python | Ruby | .NET | PHP | Rust |
|------------|------|------|----|--------|------|------|-----|------|
| Async init | yes | yes | yes | yes | yes | yes | n/a | yes |
| Block until synced | yes | yes | yes | later | later | yes | yes | yes |
| Context provider | yes | no | no | no | no | yes | yes | no |
| Global fallback fn | yes | yes | yes | yes | later | later | later | later |
| Query `namePrefix`/`tags` | yes | yes | no | no | no | no | yes | no |
| Query `project_name` | yes | yes | yes | yes | yes | yes | no | no |
| Static custom headers | yes | yes | yes | yes | yes | yes | yes | later |
| Header function | yes | yes | later | yes | yes (4.3) | yes | yes | later |
| Advanced constraint ops | 5.1 | 3.12 | 3.3 | 5.1 | 4.2 | 2.1 | 1.3.1 | 0.16 |
| `isEnabled` + context + fallback | yes | yes | yes | yes | yes | yes | yes | yes |
| Fallback **function** | yes | yes | yes | yes | yes | later | later | later |
| Strategy variants | 8.3 | 4.1 | 3.8 | 5.8 | 4.5 | 3.3 | 1.13 | 0.16 |
| File local backup | yes | yes | yes | yes | yes | yes | yes | **no** |
| Impression data | yes | yes | yes | yes | later | yes | yes | later |
| Impact metrics | yes | yes | yes | yes | yes | yes | **no** | later |
| Bootstrap | yes | yes | yes | yes | yes | yes | yes | later |

Numbers are **minimum SDK versions**. “later” = documented as not implemented / under consideration.

Frontend bootstrap: Android, JavaScript, React, React Native, Svelte, Vue (not listed for Flutter/iOS/Next in the overview table).

### Canonical backend methods — Node.js (`unleash-client`)

Use this as the encyclopedia; other backends rename the same jobs.

| Method / export | What it does |
|-----------------|--------------|
| `initialize(config)` | Configure **global** singleton; subsequent calls do not create extra instances |
| `new Unleash(config)` | Construct an instance (still: one per process, not per request) |
| `startUnleash(config)` | `await` until synchronized with the API |
| `isEnabled(name, context?, fallback?)` | Boolean evaluation |
| `getVariant(name, context?, fallback?)` | Variant (disabled variant if off / none) |
| `forceGetVariant(name, context?, fallback?)` | Variant even when the flag is off (Node extra; do not assume every language has this) |
| `destroy()` | Stop polling; drop global instance |
| `on` / `once` | Events: `ready`, `synchronized`, `registered`, `sent`, `count`, `warn`, `error`, `unchanged`, `changed`, `impression` |
| `getFeatureToggleDefinition(name)` | Raw definition for one flag |
| `getFeatureToggleDefinitions()` | All cached definitions |
| `impactMetrics.defineCounter` / `incrementCounter` | Counter |
| `impactMetrics.defineGauge` / `updateGauge` | Gauge |
| `impactMetrics.defineHistogram` / `observeHistogram` | Histogram (p50/p95/p99 server-side) |
| `Strategy` subclass | Custom activation strategy (`isEnabled(parameters, context)`) |
| `InMemStorageProvider` | In-memory backup instead of disk |
| Custom `storageProvider` / `repository` | Redis, offline, browser-hosted cache |

**Node config knobs:** `url`, `appName`, `environment` (context field — **not** the Unleash environment), `instanceId`, `refreshInterval` (15s), `metricsInterval` (60s), `strategies`, `disableMetrics`, `customHeaders`, `customHeadersFunction`, `timeout` (10s), `repository`, `httpOptions`, `namePrefix`, `tags`, `bootstrap` (`data` / `url` / `filePath`), `storageProvider`. TypeScript module augmentation can lock `flagNames`.

### Other official backends (method names)

| SDK | Lifecycle | Checks | Notes |
|-----|-----------|--------|-------|
| **Java** `unleash-client-java` | `new DefaultUnleash(config)`; `synchronousFetchOnInitialisation` | `isEnabled`, `getVariant` | `UnleashContextProvider`; `UnleashSubscriber`; `FakeUnleash` (`enableAll`, `enable`, `setVariant`); `ToggleBootstrapProvider`; custom fetcher/metrics sender; `MoreOperations` removed in v10 |
| **Go** `unleash-go-sdk` | `Initialize(...)` or `NewClient`; `WaitForReady`; `Close` | `IsEnabled` + `FeatureOptions`; `GetVariant` + `VariantOptions` | `WithListener`; custom `Storage`; impact metrics on the client |
| **Python** `UnleashClient` | `initialize_client()`; `destroy()` | `is_enabled`, `get_variant` | `fallback_function`; `event_callback` (`READY`, `FETCHED`, impression); `FileCache.bootstrap_from_{dict,file,url}`; `custom_strategies`; WSGI needs threads |
| **.NET** `Unleash.Client` | `new DefaultUnleash(settings)`; `UnleashClientFactory.CreateClientAsync(..., synchronousInitialization)`; `Dispose()` | `IsEnabled`, `GetVariant` | Context provider; Fake client for tests |
| **PHP** | builder → `Unleash`; optional Frontend API **mode** | `isEnabled`, `getVariant` | Context provider; no impact metrics; Symfony bundle exists as community |
| **Ruby** | `Unleash::Client.new`; `shutdown` / `shutdown!` | `is_enabled?` / `enabled?`; `is_disabled?` / `disabled?`; `if_enabled` / `if_disabled`; `get_variant` | Rails helpers; impression later in matrix |
| **Rust** `unleash-api-client` | `ClientBuilder` → `register()`; `poll_for_updates` on a thread | `is_enabled`; `is_enabled_str` if string features enabled | No file backup; metrics interval 15s; Edge-oriented HTTP clients (surf/reqwest) |

### Canonical frontend methods — JavaScript (`unleash-proxy-client`)

Package name is historical (Proxy). Point `url` at `/api/frontend` or Edge.

| Method | What it does |
|--------|----------------|
| `new UnleashClient(options)` | Construct; does **not** fetch until `start` |
| `start()` | Begin poll + metrics |
| `stop()` | Pause; restartable |
| `isEnabled(name)` | Boolean from last evaluated snapshot |
| `getVariant(name)` | Variant (disabled variant if off/none) |
| `updateContext(ctx)` | Replace mutable context; refetch |
| `setContextField(k, v)` | Patch one field |
| `removeContextField(k)` | Drop one field |
| `updateToggles()` | Manual refresh when `refreshInterval` is `0` |
| `sendMetrics()` | Manual metrics when `metricsInterval` is `0` |
| `on` / `off` | `error`, `initialized`, `ready`, `update`, `recovered`, `sent`, `warn` |
| `impactMetrics.defineCounter` / `incrementCounter` | Counters |
| `impactMetrics.defineHistogram` / `observeHistogram` | Histograms |
| `initUnleashToolbar(client)` | Dev toolbar wrap (`@unleash/toolbar`) — same API |

**JS options:** `url`, `clientKey`, `appName`, `context`, `refreshInterval` (30s; `0` = manual), `disableRefresh`, `metricsInterval` (60s), `metricsIntervalInitial` (2s), `disableMetrics`, `storageProvider` (LocalStorage in browser / InMemory otherwise), `fetch`, `createAbortController`, `bootstrap` / `bootstrapOverride`, `headerName` (`Authorization`), `customHeaders`, `impressionDataAll`, `environment` (context field), `usePOSTrequests` (**Edge supports POST; built-in Frontend API historically does not**), `experimental.togglesStorageTTL`.

Register event listeners **before** `start()` or you miss `initialized`/`ready`.

### Framework frontend SDKs (hooks over the JS client)

| SDK | Provider / init | Flag | Variant | Context | Ready | Raw client |
|-----|-----------------|------|---------|---------|-------|------------|
| **React** `@unleash/proxy-client-react` | `FlagProvider`; `UnleashToolbarProvider` in dev | `useFlag` | `useVariant` | `useUnleashContext` | `useFlagsStatus` (`flagsReady`, `flagsError`) | `useUnleashClient`; `startClient={false}` + `client.start()` |
| **Vue** `@unleash/proxy-client-vue` | same pattern | `useFlag` | `useVariant` | `useUnleashContext` | `useFlagsStatus` | toolbar wrap |
| **Svelte** `@unleash/proxy-client-svelte` | same | `useFlag` | `useVariant` | `useUnleashContext` | `useFlagsStatus` | `startClient` defer |
| **React Native** `@unleash/unleash-react-native-sdk` | wraps JS + AsyncStorage | `useFlag` | `useVariant` | `useUnleashContext` | `useFlagsStatus` | `useUnleashClient` |
| **Next.js** `@unleash/nextjs` | `FlagProvider` (client); `flags` / `flagsClient` (server) | `useFlag`; `flags.isEnabled` | `useVariant`; `flags.getVariant` | — | `useFlagsStatus` | `sendMetrics` after SSR checks; CLI `get-definitions`, `generate-types` (`useFlags`, typed `flagsClient`) |

### Mobile frontend (non-JS)

| SDK | Lifecycle | Checks | Context |
|-----|-----------|--------|---------|
| **Android** `io.getunleash:unleash-android` | `DefaultUnleash`; `start()`; `isReady()`; delayed init default | `isEnabled`, `getVariant` | `setContext` / builder |
| **iOS** | init + poller | `isEnabled(name:)`, `getVariant(name:)` | context on client; impression event |
| **Flutter** | `start` / events like JS | `isEnabled`, `getVariant` | `updateContext`, `setContextField`, **`setContextFields`**; `updateToggles` / `sendMetrics` |

### OpenFeature providers (official)

Node.js, PHP, Python, Ruby, Rust, Swift. Pattern: construct `UnleashProvider` / `UnleashFlagProvider` with the same options as the native SDK → `OpenFeature.setProviderAndWait` → evaluate.

| OpenFeature call | Unleash meaning |
|------------------|-----------------|
| `getBooleanValue` / `getBooleanDetails` | Flag **enabled** state |
| `getStringValue` / number / object | Variant **payload** (`string`/`csv`, `number`, `json`) |
| `targetingKey` | Maps to Unleash `userId` (wins over `userId` on context) |
| Direct fields | `userId`, `sessionId`, `remoteAddress`, `environment`, `appName`, `currentTime` |
| Other fields | Unleash context `properties` (nested objects discarded) |
| `OpenFeature.setContext` | Global context |
| Provider shutdown | Destroys Unleash client; flushes metrics (Node) |

If the flag is missing, disabled, or payload type mismatches → **default value**. Details methods report reason, variant name, `featureEnabled`, `payloadType`. Unleash-only: impression + impact metrics — not on this API.

### Serverless / short-lived

Cold start + poll: bootstrap, Edge, or (PHP/Next) request-scoped Frontend mode. Do not spawn a backend SDK **per request**. Node: singleton. Java/.NET: DI singleton. Go: `Initialize` once, `Close` on shutdown.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Monolith API | Backend SDK + Client token; `isEnabled`/`getVariant` on the request with context |
| SPA | JS/React/Vue/Svelte client → Edge Frontend API; `updateContext` on login |
| Mobile | Android/iOS/Flutter/RN; bootstrap for first launch offline |
| Polyglot org | Same flag names; trust client spec; OpenFeature only if you must swap vendors |
| Consistency bugs | Dump context + compare against spec cases 01–22 |
| CI type-safety | Next `generate-types`; Node `UnleashTypes.flagNames` |
| Experiment analytics | Native SDK impressions ([14](./14_Impression_Analytics_Impact_And_Playground.md)), not OpenFeature |

**Staff checklist**

- Backend vs frontend choice explicit per app  
- Tokens match API class ([11](./11_API_Tokens_Keys_And_Service_Accounts.md))  
- Ready/synchronized before the first **user-visible** check (or accept fallback)  
- One SDK instance per process  
- OpenFeature only where multi-provider risk exists — know what you lose  

**Good:** one evaluation model across services. **Bad:** ad-hoc REST to Admin API from the request path; `new Unleash()` inside a handler.

---

## References

- [SDKs overview](https://docs.getunleash.io/sdks)  
- [Node.js SDK](https://docs.getunleash.io/sdks/node)  
- [Java SDK](https://docs.getunleash.io/sdks/java)  
- [Python SDK](https://docs.getunleash.io/sdks/python)  
- [Go SDK](https://docs.getunleash.io/sdks/go)  
- [.NET SDK](https://docs.getunleash.io/sdks/dotnet)  
- [PHP SDK](https://docs.getunleash.io/sdks/php)  
- [Ruby SDK](https://docs.getunleash.io/sdks/ruby)  
- [Rust SDK](https://docs.getunleash.io/sdks/rust)  
- [JavaScript browser SDK](https://docs.getunleash.io/sdks/javascript-browser)  
- [React SDK](https://docs.getunleash.io/sdks/react)  
- [OpenFeature](https://openfeature.dev/)  
- [Node OpenFeature provider](https://docs.getunleash.io/sdks/openfeature/node)  
- [Client specification](https://github.com/Unleash/client-specification)  
