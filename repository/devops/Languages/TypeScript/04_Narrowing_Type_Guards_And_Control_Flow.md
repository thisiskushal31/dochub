# Narrowing, type guards, and control flow

[← Back to TypeScript](./README.md)

## What this chapter covers

**Narrowing** is how TypeScript becomes useful on real unions—and how production **error handling** stays honest. By the end you should be able to:

1. Explain **control-flow analysis**: how checks change a variable’s type in a scope.
2. Use built-in narrowers: `typeof`, `instanceof`, equality, truthiness, `in`.
3. Write **user-defined type guards** (`x is T`) and understand their trust model.
4. Use **`never`** for exhaustiveness in `switch` / if-else chains.
5. Prefer narrowing over **`as`** casts—especially for errors and untrusted data.

This chapter feeds pillar **11** (errors). If you only skim one early chapter deeply, make it this one.

Handbook default: **TS 5.9.x**, **`strict`: true**.

---

## 1. Concepts

### 1. What narrowing is

A variable often starts as a **union** (`string | number`, `Error | undefined`, `unknown`). **Narrowing** is the process by which checks prove that, in a region of code, fewer members remain—so the checker allows member-specific operations.

```ts
function len(x: string | string[]): number {
  if (typeof x === "string") {
    return x.length; // string
  }
  return x.length; // string[]
}
```

Same property name, different types—control flow makes both safe.

### 2. Why it matters more than annotations

Annotations declare intent. Narrowing is how you **prove** intent along a path. Without it, teams reach for casts, and casts become silent production lies.

### 3. `typeof` narrowing

Works well for JS primitives: `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"function"`, `"object"`.

Caveats you must memorize early:

| Check | Reality |
|-------|---------|
| `typeof null` | `"object"` — null is not narrowed by a naive object check alone |
| Arrays | `typeof [] === "object"` — use `Array.isArray` |
| Classes | Prefer `instanceof` for class instances |

```ts
function asString(x: unknown): string | undefined {
  if (typeof x === "string") return x;
  return undefined;
}
```

### 4. Truthiness and equality

```ts
function label(name?: string): string {
  if (name) {
    return name.toUpperCase(); // string
  }
  return "anonymous";
}
```

Truthiness narrows away “falsy” values—including `""` and `0` when those are in the domain. If empty string is valid data, use **explicit** `!= null` or `!== undefined` checks instead of bare `if (name)`.

Discriminated equality (`===` / `!==` on literal tags) is the backbone of tagged unions (chapter **07**).

### 5. `in` and `instanceof`

```ts
type Ok = { ok: true; value: string };
type Err = { ok: false; error: string };

function message(r: Ok | Err): string {
  if ("value" in r) return r.value;
  return r.error;
}

function explain(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
```

`instanceof` follows the prototype chain—good for real classes, weak for cross-realm objects and plain `{ message }` bags.

### 6. `Array.isArray`

```ts
function first(x: string | string[]): string {
  if (Array.isArray(x)) return x[0] ?? "";
  return x;
}
```

### 7. User-defined type predicates

```ts
type User = { id: string; email: string };

function isUser(x: unknown): x is User {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.email === "string";
}

function emailOf(x: unknown): string | undefined {
  if (isUser(x)) return x.email;
  return undefined;
}
```

The predicate return type `x is User` teaches the checker. **You** are responsible for the runtime test being correct—TypeScript trusts the boolean.

### 8. Assertion functions (preview toward errors)

```ts
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function needPort(port: number | undefined): number {
  assert(port !== undefined, "PORT required");
  return port; // number
}
```

`asserts` narrows after the call. Chapter **11** deepens typed errors; the mechanism starts here.

### 9. `never` and exhaustiveness

```ts
type Shape = "circle" | "square";

function area(kind: Shape, size: number): number {
  switch (kind) {
    case "circle":
      return Math.PI * size * size;
    case "square":
      return size * size;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
```

If someone adds `"triangle"` to `Shape`, the `never` assignment fails to compile. That failure is a **feature**.

### 10. Small lab — unknown in, narrow out

```ts
function readCode(payload: unknown): number {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("expected object");
  }
  if (!("code" in payload)) {
    throw new Error("missing code");
  }
  const code = (payload as { code: unknown }).code;
  if (typeof code !== "number") {
    throw new Error("code must be number");
  }
  return code;
}
```

This pattern—**unknown → checks → concrete type**—is the everyday form of safe boundary handling.

### Runtime cost (learn early)

Narrowing and type annotations **erase**. The machine only pays for the **guards you wrote**—`typeof`, `"key" in obj`, `instanceof`, `Array.isArray`, custom predicates. Habits:

- Put **cheap checks first** (`typeof`, nullish, tag equality) before expensive ones.
- Do not hide heavy work (regex over megabytes, disk, network) inside a type guard used on a **hot path**.

```ts
function isUser(x: unknown): x is { id: string } {
  return typeof x === "object" && x !== null && "id" in x && typeof (x as { id: unknown }).id === "string";
}
```

Deepen in chapter **13**.

---

## 2. Advanced concepts

### 1. Control-flow analysis limits

Narrowing is syntactic and local. Assigning to a wider-typed alias, storing in a shared mutable field, or checking in a separate function **without** a predicate often **resets** knowledge.

