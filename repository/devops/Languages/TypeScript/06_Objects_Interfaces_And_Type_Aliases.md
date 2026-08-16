# Objects, interfaces, and type aliases

[← Back to TypeScript](./README.md)

## What this chapter covers

Most TypeScript in the wild is **object shapes**: configs, DTOs, options bags, domain models. By the end you should be able to:

1. Declare shapes with **`type`** aliases and **`interface`**.
2. Use **optional**, **readonly**, and **index signatures** deliberately.
3. Extend and intersect object types without painting into a corner.
4. Know **excess property checks** and structural typing consequences.
5. Choose **interface vs type** with a calm staff heuristic—not folklore.

Handbook default: **TS 5.9.x**, **`strict`: true**.

---

## 1. Concepts

### 1. Object types are contracts on properties

```ts
type User = {
  id: string;
  email: string;
};

interface UserI {
  id: string;
  email: string;
}
```

For simple object shapes, both work. TypeScript checks **structure**: any value with compatible properties fits.

### 2. Optional and readonly

```ts
type Job = {
  readonly id: string;
  name: string;
  priority?: number;
};
```

| Modifier | Meaning |
|----------|---------|
| `?` | Property may be absent |
| `readonly` | Reassignment of that property is an error (shallow) |

`readonly` is a **type-level** constraint. Nested objects are not deeply frozen unless you say so (or use helpers later).

### 3. Extending shapes

```ts
interface Timestamped {
  createdAt: Date;
}

interface AuditUser extends Timestamped {
  id: string;
  email: string;
}

type WithMeta = User & { version: number };
```

`interface extends` and intersection (`&`) both build richer shapes. Intersections also combine non-object types (chapter **07**).

### 4. Index signatures

```ts
type Headers = {
  [name: string]: string | undefined;
};
```

Index signatures allow open-ended keys. Known properties must be assignable to the index type. With `noUncheckedIndexedAccess`, reads may be `| undefined`.

**Index signature vs `Record`:**

| Form | Meaning | Prefer when… |
|------|---------|----------------|
| `{ [k: string]: V }` | Inline open string (or number) index on an object type | Mixing known keys + open bag carefully |
| `Record<K, V>` | Mapped type over key set `K` (`Record<string, V>` ≈ string-keyed dictionary) | Homogeneous dictionaries; key unions (`Record<"a" \| "b", V>`) |
| Explicit shape | Fixed keys only | Public APIs, DTOs, configs |

```ts
type FlagMap = Record<"dark" | "beta", boolean>;
type Loose = Record<string, number>; // every string key → number (still runtime-unchecked)
```

`Record<string, V>` does **not** prove a key exists at runtime. Prefer explicit shapes for contracts; use dictionaries when the key set is truly open—and narrow reads under `noUncheckedIndexedAccess` / defensive `??`.
### 5. Excess property checks (fresh literals)

```ts
type Opts = { timeoutMs: number };

function start(o: Opts): void {
  void o;
}

start({ timeoutMs: 100, debug: true }); // error on fresh literal
```

This catches typos at call sites. Values that flow through variables can carry extra properties—structural typing allows that.

### 6. `interface` declaration merging (awareness)

```ts
interface Box {
  height: number;
}
interface Box {
  width: number;
}
// Box has height and width
```

Multiple `interface` blocks with the same name **merge**. Useful for extending lib types; dangerous when accidental in app code. **`type` aliases do not merge.**

Intentional vs accidental:

| Intentional | Accidental |
|-------------|------------|
| Augmenting `Window` / framework interfaces when runtime really adds fields | Two files both declare `interface User` with different fields and silently combine |
| Module augmentation for middleware that attaches `req.id` | Copy-paste interface reopened “to add one field” across packages |
| DefinitelyTyped / ambient patterns | App domain models split across files without noticing merge |

Staff habit: for **app domain** shapes, prefer one declaration site—or `type` if you want merge to be impossible. Prefer **module augmentation** (`declare module "…"`) over sprinkling global interface merges. Augment only when the **runtime** attaches the field (chapter **17**).
### 7. Small lab

```ts
interface ServiceConfig {
  readonly name: string;
  baseUrl: string;
  retries?: number;
}

function normalize(cfg: ServiceConfig): Required<Pick<ServiceConfig, "name" | "baseUrl">> & {
  retries: number;
} {
  return {
    name: cfg.name,
    baseUrl: cfg.baseUrl.replace(/\/$/, ""),
    retries: cfg.retries ?? 3,
  };
}
```

(`Required` / `Pick` are utility types—chapter **16** deepens them; reading them here is fine.)

### Runtime cost (learn early)

Object **types** erase; object **values** allocate. Habits:

- Every `{ … }` literal and `{...spread}` makes a **new** object (a shallow copy for spread).
- Deep clone is expensive—reach for it only when you truly need a detached tree.
- Prefer mutate-in-place **only when intentional and safe** (shared mutable state is easy to get wrong).
- A fat `Record<string, V>` with many keys is still one object at runtime; cost is property count and churn, not the `Record` spelling.

```ts
const next = { ...prev, count: prev.count + 1 }; // new object — fine often; hot loops: measure
```

Deepen in chapter **13**.

---

## 2. Advanced concepts

### 1. Interface vs type — staff heuristic

