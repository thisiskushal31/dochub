# Usage Monitoring

## What it is

**Usage monitoring** tracks **how** the system is used: which features are used, by whom, and at what volume. It supports product decisions, capacity planning, billing, and quota enforcement.

## What to measure

- **Feature usage** — Which endpoints, flows, or features are called; frequency and trends. Identifies hotspots and candidates for optimization or retirement.
- **User or tenant usage** — Requests or resource consumption per user, tier, or tenant. Used for quotas, billing, and fair use.
- **Operational metrics** — Transactions per day, signups, orders; normal operation under load for capacity planning.
- **Behavioral signals** — Cart abandonment, error rates by flow, or drop-off points. Can indicate UX or reliability issues.

## How to use it

- **Product and capacity** — Plan scaling and investment; decide what to optimize or deprecate.
- **Billing and quotas** — In multi-tenant or commercial systems, enforce limits and generate bills from usage data.
- **Correlation** — Combine with performance and availability data to see how usage affects latency and errors.

**Use case:** Multi-tenant or commercial apps; capacity and cost planning; product analytics. Keep usage data consistent with privacy and retention policy.