```ts
function bad(x: string | number) {
  const check = () => typeof x === "string";
  if (check()) {
    // x is still string | number — check() is not a type guard
  }
}
```

### 2. Discriminated unions beat boolean soup

Prefer a shared **tag** field (`type: "a" | "b"`) over parallel optional fields that mean different things. Narrowing on the tag is stable and readable in review.

### 3. Filtering with predicates

```ts
const rows: unknown[] = [];
const users = rows.filter(isUser); // User[] if isUser is a predicate
```

Without `x is T`, `filter` stays `unknown[]`.

### 4. Narrowing `catch` clauses

```ts
try {
  // ...
} catch (e) {
  // e is unknown under strict / useUnknownInCatchVariables
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(String(e));
  }
}
```

Never write `catch (e: any)`. Pillar **11** builds Result-style and custom error types on this foundation.

### 5. Casting and type assertions

Type assertions (`as T`) and angle-bracket casts (`<T>value`) tell the checker you know more than it can prove. They **erase at emit**—no runtime conversion, no thrown error if you are wrong.

```ts
const canvas = document.getElementById("main") as HTMLCanvasElement | null;
```

**`as` vs angle brackets:** both are equivalent in `.ts` files. In **`.tsx`**, angle-bracket casts conflict with JSX—prefer `as`. Habit: use `as` everywhere so TS/TSX stay consistent.

**What assertions allow:** TypeScript only accepts assertions that move to a more specific or less specific related type. “Impossible” coercions fail unless you double-assert:

```ts
// const bad = "hello" as number; // error — neither overlaps
const forced = "hello" as unknown as number; // compiles — review event
```

`as unknown as T` (or `as any as T`) is the **escape hatch** when overlap rules block you. Treat it like `as any`: require a comment that would survive a postmortem, or replace with a validator / guard.

| Tool | Runtime proof? | When it is OK |
|------|----------------|---------------|
| Narrowing / `x is T` guard | Yes (if the check is honest) | Default for unions and `unknown` |
| `asserts` function | Throws if false | Invariants and boundaries |
| `as T` after a related check | No | DOM tags you own; narrowing step after `typeof` object checks |
| `as unknown as T` | No | Almost never in app code; library interop last resort |
| Non-null `!` | No | Locally proven non-null; never on untrusted lookups |

**Staff rule:** guards and control-flow first; casts only when the type system cannot see a fact you have already established (and ideally right next to that establishment). Casting `JSON.parse` straight to a domain type is a classic production lie—validate into the type (chapters **03**, **11**).

```ts
function asRecord(x: unknown): Record<string, unknown> | undefined {
  if (typeof x !== "object" || x === null || Array.isArray(x)) return undefined;
  return x as Record<string, unknown>; // OK: runtime proved object-ness
}
```

That last `as` is a controlled bridge after checks—not a substitute for them.
### 6. Optional chaining and narrowing

`obj?.prop` helps at runtime; it does not always produce the same narrowing as an explicit `if (obj)`. Prefer explicit checks when the branch must teach the checker.

### 7. Exhaustiveness in libraries

Public unions should be designed so callers *can* exhaust. If you leave an open string (`string` instead of literals), you give up exhaustiveness—sometimes intentionally for extension, often by accident.

---

## 3. Applications and use cases

| Angle | Narrowing in practice |
|-------|------------------------|
| **Application** | API response unions; UI state machines; form validation branches. |
| **Systems** | Config feature flags as tagged unions; process message protocols. |
| **Security** | Authz decisions: narrow roles before privileged calls; never cast “trusted.” |
| **Ops** | Parse tool output as `unknown`, guard, then act—fewer brittle regex-only scripts. |
| **SE** | Exhaustive `switch` makes refactors add cases in CI, not in production. |

**Whole-engineering picture:** narrowing is the type system’s version of **defense in depth**. It connects chapter **03** vocabulary to chapter **11** error discipline and chapter **12** async rejection handling.

---

## Staff-level review checklist

- Unions are narrowed with **real checks**, not `as` to silence the compiler.
- `catch` uses **`unknown`** (or equivalent) and narrows before property access.
- User-defined guards are **correct at runtime**—not cargo-culted predicates that always return true.
- Tagged unions preferred over ambiguous optional-field soups.
- `switch` on closed unions has a **`never`** default (or equivalent exhaustiveness).
- Truthiness checks are safe for the domain (empty string / zero considered).
- `Array.isArray` used where arrays vs objects matter.
- Cross-function checks use **predicates** or **asserts**, not hope.
- No `as any` / `as unknown as T` to “finish the PR” on boundary data without justification.
- Angle-bracket casts avoided in TSX; prefer `as` project-wide.
- Type guards on hot paths stay cheap; heavy work is not buried inside predicates (ch **13**).

---

## References

- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Everyday Types — type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [More on Functions — type predicates](https://www.typescriptlang.org/docs/handbook/2/functions.html#using-type-predicates)
- [More on Functions — assertion functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#assertion-functions)
- [Discriminated unions (object types)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [TSConfig `useUnknownInCatchVariables`](https://www.typescriptlang.org/tsconfig#useUnknownInCatchVariables)
