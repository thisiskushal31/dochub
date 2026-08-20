# Plan: DevOps concepts beyond Languages

[← Back to handbook](./README.md)

**Status:** Planning only — no section content started from this note yet.  
**Purpose:** Resume this work later without re-deriving the map. Use this file as the checklist / kickoff brief.

**Clarifications from planning chat**

| Term | Meaning |
|------|---------|
| **WAF** | Web Application Firewall — edge/runtime protection (blocks/filters HTTP attacks). Already *mentioned* under Security compliance topics; not a full tool track yet. |
| **SAST** | Static Application Security Testing — analyze **source/bytecode** without running the app (e.g. SonarQube rules, Semgrep, CodeQL). |
| **DAST** | Dynamic Application Security Testing — probe a **running** app over HTTP (e.g. OWASP ZAP, Burp in enterprise setups). |
| **SCA** | Software Composition Analysis — known vulns in **dependencies** / SBOMs (overlaps Snyk, Trivy, Dependabot/Renovate). |
| **OWASP ZAP** | Zed Attack Proxy — open-source **DAST** scanner. **Not a WAF.** Complements SAST/Sonar and WAF. **In scope** for the CI/CD security track. |
| **Slack / ChatOps** | Team chat (often Slack or Teams) wired to CI/CD: build fail/pass pings, deploy announcements, approve/promote from chat, on-call pages. “Slack dash” here = **chat + dashboards / notifications**, not a separate product you must buy. Grafana/CI dashboards stay under Observability / CiCd. |
| **Web server / reverse proxy** | Process that terminates HTTP(S) and serves static files and/or proxies to an app (nginx, Apache httpd, Caddy, IIS, …). Distinct from the **app runtime** (Node, JVM, PHP-FPM, …) and from **K8s Ingress / Gateway**. |
| **Server / host lifecycle** | Provision → harden → configure services → deploy app → patch → monitor → decommission. Runs on **Linux**, **Windows**, or other OS—handbook already has `Operating-Systems/`; this plan adds **how deploy lands on those hosts**. |

---

## Intent (what you asked for)

After Languages, expand the handbook so it also covers:

1. **CNCF / cloud-native basics** — tools people actually use day to day (not the whole landscape dump).
2. **Frameworks** — frontend (React, Next.js, Angular, …) and common backend frameworks, at **literacy** depth—not full UI courses.
3. **Quality / security tools** — e.g. **SonarQube**; **WAF** literacy; scanners already stubbed (Snyk, Trivy, …).
4. **Full CI/CD practices** — not only “a Jenkinsfile exists,” but how modern delivery actually works end to end.
5. **Full CI/CD security testing stack** — **SAST, DAST**, SCA, secrets, IaC/image gates, WAF (see below).
6. **Full DevOps delivery path: test → deploy (and everything around it)** — environments, promotion, strategies, verify, rollback, feedback loops (see **DevOps delivery practices** section). **In scope.**
7. **Collaboration & visibility** — Slack/Teams notifications, ChatOps, CI status, release dashboards (see below).
8. **Branching practices** — trunk-based / GitHub Flow / GitFlow (or house default + comparisons).
9. **Deploy onto real servers** — nginx, Apache httpd, and **other widely used** web servers / proxies worldwide; reverse proxy, TLS, static vs app upstream (see **Servers, web servers, and host deploy**). **In scope.**
10. **Server / OS management in the lifecycle** — Linux (and other OS) as the place artifacts run: services (`systemd` / Windows Services), packages, users, firewall, logs—**wired to** existing `Operating-Systems/`, not a second OS encyclopedia.
11. **Deploy automation** — Ansible/Chef/Puppet (already stubbed) and CI/CD that **pushes or pulls** config + app onto hosts; golden images / cloud-init literacy as needed.

**Spirit of this plan:** You do not need to already know every practice by name. This file is the **map of practices to teach**—including ones you have not used yet—so the handbook becomes the place you (and readers) learn them.

---

## DevOps delivery practices (test → deploy and the full loop)

**Goal:** Cover the **whole delivery story** people mean by “DevOps practices,” not only scanners or only K8s.

