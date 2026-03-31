# Pre-framework competency, engineering domains, and the active ecosystem

[← Back to PHP](./README.md)

## What this chapter covers

**Why staff engineers learn the language and runtime before framework manuals**, how to partition PHP work into **domains** (HTTP, CLI, data, security, packaging, performance, CMS vs application stacks), what the **public web footprint** and **vendor surveys** imply about where PHP actually runs in 2025–2026, and a **competency checklist** you can use to audit yourself or a team before owning Laravel, Symfony, or WordPress in production. Framework chapters assume this baseline.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Language-first: what frameworks hide

Frameworks (Laravel, Symfony, WordPress core APIs, Drupal’s kernel, etc.) **compose** language features: autoloading, superglobals or request objects, PDO or DBAL layers, session adapters, and configuration cascades. They do **not** replace:

- **SAPI semantics** — whether code runs once per HTTP request in an FPM worker, as a long-lived Octane/Swoole worker, or as a CLI process.
- **Extension reality** — `ext-pdo_mysql` on the image vs `composer require` for a PHP package.
- **`php.ini` + pool + web server** — the actual execution envelope.

A staff engineer who jumps straight to “how do I configure Horizon” without knowing **FPM worker reuse**, **Opcache timestamp validation**, or **PDO persistent connection pitfalls** will mis-debug incidents: symptoms look like “Laravel is slow” when the root cause is pool saturation or missing indexes.

**Rule of thumb:** Read chapters **01–11** and this file **before** treating framework docs as the source of truth for production behavior.

---

### 2. Domain map: where PHP work splits

Use this grid when scoping ownership, on-call runbooks, and interview loops.

| Domain | What “good” looks like for staff | Handbook anchors |
|--------|----------------------------------|------------------|
| **Runtime & SAPI** | Same binary minor everywhere; `php --ini` parity; Opcache policy documented | Ch 1, 11 |
| **Language core** | `strict_types` boundaries; no accidental `==` on secrets; enums/DTOs at HTTP edge | Ch 2–5 |
| **Failure & observability** | `E_ALL` in staging, not on the wire; structured logs; no PII in traces | Ch 6, 12 |
| **Packaging & supply chain** | Lockfile policy; `allow-plugins` reviewed; extensions in SBOM | Ch 7, 14 |
| **Process & FS boundaries** | No shell string `exec`; uploads off webroot; `open_basedir` conscious | Ch 8 |
| **HTTP & state** | Superglobal → trust model; session storage + locking; CSRF for cookies | Ch 9 |
| **Data access** | Prepared statements; no identifier interpolation; pool math vs FPM | Ch 10 |
| **Performance** | `max_children` from measurement; Opcache/JIT re-benchmarked on minor bumps | Ch 11 |
| **Delivery** | Immutable images; secrets not in layers; migration ordering | Ch 13 |
| **Concurrency** | Queues for slow work; idempotent consumers; signal-safe shutdown | Ch 15 |
| **Product surface** | CMS plugin risk vs Composer-first apps; long-lived worker stacks | Ch 16 |

Framework-specific routing, ORM configuration, and admin UX sit **on top** of these domains.

---

### 3. Where PHP actually shows up (footprint + surveys)

PHP remains one of the most deployed server-side languages on the public web: usage indexes that crawl large samples of sites consistently report **PHP as the majority share among sites that disclose a server-side language**, with **WordPress** accounting for a very large slice of all websites and an outsized fraction of PHP’s visibility. That shapes hiring, security monitoring, and legacy surface area—even if your employer builds only greenfield APIs.

Independent **developer and enterprise surveys** (IDE vendors, PHP vendors, community version-stats posts) describe a converging picture for **application teams**: **PHP 8.x** is the default target for new work and migrations; many organizations still run **more than one minor** across estates; **container** adoption is common in larger shops. Exact percentages move every quarter—use them for **directional** planning, not precision SLAs.

Implications for staff:

- You will **inherit** WordPress, WooCommerce, Drupal, Magento/OpenMage, TYPO3, Craft, and custom Symfony/Laravel monoliths—not only JSON microservices.
- **Shared hosting** and **single-tenant VPS** PHP still exist; **Kubernetes + FPM** is not universal.
- **EOL PHP** persists in the long tail; migration projects are a core staff skill.

**Finance, healthcare, public sector:** PHP appears in billing portals, patient-facing tools, and citizen services—audit expectations (PCI, HIPAA analogues, data residency) apply to **session storage**, **upload retention**, and **log redaction** the same as for any other language; framework choice does not relax controls.

---

### 4. Application stacks you should name (before reading framework docs)

**Composer-first MVC / API (typical greenfield backend)**

- **Laravel** — batteries-included; Horizon/queues, Octane optional; strong convention.
- **Symfony** — components + full stack; long-term LTS releases matter to enterprises.
- **Slim, Lumen, Mezzio** — thin HTTP layer; you own more wiring.
- **API Platform** — GraphQL/REST on Symfony; hypermedia and schema tooling.

**CMS and commerce (plugin/theme economy)**

