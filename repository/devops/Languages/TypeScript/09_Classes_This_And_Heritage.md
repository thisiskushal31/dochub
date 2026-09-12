# Classes, this, and heritage

[← Back to TypeScript](./README.md)

## What this chapter covers

How TypeScript types **classes**: fields, constructors, `public` / `private` / `protected` / `#` hard privacy, `readonly`, inheritance and `implements`, abstract classes, and the sharp edges of **`this`**. Default is **TypeScript 5.9.x** with **`strict`: true** (including `strictPropertyInitialization` literacy).

You leave able to choose class vs plain object/factory, keep `this` sound under callbacks, and review heritage trees that fight structural typing.

---

## 1. Concepts

### 1. Classes are values and types

A class declaration creates:

1. A **runtime constructor** function (and prototype methods)—ordinary JavaScript.
2. A **type** for instances (the shape of `this` after construction).
3. A **constructor type** for the class itself (`typeof MyClass`).

```ts
class Counter {
  count = 0;
  inc(): void {
    this.count += 1;
  }
}

const c = new Counter();
c.inc();
```

Types erase: access modifiers and parameter properties are compile-time discipline unless you use runtime `#` private fields.

### 2. Fields and initialization

With `strictPropertyInitialization`, every definite field must be initialized in the constructor (or with a property initializer), unless marked optional or with a definite assignment assertion used deliberately.

```ts
class User {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
```

**Parameter properties** are shorthand for declare-and-assign:

```ts
class User {
  constructor(
    public readonly id: string,
    public name: string,
  ) {}
}
```

Prefer clarity over cleverness on public APIs; shorthand is fine for small DTOs and services.

### 3. Visibility

| Spell | Compile-time? | Runtime? | Notes |
|-------|---------------|----------|-------|
| `public` | Default | No | Documentational |
| `protected` | Yes | No | Subclasses see it; erase at emit |
| `private` | Yes | No | Soft; still accessible via bracket tricks in JS |
| `#field` | Yes | Yes | True hard privacy in modern JS targets |

```ts
class Vault {
  #secret: string;
  constructor(secret: string) {
    this.#secret = secret;
  }
  reveal(): string {
    return this.#secret;
  }
}
```

Use `#` when privacy must hold at runtime (secrets in process, invariants). Use `private` when you only need API hygiene inside a TS codebase.

### 4. `readonly` and `static`

`readonly` prevents reassignment of the property through typed access (not deep immutability). `static` members live on the constructor; their type is on `typeof Class`, not on instances.

```ts
class Config {
  static readonly appName = "tools";
  constructor(public readonly env: string) {}
}
```

### 5. Heritage: `extends` and `implements`

- **`extends`**: inherit implementation (single superclass in JS).
- **`implements`**: claim an interface/type shape; the class must satisfy it structurally.

```ts
interface Logger {
  info(message: string): void;
}

class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(message);
  }
}

class PrefixedLogger extends ConsoleLogger {
  constructor(private prefix: string) {
    super();
  }
  override info(message: string): void {
    super.info(`${this.prefix}${message}`);
  }
}
```

`override` (with `noImplicitOverride` recommended) catches rename mistakes when the base method disappears.

### 6. Abstract classes

Abstract classes are partially implemented bases that cannot be constructed directly:

```ts
abstract class Job {
  abstract run(): Promise<void>;
  async execute(): Promise<void> {
    await this.run();
  }
}
```

Prefer interfaces + composition when you only need a contract. Prefer abstract classes when shared implementation and a forced override set travel together.

### 7. Lab — soft private vs hard private

```ts
class Soft {
  private token = "t";
}
class Hard {
  #token = "t";
}

const s = new Soft();
// s.token; // compile error
console.log((s as unknown as { token: string }).token); // still there at runtime

const h = new Hard();
// (h as any).#token // syntax/runtime wall — hard private
```

**What just happened:** TypeScript `private` is a type-system boundary; `#` is a language boundary.

### Runtime cost (learn early)

`class` instances **allocate** like any object. Method calls are in the same ballpark as functions. Habits:

- Avoid `new` in **tight loops** when a plain object, struct-like record, or a small pool would do.
- Soft `private` and hard `#` fields are still **data on the instance**—privacy is not free RAM.

```ts
// Hot path: often prefer a plain object or reused buffer over per-row class construction
const row = { id, name }; // not: new Row(id, name) millions of times without measuring
```

Deepen in chapter **13**.

---

## 2. Advanced concepts

### 1. `this` parameters and typing methods

Under `strict` / `noImplicitThis`, unbound method extraction loses `this`:

```ts
class Service {
  name = "svc";
  label(this: Service): string {
    return this.name;
  }
}

const s = new Service();
const fn = s.label;
// fn(); // error with explicit this parameter / strict this checks
fn.call(s);
```

Patterns that keep `this` sound:

- Arrow function **fields** when you need lexical `this` (cost: per-instance function).
- `.bind` at construction for methods passed to DOM/Node emitters.
- Pass `this` as an explicit argument instead of relying on method-as-callback.

```ts
class Button {
  clicks = 0;
  onClick = (): void => {
    this.clicks += 1;
  };
}
```

### 2. Polymorphic `this` return types

Methods can return `this` so subclasses keep their type through fluent chains:

```ts
class Builder {
  tag(value: string): this {
    return this;
  }
}

class QueryBuilder extends Builder {
  where(clause: string): this {
    return this;
  }
}

const q = new QueryBuilder().tag("a").where("b"); // QueryBuilder
```

### 3. Structural typing vs nominal intuition

TypeScript classes are largely **structural** for instances: if the shape matches, it assigns—even without heritage—unless you use brand tricks or hard private fields that make types nominally distinct.

