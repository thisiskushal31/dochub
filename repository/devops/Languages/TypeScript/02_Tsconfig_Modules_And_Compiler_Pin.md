# tsconfig, modules, and compiler pin

[← Back to TypeScript](./README.md)

## What this chapter covers

`tsconfig.json` is where TypeScript stops being “a syntax” and becomes **a project**. By the end you should be able to:

1. Explain what **`tsconfig.json`** controls (and what it does not).
2. Pin **TypeScript 5.9.x** with **`strict`: true** for new work.
3. Read the spirit of **`tsc --init`** in 5.9 (prescriptive, not a wall of comments).
4. Choose **`module` / resolution** literacy: **`nodenext`** vs **`bundler`** (and when **`node20`** appears).
5. Know which knobs affect **CI speed** vs **emit shape** vs **checking strictness**.

Fuzzy config here is the #1 reason teams say “TypeScript is broken.” It usually isn’t—the project file is.

---

## 1. Concepts

### 1. What `tsconfig.json` is

A **project configuration** that tells `tsc`:

- which files belong to the program,
- how to **resolve modules**,
- how strict checking is,
- what to **emit** (JS, declarations, source maps)—or whether to emit at all.

You run:

```bash
npx tsc -p .
# or
npx tsc --project tsconfig.json
```

Without a config, one-off `tsc file.ts` flags work for hello; they do not scale to a team.

### 2. Minimum mental model

| Area | Questions it answers |
|------|----------------------|
| **Files** | `include` / `exclude` / `files` — what is in the program? |
| **Strictness** | `strict` and friends — how many footguns are errors? |
| **Modules** | `module`, `moduleResolution`, `verbatimModuleSyntax` — how do imports work? |
| **Emit** | `outDir`, `declaration`, `sourceMap`, `noEmit` — what artifacts? |
| **Environment** | `lib`, `types`, `jsx` — DOM? Node? JSX? |

### 3. Handbook pin

For **new** packages and apps in this track:

| Setting | Habit |
|---------|-------|
| TypeScript package | **5.9.x** (`~5.9.0` or exact CI patch) |
| `strict` | **`true`** |
| Modules | Match the **runtime**: Node library → **`nodenext`** (or stable **`node20`**); bundler app → often **`bundler`** |

### 4. TypeScript 5.9 `tsc --init` spirit

In **5.9**, plain `tsc --init` generates a **short, opinionated** config—not the old encyclopedia of commented options. The spirit of that default (exact comments may vary by patch):

- **`module`: `"nodenext"`** — modern Node module rules by default  
- **`target`: `"esnext"`** — modern emit target (pin lower if you must)  
- **`strict`: true** — checking bar on  
- **`types`: []** — do not auto-pull every `@types/*` from `node_modules`  
- **`noUncheckedIndexedAccess`** / **`exactOptionalPropertyTypes`** — stricter correctness knobs on  
- **`verbatimModuleSyntax`**, **`isolatedModules`**, **`moduleDetection`: `"force"`** — bundler/transpile-friendly honesty  
- **`skipLibCheck`: true** — skip full checking of `.d.ts` in dependencies (speed; tradeoff below)  
- Outputs: **`sourceMap`**, **`declaration`**, **`declarationMap`** often on for libraries  
- **`jsx`: `"react-jsx"`** present for JSX users—turn off or ignore if you are not in UI land  

Node apps should still add what the init comments suggest: install **`@types/node`**, set **`types`: `["node"]`** (and usually **`lib`**) deliberately—not by hoping ambient types appear.

```bash
npm install -D typescript@~5.9.0
npx tsc --init
# then edit: rootDir/outDir, types for Node, jsx if unused, etc.
```

You do not need to keep every init default forever. You **do** need to know why each kept line exists.

### 5. `nodenext` vs `bundler` (literacy table)

| Mode | Typical home | What you optimize for |
|------|----------------|------------------------|
| **`module` / resolution `nodenext`** | Node libraries & many Node apps | Match Node’s ESM/CJS rules; extensions in relative imports often required |
| **`moduleResolution: "bundler"`** (with a bundler `module`) | Vite/webpack/etc. apps | Resolution that matches bundlers; emit may be owned by the bundler |
| **`module: "node20"`** (5.9+) | Pin behavior to **Node 20** semantics | Stable target vs floating `nodenext` |

**Rule of thumb:** if Node will **execute** your emit directly, prefer Node-shaped settings. If a **bundler** rewrites everything, `bundler` resolution is often honest—still run `tsc --noEmit` for types.

### 6. Small lab — project check

```bash
mkdir ts-config-lab && cd ts-config-lab
npm init -y
npm install -D typescript@~5.9.0
npx tsc --init
```

Add `src/index.ts`:

```ts
export function greet(name: string): string {
  return `hello ${name}`;
}

console.log(greet("world"));
```

Uncomment or set `"rootDir": "./src"`, `"outDir": "./dist"`, then:

```bash
npx tsc -p .
node dist/index.js
```

---

## 2. Advanced concepts

### 1. What `strict` actually turns on

