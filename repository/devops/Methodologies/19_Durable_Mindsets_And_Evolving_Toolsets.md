# Durable mindsets and evolving toolsets

[← Back to Methodologies](./README.md)

**Timeless rule for this handbook:** mindsets outlive tools. Tool names, vendors, and runtimes change. The jobs — flow, feedback, learning, safe change, shared ownership — stay.

Classic DevOps (Three Ways, CALMS, CI/CD definitions, DORA) comes **first**. What follows does not replace that foundation. It **extends** the same narrative with clearer operating models and newer levers. When a logo dies, keep the mindset; swap the tool row.

Depth for any named product lives in linked handbook / sister homes. This file owns the **durable story**.

**Primary references (principles, not fashion):** [DORA capabilities](https://dora.dev/capabilities/) (incl. platform engineering), [DORA AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model), Three Ways ([IT Revolution](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/)). Industry reports illustrate the same ideas; prefer dora.dev and the Handbook lineage when blogs disagree.

---

## The narrative (read this once)

```text
Durable:  Flow · Feedback · Learning · small batches · shared ownership
Durable:  Measure outcomes · pave a safe default path · prove what you shipped
Evolving: Which CI, which cluster API, which assistant, which policy engine
```

Assisted delivery, platforms, and automation **amplify** whatever system you already have — strength or dysfunction. That is why foundations stay non-negotiable.

**Full deploy-target spectrum** (mainframe → classical VM/Jenkins → Compose/Swarm → static/CDN → K8s → AI systems): mindset in [20](./20_Delivery_Reality_Full_Spectrum.md); adapters in [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md). Syllabus Part A rule *Timeless and full-spectrum coverage* is the agent guardrail across Deep-Dives.

---

## Rule for beginners

```text
1. Own Flow / Feedback / Learning ([10](./10_Core_Principles_Three_Ways_CALMS.md))
2. Own a real delivery loop ([13](./13_Continuous_Everything.md), CiCd)
3. Add new levers on that loop — with golden paths and guardrails
```

If assistants, GitOps, or an IDP arrive before CI, tests, and ownership, you get **faster chaos**.

---

## Durable mindsets (how we think)

### 1. Platform as product (not ticket ops)

- An internal platform is a **product**; developers are its **customers**  
- Prefer **golden paths** (paved roads) over endless one-off tickets  
- Measure **DevEx** (friction, time-to-productive, satisfaction) beside DORA  

→ [16](./16_Roles_Teams_And_Platforms.md) · [Cloud-Native/](../Cloud-Native/README.md) · [DORA — platform engineering](https://dora.dev/capabilities/platform-engineering/)

### 2. Assisted delivery (humans + machines, policy first)

Whether the assistant is a script, a bot, or a model, the durable capabilities are the same (DORA AI Capabilities Model — applicable beyond any one product):

| Durable capability | Beginner meaning |
|--------------------|------------------|
| Clear automation / AI stance | What is allowed, reviewed, and forbidden |
| Healthy data ecosystem | Quality, governed inputs for tools and ops |
| Accessible internal context | Docs/code/runbooks available *safely* to assistants |
| Strong version control | Small commits; easy rollback when generated change is wrong |
| Small batches | No unreviewable mega-changes |
| User-centric focus | Speed must still serve users |
| Quality internal platform | Paved road so speed cannot skip tests/security |

→ Still measure with [5](./5_DORA_And_Delivery_Metrics.md). A coding assistant alone is not DevOps.

### 3. Governed autonomy (automation with brakes)

Whenever software acts on infrastructure or production, keep four durable controls:

| Control | Meaning |
|---------|---------|
| **Golden paths** | The default safe way to do the thing |
| **Guardrails** | Policy that blocks unsafe actions |
| **Safety nets** | Detect and mitigate when something still goes wrong |
| **Manual review** | Humans for high-blast-radius change |

Suggest-first automation is fine; auto-act only inside these controls ([3](./3_Team_Patterns_SRE_Incident.md), [12](./12_Agile_Lean_ITSM_And_DevOps.md)).

### 4. DevEx as a first-class outcome

Delivery metrics can look fine while people drown in toil. Treat developer experience as real signal (surveys, friction, SPACE) and fix the **system** — especially when assistants increase change volume and review load.

### 5. Provenance and policy-as-code

Durable need: **prove what you shipped** and **encode rules as code**, not only wiki text.

→ [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md), [Security/](../Security/README.md), [14](./14_DevSecOps_Mindset.md)

### 6. Cost and stewardship (FinOps → sustainability)

Wasteful infra burns money and often energy. Rightsizing, scheduling, and teardown are durable levers — [8](./8_FinOps_Literacy.md). Sustainability is the same stewardship mindset with a wider scoreboard.

### 7. Desired-state operations (GitOps mindset)

**Desired state in version control**, reconcile toward it, audit the trail, roll back by reverting state. Controllers and targets change; the model stays.

→ [2](./2_Practices_And_Workflows.md) · [CiCd/](../CiCd/README.md)

### 8. Progressive delivery as risk control

Separate deploy from release; limit blast radius (flags, canaries, analysis). More change volume makes this *more* important, not less.

→ [2](./2_Practices_And_Workflows.md), [CiCd/3](../CiCd/3_Deployment_Strategies.md)

### 9. Manage the value stream, not only a team silo

Continuously manage flow and value ([18](./18_Value_Stream_Management.md)); organize with stream-aligned and platform teams ([16](./16_Roles_Teams_And_Platforms.md)).

---

## Evolving toolsets (examples — replace rows as the industry moves)

Learn the **mindset column** first. Treat the **examples** as current illustrations, not forever brands.

| Job (durable) | Example tools / themes (evolve) | Where to go deep |
|---------------|----------------------------------|------------------|
| Internal platform / catalog | Developer portals (e.g. Backstage-class) | [Cloud-Native/](../Cloud-Native/README.md) |
| Desired-state reconcile | GitOps controllers (e.g. Argo CD, Flux-class) | [CiCd/](../CiCd/README.md) |
| Policy-as-code | OPA / Kyverno / Checkov-class | [Security/](../Security/README.md) |
| Artifact provenance | SBOM, signing (e.g. cosign / Sigstore-class) | [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md) |
| Progressive release | Feature-flag platforms | [CiCd/](../CiCd/README.md), [2](./2_Practices_And_Workflows.md) |
| Deep telemetry | OpenTelemetry-class pipelines | [Observability/](../Observability/README.md) |
| Assisted coding | IDE / chat assistants | Stance in this file; Tooling `Data-ML/` when needed |
| Assisted operations | Alert correlation / IR assistants | [Observability/](../Observability/README.md) + [3](./3_Team_Patterns_SRE_Incident.md) |
| Agent–tool protocols | Standards for tool-using agents | Adopt when your platform needs them — DS-AI / Tooling Specs |
| Runtime insight | eBPF-class telemetry | Networks / Containerization — after Linux + CI basics |
| Alternate runtimes | WASM / edge runtimes | Cloud-Native survey when the job appears |
| Identity for machines | Secrets managers, OIDC federation | [Security/](../Security/README.md), [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md) |

When you replace a tool, update the example cell — **do not rewrite the mindset**.

---

## How this plugs into the Three Ways

| Way | Durable boost | Failure mode |
|-----|---------------|--------------|
| **Flow** | Golden paths, desired-state sync, assisted drafts | Mega-changes; platform as ticket hell |
| **Feedback** | Unified telemetry, correlated signals, canary analysis | Noise; unsupervised auto-remediation |
| **Learning** | Game days; assisted drafts of postmortems *reviewed by humans* | Skipping learning; no automation policy |

---

## Adoption checklist (copy)

- [ ] Foundation solid: CI green, trunk habits, basic observability, shared ownership  
- [ ] Written stance for assistants / automation (what stays human-reviewed)  
- [ ] New lever sits on a **golden path** with tests + security gates  
- [ ] Rollback / blast radius defined before autonomy in prod  
- [ ] DORA (+ DevEx signal) measured before and after  
- [ ] One owner for the capability — not “everyone’s side project”  

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Equating “AI DevOps” with chat-written YAML | Assistants + platform + CI/CD + policy |
| Buying a portal with no product owner | Platform as product ([16](./16_Roles_Teams_And_Platforms.md)) |
| Desired-state sync without secrets hygiene | Externalize secrets; policy |
| Chasing exotic runtimes before Linux + CI | Prerequisites in [0](./0_SE_Learning_DevOps_Start_Here.md) |

## Next on the staircase

- Hand-off to implementation: [CiCd staircase](../CiCd/README.md) → [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)  
- If you skipped Floor 5: [9](./9_Maintenance_And_Legacy.md) → [20](./20_Delivery_Reality_Full_Spectrum.md) first  
- Platform depth: [Cloud-Native/](../Cloud-Native/README.md)  

## Further reading

- [DORA — Platform engineering](https://dora.dev/capabilities/platform-engineering/)  
- [DORA AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model)  
- [Three Ways](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/)  
- [dora.dev/capabilities](https://dora.dev/capabilities/) — refresh tool examples against this catalog over time  
