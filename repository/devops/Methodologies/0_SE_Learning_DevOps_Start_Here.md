# If you are a software engineer learning DevOps — start here

[← Back to Methodologies](./README.md)

**Staircase Floor 0.** This handbook teaches how software is **delivered**. You do not need a “DevOps” title. If you ship code, this room is for you.

Climb the **Methodologies staircase** first (mindset), then the **[CiCd staircase](../CiCd/README.md)** (how to ship). One story, two flights — not scattered blog posts.

---

## Two promises

1. **Learn it here** when the topic is delivery, platforms, OS literacy, or languages-as-tools.  
2. **Get a clear door** to a related deep-dive when depth lives elsewhere — never a silent gap.

---

## The climb in one page

```text
Floor 0  You are here — orient
Floor 1  What DevOps is          →  10 → 12
Floor 2  Flow & vocabulary       →  13 → 17 → 11 → 18 → 14
Floor 3  People & habits         →  1 → 2 → 4 → 16
Floor 4  Operate & measure       →  3 → 6 → 7 → 5 → 15 → 8
Floor 5  Every estate            →  9 → 20   (legacy through AI — required)
Floor 6  Amplifiers              →  19       (after foundations)
         Hand-off                →  CiCd staircase
```

Full table: [Methodologies README — The staircase](./README.md).

---

## What this repo owns vs what it points to

| Need | Start here | Deeper elsewhere |
|------|------------|------------------|
| Culture, branching, on-call, DORA, FinOps, legacy posture | [Methodologies/](./README.md) | — |
| Build → test → deploy → verify (all targets) | [CiCd/](../CiCd/README.md) | — |
| Terraform / Pulumi / state | [IAC/](../IAC/README.md) | — |
| Metrics, logs, traces, paging | [Observability/](../Observability/README.md) | — |
| Pipeline secrets, SAST/DAST gates | [Security/](../Security/README.md) | [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) |
| nginx / host deploy | [Servers/](../Servers/README.md) | — |
| AWS / GCP / Azure literacy | [Cloud/](../Cloud/README.md) | — |
| What Docker / K8s *are* | Cloud-Native doors | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) |
| TCP / DNS / TLS on the wire | Short doors | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Data stores / design choice | Short doors | [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) · [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) |
| App frameworks | Not here | [Tooling-and-Frameworks](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive) |
| Language syntax | [Languages/](../Languages/README.md) | — |
| Git / Make | Tooling `Utility/` | — |

---

## Prerequisites (grow in parallel)

| Skill | Where |
|-------|--------|
| Linux / OS literacy | [Operating-Systems/](../Operating-Systems/README.md) |
| Networking basics | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Git | Tooling `Utility/` |
| Scripting | [Languages/](../Languages/README.md) (Shell, Python, …) |

---

## Paths by role (same staircase, different depth)

### Backend / fullstack

Floors 1–3 at minimum → [CiCd Floor 1–3](../CiCd/README.md) → Security gates → enough IAC to review → Observability basics. Include Floor 5 if you touch brownfield (you will).

### Frontend

Floors 1–2 + branching → CiCd loop + [static/CDN](../CiCd/17_Static_Sites_And_CDN_Deploy.md). Skip kernel until needed.

### Platform / SRE-leaning

Full Methodologies staircase → full CiCd staircase (including classical + K8s + MLOps adapters) → Cloud / Cloud-Native / OS as needed.

### “I only need OS / a language”

[Operating-Systems/](../Operating-Systems/README.md) or [Languages/](../Languages/README.md), then return at Floor 1 ([10](./10_Core_Principles_Three_Ways_CALMS.md)).

---

## Delivery mental model (the loop)

```text
Idea / ticket
  → branch / PR          (Methodologies/4)
  → build + test         (CiCd)
  → security gates       (Security/)
  → immutable artifact   (CiCd/4)
  → provision / config   (IAC + Automation + OS)
  → deploy + strategy    (CiCd — target adapter)
  → verify + observe     (CiCd/5 + Observability)
  → notify / on-call     (Methodologies/3, /6)
  → bad path: rollback + incident + postmortem
  → day-2: patch, cost, improve (FinOps, maintenance)
```

Own the loop, then attach tools. Estate does not change the questions — only the adapter ([20](./20_Delivery_Reality_Full_Spectrum.md)).

---

## Monthly checklist

- [ ] Climb or deepen one Methodologies floor  
- [ ] Trace one real change from branch → prod against the loop  
- [ ] Add or fix one gate / alert / runbook you use  
- [ ] Tick syllabus when a note is defendable  
- [ ] After push: `npm run update-repos` in `dochub/` if the public site should refresh  

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Random tool tutorials first | Staircase Floor 1 → then CiCd |
| Skipping Floor 5 (legacy/spectrum) | Most value is brownfield |
| Amplifiers before foundations | Floor 6 only after 1–5 |
| Fragments from the internet only | Consolidate here; then go deeper via doors |

---

## Next on the staircase

**Floor 1:** [10_Core_Principles_Three_Ways_CALMS.md](./10_Core_Principles_Three_Ways_CALMS.md)

## Further reading

- [DevOps Handbook (Kim et al.)](https://itrevolution.com/product/the-devops-handbook/)  
- [Three Ways](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/) · [DORA](https://dora.dev/)  
- Root [README](../README.md)  
