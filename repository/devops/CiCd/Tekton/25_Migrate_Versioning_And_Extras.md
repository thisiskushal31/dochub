# 25 — Migrate, versioning, and extras

[← Previous](./24_YAML_CRD_Catalog_And_Troubleshooting.md) · [README](./README.md) · [Next: Spectrum →](./26_GitOps_Handoff_And_Spectrum.md)

## 1. Concepts

### API migrations

Pipelines moved `v1alpha1` → `v1beta1` → `v1`. Follow official migration guides for your from→to pair; update CRDs and YAML `apiVersion` together.

### Component upgrades

Upgrade Pipelines, Triggers, PAC, Chains, Operator on a schedule with a test cluster. Catalog Task versions bump independently — read changelogs.

### Migrating *to* Tekton

Map forge workflows → Tasks/Pipelines; shared libraries → Catalog/resolvers; runners → cluster capacity. Parallel-run before cutover.

### Migrating *from* Tekton

Often to forge CI for ops simplicity, or keep Tekton for build and GitOps for deploy ([26](./26_GitOps_Handoff_And_Spectrum.md)).

### Extras worth naming

| Extra | Note |
|-------|------|
| Deprecated **PipelineResources** | Prefer workspaces / results / artifacts |
| Kueue / Scheduler / approval gates | Operator literacy ([19](./19_Operator_Platform_Config.md)) |
| Trusted Resources / hermetic / SPIRE | Security hardening doors ([08](./08_Auth_ServiceAccounts_And_RBAC.md)) |
| Container contract | Step execution constraints literacy |
| Agents / threat-model docs | Platform security reading |
| PAC gitops commands / LLM guides | Optional; privilege-sensitive |
| MCP / experimental repos | Upstream-only unless you adopt |
| Results PostgreSQL upgrades | Ops when using Results DB |

## 2. Advanced concepts

Deprecation tables in Pipelines docs — check before copying old tutorials. CustomRun migration guides exist for Run API changes.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Survive years | Pin versions; migration tickets |
| Absorb Catalog | Internal fork + pins |
| Leave Tekton | Parallel forge pipelines; freeze new CRDs |

**Good:** staged upgrades. **Bad:** jump three API majors on Friday.

## References

- [Migrating to v1](https://tekton.dev/docs/pipelines/migrating-v1beta1-to-v1/)  
- [Deprecations](https://tekton.dev/docs/pipelines/deprecations/)  
