# Generics, constraints, and inference

[← Back to TypeScript](./README.md)

## What this chapter covers

How TypeScript **parameterizes** types and functions so one implementation works over many shapes without collapsing to `any`. You get the mental model for type parameters, **constraints** (`extends`), **inference**, default type arguments, variance intuition for readable APIs, and the staff habits that keep generics from becoming compile-time tar pits. Default is **TypeScript 5.9.x** with **`strict`: true**.

You leave able to write a generic helper that preserves the caller’s type, constrain it to what the body needs, and review APIs that over-genericize or under-constrain.

---

## 1. Concepts

### 1. Why generics exist

Without generics, a function that returns “the same thing you passed in” has two bad options: invent a concrete type (too narrow) or use `any` / a wide union (too loose). A **type parameter** names a slot that is filled per call (or per construction) and stays linked across the signature.

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity(42); // inferred T = number
const s = identity("hi"); // inferred T = string
```

Types erase at emit. Generics do not allocate runtime type objects; they constrain what `tsc` will accept and how it relates inputs to outputs.

### 2. Generic functions vs generic types

| Form | What is parameterized | Typical use |
|------|------------------------|-------------|
| `function f<T>(…)` | One call | Helpers, mappers, parsers |
| `type Box<T> = …` | The alias | Reusable shapes |
| `interface Repo<T> { … }` | The interface | Contracts over element type |
| `class Store<T> { … }` | The class instance | Stateful containers |

Prefer a generic **function** when the type is chosen at the call site and does not need to live on an object. Prefer a generic **type / class** when the same `T` must stay coherent across many members.

### 3. Inference is the default path

TypeScript tries to **infer** type arguments from arguments (and sometimes from context). Explicit `<T>` at the call site is for when inference cannot see enough, or when you intentionally pick a wider / narrower type.

```ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const p = pair(1, "x"); // [number, string]
const q = pair<number, string>(1, "x"); // same, explicit
```

Staff habit: design signatures so inference usually succeeds. If callers must always write `<…>`, the API is often fighting the type checker.

### 4. Constraints with `extends`

A bare `T` can be anything. A **constraint** says what operations the body may assume:

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("ab", "c"); // ok
longest([1, 2], [3]); // ok
// longest(10, 20); // error — number has no length
```

`T extends U` means “`T` must be assignable to `U`.” Constraints are how you avoid casting inside the generic body.

### 5. Multiple parameters and relationships

Type parameters can depend on each other:

```ts
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const name = pluck({ id: 1, name: "a" }, "name"); // string
```

`K extends keyof T` ties the key to the object. Indexed access `T[K]` preserves the property’s type. This pattern shows up everywhere in typed config, form fields, and API clients.

### 6. Defaults

Type parameters can have **defaults**, useful when a common case should not force callers to spell the argument:

```ts
type ApiResponse<TData = unknown> = {
  ok: boolean;
  data: TData;
};

type Raw = ApiResponse; // data: unknown
type User = ApiResponse<{ id: string }>;
```

Defaults are sugar for call sites and aliases—not a substitute for honest return types on public functions.

### 7. Lab — preserve type vs erase it

```ts
// Bad: collapses identity
function badIdentity(value: unknown): unknown {
  return value;
}

// Good: preserves
function goodIdentity<T>(value: T): T {
  return value;
}

const x = badIdentity("hi"); // unknown
const y = goodIdentity("hi"); // string
```

**What just happened:** generics exist to keep information; `unknown`/`any` throw it away at the boundary.

### Runtime cost (learn early)

**Generics erase.** Writing `<T>` costs **nothing** at runtime—there is no `T` in the emitted JavaScript. You only pay for the **JS you emit** (loops, allocations, the same as a non-generic function).

Pathological generic / conditional types hurt **`tsc`** and the editor (chapter **15**), not Node’s CPU. Keep public generics shallow for compile speed; do not confuse that with runtime speed.

```ts
function identity<T>(x: T): T {
  return x; // emit is just `return x` — no leftover T
}
```

Deepen runtime habits in chapter **13**; deepen compile-cost habits in chapter **15**.

---

## 2. Advanced concepts

### 1. Inference from return context and callbacks

Inference often flows from **arguments**. Contextual typing can also flow into callbacks:

