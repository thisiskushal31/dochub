# Testing: type-aware Vitest and Jest

[← Back to TypeScript](./README.md)

## What this chapter covers

How to test **TypeScript** code with **type-aware** discipline: **Vitest** as the default door for new Vite/Node work, **Jest** as brownfield literacy, sharing **`tsconfig`** honestly, testing **errors and async failures**, and keeping tests from becoming a second `any`-ridden codebase. Default narrative: **TypeScript 5.9.x**, **`strict`: true**.

Official hubs for runners: **vitest.dev** and **jestjs.io**. This is not a snapshot-testing encyclopedia or a full React Testing Library course—pair UI surface literacy with chapter **19**.

Picture tests as **fire drills**: you force failure on purpose to prove guards, parsers, and abort paths lock. If you cannot make the typechecker and the runner disagree on purpose, you do not yet own the boundary.

---

## 1. Concepts

### 1. What “type-aware testing” means

Three layers people conflate:

| Layer | Question | Tooling |
|-------|----------|---------|
| **Compile / typecheck** | Do types line up? | `tsc --noEmit`, project references |
| **Unit / integration tests** | Does runtime behavior hold? | Vitest / Jest |
| **Type-level tests** | Do *types* equal what we claim? | `expectTypeOf` / `assertType` (Vitest), or dedicated type-test patterns |

Staff ship all three when the domain is type-heavy (public libraries, complex mapped APIs from chapter **16**). Apps often lean on `tsc` in CI plus behavioral tests—and add type tests where regressions hurt.

### 2. Vitest — default door for new work

Vitest is Jest-compatible in spirit, fast in watch mode, and speaks TypeScript without a separate babel maze in many setups. Typical habits:

- Colocate `*.test.ts` / `*.spec.ts` with sources or under `src/**`.
- Use Vite’s resolve rules when the app already uses Vite; use Vitest’s Node pool for pure libraries.
- Enable globals only if the team standardizes on them; explicit imports are clearer in handbooks and reviews.

```ts
import { describe, it, expect } from "vitest";
import { parsePort } from "./parsePort.js";

describe("parsePort", () => {
  it("accepts a valid port", () => {
    expect(parsePort("8080")).toBe(8080);
  });

  it("rejects garbage", () => {
    expect(() => parsePort("nope")).toThrow(/invalid/i);
  });
});
```

**What just happened.** Runtime assertions prove behavior. Types on `parsePort` are checked when the test file is included in typecheck—not by `expect` itself.

### 3. Type assertions in Vitest

Vitest exposes helpers for **type-level** expectations (names evolve—prefer current official guide):

```ts
import { expectTypeOf } from "vitest";
import type { PublicUser } from "./user.js";

expectTypeOf<PublicUser>().toHaveProperty("id");
expectTypeOf<PublicUser>().not.toHaveProperty("passwordHash");
```

Use these when chapter **16** transforms must not reintroduce omitted keys. Runtime `expectTypeOf` is a no-op unless typechecking is enabled (for example Vitest `--typecheck` / type-test file patterns)—wire CI so a broken type test fails the pipeline.

### 4. Jest — brownfield literacy

Jest remains common in large React and Nest-style monorepos. Literacy points:

| Topic | Habit |
|-------|-------|
| TS transform | `ts-jest` or Babel + typecheck **separately** |
| ESM | Historically painful—follow current Jest ESM docs; don’t invent dual pipelines casually |
| Types | `@types/jest` when using Jest globals |
| Migration | New packages can adopt Vitest even if the monorepo still has Jest elsewhere |

Do not rewrite a stable Jest suite “for fashion.” Do require **`tsc --noEmit`** (or solution-style check) so Babel-transpiled tests cannot hide type errors.

### 5. tsconfig for tests

Common patterns:

```text
tsconfig.json          — app / lib strict config
tsconfig.test.json     — extends app, includes **/*.test.ts, maybe vitest types
```

| Rule | Why |
|------|-----|
| Same `strict` as production | Tests that need `any` to compile are a smell |
| Include test types (`vitest/globals`, Jest types) only in test config | Avoid leaking test globals into lib publish |
| Path aliases match runtime | Divergent aliases → green tests, broken prod |

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.test.ts"]
}
```

Adjust to your runner’s recommended setup; the **principle** is one strict story, extended—not a looser shadow config.

### 6. Testing the error pillar

Chapter **11** patterns need tests:

```ts
import { describe, it, expect } from "vitest";

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

function load(raw: unknown): { port: number } {
  if (typeof raw !== "object" || raw === null) throw new ConfigError("shape");
  const port = (raw as { port?: unknown }).port;
  if (typeof port !== "number") throw new ConfigError("port");
  return { port };
}

