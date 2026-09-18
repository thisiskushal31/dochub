# 6 — Cable management and pathways

[← Previous](./5_Structured_Cabling_Fiber_MPO_MTP.md) · [README](./README.md) · [Next: Asset tags →](./7_Asset_Tags_Serials_And_Elevations.md)

## 1. Concepts

**Cable management** is how copper, fiber, and power share space without crushing, EMI chaos, or unblockable airflow. **Pathways** are the trays, baskets, ladders, and underfloor routes that carry them.

### Tools at the rack

| Tool | Job |
|------|-----|
| Vertical managers | Dress patch cords by U |
| Horizontal managers | Strain relief at panels |
| Velcro (hook-and-loop) | Bundle without crushing (prefer over tight zip ties on fiber) |
| Bend radius control | Especially fiber and twinax |
| Separators | Power vs data where required |

### Pathway hierarchy

| Path | Typical use |
|------|-------------|
| In-cabinet | Patches, PDU whips |
| Aisle tray / ladder | Row aggregation |
| Underfloor | Legacy / mixed |
| Overhead | Modern dense halls |
| Conduit | Protected/fire-stopped routes |

## 2. Advanced concepts

### Power / data separation

| Practice | Why |
|----------|-----|
| Separate trays or clear distance | Reduce noise/coupling |
| Cross at angles when they must meet | Minimize parallel run EMI |
| Don’t share tight bundles with AC whips | Heat + noise + serviceability |

### Failure modes

| Failure | Impact |
|---------|--------|
| Overfilled tray | Crush, heat, impossible trace |
| Zip-tie tourniquets on fiber | Latent optical failure |
| Blocking rear exhaust | Thermal |
| Pathway without firestop at walls | Code/fire integrity fail |
| “Temporary” floor spaghetti | Trip + airflow ([10](./10_White_Space_Safety_And_Housekeeping.md)) |

### How it connects

Busway vs cable power ([Electrical/9](../Electrical/9_Busway_Vs_Cable_Distribution.md)) competes for overhead space with fiber trays—coordinate early on dense rows ([9](./9_High_Density_And_AI_Ready_White_Space.md)).

### Global variants

Fill ratios and firestop products follow local code. The jobs—protect bend radius, separate energy, leave service loops labeled—are universal.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New row | Size trays for growth, not day-1 only |
| MAC work | Re-dress managers; remove dead cords |
| Audit | Photo before/after for remote hands |
| Incident trace | Pathway labels beat heroic guessing |

**Staff checklist**

- Velcro over crushing ties for fiber  
- Fill leaves room to work  
- Power/data separation respected  
- Dead cables removed, not abandoned  
- Firestops restored after wall penetrations  

**Good:** dressed, labeled, serviceable pathways. **Bad:** bird’s nests; abandoned live-looking cords; fiber zip-tied to death.

## References

- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [TIA](https://tiaonline.org/) (pathways/spaces related standards)  
- [BICSI](https://www.bicsi.org/) (cabling best-practice training/standards body)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
