# Error handling: unknown, never, and results

[← Back to TypeScript](./README.md)

## What this chapter covers

This is a **pillar** chapter: how production TypeScript code **fails safely**. You get a full spine for `unknown` in `catch`, narrowing thrown values, custom error classes, exhaustiveness with `never`, Result/`Ok`/`Err` patterns, assertion functions, sync vs boundary errors, and the culture that rejects `as any` and empty catches. Async rejection discipline overlaps chapter **12**; narrowing fundamentals live in **04**—here they become an error-handling system. Default: **TypeScript 5.9.x**, **`strict`: true**.

You leave able to design failure modes that CI can enforce and on-call can read.

---

## 1. Concepts

### 1. Types do not catch runtime failures

TypeScript erases. A well-typed function can still throw, reject, return a 500 payload, or receive garbage JSON. Error handling is therefore **two layers**:

1. **Static:** make illegal states hard to represent; force callers to handle unions; exhaust switches.
2. **Runtime:** validate boundaries; throw or return typed failures; never assume `catch` saw an `Error`.

Staff systems use both. Types alone are not input validation.

### 2. What “throw” means in TypeScript

Anything can be thrown in JavaScript: `Error`, string, number, plain object, `null`. TypeScript models that honestly when `useUnknownInCatchVariables` is on (default under modern `strict` configs):

```ts
try {
  doWork();
} catch (err) {
  // err: unknown
}
```

`unknown` is not inconvenience—it is the point. You must **narrow** before reading `.message` or logging structured fields.

### 3. Narrowing unknown in `catch`

Minimum safe pattern:

```ts
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

try {
  doWork();
} catch (err) {
  console.error("work failed", getErrorMessage(err));
  throw err; // rethrow if you cannot handle
}
```

Richer narrowing:

```ts
function isNodeErrno(err: unknown): err is NodeJS.ErrnoException {
  return (
    err instanceof Error &&
    "code" in err &&
    typeof (err as NodeJS.ErrnoException).code === "string"
  );
}
```

Prefer user-defined type guards (ch **04**) over casting. `instanceof Error` is necessary but not sufficient for domain errors—use custom classes or discriminants.

### 4. Custom error classes

Domain errors should be **named types** with stable `name`, optional `code`, and cause chaining:

```ts
class AppError extends Error {
  readonly code: string;
  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AppError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`);
    this.name = "NotFoundError";
  }
}
```

Why `Object.setPrototypeOf`: under some emit targets, subclassing `Error` breaks `instanceof` without prototype repair. Verify on your `target`; keep the habit in shared libraries.

`cause` (ES2022+) preserves the underlying failure when you wrap—critical for I/O and HTTP façades.

### 5. `never` and exhaustiveness

`never` means “this should not happen.” After narrowing a union fully, the remainder is `never`. Use that to make missed cases **fail to compile**:

```ts
type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r ** 2;
    case "square":
      return shape.s ** 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
```

When someone adds `{ kind: "triangle" }`, the default assignment errors. This is staff-grade union handling for status codes, job kinds, and permission outcomes.

Helper form:

```ts
function assertNever(x: never, message = "unexpected"): never {
  throw new Error(`${message}: ${JSON.stringify(x)}`);
}
```

`assertNever` returns `never` because it always throws—callers and control-flow both benefit.

### 6. Result / Ok / Err patterns

Throwing is not the only model. Many codebases return a **discriminated union** so failure is data:

```ts
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E = AppError> = Ok<T> | Err<E>;

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}
function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

function parsePort(raw: string): Result<number, AppError> {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    return err(new AppError("BAD_PORT", `invalid port: ${raw}`));
  }
  return ok(n);
}
```

Call site:

```ts
const result = parsePort(process.argv[2] ?? "");
if (!result.ok) {
  console.error(result.error.message);
  process.exitCode = 1;
} else {
  startServer(result.value);
}
```

| Style | Strength | Weakness |
|-------|----------|----------|
| `throw` / `try/catch` | Familiar; stack traces; good for true exceptions | Easy to forget; `unknown` in catch; control-flow jumps |
| `Result` | Explicit; forces handling; great for expected failures | Verbose; must not mix casually with throws |
| Callback `err` first | Legacy Node | Prefer promises + typed results in new TS |

Staff rule: **expected** failures (validation, not-found, conflict) often return `Result` or typed unions. **Unexpected** failures (bugs, invariant breaks) throw. Do not return `Result` for every line—fatigue creates `.value!` culture, which is `any` in a trench coat.

### 7. Assertion functions

Assertions tell the type checker that a condition is true after the call, or that a value has a type:

```ts
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new AppError("ASSERT", message);
}

function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new AppError("ASSERT", "expected string");
  }
}

function loadName(input: unknown): string {
  assertString(input);
  return input; // string
}
```

Use assertions at **boundaries** and invariants—not as a substitute for ordinary narrowing in business logic. Failed assertions are bugs or contract violations; log them as such.

### 8. Lab — refuse `catch (e: any)`

```ts
// Anti-pattern
try {
  JSON.parse("{");
} catch (e: any) {
  console.log(e.message); // compiles, lies about non-Errors
}

