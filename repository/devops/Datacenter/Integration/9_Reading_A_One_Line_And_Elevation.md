# 9 — Reading a one-line and elevation

[← Previous](./8_Failure_Lose_MMR_Cross_Connect.md) · [README](./README.md) · [Next: Units literacy →](./10_Units_Voltage_Frequency_Literacy.md)

## 1. Concepts

Two documents unlock most hall conversations:

| Document | Shows |
|----------|-------|
| **Power one-line** | Utility→UPS→PDU relationships; where A/B split |
| **Rack elevation** | U positions, devices, often power/network ports |

Jobs chapter for foreign sites: [Jobs/11](../Jobs/11_Reading_Foreign_Site_Docs.md).

## 2. Advanced concepts

### How to read a one-line (jobs)

1. Find utility and generators  
2. Find UPS plants  
3. Trace your floor PDU / bus  
4. Mark first common point of A and B  
5. Note EPO / ties  

### How to read an elevation

1. Orientation (front/rear)  
2. U numbering direction  
3. PDU A/B side  
4. ToR placement  
5. Serial/asset fields  

### Failure modes

| Failure | Impact |
|---------|--------|
| As-built ≠ field | Wrong LOTO |
| Elevation drift | Wrong hands U |
| One-line marketing redraw | Fake independence |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First day | Get PDFs; walk field vs paper |
| Ticket | Paste elevation snippet + serial  
| Change | Update elevation same day |
| Diligence | Demand one-line before large kW commit |

**Staff checklist**

- Docs version/date checked  
- Field labels match  
- CMDB sync process exists  
- Never LOTO from memory alone  

**Good:** living as-builts. **Bad:** 2018 PDF faith; tribal U numbers.

## References

- [TIA-606](https://tiaonline.org/) (admin/labeling)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 70E](https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e)  
- [White-Space/7](../White-Space/7_Asset_Tags_Serials_And_Elevations.md)  
