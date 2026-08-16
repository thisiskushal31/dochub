# Modules, imports, exports, and interop

[← Back to TypeScript](./README.md)

## What this chapter covers

How TypeScript projects **split code into modules**: ESM vs CommonJS literacy, `import` / `export` forms, `export type` / `import type`, path resolution with modern `moduleResolution`, and interop with Node packages that still ship CJS. Default narrative: **TypeScript 5.9.x**, **`strict`: true**, and honest **`module` / `moduleResolution`** settings (`nodenext` for Node libraries, `bundler` when a bundler owns resolution—see ch **02**).

You leave able to explain why a relative import needs an extension under `nodenext`, when to use type-only imports, and how to review dual-package hazards.

---

## 1. Concepts

### 1. A module is a file with import or export

In modern TypeScript, a file is a **module** if it has any `import` or `export`. Otherwise it is a script in the global scope (rare and discouraged for app code). Modules have their own scope; nothing leaks global unless you attach it deliberately.

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// main.ts
import { add } from "./math.js";
```

Under **Node ESM** / `moduleResolution: nodenext`, relative imports often require the **`.js` extension** in the import path even when the source file is `.ts`—because emit and runtime resolve the JavaScript specifier. Match the handbook/`tsconfig` for your pin; do not invent a third resolution folklore.

### 2. Export forms

| Form | Meaning |
|------|---------|
| `export function f` / `export const x` | Named export |
| `export default …` | Default export (one per module) |
| `export { a, b }` | Re-export / explicit list |
| `export { a as b }` | Rename |
| `export * from "./other.js"` | Re-export all named |
| `export type { T }` | Type-only export |

Prefer **named exports** for libraries: better rename refactoring, grepping, and tree-shaking clarity. Default exports are fine for “the” component/page in app code when the ecosystem expects them.

### 3. Import forms

```ts
import { add } from "./math.js";
import * as math from "./math.js";
import addDefault from "./legacy-default.js";
import { add as sum } from "./math.js";
import "./side-effects.js";
```

Side-effect imports run the module for initialization (polyfills, register hooks). Use sparingly and document why.

### 4. Type-only imports and exports

Values erase; types erase. Mixing them incorrectly can create **runtime** imports that only existed for typing—or elide imports you needed for side effects.

```ts
import type { User } from "./user.js";
export type { User };

import { type User, loadUser } from "./user.js";
```

`isolatedModules` / bundlers often require type-only markers so each file can transpile alone. Prefer `import type` when you only need the type.

### 5. `module` vs `moduleResolution` (recall)

These are different knobs (ch **02** deep dive):

| Knob | Rough job |
|------|-----------|
| `module` | What emit / module kind `tsc` thinks in |
| `moduleResolution` | How `import` specifiers are looked up |
| `nodenext` | Node’s ESM/CJS rules, extensions, `exports` map |
| `bundler` | Bundler-style resolution (often extension optional) |

Wrong pairs produce “cannot find module” that feel like language bugs. Fix config before rewriting code.

### 6. Package entry: `package.json` `exports`

Modern packages declare an **exports map**. Consumers import the package name (and subpaths allowed by the map). TypeScript under `nodenext` respects export conditions (`import`, `require`, `types`).

Staff habit: publish `types` / `typesVersions` / `exports.types` correctly (ch **17**). Consumers should not deep-import `dist/internal/...` unless the map allows it.

### 7. Lab — named vs default

```ts
// a.ts
export const answer = 42;

