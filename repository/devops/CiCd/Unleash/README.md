# Unleash

[← Back to CI/CD](../README.md)

Open-source **feature flag** platform. Decouples **deploy** (binary in prod) from **release** (users see the change). Concepts: [3](../3_Deployment_Strategies.md), [9](../9_Progressive_Delivery_Controllers.md), [Methodologies/2](../../Methodologies/2_Practices_And_Workflows.md).

Vendor-neutral app API: [OpenFeature](https://openfeature.dev/) (Unleash can sit behind providers).

Install: [1_Install_And_First_Use.md](./1_Install_And_First_Use.md).

---

## What it is

- Flag definitions + activation strategies (gradual rollout, user IDs, constraints)  
- SDKs for common languages; server evaluates or uses streaming/edge patterns per architecture  
- Admin UI for toggling without redeploying  
- Self-hosted or Unleash-hosted offerings  

Flags are not tests — they reduce blast radius and enable dark launches.

---

## Pipeline relationship

```text
CI deploys digest with flag default off
  → verify smoke
  → open flag to 5% → 50% → 100%
  → or kill switch off on incident
```

Combine with canary controllers when both binary risk and behavior risk matter ([9](../9_Progressive_Delivery_Controllers.md)).

---

## First use

See [1_Install_And_First_Use.md](./1_Install_And_First_Use.md). Docs: [docs.getunleash.io](https://docs.getunleash.io/).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Permanent flags forever | Flag lifecycle / cleanup |
| Flags for incomplete migrations without expand/contract | Still do schema parallel change ([7](../7_DB_Migrations_In_Pipelines.md)) |
| Client-side-only secrets in flags | Flags are not a secret store |

## Further reading

- [Unleash documentation](https://docs.getunleash.io/)  
- [OpenFeature](https://openfeature.dev/)  
