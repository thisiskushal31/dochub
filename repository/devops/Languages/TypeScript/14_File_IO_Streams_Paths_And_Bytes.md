# File I/O: streams, paths, and bytes

[← Back to TypeScript](./README.md)

## What this chapter covers

This is a **pillar** chapter: how typed Node programs **read and write files safely**. You get literacy for `fs/promises`, `path`, atomic replace patterns, streams, encodings, `Uint8Array` / `Buffer` (including TypeScript **5.9** `ArrayBuffer` tightness notes), and error handling on I/O boundaries. Async discipline from **12**, **runtime cost** from **13**, and error models from **11** apply directly. Default: **TypeScript 5.9.x**, **`strict`: true**, `@types/node` matched to your Node line.

You leave able to write tooling that does not corrupt files on crash mid-write and that types bytes without `as any`.

---

## 1. Concepts

### 1. Files are bytes; strings are decoded views

On disk, files are sequences of bytes. Strings in JS/TS are Unicode code-unit sequences. Crossing the boundary requires an **encoding** (usually UTF-8) or staying in bytes (`Buffer` / `Uint8Array`).

| API shape | You get |
|-----------|---------|
| `readFile(path, "utf8")` | `string` |
| `readFile(path)` | `Buffer` |
| `writeFile(path, string)` | encodes as UTF-8 by default |
| `writeFile(path, Uint8Array)` | raw bytes |

Pick explicitly. “Looks fine on my machine” mojibake is an encoding bug.

### 2. Prefer `fs/promises` for request-shaped work

```ts
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

async function loadJson(filePath: string): Promise<unknown> {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text) as unknown;
}
```

Sync APIs (`readFileSync`) block the event loop—acceptable in small CLIs at startup, harmful in servers on hot paths (ch **13**). Prefer async in services.

Use the **`node:`** protocol for built-ins under ESM.

### 3. Paths are not strings you invent casually

```ts
import path from "node:path";

const root = path.resolve("data");
const file = path.join(root, "users", "ada.json");
```

| Helper | Job |
|--------|-----|
| `join` | concatenate segments for the OS |
| `resolve` | absolute path from CWD / segments |
| `normalize` | collapse `.` / `..` |
| `dirname` / `basename` / `extname` | split parts |
| `relative` | path from A to B |
| `sep` | OS separator |

Security rule: never `join(userRoot, userSupplied)` without ensuring the result **stays under** `userRoot` (path traversal). Resolve and check prefix carefully (including trailing separator edge cases).

```ts
function assertInside(root: string, candidate: string): string {
  const resolvedRoot = path.resolve(root) + path.sep;
  const resolved = path.resolve(root, candidate);
  if (!resolved.startsWith(resolvedRoot) && resolved !== path.resolve(root)) {
    throw new Error("path escapes root");
  }
  return resolved;
}
```

### 4. Reading and writing text

```ts
const text = await readFile(file, { encoding: "utf8", signal });
await writeFile(file, text, { encoding: "utf8", signal });
```

Pass `AbortSignal` when the operation should cancel (ch **12**). Check `signal` support on your Node version for each API.

### 5. Creating directories

```ts
await mkdir(path.dirname(file), { recursive: true });
```

`recursive: true` is the usual tool/scripts habit. Handle `EEXIST` races if another process creates the same directory—often safe to ignore when `recursive` already succeeds.

### 6. Streams — when not to buffer everything

`readFile` loads the whole file into memory. For large artifacts, logs, or pipes, use streams:

```ts
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream(src),
  createWriteStream(dest),
);
```

`pipeline` forwards errors and cleans up. Prefer it over manual `.pipe` without error handlers.

Async iteration:

```ts
import { createReadStream } from "node:fs";

async function countLines(file: string): Promise<number> {
  let n = 0;
  const stream = createReadStream(file, { encoding: "utf8" });
  for await (const chunk of stream) {
    n += (chunk as string).split("\n").length - 1;
  }
  return n;
}
```

Chunk boundaries split mid-line—real line readers buffer remainders. Staff tools use a maintained line reader when correctness matters.

### 7. Lab — read, validate, write

