# Branching, pull requests, and trunk-based development

[← Back to Methodologies](./README.md)

Branching policy is a delivery control. Pick a model that matches **release risk** and **team size**, then enforce it with protected branches and required checks — not with tribal knowledge.

---

## Models compared

| Model | How it works | Fits | Hurts when |
|-------|--------------|------|------------|
| **Trunk-based** | Short-lived branches; merge to `main` often (daily+) | Fast CI, strong tests, DevOps flow | No CI discipline / broken main tolerated |
| **GitHub Flow** | Branch → PR → merge to `main` → deploy | Most product teams | `main` is not always deployable |
| **GitFlow** | `develop` + `release/*` + `hotfix/*` + long `feature/*` | Versioned packaged software, rare releases | Microservices / continuous deploy — merge hell |
| **Release branches** | Cut `release/x.y` for stabilization | Mobile / regulated cutovers | Forgetting hotfixes must flow back to trunk |

### House default (this handbook)

**Trunk-based + PR to `main`** (GitHub Flow style):

- Branch from `main`, open PR within hours/days — not weeks  
- Required checks must pass  
- `main` is always deployable (or reverted quickly)  
- Risky behavior behind flags ([2_Practices](./2_Practices_And_Workflows.md))  

Use GitFlow only when you truly ship infrequent versioned artifacts and can staff release management.

---

## PR hygiene

| Rule | Why |
|------|-----|
| **Small PRs** | Reviewable; easy revert |
| **Description** | What / why / how tested / risk |
| **Required reviews** | CODEOWNERS for sensitive paths |
| **Required checks** | Build, test, secrets, SAST — see [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md) |
| **No “LGTM” on 2k-line dumps** | Split or reject |

CODEOWNERS example (GitHub):

```text
# .github/CODEOWNERS
/infra/**              @org/platform
/.github/workflows/**  @org/platform
/src/payments/**       @org/payments
```

---

## Protected branches

On `main` (and release branches):

- Require PR  
- Require status checks  
- Restrict who can push  
- Optional: require linear history or merge queue  
- Block force-push  

Merge queue (GitHub) serializes merges so `main` stays green under load.

---

## Revert strategy

Prefer **revert commit** over force-push on shared branches.

```text
Bad deploy on main
  → revert merge commit (or revert PR)
  → deploy revert
  → fix forward on a new PR
```

Progressive delivery reduces how often you need nuclear revert: [CiCd/3](../CiCd/3_Deployment_Strategies.md).

---

## Minimal PR → CI sketch

```yaml
# Concept only — GitHub Actions shape
on:
  pull_request:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and unit test
        run: make test
      - name: Secrets scan
        run: echo "run gitleaks or vendor action"
```

Real workflows live under [CiCd/GitHub_Actions](../CiCd/GitHub_Actions/README.md) when filled. Concepts beat YAML memorization.

---

## Trade-offs

| Optimize for | Lean toward |
|--------------|-------------|
| Speed + learning | Trunk + flags + strong CI |
| Release audit / freeze windows | Release branches + approvals |
| Open-source with many forks | Clear CONTRIBUTING + protected default branch |

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Long-lived `feature/epic-q3` | Integrate behind flags daily |
| Direct commits to `main` | Protected branch + break-glass documented |
| Checks that take 45 minutes on every PR | Split fast PR checks vs nightly heavy |

## Next

- Pipeline loop: [CiCd/1_Pipelines_Build_Test_Deploy.md](../CiCd/1_Pipelines_Build_Test_Deploy.md)  
- Metrics for whether branching helps: [5_DORA](./5_DORA_And_Delivery_Metrics.md)

## Further reading

- trunkbaseddevelopment.com  
- GitHub docs: protected branches, merge queue, CODEOWNERS  
