# `std` for operations: fs, process, env, net

[← Back to Rust](./README.md)

## What this chapter covers

How the Rust standard library surfaces **files**, **paths**, **environment**, **child processes**, **I/O traits**, **sockets**, and **time** for operational code—CLIs, agents, health checkers, and deploy helpers. After this chapter you should treat every fallible call as a **`Result`**, design for **timeouts** at the architecture level, and know which `std` modules own which failure modes.

---

## 1. Concepts

### 1. Operational `std` is `Result`-shaped

Most interesting filesystem, process, and network APIs return **`std::io::Result<T>`** (an alias for `Result<T, std::io::Error>`). Expected failures—missing files, permission denied, connection refused—are values, not panics. Operational code maps those errors to exit codes, logs, or retries; it does not unwrap blindly in production paths.

```rust
use std::fs;
use std::io;

fn read_config(path: &str) -> io::Result<String> {
    fs::read_to_string(path)
}
```

### 2. `std::path` — portable path values

**`Path`** and **`PathBuf`** are the typed path layer. Prefer them over raw `String` concatenation: `join`, `parent`, `file_name`, `extension`, and `components` understand platform separators. **`Path::new`** borrows; **`PathBuf`** owns. Display with `.display()` when printing; do not assume UTF-8 on every OS path (especially Windows).

Security-relevant operations often need **canonicalization** (`canonicalize`) before comparing against an allowlisted root—symlink and `..` tricks defeat naive string prefixes.

### 3. `std::fs` — files and directories

Common operations:

| API family | Role |
|------------|------|
| `read` / `read_to_string` / `write` | Whole-file convenience |
| `File::open` / `File::create` / `OpenOptions` | Streaming handles |
| `create_dir` / `create_dir_all` / `remove_dir_all` | Directory lifecycle |
| `metadata` / `symlink_metadata` | Size, permissions, type |
| `copy` / `rename` / `hard_link` | Move and link |
| `read_dir` | Directory iteration |

**`OpenOptions`** controls create/truncate/append/read/write. Use **`metadata`** for idempotent “skip if unchanged” deploy logic. Prefer open-and-handle-errors over exist-then-open when TOCTOU matters.

### 4. `std::io` — traits every handle shares

**`Read`**, **`Write`**, **`BufRead`**, and **`Seek`** unify files, sockets, and pipes. Buffer with **`BufReader`** / **`BufWriter`** for many small reads/writes. **`stdin`**, **`stdout`**, **`stderr`** are process streams; flush stdout when you interleave with stderr or child processes.

Partial reads and short writes are normal. Loop until you have enough bytes or hit `Ok(0)` (EOF). Do not assume one `read` fills your buffer.

### 5. `std::env` — process environment and args

| API | Use |
|-----|-----|
| `args` / `args_os` | CLI arguments (`OsString` when non-UTF-8 matters) |
| `var` / `var_os` / `vars` | Environment variables |
| `set_var` / `remove_var` | Mutate env (process-global; avoid in libraries) |
| `current_dir` / `set_current_dir` | Working directory |
| `temp_dir` / `current_exe` | Scratch and self path |

Prefer **`env::var("KEY")`** with explicit missing-key handling over silent defaults for required config. Environment is inherited by children—strip secrets before spawning untrusted commands.

### 6. `std::process` — `Command` and status

**`Command`** builds argv without a shell by default:

```rust
use std::process::Command;

let status = Command::new("git")
    .args(["status", "--porcelain"])
    .status()?;
```

Capture with **`output()`** (stdout + stderr + status) or **`spawn()`** for long-lived children. Check **`ExitStatus::success()`**. Prefer argument lists over `sh -c` strings; shell form reintroduces injection.

**`Stdio::piped()`**, **`null()`**, and **`inherit()`** control inheritance. Reading both piped stdout and stderr without care can **deadlock** if buffers fill—drain both or use a helper pattern.

### 7. `std::net` — TCP and UDP at a high level

| Type | Role |
|------|------|
| `TcpListener` | Bind and accept connections |
| `TcpStream` | Connected byte stream |
| `UdpSocket` | Datagram send/recv |
| `SocketAddr` / `ToSocketAddrs` | Addressing and DNS resolution |