// Pillar pattern
try {
  JSON.parse("{");
} catch (e) {
  console.log(getErrorMessage(e));
}
```

**What just happened:** `any` disabled the guardrail the language gave you.

---

## 2. Advanced concepts

### 1. Sync errors vs boundary errors

| Kind | Examples | Handling |
|------|----------|----------|
| **Domain / expected** | invalid input, not found | `Result`, typed union HTTP mapping |
| **Infrastructure** | `ENOENT`, network reset | wrap with `cause`; retry policy or surface code |
| **Invariant / bug** | unreachable state | throw; assertNever; fail CI tests |
| **Boundary parse** | JSON body, env vars, CLI flags | validate → Result or throw `AppError` before domain |

Never let raw driver/protocol errors become your public API. Wrap at the adapter edge:

```ts
async function readConfig(path: string): Promise<Result<Config, AppError>> {
  try {
    const text = await fs.readFile(path, "utf8");
    return parseConfig(text);
  } catch (e) {
    return err(
      new AppError("CONFIG_READ", `failed reading ${path}`, { cause: e }),
    );
  }
}
```

### 2. Mapping errors at HTTP / RPC edges

Convert known errors to stable status codes; log unknown ones with correlation ids; do not leak stack traces to clients.

```ts
function toHttp(err: unknown): { status: number; body: { error: string } } {
  if (err instanceof NotFoundError) {
    return { status: 404, body: { error: err.message } };
  }
  if (err instanceof AppError) {
    return { status: 400, body: { error: err.message } };
  }
  console.error("unhandled", err);
  return { status: 500, body: { error: "internal error" } };
}
```

Exhaustiveness over a closed set of `AppError` subclasses (via `code` discriminant) scales better than endless `instanceof` chains—encode a `code` union and switch with `never`.

### 3. No `as any` culture

`as any` and `as unknown as T` appear when people are tired. Each occurrence is a **review event**:

| Escape | Prefer |
|--------|--------|
| `as any` | Fix the type; generics; overload; unknown + guard |
| `as T` after JSON.parse | Validate; return `Result<T>` |
| empty `catch {}` | Log + rethrow or handle explicitly |
| `catch (e: any)` | `unknown` + narrow |
| non-null `!` on fallible lookup | check + Result / throw |

Document rare escapes with a one-line why. Undocumented escapes fail review.

### 4. Narrowing JSON and config

```ts
function asRecord(value: unknown): Result<Record<string, unknown>, AppError> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return ok(value as Record<string, unknown>);
  }
  return err(new AppError("TYPE", "expected object"));
}

function parseConfig(text: string): Result<Config, AppError> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return err(new AppError("JSON", "invalid JSON", { cause: e }));
  }
  const rec = asRecord(raw);
  if (!rec.ok) return rec;
  const env = rec.value.env;
  if (env !== "dev" && env !== "prod") {
    return err(new AppError("CONFIG", "env must be dev|prod"));
  }
  return ok({ env });
}
```

The cast to `Record<string, unknown>` after a runtime check is a controlled narrowing step—not `as Config`. Claiming `Config` requires field checks.

### 5. Exhaustiveness beyond switches

Unions on return types force callers:

```ts
type Outcome =
  | { status: "ready"; port: number }
  | { status: "pending" }
  | { status: "failed"; reason: string };

function handle(o: Outcome): void {
  if (o.status === "ready") {
    listen(o.port);
    return;
  }
  if (o.status === "pending") {
    wait();
    return;
  }
  if (o.status === "failed") {
    console.error(o.reason);
    return;
  }
  assertNever(o);
}
```

Prefer discriminated unions (`status` / `kind` / `tag`) over optional fields that can combine illegally (`error` set while `ok: true`).

### 6. Assertion signatures vs type predicates

| Form | Meaning |
|------|---------|
| `value is T` | Predicate returns boolean; narrows when true |
| `asserts value is T` | Throws if false; narrows after call |
| `asserts condition` | Narrows by truthiness of condition |

Predicates compose in `if`. Assertions fail loud—use for “this must be true or we are broken.”

### 7. Aggregating multiple errors

Validation often finds many problems. Model that explicitly:

```ts
type ValidationError = { path: string; message: string };