`strict: true` is a **bundle** of checks (including `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and related flags). Turning `strict` off to “make CI green” disables a family of guarantees at once. Prefer fixing types—or a **tracked** path to strict—over silent downgrade.

### 2. `skipLibCheck`

| On (common) | Off |
|-------------|-----|
| Faster; ignores many dependency declaration conflicts | More thorough; can surface broken `@types` |

Security/ops note: `skipLibCheck` is not a substitute for reviewing dependency trust. It only skips **typechecking** `.d.ts` files.

### 3. `types: []` vs ambient pollution

An empty `types` array means “do not automatically include all `@types` packages.” That prevents surprise globals. For Node, **explicitly** list `"node"` after installing `@types/node`.

### 4. `verbatimModuleSyntax` and type-only imports

With verbatim-style settings, **type-only** imports must be marked (`import type { … }`) so emit and bundlers do not keep runtime imports that only existed for types. This is noisy at first and honest afterward.

### 5. `noEmit` vs library emit

| Kind of package | Common pattern |
|-----------------|----------------|
| App with Vite/webpack | `noEmit: true` + bundler emit; `tsc` for check |
| Published library | `declaration: true`, clear `outDir`, tested on Node target |
| Monorepo | Project **references** + `composite` (chapter **15**) |

### 6. Path aliases

`paths` in tsconfig help the **typechecker**. Runtime Node may **not** understand them unless you also configure a loader/bundler. Aliases that typecheck but fail at runtime are a classic footgun—document the runtime half.

### 7. Extends and solution-style configs

`extends` shares base options across packages. Solution-style roots and project references keep large repos incremental. Wrong `include` globs pull test files into production programs—or miss `src` entirely.

### 8. Brownfield resolution names

Older docs show `moduleResolution: "node"` (classic). Treat it as **legacy literacy**. New work should not copy it without a reason tied to an old toolchain.

### 9. Composite projects and `incremental` (preview)

Large monorepos use **`composite`**, **`incremental`**, and **project references** so `tsc` rebuilds only what changed. Mis-set `rootDir` / reference edges cause “need to build dependency first” loops. chapter **15** is the performance spine; here, know that config shape **is** build performance.

### 10. Effective options when debugging

When CI and laptop disagree:

```bash
npx tsc -p . --showConfig
npx tsc -v
```

`--showConfig` prints the **merged** options after `extends`. Many “mystery” errors are an unexpected base config or a second `tsconfig` in a parent folder.

### 11. `lib` vs `target` vs runtime

`target` influences emit downleveling. `lib` chooses which **built-in type** APIs exist (ES features, DOM). You can target an older emit while including a newer `lib` (or the reverse)—and confuse yourself. Align `lib` / `types` with the **actual** runtime and DOM needs of that package.

### 12. `erasableSyntaxOnly` — strip-friendly TypeScript (5.8+)

Node’s type-stripping / “run `.ts` with types erased” path only accepts TypeScript syntax that **erases cleanly**—no runtime-emitting TS constructs. TypeScript **5.8+** adds **`erasableSyntaxOnly`**: the checker errors on common offenders so you find them in CI, not at first strip-run.

| Usually blocked under erasable-only | Prefer instead |
|-------------------------------------|----------------|
| `enum` | String unions / `as const` objects (ch **07**) |
| Parameter properties (`constructor(public x: number)`) | Explicit fields + assignment |
| `namespace` / `module` with runtime code | ES modules (ch **10**) |
| `import =` / `export =` | ESM `import` / `export` |

Pair with **`verbatimModuleSyntax`** when you care about honest import emit. Staff rule: **stripping is not typechecking**—still run `tsc --noEmit` (chapter **22** door).

### 13. `module` pins: `node18` vs `nodenext` (literacy)

Stable **`module` / `moduleResolution`: `node18`** (TS 5.8+) freezes Node-18-era rules. **`nodenext`** tracks newer Node interop (including `require()` of many ESM graphs on supported Node lines). Library authors on older Node stay on a stable `node16`/`node18` pin; apps on Node 22+ often want `nodenext` and verify against current release notes.

---

## 3. Applications and use cases

| Angle | How tsconfig shows up |
|-------|------------------------|
| **Application** | App vs library configs diverge (DOM `lib` vs Node `types`). |
| **Systems** | Emitted module format must match the process supervisor / package `"type"`. |
| **Security** | Accidental broad `types` pull; dependency `.d.ts` trust; secrets never in config comments that get published. |
| **Ops** | CI caches keyed on lockfile + `tsconfig`; print effective options when debugging. |
| **SE** | Config is reviewed like code—drive-by `strict: false` is a process failure. |

**Whole-engineering picture:** module settings are an **interface** between TypeScript and the host. Get them wrong and every import error looks like a language bug.

---

## Staff-level review checklist

- `typescript` version is **pinned** (5.9.x for new work) and CI prints `tsc -v`.
- **`strict`: true** for new packages; exceptions are documented with an exit plan.
- `module` / resolution choice is **explained** (`nodenext` / `node20` / `bundler`)—not cargo-culted.
- Node projects set **`@types/node`** and explicit `types` / `lib` deliberately.
- `tsc --noEmit` (or equivalent) is a **required** CI gate even when a bundler emits.
- `paths` aliases have a matching **runtime** story.
- `skipLibCheck` is a conscious tradeoff, not an invisible default nobody owns.
- Init leftovers that do not apply (`jsx` in a pure Node lib, etc.) are cleaned or justified.
- If the runtime strips types, `erasableSyntaxOnly` (and honest module syntax) are considered—not only “it typechecks under full `tsc` emit.”
- Reviewers can answer: “What does this config emit, and who runs it?”

---

## References

- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Modules — annotated reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [Module resolution](https://www.typescriptlang.org/docs/handbook/modules/theory.html)
- [tsc CLI / compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TypeScript 5.8 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html) — `erasableSyntaxOnly`, `node18`, `require(esm)` under `nodenext`
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html) — init defaults, `node20`, `import defer`
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