Stub files already name pieces of this (`Methodologies/2_…`, `CiCd/1_…`, `CiCd/3_…`)—they are TBD. **This plan commits to filling that story.**

### End-to-end path to teach

```text
Idea / ticket
  → branch / PR (Methodologies)
  → build + unit/integration tests (CiCd)
  → security gates: secrets → SAST → SCA → IaC → image (CiCd + Security)
  → package artifact / image / SBOM (CiCd)
  → provision / update host (IAC + Operating-Systems + Automation)
  → configure web server / proxy / TLS (Servers / web-server track)
  → deploy app upstream (systemd unit, container, or platform)
  → deploy to DEV / preview
  → more tests: e2e, smoke, DAST on a live URL (CiCd + Security)
  → promote to STAGING → (approvals) → PRODUCTION
  → deploy strategy: rolling / blue-green / canary / feature flags (CiCd)
  → verify: health, metrics, logs, traces (Observability)
  → notify team (Slack/Teams) + record release
  → if bad: rollback / forward-fix + incident habits (Methodologies)
  → learn: blameless notes, improve gates (feedback loop)
  → ongoing: patch OS, rotate certs, tune nginx/Apache, capacity (Servers + OS)
```

### Practice catalog (in scope — teach even if new to you)

| Practice area | What to cover | Primary home |
|---------------|---------------|--------------|
| **CI vs CD vs GitOps** | Continuous integration vs delivery vs deployment; push vs pull deploy | `CiCd/` + `Methodologies/` |
| **Branching & PR** | Trunk-based, GitHub Flow, GitFlow; protected branches; required checks | `Methodologies/` |
| **Testing in the pipeline** | Unit → integration → contract → e2e/smoke; what blocks merge vs what runs post-deploy | `CiCd/` |
| **Security in the pipeline** | SAST/DAST/SCA/secrets/IaC/image/WAF — full section below | `CiCd/` + `Security/` |
| **Artifacts & versioning** | SemVer / calver literacy; registries; immutability; provenance | `CiCd/` |
| **Environments & promotion** | Local → CI → dev → staging → prod; env parity; config vs code; secrets per env | `CiCd/` + `Methodologies/` |
| **Approvals & change control** | Manual gates, CODEOWNERS, CAB-lite vs continuous; who can promote | `CiCd/` + `Methodologies/` |
| **Deployment strategies** | Rolling, blue-green, canary, recreate; feature flags; progressive delivery | `CiCd/3_…` (already stubbed) |
| **Host / VM deploy** | Ship to a server: packages, artifacts, systemd/Windows services, healthchecks | **New `Servers/`** (or agreed name) + `CiCd/` |
| **Web servers & reverse proxies** | nginx, Apache httpd, Caddy, Traefik, IIS, HAProxy, … — TLS, vhosts, upstreams | **New `Servers/`** tool folders |
| **OS / server management** | Users, packages, firewall, logging, patching—**apply** OS track to deploy | `Operating-Systems/` (exists) ↔ Servers / Automation |
| **Deploy automation** | Idempotent config of hosts + web servers + app units | `Automation/` (Ansible/Chef/Puppet stubs) + `IAC/` |
| **Release / rollback** | Release notes, freeze windows, rollback vs roll-forward, hotfix path | `CiCd/` + `Methodologies/` |
| **Verify after deploy** | Smoke tests, synthetic checks, SLO burn, error budgets (light touch → Observability) | `CiCd/` ↔ `Observability/` |
| **ChatOps & notifications** | Slack/Teams: fail pings, deploy announcements, threaded release status; optional slash-approve | `Methodologies/` and/or `CiCd/` practice chapter; not a “Slack product manual” |
| **Dashboards for delivery** | CI status, DORA-ish habits (lead time, deploy freq, CFR, MTTR) at literacy level; Grafana for runtime | `Methodologies/` + `Observability/` |
| **On-call & incidents** | Handoff after bad deploy; already stubbed in Methodologies SRE topic — connect to deploy | `Methodologies/3_…` |
| **Platform / self-service** | IDP, paved road pipeline — already named in Cloud-Native platform eng | `Cloud-Native/3_…` |

### Slack / chat / “dash” (explicitly in scope)

