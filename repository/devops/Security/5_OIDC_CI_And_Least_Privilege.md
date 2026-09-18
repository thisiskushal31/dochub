# OIDC, cloud IAM, and least privilege for CI

[← Back to Security](./README.md)

CI jobs that can push images or deploy are high-value identities. Prefer **short-lived federated credentials** over long-lived access keys stored as pipeline secrets.

Delivery context: [CiCd/15](../CiCd/15_Pipeline_Security_And_Gates.md), [CiCd/13](../CiCd/13_Config_Secrets_And_Env_Parity.md). Cloud map: [Cloud/](../Cloud/README.md). App runtime secrets: [Vault/](./Vault/README.md).

## The anti-pattern

```text
Create cloud access key / SA JSON key
  → paste into CI secret store
  → every job uses it for years
  → leak in logs/fork PR = lasting blast radius
```

Replace with **OIDC federation**: the CI platform issues a per-job identity token; the cloud exchanges it for temporary credentials.

GitHub documents this pattern for Actions (and the same idea exists for GitLab, Azure DevOps, etc.): [OpenID Connect in Actions](https://docs.github.com/en/actions/concepts/security/openid-connect).

## How OIDC from CI works (generic)

```text
1. Cloud trusts CI issuer (OIDC provider / workload identity pool)
2. Trust policy constrains claims (repo, ref, environment, …)
3. Job requests id-token
4. Cloud issues short-lived creds for a role / SA
5. Job deploys or pushes; creds expire
```

## Cloud mappings (literacy)

| Cloud | Typical mechanism | CI side |
|-------|-------------------|---------|
| **AWS** | IAM OIDC identity provider + role trust on `sub` (and related) claims | e.g. `aws-actions/configure-aws-credentials` with `role-to-assume`; need `id-token: write` |
| **GCP** | Workload Identity Federation (pool + provider) → impersonate SA | e.g. `google-github-actions/auth` with provider + SA |
| **Azure** | Federated credentials on Entra app / managed identity | Official Azure login actions with federated credential |

Always follow **current** cloud + CI vendor docs for claim names and exact YAML — they evolve. The durable rule: **condition the trust on tight subject/claims**, not “any token from GitHub.”

## Illustrative GitHub Actions shape (AWS-style)

```yaml
permissions:
  id-token: write   # request OIDC JWT — not write access to your cloud
  contents: read
jobs:
  deploy:
    environment: production   # ties to env protection rules
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/ci-prod-deploy
          aws-region: us-east-1
```

Pin action versions/SHAs in real pipelines. Mirror the pattern for GCP/Azure with their login actions.

## Least privilege for pipeline roles

| Job intent | Role should allow | Role should NOT allow |
|------------|-------------------|------------------------|
| Push image | Registry push to one repo/project | Cluster admin |
| Deploy app | Workload namespace deploy / specific cloud service | Org-wide IAM admin |
| Terraform plan | Read + plan-state access | Unbounded `*` on prod without approval gate |
| Terraform apply | Scoped apply after approval | Same role on every PR |

Separate **plan** vs **apply** identities when you can. Separate **staging** vs **production** roles. PR workflows must not assume production roles ([CiCd/8](../CiCd/8_Environments_Promotion_And_Approvals.md)).

## Workload identity on clusters (entry)

When jobs or pods run *in* Kubernetes and need cloud APIs:

| Platform | Common pattern |
|----------|----------------|
| **EKS** | IRSA (IAM Roles for Service Accounts) — pod SA → IAM role |
| **GKE** | Workload Identity — K8s SA → GCP SA |
| **AKS** | Workload identity / federated patterns per current Azure docs |

Same idea as CI OIDC: **no node-wide keys** in every pod. Depth: [Cloud/](../Cloud/README.md) + Containerization.

## Migration checklist

1. Inventory CI secrets that are cloud keys / SA JSON.  
2. Create federated trust for one non-prod pipeline; prove deploy works.  
3. Tighten claim conditions (repo + environment/ref).  
4. Remove static keys; rotate anything that ever lived in CI.  
5. Quarterly audit: remaining long-lived CI secrets, over-broad roles, unused trust entries.  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Trust `repo:*` or any branch | Pin repo + `environment` / protected ref |
| Prod role assumable from `pull_request` | Environment protection; separate roles |
| `id-token: write` misunderstood as cloud write | It only allows requesting the OIDC JWT |
| One role for build, deploy, and break-glass | Split intents |

## Next

- Gate chain: [4_Security_Gate_Chain.md](./4_Security_Gate_Chain.md)  
- Config/secrets in delivery: [CiCd/13](../CiCd/13_Config_Secrets_And_Env_Parity.md)

## Further reading

- [GitHub — OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)  
- [GitHub — OIDC with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)  
- AWS / GCP / Azure docs for “federated identity” / “workload identity federation” from your CI vendor  
