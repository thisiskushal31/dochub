# Quality and testing

[← README](../README.md)

**Job:** How you know software is correct enough to ship. This was a missing *room-inside-Tooling* — CI gates live in DevOps; design of tests lives here.

*(Content TBD — stub created September 2026 — survey door, not a full course)*

## Planned coverage (survey → deepen when you practice)

- Test pyramid: unit, integration, contract, e2e, load, chaos
- What belongs in the app repo vs the pipeline (→ DevOps `CiCd/`)
- Contract tests for APIs (ties to OpenAPI / gRPC)
- Frontend e2e vs backend integration
- When *not* to automate

## Named folders here

| Folder | Job |
|--------|-----|
| [Jest](./Jest/README.md) | JS unit tests |
| [Playwright](./Playwright/README.md) | Browser e2e |

Add pytest, JUnit, k6, Pact when you use them — same pattern as FastAPI. Not a `Tools/` dump.

## Sister

- Pipeline as a gate → DevOps-Handbook `CiCd/`
- Load / failure at design time → System-Design `Failure-Modes/` + `Performance/`
