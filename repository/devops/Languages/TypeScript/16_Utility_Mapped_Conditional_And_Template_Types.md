# Utility, mapped, conditional, and template types

[← Back to TypeScript](./README.md)

## What this chapter covers

How TypeScript’s **type-level toolbox** works once you already know objects, unions, and generics: **utility types**, **`keyof` / indexed access**, **mapped types**, **conditional types** (including `infer`), and **template literal types**. Default narrative: **TypeScript 5.9.x** with **`strict`: true**.

This is not a parlor-trick catalog. Staff use these tools to **reshape APIs**, **derive DTOs from domain types**, and **keep stringly protocols honest**—without inventing a second language inside the type checker. Pathological types that compile slowly belong in chapter **15**; here the habit is **clear transforms with an escape hatch**.

---

## 1. Concepts

### 1. Why type transforms exist

Runtime code remaps data with functions. TypeScript remaps **shapes** with types so callers see the result of that remap **before** emit. The mental model:

> Start from a known type → apply a **named transform** (utility) or a **pattern** (mapped / conditional / template) → get a new type that stays in sync when the source changes.

If you copy-paste `Partial<User>` by hand as twenty optional fields, you own drift. If you write `Partial<User>`, the checker owns sync.

### 2. Built-in utility types (the everyday set)

These live in the language; you do not import them. Learn the **job**, not every edge case on day one.

| Utility | Rough job | Review smell if misused |
|---------|-----------|-------------------------|
| `Partial<T>` | All properties optional | “Maybe everything” for APIs that require keys |
| `Required<T>` | All properties required | Forcing optional fields that are legitimately absent |
| `Readonly<T>` | Deep? No—shallow readonly props | Expecting nested immutability |
| `Pick<T, K>` | Keep keys `K` | Picking secrets into public DTOs |
| `Omit<T, K>` | Drop keys `K` | Omitting the wrong key silently |
| `Record<K, V>` | Object with keys `K`, values `V` | `Record<string, any>` as a dumping ground |
| `Exclude<T, U>` | From union `T`, remove `U` | Over-narrowing error unions |
| `Extract<T, U>` | Keep only members assignable to `U` | Empty extracts you ignore |
| `NonNullable<T>` | Drop `null` / `undefined` | Claiming non-null without a runtime check |
| `ReturnType<F>` | Return type of a function type | Coupling to a private helper’s signature |
| `Parameters<F>` | Parameter tuple of a function type | Same coupling smell |
| `ConstructorParameters<T>` | Parameter tuple of a construct signature | Coupling to a concrete class ctor |
| `InstanceType<T>` | Instance type of a construct signature | `typeof Foo` → instance without `new` |
| `ThisType<T>` | Marker for `this` in object-literal APIs | Library builders; rare in app DTOs |
| `Awaited<T>` | Unwrap Promise-like layers | Assuming one `.then` when nested |

```ts
type User = { id: string; email: string; role: "admin" | "user" };

type UserPatch = Partial<Pick<User, "email" | "role">>;
// { email?: string; role?: "admin" | "user" }

type PublicUser = Omit<User, "email">;
type ById = Record<User["id"], PublicUser>;
```

**What just happened.** `Pick` / `Omit` / `Partial` compose. `User["id"]` is **indexed access**—the type of that property—not a runtime lookup. Types still erase; none of this validates HTTP bodies alone (chapter **11**).

### 3. `keyof`, indexed access, and `typeof`

| Tool | Meaning |
|------|---------|
| `keyof T` | Union of property names of `T` |
| `T[K]` | Type of property `K` on `T` (`K` must be key-like) |
| `typeof value` | Type of a **value** in type position |

```ts
const defaults = { port: 8080, host: "localhost" } as const;
type Defaults = typeof defaults;
type DefaultKey = keyof Defaults; // "port" | "host"
type Port = Defaults["port"]; // 8080
```