```rust
use std::net::TcpListener;

let listener = TcpListener::bind("127.0.0.1:8080")?;
for conn in listener.incoming() {
    let mut stream = conn?;
    // handle stream
}
```

`std::net` is **blocking** by default. DNS via `ToSocketAddrs` can block on slow resolvers. For production HTTP clients/servers you usually want a higher-level crate; `std::net` remains correct for health probes, custom protocols, and understanding the socket model.

### 8. `std::time` — clocks and durations

**`Duration`** is a span. **`Instant`** is monotonic (elapsed time, timeouts, deadlines). **`SystemTime`** is wall clock (logs, mtime comparison)—it can jump. Prefer **`Instant`** for measuring intervals and implementing deadline loops; use **`SystemTime`** when you must talk to humans or filesystems about calendar time. Deeper clock and `Duration` pitfalls are in Advanced concepts below.

### 9. Secrets: environment versus files and mounts

Operational programs often receive credentials through **environment variables**, **files** (or secret mounts), or a combination. Environment variables are convenient for local CLIs and many container platforms, but they are easy to leak: process listings, crash dumps, debug logs that dump `std::env::vars()`, and **inheritance into child processes** via `Command`. Prefer files or platform secret mounts when the runtime supports them and when multiple helpers must not all see the same ambient env.

Engineering rules that hold across delivery models:

- Do **not** log secret values (or full env maps) at info/debug in production paths.
- When spawning children that do not need credentials, **clear or replace** the environment (`Command::env_clear`, selective `env` / `env_remove`) instead of inheriting the parent wholesale.
- Treat “secret in a file” as still secret: enforce permissions, avoid world-readable paths, and do not echo file contents into shared logs.
- Prefer short-lived handles in memory; avoid writing secrets into temp files that survive the process.

`std` gives you the I/O and process primitives; secret *stores* (vault agents, cloud secret managers) sit above this layer.

---

## 2. Advanced concepts

### 1. Timeouts are a design concern, not a default

Many `std` I/O calls **block indefinitely**. `TcpStream` offers **`set_read_timeout`** / **`set_write_timeout`**; child processes have no universal “kill after N seconds” in one method—you combine **`spawn`**, a timer thread or async runtime, and **`kill`**. Design SLOs assume every remote or subprocess call has a **deadline**, a **cancel path**, and a logged error class for timeout versus refusal.

### 2. Atomic replace and durability

Write temp file in the same directory → optionally `sync_all` → **`rename`** over the target so readers see old or new content, not a torn write. Critical for config and checkpoint files. Know that durability guarantees differ across OS and mount options.

### 3. Path encoding and `OsString` / `OsStr` (deeper)

Not every path or env value is valid Unicode. **`OsString`** owns platform string data; **`OsStr`** borrows it—the same owned/borrowed split as `String`/`str`, but without a UTF-8 guarantee.

| Concern | Practice |
|---------|----------|
| **Sources** | `env::args_os`, `env::var_os`, `Path`/`PathBuf` components, some `Command` outputs |
| **To Rust text** | `to_str()` → `Option<&str>` (fail closed); `to_string_lossy()` for display only |
| **Security** | Never use lossy conversion for allowlists, signatures, or equality of roots—lossy maps distinct OS strings to the same display |
| **Windows** | Wide/WTF-8-ish realities: invalid UTF-16 sequences can appear; do not assume every `OsStr` round-trips through `String` |
| **Interop** | Prefer keeping `OsString` through the pipeline until a UTF-8 boundary (JSON, HTTP headers) forces a checked conversion |

Cross-platform agents should type path and env edges as `OsStr`/`OsString`/`Path`/`PathBuf` and convert inward only with an explicit error policy.

### 4. `remove_dir_all` and destructive APIs

Treat recursive delete like `rm -rf`: validate the path against an allowlisted root before calling. Same discipline for `Command` that runs package managers or cloud CLIs.

### 5. Nonblocking sockets and readiness

`TcpStream`/`UdpSocket` can be set nonblocking; readiness then belongs to an event loop (or an async runtime—see chapter 13). Mixing blocking `std` I/O on async worker threads is a common latency footgun.

### 6. Edition and API stability notes

