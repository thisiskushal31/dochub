# Unions, intersections, literals, and enums

[← Back to TypeScript](./README.md)

## What this chapter covers

**Unions and literals** are how modern TypeScript models real states. **Enums** still appear in brownfield and some libraries—you must read them—but **new code should prefer unions**. By the end you should be able to:

1. Build **union** and **intersection** types deliberately.
2. Use **string/number literal** types and **discriminated unions**.
3. Narrow tagged unions with control flow (ties to chapter **04**).
4. Read **`enum` / `const enum`** and know their pitfalls.
5. Apply a staff rule: **prefer union literals for new work**.

Handbook default: **TS 5.9.x**, **`strict`: true**.

---

## 1. Concepts

### 1. Unions: “one of”

```ts
type Id = string | number;

function key(id: Id): string {
  return String(id);
}
```

A value of type `A | B` is **either** an `A` or a `B`. You may only use members common to both until you narrow.

### 2. Intersections: “all of”

```ts
type Timestamped = { createdAt: Date };
type Named = { name: string };
type Entity = Timestamped & Named;
```

Intersections are powerful for composing object traits. Intersecting incompatible primitives (`string & number`) collapses toward `never`—usually a modeling bug.

### 3. Literal types

```ts
type Direction = "north" | "south" | "east" | "west";
type Dice = 1 | 2 | 3 | 4 | 5 | 6;
type Toggle = true; // rarely useful alone; common inside unions
```

Literals let you model **closed sets**. Combined with unions, they replace many enums.

### 4. Discriminated (tagged) unions

```ts
type Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

function show(r: Result): string {
  if (r.ok) return r.value;
  return r.error;
}
```

The discriminant (`ok`, or often `type: "…"`) makes narrowing reliable. This is the default staff pattern for state machines, network results, and parse outcomes.

### 5. `type` aliases for unions

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
```

Aliases keep call sites readable and give exhaustiveness a single source of truth.

### 6. Enums — literacy (not the default for new code)

```ts
enum Role {
  Admin = "admin",
  User = "user",
}

function canEdit(role: Role): boolean {
  return role === Role.Admin;
}
```

Enums exist in three common flavors:

| Kind | Sketch | Notes |
|------|--------|-------|
| Numeric enum | `enum E { A, B }` | Reverse mapping; surprising runtime object |
| String enum | `enum E { A = "a" }` | More predictable; still a runtime value |
| `const enum` | inlined at compile time | Erased differently; careful with isolated modules / bundlers |

**Handbook habit for new code:** prefer `type Role = "admin" | "user"` (and maybe a const object for runtime values) over `enum`.

```ts
const Role = {
  Admin: "admin",
  User: "user",
} as const;

type Role = (typeof Role)[keyof typeof Role];
```

You get literals + a runtime map without enum oddities.

### 7. Small lab — prefer unions

```ts
type JobState =
  | { status: "queued" }
  | { status: "running"; startedAt: number }
  | { status: "done"; finishedAt: number }
  | { status: "failed"; reason: string };

