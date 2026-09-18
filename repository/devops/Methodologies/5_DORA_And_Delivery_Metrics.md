# DORA metrics and delivery performance

[← Back to Methodologies](./README.md)

DORA metrics answer: **are we getting better at delivering software?** They are for improvement conversations, not for ranking teams into shame.

**Source of truth:** [DORA’s software delivery performance metrics](https://dora.dev/guides/dora-metrics/). Prefer the **current** model on dora.dev (throughput + instability, including recovery and rework). Older blogs that only list “four keys” are incomplete — always check the live guide.

Related capabilities (what to *do*, not only measure): [dora.dev/capabilities](https://dora.dev/capabilities/).

## The five metrics (current DORA model)

DORA groups metrics into **throughput** (how fast you deliver) and **instability** (how often delivery hurts).

### Throughput

| Metric | Question | Typical measurement |
|--------|----------|---------------------|
| **Deployment frequency** | How often do we deploy to production? | Deployments per day/week, or time between deploys |
| **Change lead time** | How long from commit (version control) to production? | Median time commit → prod |

### Instability / recovery

| Metric | Question | Typical measurement |
|--------|----------|---------------------|
| **Change fail rate** | What share of deployments need immediate intervention (rollback / hotfix)? | Failed changes ÷ total deployments |
| **Failed deployment recovery time** | How long to restore service after a *failed deployment*? | Detect/decide → mitigate for deploy-caused failures |
| **Deployment rework rate** | What share of deployments are **unplanned** because of a production incident? | Unplanned (incident-driven) deploys ÷ total deploys |

### Naming note (fact check)

Older materials say **MTTR** (mean time to restore) as the fourth key. Current DORA language emphasizes **failed deployment recovery time** for the delivery-performance set, and separates broader incident restore time in operations practice. This handbook’s on-call chapter still cares about incident restore ([3](./3_Team_Patterns_SRE_Incident.md)); when you quote “DORA metrics,” use the five above from dora.dev.

**Rework rate** is easy to miss: it captures the “hidden tax” of firefighting deploys that never show up if you only celebrate frequency.

## Lead time vs cycle time (do not mix them up)

| Term | Typical meaning in delivery talk |
|------|----------------------------------|
| **Change lead time** (DORA) | Commit (in version control) → running in production |
| **Cycle time** (often Lean/Kanban) | Time from when work **starts** on an item until it is **done** (definition of done varies) |
| **Lead time** (broader Lean) | Sometimes idea/request → done — longer than DORA change lead time |

When someone says “our lead time is two weeks,” ask: **from which clock start?** For DORA comparisons, use **commit → production** as on [dora.dev](https://dora.dev/guides/dora-metrics/).

## SPACE (complement, not a replacement)

**SPACE** (satisfaction, performance, activity, communication/collaboration, efficiency/flow) is a broader developer-productivity lens. Use it when DORA looks fine but the team is miserable — or when activity metrics (commit counts) are being abused as performance scores. SPACE does **not** replace DORA for delivery throughput/stability.

Do not cargo-cult a single “elite” screenshot from an old report. Direction and context matter. Use [DORA Quick Check](https://dora.dev/) / current benchmarks when you want numbers — they change as the industry changes.

| Signal | Healthier | Unhealthy |
|--------|-----------|-----------|
| Frequency | Small, frequent deploys | Quarterly death-marches |
| Lead time | Hours–days | Weeks waiting on review / CAB / env |
| Change fail % | Low and owned | High + surprise weekends |
| Recovery | Minutes–hours with runbooks | Days of heroics |
| Rework | Rare unplanned deploys | Constant hotfix train |

A team that deploys hourly but breaks prod half the time is not “winning.” A regulated team that deploys weekly with low fail rate, fast recovery, and low rework can still be excellent *for their constraints*.

## How tools feed the metrics

```text
Deployment frequency     ← CiCd deploy success events
Change lead time         ← commit/merge timestamps + deploy time
Change fail rate         ← rollbacks / deploy-caused SEVs / hotfixes
Failed deploy recovery   ← time from failed deploy → service healthy
Deployment rework rate   ← unplanned deploys tagged to incidents ÷ all deploys
```

- Pipelines: [CiCd/](../CiCd/README.md)  
- Verify / rollback: [CiCd/5](../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md)  
- Paging timestamps: [3](./3_Team_Patterns_SRE_Incident.md)  

You do not need a perfect data warehouse on day one. Start with honest tags on deploys and incidents; automate later.

## Using metrics for improvement (not blame)

**Good uses**

- Sprint retro: “Lead time grew — review, flaky tests, or env wait?” ([11 value streams](./11_Value_Streams_And_Lean_Flow.md))  
- High fail or rework % → slow feature work, fix tests/pipeline/design  
- Platform investment when every team shares the same wait bottleneck  

**Bad uses**

- Leaderboards across unrelated products  
- Punishing honest paging (hides failure, fakes recovery)  
- Optimizing only frequency (shipping junk faster)  

## Anti-patterns

| Anti-pattern | Reality check |
|--------------|---------------|
| Gaming frequency with empty deploys | Count meaningful production deployments |
| Hiding failures as “config tweaks” | Tag rollbacks and SEVs honestly |
| “Never deploy on Friday” as only control | Prefer verify + rollback; freezes are a crutch |
| Ignoring rework while celebrating throughput | Firefighting is still instability |

## Complements (brief)

- **SPACE** — see section above  
- **DevEx** surveys — if lead time is fine but engineers are miserable, you still have a problem  
- **DORA capabilities** — [15_DORA_Capabilities_Map](./15_DORA_Capabilities_Map.md) — metrics without capabilities become vanity  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Metrics without ownership | Platform + team leads review monthly |
| Comparing mobile release train to SaaS API team | Compare a team to its past self |
| Quoting only obsolete “four keys” posts | Use the live metric set on dora.dev |

## Next

- Notify humans when deploys happen: [6_ChatOps](./6_ChatOps_And_Notifications.md)  
- Make recovery fast: [7_Docs_And_Runbooks](./7_Docs_And_Runbooks.md)  
- Principles behind the metrics: [10_Core_Principles](./10_Core_Principles_Three_Ways_CALMS.md)

## Further reading

- [DORA metrics guide](https://dora.dev/guides/dora-metrics/) — authoritative definitions  
- [DORA capabilities catalog](https://dora.dev/capabilities/)  
- *Accelerate* (Forsgren, Humble, Kim) — research background (read alongside current dora.dev; metrics naming has evolved)  
