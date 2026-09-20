# 5 — Black-box, white-box, and synthetics

[← Previous](./4_Golden_Signals_RED_And_USE.md) · [README](./README.md) · [Next →](./6_Metric_Types_And_Aggregation.md)

## 1. Concepts — outside-in vs inside-out

| Style | Watches | Strength | Blind spot |
|-------|---------|----------|------------|
| **Black-box** | External behavior (HTTP probe, DNS, TLS, login flow) | Sees what users see; catches “everything green inside, dead outside” | Little detail on *why* |
| **White-box** | Internal signals (RED, USE, queue depth, GC) | Rich diagnosis and early saturation | Can be green while the edge is broken |
| **Synthetics** | Scripted journeys from chosen vantage points | Continuous UX path coverage; multi-region | Cost; script drift; not real user diversity |

You need **both** black-box and white-box. Synthetics are black-box journeys with assertions (status, latency, content checks).

```text
Internet / client region
        │  synthetic / probe
        ▼
   Edge / LB / API  ── white-box RED/USE inside
```

**Probes vs synthetics:** a probe might be `GET /healthz`; a synthetic might be “login → search → checkout step.” Health endpoints that bypass real dependencies lie—prefer dependency-aware readiness for *orchestration*, and user-path checks for *monitoring*.

**Disconfirm:** `/health` returning 200 from inside the VPC ≠ users can buy. White-box only ≠ you will catch DNS/TLS/edge failures. Synthetics ≠ load tests (different job).

**Confirm:** Where do you probe from (region, network path)? What user journey is scripted? What white-box signal pairs with a synthetic failure?

## 2. Advanced — placement, CI, and failure modes

**Vantage points matter.** Probe from the same DNS/CDN path users use when possible. Internal-only probes miss certificate and edge routing faults.

**CI / deploy gates:** smoke synthetics in pipeline verify *this build*; production synthetics verify *the live path*. Door for pipeline wiring: CiCd verify chapters—do not duplicate full CI here.

**Flap control:** retries, multi-location consensus (“fail in 2 of 3 regions”), and separate *ticket* vs *page* severity.

**Failure modes**

| Failure | Symptom | Fix direction |
|---------|---------|---------------|
| Health lies | Orchestrator happy; users fail | Probe real dependency path |
| Synthetic drift | Script outdated after UX change | Own scripts with the feature team |
| Over-paging synthetics | Nightly third-party blip | Symptom SLO + dependency classification ([13](./13_Dependency_And_Peer_Monitoring.md)) |

## 3. Applications

**Staff checklist**

- At least one external black-box check for each public critical path  
- White-box RED on the same path for dig-down  
- Synthetic owner + last-reviewed date  

**Exercise:** Break DNS or cert in a staging clone (safely). Did black-box catch it before white-box?

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [9 Dashboards / pages](./9_Dashboards_Alerts_And_Pages.md) · [13 Dependencies](./13_Dependency_And_Peer_Monitoring.md)
