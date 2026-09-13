# FinOps literacy for DevOps engineers

[← Back to Methodologies](./README.md)

FinOps is not “become Finance.” It is **engineering decisions that change cloud spend** — made visible, attributed, and reversible. If you open PRs that create clusters, disks, NAT gateways, or always-on GPU nodes, you already do FinOps.

Cost is already a DevOps concern. **Stewardship / sustainability** extends the same mindset — see [19_Durable_Mindsets_And_Evolving_Toolsets](./19_Durable_Mindsets_And_Evolving_Toolsets.md).

Stay DevOps-scoped: enough to prevent waste and escalate early. Not a billing certification.

---

## Why DevOps owns cost awareness

| Waste pattern | Who usually creates it |
|---------------|------------------------|
| Idle non-prod left on 24/7 | Platform / app teams via IaC |
| Orphan optional parallel / preview DEVs | Missing TTL after a rare parallel soak |
| Oversized nodes “just in case” | Copy-paste modules |
| Orphan disks / IPs / load balancers | Incomplete teardown |
| Chatty cross-AZ / egress traffic | Architecture + defaults |
| Debug logging at trace volume forever | App + observability config |

Fixing these is closer to IaC and paved roads than to an invoice spreadsheet.

---

## Levers you control

| Lever | Action |
|-------|--------|
| **Rightsizing** | Match CPU/mem to p95 use; don’t provision for fantasy peaks |
| **Autoscaling** | Scale to zero or near-zero where safe (dev, async workers) |
| **Scheduling** | Commit / reserved / savings plans — with Finance; you provide usage truth |
| **Spot / preemptible** | Fault-tolerant workloads only |
| **Storage class / lifecycle** | Move cold data; delete unfinished snapshots |
| **Egress** | Co-locate; cache; avoid accidental public downloads of large artifacts |

Cloud literacy doors: [Cloud/](../Cloud/README.md). Module design: [IAC/](../IAC/README.md).

---

## Tagging / labeling for allocation

Without tags, you cannot answer “who pays?”

Minimum useful tags (example):

```text
env=prod|staging|dev
team=payments
service=payments-api
owner=email-or-group
cost-center=CC123
```

Enforce in IaC (default tags module) and reject untagged resources in policy (OPA/Checkov — Security tool folders later).

---

## Optional parallel DEV environments (cost)

Default non-prod shape is **one shared DEV** plus staging/prod ([CiCd/8](../CiCd/8_Environments_Promotion_And_Approvals.md)). Parallel / ephemeral DEVs are **optional** — use them only when shared DEV contention is chronic enough to justify spend.

If you do run them (same snapshot tag; GitOps create/destroy — [Argo_CD](../CiCd/Argo_CD/README.md)):

| Do | Don’t |
|----|--------|
| Budget a small concurrent cap; destroy when the task ends | Leave “dev-alice” running for weeks |
| Tag `env=dev-ephemeral`, `owner=…`, `ttl=…` | Untagged clones nobody can attribute |
| Right-size below staging | Full prod-sized stack per person |
| Alert the team that can tear down | Only Finance sees the spike |

Orphaned previews are a classic anomaly — wire cleanup into the same automation that creates them ([CiCd/24](../CiCd/24_Workflow_Automation_Beyond_PR_CI.md)).

---

## Budgets and anomalies (concept)

All major clouds offer:

- Budget thresholds → email / Pub/Sub / SNS  
- Anomaly detection on sudden spend spikes  

Wire alerts to the team that can **turn resources off**, not only to Finance. Chat notify is fine ([6](./6_ChatOps_And_Notifications.md)); paging at 3am for a slow spend creep usually is not.

---

## Checklist: before merging an infra PR

- [ ] What new resources are created? Est. monthly cost order-of-magnitude?  
- [ ] Non-prod: shut down schedule or scale-to-zero?  
- [ ] Tags/labels present?  
- [ ] Disks / snapshots / logs have retention?  
- [ ] Egress or NAT implications?  
- [ ] If expensive (GPU, large DB): who approved?  

---

## When to escalate vs fix in IaC

| Situation | You fix | Escalate |
|-----------|---------|----------|
| Forgotten staging / ephemeral DEV | Tear down / TTL schedule | — |
| Need enterprise discount / CUDs | Provide usage data | FinOps / Finance |
| Shared VPC cost attribution | Improve tags | FinOps for chargeback model |
| Product wants always-on multi-region active-active | Show cost delta | Product + architecture |

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Optimizing $3 while ignoring $3k idle GPU | Sort by spend first |
| Turning off backups to save money | That is risk transfer, not FinOps |
| One giant shared account with no tags | Separation + attribution |

## Next

- Legacy / maintenance cost of old systems: [9_Maintenance_And_Legacy](./9_Maintenance_And_Legacy.md)  
- Provider literacy: [Cloud/README.md](../Cloud/README.md)

## Further reading

- FinOps Foundation — lexicon and principles (conceptual)  
- Your cloud’s Cost Explorer / Billing reports — hands-on when you operate  
