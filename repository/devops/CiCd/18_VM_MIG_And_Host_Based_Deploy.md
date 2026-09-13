# VM, MIG, and host-based deploy

[← Back to CI/CD](./README.md)

A large share of production still runs on **virtual machines**: a handful of hosts, an autoscaled **managed instance group** (MIG) / autoscaling group, or a classic VM behind a load balancer. Kubernetes patterns in [3](./3_Deployment_Strategies.md) and [9](./9_Progressive_Delivery_Controllers.md) are **cousins**, not the only path.

Config management of hosts: [Automation/](../Automation/README.md) (Ansible, etc.). Image baking: Packer/IAC when you get there. Spectrum: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md).

---

## Durable jobs (timeless)

| Job | Meaning on VMs |
|-----|----------------|
| **Build artifact** | Package, tarball, deb/rpm, or **machine image** / instance template |
| **Configure** | User-data, Ansible, or golden image — prefer immutable images over snowflake SSH |
| **Roll out** | Replace or update instances under a load balancer with health checks |
| **Verify** | Health + smoke against LB URL |
| **Rollback** | Previous instance template / image / package version |

Fowler **blue-green** was described for dual environments and a router switch — it applies cleanly to two VM pools or two MIGs, not only to containers ([Blue Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)).

---

## Topology ladder

```text
Single VM (legacy / small)
  → several VMs + LB (manual or scripted)
  → Managed Instance Group / ASG + LB + health checks
  → (optional) containers on VMs, then orchestrators
```

All of these can sit behind the **same CI loop** ([1](./1_Pipelines_Build_Test_Deploy.md)): CI builds → stores artifact → deploy job updates fleet → verify.

---

## Artifact styles on hosts

| Style | Pipeline produces | Deploy does |
|-------|-------------------|-------------|
| **App package** | jar/war, deb, rpm, tarball | Install/restart service (systemd) |
| **Runtime + app** | Versioned directory / symlink release (Capistrano-style) | Flip `current` symlink; restart |
| **Immutable VM image** | Image from Packer/build pipeline | Rolling replace instances with new template |
| **Container on VM** | Image digest | Docker/Podman compose or unit pulls digest |

Prefer **immutable images or packages** over “SSH and git pull on prod” ([4](./4_Artifacts_And_Registries.md), [13](./13_Config_Secrets_And_Env_Parity.md)).

---

## Managed instance groups / autoscaling groups

Cloud MIGs (e.g. Google Compute Engine MIG rolling updates) and analogues (AWS Auto Scaling group instance refresh / launch template changes) share ideas:

| Control | Role |
|---------|------|
| **Instance template / launch template** | Desired machine + image + metadata |
| **maxUnavailable** | How many instances may be down during update |
| **maxSurge** | How many **extra** instances above target during update |
| **Health checks** | LB/MIG only replaces when new instances become healthy |
| **Canary versions** | Some MIG updaters support a canary template + target size before full roll |

GCP documents automated MIG updates with `maxSurge` / `maxUnavailable` (fixed or percent); setting `maxUnavailable=0` and `maxSurge>0` creates replacements before removing old VMs ([MIG rolling updates](https://cloud.google.com/compute/docs/instance-groups/rolling-out-updates-to-managed-instance-groups)). AWS ASG / Azure VMSS have the same *job* with different API names — learn the controls, not only one CLI.

**CI wiring:**

```text
CI builds app → bakes image OR publishes package
  → registers new instance template (points at image/version)
  → starts rolling update / instance refresh
  → smoke against load balancer
  → on failure: roll back to previous template
```

---

## Small VM fleets (no MIG yet)

| Pattern | Notes |
|---------|--------|
| **SSH + copy** | Acceptable only as a scripted, audited pipeline step — not a human ritual |
| **Pull agent** | Host pulls from artifact store on signal (still need health + rollback) |
| **Config management** | Ansible/etc. apply package version from inventory ([Automation/](../Automation/README.md)) |
| **Blue-green pools** | Two target groups; switch LB listener/weights when green is healthy |

Always keep **previous artifact** for rollback ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)).

---

## Overlap with schema and stateful disks

Rolling VMs with local state is harder than stateless app tiers. Prefer external DB/disk; use expand/contract for schema ([7](./7_DB_Migrations_In_Pipelines.md)). Stateful MIG policies exist but raise operational cost — know before you choose them.

---

## Illustrative outline (MIG)

```text
1. pipeline: test → build → bake image image-app-${SHA}
2. create instance template T_new from that image
3. gcloud compute instance-groups managed rolling-action start-update …
     --version=template=T_new --max-unavailable=1 --max-surge=1
4. wait until stable + curl https://service/healthz
5. retain T_prev for rollback
```

Exact flags follow current cloud docs; the sequence is durable.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Mutating prod by hand over SSH | Pipeline-owned deploy + golden images |
| Rolling without health checks | LB/MIG health before traffic |
| One giant “update all at 100% unavailable” in prod | Tune maxUnavailable/surge; canary template first |
| No previous template retained | Keep N known-good templates/images |

## Next

- Static/CDN: [17](./17_Static_Sites_And_CDN_Deploy.md)  
- Strategies vocabulary: [3](./3_Deployment_Strategies.md)  
- Legacy through AI-era map: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md)

## Further reading

- [GCE — Rolling out updates to MIGs](https://cloud.google.com/compute/docs/instance-groups/rolling-out-updates-to-managed-instance-groups)  
- [Martin Fowler — Blue Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)  
- AWS Auto Scaling / Azure Virtual Machine Scale Sets rolling upgrade docs (same controls, different names)  
