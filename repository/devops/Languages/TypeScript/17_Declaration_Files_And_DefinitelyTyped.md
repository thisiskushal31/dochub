# Declaration files and DefinitelyTyped

[← Back to TypeScript](./README.md)

## What this chapter covers

How TypeScript learns about **JavaScript that was not written in TypeScript**: **`.d.ts` declaration files**, **`declare`**, **module vs global** shapes, **publishing types** with your package, and **DefinitelyTyped** / `@types/*` literacy. Default narrative: **TypeScript 5.9.x**, **`strict`: true**, honest `moduleResolution` for your runtime (chapter **02**).

Declarations are a **contract for the typechecker**. They do not ship runtime behavior. Wrong `.d.ts` is a false sense of safety—especially at trust boundaries (chapter **11**) and in dependency graphs (chapter **20**).

---

## 1. Concepts

### 1. What a declaration file is

A **`.d.ts`** file describes types for code that either:

1. already exists as JavaScript, or
2. will exist after emit, and you want consumers to see types without reading `.ts` sources.

Mental model:

> **`.ts`** — implementation + types (types erased on emit).  
> **`.d.ts`** — types only; the checker trusts them as ambient truth.

If the declaration says `foo(): string` but the JS returns a number, TypeScript will not save you at runtime. Declarations are **promises**, not proofs.

### 2. Where types come from (resolution sketch)

When you `import "left-pad"` or `import fs from "node:fs"`, the checker looks for types roughly in this spirit (details depend on `moduleResolution`):

```text
Package "foo"
  ├─ package.json "types" / "exports" conditions  → ship-with-package .d.ts
  ├─ foo.d.ts next to foo.js
  └─ @types/foo (DefinitelyTyped)                → community/ DefinitelyTyped stubs
```

| Source | Meaning |
|--------|---------|
| Types inside the package | Author maintains TS or hand-written `.d.ts` |
| `@types/foo` | Separate package from DefinitelyTyped (usually) |
| Your own ambient `declare module` | Local escape hatch—document why it exists |
| Nothing | Implicit `any` if allowed; error under stricter settings |

Staff habit: prefer **types shipped with the library**. `@types/*` is for JS libraries that never added them—or for platform libs like `@types/node`.

### 3. `declare` — ambient names

**`declare`** introduces a name to the type system without emitting JS for it.

```ts
declare function doSomething(x: string): void;
declare const VERSION: string;
declare class LegacyApi {
  ping(): void;
}
```

Use ambient declarations for globals injected by a host (templates, embedded runtimes, test shims). Prefer **modules** over globals for application code.

### 4. Module declarations vs global scripts

| Style | File flavor | Scope |
|-------|-------------|-------|
| **Module** | Has `import` / `export` | Declarations are file-scoped unless exported |
| **Script / global** | No import/export | Top-level `declare` merges into global scope |

```ts
// ambient module — shapes an untyped package
declare module "legacy-widget" {
  export function render(el: unknown): void;
  export const version: string;
}
```

Wildcard modules appear when many files share a pattern:

```ts
declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}
```

Asset modules are a bundler contract: keep them **narrow** and consistent with what the bundler actually emits.

### 5. DefinitelyTyped and `@types/*`

**DefinitelyTyped** is the community repository that publishes most **`@types/...`** packages to the npm registry. Installing types looks like ordinary deps:

```bash
npm install --save-dev @types/node
npm install --save-dev @types/express   # example — only if the lib needs it
```

| Package | Typical role |
|---------|----------------|
| `@types/node` | Node.js built-ins — pin to the **Node major** you run |
| `@types/<lib>` | Types for a JS library that does not bundle its own |
| Built-in DOM libs | Via `"lib": ["DOM", …]` in tsconfig — not `@types` |

Versioning habit: `@types` packages often use versions that track the **library** API, not TypeScript’s version. Read the package readme when majors disagree. Mismatched `@types/node` vs runtime Node is a classic “fs API does not exist” confusion.

