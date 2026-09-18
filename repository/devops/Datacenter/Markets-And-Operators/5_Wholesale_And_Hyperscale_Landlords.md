# 5 — Wholesale and hyperscale landlords

[← Previous](./4_Equinix_Class_Interconnection.md) · [README](./README.md) · [Next: Regional colo →](./6_Regional_Colo_And_Telco_DCs.md)

---

## 1. Concepts

**Wholesale / hyperscale landlords** sell large contiguous capacity: powered shells, build-to-suit, campuses for one or few tenants. Examples in kind: Digital Realty wholesale, Equinix xScale-class, Vantage, STACK, QTS, CyrusOne, Compass, AirTrunk (APAC).

You often bring (or design) more of the **IT fit-out** than in retail colo.

### What you buy

| Offering | Meaning |
|----------|---------|
| Powered shell | Building plant; white space fit-out TBD |
| Turnkey wholesale | More complete hall product |
| Campus MW | Multi-building power/fiber campus |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Expecting retail MMR density | Wrong product |
| Underestimating fit-out cost/time | Slip |
| Single utility/fiber assumption | Campus risk |
| Treating landlord like Smart Hands retail | Different ops model |

### How it connects

Build lifecycle: [2](./2_How_Operators_Build_And_Run_Halls.md). Electrical/Mechanical still govern plant. Hyperscaler *as tenant* of wholesale ≠ hyperscaler public cloud ([8](./8_Tenant_Cloud_Vs_Landlord.md)).

### Honesty

Campus internal designs for hyperscale tenants are often confidential—discuss contractual interfaces (power, cool, fiber meet), not guessed floor plans.

### Global variants

AirTrunk-class APAC hyperscale campuses vs US wholesale markets—same kind, different metros ([9](./9_Americas_Hubs.md), [12](./12_APAC_Hubs.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Large reserved capacity | Wholesale RFP with power delivery schedule |
| Retail vs wholesale choice | Interconnect need → retail; MW scale → wholesale |
| Diligence | Utility, water, fiber laterals, delivery dates |
| Ops | Clear demarc: landlord plant vs tenant IT |

**Staff checklist**

- Demarc of BMC/ToR ownership explicit  
- Fit-out budget owned  
- Power delivery milestones  
- Fiber diversity to campus  
- Don’t buy wholesale expecting IBX walk-up XC culture  

**Good:** clear demarc, scheduled power, fiber diversity. **Bad:** retail expectations; secret-free fantasy diagrams; late fit-out surprise.

---

## References

- [Digital Realty](https://www.digitalrealty.com/)  
- [Vantage Data Centers](https://vantage-dc.com/)  
- [AirTrunk](https://www.airtrunk.com/)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- Official wholesale product pages for shortlisted landlords  
