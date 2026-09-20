# 29 — Multi-env and multi-tenant patterns

[← Previous](./28_Shape_Scorecard_Drills_And_Maturity.md) · [README](./README.md) · [Next →](./30_Telemetry_Cost_And_FinOps.md)

## 1. Concepts — isolation without chaos

### Environments

| Env | Telemetry posture | Paging |
|-----|-------------------|--------|
| Prod | Full SLIs; careful sampling | Real pages |
| Staging | Same taxonomy; often lower retention | Tickets / daytime |
| Dev | Sparse; cheap | Rarely pages |

Keep **label taxonomy identical** (`env=…`) so dashboards promote cleanly; change *urgency*, not *names*.

### Tenancy

| Pattern | Meaning |
|---------|---------|
| Soft isolation | Shared backends; `tenant` label / index |
| Hard isolation | Separate projects/backends per tenant/tier |
| Platform vs product | Platform series vs customer series separated |

```text
Same contracts ──► different retention & alert routes per env/tenant
```

**Disconfirm:** Copy-paste alert rules that page from staging at 3am ≠ mature. One shared index with unbounded `tenant_id` cardinality ≠ isolation ([7](./7_Cardinality_And_Label_Contracts.md)).

**Confirm:** How is `env` enforced on scrape? Who can see tenant A’s logs?

## 2. Advanced — noisy neighbors and compliance

**Noisy neighbor:** one tenant’s debug logs starve query—enforce per-tenant quotas ([17](./17_Log_Planes_Retention_And_Volume.md)).

**Compliance:** some tenants need residency; route exporters by policy.

**Prometheus federation / multi-cluster:** name `cluster` labels carefully; avoid series storms when federating.

**Failure mode:** Prod and staging remote-write into one unrestricted bucket → accidental prod pages from test traffic.

## 3. Applications

**Staff checklist**

- Env label mandatory in contracts  
- Alert routes differ by env  
- Tenant quota story for shared planes  

**Exercise:** Trigger a staging SLO burn. Who gets notified?

## References

- [Prometheus federation](https://prometheus.io/docs/prometheus/latest/federation/)  
- [7 Cardinality](./7_Cardinality_And_Label_Contracts.md) · [30 FinOps](./30_Telemetry_Cost_And_FinOps.md)
