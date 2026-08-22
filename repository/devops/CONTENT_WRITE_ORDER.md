# DevOps Handbook — content write order

**Created:** August 2026  
**Purpose:** Single map of every stub folder/file and what to fill. Work top-to-bottom; do not re-derive the plan later.

**Status key:** `stub` = placeholder exists · `folder` = structure only · `expand` = existing TBD file to flesh out

---

## Lane A (recommended)

| Step | Location | Action |
|------|----------|--------|
| 1 | [Methodologies/0_SE_Learning_DevOps_Start_Here.md](./Methodologies/0_SE_Learning_DevOps_Start_Here.md) | SE on-ramp + links to sister repos |
| 2 | [Methodologies/](./Methodologies/README.md) topics 1–8 | Culture → branching → SRE/on-call → DORA → ChatOps → docs → FinOps |
| 3 | [CiCd/1–7](./CiCd/README.md) | Full delivery loop + artifacts + supply chain + verify |
| 4 | [Security/](./Security/README.md) concepts + gate chain + tool folders | DevSecOps scanners and secrets |
| 5 | [Servers/](./Servers/README.md) | Web servers + host deploy |
| 6 | [Cloud/](./Cloud/README.md) | AWS/GCP/Azure literacy (not cert dumps) |
| 7 | [Entry-Points/](./Entry-Points/README.md) | Thin doors → sister deep-dives |
| 8 | [Cloud-Native/4_CNCF_Everyday_Tools.md](./Cloud-Native/4_CNCF_Everyday_Tools.md) + tool stubs | cert-manager, ExternalDNS, Backstage |
| 9 | [IAC/](./IAC/README.md) OpenTofu + Packer stubs | Terraform-adjacent tooling |
| 10 | [Observability/Loki/](./Observability/Loki/README.md) + on-call refs | Logs + link Methodologies on-call |

**Defer:** `Languages/` (mature), deep per-tool prose in every CiCd vendor folder until concepts exist.

---

## New top-level sections

| Folder | README | Role |
|--------|--------|------|
| [Servers/](./Servers/) | Yes | nginx, Apache, Caddy, Traefik, HAProxy, IIS, host lifecycle |
| [Cloud/](./Cloud/) | Yes | Multi-cloud literacy for SEs doing DevOps |
| [Entry-Points/](./Entry-Points/) | Yes | ENTRY+link pages (Docker, data, DNS, local dev) |

**Not a new folder here:** Application frameworks → [Tooling-and-Frameworks-Deep-Dive](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive).

---

## Sister repos (link from Entry-Points + root README)

| Repo | Entry file |
|------|------------|
| Containerization-Deep-Dive | [Entry-Points/Docker_And_Podman.md](./Entry-Points/Docker_And_Podman.md) |
| Networks-Deep-Dive | [Entry-Points/DNS_CDN_And_Load_Balancers.md](./Entry-Points/DNS_CDN_And_Load_Balancers.md) |
| Databases-Deep-Dive | [Entry-Points/Data_Messaging_And_Cache.md](./Entry-Points/Data_Messaging_And_Cache.md) |
| System-Design-Concepts | Entry-Points + Methodologies |
| Tooling-and-Frameworks-Deep-Dive | [Entry-Points/Application_Frameworks.md](./Entry-Points/Application_Frameworks.md) |
| Security-Deep-Dive | [Entry-Points/Cybersecurity_Deep_Dive.md](./Entry-Points/Cybersecurity_Deep_Dive.md) |
| Data-Engineering / Data-Science-AI | Mention in SE on-ramp only |

---

## Completeness contract

Full gap matrix: [PLAN_DevOps_Concepts_Beyond_Languages.md](./PLAN_DevOps_Concepts_Beyond_Languages.md)

Mark a stub **done** when: standalone prose, image or diagram if useful, copy-paste example, sister-repo link if depth lives elsewhere, pitfalls/trade-offs section.
