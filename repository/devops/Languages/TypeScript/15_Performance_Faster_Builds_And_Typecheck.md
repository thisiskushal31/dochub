# Performance: faster builds and typecheck

[← Back to TypeScript](./README.md)

## What this chapter covers

This chapter is the **compile clock**: how long **`tsc` / CI typecheck / the IDE language service** take. You get incremental and composite projects, project references, `skipLibCheck` tradeoffs, `satisfies`, avoiding expensive types, and how to **measure** compiles.

**Runtime speed on the machine** (event loop, wait vs work, hot paths, what `async` buys)—the skill seniors get paid for day-to-day—lives in chapter **13**. Read **13** first if your API is slow; read **this** chapter when CI or the editor is slow.

Pins: **TypeScript 5.9.x**, **`strict`: true**. Cross-links: generics cost (**08**), async (**12**), runtime (**13**), file I/O (**14**).

You leave able to speed up typecheck deliberately—without turning off safety or confusing “faster `tsc`” with “faster Node.”

---

## 1. Concepts

### 1. Two clocks, two dashboards

| Clock | What you optimize | Typical tools |
|-------|-------------------|---------------|
| **Compile-time** | `tsc` / IDE checking | incremental, project references, narrower graphs, simpler types |
| **Run-time** | latency, CPU, I/O wait | algorithms, abort, async I/O, fewer allocations |

Types erase: a clever conditional type does not make Node faster at runtime. It can make **CI** slower. Conversely, perfect `tsconfig` will not fix `readFileSync` in a hot handler—that is chapter **13** / **14**.

Staff conversations should name which clock they mean: **runtime (13)** vs **compile (this chapter)**.

### 2. What `tsc` does that costs

Rough pipeline cost centers:

1. Parse source.
2. Bind / resolve modules.
3. Type-check (the usual giant).
4. Emit (if not `noEmit`).

Large dependency graphs, pathologically complex types, and checking `.d.ts` from `node_modules` dominate many monorepos. Measure before rewriting architecture (section on diagnostics below).

### 3. Incremental compilation

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

`incremental` stores a **build info** graph so subsequent runs reuse prior work. Use in local loops and CI caches (cache the `.tsbuildInfo` keyed by sources + lockfile + TS version).

Caveats:

- Corrupt or stale build info after weird crashes → delete and rebuild.
- Cache keys must include **TypeScript version** and relevant config hashes.
- Incremental helps most when the change set is small.

### 4. `composite` and project references

**Project references** split a codebase into buildable projects with clear boundaries:

```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/cli" }
  ]
}
```

Referenced projects typically set:

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true
  }
}
```

Build with:

```bash
tsc -b
tsc -b --force
tsc -b --verbose
```

| Benefit | Why |
|---------|-----|
| Smaller check surfaces | Change `cli` without rechecking unrelated apps the same way |
| Clear dependency edges | Packages declare what they use |
| Parallelism potential | CI can build leaf packages in parallel when graph allows |
| Editor scaling | Solutions open partial graphs |

Costs: more `tsconfig` files; must keep references honest; `composite` implies declaration emit discipline.

### 5. `satisfies` — check without widening away intent

`satisfies` verifies a value matches a type **while preserving** the more specific inferred type:

```ts
const routes = {
  home: "/",
  user: "/users/:id",
} as const satisfies Record<string, string>;

