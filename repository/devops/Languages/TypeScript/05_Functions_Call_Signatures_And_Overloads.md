# Functions, call signatures, and overloads

[← Back to TypeScript](./README.md)

## What this chapter covers

Functions are where TypeScript earns its keep day to day: **parameters, returns, callbacks, and call-site checking**. By the end you should be able to:

1. Annotate parameters and return types under **`strict`**.
2. Read **function type expressions** and **call signatures**.
3. Use **optional**, **default**, and **rest** parameters correctly.
4. Understand **`void`**, **`never`**, and function compatibility gotchas.
5. Write **overloads** when needed—and know when a union parameter is clearer.

Generics on functions arrive hard in chapter **08**; this chapter is the non-generic core.

Handbook default: **TS 5.9.x**, **`strict`: true**.

---

## 1. Concepts

### 1. Functions as checked contracts

A function type answers: what may be passed in, what comes out, and (for methods) how `this` behaves. Under `strict`, implicit `any` parameters are errors—annotate or use a context that infers them.

```ts
function add(a: number, b: number): number {
  return a + b;
}

const add2 = (a: number, b: number): number => a + b;
```

### 2. Optional, default, and rest

```ts
function connect(host: string, port?: number): string {
  return `${host}:${port ?? 443}`;
}

function log(msg: string, level: "info" | "warn" = "info"): void {
  console.log(level, msg);
}

function sum(...ns: number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}
```

Optional (`?`) and defaulted parameters are related but not identical: defaults provide a runtime value; `?` allows `undefined` at the call site.

### 3. Function type expressions

```ts
type Mapper = (n: number) => string;

const stringify: Mapper = (n) => String(n);
```

Use aliases when the same signature appears in multiple APIs (callbacks, middleware, handlers).

### 4. Call signatures in object types

```ts
type Formatter = {
  (input: string): string;
  locale: string;
};

function run(fmt: Formatter): string {
  return fmt("hello");
}
```

Callable objects are rarer in app code, common in older JS APIs and some library typings.

### 5. `void` vs `undefined` vs `never`

| Return type | Meaning |
|-------------|---------|
| **`void`** | Caller must ignore the return; function may still return `undefined` |
| **`undefined`** | Explicitly returns `undefined` |
| **`never`** | Does not complete normally (throw or infinite loop) |

```ts
function fail(msg: string): never {
  throw new Error(msg);
}

function notify(cb: () => void): void {
  cb();
}
```

Returning a value from a `() => void` callback is often allowed (for ergonomics with `.forEach`)—do not confuse that with “`void` means the function returns nothing useful to the *caller of notify*.”

### 6. Contextual typing

```ts
const nums = [1, 2, 3];
nums.map((n) => n * 2); // n inferred as number
```

Callbacks passed to typed APIs often need **no** annotations. Over-annotating callbacks can *widen* or fight inference—prefer context when it is clear.

### 7. Overloads (when one name, several call shapes)

```ts
function read(path: string): string;
function read(path: string, encoding: "utf8"): string;
function read(path: string, encoding: "binary"): Uint8Array;
function read(path: string, encoding?: "utf8" | "binary"): string | Uint8Array {
  if (encoding === "binary") return new Uint8Array();
  return "";
}
```

The **implementation** signature is not part of the public overload set; it must be compatible with all overloads. Prefer a single signature with unions/generics when overloads only add noise.

### 8. Small lab

```ts
type Handler = (event: { type: string; payload: unknown }) => void;

function on(event: string, handler: Handler): void {
  // register...
  void event;
  void handler;
}

on("deploy", (e) => {
  if (e.type === "deploy") {
    // narrow payload in real code (ch 04)
  }
});
```

### Runtime cost (learn early)

Call overhead is usually **tiny**. Cost is **what the function does** (CPU, I/O, allocations)—not the fact that you named it. Habits:

- Avoid creating **closures** or allocating fresh objects/arrays **inside hot loops** when a reused helper would do.
- Do not mark pure sync work `async` needlessly—every `async` function returns a Promise (ch **12** / **13**).

