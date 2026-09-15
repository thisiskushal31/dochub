# 19 — Worked example: gradual rollout in CI/CD

[← Previous](./18_Scale_Upgrade_Operate_And_Troubleshoot.md) · [README](./README.md) · [Next: Best practices →](./20_Best_Practices_And_When_Not_Unleash.md)

---

## 1. Concepts

Lab goal: ship a binary with a feature **dark**, then open it safely.

```text
1. Create flag `demo.gradual` (default off in prod)
2. Code: if enabled → new path; else → old path
3. CI builds image@digest; CD deploys (flag still off)
4. Smoke / synthetic checks pass
5. Enable strategy at 5% → watch → 25% → 50% → 100%
6. Drill kill switch: disable strategy / flag off without redeploy
```

Unleash owns **behavior**. If you also need pod canaries, add [Argo Rollouts](../Argo_Rollouts/README.md) for **binary** risk ([9](../9_Progressive_Delivery_Controllers.md)).

---

## 2. Advanced concepts

### Pipeline sketch

| Stage | Action |
|-------|--------|
| Build/test | Unit tests cover both flag branches where feasible |
| Deploy | Digest to env; flag off |
| Verify | Smoke against old path |
| Release | Change request or controlled UI: raise % |
| Abort | Flag off; optional Rollouts abort if binary-related |

### Dual path testing

Test matrix grows with flags. At minimum: default-off and on at 100% in CI for critical flags. Do not invent infinite combinations.

### Stickiness

Pass stable `userId` (or session) so % buckets do not flicker mid-session ([07](./07_Activation_Strategies_Stickiness_And_Custom.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First team demo | Steps 1–6 on staging |
| Prod | Same + change requests + metrics ([14](./14_Impression_Analytics_Impact_And_Playground.md)) |
| Incident | Kill switch off; postmortem flag debt |

**Staff checklist**

- Flag name matches code constant  
- Prod token only on prod apps  
- Kill-switch owner on call rotation  
- Cleanup ticket after 100%  

**Good:** dark deploy Monday, ramp Tuesday with eyes on graphs. **Bad:** 0→100% Friday night with no CR.

---

## References

- [Gradual rollout](https://docs.getunleash.io/guides/gradual-rollout)  
- [Quickstart](https://docs.getunleash.io/get-started/quickstart)  
- [Trunk-based development with flags](https://docs.getunleash.io/guides/trunk-based-development)  
