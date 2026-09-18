# 3 — Platform engineering

[← Back to Cloud-Native](./README.md) · [Backstage →](./Backstage/README.md) · [CNCF everyday tools](./4_CNCF_Everyday_Tools.md)

## 1. Concepts

**Platform engineering** builds **internal products** so product teams can ship on a **paved road**: golden paths for repo → CI → environments → observe → operate—without each team reinventing Kubernetes, IAM, and DNS.

**Plain language:** The platform team’s customer is the **developer**. Success looks like: “I clicked a template / opened a PR and landed in staging with TLS, DNS, and dashboards already wired.”

### What you are selling internally

| Product surface | Example |
|-----------------|---------|
| **IDP / portal** | [Backstage](./Backstage/README.md), Port, custom |
| **Golden paths** | Templates: service, job, library, data pipeline |
| **Shared services** | CI runners, registries, secrets, ingress defaults |
| **Guardrails** | Policy-as-code, required gates, baseline Helm chart |
| **Docs & support** | Runbooks, office hours, SLAs for the platform itself |

Related delivery loop: [CiCd/](../CiCd/README.md). Culture: [Methodologies/](../Methodologies/README.md). Cluster add-ons that make paths real: [4](./4_CNCF_Everyday_Tools.md).

**Disconfirm:** Giving every team a raw kubeconfig is **not** a platform. A wiki of YAML snippets is **not** self-service.

**Confirm:** Who is the platform’s user? What is one golden path you would offer first?

## 2. Advanced concepts

### Paved road vs desire path

```text
Desire path:  each team copies last week’s Helm + IAM + DNS by hand
Paved road:   template + shared chart + cert-manager + ExternalDNS + GitOps + baseline dashboards
```

Teams may still leave the road (escape hatches)—but the **default** should be safe and fast.

### Platform as a product

| Practice | Why |
|----------|-----|
| Versioned interfaces | Chart/app-of-apps contracts; breaking changes announced |
| SLOs for the platform | Portal, CI, cluster create/upgrade—measure like a product |
| Adoption metrics | % services on golden path; time-to-first-deploy |
| Feedback loop | Office hours; template RFCs; kill unused paths |

### Boundaries (do not absorb the world)

| Owns | Does not own |
|------|----------------|
| Shared CI patterns, registries, cluster baselines | Every product’s business logic |
| Ingress/TLS/DNS defaults | App feature flags content |
| Catalog ownership model | Writing all runbooks for every team |
| Guardrail policy | Being the only people who can `kubectl apply` forever |

Cloud tenant how-to: [Cloud/15–22](../Cloud/README.md). Metal/colo literacy when the platform sits on halls: [Datacenter/](../Datacenter/README.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Day-0 platform | One service template + CI + staging namespace + Ingress TLS/DNS |
| Scale | Backstage catalog + scorecards; multiple golden paths |
| Regulated | Escape hatches audited; policy gates in CI ([Security/4](../Security/4_Security_Gate_Chain.md)) |
| Multi-cloud | Same paved UX; adapters behind ([IAC/](../IAC/README.md), Cloud SKUs) |

**Staff checklist**

- Name the first golden path and its owners  
- Portal/catalog optional at first—path can start as a template repo  
- Measure time-to-hello-world on the path  
- Document escape hatches and review them  
- Platform on-call separate from app on-call when scale demands it  

**Confirm**

1. What makes a path “paved”?  
2. Give one metric that shows platform adoption.  
3. Name one thing platform engineering should refuse to own.

**Disconfirm**

- More YAML in a shared folder is **not** an IDP.  
- Blocking all `kubectl` without a working self-service path is **not** enablement.

**Good:** versioned golden paths, clear users, measured adoption. **Bad:** ticket-driven snowflakes forever; portal theater.

## References

- [Team Topologies](https://teamtopologies.com/) (platform team shape — literacy)  
- [Backstage docs](https://backstage.io/docs/)  
- [CNCF Platforms white paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/)  
- [CiCd staircase](../CiCd/README.md)  
- [CNCF everyday tools](./4_CNCF_Everyday_Tools.md)  