// b.ts
import { answer } from "./a.js";
// import answer from "./a.js"; // wrong — no default
```

**What just happened:** default and named exports are not interchangeable; match the export style.

---

## 2. Advanced concepts

### 1. ESM calling CommonJS

Interop depends on `esModuleInterop` / `allowSyntheticDefaultImports` and the runtime:

```ts
import fs from "node:fs";
import * as fsNs from "node:fs";
import { readFile } from "node:fs/promises";
```

Prefer **`node:`** prefixed built-ins in Node ESM. For CJS packages that only provide `module.exports = function…`, default import shapes vary—`esModuleInterop` helps TS mirror Babel/Node interop. Verify at runtime in a smoke test when wrapping critical deps.

### 2. Dual packages and the “dual package hazard”

A package that ships both ESM and CJS can load **two copies** of the same module graph if consumers mix import styles incorrectly—breaking `instanceof` and singletons. Prefer one primary format for new internal packages; if dual, follow Node’s packaging guidance and keep shared state out of module-top mutable singletons when possible.

### 3. `verbatimModuleSyntax` literacy

When enabled, TypeScript forces clearer separation of type and value imports/exports—fewer “import erased unexpectedly” surprises. Good default for new 5.x projects that already use type-only imports. Migrate brownfield deliberately; noise is high on first enable.

### 4. Path mapping vs real packages

`paths` in `tsconfig` are a **compile-time** rewrite. Runtime Node will not honor them unless a bundler/loader mirrors the map. Staff rule: do not invent `@app/...` aliases for libraries meant to run under raw `node` without a loader; use relative imports or real packages in a workspace.

### 5. JSON modules and attributes

Importing JSON and import attributes / assertions evolve with module settings and Node versions. Prefer `fs.readFile` + `JSON.parse` with validation (ch **11**, **14**) for untrusted config; use JSON module imports only when the toolchain fully supports them and the file is trusted build input.

Modern spelling uses **import attributes** (`with`), not deprecated **import assertions** (`assert`):

```ts
import data from "./config.json" with { type: "json" };
```

Under **`module: nodenext`**, TypeScript rejects `assert { type: "json" }` in favor of `with`. Enable `resolveJsonModule` (and match Node’s rules) before relying on this in CI.

### 6. Ambient modules and `declare module`

When a JS package has no types, you may add a stub:

```ts
declare module "untyped-lib" {
  export function doThing(x: string): void;
}
```

Prefer `@types/*` or shipping types from the package (ch **17**). Empty `any`-filled declares are review debt.

### 7. Namespaces — legacy literacy (not greenfield)

`namespace` (historically “internal modules”) is a TypeScript-era way to group values and types into a named object, often spanning files via merging and `/// <reference />`. Official guidance for **new** Node/app code: prefer **ES modules**.

Why they still appear:

| Context | Why you see them |
|---------|------------------|
| Older browser apps / `outFile` bundles | Concatenated globals before ESM was default |
| Ambient `.d.ts` for global script libraries | Modeling `d3`-style globals |
| Declaration merging with classes/functions | JS interop patterns (chapter **06** / **16**) |
| Accidental wrap after a partial migrate | `export namespace Foo { … }` inside a module |

**Needless namespacing after migration:** if a file is already an ES module, wrapping exports in `export namespace Shapes { … }` forces `shapes.Shapes.Triangle`—the module is already the boundary. Export `Triangle` / `Square` directly.

**Migrate-to-modules playbook (brownfield):**

1. Identify script/namespace files vs true modules (`import`/`export` present).
2. Convert one leaf namespace to a file module: top-level `export` of former `export`ed namespace members.
3. Replace `Validation.Foo` / `/// <reference />` with `import { Foo } from "./foo.js"` (extensions per chapter **02** / this chapter).
4. Delete empty namespace wrappers; keep ambient `declare namespace` only for true globals.
5. Turn on modern `module` / `moduleResolution`; drop `outFile` namespace concatenation when the bundler/runtime owns the graph.

Do **not** introduce namespaces in greenfield Node services. Read them; migrate them; do not teach them as the default organization tool.
### 8. Circular imports

Cycles compile more often than they run correctly: `undefined` bindings at init time. Break cycles with:

- Extract shared types to `types.ts`
- Late imports inside functions
- Dependency inversion (interfaces inwards)

Type-only cycles are usually harmless because they erase.

### 9. Barrels (`index.ts`) — thin or not at all

A barrel re-exports many modules from one entry:

```ts
export * from "./a.js";
export * from "./b.js";
export * from "./c.js";
```

Pros: short import paths. Cons: pulls large graphs into typechecking and bundling; encourages circular imports; hides real dependency edges. Staff habit for monorepos: **thin** public barrels for published packages only; app code imports leaves (`./features/billing/api.js`) when trees get heavy (ch **15**).

### 10. `package.json` `type` and TS emit

| `"type": "module"` | Files are ESM by default (`.js` = ESM) |
| `"type": "commonjs"` / omitted | `.js` = CJS unless `.mjs` |

TypeScript `module` must agree with how Node will load emit. Mismatches produce `require` of ESM or `import` of CJS errors that look mysterious until you print `package.json` and `tsc` module settings side by side.

### 11. Subpath imports (`#local`)

Node supports internal `#imports` maps in `package.json`. TypeScript under `nodenext` can resolve them when configured. Prefer them over `paths` when you want **runtime-correct** aliases without a bundler—still document the map for humans.

### 12. Dynamic `import()`

```ts
async function loadPlugin(name: string): Promise<Plugin> {
  const mod = await import(`./plugins/${name}.js`);
  return mod.default;
}
```

Typing dynamic imports often yields `any`-ish modules unless you constrain with a map of known plugins. Prefer a static registry object typed with `satisfies` when the set is closed; reserve truly dynamic paths for sandboxed plugin hosts and validate exports at runtime (ch **11**).

### 13. Triple-slash and `/// <reference` (legacy literacy)

Triple-slash references predate modern modules. You may see them in older `.d.ts` graphs. New app code should use `import` / `import type`. When maintaining ambient libraries, prefer explicit imports in declaration files (ch **17**).

### 14. `import defer` — deferred module evaluation (5.9 door)

TypeScript **5.9** types ECMAScript **`import defer`**: load the module graph, but **defer evaluating** it until you touch a property of the namespace import.

```ts
import defer * as feature from "./heavy-feature.js";
// side effects in heavy-feature.js have not run yet
feature.start(); // evaluation happens on first member access
```

Rules that matter in review:

| Rule | Why |
|------|-----|
| Only `import defer * as ns` | Named/default defer forms are invalid—evaluation timing must be clear |
| No TS downlevel | Emit keeps the syntax; runtime or bundler must support it |
| `module` must be `preserve` or `esnext` | Other modes will not accept it |

Until your **Node/browser/bundler pin** supports deferred evaluation, treat this as literacy for reading 5.9+ code and release notes—not a default pattern. Dynamic `import()` remains the everyday lazy-load tool.

### 15. `require()` of ESM under `nodenext` (literacy)

On supported Node lines, CommonJS can `require()` many ESM packages. TypeScript **5.8+** under **`module: nodenext`** aligns with that: fewer false “cannot require ESM” errors. Still fails for ESM with top-level `await`. Prefer ESM→ESM for greenfield; know this exists when dual packaging or brownfield CJS hosts load ESM libs (chapter **02**).

### 16. Lab — type-only elision

```ts
import type { Config } from "./config.js";

export function show(cfg: Config): void {
  console.log(cfg.env);
}
```

Emit should not require `./config.js` at runtime **unless** `Config` was a value (enum/class) used as a value. If you need a runtime class, use a value import.

### Runtime cost (learn early)

Static `import` cost is mostly **load/parse at startup** (and once per module), not “per call.” Habits:

- Dynamic `import()` **defers** that work until first need—good for rare plugins, not a free lunch on every request.
- Avoid pulling a **huge** module only on the cold path of a **hot** request; load shared deps once at startup when the request path always needs them.

```ts
// Defer heavy optional tooling — not for the dependency every request already needs
const mod = await import("./heavy-report-plugin.js");
```

Deepen in chapter **13**.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Feature folders with public `index.ts` barrels (keep barrels thin—cost in ch **13** / **15**); route modules |
| **Systems** | Clear boundaries: `domain/`, `adapters/`, `cli/` as separate entrypoints; `exports` map for publishable SDK |
| **Security** | No importing secrets modules into client bundles; review side-effect imports; treat `paths` aliases as trust/config surface |
| **Operations** | Small CLI entry `bin` pointing at ESM wrapper; health modules without circular init |
| **Software engineering** | Workspace packages with explicit `exports`; CI typecheck per package via project references (ch **15**) |

Interop checklist for wrapping a CJS dependency:

1. Try named imports from known exports.
2. Fall back to `import pkg from "pkg"` with interop flags.
3. Smoke-test `instanceof` and singleton behavior.
4. Add a thin typed façade—do not sprinkle `as any` at every call site.

### Publishing a small library — module checklist

1. Decide ESM-only vs dual (prefer ESM-only for greenfield internals).
2. Set `"type": "module"` and `exports` with `types` + `import` conditions.
3. `module` / `moduleResolution`: `nodenext` (or current Node-recommended pair on your pin).
4. Emit `.js` + `.d.ts`; consumers should not need path hacks.
5. Add a smoke consumer package in CI that imports the published layout (not only `src`).

### App vs library import style

| Context | Prefer |
|---------|--------|
| Internal app feature | Relative imports; few barrels |
| Published SDK | Stable `exports` subpaths (`pkg/foo`) |
| Monorepo workspace | Workspace protocol + project references (ch **15**) |
| Scripts / one-off tools | Explicit relative graph; avoid clever aliases |

### Resolution failure triage

When `tsc` or Node says it cannot find a module, walk this order before rewriting imports:

1. Does the file exist at the path you think (including extension rules)?
2. Does `moduleResolution` match Node vs bundler?
3. Does `package.json` `exports` allow the subpath?
4. Are you importing `.ts` in a context that needs `.js` specifiers?
5. Is the dependency installed and are its types present (`@types/*` or shipped `.d.ts`)?

Most “TypeScript is broken” reports in review are **resolution config** problems, not type-system bugs.

---

## Staff-level review checklist

- `module` / `moduleResolution` match the runtime (Node vs bundler).
- Relative ESM imports use the extensions your resolution mode requires.
- `import type` / `export type` used where only types are needed.
- Named exports preferred for libraries; defaults intentional.
- `paths` aliases have a runtime story (bundler/loader) or are avoided.
- Package `exports` (and types conditions) reviewed for publishable packages.
- Side-effect imports documented and rare.
- No new `namespace` in greenfield modules; brownfield namespaces have a migrate-to-modules plan.
- Circular value imports broken; init-order risks tested.
- CJS/ESM interop verified with a runtime smoke—not only `tsc`.
- Barrels stay thin; no accidental monorepo-wide re-exports.
- `package.json` `type` / `exports` agree with `tsc` `module` settings.
- Dynamic `import()` limited to known registries or runtime-validated plugins.
- JSON imports use `with { type: "json" }` (not `assert`) when attributes are in play; untrusted JSON still prefers parse + validate.
- `import defer` only where host/bundler support is proven; otherwise dynamic `import()`.
- Import cost treated as startup/load time; huge modules not dragged onto hot request cold-paths (ch **13**).

---

## References

- [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html)
- [Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)
- [Module Resolution](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript 5.8 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html) — `import defer`
- [Node.js Modules](https://nodejs.org/docs/latest/api/modules.html)
- [Node.js ECMAScript modules](https://nodejs.org/docs/latest/api/esm.html)
- [Node.js Package entry points](https://nodejs.org/docs/latest/api/packages.html#package-entry-points)
