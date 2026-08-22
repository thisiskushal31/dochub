# Plan: DevOps concepts beyond Languages

[← Back to handbook](./README.md)

**Status:** Planning only — content bodies for the gaps below are **not** started yet.  
**Purpose:** Resume later without re-deriving the map. This file is also the **completeness contract** for software engineers reading DevOps.

---

## Promise to software engineers (frontend / backend / fullstack / platform)

Anyone who ships software and wants to learn **DevOps** should be able to open **this handbook** and either:

1. **Learn it here** (concepts + tools at DevOps depth), or  
2. **See a clear entry here** (what it is, why DevOps cares, day-to-day use) **plus a link** to a sister deep-dive when depth lives elsewhere.

They should **not** discover months later that “networking / Docker / databases / system design” were silently assumed and never pointed to.

| Reader | What this plan guarantees |
|--------|---------------------------|
| **Backend / fullstack SE** | Delivery path, servers, CI/CD security, IaC/automation literacy, and links for data stores, queues, design |
| **Frontend SE** | Frameworks literacy (planned), static/CDN/edge doors, CI for web apps, env/config, observability of UX-impacting failures |
| **Platform / DevOps-leaning SE** | Full toolchain map below; OS + Cloud-Native + Observability + Security as first-class |
| **Any SE new to ops** | Day-to-day practice catalog + “where do I go next?” links—no orphan topics |

**Rule when writing later:** every major SE-facing DevOps topic gets either a **chapter/folder here** or an **entry chapter** (short) that links out. Prefer entry+link over duplicating a deep-dive.

---

## Sister deep-dives (already exist — link, don’t rebuild)

Use **GitHub repo URLs** in public handbook content (same rule as root README).