Path, fs, process, and net APIs are long-stable on modern editions (`2018`–`2024`). Prefer current idioms (`Command::args`, `fs::read_to_string`) over older patterns; behavior is tied to the **stable** standard library of your pinned `rustc`, not to the edition keyword alone.

### 7. Symlinks, `canonicalize`, and TOCTOU

**`symlink_metadata`** reports the symlink itself; **`metadata`** / opening a path typically follows links (platform rules apply). **`canonicalize`** resolves `.`, `..`, and symlinks to a physical path—use it before comparing against an allowlisted root.

**TOCTOU** (time-of-check–time-of-use): `exists` / `metadata` / string prefix checks, then a later `open`/`remove`, can race with another process renaming or swapping a symlink. Prefer:

- Open the file/directory first (`File::open` / `OpenOptions`), then validate the handle’s metadata or a canonical path derived from a carefully designed layout.
- For directory jail patterns, prefer platform facilities (for example openat-style workflows via crates or libc) over check-then-act on path strings when the threat model includes local attackers.
- Still canonicalize-and-prefix-check for many deploy tools, but treat that as best-effort against mistakes—not a complete security boundary against concurrent path swaps.

### 8. Temporary files and directories

Patterns that avoid leaving secrets or torn state behind:

- **`std::env::temp_dir()`** locates a system temp root; it is shared and not automatically private—create uniquely named children (`std::fs::create_dir` with a random suffix, or an ecosystem temp crate) and set restrictive permissions where the OS allows.
- Prefer **same-filesystem temp + `rename`** into the destination directory for atomic config replace (see Atomic replace above). Cross-device rename fails—detect and fall back carefully.
- Always **`remove_file` / `remove_dir_all`** in `Drop` or a `defer`-style cleanup path on success and failure; ignore `NotFound` on cleanup.
- Do not write secrets into world-readable temp paths; prefer process-private directories or memory when possible.

`std` alone has no single “temp file with auto-delete” type used everywhere—teams often adopt a small helper or a well-known temp crate; the operational rules above still apply.

### 9. `ErrorKind` discrimination for retries

`io::Error::kind()` drives policy. Do **not** parse `Display` strings.

| `ErrorKind` (examples) | Typical stance |
|------------------------|----------------|
| **`Interrupted`** | Retry the same syscall/loop; often from signals—usually safe to continue. |
| **`WouldBlock`** | Nonblocking I/O not ready; wait for readiness or back off—do not spin hot. |
| **`TimedOut`** | Deadline hit; retry only with budget/backoff and idempotent ops. |
| **`AlreadyExists`** | Create raced or truly exists—idempotent create may succeed as no-op; blind retry of exclusive create loops forever. |
| **`NotFound`**, **`PermissionDenied`**, **`ConnectionRefused`** | Usually not “sleep and hope” without a defined recovery; map to user errors or circuit breakers. |

Classify once at the boundary; metrics should label by kind (or your domain enum), not by localized text.

### 10. DNS and `ToSocketAddrs` pitfalls

`str`/`String` addresses often go through **`ToSocketAddrs`**, which may perform **blocking DNS**. Pitfalls:

- Resolution can return **multiple** addresses (IPv4/IPv6); iterating only the first can hide working endpoints—or pick a slow dead one. Decide dual-stack policy explicitly.
- Hostnames are not stable identities for allowlists; prefer resolved IPs only with care (DNS rebinding / TTL). Certificates and SNI still need the name at TLS layers above `std::net`.
- Failures look like I/O errors; timeouts may be resolver-dependent. Cache results with a TTL policy when probing in a tight loop.
- For production clients, higher-level stacks often own resolvers and Happy Eyeballs; bare `std::net` is fine for simple probes if you accept blocking and address-list behavior.

### 11. Windows vs Unix: env, paths, `Command`, and signals

Cross-platform ops code should assume **behavioral differences**, not only separator characters:

