# Runtime performance: what the machine actually pays for

[← Back to TypeScript](./README.md)

## What this chapter covers

Most tutorials teach **how to write** TypeScript: what `async` means in syntax, what a function signature looks like, how to type a Promise. Seniors get paid to answer a different question:

> **When this runs on a real machine, where does the time and money go—and how do we spend less?**

This chapter is that mental model, written for **beginners who should learn it early**—before habits calcify. You do not need to be a CPU architect. You need a clear picture of **work vs wait**, **hot paths**, and a few durable moves that make programs feel fast.

Types are erased. At runtime you are running **JavaScript** on **Node** (or a browser). TypeScript still helps: it makes safe early-exits and honest APIs easier to maintain. Compile speed (how long `tsc` takes) is chapter **15**. This chapter is the **machine clock**.

**Important:** this is not only about `async`. **Loops, arrays, objects, functions, classes**—every language concept has a runtime bill. Core chapters (**03–10**) plant a short “what this costs” note; **this chapter** gathers them so you can go deeper later.

Read this soon after chapter **12** (async). File I/O details are chapter **14**. Come back here whenever a handler “feels slow.”

---

## 1. Concepts

### 1. The two clocks (say which one you mean)

| Clock | Question | Example |
|-------|----------|---------|
| **Machine / runtime** | How long until the user / API / job finishes? | A request takes 800 ms |
| **Compile / CI** | How long until `tsc` is green? | Typecheck takes 4 minutes |

Fixing the wrong clock wastes weeks. This chapter = **machine**. Chapter **15** = **compile**.

### 2. What “slow” usually is (beginner truth)

On servers and tools, slowness is rarely “TypeScript.” It is almost always:

1. **Waiting** — disk, network, database, another API (I/O wait).
2. **Doing too much CPU work** — big loops, huge JSON parse, crypto, compression on the hot path.
3. **Doing the same expensive thing repeatedly** — no cache, refetching, rereading a file every request.
4. **Blocking the event loop** — sync I/O or heavy CPU so *everyone* waits.
5. **Unbounded concurrency** — 10,000 parallel calls that melt the dependency and your process.

Senior instinct: **measure which of the five it is** before rewriting syntax for “optimization theater.”

### 3. Work vs wait (the picture that pays)

Imagine one request:

```text
[CPU: validate input]  →  [WAIT: database]  →  [CPU: shape JSON]  →  [WAIT: write log]
     2 ms                    120 ms                3 ms                  15 ms
```

Total ≈ **140 ms**. Making the CPU parts twice as “clever” saves ~2.5 ms. Making the database faster (index, less data, cache) saves tens of milliseconds.

**Async does not make the database faster.** It lets the process **do other work while waiting**—so one Node process can handle many requests. That is why `async`/`await` exists for I/O. It is not a magic turbo button for math.

```ts
// Waiting — good candidate for async I/O
await db.query("SELECT …", { signal });

// Working — still burns CPU on the main thread
JSON.parse(hugeString);
for (let i = 0; i < 50_000_000; i++) { /* … */ }
```

### 4. The event loop in one paragraph

Node runs JavaScript on **one main thread** by default (simplifying). While your code runs CPU-heavy work, it cannot handle other events. While you `await` a network call, the engine can run other callbacks.

| Style | What the machine feels |
|-------|-------------------------|
| `await fetch(…)` / `await fs.promises.readFile(…)` | Main thread free during wait |
| `fs.readFileSync(…)` in a request handler | Main thread stuck; other requests queue |
| Huge `for` loop parsing megabytes | Main thread stuck; latency spikes for everyone |

**Staff rule:** sync filesystem and heavy CPU do not belong on the **hot path** of a server. CLIs at startup can be sync; production request handlers should not.

### 5. Hot path vs cold path

| Path | Meaning | Care level |
|------|---------|------------|
| **Hot** | Runs on every request / every tick / every row | Measure; optimize; keep boring and fast |
| **Cold** | Startup, rare admin, one-shot migration | Clarity beats micro-optimization |

Beginners optimize cold paths and ignore hot paths. Flip that.

```ts
// Hot path sketch — fail cheap, wait only for needed I/O, abort when client leaves
export async function handleGetUser(id: string, signal: AbortSignal): Promise<User> {
  if (!id) throw new ErrInvalid("id required"); // cheap CPU guard
  const user = await users.findById(id, { signal }); // wait
  if (!user) throw new ErrNotFound("user");
  return user; // cheap
}
```

### 6. What `async` actually costs (and buys)

**Buys:** structured waiting; composition with `Promise.all` / `allSettled`; cancellation via `AbortSignal` (ch **12**).

**Costs:**

- Each `async` function returns a **Promise** (allocations, microtasks).
- Unnecessary `async` on a pure sync function adds overhead for no wait.
- Unbounded `Promise.all` on huge lists can exhaust memory and sockets.

```ts
// Fine — there is real waiting
async function loadConfig(path: string): Promise<Config> {
  const text = await fs.promises.readFile(path, "utf8");
  return parseConfig(text);
}

// Pointless async — no await; prefer sync function
async function add(a: number, b: number): Promise<number> {
  return a + b;
}
```

