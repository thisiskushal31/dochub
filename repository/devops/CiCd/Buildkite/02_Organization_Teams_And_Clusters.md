# 02 — Organization, teams, and clusters

[← Previous](./01_What_Is_Buildkite.md) · [README](./README.md) · [Next: Create pipeline →](./03_Create_Pipeline_Connect_Git_And_View_Builds.md)

---

## 1. Concepts

| Layer | Meaning |
|-------|---------|
| **Organization** | Top tenancy (billing, SSO, providers) |
| **Team** | Who can see/build which pipelines |
| **Cluster** | Isolates agents, queues, tokens, and pipelines |
| **Pipeline** | One CI/CD workflow definition + build history |
| **Queue** | Group of agents inside a cluster ([05](./05_Queues_Clusters_And_Targeting.md)) |

New orgs get a **default cluster** and starter queues (including hosted shapes when using hosted agents). Pipelines are assigned to a cluster so their jobs only run on that cluster’s agents.

---

## 2. Advanced concepts

### Clusters

- Separate trust domains (prod vs open-source; PCI vs normal).  
- Cluster maintainers manage queues and agent tokens.  
- Pipelines in a cluster typically trigger only other pipelines in the same cluster.  
- Some cluster insights/metrics are plan-gated — confirm docs/pricing.

### Teams

Use teams for pipeline access instead of ad-hoc user grants. Pair with SSO on Platform ([15](./15_Platform_Teams_SSO_And_Governance.md)).

### Unclustered agents (brownfield)

Older estates may still show **unclustered** agents — migrate toward clusters for clearer isolation.

---

## 3. Applications and use cases

| Shape | Pattern |
|-------|---------|
| Single product team | One org, default cluster, few queues |
| Multi-business unit | Clusters per unit; teams per app |
| Strict prod deploys | Dedicated cluster + restricted deploy pipeline |

**Good:** named cluster owners; pipeline→cluster assignment intentional. **Bad:** shared agent token across unrelated trust zones.

---

## References

- [Clusters](https://buildkite.com/docs/pipelines/security/clusters)  
- [Team management](https://buildkite.com/docs/platform/team-management)  
- [Platform overview](https://buildkite.com/docs/platform)  
