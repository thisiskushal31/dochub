# 7 — Failure: lose CRAH row

[← Previous](./6_Failure_Lose_ToR.md) · [README](./README.md) · [Next: Lose MMR XC →](./8_Failure_Lose_MMR_Cross_Connect.md)

## 1. Concepts

**Worked failure:** One or more CRAHs serving a row fail, or chilled-water capacity to that zone drops.

### Expected good outcome

| Design | Behavior |
|--------|----------|
| N+1 CRAHs | Neighbors pick up; inlets stable |
| Containment intact | Less mixing; more time |
| Sensors alarming | NOC pages early |
| Liquid residual air budget known | GPU row may still need air for leftover heat |

### Classic bad outcome

Already at N; doors propped; no inlet sensors; liquid CDU fail with zero air backup.

## 2. Advanced concepts

### Walk order

1. BMS: which units / CHW temp  
2. Inlet temps by rack  
3. Containment doors  
4. IT throttle / GPU clocks  
5. Start lag units / reduce load / fix plant  

Deep: [Mechanical/11](../Mechanical/11_Mechanical_Failure_Walks.md), [Mechanical/2](../Mechanical/2_CRAH_And_CRAC.md). Combine with power loss of mechanical on generator ([1](./1_Utility_To_DIMM.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Tabletop | CRAH fail + utility blip together |
| Dense row | Pre-compute time-to-throttle |
| Incident | Don’t RMA CPUs in a hot aisle first |
| Colo | Ticket facilities; blanking is yours |

**Staff checklist**

- Serving map rack→CRAH  
- N+1 status known  
- Inlet alarms live  
- Never prop containment during heat events  

**Good:** zone holds on N+1. **Bad:** silent heat; door props; surprise GPU shutdown.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Mechanical/11](../Mechanical/11_Mechanical_Failure_Walks.md)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