```ts
class A {
  x = 1;
}
class B {
  x = 1;
}
const a: A = new B(); // ok structurally
```

Do not assume Java-like nominal class identity. Private/`#` fields change assignability because the private identity differs.

### 4. Constructors and `typeof`

Factories sometimes need the class constructor type:

```ts
type Ctor<T> = new (...args: never[]) => T;

function create<T>(Ctor: Ctor<T>): T {
  return new Ctor();
}
```

For real constructors with parameters, model `new (...args: any[]) => T` carefully—prefer precise arg tuples. Cross-link: declaration files (ch **17**) often export both instance and constructor interfaces for CJS interop.

### 5. Mixins literacy (door)

JS has no multiple inheritance. Mixin patterns copy methods onto a class. TypeScript can describe mixins with intersection constructors; keep them rare—composition with delegated objects is usually clearer for ops tooling.

### 6. Decorators — door (experimental vs standard)

Decorators (`@foo`) annotate or wrap classes and members. They are a **compiler + runtime** feature—not everyday CLI style.

Two eras coexist:

| Mode | How you get it | Notes |
|------|----------------|-------|
| **Standard / Stage 3-style** (TS 5.0+) | Valid without `experimentalDecorators`; different typecheck + emit | Prefer for **new** decorator code on a 5.x pin |
| **Legacy experimental** | `experimentalDecorators` (often with `emitDecoratorMetadata` + `reflect-metadata`) | Common in older Nest/Angular-era stacks |

Legacy decorator **functions** usually do **not** drop in unchanged under the standard model—framework docs decide which mode you are on. Mixing both mental models in one package is a review smell.

**When decorators are OK**

- The framework already requires them (DI, routing, ORM column metadata).
- The team owns the emit settings and tests runtime behavior—not only `tsc`.

**When to refuse them**

- Plain Node CLIs, libraries, and ops tools with no framework decorator contract.
- “We wanted annotations” without a runtime story—use functions, plain config, or explicit registration maps instead.

This handbook does not teach writing decorator factories end-to-end. Treat the official Decorators docs + your framework’s TypeScript guide as the next door (chapter **22**).

### 7. Explicit resource management — `using` / `Disposable` (door)

Modern JS/TS supports **`using`** / **`await using`** for deterministic cleanup (Explicit Resource Management). Types involve `Disposable` / `AsyncDisposable` and `Symbol.dispose` / `Symbol.asyncDispose`.

```ts
class FileHandle implements AsyncDisposable {
  async [Symbol.asyncDispose](): Promise<void> {
    /* close underlying handle */
  }
}

await using handle = new FileHandle();
// dispose runs when the block exits — success or throw
```

Literacy only here:

- Prefer it when your **runtime + target** already support the feature (or your toolchain polyfills emit).
- Still model failures with `unknown` in `catch` (ch **11**); disposal does not replace error handling.
- For Node streams/handles today, `try`/`finally` + `close()` remains the universal pattern (ch **14**).

Do not rewrite every `try`/`finally` for fashion—adopt when the host pin makes `using` reliable in CI and prod.

### 8. Error subclasses preview

Custom `Error` subclasses (pillar ch **11**) use classes for `instanceof` and fields. Prefer `Object.setPrototypeOf` / standard patterns so `instanceof` works across compile targets—covered deeply in the error chapter.

### 9. Brownfield: fields vs prototype methods

Older emit / `useDefineForClassFields` interactions can surprise when subclasses read fields before `super` finishes. Pin **TS 5.9.x** and modern `target`/`lib`; when upgrading old codebases, read release notes for class field semantics and test subclass initialization.

### 10. Lab — `implements` does not copy

```ts
interface Repo {
  get(id: string): Promise<string | undefined>;
}

class MemoryRepo implements Repo {
  private data = new Map<string, string>();
  async get(id: string): Promise<string | undefined> {
    return this.data.get(id);
  }
}
```

**What just happened:** `implements` only checks the instance shape—it does not generate methods.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Service classes with injected deps; view-model-ish state holders when the framework expects classes |
| **Systems** | Connection / client wrappers with lifecycle methods (`connect` / `close`); abstract `Transport` bases |
| **Security** | `#` for in-memory secrets; never log private fields; avoid exposing class instances over untrusted RPC without DTOs |
| **Operations** | Worker job classes with `run()`; health components registering in a composition root |
| **Software engineering** | Prefer interfaces for contracts; classes for stateful lifecycle; keep heritage shallow |

Staff preference in many TS codebases: **functions + modules** for logic, classes when the domain has clear identity + lifecycle. Neither is ideology—match the runtime host (React class components are legacy; Node services may still be class-shaped).

---

## Staff-level review checklist

- `strictPropertyInitialization` honored; no casual `!` on fields without proof of assignment.
- Soft `private` vs `#` chosen deliberately for secrets/invariants.
- `override` / `noImplicitOverride` used on intentional overrides.
- Methods passed as callbacks preserve `this` (arrows, bind, or redesign).
- Heritage depth stays shallow; prefer composition for optional behavior.
- `implements` lists real contracts; unused interfaces not cargo-culted.
- Fluent APIs use polymorphic `this` when subclassing matters.
- No reliance on nominal class identity without private branding.
- Abstract classes justified by shared implementation—not empty marker bases.
- Decorators only where the framework/toolchain requires them; legacy vs standard mode documented; not invented for plain CLIs.
- `using` / `Disposable` only when runtime + CI pins support them; otherwise `try`/`finally` stays honest.
- Class field / target semantics verified after compiler upgrades.
- Hot paths avoid needless per-iteration `new` when a plain object/pool suffices (ch **13**).

---

## References

- [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TypeScript 5.0 — Decorators](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators)
- [TypeScript 5.2 — `using` Declarations and Explicit Resource Management](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
