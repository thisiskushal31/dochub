# If you are a software engineer learning DevOps — start here

[← Back to Methodologies](./README.md)

This handbook is how software is **delivered**. You do not need to be a “DevOps engineer” title to use it. If you ship code — backend, frontend, fullstack, or platform — this room is for you.

---

## Two promises

1. **Learn it here** when the topic is delivery, platforms, OS literacy, or languages-as-tools.  
2. **Get a clear door** to a sister deep-dive when depth lives elsewhere — never a silent gap (“we assumed you already know Docker/networking”).

If a chapter is short on purpose, it says where to go next.

---

## What this repo owns vs what it points to

| Need | Start here | Deeper elsewhere |
|------|------------|------------------|
| Culture, branching, on-call, DORA, FinOps | [Methodologies/](./README.md) (this folder) | — |
| Build → test → deploy → verify | [CiCd/](../CiCd/README.md) | — |
| Terraform / Pulumi / state | [IAC/](../IAC/README.md) | — |
| Metrics, logs, traces, paging | [Observability/](../Observability/README.md) | — |
| Pipeline secrets, SAST/DAST gates | [Security/](../Security/README.md) | Full cyber program → [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) |
| nginx / host deploy | [Servers/](../Servers/README.md) | — |
| AWS / GCP / Azure literacy | [Cloud/](../Cloud/README.md) | — |
| What Docker / K8s *are* | Short doors in README + Cloud-Native | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) |
| TCP / DNS / TLS on the wire | Short doors | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| SQL vs Redis vs object store *choice* | Short doors | [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) · [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) |
| Spring / FastAPI / React | Not here | [Tooling-and-Frameworks-Deep-Dive](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive) |
| Language syntax (Python, Go, Shell, …) | [Languages/](../Languages/README.md) | — |
| Git / Make | Not here | Tooling `Utility/` |
| Commands you forget | — | [Commands-and-Cheatsheets](https://github.com/thisiskushal31/Commands-and-Cheatsheets) |

Root map: [handbook README — Where to go deeper](../README.md#where-to-go-deeper).

---

## Beginner learning order (fact-checked foundations first)

Do **not** start with a random tool tutorial. Industry Foundation courses and *The DevOps Handbook* teach principles before pipelines.

1. [10 — Three Ways, CALMS, constraints](./10_Core_Principles_Three_Ways_CALMS.md) — what DevOps actually is  
2. [12 — Agile, Lean, ITSM](./12_Agile_Lean_ITSM_And_DevOps.md) — how the frameworks fit (no tribe wars)  
3. [13 — CI vs CD vs continuous deployment](./13_Continuous_Everything.md) + [17 — toolchain stages](./17_Toolchain_Stages.md)  
4. [11 — Value streams and lean flow](./11_Value_Streams_And_Lean_Flow.md) · [18 — Value Stream Management](./18_Value_Stream_Management.md)  
5. [14 — DevSecOps mindset](./14_DevSecOps_Mindset.md)  
6. [1 Culture](./1_DevOps_Culture_And_Collaboration.md) → [2 Practices](./2_Practices_And_Workflows.md) → [4 Branching](./4_Branching_And_PR_Practices.md)  
7. [16 — Roles / teams / platforms](./16_Roles_Teams_And_Platforms.md) (so titles do not confuse you)  
8. [19 — Durable mindsets & evolving toolsets](./19_Durable_Mindsets_And_Evolving_Toolsets.md) — platform, assisted delivery, GitOps mindset, DevEx (after foundations)  
9. [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md) — then Security gates, IAC, Observability  
10. [5 DORA metrics](./5_DORA_And_Delivery_Metrics.md) + [15 capabilities map](./15_DORA_Capabilities_Map.md) when you can measure a real team  

### Prerequisites (skills under the mindset)

Most serious beginner roadmaps (and this handbook’s structure) expect you to grow these **in parallel**, not instead of principles:

| Skill | Where in this ecosystem |
|-------|-------------------------|
| Linux / OS literacy | [Operating-Systems/](../Operating-Systems/README.md) |
| Networking basics | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Git | Tooling `Utility/` (not duplicated here) |
| Scripting | [Languages/](../Languages/README.md) (Shell, Python, …) |

Primary sources to trust: [Three Ways (IT Revolution)](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/), [DORA capabilities](https://dora.dev/capabilities/), [DORA metrics guide](https://dora.dev/guides/dora-metrics/), [Microsoft Learn — What is DevOps?](https://learn.microsoft.com/en-us/devops/what-is-devops), [Red Hat — DevSecOps](https://www.redhat.com/en/topics/devops/what-is-devsecops). Treat random blogs as secondary.

---

## Paths by role (pick one in under 5 minutes)

### Backend / fullstack SE who wants to ship safely

1. This file → beginner order above (at least **10 → 13 → 1 → 4**)  
2. [4_Branching_And_PR](./4_Branching_And_PR_Practices.md) → [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)  
3. [Security/4 gate chain](../Security/4_Security_Gate_Chain.md)  
4. Enough [IAC/1](../IAC/1_IAC_Tools_And_Patterns.md) to review Terraform PRs  
5. [Observability/1](../Observability/1_Monitoring_And_Metrics.md) so “it works on my laptop” is not the bar  

Containers: operate literacy here; depth in Containerization when you own clusters.

### Frontend SE

1. Beginner order in this file (**10 → 13** at minimum)  
2. Branching + CI for web apps ([4](./4_Branching_And_PR_Practices.md), [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md))  
3. Env/config, preview deploys, CDN/static doors (README + System Design)  
4. Observability of UX-impacting failures (errors, RUM pointers)  
5. Frameworks → [Tooling Web-Frontend](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive)

Skip kernel deep-dives until you need them.

### Platform / DevOps / SRE-leaning

1. Full beginner order (10 → 13 → culture/practices) + whole Methodologies folder  
2. CiCd `1–7` → Security gates → IAC `1–3` → Observability `1–3`  
3. [Cloud/](../Cloud/README.md) + [Cloud-Native/](../Cloud-Native/README.md)  
4. [Operating-Systems/](../Operating-Systems/README.md) when debugging hosts  
5. Sister repos when the wire, cluster, or data plane is the job  

### “I only need OS / a language”

Go straight to [Operating-Systems/](../Operating-Systems/README.md) or [Languages/](../Languages/README.md). Come back here when you own a pipeline — start at [10](./10_Core_Principles_Three_Ways_CALMS.md), not at a random tool.

---

## Delivery mental model (the loop)

```text
Idea / ticket
  → branch / PR          (Methodologies/4)
  → build + test         (CiCd)
  → security gates       (Security/)
  → immutable artifact   (CiCd/4)
  → provision / config   (IAC + Automation + OS)
  → deploy + strategy    (CiCd/3)
  → verify + observe     (CiCd/5 + Observability)
  → notify / on-call     (Methodologies/3, /6)
  → bad path: rollback + incident + postmortem
  → day-2: patch, cost, improve gates (FinOps, maintenance)
```

You will fill each box in this handbook. Do not memorize tools first — own the loop, then attach tools.

---

## Monthly learning checklist (copy)

- [ ] Read or deepen one Methodologies topic  
- [ ] Trace one real PR from branch → prod (or staging) against the loop above  
- [ ] Add or fix one pipeline gate / alert / runbook you actually use  
- [ ] Tick the matching row in your private syllabus when a note becomes defendable  
- [ ] After push: `npm run update-repos` in `dochub/` if the public site should refresh  

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Learning only kubectl/Terraform with no delivery loop | Start from CiCd + Methodologies, then tools |
| Duplicating Docker books inside this repo | Link Containerization; keep operator literacy here |
| Treating handbook Security/ as AppSec career | Pipeline gates here; program in Security-Deep-Dive |
| Skipping culture because “tools are enough” | Broken ownership shows up as failed deploys and blame |

---

## Next

- Culture: [1_DevOps_Culture_And_Collaboration.md](./1_DevOps_Culture_And_Collaboration.md)  
- Or jump to delivery: [CiCd/1_Pipelines_Build_Test_Deploy.md](../CiCd/1_Pipelines_Build_Test_Deploy.md)

## Further reading

- [DevOps Handbook (Kim et al.)](https://itrevolution.com/product/the-devops-handbook/) — culture and flow (book; concepts, not a vendor guide)  
- Root [README](../README.md) — structure and sister-repo table  