function label(job: JobState): string {
  switch (job.status) {
    case "queued":
      return "waiting";
    case "running":
      return `since ${job.startedAt}`;
    case "done":
      return `done @ ${job.finishedAt}`;
    case "failed":
      return `failed: ${job.reason}`;
    default: {
      const _n: never = job;
      return _n;
    }
  }
}
```

### Runtime cost (learn early)

Unions and discriminants are mostly a **type-level** design. At runtime you pay for the **checks and branches** you write. Habits:

- A shared **tag** (`type: "a" | "b"`) makes a fast, clear `switch`—prefer that over nested “maybe this field, maybe that” soups.
- **String enums** are real objects at runtime; literal unions are usually just strings—often simpler on the wire and in comparisons.
- Keep unions **flat** when you can; giant nested if-ladders are harder for both humans and CPUs.

```ts
switch (msg.kind) { // discriminant — one cheap string compare per arm
  case "ping": return "pong";
  case "echo": return msg.text;
}
```

Deepen in chapter **13**.

---

## 2. Advanced concepts

### 1. Union property access rules

You can only access properties that exist on **all** members—or narrow first. Optional properties on some members require care (`"prop" in x` or tags).

### 2. Distributive behavior preview

Conditional types distribute over unions (chapter **16**). Even before that, know that many helpers “map over” each union member—design unions as meaningful variants, not accidental bags.

### 3. String enums vs unions at the boundary

String enums are **nominal-ish** relative to plain strings: you may need casting when talking to JSON. Literal unions accept the string `"admin"` naturally. For wire formats, unions usually hurt less.

### 4. Numeric enum pitfalls

Numeric enums create reverse mappings (`E[0]` → name) and allow assignment from arbitrary numbers more easily than people expect. They are a frequent source of “how did this value get here?” Prefer string unions.

### 5. `const enum` and toolchain honesty

`const enum` inlines members into emit. With `isolatedModules` / certain bundlers, `const enum` can be restricted or awkward. If you need inlining, verify your emit pipeline; otherwise skip `const enum`.

### 6. Intersection with functions / callables

Intersecting function types produces overloads-like behavior. Useful in advanced library typings; easy to overuse in apps. Prefer explicit overloads or separate properties.

### 7. Template literal types (door)

`` type EventName = `on${string}` `` exists for advanced APIs (chapter **16**). Do not reach for them when a plain string union suffices.

### 8. `enum` in libraries you consume

You will still see enums in DOM libs and older packages. Narrow with `===`, convert at boundaries, and do not spread numeric enums into new domain models without need.

### 9. Unions with `null` and `undefined`

```ts
type MaybeUser = User | null;
type OptUser = User | undefined;
```

Pick **one** absent sentinel per API layer when you can. Mixing `null` and `undefined` in the same union without a reason doubles every caller’s narrowing. Align with JSON (`null`) vs JS optional properties (`undefined`) deliberately.

### 10. Intersection for “mixin” configs

```ts
type Loggy = { logLevel: "debug" | "info" | "error" };
type Retries = { retries: number };
type ClientOpts = Loggy & Retries & { baseUrl: string };
```

Compose small traits instead of one mega-interface that every caller partially fills. If a trait becomes optional as a whole, wrap it (`Partial<Loggy>`) intentionally—chapter **16**.

### 11. Migration note: enum → union

When touching brownfield enums:

1. Introduce the string union (or `as const` object) alongside.
2. Accept both at boundaries briefly if needed.
3. Remove the enum once call sites and serialization agree.

Do not half-migrate (numeric enum values still on the wire, union in types only).

---

## 3. Applications and use cases

| Angle | Unions / enums in practice |
|-------|----------------------------|
| **Application** | UI state, feature flags, form steps as tagged unions. |
| **Systems** | Protocol message variants; job state machines; health statuses. |
| **Security** | Role/permission literals—closed sets beat open `string`. |
| **Ops** | Exit codes / incident severities as literal unions in tooling. |
| **SE** | Exhaustive switches as refactor safety nets across packages. |

**Whole-engineering picture:** a union is a **designed set of possibilities**. An open `string` is a shrug. Enums are a historical encoding of that idea—learn them, prefer unions for new designs.

---

## Staff-level review checklist

- New closed sets use **literal unions** (or `as const` objects)—not numeric enums by default.
- Domain states are **discriminated unions**, not booleans + optional fields.
- Exhaustiveness (`never`) present on critical switches.
- JSON/API boundaries do not assume string enums assign freely—map explicitly if enums exist.
- Intersections compose traits without creating `never` fields by accident.
- `const enum` only with a verified emit/bundler story.
- Review comments reject “just make it `string`” when the set is known and finite.
- Brownfield enums are documented if retained; migrations prefer unions when touching the area.
- Hot-path variant handling prefers discriminants / flat switches over nested soup (ch **13**).

---

## References

- [Everyday Types — union types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Narrowing — discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Object Types — intersection types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersecting-types)
- [Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
- [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [typeof types / keyof (const objects)](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