```ts
function mapArray<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

const lengths = mapArray(["a", "bb"], (s) => s.length); // number[]
```

When inference fails, check argument order (put the “informative” value first), avoid over-constraining both sides to the same `T` when they should differ, and prefer two parameters (`T`, `U`) over forcing one.

### 2. Constraints that are too tight or too loose

| Smell | Symptom | Fix |
|-------|---------|-----|
| Over-constrained | Legitimate callers fail | Widen the bound; split parameters |
| Under-constrained | Body needs casts | Add `extends` for real operations |
| Same `T` twice wrongly | `f(a, b)` requires identical types | Use `T` and `U` |
| Constraint is `any` | No safety | Use a real shape or `unknown` + guards |

Avoid `T extends any` theater. Prefer the smallest interface the implementation needs (`{ id: string }`, `Record<string, unknown>`, etc.).

### 3. Generic classes and methods

```ts
class Queue<T> {
  private items: T[] = [];
  enqueue(item: T): void {
    this.items.push(item);
  }
  dequeue(): T | undefined {
    return this.items.shift();
  }
}

const q = new Queue<number>();
q.enqueue(1);
```

A method can introduce **its own** type parameters independent of the class:

```ts
class Box<T> {
  constructor(public value: T) {}
  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}
```

### 4. Variance intuition (without a thesis)

For readable reviews, remember:

- **Producers** of `T` (returns, getters) are covariant in spirit: a `Dog` producer can often stand in where an `Animal` producer is expected if the type system allows it through structural rules.
- **Consumers** of `T` (parameters that write/`push`) are contravariant in spirit: you cannot safely treat a consumer of `Animal` as a consumer of only `Dog` without care.
- Arrays and mutable containers are where people get hurt—`Array<Dog>` is not safely `Array<Animal>` when mutation is allowed.

Prefer **immutable returns** and **readonly** surfaces when exposing collections across API boundaries (ch **06**). Full variance theory is rare in day-to-day TS; structural assignability + mutability is what breaks builds.

**`in` / `out` variance annotations (door):** on some generic type aliases / interfaces, TypeScript lets you mark a type parameter as input-only (`in`) or output-only (`out`) so the checker can prove safer assignability and catch mistakes earlier. Most app code never writes these; you will see them in framework/DOM `.d.ts` and high-assurance libraries. Prefer `readonly` collections and clear producer/consumer APIs before reaching for variance keywords.

### 5. Conditional types and `infer` (door to ch 16)

Generics compose with **conditional types**. `infer` names a type inside a true branch:

```ts
type AwaitedSimple<T> = T extends Promise<infer U> ? U : T;
```

Use these when a library must transform types systematically. Do not invent deep conditional towers for one-off app code—prefer ordinary generics and narrowing (ch **04**, **15**).

### 6. Cost of generic APIs

Every type parameter is a slot the checker must instantiate. Nested mapped / conditional generics on hot import graphs slow `tsc` (pillar ch **15**). Staff rules:

- Prefer shallow generics on public surfaces.
- Avoid encoding entire program states into type parameters.
- Prefer `satisfies` and concrete types at config roots when inference is enough.
- Measure with `tsc --extendedDiagnostics` when generic-heavy libraries grow.

### 7. `const` type parameters (modern literacy)

TypeScript can treat a type parameter as **const-like** so literal types are preserved more aggressively (useful for tuple/route builders). Prefer reading the current handbook note for the exact spelling on your 5.9.x pin; the design goal is: **keep literal information** that would otherwise widen to `string` / `number`.

### 8. Brownfield: `any` generics and overloaded escapes

Older codebases “genericize” by writing `<T = any>` or returning `any` from generic methods. Treat that as debt: either constrain `T` or return `unknown` and force callers to narrow. Overloaded call signatures (ch **05**) sometimes replace generics—use overloads when arity/behavior truly differs; use generics when the relationship is “same shape, different type.”

### 9. Generic defaults vs overloads

When behavior changes by arity, prefer **overloads** (ch **05**). When behavior is “same algorithm, different element type,” prefer **generics**. Mixing both is valid for libraries (`Array` methods historically), but app code should pick one story.

