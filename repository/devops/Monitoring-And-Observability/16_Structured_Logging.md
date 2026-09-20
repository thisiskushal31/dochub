# 16 — Structured logging

[← Previous](./15_Capacity_And_Saturation.md) · [README](./README.md) · [Next →](./17_Log_Planes_Retention_And_Volume.md)

## 1. Concepts — fields you can query, not poems

**Structured logging** emits events as key/value fields (usually JSON) with consistent names: `service`, `env`, `level`, `msg`, `trace_id`, `span_id`, `error_kind`, etc. Free-text-only lines are hard to join to metrics and traces.

| Practice | Why |
|----------|-----|
| Stable field names | Queries and dashboards survive refactors |
| Levels with policy | `info` volume vs `error` signal |
| Correlation IDs | Join to traces ([19](./19_Context_Propagation_And_Async.md)) |
| Bounded enums | `error_kind` not raw stack as indexed field |
| PII discipline | No secrets, tokens, raw cards, unchecked PII |

```text
{ "level":"error", "service":"checkout", "trace_id":"…", "error_kind":"payment_timeout", "msg":"…" }
```

**Disconfirm:** `print` debugging in prod ≠ observability. Logging full request bodies “just in case” ≠ structured practice. Unique field names per PR ≠ a contract.

**Confirm:** Can you jump from a trace ID to logs for one failed request? Which fields are mandatory on your services?

## 2. Advanced — volume, sampling, and security

**Volume:** prefer metrics for high-frequency counts; logs for narrative and rare detail ([17](./17_Log_Planes_Retention_And_Volume.md)).

**Dynamic level / sampling:** elevate on error paths; sample healthy `debug` in prod.

**Exceptions:** one log event per failure with `error_kind`; avoid duplicate logs per stack frame.

**Security:** redact at write time; treat logs as sensitive data stores (access control, retention).

**Failure mode:** Indexing high-cardinality fields (user email) → same explosion class as metrics ([7](./7_Cardinality_And_Label_Contracts.md)).

## 3. Applications

**Staff checklist**

- JSON (or equivalent) logs with mandatory correlation fields on critical services  
- PII / secret scanning in CI for log statements where feasible  
- Documented field dictionary (short) owned by platform + services  

**Exercise:** From a recent error page, open logs by `trace_id` only—no grep on host.

## References

- [OpenTelemetry — Logs](https://opentelemetry.io/docs/concepts/signals/logs/)  
- [17 Log planes](./17_Log_Planes_Retention_And_Volume.md) · [21 Dig path](./21_Correlation_And_Dig_Methodology.md)