```ts
import { readFile, writeFile } from "node:fs/promises";

async function bump(file: string): Promise<void> {
  const raw: unknown = JSON.parse(await readFile(file, "utf8"));
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("expected object");
  }
  const rec = raw as Record<string, unknown>;
  const count = typeof rec.count === "number" ? rec.count : 0;
  await writeFile(file, JSON.stringify({ ...rec, count: count + 1 }, null, 2), "utf8");
}
```

**What just happened:** bytes → string → `unknown` → narrow → write. No `as Config` shortcut.

---

## 2. Advanced concepts

### 1. Atomic replace literacy

A crash mid-`writeFile` can leave a half-written config. The usual pattern:

1. Write to a temp file on the **same filesystem** (`file.tmp` / random name in same dir).
2. `fsync` if durability matters (via file handle).
3. `rename` over the destination (atomic on same volume on POSIX).

```ts
import { writeFile, rename, open } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

async function writeFileAtomic(file: string, data: string | Uint8Array): Promise<void> {
  const dir = path.dirname(file);
  const tmp = path.join(dir, `.${path.basename(file)}.${randomBytes(8).toString("hex")}.tmp`);
  await writeFile(tmp, data);
  const fh = await open(tmp, "r+");
  try {
    await fh.sync();
  } finally {
    await fh.close();
  }
  await rename(tmp, file);
}
```

On Windows, replace semantics can differ (existing destination). Test on the OS you ship; some tools unlink first or use platform helpers. Same-volume rename remains the core idea.

Never write configs in place for critical state if a crash mid-write is unacceptable.

### 2. Partial reads and file handles

```ts
import { open } from "node:fs/promises";

async function readPrefix(file: string, len: number): Promise<Buffer> {
  const fh = await open(file, "r");
  try {
    const buf = Buffer.alloc(len);
    const { bytesRead } = await fh.read(buf, 0, len, 0);
    return buf.subarray(0, bytesRead);
  } finally {
    await fh.close();
  }
}
```

Always close handles in `finally`. Leaked FDs take down long-running processes.

### 3. Encoding pitfalls

| Topic | Habit |
|-------|-------|
| UTF-8 | Default for text configs and source |
| BOM | Strip or reject; do not assume editors agree |
| Binary | Keep `Buffer`/`Uint8Array`; do not decode as utf8 |
| Newlines | `\n` vs `\r\n`—normalize when comparing text |
| `latin1` / `ascii` | Only when a protocol truly requires them |

`Buffer.toString("utf8")` replaces invalid sequences—do not treat that as validation of “well-formed UTF-8” for security-sensitive parsers.

### 4. `Buffer`, `Uint8Array`, and TypeScript 5.9 ArrayBuffer notes

Historically, `Buffer` extended `Uint8Array`. Typing of **`ArrayBuffer` vs `SharedArrayBuffer` vs typed array buffers** has tightened across recent TypeScript releases—including **5.9**—so some code that passed `Buffer` where a pure `ArrayBuffer` was expected (or the reverse) may need explicit conversion.

Practical habits under 5.9.x:

```ts
function asUint8Array(data: Buffer): Uint8Array {
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

function fromUint8(data: Uint8Array): Buffer {
  return Buffer.from(data);
}
```

Prefer **`Uint8Array`** in shared libraries that might run outside Node; use `Buffer` when you need Node-specific APIs (`buffer.subarray`, pooling literacy). When `tsc` errors on buffer assignability after upgrading to 5.9.x, fix with explicit copies/views—not `as any`.

Read the 5.9 release notes for the exact ArrayBuffer-related changes on your pin; treat buffer boundaries as a **typing + runtime** concern.

### 5. Errors on I/O — codes you must recognize

Node I/O rejects / throws with `NodeJS.ErrnoException`-shaped errors:

| Code | Typical meaning |
|------|-----------------|
| `ENOENT` | missing path |
| `EACCES` / `EPERM` | permissions |
| `EEXIST` | already exists |
| `ENOTDIR` / `EISDIR` | type mismatch |
| `EMFILE` / `ENFILE` | too many open files |
| `EAGAIN` / `EBUSY` | retry / locked |

```ts
import { readFile } from "node:fs/promises";

async function readOptional(file: string): Promise<string | undefined> {
  try {
    return await readFile(file, "utf8");
  } catch (err) {
    if (isErrno(err) && err.code === "ENOENT") return undefined;
    throw err;
  }
}

function isErrno(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && typeof (err as NodeJS.ErrnoException).code === "string";
}
```

