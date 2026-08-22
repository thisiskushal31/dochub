# Start here — System Design Concepts

[← README](./README.md) · [Write order](./CONTENT_WRITE_ORDER.md) · [Thin topics](./THIN_TOPICS.md) · [Planned cases](./PLANNED_CASES.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Who this repo is for (backend SE, architect path, interview prep with real trade-offs — not buzzwords)
- **Learning path** (checkboxes):
  - [ ] [fundamentals/1-intro-and-approach.md](./fundamentals/1-intro-and-approach.md) + [12-hld-and-lld.md](./fundamentals/12-hld-and-lld.md)
  - [ ] [fundamentals/](./fundamentals/README.md) — DNS, CDN, LB, scaling, APIs
  - [ ] [databases/](./databases/README.md) — selection, sharding, replication, CAP
  - [ ] [caching/](./caching/README.md) + [messaging/](./messaging/README.md)
  - [ ] [consistency/](./consistency/README.md) + [availability/](./availability/README.md)
  - [ ] [patterns/](./patterns/README.md) + [performance/](./performance/README.md)
  - [ ] [security/](./security/README.md) + [security-tradeoffs/](./security-tradeoffs/README.md)
  - [ ] [observability/](./observability/README.md)
  - [ ] [failure-modes/](./failure-modes/README.md) — what breaks in production
  - [ ] [cases/](./cases/README.md) — product designs end-to-end
- When to read **Networks** (wire depth) vs **this repo** (component trade-offs)
- When to read **Databases-Deep-Dive** (engine ops) vs **databases/** here (design selection)
- Sister repos → [Entry-Points/](./Entry-Points/README.md)

## Already written (start reading)

Most component folders have content; **observability/** and several **fundamentals/** files are thin — see [THIN_TOPICS.md](./THIN_TOPICS.md). Cases 1–6 exist; expand with failure sections per [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md) step 6.

## Checklist before marking done

- [ ] Checkbox paths for monthly tracking
- [ ] Links to all Entry-Points once
- [ ] One diagram: requirements → HLD → components → bottlenecks → failure modes