```ts
function first(items: string[]): string | undefined;
function first<T>(items: T[]): T | undefined;
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Do not add a generic parameter you never use in the signature—that is noise and hurts inference elsewhere.

### 10. Readonly and generic collections

```ts
function sortedCopy<T extends number | string>(items: readonly T[]): T[] {
  return [...items].sort();
}
```

Accepting `readonly T[]` lets callers pass mutable arrays and readonly tuples without forcing them to copy at the boundary. Returning a fresh mutable array documents ownership transfer.

### 11. Type inference practices (everyday + generics)

Inference is not only a generics feature—it is how most local code stays readable. Staff habits:

**When to annotate returns**

| Annotate | Why |
|----------|-----|
| Exported / public functions | Intent is a contract; refactors must not silently widen |
| Non-obvious control flow | Multiple returns, unions, or `Promise` wrappers |
| Empty seeds (`[]`, `{}`, `null` placeholders) | Inference collapses to `any` / never-useful types |

Prefer **inference** for obvious locals and for generic helpers designed so callers do not write `<T>`.

**Contextual typing** flows “inward” from the expected type of a position (callback parameters, assignment RHS, return statements):

```ts
window.onmousedown = function (ev) {
  console.log(ev.button); // MouseEvent from context
};
```

Lift the same function to a freestanding `const handler = function (ev) { … }` without a contextual type and parameters may fall back toward `any` under weaker settings—annotate or keep the function in context.

**Object literal / array inference**

- Fresh object literals get excess-property checks when assigned to a typed target.
- Arrays use a **best common type** of elements; if you wanted a superclass/`Animal[]` but only subclasses appear, annotate the array type.
- `as const` / `satisfies` preserve literals without abandoning checking (chapters **03**, **06**, **07**).

```ts
const modes = ["read", "write"] as const; // readonly ["read", "write"]
const cfg = { port: 8080, env: "dev" } satisfies { port: number; env: string };
```

**Generics + inference:** put the informative value first; split `T`/`U` when inputs differ; avoid unused type parameters. When callers must always write `<…>`, redesign the signature (earlier sections in this chapter).

### 12. Lab — `keyof` constraint

```ts
type User = { id: string; email: string };

function setField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const u = setField({ id: "1", email: "a@b.c" }, "email", "x@y.z");
// setField(u, "email", 123); // error
```

**What just happened:** the constraint made the third argument track the property type—no cast required.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Typed repository methods `findById<T>()`, form helpers keyed by `keyof`, React-ish list renderers that preserve item type (surface door ch **19**) |
| **Systems** | Generic queue/pool wrappers over connection handles; typed message envelopes `Envelope<TPayload>` |
| **Security** | Do not generic-wash untrusted JSON into `T` without a runtime validator; generics are not authentication |
| **Operations** | CLI flag parsers that return typed option objects; health-check registries `Check<TContext>` |
| **Software engineering** | Shared `Result<T, E>` / `ApiResponse<T>` in internal libs; keep public generics shallow for compile speed |

Typical staff review questions:

1. Does this type parameter **preserve** something callers need, or is it decoration?
2. Is the constraint the **minimum** the body uses?
3. Will inference work for the common call?
4. Are we about to pay compile-time cost for a one-off abstraction?

---

## Staff-level review checklist

- New generics exist to relate inputs/outputs—not as ceremony over `any`.
- Constraints match operations used in the body; no blind casts inside.
- Call sites usually infer; explicit type args are rare and justified.
- Public returns annotated where inference would hide or widen intent; contextual typing leveraged for callbacks.
- Object/array seeds annotated or `as const` / `satisfies` used when literals matter.
- Multiple type parameters are used when values are not the same `T`.
- `keyof` / indexed access used instead of `string` keys + casts where possible.
- Public library generics stay shallow; pathological conditional nests deferred or avoided.
- Untrusted data is validated at runtime before claiming a generic `T`.
- Default type arguments do not hide `any` on exported APIs.
- Mutable generic collections are not treated as if they were covariant safely.
- `in` / `out` variance annotations left to libraries/DOM unless the team owns that API surface.
- Compile-time cost considered for hot shared packages (ch **15**).
- Remember: generics add **zero** runtime cost from `T` itself; measure JS work in ch **13**, `tsc` cost in ch **15**.

---

## References

- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [Keyof Types](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript 4.7 — Variance Annotations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
