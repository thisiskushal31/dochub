# Async, promises, abort, and concurrency

[← Back to TypeScript](./README.md)

## What this chapter covers

How TypeScript types **asynchronous work**: `Promise<T>`, `async`/`await`, rejection typing realities, `AbortSignal` cancellation, concurrency patterns (`Promise.all` / `allSettled` / `race`), and fire-and-forget anti-patterns. Error-handling depth stays anchored in chapter **11**; streams and file I/O continue in **13**. Default: **TypeScript 5.9.x**, **`strict`: true**.

You leave able to type async APIs honestly, cancel in-flight work, and keep rejections from becoming silent production incidents.

---

## 1. Concepts

### 1. Promises are values about the future

A `Promise<T>` is a placeholder for a `T` that may already be done or will finish later. It **fulfills** with a value or **rejects** with a reason (again: anything, often `Error`).

```ts
function loadName(): Promise<string> {
  return Promise.resolve("ada");
}

async function main(): Promise<void> {
  const name = await loadName();
  console.log(name);
}
```

`async` functions always return promises. Returning `T` wraps as `Promise<T>`; throwing rejects.

### 2. Typing promises

| Annotation | Meaning |
|------------|---------|
| `Promise<string>` | fulfills with string |
| `Promise<void>` | fulfills with no useful value |
| `Promise<Result<T, E>>` | fulfills with a Result (errors as data) |
| `Promise<T \| undefined>` | may fulfill empty—document why |

TypeScript does **not** give you `Promise<T, EReject>` as a built-in dual type parameter. Rejections are effectively `unknown` at the type level. Model expected failures as fulfilled `Result` values (ch **11**) when you need typed failure channels; use reject for unexpected / abort / infrastructure breaks.

### 3. `await` and control flow

```ts
async function run(): Promise<number> {
  try {
    const text = await readFile("x.txt", "utf8");
    return text.length;
  } catch (err) {
    console.error(getErrorMessage(err));
    throw err;
  }
}
```

`await` on a rejected promise throws into the async function’s sync-style `try/catch`. Narrow `unknown` the same as sync (ch **11**).

### 4. Creating promises

Prefer existing async APIs. When wrapping callbacks:

```ts
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new Error("aborted"));
      return;
    }
    const id = setTimeout(() => resolve(), ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(signal.reason ?? new Error("aborted"));
      },
      { once: true },
    );
  });
}
```

Always handle both success and failure paths in the executor—uncaught executor throws reject the promise.

### 5. Combinators you actually use

```ts
const [a, b] = await Promise.all([loadA(), loadB()]);
const settled = await Promise.allSettled([loadA(), loadB()]);
const first = await Promise.race([loadA(), timeout(500)]);
```

| Helper | Behavior |
|--------|----------|
| `all` | fail-fast on first rejection; results typed as tuple when inputs are |
| `allSettled` | wait for all; inspect `status` per item |
| `race` | first settle wins (fulfill or reject) |
| `any` | first fulfill wins; rejects only if all reject |

Type `allSettled` results as discriminants and exhaust them (ch **11**).

### 6. AbortSignal as the cancellation bus

Cancellation is cooperative. Pass `AbortSignal` down; check `aborted`; listen for `abort`.

```ts
async function fetchText(
  url: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

const ac = new AbortController();
const p = fetchText("https://example.com", ac.signal);
ac.abort(); // in-flight fetch should reject
```

Node `fs` operations and many libraries accept `signal` in options—prefer those over orphan work (ch **13**).

### 7. Lab — typed `allSettled`

```ts
const results = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("x"))]);

for (const r of results) {
  if (r.status === "fulfilled") {
    console.log(r.value);
  } else {
    console.error(getErrorMessage(r.reason));
  }
}
```

**What just happened:** failures became data; one rejection did not skip the sibling outcome.

---

## 2. Advanced concepts

### 1. Rejection typing is a lie you manage

```ts
async function mightFail(): Promise<number> {
  if (Math.random() < 0.5) throw new Error("nope");
  return 1;
}
```

The return type does not mention `Error`. Callers must assume rejection unless the API documents “never rejects” and enforces it (and even then, bugs exist). Public async APIs should document:

- what they fulfill with
- what they reject with (Error subclasses / abort)
- whether cancellation is supported

### 2. Fire-and-forget anti-patterns

```ts
// Bad: floating promise
doWork();

// Still bad if doWork rejects
void doWork();

// Better: explicit handling
void doWork().catch((err) => {
  console.error("background work failed", getErrorMessage(err));
});

// Best when you can: await in the owner’s lifetime
await doWork();
```

Floating promises are a leading cause of flaky CLIs and servers that “hang” or crash on `unhandledRejection`. Enable lint rules that flag unhandled promises (`@typescript-eslint/no-floating-promises` literacy) in staff repos.

### 3. Top-level await and entrypoints

ESM allows top-level `await`. Entrypoints should still wrap fatally:

```ts
async function main(): Promise<void> {
  await boot();
}

main().catch((err) => {
  console.error(getErrorMessage(err));
  process.exitCode = 1;
});
```

### 4. Concurrency limits