### 6. `types` / `typeRoots` / automatic inclusion

In `tsconfig`, **`types`** limits which `@types` packages are brought into the **global** scope automatically. Omitting `types` usually means “include all visible `@types`.” Setting `"types": ["node"]` is a deliberate narrowing—useful in libraries that must not accidentally pick up DOM globals.

**`typeRoots`** overrides where those packages are looked for; leave default unless you truly vendor types.

### 7. Emitting declarations from your own TS

For libraries:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "strict": true
  }
}
```

| Option | Job |
|--------|-----|
| `declaration` | Emit `.d.ts` beside JS |
| `declarationMap` | Maps for Go to Definition into `.ts` sources |
| `composite` / project refs | Faster builds in monorepos (chapter **15**) |

Point `package.json` **`types`** / **`exports`** at the emitted entry `.d.ts` so consumers resolve correctly under modern Node resolution.

---

## 2. Advanced concepts

### 1. Declaration merging

Interfaces and some namespaces **merge** if declared multiple times. Useful for extending library interfaces; dangerous when accidental.

```ts
interface Window {
  myAppConfig?: { env: string };
}
```

Module augmentation is the structured form:

```ts
declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}
```

Augment only when the **runtime** actually attaches the field (middleware). Types without runtime are lies.

### 2. `export =` vs `export default` (interop literacy)

Older CJS typings use `export =`. Consumers may need `esModuleInterop` / `allowSyntheticDefaultImports` and careful import shapes (chapter **10**). When writing **new** declarations for a CJS module, match how the JS actually exports—do not invent ESM default exports the runtime lacks.

### 3. Triple-slash references (legacy literacy)

```ts
/// <reference types="node" />
/// <reference path="./legacy.d.ts" />
```

Still appear in older trees and some `.d.ts` graphs. Prefer `types` in tsconfig and normal imports for new work. Know them so you can delete them safely during cleanup.

### 4. `skipLibCheck`

```json
{ "compilerOptions": { "skipLibCheck": true } }
```

Skips typechecking of declaration files in `node_modules`. Speeds CI; can **hide inconsistencies** between `@types` packages. Common in apps; libraries should understand the tradeoff. Security/review angle: chapter **20**—speed is not a substitute for pinning and reviewing deps.

### 5. Shipping types: DT vs in-package

| Path | When |
|------|------|
| Bundle `.d.ts` in the npm package | Default for new libraries; you own correctness |
| DefinitelyTyped `@types/foo` | Maintainer will not ship types yet; community fills gap |
| DefinitelyTyped → migrate in-package | Ideal end state when the library adopts TS |

If you publish both, consumers get confusing duplicates. Prefer one source of truth.

### 6. Hand-writing minimal `.d.ts` for a sticky dependency

When a package is untyped and you only call two functions, a **local** module declaration beats `@ts-ignore` everywhere:

```ts
// types/vendor-shim.d.ts
declare module "vendor-shim" {
  export function parse(input: string): unknown;
}
```

Keep `unknown` at boundaries; narrow in your code (chapters **04**, **11**). Expand the shim only as call sites need it—do not recreate the vendor’s entire API from guesswork.

### 7. `.ts` vs `.d.ts` vs `.d.mts` / ESM surface

Modern packages may ship **`.d.mts` / `.d.cts`** aligned with dual publishes. Match your `exports` map. Wrong extension + wrong `moduleResolution` looks like “TypeScript cannot find types” when the file is sitting right there (chapter **02**).

### 8. DefinitelyTyped contribution literacy (door)

Fixing upstream `@types` is a normal staff move: reproduce, tighten types without breaking the world, follow DT’s PR process. This handbook does not restate that process—use the official DefinitelyTyped guidance when you contribute. Local shims are fine for one app; shared lies across a monorepo should be upstreamed or vendored deliberately.

### 9. JSDoc, `allowJs`, and `checkJs` — typing JS gradually

Not every repo renames to `.ts` on day one. TypeScript can typecheck **JavaScript** with increasing strictness:

| Step | What you enable | Effect |
|------|-----------------|--------|
| Editor-only | TS language service on `.js` | Completions from inference |
| JSDoc types | `/** @type */`, `@param`, `@returns`, `@typedef`, … | Types without renaming files |
| Per-file check | `// @ts-check` at top of a `.js` file | Errors in that file |
| Project check | `allowJs` + `checkJs` (or a `jsconfig.json`) | CI can typecheck JS |
| Escape hatches | `// @ts-ignore` / `// @ts-expect-error` / `// @ts-nocheck` | Temporary; track debt |

