# 03 — Multi-tenancy and limits

[← Previous](./02_Architecture_And_Write_Path.md) · [README](./README.md) · [Next →](./04_PromQL_Grafana_And_HA_Dedup.md)

## 1. Concepts

Mimir is **multi-tenant**. Tenant ID comes from **`X-Scope-OrgID`** on each request. AuthN/Z is typically an **external reverse proxy** that injects the header—don’t expose naked write/query without a gate.

| Pattern | Notes |
|---------|-------|
| Proxy injects OrgID | Production default |
| Remote_write `headers` | Trusted envs only |
| `cortex-tenant` style routers | Map series labels → tenant |
| Multitenancy disabled | Internal `anonymous` / configured no-auth tenant |

**Limits** per tenant (series, ingestion rate, query) protect the platform from one noisy team.

Federation across tenants possible when enabled (`tenant-1|tenant-2` style OrgID)—use deliberately.

**Disconfirm:** One shared tenant for all prod+dev ≠ isolation. No series limits ≠ “friendly” multi-team.

**Confirm:** What is your tenant scheme (env? team? product)? Who sets OrgID?

## 2. Advanced

Align tenants with Loki/Tempo if you multi-tenant the whole LGTM plane. Cardinality still bites inside a tenant ([Prometheus/02](../Prometheus/02_Data_Model_Types_And_Labels.md)).

## 3. Applications

**Staff checklist:** proxy/auth story; default limits; break-glass admin path documented.

## References

- [Authentication and authorization](https://grafana.com/docs/mimir/latest/manage/secure/authentication-and-authorization/)  
- [04 Query / HA](./04_PromQL_Grafana_And_HA_Dedup.md)
