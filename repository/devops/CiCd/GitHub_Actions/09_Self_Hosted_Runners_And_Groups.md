# 09 — Self-hosted runners and groups

[← Previous](./08_GitHub_Hosted_Runners.md) · [README](./README.md) · [Next: ARC →](./10_Actions_Runner_Controller_ARC.md)

## 1. Concepts

**Self-hosted runners** are machines (VM, bare metal, container) **you** register with GitHub. Jobs target them with labels:

```yaml
runs-on: [self-hosted, linux, gpu]
```

You own OS patching, tooling, network exposure, and isolation. Use when hosted cannot reach a network, needs special hardware/licenses, or policy demands it.

Registration scopes: repository, organization, or enterprise. **Runner groups** control which repos/workflows may use which runners.

## 2. Advanced concepts

### Hygiene (non-negotiable)

| Risk | Mitigation |
|------|------------|
| Persistent workspace dirty state | Ephemeral runners or strict cleanup |
| Secret residue | Rotate; don’t write secrets to disk unencrypted |
| Lateral movement | Network segment; least privilege; no shared prod creds on CI hosts |
| Label spoofing / wrong pool | Tight group policies; unique labels |

Docs also cover: run as a service, labels, pre/post job scripts, container customization, proxies, monitoring.

### Groups as policy

Enterprise/org patterns: restrict a group so only **selected repositories** or **selected reusable workflows** can submit jobs — strong compliance move with paved roads ([13](./13_Reusable_Workflows_And_Composites.md)).

### Limits literacy

Examples from the limits reference (confirm live; subject to change): registration rate caps; up to large counts per group; **5 day** max job execution; **24 hour** max queue wait for a job.

### vs ARC

Manual self-hosted pools vs **Actions Runner Controller** elastic scale sets on Kubernetes ([10](./10_Actions_Runner_Controller_ARC.md)).

### Migrating off self-hosted

GitHub documents assessing moves back to hosted when the original constraints fade — useful brownfield literacy.

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| GPU / FPGA / HSM | Labeled self-hosted pool |
| Reach RFC1918 only services | Self-hosted in that net (or hosted private-net patterns) |
| Org isolation | Runner groups per sensitivity tier |

**Good:** ephemeral, patched, grouped. **Bad:** one beefy always-on runner shared by every repo with write credentials.

## References

- [Self-hosted runners](https://docs.github.com/en/actions/concepts/runners/self-hosted-runners)  
- [Runner groups](https://docs.github.com/en/actions/concepts/runners/runner-groups)  
- [Adding self-hosted runners](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners)  
- [Managing access with groups](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/manage-access)  
