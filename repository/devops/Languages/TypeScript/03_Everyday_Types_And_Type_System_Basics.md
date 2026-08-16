# Everyday types and type system basics

[← Back to TypeScript](./README.md)

## What this chapter covers

The **daily vocabulary** of TypeScript’s type system—enough to read real code and write strict annotations without drowning in generics yet. By the end you should be able to:

1. Use **primitives**, **arrays**, **tuples**, and simple **object types**.
2. Explain **`any` vs `unknown` vs `never`** at a basic level.
3. Read **type annotations** and **inference** without fighting the compiler.
4. Know where **`strictNullChecks`** changes everyday code.
5. Avoid the beginner traps that later become production defects.

Generics, mapped types, and declaration files come later. This chapter is the **spine of everyday reading**.

Handbook default: **TS 5.9.x**, **`strict`: true**.

---

## 1. Concepts

### 1. Types describe values

A type is a **set of allowed values** plus (for objects/functions) a **shape of operations**. Annotations tell the checker what you intend; inference often fills them in.

```ts
let count: number = 0;
const title = "runbook"; // inferred as string
```

Prefer inference when it is obvious; annotate **public APIs**, tricky boundaries, and empty starting values (`let x = []` is a classic trap).

### 2. Primitives you live in

| Type | Notes |
|------|--------|
| `string`, `number`, `boolean` | Everyday JS primitives |
| `bigint`, `symbol` | Less common; still first-class |
| `null`, `undefined` | Distinct under `strictNullChecks` |
| `object` | Non-primitive — usually too vague; prefer shapes |

`string` is not the same as **string literal types** (`"left" | "right"`)—those arrive hard in chapter **07**.

### 3. Arrays and readonly arrays

```ts
const ids: number[] = [1, 2, 3];
const names: Array<string> = ["a", "b"];
const frozen: readonly string[] = ["x"];
```

`readonly` arrays block mutation methods in the type system. Runtime can still be mutated if you alias unsafely—types are not a memory firewall.

### 4. Tuples

Tuples are arrays with **fixed length and per-index types**:

```ts
type Pair = [string, number];
const p: Pair = ["cpu", 4];
```

Destructure with ordinary array patterns—element types follow the tuple:

```ts
function describe(pair: [string, number]): string {
  const [name, cores] = pair;
  return `${name}=${cores}`;
}
```

**Readonly tuples** block element writes at the type level (`readonly [string, number]`). Prefer them for values you treat as fixed pairs—especially after `as const`, which infers a readonly tuple of literals.

**Labeled (named) tuple elements** are documentation and tooling labels on positions; they do not change runtime shape or force destructuring names:

```ts
type Range = [start: number, end: number];
type Coord = [lat: number, long: number];

function span([start, end]: Range): number {
  return end - start;
}
```

Optional and rest tuple elements exist for APIs that mirror parameter lists (`[string, number?]`, `[string, ...boolean[]]`). Prefer objects with named fields when the meaning of each slot is not obvious to callers.
### 5. Object type literals

```ts
type User = {
  id: string;
  email: string;
  active?: boolean; // optional property
};

function label(u: User): string {
  return u.active === false ? `(off) ${u.email}` : u.email;
}
```

Optional (`?`) means the property may be missing—not that it may be `null` unless you said `| null`.

### 6. `any`, `unknown`, and `never` (basics)

| Type | Meaning | Everyday habit |
|------|---------|----------------|
| **`any`** | Opt out of checking | Avoid; migration only |
| **`unknown`** | Top type; must narrow | Prefer for untrusted input / `catch` |
| **`never`** | Empty set; unreachable | Exhaustiveness (chapter **04** / **11**) |

```ts
function handle(x: unknown): string {
  if (typeof x === "string") return x;
  return "n/a";
}
```

### 7. Type assertions (preview)

`as Type` tells the checker to **trust you**. It does not convert at runtime. Prefer narrowing first. Chapter **04** owns casting literacy (`as`, double asserts, angle-bracket vs TSX).

```ts
const el = document.querySelector("#main") as HTMLElement | null;
```

`as any` and casual non-null `!` are review smells.
### 8. Small lab

```ts
type Metric = {
  name: string;
  value: number;
};

function summarize(rows: Metric[]): string {
  const total = rows.reduce((s, r) => s + r.value, 0);
  return `${rows.length} metrics, sum=${total}`;
}

const data: Metric[] = [
  { name: "requests", value: 10 },
  { name: "errors", value: 1 },
];

console.log(summarize(data));
```

Under `strict`, try omitting `value` on one object and watch the error—that feedback is the product.

### Runtime cost (learn early)

Types on arrays and tuples **erase**. At runtime a tuple is still a JavaScript array. What costs money:

- **Indexing** (`arr[i]`) is cheap; **copying** (`arr.slice()`, `[...arr]`, `arr.concat(…)`) allocates a new array.
- Chains like `map` → `filter` → `map` allocate **intermediate arrays**. On huge hot data, a simple loop (when measured) often wins.
- Prefer clarity first; optimize only after you know the path is hot.

```ts
// Two allocations + two passes — fine for small lists; measure on huge hot paths
const ids = rows.map((r) => r.id).filter((id) => id > 0);
```

