# Threat modeling at design time

[← security-tradeoffs](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- When to threat-model (new service, new data flow, new trust boundary)
- STRIDE mapped to common components (API GW, DB, queue, cache)
- Trust boundaries in HLD diagram (annotate data classification)
- Abuse cases: not just hackers — fraud, scrapers, insider
- Output: prioritized mitigations → link [security/](../security/README.md) patterns
- Validation: pre-launch review checklist

## Cross-references

- [fundamentals/13-api-gateway.md](../fundamentals/13-api-gateway.md) · [cases/](../cases/README.md) — add threat notes per case

## Checklist before marking done

- [ ] Example threat model for URL shortener (open redirect, enumeration)
- [ ] Pointer to Security-Deep-Dive for formal SDLC/threat modeling program
