# Value streams and lean flow

[← Back to Methodologies](./README.md)

DevOps inherits heavily from **Lean**: see the work, shrink batch size, remove waste, improve the constraint. A **value stream** is the sequence of steps that turns an idea into value for a customer (often: idea → code → production → feedback).

This is methodology, not a drawing class. AWS and Lean/DevOps guides call the software version a **development value stream map (DVSM)** — use it to find where time actually goes.

Primary references: [AWS Prescriptive Guidance — development value stream mapping](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-devops-value-stream-mapping/introduction.html), Lean ideas via DevOps Handbook / CALMS **L**.

## Why beginners should care

If you only learn CI YAML, you will not see that **three days waiting for review** dominate your lead time. Value stream thinking stops tool-worship and focuses improvement where it matters (Theory of Constraints — [10](./10_Core_Principles_Three_Ways_CALMS.md)).

## Simple value stream (example)

```text
Idea → Backlog → Code → PR review → CI → Staging → Approval → Prod → Observe
         │         │        │         │       │         │        │
       wait      wait     wait      fail    wait      wait     learn
```

For each step, rough measures (Lean DVSM style):

| Measure | Meaning |
|---------|---------|
| **Lead time (LT)** | Elapsed clock time in that step (includes waiting) |
| **Process time (PT)** | Hands-on work time |
| **% complete & accurate (%C/A)** | How often the step’s output is usable without rework |

The gap between LT and PT is usually **wait and rework** — your First Way enemy.

## Waste to look for (Lean → DevOps)

Foundation vocab often uses **DOWNTIME** (eight Lean wastes). Map them to delivery:

| Letter | Waste | Delivery example |
|--------|-------|------------------|
| **D** | Defects | Bugs escaped to prod; failed deploys |
| **O** | Overproduction | Building features nobody uses; unused environments |
| **W** | Waiting | Review queue, env ticket, CAB calendar |
| **N** | Non-utilized talent | Experts stuck on toil; no pairing/guilds |
| **T** | Transportation | Excess handoffs Dev→Ops→Sec tickets |
| **I** | Inventory | Huge unreleased branches; half-done work |
| **M** | Motion | Context switching across too much WIP |
| **E** | Excess processing | Manual steps already covered by CI |

Also common in our stream maps: **rework** loops (failed deploy → hotfix → redeploy) — see [DORA rework rate](./5_DORA_And_Delivery_Metrics.md).

## Working in small batches

DORA lists **working in small batches** as a core capability ([dora.dev/capabilities](https://dora.dev/capabilities/)).

| Large batch | Small batch |
|-------------|-------------|
| Merge once every two weeks | Integrate daily |
| One giant release train | Incremental release / flags |
| Hard to review, hard to revert | Easy review, easy rollback |

Small batches reduce risk **and** shorten feedback (Second Way).

## WIP limits

**Work in progress (WIP) limits** cap how many items are in flight.

- Too much WIP → thrashing, long lead times, context switch tax  
- Visualize on a Kanban-style board (columns = stream steps)  
- If a column is always full, that column is often near the constraint  

You do not need a perfect Kanban tool — a shared board and honesty beat software.

## Lightweight change approval

DORA finds **lightweight approval** (peer review / pair) outperforms heavyweight external CABs for delivery performance, while still enabling control. Regulated industries can keep compliance **evidence from the pipeline** (signed artifacts, required checks) instead of multi-week committees for every change.

Details in delivery: [CiCd/](../CiCd/README.md). Mindset here: approval should **add information**, not only delay.

## How to run a first DVSM (90 minutes)

1. Pick one service and one change type (e.g. “normal feature to prod”).  
2. List steps with owners.  
3. Estimate LT / PT / %C/A (orders of magnitude OK on day one).  
4. Circle the worst wait or rework loop.  
5. Pick **one** improvement for the next two weeks.  
6. Remeasure.  

Do not boil the ocean. Continuous improvement is the Third Way.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Mapping once, never updating | Revisit after each major improvement |
| Optimizing a non-constraint | Fix the longest wait first |
| Blaming people for waits | Fix system design, staffing, and policies |

## Next

- Agile / Lean / ITSM relationships: [12_Agile_Lean_ITSM_And_DevOps.md](./12_Agile_Lean_ITSM_And_DevOps.md)  
- Measure outcomes: [5_DORA_And_Delivery_Metrics.md](./5_DORA_And_Delivery_Metrics.md)

## Further reading

- [AWS — Using development value stream mapping](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-devops-value-stream-mapping/introduction.html)  
- [DORA — Working in small batches](https://dora.dev/capabilities/) (capability catalog)  
