# Scripting and orchestration

[← Back to Automation](./README.md)

Classical DevOps glues machines with **shell** (and Python/PowerShell) long before Kubernetes YAML appears. CI jobs, bastion deploys, and Ansible wrappers all start here.

Language depth: [Languages/Shell](../Languages/Shell/README.md). Classical CI using scripts: [CiCd/20](../CiCd/20_Classical_Jenkins_Host_And_Web_Deploy.md). Config management at scale: [Ansible/](./Ansible/README.md).

## Where scripting sits in delivery

```text
CI agent runs script → build/test/package
CD step runs script → copy artifact, systemctl, curl smoke
OR Ansible playbook → idempotent multi-host (preferred for fleets)
```

Scripts in **Git**, invoked by the pipeline — not tribal knowledge on one bastion.

## Durable practices

| Practice | Why |
|----------|-----|
| `set -euo pipefail` (Bash) | Fail closed on errors |
| Explicit exit codes | CI gates on status |
| No secrets in scripts | Inject from secret store / CI credentials |
| Idempotent where possible | Re-run safe; or move to Ansible modules |
| Log usefully | Enough for [CiCd/16](../CiCd/16_Notifications_Webhooks_And_ChatOps.md) |

## Orchestration ladder

| Level | Tool |
|-------|------|
| One host | Shell / systemd timers |
| Many hosts | Ansible (or Chef/Puppet) |
| Event / workflow products | Outside this folder’s primary scope — prefer CI + Ansible + CiCd notifications |

n8n-style workflow SaaS is **not** a substitute for CI gates; agentic demos still need the same verify/promote discipline ([CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md)).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| 2k-line Bash deploy nobody owns | Split; Ansible for multi-host |
| `curl \| sudo bash` in prod | Pinned artifacts + review |
| Scripts only on the server | Version in repo; CI runs them |

## Next

- [Ansible/](./Ansible/README.md)  
- [CiCd/23 Classical stack map](../CiCd/23_Classical_DevOps_Stack_Map.md)  
