# 01 — What is Loki and when

[← README](./README.md) · [Next →](./02_Streams_Labels_And_Cardinality.md)

## 1. Concepts

**Loki** stores logs as **streams** (unique label sets). The **index** is a table of contents for those streams; **chunks** hold compressed log lines for a stream over a time range. Object storage (S3/GCS/Azure/…) is the durable home in modern single-store / index-shipper mode (TSDB index recommended).

```text
Log line + labels → stream → chunk(s) in object storage
Query: pick streams by labels → scan/filter lines (LogQL)
```

Loki indexes **timestamp + labels**, not the full log body (schema-at-query via LogQL parsers).

| | |
|--|--|
| **What for** | Cost-effective logs next to PromQL culture |
| **When** | LGTM; shared labels with Mimir/Tempo |
| **Why not** | Need primary security/full-text analytics store |

**Disconfirm:** “We turned on Loki” ≠ PII-safe or forever archive without policy.

**Confirm:** What are your stream labels? What do you filter only at query time?

## 2. Advanced

Multi-tenancy via `X-Scope-OrgID` (similar family to Mimir). Queriers hit ingesters (recent) + store (historical).

## 3. Applications

**Staff checklist:** object-store backend chosen; Alloy/Promtail owned; Elastic vs Loki decision written.

## References

- [Loki architecture](https://grafana.com/docs/loki/latest/get-started/architecture/)  
- [02 Labels](./02_Streams_Labels_And_Cardinality.md)