| Area | Unix-oriented behavior | Windows-oriented behavior |
|------|------------------------|---------------------------|
| Environment | Variable names are typically **case-sensitive** | Names are typically **case-insensitive** (`Path` vs `PATH` collide) |
| Paths | `/` separators; permission bits and symlinks are first-class | Drive letters, `\` (and `/` in many APIs); different symlink/junction semantics |
| `Command` | Execve-style argv; shell only if you invoke one | Creates processes via the Windows process APIs; `.exe` resolution and `PATHEXT` matter; some programs expect shell-like quoting if you misuse a shell |
| Signals | `SIGINT` / `SIGTERM` / etc. are a normal control plane | No POSIX signal model; limited console-control and process-termination concepts—do not design “trap SIGTERM” as if it were portable |

Use `std::path` and `std::env`/`OsString` APIs so you do not hard-code Unix assumptions. For graceful shutdown, prefer a **portable cancellation story** (channel flag, ctrl-c crates that abstract the platform, or supervisor kill) rather than raw signal handlers copied from Linux runbooks. Document any Unix-only signal handling behind `cfg(unix)`.

### 12. Serialization and config with serde (ecosystem pattern)

**serde** is not part of the Rust standard library. It is the **de facto ecosystem standard** for structured (de)serialization: derive `Serialize`/`Deserialize`, enable Cargo features such as **`derive`**, and pair with format crates (commonly JSON, YAML, or TOML) that implement serde’s data model. Operational CLIs and agents almost always load config this way rather than hand-parsing with `std` alone.

Staff-level pattern:

- Declare serde and format crates in `Cargo.toml` with **pinned versions** and explicit features (`derive`, and only the formats you need).
- Keep config types plain structs/enums; validate invariants after deserialize (ports, paths, allowlists)—serde gives shape, not full policy.
- For **untrusted** input (user uploads, network payloads, world-writable config drops): enforce **size limits** before or during parse, and treat **`deny_unknown_fields`** (or equivalent) as a **policy choice**—strict for security-sensitive schemas, looser when you must tolerate forward-compatible config from newer writers.
- Map parse failures to clear operator errors; do not unwrap config load on the production path.

`std` still owns reading bytes from disk or env; serde owns turning bytes into typed values.

### 13. `CString` / `CStr` at FFI string boundaries

When operational code touches C APIs (or crates that surface them), **nul-terminated** strings are the usual contract. **`std::ffi::CString`** owns a byte buffer with a trailing `0`; **`CStr`** borrows one. Rules that matter:

- **No interior nuls:** `CString::new` rejects embedded `0` bytes—Rust `&str`/`String` can contain them; C string APIs cannot.
- **Trailing nul is not part of the logical text** when converting back; use `to_str` / `to_bytes` carefully.
- Pass **`as_ptr()`** (`*const c_char`) only while the `CString` (or other owner) lives; do not return a dangling pointer from a temporary.
- Who frees what across the language boundary is an FFI ownership question (chapter 14)—`CString` dropping frees the Rust allocation; foreign-allocated strings need the foreign free.

Prefer `CString`/`CStr` over hand-rolled `Vec` + push `0` unless you own a documented buffer protocol.

### 14. `Instant` versus `SystemTime` (monotonic vs wall clock)

| Type | Clock class | Use for | Do not use for |
|------|-------------|---------|----------------|
| **`Instant`** | Monotonic (steady for elapsed measurement on the platform’s clock) | Timeouts, deadlines, latency, “wait N ms,” probe intervals | Human-readable timestamps, mtime, certificates |
| **`SystemTime`** | Wall clock (calendar / UNIX-time family) | Logs, file mtime, “not before” calendar checks | Measuring elapsed intervals under clock skew |

**NTP and admin steps can jump `SystemTime` forward or backward.** A deadline computed as `SystemTime::now() + duration` can fire immediately or stretch oddly after a step. Prefer **`Instant::now()` + `Duration`** (or `Instant` deadlines) for control loops; record wall time separately when operators need a clock reading. Converting between the two is lossy in meaning—do not treat them as interchangeable.

### 15. `Duration` construction pitfalls

**`Duration`** is a non-negative span (`secs` + `nanos`). Pitfalls:

- **Overflow / saturating APIs:** `Duration::new` and arithmetic can panic or saturate depending on API (`checked_*`, `saturating_*`)—prefer checked math at untrusted boundaries (config timeouts).
- **From floats:** `from_secs_f64` / similar need finite, non-negative inputs; NaN/negative are errors or panics by API—validate config before conversion.
- **Resolution:** sub-nanosecond wishes are fiction; round consciously when translating from millis/micros in JSON.
- **Zero vs “disabled”:** `Duration::ZERO` is a valid span (spin/immediate timeout)—do not overload it as “no timeout” without an `Option<Duration>` or sentinel policy.
- **Sleep and join:** `thread::sleep(dur)` and similar take `Duration`; passing huge values from unbounded config is a hang class—cap operator-facing timeouts.

Staff rule: timeouts from config are parsed, bounded, and applied via `Instant`, not via hope that wall clock stays still.

### 15. What the standard library is (a map, not a memorization test)

**`std`** is Rust’s standard library: the built-in toolbox that ships with the language for everyday work—strings, files, processes, sockets, threads, time, and more. You are not expected to memorize every page. You *are* expected to know **which corner of the toolbox** to open for a given job, then read that module’s official docs.

Think of it as a street map:

| If you need… | Open `std::…` | Plain idea |
|--------------|---------------|------------|
| Owned text or growable buffers | `string`, `vec`, `collections` | Own the data (`String`/`Vec`); slices (`str`/`[T]`) borrow it |
| Maps, sets, queues | `collections` | In-memory data structures (chapter 09) |
| Files and directories | `fs`, `path` | Talk to the filesystem (this chapter) |
| Environment variables, args, cwd | `env` | How this process was started and configured |
| Run another program | `process` | Start children with a real argument list, not a shell string |
| Read/write bytes in a uniform way | `io` | Shared traits for files, pipes, and sockets |
| TCP/UDP (blocking style) | `net` | Network endpoints; timeouts are your design problem |
| Threads, channels, locks | `thread`, `sync` | Classic concurrency (chapter 12) |
| Lock-free shared numbers/flags | `sync::atomic` | Atomics—use with care |
| Clocks and durations | `time` | “How long?” (`Instant`) vs “what time is it?” (`SystemTime`) |
| Async building blocks | `future`, `pin`, `task` | Language pieces; the **runtime** that drives them is usually a crate (chapter 13) |
| Talk to C / OS strings | `ffi` | Nul-terminated and OS-native strings |
| Raw memory helpers | `mem`, `ptr`, `alloc` | Layout and pointers (chapter 14) |
| Printing and formatting | `fmt` (and `println!`) | How values become text |
| Error types | `error`, `io::Error` | Failure as values (chapter 07) |
| What happens on panic | `panic` | Hooks and abort vs unwind (chapter 19) |
| Smaller embedded subset | `core` / `alloc` docs | Same ideas without a full OS (chapters 14, 18) |

Use the map to find the door, then return to the handbook chapter for the *engineering* rules (timeouts, cancellation, FFI ownership). Prefer what `std` already gives you over inventing a second filesystem or process API.

---

## 3. Applications and use cases

### Software engineering

- Push I/O behind small functions returning `Result`; keep domain logic free of ambient `current_dir` mutation.
- Stream large files with `BufReader`; avoid `read_to_string` on multi-GB logs.
- Use `PathBuf::join` for all path construction in cross-platform agents.

### Security

- Never build shell strings from untrusted input; use `Command` argv form.
- Canonicalize and prefix-check paths before reading secrets or writing under a data root; remember TOCTOU against local attackers.
- Scrub environment when spawning helpers that should not inherit credentials; prefer secret files/mounts over long-lived env when the platform allows.
- Bound and validate untrusted config bytes before serde deserialize; decide deny-unknown-fields policy per schema.

### Reliability and operations

- Every network and subprocess call needs timeout, status check, and structured error logging.
- Prefer `Instant`-based deadlines for probes; record wall time separately for humans; never key control-loop deadlines on `SystemTime` alone.
- Bound and validate `Duration` values from config (`Option` for “no timeout,” caps for max wait).
- Drain or redirect child stdio deliberately; hanging on a full pipe looks like a “stuck deploy.”
- Retry only idempotent ops on `Interrupted` / carefully budgeted `TimedOut` / readiness-driven `WouldBlock`; treat `AlreadyExists` as a state question, not a blind retry.

### Performance

- Buffer I/O; reuse buffers in hot loops.
- Avoid resolving DNS on every tiny request without caching policy; account for multi-address `ToSocketAddrs` results.
- Measure subprocess overhead—spawning `git` or cloud CLIs per request rarely belongs on a hot path.

### Staff-level review checklist

- Fallible fs/process/net calls use `?` or explicit `match`; no production `.unwrap()` on I/O.
- Subprocess uses argv list, not interpolated shell, unless a documented exception exists.
- Destructive fs APIs operate only on validated roots; symlink/`canonicalize` behavior considered.
- Sockets and long waits have timeouts or an explicit “block forever” justification.
- Path handling accounts for non-UTF-8 where the OS allows it; security comparisons do not use lossy `OsStr` conversion.
- Temp → rename (and sync if required) for config/checkpoint writes; temp cleanup and permissions reviewed.
- Error kinds drive retries; Display strings do not.
- Cross-platform env/path/signal assumptions are documented; Unix-only signal code is `cfg`-gated.
- Child processes that must not see secrets use cleared or curated environments.
- Config loading via serde (ecosystem) has size limits and an explicit unknown-field policy for untrusted input.
- Control-loop timeouts use **`Instant` + `Duration`**; wall clock is for logs/mtime only; FFI string edges use **`CString`/`CStr`** with lifetime-clear pointers.
- Authors can point to the right corner of `std` for a job (section 15 map) without pretending they memorized the whole library.

---

## References

- [`std::fs`](https://doc.rust-lang.org/stable/std/fs/)
- [`std::fs::canonicalize`](https://doc.rust-lang.org/stable/std/fs/fn.canonicalize.html)
- [`std::fs::symlink_metadata`](https://doc.rust-lang.org/stable/std/fs/fn.symlink_metadata.html)
- [`std::path`](https://doc.rust-lang.org/stable/std/path/)
- [`std::ffi::OsString`](https://doc.rust-lang.org/stable/std/ffi/struct.OsString.html)
- [`std::ffi::OsStr`](https://doc.rust-lang.org/stable/std/ffi/struct.OsStr.html)
- [`std::ffi::CString`](https://doc.rust-lang.org/stable/std/ffi/struct.CString.html)
- [`std::ffi::CStr`](https://doc.rust-lang.org/stable/std/ffi/struct.CStr.html)
- [`std::env`](https://doc.rust-lang.org/stable/std/env/)
- [`std::env::temp_dir`](https://doc.rust-lang.org/stable/std/env/fn.temp_dir.html)
- [`std::process::Command`](https://doc.rust-lang.org/stable/std/process/struct.Command.html)
- [`std::io`](https://doc.rust-lang.org/stable/std/io/)
- [`std::io::ErrorKind`](https://doc.rust-lang.org/stable/std/io/enum.ErrorKind.html)
- [`std::net`](https://doc.rust-lang.org/stable/std/net/)
- [`std::net::ToSocketAddrs`](https://doc.rust-lang.org/stable/std/net/trait.ToSocketAddrs.html)
- [`std::net::TcpListener`](https://doc.rust-lang.org/stable/std/net/struct.TcpListener.html)
- [`std::net::TcpStream`](https://doc.rust-lang.org/stable/std/net/struct.TcpStream.html)
- [`std::net::UdpSocket`](https://doc.rust-lang.org/stable/std/net/struct.UdpSocket.html)
- [`std::time`](https://doc.rust-lang.org/stable/std/time/)
- [`std::time::Instant`](https://doc.rust-lang.org/stable/std/time/struct.Instant.html)
- [`std::time::SystemTime`](https://doc.rust-lang.org/stable/std/time/struct.SystemTime.html)
- [`std::time::Duration`](https://doc.rust-lang.org/stable/std/time/struct.Duration.html)
- [The Book — Input and Output](https://doc.rust-lang.org/stable/book/ch12-00-an-io-project.html)
- [The Book — Fearless Concurrency (processes context)](https://doc.rust-lang.org/stable/book/ch16-00-concurrency.html)
- [Rust By Example — Child processes](https://doc.rust-lang.org/stable/rust-by-example/std_misc/process.html)
- [Rust By Example — Filesystem operations](https://doc.rust-lang.org/stable/rust-by-example/std_misc/fs.html)
- [Cargo Book — Features](https://doc.rust-lang.org/stable/cargo/reference/features.html)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