describe("load", () => {
  it("narrows unknown input", () => {
    expect(load({ port: 1 })).toEqual({ port: 1 });
  });

  it("throws typed failure", () => {
    expect(() => load(null)).toThrow(ConfigError);
  });
});
```

Prefer asserting **error class / code** over brittle full message strings when messages are localized or reworded.

### 7. Async, abort, and flaky clocks

Chapter **12** discipline in tests:

- `await expect(promise).rejects.toThrow(…)` (Jest/Vitest style) for rejections.
- Pass **`AbortSignal`** into APIs under test; abort and assert cancellation behavior.
- Fake timers only with an explicit policy—hidden timers are flake factories.
- No fire-and-forget promises inside tests without `await` or explicit orphan tracking.

---

## 2. Advanced concepts

### 1. Dual pipeline: transpile vs typecheck

| Mode | Risk |
|------|------|
| Runner transpiles TS, CI never runs `tsc` | Types rot; `any` spreads |
| Only `tsc`, almost no runtime tests | False confidence on logic |
| Both in CI | Healthy default |

Staff checklist item: **typecheck job** + **test job**, same pin of `typescript` 5.9.x.

### 2. Mocking and `unknown`

Mocks that return `as any` train production call sites to accept lies. Prefer:

- typed mock factories returning `unknown` then narrowed, or
- thin fakes implementing a **real interface**.

```ts
import type { Clock } from "./clock.js";

const fixedClock: Clock = { now: () => new Date("2026-01-01T00:00:00Z") };
```

### 3. Coverage vs signal

Coverage percentages do not measure type safety. Prefer:

- critical parsers and error paths covered,
- golden tests for CLI/file fixtures (chapter **14**),
- type tests for public utility types.

Dropping coverage gates to greenwash untyped modules is a review smell.

### 4. Monorepo and project references

With project references (chapter **15**), tests may live in a separate composite project that depends on the lib’s `.d.ts` emit. Benefits: faster incremental checks; clearer public API. Cost: must build declarations before some test graphs—document the task graph in the package README.

### 5. Snapshot and inline snapshots (door)

Useful for serializers and CLI help text; toxic for huge DOM dumps. Treat snapshots as **reviewed artifacts**, not silent accept-all. TypeScript does not typecheck snapshot contents—your review does.

### 6. JSDOM / happy-dom for DOM APIs

When tests touch `document` / `window`, the environment must provide them. That is **environment config**, not a reason to enable DOM `lib` in a Node library’s published tsconfig. Keep lib tsconfig Node-true; isolate DOM tests (chapter **19**).

### 7. Flake quarantine policy

Mark flaky tests explicitly; cap quarantine time; delete or fix. Types will not fix race conditions in parallel suites—shared temp dirs and real network calls will.

### 8. Testing declaration surfaces

Libraries that emit `.d.ts` (chapter **17**) should include a **consumer smoke**: a tiny project or test that imports the public entry and typechecks against published shapes. Catching `export` map mistakes beats discovering them in a downstream app on Friday.

### 9. What not to test with the type system alone

| Claim | Needs runtime test? |
|-------|---------------------|
| “Parser rejects bad JSON” | Yes |
| “Omit removes password from DTO type” | Type test may suffice |
| “File write is atomic” | Yes — filesystem behavior |
| “Abort cancels work” | Yes — timing/async |
| “Dependency is not malware” | Out of scope for unit tests (chapter **20**) |

---

## 3. Applications and use cases

### Application

- Vitest + Testing Library (door) for UI; typecheck props/events in the same CI wave as unit tests.
- Contract tests for API clients: parse unknown JSON → typed result or typed error.
- Snapshot CLI `--help` carefully; prefer explicit assertions for exit codes.

### Systems / tooling

- File I/O tests use temp directories, assert bytes/encoding (chapter **14**), never home-directory side effects.
- Performance-sensitive code: benchmarks separate from correctness tests (chapters **13** / **15**).
- Worker tests inject fake clocks and abort signals instead of sleeping.

### Security

- Tests for secret-scrubbing helpers: ensure redaction runs (chapter **20**).
- Dependency upgrades: re-run typecheck + tests; `@types` bumps can break compile without runtime tests failing.
- Never commit live credentials as “fixtures.”

### Operations

- CI caches Vitest/Jest responsibly; pin runner majors like you pin `tsc`.
- Fail the pipeline on type errors even if tests were “green” via transpile-only.
- Publish junit/report artifacts your on-call already knows how to read.

### Software engineering

- Public libraries: ship type tests for exported utilities.
- Refactors: change types first, fix compile, then fix runtime tests—or the reverse for behavior-first bugs—but never skip one layer.
- Delete tests that only assert mocks were called with `any`.

| Pillar | What to test |
|--------|----------------|
| **Errors** | Guards, `unknown` catch paths, exhaustiveness defaults |
| **Files** | Path edge cases, encoding, partial reads |
| **Speed** | Abort early; avoid accidental `O(n²)` in hot helpers under test fixtures |

---

## 4. Staff-level review checklist

- CI runs **`tsc` (or equivalent)** and the test runner—not only one.
- Test `tsconfig` stays **`strict`**; no `any` holiday in `*.test.ts`.
- New work prefers **Vitest** unless Jest is mandated by the repo.
- Async tests **await** completions; abort paths exercised where APIs take signals.
- Mocks implement real types; no epidemic `as any`.
- Error assertions target **stable identity** (class/code), not only ephemeral strings.
- DOM `lib` / jsdom confined to UI test projects.
- Type-level tests for public mapped/omit APIs when regressions would be silent.
- Flakes quarantined with expiry, not ignored forever.
- Runner and `typescript` versions pinned; docs link official Vitest/Jest hubs.

---

## References

- [Vitest Guide](https://vitest.dev/guide/)
- [Vitest — expectTypeOf](https://vitest.dev/api/expect-typeof)
- [Jest — Getting Started](https://jestjs.io/docs/getting-started)
- [Jest — TypeScript](https://jestjs.io/docs/getting-started#using-typescript)
- [TypeScript Handbook — Intro](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