```ts
// Hot loop: prefer one shared helper over a new closure each iteration
for (const row of rows) {
  process(row); // not: rows.forEach((row) => { const tmp = { ...row }; … })
}
```

Deepen in chapter **13**.

---

## 2. Advanced concepts

### 1. Parameter bivariance history (literacy)

Method parameters in some positions historically behaved differently than standalone function types. Under modern `strictFunctionTypes`, **function** types check parameters **contravariantly** (safer for callbacks). When porting old code, “it typechecked on 3.x” is not an argument.

### 2. Optional parameters vs `undefined` in the type

`f(x?: number)` allows omitting the argument. `f(x: number | undefined)` usually **requires** passing an argument that may be `undefined`. Match the call-site ergonomics you want.

### 3. Rest args and tuples

Rest parameters can be typed as **tuple types** for fixed arities (`(...args: [string, number])`). Useful for typed `apply`-style wrappers.

### 4. `this` parameters

```ts
function greeter(this: { name: string }, salute: string): string {
  return `${salute}, ${this.name}`;
}
```

The `this` parameter is **erased** and only checked when the function is called as a method / via `call`. Chapter **09** deepens class/`this` rules.

### 5. Overload pitfalls

| Smell | Prefer |
|-------|--------|
| Many overloads that return `any` | Real return unions + narrowing |
| Overloads that disagree with implementation | Fix implementation signature |
| Overloads for optional args only | Optional params / defaults |

### 6. Declaring functions vs expressions

`function` declarations are hoisted; `const f = () =>` are not. Types work with both; style guides usually pick one for top-level exports. For interfaces of modules, **exported function declarations** read cleanly in `.d.ts`.

### 7. `Function` type

The global `Function` type is nearly `any` for calls. Prefer explicit signatures. Ban `Function` in new code reviews.

### 8. Async function return types

```ts
async function load(id: string): Promise<string> {
  return id;
}
```

`async` functions always return a **`Promise`**. Annotating `Promise<T>` on public async APIs prevents accidental `Promise<any>` from leaking. Rejection typing is a **runtime** concern—chapter **12** deepens abort and rejection discipline; here, at least don’t pretend async returns bare `T` at the type level.

### 9. Destructured parameters

```ts
function boot({ port, host = "127.0.0.1" }: { port: number; host?: string }): string {
  return `${host}:${port}`;
}
```

Annotate the **pattern’s type**, not each binding separately. Optional fields in the bag should match whether callers may omit keys.

### 10. When “one function” should become two

If overloads or a wide union make the implementation a maze of runtime branches, split into named functions (`readText` / `readBytes`). Types should clarify call sites—not excuse a single kitchen-sink routine.

---

## 3. Applications and use cases

| Angle | Functions in practice |
|-------|------------------------|
| **Application** | Route handlers, React event handlers (typed), service methods. |
| **Systems** | Lifecycle hooks with `void`/`Promise<void>`; typed worker message handlers. |
| **Security** | Callbacks that receive secrets must have **narrow** parameter types—not `Function`. |
| **Ops** | CLI command functions with rest/`options` objects instead of positional soup. |
| **SE** | Stable exported signatures; overload sets documented by tests that must typecheck. |

**Whole-engineering picture:** the function boundary *is* the API. Strict parameters and honest returns are cheaper than runtime archaeology.

---

## Staff-level review checklist

- No implicit `any` parameters on exported functions.
- Return types on public APIs are explicit when inference would hide `Promise` / union complexity.
- `void` / `never` / `undefined` used with intent—not interchangeably.
- Overloads exist only when call-site clarity truly needs them.
- Callbacks prefer contextual typing; avoid needless annotations that widen.
- No `Function` type in new code.
- Optional vs `| undefined` matches documented call ergonomics.
- `this`-typing used where unbound functions are passed around.
- Hot paths avoid needless `async` and per-iteration closure/alloc churn (ch **13**).

---

## References

- [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Everyday Types — functions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions)
- [Function overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
- [Call signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures)
- [TSConfig `strictFunctionTypes`](https://www.typescriptlang.org/tsconfig#strictFunctionTypes)