`as const` tightens literals so `keyof` and template types stay precise. Pair with `satisfies` (chapter **15**) when you want check-against-a-shape **and** keep literal narrowness.

### 4. Mapped types — transform every property

A **mapped type** walks keys and rebuilds an object type:

```ts
type ReadonlyFlags<T> = {
  readonly [K in keyof T]: boolean;
};

type FeatureFlags = { darkMode: string; beta: string };
type FlagMap = ReadonlyFlags<FeatureFlags>;
// { readonly darkMode: boolean; readonly beta: boolean }
```

Common modifiers:

| Syntax idea | Effect |
|-------------|--------|
| `readonly [K in …]` | Add readonly |
| `-readonly [K in …]` | Remove readonly |
| `[K in …]?` | Make optional |
| `[K in …]-?` | Make required |

Homomorphic mapped types (mapping `keyof T` directly) **preserve** optional/readonly modifiers from `T` more faithfully than reinventing the object by hand. Prefer that shape when wrapping domain types.

### 5. Conditional types — branch on assignability

```ts
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<"hi">; // "yes"
type B = IsString<number>; // "no"
```

Distributive behavior: when `T` is a **naked type parameter**, `T extends U ? X : Y` distributes over unions:

```ts
type ToArray<T> = T extends unknown ? T[] : never;
type Mixed = ToArray<string | number>; // string[] | number[]
```

Wrap the parameter (`[T] extends [U]`) when you want a **non-distributive** check on the whole union.

### 6. `infer` — name a piece of a match

```ts
type Elem<T> = T extends (infer E)[] ? E : never;
type E1 = Elem<string[]>; // string

type AwaitedSimple<T> = T extends Promise<infer U> ? U : T;
```

`infer` only works in the **true** branch of a conditional. Staff habit: prefer built-in `Awaited` / `ReturnType` when they already express the idea—custom `infer` chains are easy to overgrow.

### 7. Template literal types — strings as protocols

```ts
type EventName = "click" | "focus";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus"

type Route = `/api/${string}/items`;
```

Intrinsic string helpers you will see: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`. Use templates for **event maps**, **CSS-ish keys**, **route patterns**, and **versioned message tags**—not for parsing English.

---

## 2. Advanced concepts

### 1. Key remapping (`as` in mapped types)

Modern mapped types can **rename or filter** keys:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Person = { name: string; age: number };
type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }
```

Filter by mapping a key to `never`:

```ts
type PublicOnly<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};
```

Powerful; also a compile-time cost center. If CI typecheck balloons after a “clever” remap, simplify (chapter **15**).

### 2. `satisfies` versus annotation versus assertion

| Form | Keeps literals? | Checks against shape? |
|------|-----------------|------------------------|
| `const x: T = …` | Often widens | Yes |
| `const x = … as T` | Varies; bypasses checks | Weak |
| `const x = … satisfies T` | Yes (values) | Yes |

Template and union-literal designs usually want **`satisfies`**: stay narrow for mapped keys, still verify the object is complete.

### 3. Variance and assignability pitfalls

Mapped and conditional results still follow TypeScript’s assignability rules. Classic footguns:

- `Readonly<T>` is not deeply readonly—nested objects stay mutable at the type level unless you map recursively (and recursion has depth limits).
- `Record<string, V>` accepts **any** string key; it does not mean “only known keys.” Prefer `Record<UnionOfKeys, V>` or a concrete interface for closed maps.
- Conditional types that return `any` or end in `as any` at the use site defeat the transform.

### 4. Recursion and “type instantiation is excessively deep”

Recursive conditionals (JSON parsers, deep `Readonly`, path joiners) hit checker limits. Staff options:

1. Cap depth with a numeric tuple counter pattern—or don’t recurse.
2. Push validation to **runtime** parsers; keep types as the **output** of parsing, not the parser itself.
3. Split helper types so error messages stay readable.

### 5. Utility types vs hand-rolled synonyms

Teams sometimes wrap every utility:

```ts
type Maybe<T> = Partial<T>; // hostile alias — hides meaning
```

Prefer standard names in public APIs. Domain aliases (`type UserId = string & { readonly __brand: "UserId" }`) are fine; renaming `Partial` is not.

### 6. Branded / nominal-ish IDs (pattern)

Structural typing will happily assign a `userId: string` where an `orderId: string` is expected. A **brand** (phantom property) makes the aliases incompatible at compile time while remaining plain strings at runtime:

```ts
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function asUserId(raw: string): UserId {
  return raw as UserId; // only after validation
}

function loadUser(id: UserId): void {
  /* … */
}

declare const orderId: OrderId;
// loadUser(orderId); // error — brands differ
loadUser(asUserId("u_123"));
```

Staff habits:

- Brand at the **trust boundary** after validation (chapter **11**)—not with a raw `as` on HTTP JSON.
- Prefer brands for IDs and “validated string” newtypes; do not brand every field in a DTO.
- Unique `symbol` brands are an alternative when you want harder accidental casting; intersection string brands stay the common literacy pattern (UI state: chapter **19**).

### 7. Brownfield: older handbook pages and `enum`

Pre–“Handbook 2.0” material lumped many of these under “advanced types.” Prefer the modern pages for mapped/conditional/template. String unions + maps usually beat **numeric enums** for new protocol work (chapter **07** literacy).

### 8. Erasure reminder at the type-level peak

None of these constructs emit runtime checks. A `NonNullable` return type does not remove nulls from JSON. Pair transforms with:

- narrowing and guards (chapters **04**, **11**),
- parsers at trust boundaries,
- tests that exercise the runtime path (chapter **18**).

---

## 3. Applications and use cases

### Application / product

- Derive **create / update / response** DTOs from one domain interface (`Pick` / `Omit` / `Partial`).
- Build **event handler maps** with template keys (`on${Event}`).
- Expose **feature flag** objects as `Readonly<Record<FlagName, boolean>>`.

### Systems / platform

- Config objects: `satisfies` a mapped `Record` of known env keys; fail CI if a key is missing.
- Typed wrappers around Node APIs: `Parameters` / `ReturnType` when adapting callbacks—without leaking `any`.

### Security

- `Omit` secrets and PII from log/DTO types so the typechecker pushes back on accidental inclusion.
- Avoid `Record<string, any>` for request bodies; prefer unknown + parse (chapters **11**, **19**).

### Operations

- CLI flag tables and message catalogs derived from literal unions keep runbooks and code aligned.
- Keep transforms shallow enough that `tsc` in CI stays fast—ops owns the wall clock (chapter **15**).

### Software engineering

- Library authors publish precise mapped APIs so consumers refactor with the compiler.
- Reviewers reject “clever” conditional stacks nobody can explain in standup.

| Domain | Typical transform | Pillar touch |
|--------|-------------------|--------------|
| API boundary | `Omit` / `Pick` DTOs | Errors if parse missing |
| Tooling config | `satisfies` + literals | Faster builds if shallow |
| Event protocols | Template keys | Exhaustiveness via `never` |

---

## 4. Staff-level review checklist

- Utility types compose for **sync with source**, not for obscurity.
- No `Partial<Everything>` on write APIs that need required fields.
- `Readonly` expectations match shallow vs deep reality.
- Mapped remaps (`as`) are named and documented; not one-liners in public exports without aliases.
- Conditionals prefer built-ins (`Awaited`, `ReturnType`, `InstanceType`, …) before custom `infer` towers.
- Branded IDs used where string mixups are costly; brands applied after runtime validation.
- Template literals model **closed protocols**, not free-text English.
- No `as any` / `Record<string, any>` escape next to a “strict” transform.
- Type-only cleverness does not replace runtime validation at trust boundaries.
- Compile-time cost considered (chapter **15**) if CI slowed after the PR.
- Default pin remains **TS 5.9.x** + `strict` for new packages.

---

## References

- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
