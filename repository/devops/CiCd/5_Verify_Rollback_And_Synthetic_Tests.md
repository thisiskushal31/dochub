# Verify, rollback, and synthetic tests

[← Back to CI/CD](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Post-deploy verification: health checks, smoke tests, synthetic probes
- Tools literacy: k6, Playwright/Cypress in CI, curl-based smoke, canary analysis hooks
- Rollback vs roll-forward; feature flags as mitigation
- Linking verify failures to observability (SLO burn, alert)
- Environment promotion gates: DEV → preview → staging → prod

## Cross-links

- Deployment strategies: [3_Deployment_Strategies.md](./3_Deployment_Strategies.md)
- Observability: [Observability/](../Observability/README.md)
- DAST after preview: [Security/ZAP](../Security/ZAP/README.md)

## Checklist before marking done

- [ ] Minimal smoke job example in pipeline YAML
- [ ] Rollback decision tree (when auto-rollback vs human)
