# 0 — How to read this monitoring & observability track

[README](./README.md) · [Next →](./1_Paired_Practice_Monitoring_And_Observability.md)

## 1. Concepts — who this is for

You do **not** need an SRE title. You need a **paired practice**: monitoring **detects** known bad states; observability **explains** new questions from telemetry. They usually ship together on one estate.

**Staircase (concept jobs 0–34, then tool folders):** finish the numbered chapters before Prometheus / Datadog tourism. Tool folders teach *products*; these chapters teach *jobs*.

### How to read any chapter

1. **Concepts** — what the job is, why it exists, mental model.  
2. **Disconfirm** — myths (especially “tools replaced thinking”).  
3. **Advanced** — quirks, failure modes, staff depth.  
4. **Confirm** — if you cannot answer, re-read Concepts.  
5. **Applications** + staff checklist — practice.  
6. **References** — official docs hubs only (API depth after you know the job).

### The one rule

```text
Jobs 1–15   → detect craft (program, signals, SLOs, pages, workload types)
Jobs 16–23  → explain craft (logs, traces, dig path, instrumentation)
Jobs 24–30  → assemble & govern (APM shape, stacks, cost, maturity)
Jobs 31–32  → doors (cloud sinks/audit; on-call culture)
Jobs 33–34  → K8s patterns + end-to-end topologies
Tool folders → later (what / when / why not for named products)
```

### Doors (depth lives elsewhere)

| Door | Home |
|------|------|
| Cloud managed sinks + audit | [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md) |
| On-call practice | [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md) |
| Packets / NetOps signals | Networks Observability |
| Synthetic / e2e in CI | CiCd verify |
| System-design “why monitor” | System-Design-Concepts Observability |

**What this folder is *not*:** a cert dump, a logo tour, or a paste of every PromQL function. **What it *is*:** the place you finish choosing *what to measure, when to page, and how to dig* before you pick vendors.

**Disconfirm:** Tool-first learning ≠ this track. “Observability replaced monitoring” ≠ true here. Reading only SaaS UI tours ≠ a monitoring program.

**Confirm:** Detect vs explain in one sentence each. Where do tools sit in the staircase? Name the two doors you must not re-teach here.

## 2. Advanced — quality bar and readiness

| Rule | Meaning |
|------|---------|
| **Define on first use** | Acronym + one plain sentence |
| **Job before logo** | Concept first; product names in tables |
| **Disconfirm / Confirm** | Myths explicit; self-checks short |
| **Failure mode** | What breaks and what you see |
| **Door, don’t duplicate** | Cloud audit, on-call culture, packet capture keep their homes |
| **No decorative rules** | No horizontal rule separators in handbook prose |
| **Official References** | Vendor/project docs hubs only |

Pass the [README](./README.md) gate before tool folders. If you cannot draft an SLI or name a dig path (metric → trace → log), stay in 1–23.

## 3. Applications

**Suggested first stretch:** **0 → 1 → 3 → 4 → 8 → 9 → 16 → 18 → 21 → 25 → 28 → 34**, then remaining numbers, then tool folders.

**Staff checklist for newcomers**

- Can state monitoring vs observability without naming a vendor  
- Knows where Cloud/30 and Methodologies/3 live relative to this track  
- Will not open Prometheus until the README gate is honest  

**Good:** job vocabulary → stack shape → product. **Bad:** console tourism without SLOs or dig path.

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [README](./README.md)