Wrap into `AppError` with `cause` at module boundaries (ch **11**). Do not empty-catch `EACCES`.

### 6. Directory walks

```ts
import { readdir } from "node:fs/promises";

async function listJs(dir: string): Promise<string[]> {
  const ents = await readdir(dir, { withFileTypes: true });
  return ents.filter((e) => e.isFile() && e.name.endsWith(".js")).map((e) => e.name);
}
```

For recursive trees, either implement careful recursion with path caps or use `fs.promises.glob` / recursive `readdir` features available on your Node line—pin and verify. Bound depth when walking untrusted trees.

### 7. Copying and moving

`fs.promises.copyFile`, `rename`, `cp` (recursive) exist—read options for `errorOnExist`, `force`, dereference symlinks. Symlinks are a security footgun in installers: decide follow-or-not explicitly.

### 8. Temporary files and cleanup

Use `os.tmpdir()` with unique names, or a maintained temp library. Clean up in `finally`. Do not write secrets to world-readable temp without restricted modes (`0o600` where appropriate).

```ts
import { writeFile, unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

async function withTemp(data: string, fn: (p: string) => Promise<void>): Promise<void> {
  const p = path.join(os.tmpdir(), `job-${process.pid}-${Date.now()}.txt`);
  await writeFile(p, data, { encoding: "utf8", mode: 0o600 });
  try {
    await fn(p);
  } finally {
    await unlink(p).catch(() => undefined);
  }
}
```

### 9. Streams backpressure literacy

Writing faster than the sink can accept requires respecting backpressure (`write` return value / `drain`). `pipeline` handles much of this. Custom `Transform` streams should follow Node stream contracts—do not ignore `drain` in hot paths.

### 10. Watching files

`fs.watch` / `fs.watchFile` differ by platform and can duplicate events. For tools, debounce and treat watches as hints to re-read, not as a transactional log. Prefer polling with backoff when NFS/odd hosts misbehave.

### 11. Permissions and umask

`mode` on write/mkdir interacts with process `umask`. Deployed services should set intentional modes for secrets and sockets. Review in security chapter **20** as well.

### 12. Working with stdin/stdout

CLIs often stream:

```ts
import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";

await pipeline(createReadStream(file), process.stdout);
```

TypeScript types for `process.stdout` are Node streams—handle `EPIPE` when piped to `head`.

### 13. Brownfield: sync I/O in servers

Finding `readFileSync` in a request handler is a performance and reliability bug (ch **13**). Migrate to async; if a library forces sync, isolate it at startup or in a worker.

### 14. Lab — safe write under a root

```ts
async function writeUserFile(root: string, rel: string, body: string): Promise<void> {
  const target = assertInside(root, rel);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFileAtomic(target, body);
}
```

**What just happened:** traversal guard + atomic replace—the minimum bar for user-influenced paths.

### 15. Append-only and log files

```ts
import { appendFile } from "node:fs/promises";

await appendFile(logPath, `${new Date().toISOString()} ${line}\n`, "utf8");
```

Append is convenient but not a substitute for a real logging pipeline (rotation, multi-process locking). For high-volume services, prefer a logging library or write to stdout and let the process manager collect. Concurrent appends from many processes can interleave mid-line on some systems—document the assumption.

### 16. Lock files (cooperative)

Tools sometimes create `*.lock` directories or files to serialize writers:

```ts
import { mkdir, rm } from "node:fs/promises";

async function withDirLock(lockDir: string, fn: () => Promise<void>): Promise<void> {
  await mkdir(lockDir);
  try {
    await fn();
  } finally {
    await rm(lockDir, { recursive: true, force: true });
  }
}
```

`mkdir` without `recursive` fails with `EEXIST` if the lock is held—retry with backoff. This is cooperative, not kernel mandatory locking; stale locks after crashes need TTL/owner pid strategies. Prefer mature lock helpers when contention matters.

### 17. Comparing checksums

Integrity checks for downloads and config:

```ts
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

async function sha256File(file: string): Promise<string> {
  const hash = createHash("sha256");
  await pipeline(createReadStream(file), hash);
  return hash.digest("hex");
}
```