| Domain | Repository | SE should use it for |
|--------|------------|----------------------|
| **Networking** | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) | TCP/HTTP, DNS deep, routing, firewalls, cloud-native net, net security |
| **Containers & orchestration depth** | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) | Docker/Podman, Swarm, OpenShift, managed K8s (GKE/EKS/AKS) depth |
| **Databases & object storage** | [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) | SQL/NoSQL/cache/search/vector; **S3/GCS-style object stores** |
| **System design** | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) | LB, CDN, API gateway, caching, messaging, HA/DR, patterns |
| **Commands cheat sheets** | [Commands-and-Cheatsheets](https://github.com/thisiskushal31/Commands-and-Cheatsheets) | Quick command lookup (incl. DevOps-And-Cloud-Essentials) |
| **DSA** | [Datastructures-and-Algorithms](https://github.com/thisiskushal31/Datastructures-and-Algorithms) | Interview/algos—**not** required for DevOps path; optional door only |

---

## Completeness map — day-to-day DevOps for SEs

Status key:

| Status | Meaning |
|--------|---------|
| **HERE-deep** | Handbook section exists or is the right deep home (may still be stub/TBD prose) |
| **HERE-plan** | Explicitly committed in this plan (build when work resumes) |
| **ENTRY+link** | Add/keep a **short DevOps entry** here; depth in sister repo or official docs |
| **GAP** | Missing from plan until now — **must add** entry or folder so SEs aren’t blind |

### A. Culture, process, collaboration

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| DevOps culture, blameless, learning | Rituals, reviews | **HERE-deep** (thin) | `Methodologies/` |
| Branching / PR / trunk vs GitFlow | GitHub/GitLab/Bitbucket | **HERE-plan** | `Methodologies/` |
| Agile / shift-left | Ceremony vs delivery | **HERE-deep** (named in stubs) | `Methodologies/` |
| ChatOps / Slack-Teams notifications | Slack, Teams | **HERE-plan** | `Methodologies/` / `CiCd/` |
| Incident / on-call | PagerDuty, Opsgenie, Grafana OnCall | **HERE-deep** (SRE stub) + **GAP** tool literacy | `Methodologies/3` + optional `Observability/` or Security ops entry |
| DORA / delivery metrics literacy | Deploy freq, lead time, CFR, MTTR | **HERE-plan** | `Methodologies/` |
| Docs as code / runbooks | Markdown, Notion/Git | **ENTRY+link** | Short entry in Methodologies; don’t fork wiki products |

### B. Source → build → test → release (CI/CD)

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| CI platforms | GitHub Actions, GitLab CI, Jenkins, CircleCI, Tekton | **HERE-deep** (folders) | `CiCd/` |
| Also-ran CI (entry) | Azure DevOps Pipelines, Bitbucket Pipelines, Buildkite | **GAP → ENTRY+link** | `CiCd/2` index expansion |
| CD / GitOps | Argo CD, Flux | **HERE-deep** | `CiCd/` |
| Progressive delivery | Argo Rollouts, flags | **HERE-plan** (strategies) | `CiCd/3` + entry for Rollouts |
| Full path test→deploy→verify | Environments, promotion, approvals | **HERE-plan** | `CiCd/` + `Methodologies/` |
| Artifact registries | GHCR, ECR, GCR/AR, Harbor, Artifactory, Nexus | **GAP → HERE-plan** (concepts + 1–2 tools) | New under `CiCd/` or `Servers/` adjacent — **artifact management chapter** |
| Package registries | npm, PyPI, Maven, Go proxy | **ENTRY+link** | Languages tracks + short CiCd entry |
| Supply chain (SBOM, sign, provenance) | Syft/Grype, cosign/Sigstore, SLSA literacy | **GAP → HERE-plan** | `CiCd/` + `Security/` |
| Feature flags | LaunchDarkly, Unleash, OpenFeature, custom | **HERE-plan** (practice) + **GAP** tool entry | `CiCd/3` / Methodologies |

### C. Pipeline security (AppSec in delivery)

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| SAST / quality | SonarQube, Semgrep, CodeQL | **HERE-plan** | `Security/` + `CiCd/` gates |
| SCA / deps | Snyk, Trivy, Dependabot/Renovate | **HERE-deep** / plan | `Security/` |
| Secrets in git | gitleaks, platform secret scanning | **HERE-plan** | `Security/` + CiCd |
| Secrets at rest | Vault | **HERE-deep** | `Security/Vault` |
| IaC / policy scan | Checkov, OPA, Kyverno (K8s policy) | **HERE-deep** + **GAP** Kyverno entry | `Security/` / Cloud-Native |
| Image scan | Trivy, Snyk Container | **HERE-deep** | `Security/` |
| DAST | OWASP ZAP | **HERE-plan** | `Security/ZAP` |
| WAF | Cloud/vendor WAF | **HERE-plan** | `Security/` |
| IAM / least privilege (DevOps angle) | Cloud IAM, OIDC to cloud from CI | **HERE-deep** (stub) + **GAP** OIDC-CI entry | `Security/1` + CiCd |

### D. Infrastructure, cloud, IaC, automation

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| IaC | Terraform, Pulumi, CloudFormation, Crossplane | **HERE-deep** | `IAC/` |
| OpenTofu | Terraform-compatible fork | **GAP → ENTRY+link** | Under `IAC/Terraform` or short entry |
| Config management / deploy automation | Ansible, Chef, Puppet | **HERE-deep** (scaffold) | `Automation/` + `IAC/` |
| Image baking | Packer | **GAP → ENTRY+link** | `IAC/` or `Servers/` |
| Cloud providers (SE literacy) | AWS, GCP, Azure — regions, IAM, network, managed K8s | **GAP → HERE-plan** | New **`Cloud/`** entry track *or* strong entries under IAC/Cloud-Native — **not** full cloud cert dumps |
| Cost / FinOps literacy | Rightsizing, idle resources, budgets | **GAP → ENTRY+link** | Methodologies or Cloud entry |
| DNS / CDN / global edge | Route53/Cloud DNS, CloudFront/Cloudflare, Fastly | **ENTRY+link** | Handbook short entry → [System-Design fundamentals](https://github.com/thisiskushal31/System-Design-Concepts) (+ Networks for DNS depth) |
| Load balancers | Cloud LB, HAProxy, nginx LB | **HERE-plan** (Servers) + **ENTRY+link** design | `Servers/` + System-Design |
| API gateways | Kong, AWS API GW, Apigee, … | **ENTRY+link** | System-Design + short DevOps entry (when used in delivery) |

### E. Servers, OS, web tier (classic deploy)

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| Linux / Windows / Unix / macOS | systemd, services, firewall, users | **HERE-deep** | `Operating-Systems/` |
| Host lifecycle + web servers | nginx, Apache httpd, IIS, Caddy, Traefik, HAProxy, Envoy | **HERE-plan** | **New `Servers/`** |
| Deploy automation onto hosts | Ansible roles, CI→SSH/WinRM | **HERE-plan** | `Automation/` ↔ `Servers/` |
| SSH / bastion / SSM | Access patterns | **ENTRY+link** | OS + Security practices |

### F. Containers & Kubernetes

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| Docker / Podman (operator literacy) | Build, run, compose | **ENTRY+link** (must be obvious from handbook) | Thin Cloud-Native or Servers entry → [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) |
| Kubernetes (DevOps angle) | Workloads, services, deploys | **HERE-deep** (scaffold) | `Cloud-Native/Kubernetes` + Containerization for depth |
| Helm | Charts | **HERE-deep** | `Cloud-Native/Helm` |
| Service mesh | Istio, Linkerd | **HERE-deep** | `Cloud-Native/` |
| Managed K8s | EKS/GKE/AKS | **ENTRY+link** | Containerization `managed-services` |
| CNCF starter (cert-manager, ExternalDNS, Gateway) | Everyday cluster add-ons | **HERE-plan** | `Cloud-Native/` |

### G. Observability & reliability

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| Metrics | Prometheus, Grafana, Datadog, New Relic | **HERE-deep** | `Observability/` |
| Logs | Elastic/ELK, Loki (entry if missing) | **HERE-deep** + **GAP** Loki entry if needed | `Observability/` |
| Traces | OpenTelemetry, Jaeger/Tempo literacy | **HERE-deep** (OTel) + **ENTRY** Tempo/Jaeger | `Observability/` |
| SLO/SLI/error budgets | SRE practices | **HERE-deep** (stubs) | Observability + Methodologies |
| Synthetic / smoke after deploy | Scripts, k6, Playwright in CI | **GAP → HERE-plan** | `CiCd/` verify stage |

### H. Data, messaging, caching (SE apps — DevOps must know enough)

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| Datastores ops literacy | Backups, migrations, connection strings, managed DB | **ENTRY+link** | Handbook entry → [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) |
| Object storage | S3/GCS/Azure Blob | **ENTRY+link** | Databases-Deep-Dive `blob-object` |
| Cache / Redis | Session/cache in prod | **ENTRY+link** | Databases + System-Design caching |
| Queues / streams | Kafka, SQS, RabbitMQ | **ENTRY+link** | System-Design messaging (+ lang tracks where relevant) |
| Migrations in CI/CD | Flyway, Liquibase, Rails/Django migrate | **GAP → ENTRY+link** | CiCd + Databases |

### I. Application frameworks (how SEs’ apps meet DevOps)

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| Frontend | React, Next.js, Angular | **HERE-plan** | **New `Frameworks/`** |
| Backend | Spring, Nest, Django, FastAPI, Rails, Laravel, … | **HERE-plan** | `Frameworks/` |
| Language depth | Go, Python, TS, … | **HERE-deep** | `Languages/` (done / mature) |
| Mobile / desktop | Flutter, RN, native | **ENTRY+link** | Languages doors + Frameworks later |

### J. Platform engineering & developer experience

| Topic | Day-to-day tools / ideas | Status | Home |
|-------|--------------------------|--------|------|
| IDP / paved road | Backstage, Port, custom portals | **HERE-deep** (platform stub) + **GAP** Backstage entry | `Cloud-Native/3` |
| Internal templates | Cookiecutter, copier, org skeletons | **ENTRY+link** | Platform / Methodologies |
| Local dev parity | Devcontainers, Tilt, Skaffold, compose | **GAP → ENTRY+link** | Cloud-Native / Containers entry |

### K. Explicitly out of DevOps-handbook deep scope (door only)

| Topic | Where instead |
|-------|----------------|
| LeetCode / DSA grind | Datastructures-and-Algorithms |
| Full UI/UX design systems | Not DevOps |
| Full cloud certification dumps | Thin Cloud literacy + vendor docs |
| Product system-design case studies | System-Design-Concepts `cases/` |

---

## Gaps to schedule (so nothing is “forgotten”)

When work resumes, treat these as **explicit backlog** (entry or folder—not optional fluff):

1. **SE orientation page** in handbook root or Methodologies — “If you are an SE learning DevOps, start here” + matrix link to this plan’s map (or a reader-facing trimmed version).  
2. **Artifact registries** chapter (promote immutable artifacts; don’t rebuild per env).  
3. **Supply-chain literacy** (SBOM, signing/cosign, provenance).  
4. **Cloud provider literacy** track (AWS/GCP/Azure — shared concepts, not three encyclopedias).  
5. **Docker/Podman entry** in handbook that **must** link Containerization-Deep-Dive (today easy to miss).  
6. **Data/messaging/cache DevOps entries** linking Databases + System-Design.  
7. **DNS/CDN/LB/API gateway** short entries linking System-Design (+ Networks where deep).  
8. **On-call tooling** literacy (PagerDuty/Opsgenie/Grafana OnCall).  
9. **FinOps** short entry.  
10. **OpenTofu / Packer / Kyverno / Loki / Backstage / Azure DevOps** as index entries.  
11. **Synthetic/e2e in verify stage** (k6/Playwright-class).  
12. **DB migrations in pipelines** entry.  
13. **Local dev parity** (devcontainers/compose) entry.  
14. Everything already listed earlier: **Frameworks/**, **Servers/**, **SAST/DAST chain**, branching, ChatOps, CNCF starter.

---

## Clarifications (terms)

| Term | Meaning |
|------|---------|
| **WAF** | Web Application Firewall — runtime HTTP filter |
| **SAST / DAST / SCA** | Static / dynamic / composition analysis in the delivery path |
| **OWASP ZAP** | Primary open-source DAST example — **in scope** |
| **ChatOps / Slack** | Notifications + optional approve-from-chat — practice literacy |
| **Web server / reverse proxy** | nginx, Apache httpd, Caddy, IIS, Traefik, … |
| **ENTRY+link** | Enough for an SE to act tomorrow + pointer to depth |

---

## Intent (build list — condensed)

1. CNCF / cloud-native everyday tools  
2. Frameworks (FE/BE literacy)  
3. Quality & security tools (Sonar, WAF, existing scanners)  
4. Full CI/CD practices + **security gate chain**  
5. Full delivery path test→deploy→verify→feedback  
6. ChatOps / visibility  
7. Branching practices  
8. **Servers / web servers / host deploy + OS applied + Automation**  
9. **SE completeness:** entries for anything covered in sister repos; no silent gaps  
10. **New gaps above** (artifacts, supply chain, cloud literacy, Docker entry, data/CDN doors, …)

---

## DevOps delivery practices (test → deploy and the full loop)

**Goal:** Whole delivery story—not only scanners or only K8s.

```text
Idea / ticket
  → branch / PR (Methodologies)
  → build + unit/integration tests (CiCd)
  → security gates: secrets → SAST → SCA → IaC → image (+ sign/SBOM)
  → publish immutable artifact (registry)
  → provision / update host or cluster (IAC + OS + Automation / Cloud-Native)
  → configure web server / Ingress / TLS (Servers / Cloud-Native)
  → deploy app (systemd / container / K8s)
  → DEV/preview → e2e/smoke/DAST
  → promote → STAGING → (approvals) → PRODUCTION
  → strategy: rolling / blue-green / canary / flags
  → verify: health, metrics, logs, traces (Observability)
  → notify (Slack/Teams) + record release
  → bad path: rollback / forward-fix + incident
  → day-2: patch OS, renew certs, cost/capacity, improve gates
```

Practice catalog, SAST/DAST tables, and Servers/web-server v1 lists from prior revisions remain in force—see sections below for detail still needed at write time.

### Practice catalog (primary homes)

| Practice area | Primary home |
|---------------|--------------|
| CI vs CD vs GitOps; testing in pipeline; artifacts; environments; approvals; strategies; rollback | `CiCd/` + `Methodologies/` |
| Security gate chain | `CiCd/` + `Security/` |
| Host / web-server deploy | **`Servers/`** + `Operating-Systems/` + `Automation/` |
| ChatOps / DORA literacy / branching / incidents | `Methodologies/` |
| Verify after deploy | `CiCd/` ↔ `Observability/` |
| Platform / IDP | `Cloud-Native/3` |

---

## CI/CD security testing (SAST, DAST, full gate chain)

| Stage | Examples | When |
|-------|----------|------|
| Secret scanning | gitleaks, platform scanners | PR / CI |
| SAST / quality | SonarQube, Semgrep, CodeQL | PR / build |
| SCA | Snyk, Trivy, Dependabot | PR / build |
| IaC / policy | Checkov, OPA, Kyverno | PR / build |
| Image scan | Trivy, Snyk Container | After image build |
| Sign / SBOM | cosign, Syft | Before promote |
| Quality gate | Sonar gate, coverage floors | PR / promote |
| DAST | **OWASP ZAP** | After deploy to test/preview |
| WAF | Vendor/cloud WAF | Continuous |
| Pen test | Periodic door | Release / periodic |

**Rule:** Teach the **chain** in `CiCd/`; teach each **scanner** in `Security/`.

---

## Servers, web servers, OS, deploy automation

**Reuse:** `Operating-Systems/` (deep), `Automation/` (Ansible/Chef/Puppet stubs), `IAC/` (provision), Containerization-Deep-Dive (containers).

**New:** `Servers/` — one folder per product.

**v1 must-have:** nginx, Apache httpd, IIS  
**v1 strong add:** Caddy, Traefik, HAProxy, Envoy  

Distinguish: proxy vs app upstream vs K8s Ingress vs WAF.

---

## Inventory snapshot

| Area | Today |
|------|--------|
| Methodologies / CiCd / IAC / Automation / Cloud-Native / Observability / Security | Scaffolded or partial — **fill** |
| Operating-Systems / Languages | Strong — **cross-link** for deploy & SE paths |
| Frameworks / Servers / Cloud literacy / artifact+supply-chain entries | **Planned / gaps** |
| Sister deep-dives | **Link from SE entries** — do not duplicate |

---

## Recommended lanes

| Lane | Focus |
|------|--------|
| **A — Ship & collaborate** (default) | Methodologies → CiCd (path + gates) → Servers+Automation → Security tools → Frameworks → CNCF → **SE gap entries** |
| **B** | CNCF / K8s first |
| **C** | Frameworks first |
| **D** | Servers / classic host deploy first |
| **E — SE on-ramp first** | Write SE orientation + ENTRY+link matrix into handbook, then A |

---

## CNCF starter (v1)

| Tier | Tools |
|------|-------|
| Core | Kubernetes, Helm |
| Delivery | Argo CD and/or Flux |
| Observability | Prometheus, Grafana, OpenTelemetry |
| Next | cert-manager, ExternalDNS, Ingress/Gateway, Cilium (pick 2–3) |

---

## Frameworks v1

**FE:** React, Next.js, Angular  
**BE:** pick at kickoff (Spring, Nest, Django, FastAPI, Rails, Laravel, …)  
**Lens:** what you see → what it is → what it’s for → what DevOps must configure/build/deploy/observe

---

## Kickoff checklist

- [ ] Confirm lane: **A** / B / C / D / **E (SE on-ramp)**  
- [ ] Publish reader-facing “SE learning DevOps — start here” that mirrors the completeness map  
- [ ] Confirm every **GAP** row gets an owner (entry vs folder) before deep tool prose  
- [ ] Confirm branching house default  
- [ ] Confirm Servers v1 list + Automation primary (Ansible …)  
- [ ] Confirm CI security track (SAST/DAST/SCA/secrets/IaC/image/WAF/sign-SBOM)  
- [ ] Confirm SonarQube + ZAP as primary examples  
- [ ] Confirm artifact registry + supply-chain chapters in CiCd/Security  
- [ ] Confirm Cloud literacy approach (`Cloud/` vs entries under IAC)  
- [ ] Confirm Docker/Podman handbook entry → Containerization-Deep-Dive  
- [ ] Confirm data/messaging/CDN/LB entries → Databases + System-Design + Networks  
- [ ] Update root `README.md` Structure when `Frameworks/`, `Servers/`, and/or `Cloud/` appear  
- [ ] Keep Languages = languages; OS = OS; deep dives = deep dives  

---

## Out of scope for this plan file

- Writing all chapter bodies now  
- Duplicating Networks / Containers / Databases / System-Design inside this repo  
- Full cloud certification curricula  
- Exhaustive CNCF landscape dump  
- DSA as a DevOps requirement  

---

## Related entry points

- [Handbook README](./README.md)  
- [Methodologies](./Methodologies/README.md) · [CiCd](./CiCd/README.md) · [IAC](./IAC/README.md) · [Automation](./Automation/README.md)  
- [Cloud-Native](./Cloud-Native/README.md) · [Observability](./Observability/README.md) · [Security](./Security/README.md)  
- [Operating-Systems](./Operating-Systems/README.md) · [Languages](./Languages/README.md)  
- Sister repos: [Networks](https://github.com/thisiskushal31/Networks-Deep-Dive) · [Containers](https://github.com/thisiskushal31/Containerization-Deep-Dive) · [Databases](https://github.com/thisiskushal31/Databases-Deep-Dive) · [System Design](https://github.com/thisiskushal31/System-Design-Concepts) · [Commands](https://github.com/thisiskushal31/Commands-and-Cheatsheets)