Deepen in chapter **13** (runtime performance).

---

## 2. Advanced concepts

### 1. Inference limits

Empty arrays, uninitialized variables, and widowed generics often infer **`any`** or overly wide types unless annotated. Annotate the **seed**, not every local.

### 2. `null`, `undefined`, and `strictNullChecks`

With **`strictNullChecks`** (on under `strict`), `string` does **not** include `null` or `undefined`. “Maybe” APIs must say so (`string | undefined`, `T | null`), and callers must narrow or use safe operators.

| Tool | Role | Caveat |
|------|------|--------|
| Narrowing (`=== null`, `!= null`, truthiness) | Proves a branch | Truthiness also drops `""` / `0` |
| Optional chaining `?.` | Short-circuits on nullish | Does not always teach the checker like an `if` |
| Nullish coalescing `??` | Default only for `null`/`undefined` | Unlike `\|\|`, keeps `""` / `0` |
| Non-null assertion `!` | Asserts “not nullish” | **No runtime check** — review smell unless locally proven |

```ts
function title(name: string | undefined): string {
  return name?.trim() ?? "anonymous";
}

function liveDangerously(x?: number | null): void {
  // x!.toFixed() — compiles, can throw at runtime if x is nullish
  if (x != null) console.log(x.toFixed());
}
```

Staff habit: treat postfix `!` like a cast—demand a one-line why, or replace with a check / early return. Forgetting `| undefined` on map/`Record` reads is a common production bug class—see also `noUncheckedIndexedAccess` in chapter **02**.
### 3. Excess property checks

Fresh object literals assigned to a typed variable get **excess property** checking:

```ts
type Opts = { timeoutMs: number };
const o: Opts = { timeoutMs: 5, colour: "red" }; // error — colour unknown
```

Objects that pass through variables can be wider. This is intentional ergonomics, not full width soundness.

### 4. `object` vs `Record` vs index signatures

`object` means “not a primitive.” For dictionaries, prefer explicit shapes or `Record<string, V>`—and still remember **runtime** key safety. Index signatures interact with `noUncheckedIndexedAccess`.

### 5. Type vs value namespaces

Some names exist on both sides (`Date`, classes). `typeof` in **type position** queries the type of a value. Confusion here produces “X refers to a value” errors—slow down and check position.

### 6. Interfaces preview

`interface` and `type` aliases both describe object shapes; chapter **06** compares them. For now, either is fine for local shapes.

### 7. Erasure reminder

```ts
type Flag = { on: boolean };
// At runtime there is no Flag — only the object you constructed
```

Design APIs so **needed checks exist in JS**, not only in type-land.

### 8. Widening vs const context

```ts
let mode = "read";          // string
const mode2 = "read";       // "read"
const modes = ["read", "write"] as const; // readonly ["read", "write"]
```

`as const` and `const` bindings preserve literals—fuel for chapter **07**. Everyday habit: if a value is a **fixed vocabulary**, don’t let it widen to plain `string` by accident.

### 9. `JSON.parse` and the everyday trap

```ts
const raw: unknown = JSON.parse('{"a":1}');
// not: const raw = JSON.parse(...) as MyType
```

Parsing returns a value the checker cannot trust. Type it as **`unknown`** (or validate into a type). Casting parse results is one of the most common strict-mode bypasses in the wild.

---

## 3. Applications and use cases

| Angle | Everyday types in practice |
|-------|----------------------------|
| **Application** | DTO shapes, props, config objects—annotated at boundaries. |
| **Systems** | Metrics, process env wrappers (`string | undefined`), port numbers. |
| **Security** | Untrusted input as `unknown` first; never `any` from `JSON.parse` without validation. |
| **Ops** | Typed CLI option objects reduce “stringly” runbooks. |
| **SE** | Shared type aliases become the glossary of the domain. |

**Whole-engineering picture:** everyday types are how teams **name reality**. Bad names (`data: any`) become permanent fog; precise primitives and shapes make reviews possible.

---

## Staff-level review checklist

- Public functions have explicit parameter/return types where inference would hide intent.
- No new `any` without a linked migration or escape justification.
- Untrusted input enters as **`unknown`** (or a validated branded type)—not `any`.
- Optional (`?`) vs `| null` vs `| undefined` matches actual runtime behavior.
- Empty arrays / `let` seeds are annotated when inference collapses.
- Assertions (`as`) are rare and never `as any` by habit.
- Non-null `!` is rare, justified, and not a habit on optional lookups.
- Tuples that are fixed pairs use `readonly` / labels when it aids review; objects preferred when slots are ambiguous.
- `JSON.parse` results are not trusted as typed domain objects without a validator.
- Dictionary/`Record` uses consider `noUncheckedIndexedAccess` if enabled.
- Hot-path array work: aware of copy vs index and `map`/`filter` allocation; deepen in ch **13**.

---

## References

- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Object Types — tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
- [TypeScript 4.0 — labeled tuple elements](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#labeled-tuple-elements)
- [Basic Types (widened handbook)](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [Narrowing (preview)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [More on functions (preview)](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TSConfig `strict`](https://www.typescriptlang.org/tsconfig#strict)
- [TSConfig `strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks)
