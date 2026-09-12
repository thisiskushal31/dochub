# Where TypeScript is going and adjacent doors

[← Back to TypeScript](./README.md)

## What this chapter covers

The **compass** for this track: what **00–20** already make you fluent in, how to read **TypeScript release notes** without drowning, and a checklist of **adjacent doors** (Deno, Bun, native type-stripping in Node, editor/language-service performance, Go-port rumors, deeper React/framework craft) that this handbook names without turning into second encyclopedias. Snapshot habit: **TypeScript 5.9.x** + **`strict`: true** as default; re-check the [release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html) and blog when you pin toolchains.

You came here for TypeScript. You should leave able to **read, fix, review, migrate, and ship** typed JS systems—and able to say **what to learn next** so React/Next/Nest (and friends) *complement* this foundation instead of replacing it.

The pillars that staff hire for do not change with fashion: **error handling**, **file/I/O honesty**, and **faster runtime plus faster builds**. New runtimes and compilers are doors around that bullseye—not replacements for it.

---

## 1. Concepts

### 1. What this track already owns

After chapters **00–21** you should be able to:

| You can… | Chapters that built it |
|----------|------------------------|
| Run `tsc`, pin versions, trust a hello | **00** |
| Explain TS vs JS and erasure | **01** |
| Configure tsconfig / modules honestly | **02** |
| Use everyday types through classes/modules | **03–10** |
| Handle errors with `unknown` / `never` / Results | **11** |
| Discipline async, abort, concurrency | **12** |
| Speed up **runtime** (machine clock) | **13** |
| Handle files, streams, paths, bytes | **14** |
| Speed up **builds** / typecheck | **15** |
| Apply utility / mapped / conditional / template types | **16** |
| Ship and consume `.d.ts` / `@types` | **17** |
| Test with type-aware Vitest/Jest habits | **18** |
| Read DOM/React surfaces without a full UI course | **19** |
| Review supply chain, secrets, safe config | **20** |
| Map roles, domains, and **capstone artifacts** you can write | **21** |

That is the bullseye: **language + `tsc`/`tsconfig` + Node tooling literacy + testing door + UI surface door + security review**. It is not every framework, every bundler, or every runtime mascot.

