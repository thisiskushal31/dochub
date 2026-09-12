# Refresh-Ahead

## How it works

Before a cached entry **expires**, the cache (or a background process) **refreshes** it by loading the latest value from the source. The goal is to reduce the chance that a user sees a miss and has to wait for a reload.

## Properties

- **Lower latency on expiry** — If predictions are good, the entry is already fresh when requested after TTL.
- **Depends on prediction** — You need heuristics (e.g. “recently accessed” or “high request rate”) to decide what to refresh. Wrong predictions waste work and can hurt performance.
- **Consistency** — Entries are refreshed from the source, so they can be fresher than a fixed TTL without refresh.

## Use case

When you have a small set of hot keys and can predict which will be accessed soon (e.g. trending content). Avoid when access patterns are hard to predict.
