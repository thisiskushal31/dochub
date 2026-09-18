# 3 — Facility, power, cooling, and rooms

[← Previous](./2_Ownership_Colo_And_Contracts.md) · [README](./README.md) · [Next: Rack and BMC →](./4_Rack_BMC_And_Provisioning.md)

---

## 1. Concepts

A **datacenter** is a building (or a hall inside one) whose product is **reliable power, cooling, connectivity, and physical security** for computers. Public cloud is many of these buildings behind an API. This chapter is the **hall**. The cage contract is [2](./2_Ownership_Colo_And_Contracts.md). What you put in the rack is [4](./4_Rack_BMC_And_Provisioning.md).

You do not improvise in these rooms. Badges, escorts, two-person rules, and change tickets are the culture.

### Rooms you will walk

| Place | Job |
|-------|-----|
| **White space** | Racks of IT gear; hot aisle / cold aisle |
| **Electrical** | Utility intake, transformers, switchgear, UPS, batteries, generators |
| **Mechanical** | Chillers, CRAH/CRAC, containment, plumbing |
| **Meet-me room (MMR)** | Carriers, cross-connects, internet exchanges |
| **NOC / security** | Cameras, badges, tickets, change windows |
| **Goods / loading** | How a 40 kg server enters without a pallet through the mantrap |
| **Storage / tape** (if present) | Backup landing that is not “a disk in the same rack” |
| **Staging / burn-in** | New iron before it is production — if you skip this, production *is* burn-in |

### Power in one paragraph

Utility → transformer → **UPS** (covers the gap until generators start) → **PDU** in the row → **rack PDU** (often A and B) → PSU. Generators need **fuel and tests**. Batteries need age. IT load is measured in **kW per rack**, not in “how many servers.”

### Cooling in one paragraph

IT turns watts into heat. Cold aisle supplies; hot aisle returns. Blanking panels matter. **Containment** stops hot air mixing. If you pack 20 kW into a rack designed for 5 kW, the breaker may hold and the dimms will still throttle.

---

## 2. Advanced concepts

### Redundancy language (use it correctly)

| Term | Meaning |
|------|---------|
| **N** | Just enough capacity; any failure of that path is an outage |
| **N+1** | One spare component (extra UPS module, extra CRAC) |
| **2N** | Two independent paths, each able to carry the load |
| **2N+1** | 2N plus another spare — rare and expensive |

Two rack PDU colors on **one** UPS is not 2N. Two rooms on one chiller plant is not two AZs. Ask **where the paths split**.

**PUE** (Power Usage Effectiveness) is facility overhead vs IT watts. Useful for the operator; not a substitute for “is my rack dual-fed.”

### Ratings you will see on RFPs

**Uptime Institute Tiers** (I–IV) describe *site* topology: basic → redundant components → concurrently maintainable → fault tolerant. **TIA-942** uses Rated-1…4 language. A marketing “Tier IV” sticker is not a substitute for walking the single points. Concurrently maintainable means they can service a path **without** shutting your IT load — only if **your** A+B landing is correct.

### Thermal and weight

Raised floor vs slab: both exist. Weight limits are real (batteries, water-cooled doors, GPU trays). Liquid cooling (rear-door heat exchangers, direct-to-chip) shows up with dense GPUs — the facility must accept the fluid loop; you cannot “just rack” a 40 kW chassis.

### Change culture in the hall

Facility change windows are not GitHub Actions. A generator test can look like a power event to sloppy PSUs. A CRAC maintenance can raise inlet temp. **Subscribe to the operator’s notices.** App deploys during a fuel test are how you get a heisenbug.

Physical security: mantraps, badges, cameras, visitor escorts, loading-dock chain of custody. An unescorted contractor with a laptop in white space is an incident, not a vibe.

### Water, fire, leak

Pre-action dry pipe vs wet. VESDA. Leak detection under raised floor. Know where the **emergency power off (EPO)** is and who is allowed to use it. Do not rack a tape library under a water pipe because the U was free.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First week in a DC job | Walk white space with a sponsor; find cages, PDUs, ToRs, EPO, and the ticket tool |
| GPU row | Confirm kW, cooling type, and floor loading **before** PO |
| Survive a feed loss | A+B to dual PSUs; test by failing one PDU on purpose in a window |
| Colo selection | Ask Tier/Rated, MMR carriers, PUE as flavor; insist on path drawings |

**Staff checklist**

- kW budget per rack vs nameplate and **expected** draw  
- A+B path independence (UPS, board, generator)  
- Inlet temperature policy; blanking panels installed  
- Weight and cooling type for dense SKUs  
- Facility maintenance calendar on the ops calendar  
- EPO / fire / leak: who acts, who is told  
- No production in the loading dock or under a drip tray  

**Good:** path drawing, dual feed tested, containment intact, notices subscribed. **Bad:** 15 kW in a 5 kW footprint, both PSUs in one PDU, generator test as a surprise outage.

**Disconfirm:** Two PDU colors are **not** proof of two UPS plants. A Tier sticker is **not** a substitute for walking where paths join.

**Confirm:** Can you name the room types in a hall? What bridges the gap until generators start? Why do blanking panels matter?

If any term above is foggy, read [0 — how to read](./0_How_To_Read_And_Quality_Bar.md) and [0b — equipment in plain language](./0b_Equipment_In_Plain_Language.md) before going deeper.

---

## Go deeper

- [Facility/](./Facility/README.md) · [Electrical/](./Electrical/README.md) · [Mechanical/](./Mechanical/README.md)  
- Reports & steering: [Integration/11](./Integration/11_Aggregate_Telemetry_Reports_And_Steering.md) · [Jobs/13](./Jobs/13_Reading_Dashboards_Reports_And_Steering.md)  

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [ASHRAE TC 9.9 thermal guidelines](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
- [Open Compute Project](https://www.opencompute.org/)  