function validateUser(raw: unknown): Result<User, ValidationError[]> {
  const errors: ValidationError[] = [];
  // push per field…
  if (errors.length) return err(errors);
  return ok(/* constructed User */);
}
```

Throwing on first error is fine for fail-fast CLI flags; collecting is better for forms and config lint.

### 8. Logging without lying

Log **codes**, messages, causes, and safe context. Do not log secrets from error payloads. Prefer structured logs:

```ts
function logError(err: unknown, ctx: Record<string, string>): void {
  if (err instanceof AppError) {
    console.error({ code: err.code, message: err.message, ...ctx });
    return;
  }
  console.error({ message: getErrorMessage(err), ...ctx });
}
```

### 9. Interop with libraries that throw strings

Some older libraries throw strings. Narrow:

```ts
if (typeof err === "string") { /* … */ }
```

Wrap at the boundary into `AppError` so the rest of the program stays consistent.

### 10. Testing error paths

Typed errors are useless if untested. Assert:

- `result.ok === false` and `code`
- `instanceof NotFoundError`
- exhaustiveness still compiles when unions grow (type tests / CI `tsc`)

Async: always test rejection paths and abort (ch **12**).

### 11. Fire-and-forget as an error-handling bug

```ts
// Anti-pattern
void doWork(); // rejects become unhandledRejection
```

Unhandled promise rejections are errors you chose not to see. Pillar habit: `await`, or attach `.catch`, or queue with an explicit supervisor. Detail in ch **12**.

### 12. `never` on functions that always throw

```ts
function fail(message: string): never {
  throw new AppError("FAIL", message);
}
```

Return type `never` improves control-flow analysis after `fail(...)`.

### 13. Brownfield migration path

1. Enable `useUnknownInCatchVariables` / full `strict`.
2. Replace `catch (e: any)` with helpers.
3. Introduce `AppError` + codes.
4. Convert hot validation paths to `Result`.
5. Add `assertNever` to switches on unions.
6. Ban empty catches via lint.

Do not rewrite the entire monorepo in one PR—migrate adapter edges first.

### 14. React error boundaries — door only

UI frameworks often catch **render** failures in an error boundary (or equivalent). That is a **React runtime** concern: it does not replace `unknown` in `catch`, Result types, or server adapter wrapping in this chapter.

| Layer | Owns failure |
|-------|----------------|
| Typed domain / Node services | This chapter (**11**) + async (**12**) |
| React tree render/commit errors | chapter **19** literacy → react.dev |

Do not invent an Error Boundary encyclopedia here. If a PR only “fixes” UI crashes with a boundary and leaves `catch (e: any)` in data loaders, it fails review.

### 15. Lab — Result + exhaustiveness together

```ts
type Cmd = "start" | "stop" | "status";

function run(cmd: Cmd): Result<string, AppError> {
  switch (cmd) {
    case "start":
      return ok("started");
    case "stop":
      return ok("stopped");
    case "status":
      return ok("ok");
    default:
      return assertNever(cmd);
  }
}
```

If `assertNever` returns `never`, the `return` is for types; runtime never continues. Alternatively throw inside `default` only.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Form/API validation as `Result`; map domain errors to UX messages; never `alert(String(err))` without narrowing |
| **Systems** | Adapter wrapping for DB/fs/HTTP; retry only idempotent ops; classify retryable vs fatal via `code` |
| **Security** | Do not reflect raw error strings to clients; scrub paths/secrets; fail closed on authz errors |
| **Operations** | Stable error codes in logs/metrics; `process.exitCode` on CLI; avoid swallowing shutdown errors |
| **Software engineering** | Shared `errors` package; lint rules against `any` in catch; type tests for union exhaustiveness |

Whole-engineering review narrative:

1. **Application:** illegal states unrepresentable via unions; expected failures as data.
2. **Systems:** infrastructure errors wrapped with cause; no leaky abstractions.
3. **Security:** unknown input → validate; error messages are a disclosure surface.
4. **Ops:** codes + metrics; unhandledRejection monitoring.
5. **SE:** consistent `AppError` vocabulary across packages.

### Worked mini-flow — CLI config load

1. Read file (I/O errors → wrap) — ch **14**.
2. `JSON.parse` in try/catch → `AppError` with cause.
3. Validate shape → `Result` with field errors.
4. On `Err`, print code/message, `exitCode = 1`.
5. On `Ok`, start runtime; unexpected throws bubble to top-level handler that logs and exits.

---

## Staff-level review checklist

- `catch` variables are `unknown` (or equivalent strict); no `any`.
- Shared `getErrorMessage` / guards exist; not copy-pasted casts.
- Domain errors are typed (`AppError` hierarchy or equivalent codes).
- `cause` preserved when wrapping.
- Expected failures use `Result` or discriminated unions where the team standard says so.
- Switches on unions use `never` / `assertNever`.
- Assertion functions reserved for invariants/boundaries.
- No empty `catch`; no silent fire-and-forget promises.
- JSON/env/CLI boundaries validate before claiming domain types.
- HTTP/RPC mapping does not leak internals on 500s.
- `as any` / double asserts documented or removed.
- Tests cover failure paths and codes.
- React/UI render failures routed to chapter **19** / react.dev—boundaries are not a substitute for typed `catch` / Results.
- `instanceof` on custom `Error` subclasses verified under the project `target`.
- Unhandled rejection hooks / CLI exit codes considered.

---

## References

- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) (`unknown`, `never`)
- [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript 4.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html) (`unknown` in catch history)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Error (MDN via Node alignment)](https://nodejs.org/docs/latest/api/errors.html)
- [Node.js Errors](https://nodejs.org/docs/latest/api/errors.html)
- [React — Documentation](https://react.dev/) *(error UI / boundaries live there; chapter **19** is the TS surface door)*