`Promise.all` on 10k items can exhaust sockets/memory. Pattern: batch or use a simple pool.

```ts
async function mapPool<T, U>(
  items: T[],
  concurrency: number,
  fn: (item: T, signal: AbortSignal) => Promise<U>,
  signal?: AbortSignal,
): Promise<U[]> {
  const results: U[] = new Array(items.length);
  let i = 0;
  async function worker(): Promise<void> {
    while (i < items.length) {
      if (signal?.aborted) throw signal.reason ?? new Error("aborted");
      const idx = i++;
      results[idx] = await fn(items[idx]!, signal ?? new AbortController().signal);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
```

Keep pools boring; reach for a maintained library when semantics grow (timeouts, priorities)—still type your façade.

### 5. `Promise.race` for timeouts

```ts
function timeout(ms: number, signal?: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(signal.reason ?? new Error("aborted"));
    }, { once: true });
  });
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, timeout(ms)]);
}
```

Racing a timeout does **not** cancel the underlying work unless you also abort a shared `AbortSignal`. Always couple timeout + abort for I/O.

### 6. Iterators, generators, and async iterables (literacy)

Official handbook coverage of **iterators and generators** maps cleanly onto TypeScript’s structural protocols:

| Protocol | Type shape | Everyday use |
|----------|------------|--------------|
| Sync iterable | `Iterable<T>` / `Iterator<T>` | `for…of`, spread, many collections |
| Sync generator | `Generator` / `function*` | Lazy sequences; `yield` / `yield*` |
| Async iterable | `AsyncIterable<T>` | `for await…of`, Node readable streams |
| Async generator | `AsyncGenerator` / `async function*` | Pull-based chunked I/O |

```ts
async function* lines(chunks: AsyncIterable<string>): AsyncGenerator<string> {
  for await (const chunk of chunks) {
    yield chunk; // real code would split on newlines
  }
}

for await (const line of lines(source)) {
  // …
}
```

Staff habits:

- Prefer **`for await`** over buffering entire files when size is unknown (ch **14**).
- Type the **yielded** element honestly; do not widen to `any`.
- Generators are still single-threaded cooperative code—CPU-heavy `yield` loops can block the event loop (ch **13**).

### 7. Microtasks vs next tick (mental model)

Promise reactions run as microtasks. Mixing heavy sync work after `await` still blocks the event loop—async is not parallelism. For CPU-bound work, use workers; do not expect `await` to magically parallelize JS.

### 8. Typing `fetch` and Response

```ts
async function getJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<unknown>;
}
```

Treat JSON as `unknown` and validate (ch **11**). Do not `as User` on `res.json()`.

### 9. Brownfield: callback APIs

Wrap `fs.callback` style with `fs/promises` or `util.promisify` once at the edge. Do not promisify ad hoc in every call site.

### 10. Lab — abort + timeout together

```ts
async function load(url: string, ms: number): Promise<string> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(new Error("timeout")), ms);
  try {
    return await fetchText(url, ac.signal);
  } finally {
    clearTimeout(timer);
  }
}
```

**What just happened:** timeout aborts the fetch; work is cooperative, not merely raced.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | UI loaders await; cancel on navigation via AbortController; show typed error states |
| **Systems** | Bounded `mapPool` for fan-out; circuit breakers return Result; propagate signals through clients |
| **Security** | Timeouts on outbound calls; abort hung TLS peers; do not log auth headers on reject |
| **Operations** | Graceful shutdown: abort controllers + await drain; track `unhandledRejection` |
| **Software engineering** | Lint floating promises; document reject contracts; prefer `allSettled` for “best effort” batches |

Shutdown sketch:

1. Receive SIGTERM.
2. `ac.abort()`.
3. Stop accepting work.
4. `await` in-flight with a hard timeout.
5. Exit with code based on drain success.

---

## Staff-level review checklist

- Async functions declare honest `Promise<…>` fulfill types.
- Expected failures documented as `Result` or typed unions when required by team standard.
- `catch` on async uses `unknown` narrowing (ch **11**).
- No floating promises; lint enabled where possible.
- `AbortSignal` plumbed through I/O and fetch façades.
- Timeouts abort work—not only `Promise.race` without cancel.
- `Promise.all` vs `allSettled` chosen deliberately.
- Concurrency bounded for bulk operations.
- JSON from network treated as `unknown` until validated.
- Process entrypoints handle rejection and set exit codes.
- Graceful shutdown awaits or aborts in-flight tasks.
- Chunked I/O uses `AsyncIterable` / `for await` (or generators) with honest element types—not “buffer everything then `any`.”
- After this chapter, readers are pointed at **13** (what waiting/work costs on the machine)—not only more syntax.

---

## Next

Chapter **13** is the senior “money” chapter in beginner language: **work vs wait**, event-loop blocking, hot paths, and what `async` actually buys. Read it before optimizing for style alone.

---

## References

- [Handlers and Async Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Iterators and Generators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Node.js Promises](https://nodejs.org/docs/latest/api/globals.html#promise)
- [AbortController](https://nodejs.org/docs/latest/api/globals.html#class-abortcontroller)
- [fetch (Node)](https://nodejs.org/docs/latest/api/globals.html#fetch)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