### 7. The money moves (small list, big impact)

Learn these early; seniors repeat them for decades:

| Move | Why it pays |
|------|-------------|
| **Don’t wait for what you don’t need** | Parallelize independent I/O with `Promise.all` (bounded) |
| **Cancel abandoned work** | `AbortSignal` when the client disconnects |
| **Fail cheap before I/O** | Validate IDs/authz before hitting disk/DB |
| **Read/write less data** | Select columns; stream files; paginate |
| **Cache stable results** | Config, public keys, rarely changing rows |
| **Bound concurrency** | Pool of N workers, not “await everything at once” |
| **Keep CPU off the request thread** | Queues / workers for sharp CPU jobs |
| **Avoid sync I/O on hot paths** | Prefer `fs.promises` / streaming (ch **14**) |

TypeScript’s job here: types that make these APIs **hard to misuse** (required `signal`, branded IDs, Result types)—not “faster math.”

### 8. Latency vs throughput (two definitions of fast)

| Goal | Means | Example |
|------|-------|---------|
| **Low latency** | One request finishes quickly | p99 under 200 ms |
| **High throughput** | Many requests per second | 5k RPS on one box |

Sometimes they trade off (batching helps throughput, hurts latency). Name the goal in the ticket.

### 9. A beginner lab — feel wait vs work

```ts
import { performance } from "node:perf_hooks";

function busy(ms: number): void {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* spin — burns CPU */
  }
}

async function wait(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  let t0 = performance.now();
  busy(50);
  console.log("busy 50ms →", (performance.now() - t0).toFixed(1));

  t0 = performance.now();
  await wait(50);
  console.log("wait 50ms →", (performance.now() - t0).toFixed(1));
}

main();
```

Both “take ~50 ms” on the wall clock. Only **busy** blocks the event loop for that whole time. That distinction is the beginning of senior taste.

### 10. Language constructs also have a bill (not only async)

Core chapters plant a one-paragraph seed. Here is the **map**—every row is “basics now, deepen when you measure.”

| Construct (basics home) | What the machine pays | Beginner habit |
|-------------------------|----------------------|----------------|
| **`for` / `while`** (**03**, **05**) | CPU per iteration | Keep bodies tiny on hot paths; exit early |
| **`array.map` / `filter` / `reduce`** (**03**) | New array (or value) + per-element call | Fine for clarity; on huge hot data, one loop may win—**measure** |
| **Indexing `arr[i]`** | Cheap | Prefer over copying the whole array “just in case” |
| **Object literal `{…}`** (**06**) | Allocate | Don’t rebuild fat objects every request if a field tweak suffices |
| **`{...spread}` / `Object.assign`** (**06**) | Shallow copy allocate | Cost scales with key count |
| **Deep clone** | Often expensive | Rarely needed on hot paths |
| **String concat in a loop** | Can allocate heavily | Prefer `join` / builders for big results |
| **`JSON.parse` / `stringify`** | CPU + alloc proportional to size | Parse less; don’t re-parse the same blob |
| **Closures in hot loops** (**05**) | Function objects | Create outer functions once; reuse |
| **`async` function** (**12**) | Promise / microtask | Only when you await real wait |
| **`await` in a loop** | Sequential waits | Parallelize independent work with a **bound** pool |
| **Classes `new`** (**09**) | Instance alloc | Don’t `new` per tiny iteration if a plain value works |
| **Generics `<T>`** (**08**) | **Zero** at runtime (erased) | Types don’t speed Node; bad types slow **tsc** (ch **15**) |
| **Narrowing / type guards** (**04**) | Whatever JS you wrote | Put cheap checks first |
| **Modules `import`** (**10**) | Load/parse at startup | Heavy imports belong at process start, not per request |
| **`Map` / `Set`** | Good for frequent key ops | Prefer over “object as map” when keys are dynamic and hot |
| **Regex** | Can be costly if naive / catastrophic | Compile once; bound input size |
| **Sync I/O** (**14**) | Blocks event loop | Forbidden on server hot paths without a waiver |

**Rule of thumb:** if you cannot point at **work**, **wait**, or **allocation**, you are not optimizing yet—you are rearranging syntax.

```ts
// Clear — often fine
const names = users.map((u) => u.name);

// Hot path with millions of rows — one pass (when profiling says map-chain hurts)
const names2: string[] = [];
for (const u of users) names2.push(u.name);
```

Clarity wins until measurement says otherwise. Seniors still write `map` every day—they just know when not to.

---

## 2. Advanced concepts

### 1. How to see where time went (measure before opinions)

| Tool | Use |
|------|-----|
| `performance.now()` / `console.time` | Quick spans around suspects |
| Node `--cpu-prof` / clinic / 0x | CPU profiles when CPU-bound |
| Logging with durations | I/O stages (db, http, disk) |
| APM (Datadog, etc.) | Production p50/p99 |

Without numbers, “optimization” is storytelling.

