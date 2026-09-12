# Use cases and engineering perspectives

[← Back to TypeScript](./README.md)

## What this chapter covers

Where TypeScript **actually shows up**, and how **different roles** should think about it. Domains: **product web/apps**, **Node services**, **CLIs and internal tooling**, **shared libraries**, **control-plane / DevOps-adjacent automation**, and **typed contracts across teams**. This is the applications lens after language, pillars, and ecosystem chapters—not a framework war and not a second React course.

Default pin for new work remains **TypeScript 5.9.x** with **`strict`: true**. Brownfield repos may still run older `tsc` or looser configs—**name the pin** when you inherit a system.

Staff hire TypeScript for three practical pillars this track stressed: **errors that fail in CI**, **honest file/I/O tooling**, and **faster code plus faster builds**. Everything below is those pillars under different job titles.

**Reader payoff:** after this chapter you should name **what you can write today** with TypeScript alone, and **which official door** to open next (React, Next, Nest, …) without confusing those doors with this language track. The concrete routing table lives in chapter **22** and the [README](./README.md#after-this-track--what-you-can-write).

---

## 1. Concepts

### 1. Why teams reach for TypeScript

TypeScript survives fashion cycles where three properties matter:

1. **Static contracts** — refactors and API boundaries break in the checker, not only in production.
2. **JavaScript interop** — emit is still JS for Node, browsers, and existing libraries.
3. **Ecosystem gravity** — editors, CI, and package types assume TS literacy.

Staff rarely choose TypeScript to invent a new runtime. Staff choose it so a growing JS codebase stays **navigable** under many authors.

### 2. Role lenses (same repo, different questions)

| Role | Primary question | Failure that hurts them |
|------|------------------|-------------------------|
| **Software engineer** | Is this maintainable, tested, and honest under `strict`? | `any` culture; untyped boundaries |
| **Operations** | Will this CLI/service behave on the pinned image at 2 a.m.? | Bad config parsing; secret leaks in logs |
| **Security** | What can untrusted input and deps make this process do? | `as Config` skips; supply-chain blind spots |
| **Application owner** | Does typing expand delivery speed without freezing product change? | Over-clever types; week-long compile times |
| **Systems / platform** | How do packages, modules, and runtimes share contracts? | Wrong `moduleResolution`; dual ESM/CJS mess |

Read the rest of this chapter once through each lens on your real repo.

### 3. Domain map (orientation)

```text
                         ┌─ Web / React surfaces ─── typed props, DOM lib split
                         ├─ Node services ────────── APIs, workers, queues
TypeScript appears as ───┼─ CLIs / repo tooling ──── fs, paths, abort, config
                         ├─ Shared libraries ─────── .d.ts, semver of types
                         ├─ Control-plane glue ───── automation with strict edges
                         └─ Cross-team contracts ─── DTOs, OpenAPI-adjacent types
```

Domains overlap: a platform team may publish a typed SDK consumed by a React app and a Node worker.

### 4. Product web and mixed UI

Typical jobs:

- Application UI with React (or similar) and shared DTO packages.
- Design-system libraries that emit declarations for many apps.
- BFF (backend-for-frontend) services in Node with the same types as the client carefully split by package.

Success looks like: DOM/`jsx` confined to UI packages (chapter **19**), validation on the server, CI typecheck + Vitest/Jest (chapter **18**). Failure looks like: one mega tsconfig with DOM + Node + `any` for “speed.”

### 5. Node services and workers

Typical jobs:

- HTTP APIs, consumers, cron workers.
- Auth and session services that must fail closed on bad input.
- Long-running processes that need abort and backpressure literacy (chapter **12**).

Success looks like: `unknown` at JSON boundaries, typed error codes for clients, `@types/node` pinned to the runtime (chapters **11**, **16**). Failure looks like: trust client-supplied types as authorization.

### 6. CLIs and internal tooling (file pillar home)

Typical jobs:

- Codegen, migration scripts, developer CLIs.
- Log processors and artifact wranglers.
- Glue that reads/writes repo files in CI.

Success looks like: `fs/promises`, path discipline, encoding honesty, temp dirs in tests (chapter **14**). Failure looks like: sync `readFileSync` of unbounded files on the request path of a service that “temporarily” reused a script.

### 7. Shared libraries and platform SDKs

Typical jobs:

- Internal npm packages with emitted `.d.ts`.
- Public open-source libraries where types are part of the product.
- Wrappers around vendor SDKs with narrower, safer surfaces.

Success looks like: `declaration` emit, clean `exports`, semantic versioning that treats breaking type changes as breaking (chapter **17**). Failure looks like: shipping JS only and hoping DefinitelyTyped keeps up.

### 8. Control-plane and automation-adjacent use

TypeScript shows up next to infrastructure work when teams automate cloud APIs, ticket glue, or compliance checks in Node. This handbook is **not** an IaC course; the TS angle is the same:

- Strict config parsing.
- Secrets from the environment/vault (chapter **20**).
- Predictable exit codes and typed errors for humans and CI.

Prefer official cloud SDKs’ own types when present; wrap them instead of re-declaring the world.

### 9. Cross-team contracts

| Mechanism | TS role |
|-----------|---------|
| Shared DTO package | Single source for field names and unions |
| OpenAPI / JSON Schema codegen | Types as build artifacts—own the generator pin |
| Event payloads on a bus | Discriminated unions + exhaustiveness (`never`) |
| “Types only” packages | Emit declarations; keep runtime deps minimal |

Contracts fail when one team uses `strict` and the other uses `as any` at the edge. Agree on boundary rules, not only on folder structure.

### 10. The three pillars as hiring signals

When organizations say they want “strong TypeScript,” they usually mean:

| Pillar | What “good” looks like on a team |
|--------|-----------------------------------|
| **Error handling** | `unknown` in `catch`, typed failures, no empty catches, async rejections handled |
| **File / I/O handling** | Safe path/encoding habits; streams when size hurts; tests on fixtures |
| **Faster code & builds** | Incremental/`composite` where needed; `satisfies`; shallow types; early abort |

Chapters **11–14** were the spine; domains above are where those habits earn their keep.

### 11. Capstone — what you can write with *this* track alone

Use this as a self-check before chasing frameworks. If you cannot tick a row, return to the spine chapters—do not paper over gaps with Next.js tutorials.

| Artifact you should be able to write | Minimum bar | If stuck, re-read |
|--------------------------------------|-------------|-------------------|
| **Hello → `tsc` → run emit** | Pin, `strict`, explain erase | **00–02** |
| **Typed config / options object** | Literals + `satisfies` or closed union; no `as Config` on JSON | **06–07**, **11**, **15** |
| **CLI that reads/writes files** | `fs/promises`, path rules, encoding, tests on fixtures | **14**, **11**, **18** |
| **Async job with cancel** | `async`/`await`, `AbortSignal`, honest `catch` | **12**, **11** |
| **Small HTTP/JSON edge** | Body as `unknown` → parse → branded/DTO types | **11**, **16** |
| **Internal npm-ish package** | Modules, declarations, consumer-visible breaks | **10**, **17** |
| **PR review on `.tsx`** | Props/events literacy; flag DOM in Node packages | **19** |

**What this track does *not* claim you can write yet:** production React component architecture, Next.js routing/RSC/deployment, Nest module graphs, or a bundler from scratch. Those are **complement** skills—chapter **22** names the official next reads so TypeScript stays the foundation underneath them.

---

## 2. Advanced concepts

### 1. Brownfield gravity

Many production monorepos still have:

- TypeScript **4.x / early 5.x** pins,
- `moduleResolution: node` legacy,
- `strict` partially enabled,
- Jest-only testing,
- sporadic `skipLibCheck` without documentation.

Advanced practice: treat upgrades as **projects** with release notes (5.9.x when you move), dual CI if needed, and package-by-package `strict` ratification—not a drive-by `npx tsc --init`.

### 2. Ownership boundaries

| Surface | Owner habit |
|---------|-------------|
| Public props / DTOs | Change via semver + consumer CI |
| Ambient `declare module` shims | Ticket + expiry; prefer upstream types |
| CI `tsc` graph | Platform team owns wall clock (chapter **15**) |
| Secret-bearing scripts | Security + ops review (chapter **20**) |

Orphan typed shims are how monorepos rot.

### 3. When TypeScript is the wrong hammer

Prefer not to force TS when:

- A ten-line shell script has no reuse path (unless your org standardizes on TS CLIs).
- The runtime is a host language with its own type story and TS would be a thin FFI veneer without payoff.
- Compile times already crush the team and nobody will fund project references—fix the process before adding more type meta-programming (chapter **16**).

### 4. Measuring health without vanity metrics

| Signal | Useful? |
|--------|---------|
| `strict: true` coverage across packages | Yes |
| `any` count trend at boundaries | Yes |
| Lines of conditional types | No — often inverse quality |
| Test + typecheck CI required | Yes |
| “100% type coverage” marketing tools | Skeptical — prefer boundary discipline |

### 5. Framework fashion vs language skill

Next.js, Nest, Remix, and friends cycle. The transferable skills from this track:

- tsconfig honesty,
- module literacy,
- error/file/speed pillars,
- declaration publishing,
- supply-chain review.

Framework docs teach routing; this track teaches why the PR compiles and still fails closed.

### 6. Hiring and review culture

Staff interviews that only ask “what is an interface?” miss the job. Better prompts:

- How do you type an HTTP JSON body?
- How do you keep `tsc` fast in a monorepo?
- How do you pin `@types/node` to production Node?
- Show a bad `catch` and fix it.

Align interview loops with pillars **11–14**, not trivia from chapter **03** alone.

### 7. Team topologies that work

| Topology | TS practice that fits |
|----------|----------------------|
| Feature teams + platform | Platform owns base tsconfigs, lint, CI typecheck graph |
| Strong lib team | Semver for types; consumer CI gates on declaration breaks |
| Many small services | Shared DTO package with careful owners; avoid copy-paste interfaces |
| Monolith module owners | `strict` ratification module-by-module; no global `any` holiday |

Platform should not invent types for every product field. Product should not fork tsconfig policy without a written exception.

### 8. Anti-patterns by domain

| Domain | Anti-pattern | Better |
|--------|--------------|--------|
| UI | One repo-wide DOM+Node tsconfig | Split packages (chapter **19**) |
| CLI | Untyped `process.argv` forever | Parse to a closed options type |
| API | `as Response` on `fetch` | Narrow status + JSON `unknown` |
| Lib | Breaking `.d.ts` in a patch | Major bump or compat shim |
| Ops script | Secrets in the script body | Env/vault + chapter **20** |

---

## 3. Applications and use cases

### Application engineering

- Feature teams ship UI + BFF with shared DTOs.
- Progressive `strict` adoption on the modules they touch weekly.
- Product analytics events as string-literal unions so renames fail CI.

### Systems engineering

- Workers and CLIs share pure packages; host adapters stay thin.
- Resource limits and abort signals are part of typed public APIs.
- Backoffice importers stream files; types document encoding and size limits.

### Security engineering

- Lockfile review, secret hygiene, rejection of unvalidated merges (chapter **20**).
- Types that make illegal states harder—without claiming types are a sandbox.
- Red-team style review of admin CLIs that can write production config.

### Operations

- Runbooks name `tsc` version, Node version, and config env keys.
- Failures exit non-zero with stable error codes.
- On-call dashboards treat typecheck CI breakage as a deploy blocker, not noise.

### Software engineering leadership

- Invest in project references before hiring another engineer to “wait for CI.”
- Budget DefinitelyTyped/upstream type fixes like any other dependency work.
- Celebrate deletions of `any` and ambient shims in changelogs—they are reliability work.

| Domain | Pillar emphasis |
|--------|-----------------|
| UI app | Errors in forms/API clients; build speed |
| CLI | Files + errors |
| Library | Declarations + speed of consumer compile |
| Worker | Async errors + abort; careful I/O |
| Automation | Secrets + files + fail-closed errors |

### Personal learning path (TS first, then product surface)

| You are… | Write next with TypeScript | Then complement with |
|----------|----------------------------|----------------------|
| Ops / tooling | CLI + file pipelines (**14**) | Host APIs / cloud SDKs (their docs) |
| Backend | Worker/API edges (**11–13**) | Nest/Express/Fastify **official** guides |
| Full-stack / web | Shared DTOs + BFF in Node | [react.dev](https://react.dev/) → [Next.js docs](https://nextjs.org/docs) |
| Library author | `.d.ts` + semver (**17**) | Publishing + API Extractor-style docs as needed |
| JS-weak | Stay on **03–12**; add [JavaScript](../JavaScript/README.md) | DOM/React only after JS comfort |

---

## 4. Staff-level review checklist

- Reader (or mentee) can name **one artifact** they can ship from the capstone table—not only “I know interfaces.”
- Domain and **runtime host** (browser vs Node) named in the PR.
- Boundary validation present; no `as` through trust edges.
- Pillars visible: errors handled, files safe, builds not regressing without note.
- Package ownership clear for shared types.
- Brownfield pins documented when not on **5.9.x** / `strict`.
- Tests + typecheck both required in CI for touched packages.
- Secrets and deps reviewed on automation/CLI changes.
- UI changes keep DOM libs out of Node packages.
- Library changes consider declaration consumers.
- Clever mapped/conditional types justified—or simplified.

---

## References

- [TypeScript Handbook — Intro](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [React — Documentation](https://react.dev/)
- [Next.js — Docs](https://nextjs.org/docs) — after React; not a substitute for chapters **11–15**
- [Vitest Guide](https://vitest.dev/guide/)
- [TypeScript Blog](https://devblogs.microsoft.com/typescript/)
