# Value Stream Management (VSM)

[← Back to Methodologies](./README.md)

**Value stream mapping** (what we do in [11](./11_Value_Streams_And_Lean_Flow.md)) is a *technique*: draw the path, measure waits, find the constraint.

**Value Stream Management (VSM)** is the *ongoing practice*: treat that path as something you **manage** — with owners, metrics, tooling visibility, and continuous improvement — not a one-time workshop poster.

PeopleCert / DevOps Foundation lists **Value Stream Management** next to CI/CD, DevSecOps, and Platform Engineering as a key practice. Separate VSM Foundation courses go deep; this file is the DevOps-methodology literacy a beginner needs.

---

## Mapping vs management

| | Value stream **mapping** | Value Stream **Management** |
|--|--------------------------|-----------------------------|
| Cadence | Workshop / periodic remaps | Continuous |
| Output | Picture of LT/PT/%C/A, bottlenecks | Owned improvements + flow metrics over time |
| Who | Often a facilitated exercise | Stream owners + platform + leadership |
| Failure mode | Beautiful diagram, no change | Dashboards nobody acts on |

You need both. Map to see. Manage to improve.

---

## What VSM manages

1. **Flow** — how fast work moves (lead time, WIP, waits) — Lean + [11](./11_Value_Streams_And_Lean_Flow.md)  
2. **Value** — whether what shipped helped users/business — customer feedback ([16](./16_Roles_Teams_And_Platforms.md))  
3. **Stability** — whether flow created mess (DORA fail/rework/recovery — [5](./5_DORA_And_Delivery_Metrics.md))  

Many modern courses pair **DORA + flow metrics + SPACE**-style views. Do not optimize flow by shipping junk faster.

---

## Operating ingredients

| Ingredient | Beginner meaning |
|------------|------------------|
| **Identified streams** | e.g. “payments feature → prod,” not “the whole company” as one blob |
| **Stream ownership** | Someone accountable for end-to-end constraint removal |
| **Visible flow** | Board + deploy/incident data — not tribal status meetings only |
| **Toolchain correlation** | Same change ID from commit → deploy → alert ([17](./17_Toolchain_Stages.md)) |
| **Improvement backlog** | Hypotheses from the map, not random tool shopping |
| **Platform support** | Paved road so each stream is not inventing CI alone ([16](./16_Roles_Teams_And_Platforms.md)) |

Commercial **VSM platforms** (toolchain analytics products) exist. Buy them only after you can name your streams and metrics — otherwise you purchase a dashboard for confusion.

---

## How this fits DevOps

```text
Three Ways / CALMS
    → Map the stream (11)
    → Manage the stream (this file)
    → Improve capabilities (15)
    → Measure outcomes (5)
```

VSM is how enterprises scale “DevOps” beyond one heroic team.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Mapping once per year | Remap after major changes; manage weekly/monthly |
| One org-wide “stream” | Start with 1–2 product streams |
| VSM tool before ownership | Owners + DORA/flow first |
| Ignoring stability | Flow + fail/rework together |

## Next

- Hands-on map: [11_Value_Streams_And_Lean_Flow.md](./11_Value_Streams_And_Lean_Flow.md)  
- Capability menu: [15_DORA_Capabilities_Map.md](./15_DORA_Capabilities_Map.md)

## Further reading

- PeopleCert DevOps Foundation — Key practices: Value Stream Management  
- [AWS — development value stream mapping](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-devops-value-stream-mapping/introduction.html) (mapping technique)  
- [DORA — value stream / capabilities](https://dora.dev/capabilities/)  