| Prefer **`interface`** when… | Prefer **`type`** when… |
|------------------------------|-------------------------|
| Object/API shapes you may extend | Unions, tuples, mapped/conditional types |
| You want declaration merging on purpose | You want to **forbid** merging |
| Public OOP-ish contracts | Sum types and aliases of aliases |

Both are fine for local object shapes. Consistency inside a package beats purity debates.

### 2. `exactOptionalPropertyTypes`

Under this flag (on in 5.9 init spirit), optional properties distinguish **missing** from **explicitly `undefined`**. Assigning `{ x: undefined }` to `{ x?: number }` can fail. Match serialization layers carefully—JSON often omits keys rather than sending `null`/`undefined`.

### 3. Readonly is shallow

```ts
type State = { readonly points: { x: number; y: number }[] };
```

You cannot reassign `points`, but you may still mutate `points[0].x` unless deeper readonly types are used.

### 4. Empty object type `{}`

`{}` means “any non-nullish value” more than “empty object.” Prefer `Record<string, never>` or explicit shapes when you mean “no keys.” Avoid `{}` as a “I don’t know” stand-in—use `unknown` or a real type.

### 5. Property vs method syntax in types

```ts
type A = { f: () => void };
type B = { f(): void };
```

Subtle differences appear under `strictFunctionTypes` / bivariance rules for methods. Prefer property syntax for function fields in new object types unless matching a class method shape.

### 6. Extending vs intersecting conflicts

Intersecting incompatible property types can produce `never` for that key. That is a signal you merged two domains that disagree—fix the model rather than asserting away.

### 7. Classes as object types

Instances of classes are object types too; `implements` checks that a class satisfies an interface. Chapter **09** covers heritage; here, remember interfaces describe **instances**, not always static side.

### 8. Options bags vs positional growth

When a function gains a third boolean flag, stop. Introduce an **options object** type:

```ts
type FetchOpts = {
  timeoutMs?: number;
  retries?: number;
  signal?: AbortSignal;
};
```

Bags age better than `fn(a, b, true, false, true)`. Keep required fields minimal; default inside the function.

### 9. Branding / nominality lite (door)

Structural typing means `{ id: string }` for User and Order collide. Teams sometimes add a **brand** field or unique symbol for nominal-ish IDs. The concrete pattern (and validation habit) lives in chapter **16**; for now: if two domains share a shape accidentally, rename fields or tag them—don’t rely on the type name alone for safety.

### 10. Satisfies preview

```ts
const cfg = {
  name: "api",
  baseUrl: "https://example.com",
} satisfies ServiceConfig;
```

`satisfies` checks a value against a type **without widening away** literals. chapter **15** uses it for config hygiene; object chapters own the shape it checks.

### 11. Index signatures vs `Record` — deeper review

Homogeneous maps: `Record<string, V>` is usually clearer than a lone index signature. Heterogeneous objects with a few known keys plus an open bag: write known keys first, then an index signature whose value type **accepts** those known properties—or split into a precise type plus a `Record` for extras.

```ts
// Painful: known key must fit the index
type Bad = {
  id: number;
  [k: string]: string; // error — number not assignable to string
};

type Ok = {
  id: string;
  [k: string]: string | undefined;
};
```

Avoid `Record<string, any>` as a DTO stand-in. Prefer `unknown` values and narrow, or generate types from schemas.

### 12. Declaration merging — intentional toolkit

Beyond reopened interfaces, TypeScript merges **namespaces**, and namespaces can merge with classes/functions/enums for JS interop patterns (inner classes, function + static props). That is literacy for reading libraries—not a greenfield app pattern (namespaces: chapter **10**).

Module / global augmentation is the structured form for patching third-party types:

```ts
declare global {
  interface Window {
    __APP_BUILD__?: string;
  }
}
```

Review question: does runtime set `__APP_BUILD__`? If not, delete the merge.

---

## 3. Applications and use cases

| Angle | Object types in practice |
|-------|---------------------------|
| **Application** | Props, form models, API clients, feature flags objects. |
| **Systems** | Service discovery records, health payloads, queue message envelopes. |
| **Security** | Minimal privilege shapes—don’t type an auth token bag as open index `any`. |
| **Ops** | Config objects with `readonly` secrets fields after load; never log full shapes. |
| **SE** | Shared `interface` packages become the contract between teams. |

**Whole-engineering picture:** object types are how organizations **agree on data**. Merging, optionality, and index signatures are where silent disagreement sneaks in.

---

## Staff-level review checklist

- Public shapes use `interface` or `type` consistently within the package.
- Accidental **declaration merging** is not relied upon in app code; augmentations match runtime.
- Optional vs required matches wire format and DB nullability—documented if tricky.
- Index signatures / `Record` are justified; not a dumping ground for untyped maps; known keys assignable to any index type.
- Fresh-literal call sites benefit from excess property checking (no useless widening wrappers).
- `readonly` used where mutation would be a bug; deep immutability considered when needed.
- `exactOptionalPropertyTypes` interactions understood if the flag is on.
- No `{}` or open `any` index as a substitute for modeling.
- Hot paths: aware of object/`{...spread}` allocation vs intentional in-place updates (ch **13**).

---

## References

- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Object Types — index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)
- [Everyday Types — object types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types)
- [Interfaces vs type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- [Utility Types — `Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TSConfig `exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
