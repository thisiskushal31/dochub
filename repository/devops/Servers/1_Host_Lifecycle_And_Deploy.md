# Host lifecycle and deploy patterns

[← Back to Servers](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Provision host (IAC) → configure (Ansible) → deploy artifact → systemd or process manager
- SSH / WinRM / SSM Session Manager access patterns (bastion, no shared keys)
- Patching, reboot windows, configuration drift detection
- When to stay on hosts vs move to containers/K8s (decision table)
- Blue-green on VMs (two host groups + LB flip)

## Cross-links

- [IAC/](../IAC/README.md), [Automation/](../Automation/README.md), [CiCd/4](../CiCd/4_Artifacts_And_Registries.md)

## Checklist before marking done

- [ ] One end-to-end: CI builds tarball → Ansible deploys → nginx reload