- **WordPress** — dominant CMS footprint; plugin supply chain is the security story.
- **Drupal** — enterprise CMS; module ecosystem; Symfony components underneath modern major versions.
- **Magento / Adobe Commerce, Shopware, WooCommerce** — commerce domains with heavy extension markets.
- **Craft CMS, Statamic, Kirby** — smaller share but common in agencies.

**Legacy and verticals**

- **Yii, CodeIgniter, CakePHP** — still maintained; appear in older codebases and some regions.
- **Custom “homegrown MVC”** — PHP + includes + minimal structure—operations nightmare but common.

You do not need to master every framework—but you **do** need to recognize which **domain risks** apply: plugin RCE vs Composer dependency confusion vs long-lived worker memory.

---

### 4b. Platform ↔ product handoff (contract)

Platform teams should publish: supported PHP minors, extension list, FPM pool defaults, Opcache policy, and ingress timeout values. Product teams should publish: required `ext-*`, `composer.lock` update cadence, queue worker topology, and session store. Incidents happen when either side assumes the other’s contract—encode it in a **single internal doc** or service catalog entry, not only in Terraform variables.

---

### 5. Competency checklist (pre-framework bar)

Treat each item as pass/fail for “I can own production PHP.”

**Runtime**

- [ ] Explain FPM worker reuse vs CLI one-shot.
- [ ] Show `php --ini` for both CLI and FPM binaries and reconcile differences.
- [ ] Describe Opcache with `validate_timestamps=0` deploy workflow.

**Language**

- [ ] Trace a request parameter from string to validated int/bool without `==` traps.
- [ ] State when `strict_types` applies to a call into vendor code.
- [ ] Identify where `unserialize` or stream wrappers create gadget/SSRF risk.

**Web**

- [ ] List which superglobal feeds which threat class (XSS, CSRF, IDOR, upload).
- [ ] Configure cookie flags for session ID transport.
- [ ] Align `post_max_size`, `upload_max_filesize`, and reverse proxy body limits.

**Data**

- [ ] Write PDO code with placeholders only for values; explain identifier risk.
- [ ] Explain why persistent PDO + FPM can exhaust DB `max_connections`.

**Ops**

- [ ] Derive a first-pass `pm.max_children` bound from measured worker RSS.
- [ ] Describe a zero-downtime deploy with opcode cache disabled for mtime checks.

**Supply chain**

- [ ] Diff `composer.lock` between releases; interpret `composer audit` output.
- [ ] Name three non-Composer packages that still need CVE tracking (OS `php-*` extensions, nginx, glibc, etc.).

---

## 2. Advanced concepts

**Framework documentation vs runtime truth:** Frameworks document *their* abstractions; when docs say “flush cache,” you must know whether that means Opcache, Redis, Symfony cache pools, Laravel `config:cache`, or WordPress object cache—different failure modes.

**Product vs platform ownership:** Staff in **platform** teams standardize images, FPM pools, and ingress; **product** teams own Composer deps and release cadence. Handoffs fail when platform does not expose extension matrix and product does not declare required `ext-*`.

**WordPress and “not real PHP” bias:** Operationally it is real PHP: same FPM, same `php.ini`, same upload and inclusion risks—often worse because of plugin code volume.

**Enterprise polyglot:** PHP services often sit beside Node, Java, and Go; edge auth, gRPC, and async messaging require **language-agnostic** observability (trace IDs), not only framework logs.

**Regulated environments:** Banking and healthcare still ship PHP; audits care about **session fixation**, **deserialization**, **SBOM**, and **evidence of patch cadence**—framework marketing does not substitute for control mapping (chapter 14).

---

## 3. Applications and use cases

- **Staffing interviews:** Pair “explain FPM” with “debug 502 after deploy” scenarios; reject candidates who only know artisan commands.
- **Architecture review gate:** No new service without declared PHP minor, extension list, session store, and queue story—even if Laravel is the default template.
- **Security monitoring:** WordPress-heavy estates need plugin CVE feeds; Symfony/Laravel estates need Composer advisory integration—different tooling defaults.
- **Cost:** Shared hosting PHP vs K8s PHP changes autoscaling and logging strategy; staff should price both models when advising product.
- **Training paths:** Week one — chapters 1–4 + 9; week two — 7, 10, 11, 14; week three — framework-specific deep dives with this checklist as exit criteria.

---

## References

Industry mix and version adoption move over time; use these for **trends**, not immutable facts.

- [W3Techs — PHP usage in websites](https://w3techs.com/technologies/details/pl-php)
- [Usage of server-side programming languages (overview)](https://w3techs.com/technologies/overview/programming_language/all)
- [JetBrains — State of PHP (developer survey)](https://blog.jetbrains.com/phpstorm/)
- [Zend — PHP migration / container trend posts](https://www.zend.com/blog)
- [PHP version statistics (community aggregates)](https://stitcher.io/blog/php-version-stats-june-2025) — example series; check latest post for current numbers
- [PHP Manual — Introduction](https://www.php.net/manual/en/introduction.php)
