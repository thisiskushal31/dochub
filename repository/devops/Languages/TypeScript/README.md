# TypeScript

[← Back to Languages](../README.md)

**TypeScript** is JavaScript with a **static type system** that runs *before* your program runs. You write `.ts` (or typed `.tsx`); the compiler (`tsc`) checks that values match the shapes you declared, then **erases** types so the runtime is ordinary JavaScript—in Node, the browser, or whatever host you target.

After **JavaScript**, TypeScript is the language most teams reach for when a codebase outgrows “it works in my console.” Dashboards, CLIs, control-plane services, and shared libraries use it so refactors and API boundaries fail in CI—not at 2 a.m. in production.

This track teaches **language + `tsc` / `tsconfig` + Node tooling literacy**, with pillars people actually get paid for:

1. **Error handling** — `unknown` in `catch`, typed failures, exhaustiveness, async rejections (chapter **11**, woven through **04** / **12**).
2. **Runtime performance on the machine** — work vs wait, event loop, hot paths, and **every language construct’s cost** (loops, arrays, objects, functions, classes—not only `async`). Seeded in chapters **03–10**; gathered in chapter **13**.
3. **File and I/O handling** — `fs/promises`, paths, streams, bytes/encoding (chapter **14**).
4. **Faster builds / typecheck** — incremental compile, project references, type-cost hygiene (chapter **15**).

**How performance is taught:** each core language chapter includes a short **“Runtime cost (learn early)”** note so beginners do not wait until “advanced” to hear what seniors optimize. Chapter **13** is the deep home when you are ready for more.

It is **not** a React/Next design course, a bundler encyclopedia, or a Deno/Bun book. Chapter **22** is the **compass** for those doors. Prefer the [JavaScript](../JavaScript/README.md) track if you need deep JS/DOM fundamentals first—this track still starts from a clear doorway.

Start at chapter **00**. First goal: know which `tsc` is on your PATH, run a hello, and feel types disappear at emit. After chapter **12**, read **13** before you chase micro-syntax for “speed.”

---

## After this track — what you can write

Finish **00–22** and you should be able to **author and review** real TypeScript work—not only recite syntax. Concrete targets:

| You can write / ship… | What “done” looks like | Spine chapters |
|-----------------------|------------------------|----------------|
| A **typed Node CLI or script** | `strict` project, honest `catch`, argv/config parsed to a closed type, safe paths/bytes | **02**, **11**, **14** |
| A **small service or worker** | JSON in as `unknown` + validate, `AbortSignal`, bounded concurrency, typed exit/errors | **11**, **12**, **13** |
| A **shared library / DTO package** | Emitted `.d.ts`, clean `exports`, consumers break in CI on bad changes | **10**, **16**, **17** |
| A **strict app or monorepo package** | Explained `tsconfig`, CI `tsc --noEmit`, no casual `any` at boundaries | **02**, **15**, **20** |
| **Type-aware tests** | Vitest/Jest habits that check behavior *and* types where it matters | **18** |
| A **UI PR review** (not a UI redesign) | Read `.tsx` props/events, keep DOM/`jsx` out of Node packages | **19** |

Chapter **21** maps these to job roles. Chapter **22** tells you what this track does **not** replace.

---

## What to learn next (complement paths)

TypeScript is the **typed JS layer**. Product UIs and frameworks sit **on top**—learn them after (or beside) this track, not instead of it.

