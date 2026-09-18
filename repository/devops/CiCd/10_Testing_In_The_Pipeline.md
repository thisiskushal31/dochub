# Testing in the pipeline

[← Back to CI/CD](./README.md)

A deployment pipeline is only as trustworthy as the **automated checks** that gate each stage. This is the CI/CD view of testing — not a full QA methodology book.

Vocabulary: [Methodologies/13](../Methodologies/13_Continuous_Everything.md). Continuous testing idea: [Methodologies/2](../Methodologies/2_Practices_And_Workflows.md).

## Map tests to pipeline stages

Humble & Farley’s pipeline puts **fast** feedback first, then broader suites on the same artifact:

| Stage | Typical tests | Feedback target |
|-------|---------------|-----------------|
| **Commit** | Unit, lint, typecheck, fast component tests | Minutes; broken mainline is urgent |
| **Acceptance / broader** | Integration, API contract, broader automated acceptance | Still pre-prod |
| **Pre-prod deploy** | Smoke, selected e2e, DAST on preview | Environment truth |
| **Prod** | Synthetics, canary analysis | Real traffic signals ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)) |

Most defects should be caught by **unit** tests; escaping bugs should drive *earlier* test improvements (pipeline feedback loop).

## Test kinds (DevOps literacy)

| Kind | Asks | CI notes |
|------|------|----------|
| **Unit** | One unit in isolation | Parallel, cached, every PR |
| **Integration** | Modules + real/test doubles for deps | Needs services (containers, testcontainers) |
| **Contract** | Provider/consumer API compatibility | Critical for multi-service promote ([8](./8_Environments_Promotion_And_Approvals.md)) |
| **e2e / UI** | Full user journeys | Fewer, stable; Playwright/Cypress etc. |
| **Performance** | Latency/throughput under load | Often scheduled or pre-release; k6 and kin |
| **Security tests** | SAST/SCA/DAST | [15](./15_Pipeline_Security_And_Gates.md) |

Browser e2e product depth may live in [Tooling Quality-And-Testing](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive); here you wire them as **jobs**.

## Flakes and gates

| Problem | Practice |
|---------|----------|
| Flaky e2e blocks everyone | Quarantine, fix root cause, don’t ignore forever |
| 40-minute serial suite | Parallelize; split smoke vs full; shift left |
| “We’ll test in staging manually” | Manual exploratory is additive, not the only gate |

Fail the pipeline when a required suite fails (**fail closed** for release-blocking tests).

## Illustrative job shape

```yaml
# Conceptual — adapt to your CI
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test -- --coverage
  integration:
    needs: unit
    services: { postgres: { image: postgres:16 } }
    steps:
      - run: npm run test:integration
  smoke:
    needs: deploy-staging
    steps:
      - run: npm run test:smoke -- --base-url "$STAGING_URL"
```

Same **artifact** under test from build onward ([4](./4_Artifacts_And_Registries.md)).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Only e2e, no unit | Invert the pyramid — many fast unit tests |
| Testing a different build than you deploy | Build once |
| Skipping tests on main to “go faster” | Protect mainline; speed up tests instead |
| No ownership of failures | Map suite → team ([Methodologies/16](../Methodologies/16_Roles_Teams_And_Platforms.md)) |

## Next

- Verify/rollback: [5](./5_Verify_Rollback_And_Synthetic_Tests.md)  
- Security gates: [15](./15_Pipeline_Security_And_Gates.md)

## Further reading

- [Continuous Delivery — continuous testing / pipeline](https://continuousdelivery.com/foundations/test-automation/)  
- *Continuous Delivery* (Humble, Farley) — test automation chapters  