```ts
async function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const t0 = performance.now();
  try {
    return await fn();
  } finally {
    console.log(`${name} ${(performance.now() - t0).toFixed(1)}ms`);
  }
}
```

### 2. Allocations and GC (enough to be dangerous)

Creating millions of short-lived objects (huge intermediate arrays, string concat in tight loops) increases **garbage collection** pauses. Beginner-safe habits:

- Prefer transforming streams / single-pass loops over “map → filter → map → …” on enormous arrays when profiling says so.
- Don’t clone giant objects “for safety” on every request.
- Reuse buffers carefully only when you understand lifetime (advanced); clarity first.

Do not premature-optimize tiny scripts. Do watch allocations on hot APIs.

### 3. N+1 and chatty I/O

```ts
// Slow pattern — N round trips
for (const id of ids) {
  await db.user(id);
}

// Faster pattern — one round trip when the API allows
await db.usersByIds(ids);
```

Async sugar does not fix N+1. Batching and joins do.

### 4. Parallel vs sequential waiting

```ts
// Sequential waits — sum of waits
const a = await fetchA({ signal });
const b = await fetchB({ signal });

// Parallel waits — max of waits (if independent)
const [a, b] = await Promise.all([fetchA({ signal }), fetchB({ signal })]);
```

Only parallelize when there are **no dependencies** and you **bound** fan-out (ch **12**).

### 5. Caching with honesty

Cache only what is:

- safe to reuse (not user-private unless keyed and TTL’d),
- cheaper to store than refetch,
- invalidated when truth changes.

TypeScript helps with explicit cache key types; it does not invent a cache for you.

### 6. When to leave the main thread

| Work | Prefer |
|------|--------|
| JSON parse of multi‑MB payloads on every request | Stream, smaller payloads, or worker |
| Image/video encode, large compression | Job queue / worker |
| Simple string checks, auth token parse | Main thread is fine |

Workers add complexity. Earn them with measurements.

### 7. “Faster TypeScript” myths

| Myth | Reality |
|------|---------|
| More types → faster runtime | Types erase; zero runtime speedup |
| `enum` is faster than unions | Often worse or irrelevant; prefer unions (ch **07**) |
| `any` is faster | Same runtime; worse safety |
| Async everything → faster | Extra Promises can be slower if nothing waits |

### 8. How this chapter connects to the pillars

| Pillar | Runtime angle |
|--------|----------------|
| **Errors (11)** | Fail cheap; don’t do I/O then throw on bad input |
| **Language basics (03–10)** | Loops, arrays, objects, functions, classes—each has a cost seed; this chapter is the map |
| **Async (12)** | Wait without blocking; abort; bound concurrency |
| **Files (14)** | Stream big files; async I/O on hot paths |
| **Builds (15)** | Separate clock—don’t confuse with runtime |

---

## 3. Applications and use cases

| Angle | What “machine performance” looks like |
|-------|----------------------------------------|
| **Application** | API p99, TTFB, UI jank from main-thread CPU |
| **Systems** | Event-loop lag, FD limits, connection pools |
| **Security** | Slowloris / huge payload DoS — timeouts and size limits are performance *and* safety |
| **Ops** | Cost per request on CPU/memory; autoscaling bills |
| **SE** | Design APIs that make the fast path the easy path |

**Story:** A junior rewrites a loop in “faster TypeScript style.” A senior adds an index, cuts the payload, and aborts stale requests. The bill drops. Learn both crafts—but learn **where the wait is** first.

### Suggested early learning path

1. Chapter **12** — what async *is*.
2. **This chapter** — what async *buys* on a machine.
3. chapters **13** / **15** — files/bytes without blocking the world.
4. chapter **16** — when CI/`tsc` is the pain, not the API.

---

## Staff-level review checklist

- Ticket names **runtime** vs **compile** clock.
- Hot path identified; cold path not over-optimized.
- Slowness attributed to wait / CPU / repeat / block / fan-out with evidence.
- No sync I/O on server hot paths without an explicit waiver.
- Independent I/O parallelized only with a concurrency bound.
- `AbortSignal` (or equivalent) on abandonable work.
- Validation/authz before expensive I/O.
- Payloads and result sets sized deliberately (no silent “select *”).
- N+1 queried and fixed when present.
- Types used to encode safe APIs—not as a substitute for measurement.
- Language-construct costs considered on hot paths (loops, allocs, sync I/O)—not only “add more async.”
- Core-chapter “Runtime cost” seeds are treated as review vocabulary, not optional trivia.

---

## References

- [Node.js — Performance APIs / `perf_hooks`](https://nodejs.org/docs/latest/api/perf_hooks.html)
- [Node.js — Diagnostics & profiling (guides hub)](https://nodejs.org/en/learn/diagnostics/)
- [Node.js — File system (`fs` / promises)](https://nodejs.org/docs/latest/api/fs.html)
- [TypeScript Handbook — intro (types erase to JS)](https://www.typescriptlang.org/docs/handbook/intro.html)
- [MDN — `Performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
- [MDN — Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
