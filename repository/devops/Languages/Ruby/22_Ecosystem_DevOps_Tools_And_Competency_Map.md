# Ecosystem, engineering domains, and competency map

[← Back to Ruby](./README.md)

## What this chapter covers

Where Ruby fits in **software engineering** end to end: product web stacks, libraries and gems, batch and integration workloads, infrastructure DSLs, and staff-level **competency** expectations. DevOps is one column in this map—not the whole table.

---

## 1. Concepts

### 1. Engineering domains Ruby touches

| Domain | Examples | Handbook chapters |
|--------|----------|-------------------|
| **Language & runtime** | MRI, GVL, GC, YJIT | 01–08, 14–15 |
| **Packaging & supply chain** | Bundler, gemspec, audit | 09, 13, 20 |
| **Integration & I/O** | HTTP, JSON, subprocess | 10–12 |
| **Web & APIs** | Rails, Sinatra, Grape | 04, 08, 20 + framework docs |
| **Data & persistence** | ActiveRecord, Sequel, Redis gems | 05–06, 11 + DB docs |
| **Quality** | RSpec, RuboCop, Sorbet | 19 |
| **Security & privacy** | Brakeman, safe YAML, SSRF | 20 |
| **Delivery & SRE** | Docker, CI, Puma, observability | 21 |
| **Infrastructure DSLs** | Chef, Vagrant, Rake | 08, 22 + IAC/Chef |
| **Alternate runtimes** | JRuby, TruffleRuby, mruby | 16–18 |

### 2. Rails and the framework boundary

**Rails** is a **web application framework** (MVC, ActiveRecord, ActionMailer, ActiveJob)—not Ruby itself. Production “Ruby” teams often mean **MRI + Bundler + Rails + PostgreSQL + Redis + Sidekiq**.

Learn this track **01–13** before Rails guides. Security (mass assignment, SQLi, XSS, CSRF) spans language and framework—Brakeman covers Rails-specific surfaces; chapter 20 covers language-level deserialization and shell risks.

| Framework | Role |
|-----------|------|
| **Rails** | Full-stack product development |
| **Sinatra** | Small APIs and microservices |
| **Hanami** | Modular architecture, explicit layers |
| **Grape** | HTTP API DSL on Rack |
| **Roda** | Tree routing, plugins |

### 3. Background jobs and async work

**Sidekiq**, **Good Job**, **Solid Queue** run Ruby outside the request cycle. Same language rules: idempotent jobs, safe serialization, connection pool per process, retry with backoff, dead-letter queues.

### 4. Infrastructure DSLs (brownfield)

**Chef**, **Vagrant**, **Capistrano**, **Rake** embed Ruby as configuration languages. Language chapters explain **blocks and metaprogramming**; [IAC/Chef](../../IAC/Chef/README.md) explains Infra product mechanics.

### 5. Pre-framework competency checklist

Before leaning on Rails or Chef docs alone, you should:

- [ ] Explain `self`, blocks, and `require` vs `Bundler.setup`
- [ ] Read stack traces and `method_missing` chains
- [ ] Use `bundle exec`, read lockfile diffs, run tests locally
- [ ] Parse JSON/YAML safely at boundaries
- [ ] Describe MRI GVL impact on threading design
- [ ] Name why `Marshal.load` on params would be catastrophic

### 6. Competency levels

**Level 1 — Read and patch**

Chapters **01–05**: syntax, types, control flow, objects.

**Level 2 — Build features and scripts**

Chapters **06–13**: Enumerable, exceptions, stdlib, gems, Bundler.

**Level 3 — Own production services**

Chapters **07**, **14–15**, **19–21**: concurrency, memory, testing, CI, observability.

**Level 4 — Staff / architect**

Chapters **08**, **16–18**, **20**, **22**: metaprogramming governance, runtime choice, threat modeling, ecosystem strategy.

### 7. How the 22 chapters group

| Block | Chapters | Theme |
|-------|----------|-------|
| Runtime & syntax | 01–04 | Execution model, object system |
| Data & control | 05–08 | Collections, Enumerable, DSLs |
| Libraries & packaging | 09–13 | stdlib, gems, lockfiles |
| VM & platforms | 14–18 | MRI perf, alternate engines |
| Production engineering | 19–22 | Quality, security, delivery, map |

### 8. What this track does not replace

- **Framework manuals** (Rails, Hanami) after language foundation
- **Database design** → Databases-Deep-Dive
- **Chef product** → IAC/Chef
- **Kubernetes / Terraform** → Cloud-Native / IAC
- **Exhaustive MRI API** → official docs + References per chapter

---

## 2. Advanced concepts

### 1. Polyglot organizations

Ruby services coexist with Go, Java, and Python. Standardize **HTTP contracts**, **auth**, and **observability** across languages; Ruby-specific runbooks stay Ruby-specific.

### 2. Migration and technical debt

Strategies: strangler fig for monoliths, extract gems from Rails apps, replace Chef with image-based config gradually, freeze gems during migration windows. Inventory metaprogramming and C extensions before promising timelines.

### 3. Licensing and compliance

Ruby is **BSD-2-Clause**; each gem has its own license—FOSSA/Snyk scans in CI. Copyleft gems (GPL) may be restricted in commercial products—legal review.

### 4. Staying current

Ruby **NEWS** per minor, Ruby security mailing list, RubyGems CVE posts. Plan **yearly minor upgrades** with full test suite and staging soak.

---

## 3. Applications and use cases

### Hiring and onboarding paths

| Role | Start with | Then |
|------|------------|------|
| **Backend engineer (Rails)** | 01–13 | Rails guides, 19–20 |
| **Platform / SRE** | 01–08, 13, 21 | 14–15, 20, Chef IAC if relevant |
| **Security engineer** | 20, 08, 13, 10 | Brakeman, app threat models |
| **Data engineer** | 05–06, 10–11 | Pipeline frameworks |

### Architecture decision records

| Question | Use chapter |
|----------|-------------|
| New API in Ruby or Go? | 14–15, 21 + team skill |
| JRuby for Java shop? | 16 |
| Embed mruby in appliance? | 18 |
| Monolith vs microservices in Rails? | 22 + org standards |

### Staff-level review checklist

- Team maintains Ruby **support window** (e.g. 3.3–3.4) across apps and CI.
- New services default to **locked Bundler**, tests, and security audit in CI.
- Framework and language reviews are both scheduled for internet-facing apps.
- Competency map attached to onboarding—not “read a tutorial and ship.”

---

## References

- [Ruby Lang — Documentation](https://www.ruby-lang.org/en/documentation/)
- [Rails Guides](https://guides.rubyonrails.org/)
- [Sinatra](http://sinatrarb.com/)
- [Hanami](https://hanamirb.org/)
- [Ruby Style Guide](https://rubystyle.guide/)
- [Sidekiq](https://sidekiq.org/)
- [Chef Documentation](https://docs.chef.io/)
- [IAC: Chef](../../IAC/Chef/README.md)