Stream into the hash—do not `readFile` multi-GB artifacts. Compare digests in constant time when relevant (`crypto.timingSafeEqual` on buffers).

### 18. Readable / Writable typing literacy

Node stream types in `@types/node` are historically complex (`BufferEncoding`, object mode, generics on newer typings). Practical rules:

- Prefer `pipeline` over manual event wiring.
- Treat chunk type as `Buffer | string` unless you set encoding/objectMode deliberately.
- When wrapping streams in your API, accept `AsyncIterable<Uint8Array>` for portability where possible.

### 19. Error wrapping template for I/O modules

```ts
import { AppError } from "./errors.js";

async function readUtf8(path: string, signal?: AbortSignal): Promise<string> {
  try {
    return await readFile(path, { encoding: "utf8", signal });
  } catch (err) {
    if (isErrno(err) && err.code === "ENOENT") {
      throw new AppError("ENOENT", `missing file: ${path}`, { cause: err });
    }
    throw new AppError("IO_READ", `failed reading ${path}`, { cause: err });
  }
}
```

Callers then switch on `AppError.code` without re-parsing Node errno at every layer (ch **11**).

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | User document import/export; respect encoding; size caps before `readFile` |
| **Systems** | Datadir layouts; lock files; atomic config replace; stream large artifacts |
| **Security** | Path canonicalization; symlink policy; secret file modes; no path leak in client errors |
| **Operations** | Log rotation via rename; disk full (`ENOSPC`) alerts; FD limits |
| **Software engineering** | Fixture writers in tests use temp dirs; golden files updated atomically |

### Worked flow — config daemon reload

1. Resolve config path under known root.
2. `readFile` utf8 with signal tied to shutdown.
3. Parse JSON as `unknown` → validate → `Result`.
4. On success, swap in-memory config.
5. On write from admin API: atomic replace, then reload.
6. On `ENOENT`: keep last good config; metric + alert.

### Size caps

```ts
import { stat, readFile } from "node:fs/promises";

async function readFileCapped(file: string, maxBytes: number): Promise<Buffer> {
  const s = await stat(file);
  if (s.size > maxBytes) throw new Error("file too large");
  return readFile(file);
}
```

TOCTOU races exist (file grows after `stat`)—for hostile inputs open and read with a byte budget via streams instead.

### Streaming upload sketch

1. Authenticate and authorize.
2. Enforce `Content-Length` / counted bytes max.
3. `pipeline` request → limited transform → disk under resolved path.
4. On any error, delete partial temp and abort.
5. Atomic rename into final location only after hash verify.

### Cross-platform notes

| Topic | Habit |
|-------|-------|
| Case sensitivity | macOS/Windows often case-insensitive; CI on Linux catches bugs |
| Path separators | Always `path.join`; never assume `/` in stored configs without normalizing |
| Reserved names | Windows `CON` / `NUL`—validate user filenames |
| Line endings | `.gitattributes` for text fixtures; normalize when hashing text |

---

## Staff-level review checklist

- Text vs binary chosen explicitly; UTF-8 default for text.
- `fs/promises` (or streams) used in servers—not sync on hot paths.
- `path.join` / `resolve` used; user paths checked to stay in root.
- Critical writes use temp + rename (atomic replace) on the same volume.
- File handles closed in `finally`; `pipeline` for multi-stream flows.
- I/O errors narrowed by `code`; wrapped with `cause` at boundaries.
- `AbortSignal` supported on long reads/writes where APIs allow.
- Large files streamed; size caps for untrusted uploads.
- Temp files have safe modes and cleanup.
- Symlink following policy intentional for copy/walk.
- Buffer/Uint8Array conversions explicit under TS 5.9.x—no `as any`.
- JSON from disk treated as `unknown` until validated (ch **11**).

---

## References

- [File system (`fs`)](https://nodejs.org/docs/latest/api/fs.html)
- [Path](https://nodejs.org/docs/latest/api/path.html)
- [Stream](https://nodejs.org/docs/latest/api/stream.html)
- [Buffer](https://nodejs.org/docs/latest/api/buffer.html)
- [Errors](https://nodejs.org/docs/latest/api/errors.html)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [`@types/node`](https://www.npmjs.com/package/@types/node)
