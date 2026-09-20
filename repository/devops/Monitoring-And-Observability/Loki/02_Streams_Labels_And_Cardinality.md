# 02 — Streams, labels, and cardinality

[← Previous](./01_What_Is_Loki_And_When.md) · [README](./README.md) · [Next →](./03_LogQL_Essentials.md)

## 1. Concepts

A **stream** = unique combination of label key/values. High cardinality → huge index + tiny chunks → Loki performs poorly (official guidance).

### Official label practices (compressed)

| Do | Don’t |
|----|-------|
| Few labels (aim **≤ ~10–15**; Loki defaults constrain) | Label every JSON field |
| Long-lived, bounded values (`app`, `namespace`, `env`) | `user_id`, `trace_id`, `order_id`, raw path with IDs as **index** labels |
| Labels users actually query | Labels “just in case” |
| Prefer filter expressions for rare searches | Dynamic labels from every log line |

**Default instinct:** don’t add a label until you know you need it—use `|=` / `|~` filters (bruteforce within selected streams is designed to be fast enough).

### Structured metadata

For frequently queried **high-cardinality** fields (e.g. trace ID, customer ID), prefer **structured metadata** (not index labels) when available—keeps index healthy ([cardinality docs](https://grafana.com/docs/loki/latest/get-started/labels/cardinality/)).

**Staff confuse this constantly:** Prometheus label lessons apply, but Loki is *even* less forgiving of ephemeral IDs as stream labels.

**Disconfirm:** `level` as a dynamic label on every line ≠ free—often better as a filter. Trace ID as label ≠ good idea.

**Confirm:** List your labels. Which would explode if cardinality grew 100×?

## 2. Advanced

Chunk target size / max chunk age: high-volume streams may justify a careful dynamic split—default guidance still favors fewer labels. Align `service`/`env` with Mimir and Tempo.

## 3. Applications

**Staff checklist:** written allowlist; Alloy relabel drops poison labels; review stream count after launches.

## References

- [Understand labels](https://grafana.com/docs/loki/latest/get-started/labels/)  
- [Label best practices](https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/)  
- [03 LogQL](./03_LogQL_Essentials.md)
