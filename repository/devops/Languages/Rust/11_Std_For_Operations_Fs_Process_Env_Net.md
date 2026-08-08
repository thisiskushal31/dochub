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

**`Duration`** is a span. **`Instant`** is monotonic (elapsed time, timeouts, deadlines). **`SystemTime`** is wall clock (logs, mtime comparison)—it can jump. Prefer **`Instant`** for measuring intervals and implementing deadline loops; use **`SystemTime`** when you must talk to humans or filesystems about calendar time.

---

## 2. Advanced concepts

### 1. Timeouts are a design concern, not a default

Many `std` I/O calls **block indefinitely**. `TcpStream` offers **`set_read_timeout`** / **`set_write_timeout`**; child processes have no universal “kill after N seconds” in one method—you combine **`spawn`**, a timer thread or async runtime, and **`kill`**. Design SLOs assume every remote or subprocess call has a **deadline**, a **cancel path**, and a logged error class for timeout versus refusal.

### 2. Atomic replace and durability

Write temp file in the same directory → optionally `sync_all` → **`rename`** over the target so readers see old or new content, not a torn write. Critical for config and checkpoint files. Know that durability guarantees differ across OS and mount options.

### 3. Path encoding and `OsString`

Not every path is valid Unicode. Cross-platform tools use **`OsStr`/`OsString`** at the edges and convert to `String` only when the domain requires UTF-8 (error if not). Logging paths with lossy conversion is acceptable; hashing or comparing security boundaries with lossy conversion is not.

### 4. `remove_dir_all` and destructive APIs

Treat recursive delete like `rm -rf`: validate the path against an allowlisted root before calling. Same discipline for `Command` that runs package managers or cloud CLIs.

### 5. Nonblocking sockets and readiness

`TcpStream`/`UdpSocket` can be set nonblocking; readiness then belongs to an event loop (or an async runtime—see chapter 13). Mixing blocking `std` I/O on async worker threads is a common latency footgun.

### 6. Edition and API stability notes

Path, fs, process, and net APIs are long-stable on modern editions (`2018`–`2024`). Prefer current idioms (`Command::args`, `fs::read_to_string`) over older patterns; behavior is tied to the **stable** standard library of your pinned `rustc`, not to the edition keyword alone.

### 7. Error kind discrimination

`io::Error::kind()` distinguishes `NotFound`, `PermissionDenied`, `TimedOut`, `ConnectionRefused`, and others. Map kinds to retry policy and user-facing messages; do not stringify and regex the `Display` text.

---

## 3. Applications and use cases

### Software engineering

- Push I/O behind small functions returning `Result`; keep domain logic free of ambient `current_dir` mutation.
- Stream large files with `BufReader`; avoid `read_to_string` on multi-GB logs.
- Use `PathBuf::join` for all path construction in cross-platform agents.

### Security

- Never build shell strings from untrusted input; use `Command` argv form.
- Canonicalize and prefix-check paths before reading secrets or writing under a data root.
- Scrub environment when spawning helpers that should not inherit credentials.

### Reliability and operations

- Every network and subprocess call needs timeout, status check, and structured error logging.
- Prefer `Instant`-based deadlines for probes; record wall time separately for humans.
- Drain or redirect child stdio deliberately; hanging on a full pipe looks like a “stuck deploy.”

### Performance

- Buffer I/O; reuse buffers in hot loops.
- Avoid resolving DNS on every tiny request without caching policy.
- Measure subprocess overhead—spawning `git` or cloud CLIs per request rarely belongs on a hot path.

### Staff-level review checklist

- Fallible fs/process/net calls use `?` or explicit `match`; no production `.unwrap()` on I/O.
- Subprocess uses argv list, not interpolated shell, unless a documented exception exists.
- Destructive fs APIs operate only on validated roots.
- Sockets and long waits have timeouts or an explicit “block forever” justification.
- Path handling accounts for non-UTF-8 where the OS allows it.
- Temp → rename (and sync if required) for config/checkpoint writes.
- Error kinds drive retries; Display strings do not.

---

## References

- [`std::fs`](https://doc.rust-lang.org/stable/std/fs/)
- [`std::path`](https://doc.rust-lang.org/stable/std/path/)
- [`std::env`](https://doc.rust-lang.org/stable/std/env/)
- [`std::process::Command`](https://doc.rust-lang.org/stable/std/process/struct.Command.html)
- [`std::io`](https://doc.rust-lang.org/stable/std/io/)
- [`std::net`](https://doc.rust-lang.org/stable/std/net/)
- [`std::net::TcpListener`](https://doc.rust-lang.org/stable/std/net/struct.TcpListener.html)
- [`std::net::TcpStream`](https://doc.rust-lang.org/stable/std/net/struct.TcpStream.html)
- [`std::net::UdpSocket`](https://doc.rust-lang.org/stable/std/net/struct.UdpSocket.html)
- [`std::time`](https://doc.rust-lang.org/stable/std/time/)
- [The Book — Input and Output](https://doc.rust-lang.org/stable/book/ch12-00-an-io-project.html)
- [The Book — Fearless Concurrency (processes context)](https://doc.rust-lang.org/stable/book/ch16-00-concurrency.html)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
