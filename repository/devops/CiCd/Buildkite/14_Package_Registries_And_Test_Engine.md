# 14 — Package Registries and Test Engine

[← Previous](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md) · [README](./README.md) · [Next: Platform →](./15_Platform_Teams_SSO_And_Governance.md)

## 1. Concepts

Buildkite is more than Pipelines. Two sibling surfaces show up in real orgs:

### Package Registries

Store packages and package-like artifacts. Pipelines (or other CI) publish; builds consume. Supports supply-chain metadata and OIDC-oriented auth patterns.

**Ecosystem literacy** (each has a setup guide — pick what you use):

Alpine apk · OCI/Docker · Debian/Ubuntu deb · generic files · Helm / Helm OCI · Hugging Face models · Maven · Gradle · npm · NuGet · PyPI · (others as docs add them).

Also: registry permissions, migration into Package Registries, and security pages under Package Registries docs.

### Test Engine

Collects test results from runners; surfaces duration, flakiness, pass rates; **test suites**, ownership, labels/tags, quarantine/state, collectors (JUnit/JSON and language collectors), and workflow monitors/actions. Getting-started treats it as the **testing layer** beside Pipelines. Speed/flaky tooling (e.g. bktec) pairs here ([24](./24_Integrations_Notifications_Observability_And_Insights.md)).

Neither replaces a full artifacts or testing textbook — map durable jobs to [CiCd/4](../4_Artifacts_And_Registries.md) and your quality practices.

## 2. Advanced concepts

Legacy plans may need Package Registries enabled in org settings — confirm for your account. Ecosystem setup differs per format; start from Package Registries getting-started, then the ecosystem page you need.

Test collection uses language collectors / JUnit import / plugins — pin versions and keep tokens scoped.

## 3. Applications and use cases

| Need | Product |
|------|---------|
| Private npm/Docker for CI | Package Registries |
| Hunt flaky tests | Test Engine |
| Only need CI orchestration | Pipelines alone is fine |

**Good:** registry + digest promote. **Bad:** treating Test Engine dashboards as a substitute for failing the build on real failures.

## References

- [Package Registries](https://buildkite.com/docs/package-registries)  
- [Package Registries getting started](https://buildkite.com/docs/package-registries/getting-started)  
- [Tests in Pipelines / Test Engine](https://buildkite.com/docs/pipelines/configure/tests)  