// routes.home is "/" (literal), still checked as Record<string, string>
```

Compare:

```ts
const a: Record<string, string> = { home: "/" }; // home: string
const b = { home: "/" } as const satisfies Record<string, string>; // home: "/"
```

Runtime cost: zero. Compile-time: usually **cheaper and clearer** than deep generic inference for config objects. Prefer `satisfies` for route tables, feature flags, and JSON-like constants (also ch **08** / **15**).

### 6. Runtime: exit early, abort waste

```ts
async function handle(req: Request, signal: AbortSignal): Promise<Response> {
  if (signal.aborted) throw signal.reason ?? new Error("aborted");
  if (req.method !== "GET") return new Response("method", { status: 405 });
  const id = getId(req);
  if (!id) return new Response("bad id", { status: 400 });
  const data = await load(id, signal);
  return Response.json(data);
}
```

Habits:

- Validate cheaply before I/O.
- Pass `AbortSignal` into fetches and `fs` promises.
- Avoid sync filesystem on request paths (ch **14**).
- Prefer streaming large payloads over buffering.

### 7. Lab — measure a cold vs warm `tsc`

```bash
rm -f .tsbuildinfo
time npx tsc -p tsconfig.json --noEmit
time npx tsc -p tsconfig.json --noEmit
npx tsc -p tsconfig.json --extendedDiagnostics --noEmit
```

**What just happened:** second run should benefit from incremental if enabled; diagnostics show where time went.

---

## 2. Advanced concepts

### 1. `skipLibCheck` tradeoffs

```json
{ "compilerOptions": { "skipLibCheck": true } }
```

When `true`, TypeScript skips type-checking of **declaration files** (mostly `node_modules` `.d.ts`).

| Upside | Downside |
|--------|----------|
| Often large CI wins | Won’t catch errors inside `.d.ts` interactions |
| Avoids broken DefinitelyTyped conflicts blocking you | Can hide real incompatibilities between libs |

Staff guidance for **5.9.x** apps:

- Default many production apps to `skipLibCheck: true` for speed **if** you still type-check **your** code strictly.
- Turn it off periodically or in a nightly job when upgrading `@types/*` / TypeScript majors.
- Libraries publishing types should still care about their own `.d.ts` correctness (`declaration` builds without skip for the package itself).

Do not use `skipLibCheck` to paper over `strict` being false.

### 2. Avoid expensive types

Compile-time hotspots:

| Pattern | Why it hurts | Prefer |
|---------|--------------|--------|
| Deep instantiations of recursive conditionals | Checker explosion | Simpler unions; runtime validation |
| Huge union unions (thousands of members) | Assignability cost | Narrower domains; codegen carefully |
| `keyof` over enormous mapped objects | Large keys | Split types; index by id maps |
| Barrel `index.ts` re-exporting the world | Pulls large graphs into checking / bundling | Export leaf modules; thin barrels |
| Types that encode full program state machines | Instantiation blowups | Narrower state types |

Generics are fine; **unbounded type-level computation** is not. If `tsc` pegs CPU on a single file, bisect with `git` and `--generateTrace` (below).

### 3. `isolatedModules` and transpile-only doors

`isolatedModules: true` ensures each file can be emitted alone—required by many bundlers. It forbids some patterns (e.g. const enums in certain modes, re-exports without type modifiers historically).

**Transpile-only** pipelines (`esbuild`/`swc` without typecheck) make **runtime** builds fast but move type safety entirely to a separate `tsc --noEmit` CI job. Staff shape:

1. Fast unit tests via bundler/transform.
2. Mandatory `tsc -b --noEmit` (or emit build) in CI.
3. Never skip (2) because (1) is green.

### 4. Project reference patterns that scale

Monorepo sketch:

```
/tsconfig.json          # solution-style references only
/packages/core/tsconfig.json
/packages/api/tsconfig.json   # references core
/packages/web/tsconfig.json   # references core
```

Rules:

- Depend only **down** the DAG.
- Do not create cycles between projects.
- Prefer building `core` once and consuming `d.ts` rather than re-including source via path hacks.
- In CI, `tsc -b --incremental` with cached build info artifacts.

### 5. Path mapping vs packages

`paths` that point at source of another package can accidentally enlarge the check graph and confuse emit. Prefer workspace packages + references. If you must use `paths` for DX, ensure CI builds the real package graph the same way production does.

### 6. Measuring `tsc` properly

Useful flags:

```bash
tsc --extendedDiagnostics --noEmit
tsc --generateTrace traceDir --noEmit
tsc -b --verbose
tsc --listFilesOnly | wc -l
```

| Signal | Interpretation |
|--------|----------------|
| Files / lines | Graph size |
| Check time vs I/O | CPU vs disk |
| Instantiations | Type-level blowups |
| Trace | Which files/types dominate |

Workflow:

1. Record baseline diagnostics on main.
2. Change one variable (enable incremental, split project, remove barrel).
3. Compare.
4. Keep a short markdown note in the repo’s engineering docs (not this handbook) with the numbers.

### 7. IDE performance vs CI

Editors use language service projects. Fixes that help both:

- Narrow `include` / `exclude` (`exclude` tests from app project if checked separately).
- Disable huge generated folders.
- Prefer project references over one mega `tsconfig`.
- Avoid checking `dist` and `coverage`.

### 8. Runtime performance habits TypeScript enables

Types do not optimize machine code, but they **enable** designs that avoid waste:

| Habit | Type angle |
|-------|------------|
| Exhaustive unions | Impossible states never coded |
| Result for validation | Fail before I/O |
| Branded ids | Fewer wrong-id lookups |
| Readonly surfaces | Safer sharing without defensive copies (careful: still shallow) |
| AbortSignal in APIs | Cancellation becomes part of the contract |

Hot-path anti-patterns:

```ts
// Bad in a server handler
const cfg = JSON.parse(readFileSync("config.json", "utf8"));

// Better: load once at startup, validate, freeze
```

```ts
// Bad: await in serial when independent
for (const id of ids) await fetchOne(id);

// Better: bounded concurrency (ch 12)
await mapPool(ids, 8, fetchOne, signal);
```

### 9. `as const` + `satisfies` vs heavy generics

Config and routing tables often do not need generic frameworks. Literal inference + `satisfies` keeps autocomplete fast and checking cheap.

### 10. Declaration emit cost

`declaration: true` costs time. Libraries need it; apps often use `noEmit` / bundler emit and skip decls. Composite projects require decls—budget for that in CI.

### 11. Caching in CI

Cache:

- `.tsbuildinfo` / per-package build info
- `node_modules` (with lockfile key)
- Not blindly entire `dist` across unrelated branches without keys

Invalidate on:

- TypeScript version bump
- `tsconfig` changes
- Dependency lockfile changes

### 12. When to throw away clever types

If a type takes seconds to check and saves one cast, delete it. Prefer a runtime zod/io-ts/valibot-style validator (or hand parsers from ch **11**) plus a simple interface. Staff priority: **correct + fast enough**, not type olympics.

### 13. Brownfield: enabling incremental safely

1. Enable `incremental` on the slowest package.
2. Cache build info in CI.
3. Introduce solution references for the hottest boundary (`ui` vs `api`).
4. Turn on `skipLibCheck` with a nightly full check if needed.
5. Ban new deep recursive types in review.

### 14. Lab — before/after `satisfies`

```ts
type FeatureFlags = Record<string, boolean>;

// Widens
const flagsA: FeatureFlags = { darkMode: true };

// Preserves literals while checking
const flagsB = { darkMode: true } as const satisfies FeatureFlags;

function takesLiteral(v: true): void {}
takesLiteral(flagsB.darkMode);
// takesLiteral(flagsA.darkMode); // error — boolean
```

**What just happened:** same runtime object, better static precision without custom generics.

### 15. Emit strategies and double work

| Strategy | Compile clock | Risk |
|----------|---------------|------|
| `tsc` emit all packages | Honest, often slower | Simple mental model |
| `tsc --noEmit` + bundler emit | Fast iteration | Must keep configs aligned |
| `tsc -b` composite graph | Scales monorepos | Declaration discipline |
| Transpile-only everywhere | Fastest PR builds | Types optional unless CI enforces |

Double-emitting (`tsc` and bundler both producing JS without clear ownership) wastes CI and causes “which artifact shipped?” incidents. Pick one emit owner per package.

### 16. `assumeChangesOnlyAffectDirectDependencies`

Solution-style builds can use flags that limit rebuild fan-out. They speed CI when the dependency graph is honest—and **lie** when side-effect imports or non-declared deps exist. Enable only when references and imports are clean; validate with a full `--force` build on release branches.

### 17. Type imports keep graphs smaller

`import type` / `verbatimModuleSyntax` avoid pulling runtime modules into emit and help bundlers tree-shake. They also clarify intent for humans. Prefer them when a file only needs shapes (ch **10**). Less runtime graph → less work for bundlers (runtime clock adjacent to compile hygiene).

### 18. Allocation and hot loops (runtime)

TypeScript will not warn you about:

```ts
for (const row of rows) {
  const copy = { ...row, id: String(row.id) }; // allocates per row
}
```

Prefer transforming once, reusing buffers for binary protocols, and avoiding JSON parse/stringify in tight loops. Use profilers (`node --cpu-prof`, clinic, platform APM)—not guesswork—when optimizing runtime.

### 19. Checklist for a slow PR typecheck

1. Did `typescript` or `@types/node` bump?
2. Did someone add a mega-barrel?
3. Diagnostics: files count spike?
4. Is incremental cache cold (first run after clean)?
5. Pathological type in a changed file? (`--generateTrace`)
6. Accidental `include` of `dist` or generated GraphQL monsters?

Fix the first true cause; do not disable `strict` to green the build.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | `satisfies` for route/feature maps; abort navigations; code-split without killing typecheck boundaries |
| **Systems** | Project references per service package; shared `core` built once; bounded concurrency for fan-out |
| **Security** | Do not disable typecheck to ship faster; skipLibCheck ≠ skip audit; still validate untrusted input |
| **Operations** | Cache `tsc -b` artifacts; track typecheck duration SLOs in CI; alert on sudden spikes after TS upgrades |
| **Software engineering** | PR checklist: no new barrels that re-export the monorepo; measure before “optimizing” with `any` |

### Worked flow — cutting CI typecheck from 12m to 3m

1. `--extendedDiagnostics` → huge `node_modules` check time.
2. Enable `skipLibCheck` for PR pipeline; keep nightly full check.
3. Split `admin` and `api` into referenced projects.
4. Enable `incremental` + CI cache on build info.
5. Remove a central `packages/index.ts` mega-barrel.
6. Re-measure; document the new baseline.

### Runtime flow — API handler

1. Parse route params (cheap).
2. Authn/authz (fail closed).
3. Abort if client gone.
4. Async DB with signal/timeout.
5. Stream response when payload large.
6. Never `readFileSync` for per-request templates—compile ahead.

### Editor vs CI contract

Agree as a team:

| Surface | Must pass |
|---------|-----------|
| Local save / IDE | Same `strict` project the package uses |
| PR CI | `tsc -b --incremental` (or `--noEmit`) on affected projects |
| Nightly / release | Full `--force` build; optional `skipLibCheck: false` |
| Publish | Declaration emit for libraries; consumer smoke import |

Drift between “green in VS Code” and “red in CI” usually means different `tsconfig` (solution vs package) or different TypeScript versions—pin both.

---

## Staff-level review checklist

- Which clock is being optimized is explicit (compile vs runtime).
- `incremental` / build info caching considered for CI.
- Project references used when the repo is multi-package and slow.
- `composite` packages emit declarations honestly.
- `skipLibCheck` chosen consciously with a periodic full-check story.
- `satisfies` preferred over widening annotations for const configs.
- No pathological recursive conditional types without measurement.
- Mega-barrels avoided or justified.
- `tsc --extendedDiagnostics` / traces consulted for major slowdowns.
- Transpile-only builds still have CI `tsc --noEmit` / `-b`.
- Hot paths: no sync fs; abort plumbed; early validation before I/O.
- TypeScript version pin included in cache keys.
- Speed wins do not regress `strict` or reintroduce `any` culture (ch **11**).

---

## References

- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [tsc CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TSConfig `incremental`](https://www.typescriptlang.org/tsconfig#incremental)
- [TSConfig `composite`](https://www.typescriptlang.org/tsconfig#composite)
- [TSConfig `skipLibCheck`](https://www.typescriptlang.org/tsconfig#skipLibCheck)
- [Configuring Watch](https://www.typescriptlang.org/docs/handbook/configuring-watch.html)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Node.js File system](https://nodejs.org/docs/latest/api/fs.html) (sync vs async on hot paths)
- [AbortController](https://nodejs.org/docs/latest/api/globals.html#class-abortcontroller)