| Topic | Cover as |
|-------|----------|
| Build/deploy **notifications** to Slack/Teams | Practice: what to alert on (fail, prod deploy), noise control |
| **ChatOps** (optional depth) | Trigger or acknowledge deploys from chat—with audit trail |
| **Status visibility** | Channel topics, release threads, links to pipeline + Grafana |
| Not in scope as a full product track | Slack Enterprise admin, workspace design, marketing Slack |

Same ideas apply if the org uses **Microsoft Teams**, Discord, or email—teach the **practice**, show Slack as the common example.

---

## Servers, web servers, OS, and deploy automation

**Goal:** Cover how software actually **lands on a machine** people can SSH/RDP to—or on a VM/image that becomes that machine—not only “deploy to Kubernetes.” Classic production worldwide still runs **nginx / Apache / IIS** in front of apps; automation must configure that stack repeatably.

### What already exists (reuse, don’t duplicate)

| Area | Path | Use it for |
|------|------|------------|
| **OS theory + Linux/Windows/Unix/macOS** | `Operating-Systems/` | Processes, networking, firewall, users, storage, shell, systemd-era service thinking, Windows services |
| **Config / deploy automation tools** | `Automation/` (Ansible, Chef, Puppet stubs) | Idempotent install/config of web servers + app units |
| **Provision infra** | `IAC/` (Terraform, etc.) | Create VMs/networks/LBs; hand off to Automation for software config |
| **Containers / K8s depth** | Cloud-Native + Containerization-Deep-Dive | When the “server” is a node or the edge is Ingress—not a substitute for VM/nginx literacy |
| **PHP ↔ nginx/Apache** | Languages/PHP (FPM chapter) | Language-specific glue; general web-server track still needed |

### New home (recommended when work starts)

Add a top-level **`Servers/`** section (name can be `Servers/` or `Web-Servers-And-Edge/` at kickoff)—**one folder per product**, same pattern as CiCd/Security:

| Layer | Topics | Notes |
|-------|--------|-------|
| **Concepts** | What a reverse proxy is; TLS termination; vhosts; upstreams; static vs dynamic; load balancing vs app server | Numbered overview MDs under `Servers/` |
| **Linux host deploy** | Packages, `systemd` units, logs (`journalctl`), firewall ports, users, SELinux/AppArmor literacy doors | Cross-link `Operating-Systems/Linux/` |
| **Windows host deploy** | IIS, Windows Services, WinRM, firewall | Cross-link `Operating-Systems/Windows/` |
| **Other OS** | When brownfield is AIX/Solaris/BSD—**doors** to `Operating-Systems/Unix/`, not full mirrors | Recognition + where ops differs |
| **Deploy automation** | Ansible roles for nginx/Apache/Caddy; CI job that runs playbooks; Chef/Puppet equivalents | `Automation/` + examples linked from Servers |
| **Day-2 ops** | Cert renewal, log rotation, upgrades, backup of config, graceful reload vs restart | Servers concepts + OS |

### Web servers / proxies to cover (international + common)

**v1 must-have (everyone meets these):**

| Product | Why |
|---------|-----|
| **nginx** | Default reverse proxy / static server in huge swaths of industry |
| **Apache HTTP Server (httpd)** | Still dominant in many enterprises, shared hosting, `.htaccess` brownfield |
| **IIS** | Windows / .NET estates internationally |

**v1 strong add (widely used; pick order at kickoff):**

| Product | Why |
|---------|-----|
| **Caddy** | Automatic HTTPS; growing simple-deploy default |
| **Traefik** | Dynamic config; Docker/K8s-friendly proxy |
| **HAProxy** | Classic L4/L7 load balancer in front of fleets |
| **Envoy** | Cloud-native proxy; ties to mesh / Gateway API literacy |

**Later / doors (don’t block v1):** lighttpd, OpenResty, Apache Tomcat (app server—not the same as httpd), Weblogic/WebSphere (enterprise Java doors), cloud LB products (ALB/NLB/GCP LB) as “managed edge” doors next to HAProxy/Envoy.

**Not the same thing—teach the distinction:**