### 2. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| TS language + strict discipline | **Yes** (default **5.9.x**) | Handbook + release notes |
| Error / file / performance pillars | **Yes** (**11**, **13–15**) | Re-read pillars on upgrade |
| Declaration publishing / DT | **Yes** (**17**) | DefinitelyTyped contribution docs |
| Vitest / Jest literacy | **Yes** (**18**) | Official Vitest / Jest hubs |
| React / DOM **craft** | **Literacy only** (**19**) | [react.dev](https://react.dev/) |
| Next.js / meta-frameworks | **Door only** | [Next.js docs](https://nextjs.org/docs) (after React) |
| Nest / Node frameworks | **Door only** | Framework official docs + [Node.js](https://nodejs.org/docs/latest/api/) |
| Deno / Bun full books | **Door** (this chapter) | Deno / Bun official docs |
| Node native type stripping | **Door** (this chapter) | Node.js docs + TS blog notes |
| Bundlers (Vite/webpack/…) | **Door** | [Vite](https://vite.dev/) or your bundler’s docs |
| Cloud IaC / Terraform | **No** | Those tool docs |
| Exploit / credential abuse | **No** | Forbidden |

### 2b. Your learning path after TypeScript (pick one lane)

Do **not** study every door. Pick the lane that matches what you want to *write next*, then keep this track as the type/module/error spine.

```text
                    ┌─ Weak JS/DOM? ──► Languages/JavaScript + MDN
                    │
 Finished TS 00–22 ─┼─ Want UI product? ──► ch 19 literacy → react.dev → Next.js docs
                    │
                    ├─ Want APIs/workers? ──► deepen Node docs → Nest/Express/Fastify docs
                    │
                    ├─ Want CLIs/platform? ──► ship more ch 14 tools; cloud SDK docs as needed
                    │
                    └─ Want libs? ──► publish packages (ch 17); API design docs as needed
```

| Lane | First “hello” outside this book | What you reuse from TypeScript |
|------|----------------------------------|--------------------------------|
| **React** | Official “Learn React” tutorial | Props/state types, event types, fetch → `unknown` |
| **Next.js** | App Router / Pages quickstart in Next docs | Separate server vs client packages; validate on server |
| **Node API** | `node:http` or framework “first controller” | **11–13** pillars; `strict` tsconfig |
| **Tooling CLI** | Your next internal script in TS | **14** + **20** (paths, secrets) |
| **Runtime experiment** | Deno/Bun official starter | Still run `tsc` (or equivalent) in CI |

Staff rule: frameworks teach **routing and product structure**; this track teaches why the PR **typechecks**, **fails closed**, and **stays fast**. Skip this foundation and React/Next will feel like magic until CI breaks.

### 3. The orientation sentence

> **Same language, different hosts and pins.**

Browsers, Node versions, CI images, Deno, and Bun rarely invent a new TypeScript. They change **how types are checked or stripped**, **which libs exist**, and **which module quirks bite**. Your pin-and-discover habit from **00** / **02** is how you absorb the future.

### 4. How to use this chapter

Read after **21** (or skim early so you know the bullseye). Revisit when:

- you finish the track and need a **next-learning lane** (React/Next/Node/CLI),
- you bump TypeScript minors/majors,
- someone proposes Deno/Bun as the team runtime,
- Node gains another native TS story,
- CI typecheck time becomes a political issue,
- a rumor about a compiler rewrite hits social media.

---

## 2. Advanced concepts

### 1. How TypeScript evolves (what to watch)

TypeScript ships on a steady release train. Staff takeaways:

| Theme | Why you care |
|-------|--------------|
| Language features | New syntax/types → teach team; update style guides |
| Checker performance | Project references, narrowing improvements, memory |
| `lib` / DOM updates | Browser API typings move with targets |
| Tooling defaults | `tsc --init` shapes change—do not cargo-cult forever |
| Deprecations | Legacy options linger for brownfield |

Treat **5.9.x** as current narrative; treat older lines as **literacy + migration projects**.

### 2. How to read release notes without drowning

| Pass | Extract |
|------|---------|
| **1. Title version + ship date** | Pin candidates |
| **2. Breaking / noteworthy** | What fails in CI after bump |
| **3. New flags / defaults** | tsconfig diffs |
| **4. Type system examples** | What to teach in lunch-and-learn |
| **5. Performance notes** | Whether to revisit chapters **13** / **15** habits |
| **6. Playground / blog** | Motivation and demos |

Staff habits:

1. Bump in a branch; read errors as a checklist, not a vibe.
2. Do not redesign production on a **nightly** feature.
3. Separate “we read the blog” from “our framework supports it.”
4. Keep `typescript` pins aligned across app, IDE workspace version, and CI.

### 3. Door checklist — adjacent runtimes and models

Use this as a **routing table**, not a to-do list to study all at once.

#### Deno — door

| Item | Literacy |
|------|----------|
| What | Runtime with first-class TypeScript / web-aligned APIs |
| Why people reach | URL imports, permissions model, batteries for some tools |
| TS angle | Often typechecks with its own pipeline—**pin and discover** like any host |
| Not in this book | Full Deno standard library course |

Prefer Deno’s official docs when your org adopts it. Do not assume Node `fs` snippets paste cleanly.

#### Bun — door

| Item | Literacy |
|------|----------|
| What | JavaScript runtime and toolkit emphasizing speed and DX |
| Why people reach | Fast installs/tests; TS workflow convenience |
| TS angle | Transpile/run habits may differ from `tsc` emit—**know what checks types in CI** |
| Not in this book | Full Bun API encyclopedia |

Staff rule: **runtime speed ≠ type safety**. Keep an explicit typecheck step even when the runtime executes `.ts` directly.

#### Node and native TypeScript / type stripping — door

Node continues to improve running TypeScript-ish workflows (type stripping / experimental paths evolve—verify against **current** Node docs when you pin). Literacy:

- Stripping types is **not** the same as typechecking.
- Production policy still needs `tsc` / `typescript` in CI for staff-grade safety.
- Match `@types/node` to the Node major you deploy (chapter **17**).
- For strip-friendly source, enable **`erasableSyntaxOnly`** (TS 5.8+) so enums, parameter properties, and runtime `namespace`s fail in CI before Node’s stripper does (chapter **02**).
- **`import defer`** (TS 5.9) is typed for deferred module evaluation—but only when `module` is `preserve`/`esnext` and the **host/bundler** supports it (chapter **10**). Do not assume Node runs it today.

#### Editor language service vs `tsc` CI — door

IDEs use the TypeScript **language service**. CI should use the **same major/minor** when possible. Divergence causes “clean locally, red in CI.” Performance work (chapter **15**) often starts with: solution-style configs, project references, and fewer pathological types—not a new runtime.

#### Compiler port / rewrite rumors (including Go) — door, carefully

Discussions appear periodically about **reimplementing or porting** parts of the TypeScript compiler/toolchain for performance (including rumors and proposals involving other languages such as Go). Compass rules:

1. Prefer **official blog and handbook** announcements over threads.
2. Until a pin ships in **your** CI, treat it as **interest**, not architecture.
3. Your skills (type system, tsconfig, pillars) transfer; binary packaging details may change.
4. Do not block deliveries waiting for a rumor to save a slow monorepo—apply chapters **13** / **15** now.

#### Frameworks (Next, Nest, etc.) — doors

| Door | Official next read | What you reuse from this track |
|------|--------------------|--------------------------------|
| **React craft** | [react.dev](https://react.dev/) after chapter **19** | Props/object types, narrowing, fetch → `unknown` |
| **Next.js / meta-frameworks** | [Next.js docs](https://nextjs.org/docs) after React basics | App vs server package split; validate on server; keep `strict` |
| **Nest / Express / Fastify** | Each framework’s official docs + [Node.js](https://nodejs.org/docs/latest/api/) | Errors (**11**), async/abort (**12**), modules (**10**) |
| **Vite (or other bundlers)** | [Vite](https://vite.dev/) / bundler docs | Who typechecks vs who emits (**15**, this chapter) |

These doors are **complement paths**, not chapters missing from this book. Study one lane deeply; do not collect framework trivia instead of shipping a typed CLI or API edge (chapter **21** capstone).

#### Bundlers and monorepo orchestrators — doors

Vite, webpack, Turborepo, Nx, and friends own **graph and emit**. TypeScript owns **types**. Staff keep one clear answer to: “Who typechecks, and who bundles?”

### 4. What is unlikely to change

- Types erase (unless you add runtime validators).
- `unknown` beats `any` at boundaries.
- Incorrect modules settings feel like “TS is broken.”
- Supply chain and secrets remain ops/security problems (chapter **20**).
- Pillars—**errors**, **files**, **speed**—remain why managers fund TS.

### 5. Migration mindset for the next pin

When 5.10+ or 6.x narratives arrive:

1. Read official release notes.
2. Upgrade a leaf package first.
3. Re-run typecheck + tests (chapter **18**).
4. Watch for `lib` DOM changes and module defaults.
5. Update this track’s mental pin in your team wiki—not only your laptop.

### 6. Language service, `tsc`, and “two TypeScripts”

Engineers feel pain in three places that are related but not identical:

| Surface | Job |
|---------|-----|
| **Editor language service** | Instant feedback, refactors, completions |
| **`tsc` / CI project build** | Authoritative check for the graph you ship |
| **Runtime transform** | Vite/Bun/Node stripping or transpiling for execute |

A feature can work in the editor and fail in CI if versions diverge. A runtime can execute code that never passed `tsc` if CI only “builds with the bundler.” Staff policy: **one pin story**, three surfaces reconciled.

### 7. Pillars stay the hiring bar

Whatever host you pick next year, interviews and reviews should still probe:

| Pillar | Timeless question |
|--------|-------------------|
| **Errors** | What is in `catch`? How do async failures surface? |
| **Files** | How do you read untrusted paths/bytes safely? |
| **Speed** | What did you do when `tsc` or the hot path got slow? |

Doors (Deno, Bun, native stripping, compiler ports) are answers to **host and toolchain** questions—not substitutes for those three.

### 8. JS → TS migration playbook

Official migration is incremental—not a big-bang rewrite. Staff sequence (verify against current handbook when you pin):

1. **Separate inputs from emit** — `allowJs`, `outDir` / bundler pipeline so `tsc` does not overwrite sources.
2. **Typecheck JS in place** — `checkJs` and/or `// @ts-check`; add JSDoc where inference fails (chapter **17**).
3. **Pull in `@types/*`** for libraries; fix module settings so imports resolve (chapters **02**, **10**, **17**).
4. **Rename leaf files** `.js` → `.ts` (`.jsx` → `.tsx`); fix errors file-by-file. Emit still works with type errors unless `noEmitOnError`—tighten when ready.
5. **Strictness ratchet** — turn on `noImplicitAny`, then `strictNullChecks`, then full `strict` (and friends) as islands go green. Do not enable every flag on a 50k-LOC brownfield in one PR.
6. **Delete escapes** — burn down `any`, `@ts-expect-error`, and ambient `declare module` stubs with owners.

React-heavy trees: follow the official React conversion guidance after chapter **19** literacy—do not invent a second UI encyclopedia here.

### 9. Best-practice doors → pillars 11 / 13 / 14 / 15

“Best practices” lists outside this track often restate hygiene already owned by pillars. Route reviewers here:

| Practice theme | Pillar chapter |
|----------------|----------------|
| `unknown` in `catch`, no empty catches, Result vs throw | **11** Error handling |
| Faster runtime (hot paths, wait vs work, early-exit) | **13** Runtime performance |
| Honest paths, bytes, streams, untrusted file input | **14** File I/O |
| Faster `tsc` (refs, diagnostics, shallow types) | **15** Builds / typecheck |

Use chapter **21** for role/domain mapping; use this chapter for **hosts, pins, and migration**. Prefer official handbook + release notes over tutorial checklists.

### 10. ADR template for an adjacent-runtime spike

Keep spikes honest:

```text
Title: Trial <Deno|Bun|Node-TS-strip> for <package>
Context: why Node+tsc status quo hurts
Decision criteria: CI typecheck, deps, permissions, team skill
Experiment: timebox, success metrics
Rollback: how we exit
Non-goals: rewriting the monorepo mid-spike
```

If the ADR cannot name a rollback, it is not a spike—it is a hostage situation.

---

## 3. Applications and use cases

### Application teams

- Adopt new TS features when they clarify props/DTOs—not because Twitter did.
- Keep UI framework upgrades separate from `tsc` bumps when possible to isolate risk.
- Use the compass when a blog post claims “TypeScript is dead”—check official notes first.

### Systems / platform teams

- Standardize on one CI typecheck story across Node and any Deno/Bun experiments.
- Invest in project references before betting the roadmap on an unreleased compiler.
- Track language-service memory/CPU on large repos as a platform SLO input (chapter **15**).

### Security / ops

- New runtimes mean new permission and supply-chain models—review like any host (chapter **20**).
- Secret policies do not change because files end in `.ts`.
- Installer/bootstrap scripts for alternate runtimes get the same secret and lockfile review as npm.

### Software engineering

- Teach pillars to juniors; point seniors at doors when they need depth.
- Capture “why we are not on Deno yet” as a dated ADR, not folklore.
- Revisit chapter **16** cleverness budgets when upgrading majors—new features can replace old hacks.

| Horizon | Action |
|---------|--------|
| This quarter | Pin **5.9.x**; kill boundary `any`; measure `tsc` time |
| Next pin | Release-note driven upgrade branch |
| Adjacent runtime trial | Spike with official docs; keep CI typecheck |
| Rumor | Wait for official ship; continue chapters **13** / **15** hygiene |
| Always | Errors, files, speed as non-negotiable review lenses |

---

## 4. Staff-level review checklist

- Team pin documented (**TS 5.9.x** or justified older).
- CI typecheck exists even if a runtime executes TypeScript directly.
- IDE TypeScript version aligned with CI within policy.
- Deno/Bun/Node-TS experiments have owners and exit criteria.
- Compiler rumors not used as excuses to skip performance hygiene.
- Framework upgrades do not silently loosen `strict`.
- Pillars still reviewed: errors, files/I/O, build & runtime speed.
- Declaration and `@types` story clear for new packages.
- Security review applies to new hosts and installers.
- JS → TS migrations use `allowJs`/`checkJs`, rename islands, and a documented strictness ratchet—not a silent `any` flood.
- “Best practice” reviews route errors/files/speed to pillars **11** / **13** / **14** / **15**.
- Compass doors used as **routing**, not infinite scope creep.
- Reader can point to **one complement path** (React, Next, Nest, CLI deepen, …) without treating it as unfinished TypeScript.

---

## References

- [TypeScript Handbook — Intro](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
- [JS Projects Utilizing TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TypeScript Blog](https://devblogs.microsoft.com/typescript/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [Deno — Manual](https://docs.deno.com/)
- [Bun — Docs](https://bun.sh/docs)
- [React — Documentation](https://react.dev/)
- [Next.js — Docs](https://nextjs.org/docs)
- [Vite — Guide](https://vite.dev/guide/)
- [TypeScript on GitHub](https://github.com/microsoft/TypeScript)