```js
// @ts-check
/** @param {string} id */
/** @returns {Promise<{ id: string }>} */
async function loadUser(id) {
  return { id };
}
```

Supported JSDoc patterns are listed in the official **JSDoc Supported Types** handbook page—do not invent tags and assume `tsc` honors them.

Staff habits:

- Prefer **`@ts-expect-error`** over `@ts-ignore` when you intentionally suppress (fails if the error goes away).
- Use JSDoc + `checkJs` to **buy time** and find bugs; plan renames to `.ts` / `.tsx` for long-lived packages (migration playbook: chapter **22**).
- `allowJs` without `checkJs` still lets JS participate in the program for emit/interop—it is not the same as type safety.

---

## 3. Applications and use cases

### Application

- App consumes typed SDKs; occasional `declare module "*.svg"` for the bundler.
- Feature flags or host-injected globals get a small ambient interface—documented and namespaced.

### Systems / Node tooling

- Pin `@types/node` to the Node line in production images.
- CLI packages emit `declaration: true` so internal consumers share one contract.

### Security

- Treat third-party `.d.ts` as **untrusted documentation**—especially for crypto, auth, and filesystem APIs.
- Do not let a declaration of `safeEval(s: string): string` substitute for a security review of the JS (chapter **20**).

### Operations

- Image builds install the same `@types` pins as CI; “works on my laptop types” break reproducible builds.
- `skipLibCheck` noted in the runbook when enabled for wall-clock reasons.

### Software engineering

- Library release checklist: JS emit, `.d.ts` emit, `exports`/`types` fields, smoke import from a consumer tsconfig.
- Breakages in major type updates are **semver events** for typed consumers.

| Role | Failure mode |
|------|----------------|
| App eng | Ambient `any` modules sprawl |
| Lib eng | Missing `types` entry → consumers fall back to DT or any |
| Sec / ops | Stale `@types` disagree with runtime CVE-fixed package |

---

## 4. Staff-level review checklist

- Prefer in-package types over `@types` when both exist—remove duplicates.
- `@types/node` (and friends) **pinned** and aligned with runtime majors.
- New ambient modules are **minimal**, use `unknown` at edges, and have an owner comment.
- Augmentations match **runtime** behavior (middleware actually sets the field).
- Library packages emit declarations; `package.json` points at them correctly.
- No blanket `declare module "…" { const x: any; export = x }` without a tracking issue.
- `skipLibCheck` is intentional, not copy-paste.
- `types` array in tsconfig not accidentally pulling DOM into a Node-only lib (or vice versa).
- No Source/scrape paths or random blog stubs checked in as “official” types.
- `allowJs` / `checkJs` / JSDoc used deliberately for gradual JS typing; `@ts-expect-error` preferred over ignore; rename plan for long-lived code.
- TS **5.9.x** + `strict` for new declaration-emitting packages.

---

## References

- [Declaration Files — Introduction](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- [JS Projects Utilizing TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
- [JSDoc Supported Types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [TSConfig `allowJs`](https://www.typescriptlang.org/tsconfig#allowJs)
- [TSConfig `checkJs`](https://www.typescriptlang.org/tsconfig#checkJs)
- [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [@types/node on npm](https://www.npmjs.com/package/@types/node)
- [TypeScript package on npm](https://www.npmjs.com/package/typescript)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