| Thing | Role |
|-------|------|
| nginx / Apache / Caddy / IIS | Web server / reverse proxy on a host (or container) |
| PHP-FPM / Gunicorn / Puma / Node | App process **upstream** of the proxy |
| K8s Ingress / Gateway API | Cluster edge—often still nginx/Envoy/Traefik **under the hood** |
| WAF | Security filter—may sit in front of or on the proxy |

### Host lifecycle to teach (with automation)

```text
Provision VM/bare metal (IAC / cloud UI)
  → baseline OS (users, SSH/WinRM, patch, firewall)     [Operating-Systems + Automation]
  → install web server + TLS                            [Servers + Automation]
  → install/run app (systemd / service / container)     [Servers + CiCd artifact]
  → healthcheck + register with LB                      [CiCd / Servers]
  → pipeline promotes new artifact → reload proxy       [CiCd + Automation]
  → observe + patch + renew certs                       [Observability + Servers]
```

### Must-cover teaching points (when writing)

- Config is **code**: nginx conf / Apache vhosts managed by Ansible (or equivalent), not “SSH and edit once.”  
- **Reload vs restart**; zero-downtime habits on a single host vs multi-host LB.  
- TLS: where certs live, renewal (e.g. ACME), secrets not in git.  
- Same pipeline mental model for **VM + nginx** and **K8s + Ingress**—different machinery, same stages.  
- OS choice changes commands and service model; **concepts transfer**, runbooks differ (use OS track).

---

## CI/CD security testing (SAST, DAST, and the full gate chain)

**Goal:** One clear handbook story: *where each control sits in the pipeline*, what it finds, what it does **not** find, and how it fails the build vs warns.

### Pipeline stages to cover (practices + tools)

| Stage | What it is | Example tools / homes | When it runs |
|-------|------------|----------------------|--------------|
| **Secret scanning** | Stop keys/tokens from landing in git/CI logs | gitleaks / trufflehog / native GHA-GitLab secret detection; Vault for *storage* | Pre-commit / PR / CI |
| **SAST** | Vulns & insecure patterns in **your** code | SonarQube, Semgrep, CodeQL, language linters with security rules | PR / build |
| **SCA / deps** | Known CVEs in libraries | Snyk, Trivy (fs), Dependabot/Renovate, npm/pip audit | PR / build |
| **IaC / policy scan** | Misconfig in Terraform/K8s/Helm manifests | Checkov, OPA/Conftest, Trivy config | PR / build |
| **Container / image scan** | OS & app vulns in images | Trivy, Snyk Container, registry scanners | After image build |
| **Quality gate** | Block merge/deploy on threshold | Sonar quality gate, coverage floors, severity policy | PR / before promote |
| **DAST** | Attack a **deployed** app (staging/ephemeral) | **OWASP ZAP**, other DAST | After deploy to test env (or preview) |
| **IAST** (optional depth) | Instrumentation inside running app | Commercial IAST — literacy door unless you standardize one | Test env |
| **WAF** | Runtime edge filter (prod/staging) | Cloud/vendor WAF — **not** a substitute for SAST/DAST | Continuous at edge |
| **Pen test / red team** (door) | Human-led or scheduled deep assessment | Out of day-to-day CI; periodic control | Release / periodic |

### Where security-in-CI content should live

| Content | Home |
|---------|------|
| **Practices narrative** (gate order, fail-closed vs warn, staging DAST) | **`CiCd/`** — expand `1_Pipelines_…` and/or add `4_Pipeline_Security_SAST_DAST_And_Gates.md` |
| **Tool how-tos** | **`Security/<Tool>/`** |
| **Branch rules that enable gates** | **`Methodologies/`** + CiCd cross-link |

**Rule:** Teach the **chain** in CiCd; teach each **scanner** in Security. Cross-link both ways.

### Must-cover teaching points (when writing)

- SAST ≠ DAST ≠ SCA ≠ WAF — different layers.  
- DAST needs a **reachable environment**; it sits on the **test → deploy** path, not only on “lint PR.”  
- Quality gates: severity, new-code vs overall, break-the-build policy.  
- Suppressions need ownership.  
- Artifacts: SARIF, SBOM, scan reports for audit.  
- Shift-left vs runtime: CI finds early; WAF/observability catch what escapes.

