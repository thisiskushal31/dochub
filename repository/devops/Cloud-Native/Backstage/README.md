# Backstage (internal developer portal)

[← Back to Cloud-Native](../README.md) · [Platform engineering](../3_Platform_Engineering.md) · [CNCF everyday tools](../4_CNCF_Everyday_Tools.md)

## 1. Concepts

**Backstage** is an open-source **internal developer portal (IDP)** framework (CNCF). Teams use it as a **catalog + scaffolder + docs** front door so engineers discover services and create them on a **paved road**—not as a second Kubernetes.

**Plain language:** It is the company intranet for software: “what services exist, who owns them, how do I spin up a new one the approved way, where are the runbooks?”

### Where it sits

```text
Engineer → Backstage UI
              ├─ Software Catalog (entities, owners, APIs)
              ├─ Software Templates / Scaffolder (new repo + CI + Helm skeleton)
              ├─ TechDocs (docs-as-code)
              └─ Plugins (CI status, K8s, scorecards, …)
                    ↓
              Git + CI/CD + cluster (Argo/Flux, cloud APIs)
```

Platform framing: [3](../3_Platform_Engineering.md). Delivery engines stay in [CiCd/](../../CiCd/README.md). This folder is **ops/product literacy**, not a full install cookbook.

**Disconfirm:** Backstage is **not** a deploy tool. Publishing a catalog entry does **not** ship traffic.

**Confirm:** What three jobs does an IDP usually cover (discover, create, document)?

## 2. Advanced concepts

### Core surfaces

| Surface | Job |
|---------|-----|
| **Software Catalog** | Inventory of Components, APIs, Resources, Systems, Domains; ownership |
| **Software Templates** | Golden-path scaffolding (repo, CI, Dockerfile, Helm/Kustomize stub) |
| **TechDocs** | MkDocs-style docs built from the repo |
| **Plugins** | Glue to GitHub/GitLab, Kubernetes, PagerDuty, scorecards, … |

### When Backstage vs lighter portals

| Need | Lean to |
|------|---------|
| Deep custom catalog + many plugins + org standards | Backstage |
| Faster SaaS IDP, less platform engineering time | Port / commercial IDPs |
| Tiny team, few services | Good README + SERVICE.yaml in Git may be enough |
| Only “create a repo” | Scaffolder-only or cookiecutter / copier — not a full portal |

### Ops realities (what platform teams actually own)

| Concern | Note |
|---------|------|
| Auth | Corporate IdP (OIDC/SAML); group → ownership mapping |
| Catalog truth | Entities from Git (`catalog-info.yaml`) beat manual UI-only entries |
| Template drift | Templates must track real CI/GitOps standards or they become legacy traps |
| Cost | Backstage is a product you run (or buy hosted); treat it like production |
| Security | Templates must not bake secrets; least privilege to cloud/Git tokens |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Service discovery | Catalog + owner + on-call link + repo URL |
| New microservice | Template → PR with CI + Dockerfile + Helm + `catalog-info.yaml` |
| Docs near code | TechDocs from `/docs` in the service repo |
| Scorecards | Plugin or policy checks (coverage, OWNERS, prod readiness) — optional |

**Staff checklist**

- One source of ownership (IdP groups ↔ catalog)  
- Templates reviewed like any other platform API  
- Catalog entities live in Git; UI edits are exceptions  
- Portal links to **runbooks that exist** (dead links kill trust)  
- Do not block deploys on Backstage availability (cache / degrade)  

**Confirm**

1. Name one thing Backstage should *not* replace in the delivery path.  
2. Why should catalog entities live in Git?  
3. When is a lighter portal better than Backstage?

**Disconfirm**

- A beautiful portal is **not** a paved road if templates still create snowflake CI.  
- “We installed Backstage” is **not** platform engineering done.

**Good:** Git-backed catalog, maintained templates, clear owners. **Bad:** empty catalog; secret-laden templates; portal as sole deploy button.

## References

- [Backstage documentation](https://backstage.io/docs/)  
- [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/)  
- [Software Templates](https://backstage.io/docs/features/software-templates/)  
- [CNCF Backstage](https://www.cncf.io/projects/backstage/)  
- [Platform engineering](../3_Platform_Engineering.md)  