| If your goal is… | Learn next (official home) | Bring from this track |
|------------------|----------------------------|------------------------|
| Stronger JS/DOM first | [JavaScript](../JavaScript/README.md) track + [MDN](https://developer.mozilla.org/) | Erasure, modules, async literacy |
| React UI craft | [react.dev](https://react.dev/) after chapter **19** | Props as object types, narrowing, `unknown` at fetch |
| Next.js / full-stack React | [Next.js docs](https://nextjs.org/docs) | Split DOM vs Node tsconfigs; server validation ≠ types alone |
| Node APIs / Nest-style servers | [Node.js docs](https://nodejs.org/docs/latest/api/) + framework docs (e.g. [Nest](https://docs.nestjs.com/)) | Errors, async/abort, file I/O, `strict` |
| Fast front-end tooling | [Vite](https://vite.dev/) (or your bundler’s docs) | Who typechecks vs who bundles (**15**, **22**) |
| Alternate runtimes | [Deno](https://docs.deno.com/) / [Bun](https://bun.sh/docs) | Same pillars; still CI typecheck (**22**) |
| Stay language-deep | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) + release notes | Pin **5.9.x**; re-read **11–15** on upgrade |

**Suggested order for a web engineer:** this TypeScript track → chapter **19** literacy → **react.dev** → your meta-framework (Next, etc.) → keep returning here when `tsc`, modules, or errors hurt.

---

## Versions and brownfield (default narrative)

**Default for new work: TypeScript 5.9.x** with **`strict`: true**. Pin the exact patch CI uses (`tsc -v`). Looser legacy configs (`noImplicitAny: false`, old `moduleResolution: node`) are **brownfield literacy**—migrate deliberately.

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| **TS 5.9.x** + `strict` | New packages & apps | Default narrative |
| Older 5.x / 4.x | Long-lived monorepos | Literacy; read release notes on upgrade |
| `module` / `moduleResolution` **nodenext** or **bundler** | Node libs vs apps | Match the runtime (ch **02**) |
| `@types/node` matched to Node | Tooling / servers | Pin with the Node line you ship |

```bash
# Discover what you actually have
command -v tsc
tsc -v
node -v
```

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, platform nuance, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (five ideas)

1. **Types are erased.** Runtime is JS; types do not exist at runtime unless you add runtime checks.
2. **Narrowing is how you stay safe.** Control flow + guards turn unions into working code (and better errors).
3. **`unknown` is safer than `any`.** Especially in `catch` and at trust boundaries.
4. **Modules and `tsconfig` are part of the language experience.** Wrong `module` settings feel like “TS is broken.”
5. **Performance has two clocks—and every construct has a bill.** **Runtime** (ch **13**, seeded in **03–10**: loops, arrays, objects, functions…) vs **compile** (ch **15**). Name which one you mean.

| Idea | Review smell if missing | Home chapters |
|------|-------------------------|---------------|
| Erasure | Expecting types to validate HTTP bodies alone | **01**, **11** |
| Narrowing | Force casts instead of guards | **04**, **11** |
| `unknown` | `catch (e: any)` / empty catches | **11**, **12** |
| tsconfig honesty | Copy-pasted config nobody can explain | **02**, **15** |
| Two clocks | Optimizing syntax while the DB waits; ignoring event-loop block | **13**, **14**, **15** |

---

## How to read this section

Read in **number order**. Doorway → type system → **pillars (11–15)** → advanced types / decls / tests → surface / security → use cases → compass.

If you already know modern JS well, you can move faster through **03–07**, but **do not skip 11–15**. Read the **Runtime cost** notes in **03–10** as you go; use chapter **13** when you want the full machine picture. Especially **13**—that is the senior “money” chapter in beginner language.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Doorway** | 00 → 02 | Run `tsc`, explain TS vs JS, pin tsconfig/modules |
| **Type system core** | 03 → 10 | Everyday types through modules/generics/classes |
| **Pillars** | 11 → 15 | Errors, async, **runtime speed on the machine**, file I/O, faster builds |
| **Advanced / ecosystem** | 16 → 20 | Mapped types, `.d.ts`, tests, DOM/React door, security |
| **Synthesis** | 21 → 22 | What you can write now; roles; **what to learn next** |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 00 | First steps: toolchain and hello | [00_First_Steps_Toolchain_And_Hello.md](./00_First_Steps_Toolchain_And_Hello.md) |
| 01 | What TypeScript is and why it exists | [01_What_Is_TypeScript_And_Why_It_Exists.md](./01_What_Is_TypeScript_And_Why_It_Exists.md) |
| 02 | tsconfig, modules, and compiler pin | [02_Tsconfig_Modules_And_Compiler_Pin.md](./02_Tsconfig_Modules_And_Compiler_Pin.md) |
| 03 | Everyday types and type system basics | [03_Everyday_Types_And_Type_System_Basics.md](./03_Everyday_Types_And_Type_System_Basics.md) |
| 04 | Narrowing, type guards, and control flow | [04_Narrowing_Type_Guards_And_Control_Flow.md](./04_Narrowing_Type_Guards_And_Control_Flow.md) |
| 05 | Functions, call signatures, and overloads | [05_Functions_Call_Signatures_And_Overloads.md](./05_Functions_Call_Signatures_And_Overloads.md) |
| 06 | Objects, interfaces, and type aliases | [06_Objects_Interfaces_And_Type_Aliases.md](./06_Objects_Interfaces_And_Type_Aliases.md) |
| 07 | Unions, intersections, literals, and enums | [07_Unions_Intersections_Literals_And_Enums.md](./07_Unions_Intersections_Literals_And_Enums.md) |
| 08 | Generics, constraints, and inference | [08_Generics_Constraints_And_Inference.md](./08_Generics_Constraints_And_Inference.md) |
| 09 | Classes, this, and heritage | [09_Classes_This_And_Heritage.md](./09_Classes_This_And_Heritage.md) |
| 10 | Modules, imports, exports, and interop | [10_Modules_Imports_Exports_And_Interop.md](./10_Modules_Imports_Exports_And_Interop.md) |
| 11 | **Error handling:** unknown, never, and results | [11_Error_Handling_Unknown_Never_And_Results.md](./11_Error_Handling_Unknown_Never_And_Results.md) |
| 12 | Async, promises, abort, and concurrency | [12_Async_Promises_Abort_And_Concurrency.md](./12_Async_Promises_Abort_And_Concurrency.md) |
| 13 | **Runtime performance:** what the machine pays for | [13_Runtime_Performance_What_The_Machine_Pays_For.md](./13_Runtime_Performance_What_The_Machine_Pays_For.md) |
| 14 | **File I/O:** streams, paths, and bytes | [14_File_IO_Streams_Paths_And_Bytes.md](./14_File_IO_Streams_Paths_And_Bytes.md) |
| 15 | **Faster builds:** incremental typecheck | [15_Performance_Faster_Builds_And_Typecheck.md](./15_Performance_Faster_Builds_And_Typecheck.md) |
| 16 | Utility, mapped, conditional, and template types | [16_Utility_Mapped_Conditional_And_Template_Types.md](./16_Utility_Mapped_Conditional_And_Template_Types.md) |
| 17 | Declaration files and DefinitelyTyped | [17_Declaration_Files_And_DefinitelyTyped.md](./17_Declaration_Files_And_DefinitelyTyped.md) |
| 18 | Testing: type-aware Vitest and Jest | [18_Testing_Type_Aware_Vitest_And_Jest.md](./18_Testing_Type_Aware_Vitest_And_Jest.md) |
| 19 | DOM / React surface literacy | [19_DOM_React_Surface_Literacy.md](./19_DOM_React_Surface_Literacy.md) |
| 20 | Security, supply chain, and safe config | [20_Security_Supply_Chain_And_Safe_Config.md](./20_Security_Supply_Chain_And_Safe_Config.md) |
| 21 | Use cases and engineering perspectives | [21_Use_Cases_And_Engineering_Perspectives.md](./21_Use_Cases_And_Engineering_Perspectives.md) |
| 22 | Where TypeScript is going and adjacent doors | [22_Where_TypeScript_Is_Going_And_Adjacent_Doors.md](./22_Where_TypeScript_Is_Going_And_Adjacent_Doors.md) |

---

## Further reading

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [React — Documentation](https://react.dev/) — UI craft **after** this track / ch **19**
- [Next.js — Docs](https://nextjs.org/docs) — meta-framework door (not taught here)