---

## Inventory: already planned vs scaffolded vs new

### A. Already in the handbook structure (scaffolded — mostly placeholders)

Fill these—do **not** invent a parallel tree.

| Area | Path | What’s there today |
|------|------|--------------------|
| Culture / workflows | `Methodologies/` | Culture; practices (GitOps, trunk-based, feature flags, canary *named*); SRE/incident — **thin TBD** |
| Pipelines & CD | `CiCd/` | Build/test/deploy + deployment strategies stubs; tool folders — **scaffolded**; **full practice path + SAST/DAST chapter not written** |
| Cloud-native | `Cloud-Native/` | Architecture / K8s / platform eng; K8s, Helm, Istio, Linkerd — **scaffolded** |
| Observability | `Observability/` | Prometheus, Grafana, OpenTelemetry, etc. — for **verify after deploy** |
| Security tools | `Security/` | Vault, OPA, Checkov, Snyk, Trivy; WAF *mentioned* — **no SonarQube / ZAP / WAF tool folder yet** |
| Operating systems | `Operating-Systems/` | **Exists and is deep** — Linux/Windows/Unix/macOS fundamentals; **not** yet wired as “deploy nginx onto this host” |
| Automation | `Automation/` | Ansible/Chef/Puppet folders — **scaffolded**; use for **host + web-server deploy automation** |
| IAC | `IAC/` | Provision machines/networks — pair with Automation for software on the box |
| Containers depth | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) | Deep runtime/orchestration outside handbook |

### B. Already a deliberate *door* from Languages

| Topic | Current stance |
|-------|----------------|
| React / Next.js | TypeScript doors to official docs — not full framework chapters |
| Rails / Laravel / Nest / Spring | Ecosystem doors inside language tracks |

**Decision:** add **`Frameworks/`** so Languages stay languages.

### C. New / explicit commitments when this work starts

| Item | Suggested home | Notes |
|------|----------------|-------|
| Full delivery path (test → deploy → verify → feedback) | `CiCd/` + `Methodologies/` | **First-class**; catalog above |
| Branching playbook | `Methodologies/` | Beyond one-liners |
| Pipeline security gate chain | `CiCd/` new/expanded chapter | SAST/DAST/SCA/… |
| ChatOps / Slack-Teams notifications | `Methodologies/` or `CiCd/` practice chapter | Literacy, not Slack admin |
| SonarQube / ZAP / WAF / secret scan tools | `Security/` | Wire into CiCd story |
| **Servers / web servers / host deploy** | **New `Servers/`** | nginx, Apache httpd, IIS, Caddy, Traefik, HAProxy, Envoy, … |
| **OS applied to deploy** | Cross-link `Operating-Systems/` | systemd, firewall, patching—don’t rewrite OS track |
| **Deploy automation on hosts** | `Automation/` deepen + Servers examples | Ansible (etc.) installs/configures proxy + app |
| CNCF starter pack | `Cloud-Native/` | See below |
| Frontend / backend frameworks | **New** `Frameworks/` | React, Next, Angular + backends |

---

## Recommended delivery lane

**Lane A — “Ship & collaborate”** (suggested default):

1. **`Methodologies/`** — culture refresh + **branching** + PR/required checks + **notifications/ChatOps literacy** + link to incidents.  
2. **`CiCd/`** — **full path** build → test → secure → artifact → deploy → verify; deepen **deployment strategies**; security gate chapter; one primary CI tool (e.g. GitHub Actions) showing the path.  
3. **`Servers/` (new)** — nginx + Apache (+ IIS) first; reverse proxy/TLS/upstreams; Linux host deploy; wire **`Automation/`** (Ansible) so config is not manual-only; cross-link **`Operating-Systems/`**.  
4. **`Security/`** — SonarQube, ZAP, WAF; connect Snyk/Trivy/Checkov into the same path.  
5. **`Frameworks/`** — thin v1.  
6. **CNCF starter pack** + Observability as “verify after deploy” (Ingress as the K8s-shaped cousin of nginx).

Alternates:

- **Lane B** — CNCF first (platform/K8s audience).  
- **Lane C** — Frameworks first.  
- **Lane D** — **Servers / classic host deploy first** (if your audience is still mostly VMs + nginx/Apache before K8s).

