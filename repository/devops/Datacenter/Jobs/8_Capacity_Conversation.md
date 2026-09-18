# 8 — Capacity conversation

[← Previous](./7_Safety_LOTO_And_EPO.md) · [README](./README.md) · [Next: Interview pack →](./9_Interview_Pack.md)

---

## 1. Concepts

Capacity talk that works across metros uses a short shared vocabulary:

| Ask / state | Why |
|-------------|-----|
| **kW** (commit vs draw) | Power+cool gate |
| **U** / cabinets | Space |
| **Ports** (copper/fiber/optic SKUs) | Fabric |
| **Cross-connect lead times** | Interconnect critical path |
| **A+B / diversity** | Independence |
| **Liquid readiness** | AI density |
| **Weight / floor** | Structural |

Provider-Use qualify/contract: [Provider-Use/1](../Provider-Use/1_Qualify_A_Site.md)–[2](../Provider-Use/2_Contract_Capacity.md). Units: [Integration/10](../Integration/10_Units_Voltage_Frequency_Literacy.md).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Nameplate-only math | Oversubscribe |
| Ignoring XC lead time | Compute ready, dark uplink |
| kW without cooling type | Thermal wall |
| “We’ll bond later” | Fake HA |

### How it connects

Markets density SKUs; Electrical/Mechanical budgets; White-Space AI-ready.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Sales/eng meeting | One slide: kW/U/ports/XC/liquid |
| GPU PO | All gates green before PO  
| Quarterly | Measured draw vs commit |
| Colo growth | Order XC before cabinets fill |

**Staff checklist**

- Measured + committed kW both known  
- XC lead times on plan  
- Cooling type explicit  
- Never promise ports you don’t have in tray  

**Good:** multi-resource capacity plan. **Bad:** U-only thinking; surprise XC weeks.

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Provider-Use/](../Provider-Use/README.md)  
- [Uptime Institute](https://uptimeinstitute.com/)  
