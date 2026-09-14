# Delivery spectrum: legacy through modern (and assisted)

[← Back to CI/CD](./README.md)

DevOps delivery is not only “GitHub Actions → Kubernetes.” Fintech still runs **COBOL** batch; enterprises still promote through **change windows**; startups ship **static sites** and **MIGs**; platforms run **GitOps**; teams add **assisted** (script/bot/model) steps under policy.

This chapter is the **coverage map** so nothing in that spectrum is “out of scope” for CiCd. Mindset companion: [Methodologies/19](../Methodologies/19_Durable_Mindsets_And_Evolving_Toolsets.md). Legacy ops posture: [Methodologies/9](../Methodologies/9_Maintenance_And_Legacy.md).

**Syllabus guardrail (agents):** `thisiskushal31/plans/SOFTWARE_ENGINEERING_SYLLABUS.md` → Part A → rule **Timeless and full-spectrum coverage**. This file is the CiCd implementation of that rule.

---

## How to read “timeless” here

| Kind of note | What we write |
|--------------|----------------|
| **Durable job** | Build, test, artifact, promote, verify, rollback — always |
| **Mechanism family** | SSH/package, VM image/MIG, container/orchestrator, static/CDN, mainframe promote, assisted coding in CI |
| **Named tool / API** | Example only; link official docs; expect rename |
| **Version / generation gate** | When a practice assumes a capability (e.g. OIDC federation in CI, Rollout CRDs), say what must exist — like Languages/Python noting “`match` from 3.10+” |

Do **not** frame chapters as “only the current year stack.” Do **not** skip COBOL-era or VM-era paths because they are unfashionable.

---

## Spectrum of deploy targets

```text
Mainframe / proprietary promote
  → bare metal / classic VM + SSH/package + Jenkins Poll SCM
  → VM fleet / MIG / ASG + LB
  → Docker Compose multi-tier → Swarm rolling
  → orchestrated containers (K8s) + GitOps + progressive delivery
  → serverless / platform apps
  → static site + object storage + CDN
  → model train/serve (single-node or distributed) + app that calls models
  → edge / multi-region variants of the above
```

| Target | CiCd home | Related depth |
|--------|-----------|--------------|
| Static + CDN | [17](./17_Static_Sites_And_CDN_Deploy.md) | Servers, Networks |
| VM / MIG / host fleet | [18](./18_VM_MIG_And_Host_Based_Deploy.md) | Automation, Cloud, Servers |
| Classical Jenkins + web/app servers | [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md) | Jenkins/, Servers, Shell |
| Compose / Swarm | [21](./21_Compose_And_Swarm_Delivery.md) | Containerization |
| K8s + progressive delivery | [3](./3_Deployment_Strategies.md), [9](./9_Progressive_Delivery_Controllers.md), Argo/Flux | Containerization |
| MLOps / AI systems | [22](./22_MLOps_And_AI_System_Delivery.md) | DS-AI, DE |
| Classical stack checklist | [23](./23_Classical_DevOps_Stack_Map.md) | — |
| Pipeline security / OIDC | [15](./15_Pipeline_Security_And_Gates.md), [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md) | Security-Deep-Dive |
| Legacy languages & VCS | [Methodologies/9](../Methodologies/9_Maintenance_And_Legacy.md) | [Languages/](../Languages/README.md) |

---

## Legacy delivery (still in production)

| Reality | DevOps move |
|---------|-------------|
| **COBOL / mainframe** batch and CICS-style apps | Automate export/build where allowed; respect **system-of-record** promote (ChangeMan and kin); CI around interfaces; strangler for replacement ([Methodologies/9](../Methodologies/9_Maintenance_And_Legacy.md)) |
| **CVS / SVN** | Bridge or migrate; do not pretend Git workflows exist if the SoR is elsewhere |
| **FTP / manual copy** | Wrap in a **scripted pipeline step** with checksum + ticket ID; then replace with artifact store |
| **Snowflake servers** | Inventory → golden image / config management → MIG; stop unique pets |
| **Change advisory + freeze windows** | Continuous **Delivery** (always releasable) with scheduled **release**; DORA still applies inside constraints |

Humble/Farley deployment pipeline still holds: every change is a candidate; confidence grows through stages — even if a stage is “mainframe promote job.”

---

## Classic through cloud VM (non-legacy but non-K8s)

Covered in depth in [18](./18_VM_MIG_And_Host_Based_Deploy.md): packages, symlink releases, immutable images, MIG/`maxSurge`/`maxUnavailable`, blue-green pools, ASG refresh.

This is **normal** production for many orgs — treat it as first-class, not a footnote.

---

## Container and GitOps (modern baseline for many teams)

[1](./1_Pipelines_Build_Test_Deploy.md)–[16](./16_Notifications_Webhooks_And_ChatOps.md), tool folders. Same loop; different deploy adapter.

---

## Static and edge

[17](./17_Static_Sites_And_CDN_Deploy.md). Frontend engineers shipping marketing sites, docs, and SPAs need this path as much as API engineers need MIG/K8s.

---

## Assisted delivery (AI-era tooling on the same loop)

Assistants (codegen, bot PRs, policy-bound agents) **amplify** the pipeline — they do not replace it ([Methodologies/19](../Methodologies/19_Durable_Mindsets_And_Evolving_Toolsets.md), DORA AI Capabilities Model).

| Durable rule | Practice |
|--------------|----------|
| Small batches | No unreviewable mega-diffs from generators |
| Strong version control | Easy revert of assisted commits |
| Gates still run | Tests, SAST/SCA, sign, verify — [15](./15_Pipeline_Security_And_Gates.md) |
| Human accountability | Who merges and who owns prod remains clear |
| Policy first | What assistants may touch (docs vs prod IAM) is explicit |

ML **model** training/serving pipelines have additional homes ([Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive), DE feature tables). **Application** CI/CD that happens to use models still uses this CiCd folder for ship/verify.

---

## One loop, many adapters

```text
                    ┌─ static/CDN publish ─────────────── [17]
commit → CI verify ─┼─ VM/MIG/template roll ───────────── [18]
         + artifact ┼─ K8s GitOps / Rollouts ──────────── [9]
                    ├─ mainframe/SoR promote (wrapped) ── [Methodologies/9]
                    └─ assisted PR → same gates ───────── [19]+[15]
```

If you only document the K8s adapter, you have not finished CiCd for this handbook.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “Real DevOps is only K8s” | Match the target; keep the loop |
| Ignoring COBOL/VCS SoR | Automate *around* regulated promote |
| AI commits bypassing CI | Same required checks as human PRs |
| Rewriting notes every fashion cycle | Durable jobs + version gates + tool examples |

## Next

- Pick your target: [17](./17_Static_Sites_And_CDN_Deploy.md) or [18](./18_VM_MIG_And_Host_Based_Deploy.md)  
- Or harden the shared loop: [1](./1_Pipelines_Build_Test_Deploy.md)

## Further reading

- *Continuous Delivery* (Humble, Farley) — pipeline pattern across environments  
- [DORA AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model)  
- [Methodologies/19](../Methodologies/19_Durable_Mindsets_And_Evolving_Toolsets.md)  