---

## CNCF / everyday starter pack (v1 candidate)

| Tier | Tools | Handbook home |
|------|-------|----------------|
| **Core** | Kubernetes, Helm | `Cloud-Native/` |
| **Delivery** | Argo CD *or* Flux | `CiCd/` |
| **Observability** | Prometheus, Grafana, OpenTelemetry | `Observability/` |
| **Next tier (pick 2–3)** | cert-manager, ExternalDNS, Ingress / Gateway API, Cilium | `Cloud-Native/` |

---

## Frameworks v1 candidate (literacy only)

**Frontend:** React, Next.js, Angular  

**Backend (pick at kickoff):** e.g. Spring Boot, Nest/Express, Django, FastAPI, Rails, Laravel  

**Lens:** what you see → what it is → what it’s for → where DevOps uses it.

---

## Security tool map (aligned to CI/CD stages)

| Layer | Example | Role |
|-------|---------|------|
| **Secrets** | gitleaks (+ Vault) | Fail PR if secrets committed |
| **SAST / quality** | SonarQube, Semgrep, CodeQL | Gate on findings |
| **SCA** | Snyk, Trivy, Dependabot | Critical deps |
| **IaC / policy** | Checkov, OPA | Dangerous misconfig |
| **Image** | Trivy, Snyk Container | Before push/deploy |
| **DAST** | **OWASP ZAP** | After deploy to test/preview |
| **Runtime edge** | **WAF** | Continuous |
| **IAST / pen test** | Doors | Beyond default PR CI |

---

## Kickoff checklist (when you return)

- [ ] Confirm lane: **A** / B / C / **D (servers-first)**  
- [ ] Confirm branching **house default**  
- [ ] Confirm **full delivery path in scope** (test → deploy → verify → rollback/feedback)  
- [ ] Confirm **host + web-server deploy in scope** (nginx, Apache, … + OS + Automation)  
- [ ] Confirm `Servers/` section name + v1 web-server list (nginx/Apache/IIS + which of Caddy/Traefik/HAProxy/Envoy)  
- [ ] Confirm deploy automation primary tool (Ansible vs Chef vs Puppet vs mix)  
- [ ] Confirm **ChatOps / Slack-Teams notifications** in scope (literacy)  
- [ ] Confirm deployment strategies chapter filled (rolling / blue-green / canary / flags)  
- [ ] Confirm CI/CD security track: SAST + DAST + SCA + secrets + IaC + image + WAF  
- [ ] Confirm SonarQube + OWASP ZAP as primary SAST/DAST examples  
- [ ] Confirm WAF = concepts-first vs vendor folders  
- [ ] Confirm secret-scanning tool for v1  
- [ ] Confirm CNCF starter list + Frameworks v1 list  
- [ ] Add/expand CiCd chapters: pipeline path + security gates (+ ChatOps cross-link)  
- [ ] Update root `README.md` Structure when `Frameworks/` and/or `Servers/` are created  
- [ ] Keep Languages free of full React/Next/Angular curricula; keep OS track as the OS deep dive  

---

## Out of scope for this plan file

- Writing the actual chapter bodies  
- Scraping the entire CNCF landscape  
- Folding frameworks into Languages  
- Rewriting `Operating-Systems/` inside `Servers/` (cross-link instead)  
- Full Slack/Teams administration courses  
- Exhaustive coverage of every historical web server ever shipped  
- Full commercial IAST / pen-test handbooks (doors unless expanded later)

When you resume: open this file, tick the kickoff checklist, then start with the first unchecked step for your lane.

---

## Related handbook entry points

- [Handbook README](./README.md)  
- [Methodologies](./Methodologies/README.md)  
- [CiCd](./CiCd/README.md)  
- [Automation](./Automation/README.md)  
- [IAC](./IAC/README.md)  
- [Operating-Systems](./Operating-Systems/README.md)  
- [Cloud-Native](./Cloud-Native/README.md)  
- [Security](./Security/README.md)  
- [Observability](./Observability/README.md)  
- [Languages](./Languages/README.md) (frameworks remain doors until `Frameworks/` exists)
