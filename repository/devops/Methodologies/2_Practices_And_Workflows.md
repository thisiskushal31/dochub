# Practices and workflows

[← Back to Methodologies](./README.md)

Culture needs **habits**. This file is the habit layer: how work moves from idea to production without becoming a ceremony museum or a cowboy deploy culture.

## Agile integration (DevOps view)

Agile ceremonies are not DevOps. DevOps cares whether **small increments** actually reach users safely.

| Practice | DevOps ask |
|----------|------------|
| Sprint / Kanban | Are deployable increments leaving every few days (or faster)? |
| Stories | Do “done” criteria include test, observability, rollback? |
| Standups | Do blockers include pipeline / env / access — not only code? |

If Agile produces large batches that only ship at sprint end through a change advisory bottleneck, you have Agile theater + waterfall delivery.

## Shift-left (and DevSecOps)

**Shift-left** means move quality and security checks earlier — closer to the author — so failures are cheap.

```text
Author laptop / PR
  → unit + lint + secrets scan + SAST (fast)
CI main path
  → build + tests + SCA + image scan
Pre-prod
  → integration, e2e/smoke, DAST (slower)
Prod
  → verify, observe, progressive delivery
```

Full mindset (shared responsibility, shift-right too): [14_DevSecOps_Mindset](./14_DevSecOps_Mindset.md).  
Gate order: [Security/4_Security_Gate_Chain](../Security/4_Security_Gate_Chain.md) and [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md).

Anti-pattern: only scanning in production or once a year for compliance theater.

## Trunk-based development (preview)

Prefer **short-lived branches** merging to a shared trunk many times per day, protected by CI. Long-lived feature branches are where merge hell and “big bang” risk live.

Full comparison (trunk vs GitFlow vs PR/MR-to-main / “GitHub Flow” nickname): [4_Branching_And_PR_Practices](./4_Branching_And_PR_Practices.md) — host-neutral (GitHub, GitLab, Bitbucket, Azure DevOps, …).

Precise CI / Continuous Delivery / Continuous Deployment meanings: [13_Continuous_Everything](./13_Continuous_Everything.md) — read that before claiming “we do CI/CD.”

## Feature flags

Flags decouple **deploy** from **release**.

| Use | Example |
|-----|---------|
| Dark launch | Code in prod, off for users |
| Gradual rollout | 1% → 10% → 100% |
| Kill switch | Disable a bad path without rollback of the whole artifact |

Trade-offs: flag debt, testing matrix explosion, need for cleanup. Tool literacy (Unleash, LaunchDarkly, OpenFeature) lives under CiCd tool folders when you adopt one — concepts first here and in [CiCd/3](../CiCd/3_Deployment_Strategies.md).

## Progressive delivery (short)

| Strategy | Idea | When |
|----------|------|------|
| **Rolling** | Replace instances gradually | Default for many K8s Deployments |
| **Blue-green** | Two environments; switch traffic | Need fast cutover + instant rollback of traffic |
| **Canary** | Small % of traffic on new version | Validate real load before full promote |

Deep treatment: [CiCd/3_Deployment_Strategies](../CiCd/3_Deployment_Strategies.md). Design-time traffic patterns: [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts).

## GitOps (short)

**GitOps:** desired state of the system lives in Git; an agent reconciles the cluster/environment to match.

```text
PR → merge to env repo → controller applies → cluster matches Git
```

Why DevOps cares: audit trail, PRs for change, drift detection. Controllers (Argo CD, Flux) and folders: [CiCd/](../CiCd/README.md). Do not rebuild a full GitOps book here — own the workflow idea, then the tool.

## A sane default workflow (house recommendation)

1. Trunk + short PR ([4](./4_Branching_And_PR_Practices.md))  
2. Required checks: build, test, secrets, SAST, (image scan if container)  
3. Deploy to non-prod automatically; prod with progressive strategy + approval if needed  
4. Verify + notify ([CiCd/5](../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md), [6_ChatOps](./6_ChatOps_And_Notifications.md))  
5. Flags for risky behavior changes  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “We do GitOps” but kubectl apply by hand in prod | Single path — Git is source of truth |
| Flags never removed | Time-box and delete |
| Shift-left that takes 40 minutes on every PR | Fast checks on PR; heavy checks on main/nightly |
| Canary without metrics | Canary + SLIs or you are gambling |

## Next

- Branching detail: [4_Branching_And_PR_Practices.md](./4_Branching_And_PR_Practices.md)  
- Delivery loop prose: [CiCd/1_Pipelines_Build_Test_Deploy.md](../CiCd/1_Pipelines_Build_Test_Deploy.md)

## Further reading

- Trunk Based Development site (patterns)  
- OpenGitOps principles — conceptual; tools in CiCd  
