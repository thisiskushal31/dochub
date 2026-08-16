# Errors, catch, trace, and introspection

[← Back to Tcl](./README.md)

## What this chapter covers

How Tcl reports failure and how you recover: **`catch`**, **`error`**, **`try`** (8.6+/9), **`return -code`**, **`errorInfo` / `errorCode`**, plus **`trace`** and **`info`** for debugging and reflection. Brief doors: **`time`** for micro-benchmarks and **`history`** for interactive REPL literacy. Default is **Tcl 9.0.x**; patterns apply to **8.6** brownfield with only minor option differences.

You leave able to structure error handling without swallowing bugs, classify failures for ops, measure hot scripts without cargo-cult timing, and use introspection in review instead of guesswork.

---

## 1. Concepts

### 1. Errors are return codes, not only strings

Tcl commands complete with a **completion code**: normally `ok`, or `error`, `return`, `break`, `continue`, and other documented codes. An “exception” is usually **`return -code error`** (what `error` raises) bubbling until something catches it.

The human message is one field; machines should prefer **`errorCode`** (a list) when classifying failures.

### 2. `catch` — the universal barrier

```tcl
if {[catch {script...} result options]} {
    # non-ok completion; $result is typically the error message
    # $options is a dict of -code, -level, -errorcode, -errorinfo, ...
}
```

Classic two-argument form still appears everywhere:

```tcl
if {[catch {expr {1/0}} err]} {
    puts "failed: $err"
}
```

Prefer the **options dict** form in new code so you keep `-errorcode` and `-errorinfo` without scraping globals only.

`catch` catches **all** non-`ok` codes unless you re-raise carefully—including `break`/`continue` if you wrap loop bodies incorrectly. Catch the smallest script that can fail.

### 3. Raising errors: `error` and `return -code`

```tcl
error "config missing" "" {APP CONFIG MISSING}
# equivalent spirit:
return -code error -errorcode {APP CONFIG MISSING} "config missing"
```

Guidelines:

- Message: clear, actionable, safe to log (no secrets).
- `errorCode`: stable list tokens for machines (`POSIX EPIPE …`, `CHILDSTATUS …`, or your `APP …` vocabulary).
- Do not overload error messages as the only API for control flow in libraries.

### 4. `try` / `on` / `trap` / `finally`

**`try`** (available since Tcl 8.6, standard in 9) structures handlers:

```tcl
try {
    set ch [open $path r]
    gets $ch line
} on error {msg opts} {
    puts stderr "open/read failed: $msg"
    return -options $opts -code error $msg
} finally {
    if {[info exists ch]} {
        catch {close $ch}
    }
}
```

`trap` matches on `errorCode` patterns—use it to handle POSIX vs application errors differently without string-matching messages.

`finally` runs for cleanup; keep it idempotent and side-effect-light.

### 5. `errorInfo` and `errorCode`

After an error (when not fully handled), Tcl records:

| Variable | Content |
|----------|---------|
| `::errorInfo` | Stack-ish traceback string |
| `::errorCode` | List classifying the error |

In modern handlers, read the same data from the **options dict** (`-errorinfo`, `-errorcode`) so nested `catch` frames do not race on globals.

`errorCode` conventions you will see in the wild:

- `NONE` — generic
- `POSIX errno …` — system call style
- `CHILDSTATUS pid code` — `exec` failures
- Application lists — `{MYPKG REASON detail}`

### 6. `return` beyond values

`return` can set the completion code for the **caller** (with `-level`):

```tcl
proc requireNumber {x} {
    if {![string is double -strict $x]} {
        return -code error -errorcode {APP BAD NUMBER} "not a number: $x"
    }
    return $x
}
```

`break` / `continue` are also return codes; `catch` without care will intercept them. That is why `catch` around entire loop bodies is a smell.

### 7. Introspection with `info`

`info` answers “what does the interpreter know?” Common staff tools:

| Form | Use |
|------|-----|
| `info exists var` | Defensive checks |
| `info commands ?pattern?` | What commands exist |
| `info procs` / `info args` / `info body` | Procedure reflection |
| `info level` / `info frame` | Call stack |
| `info patchlevel` | Exact runtime |
| `info nameofexecutable` | Which binary |
| `info loaded` | Loaded binaries (extensions) |
| `info complete` | Is a string a complete Tcl script? (rep loops) |

```tcl
puts [info patchlevel]
if {[info exists env(DEBUG)] && $env(DEBUG)} {
    puts [info level 0]
}
```

### 8. `trace` — react to reads, writes, and executions

`trace` attaches callbacks to variable access or command execution:

```tcl
trace add variable watched write [list apply {{name el op} {
    puts "write $name($el)"
}}]
```

Forms include variable traces (`read`/`write`/`unset`), command traces, and execution traces. Powerful for debugging; dangerous as hidden control flow in production libraries.

### 9. `time` — micro-benchmark literacy

`time` runs a script repeatedly and reports average elapsed microseconds per iteration:

```tcl
puts [time {
    # candidate hot path
    string length [string repeat a 1000]
} 1000]
# → e.g. "12.3 microseconds per iteration"
```

| Habit | Why |
|-------|-----|
| Pass an explicit **count** | One-shot timings are noise; hundreds or thousands of iterations smooth jitter |
| Measure **elapsed** time | Not CPU time—other processes and I/O affect results |
| Brace the script | Same quoting rules as everywhere; unwanted substitution skews the work |
| Compare apples to apples | Warm up once; keep patchlevel, encoding, and data size fixed |
| Do not “optimize” CI on micro-wins | Use `time` to confirm a suspected hot path, not to paint-bike every `lindex` |

Staff use: before rewriting a parser “for speed,” time the current path vs the proposed one on realistic payloads. Pair with ch **08** channel work—often I/O or `exec` dominates, not Tcl list ops.

```tcl
proc bench {label body {n 1000}} {
    set r [time $body $n]
    puts "$label: $r"
}
bench concat-loop {
    set s ""
    for {set i 0} {$i < 100} {incr i} { append s x }
}
bench string-repeat {
    set s [string repeat x 100]
}
```

`time` is a **literacy tool**, not a full profiler. For event-loop apps, also watch wall time around `vwait` and handler latency (ch **11**).

### 10. `history` — interactive REPL door

In interactive **`tclsh`** / **`wish`**, Tcl keeps a short list of recently executed commands. The **`history`** command inspects and manipulates that list:

| Form | Role |
|------|------|
| `history` / `history info` | Show recent events |
| `history keep ?count?` | How many events to retain |
| `history event ?event?` | Fetch one event’s text |
| `history redo ?event?` | Re-run an event |
| `history clear` | Wipe the list |

This is a **REPL convenience**, not an application API. Production automation should not depend on `history` for control flow. Interactively, `!!` / `!event`-style shortcuts may be handled via the default `unknown` path (ch **10**)—useful at a keyboard, dangerous if you expect the same in batch scripts (`tcl_interactive` is 0).

```tcl
# Interactive exploration only
history keep 50
# … type commands …
history info 10
```

For scripted diagnostics prefer `info` / logging / explicit procs over replaying shell history.

---

## 2. Advanced concepts

### 1. Options dict discipline

When re-throwing:

```tcl
if {[catch {doWork} msg opts]} {
    # log $msg / dict get $opts -errorcode
    return -options $opts -code error $msg
}
```

This preserves the original `-errorinfo` chain. Reconstructing errors with only `error $msg` loses context.

### 2. `bgerror` and the event loop

Errors in event handlers (`fileevent`, `after`, Tk callbacks) may land in **`bgerror`** instead of your foreground `catch`. Install a deliberate `bgerror` / `interp bgerror` in long-running services so failures are logged and counted—not silently printed once to stderr.

Coroutines and threads (ch **12**) have their own “where did this error go?” stories—test failure injection.

### 3. Traces as last-resort observers

Variable traces can fire during `unset` of namespaces and interpreter teardown—callbacks must tolerate half-destroyed state. Prefer explicit APIs over traces for business logic (audit hooks, ORMs, magic globals).

Command traces used to wrap `exec`/`open` for security auditing must themselves be simple and re-entrancy-safe.

### 4. `info frame` vs guessing

For library diagnostics, `info frame` gives structured stack data (where available) superior to regex on `errorInfo`. Use it in test harnesses and operator “dump state” commands.

### 5. Catching too much

Anti-patterns:

- `catch {entire script}` at top level with empty handler
- Using `catch` instead of validating inputs
- Catching and returning empty string on failure (callers cannot tell miss from error)

Prefer `try` with specific `trap`/`on error`, log with codes, and fail closed on security-sensitive paths (ch **16**).

### 6. Performance

`catch` is normal control flow in Tcl, but wrapping tiny ops in deep hot loops still costs. Validate once; do not `catch` every `lindex` when a prior `llength` check suffices.

### 7. `try` matching order and `trap`

Handlers run in order; the **first** match wins. Consequence: an early `on error` masks later `trap` clauses. Prefer specific `trap {POSIX ENOENT} …` / `trap {APP …} …` **before** a generic `on error` when you classify failures.

`trap` compares a **prefix** of `-errorcode` to its pattern (list-length aware). Design your application codes as stable leading tokens: `{APP CONFIG MISSING}` rather than free-form English in the code list.

Tcl 9 channel encoding can raise conversion errors on `read` when a strict profile is set—trap those separately from `POSIX` open failures so operators see “bad bytes” vs “missing file.”

### 8. `throw` (when present)

Some codebases use `throw type message` as a structured raiser that fills `-errorcode` from `type`. If your patchlevel documents `throw`, prefer it for application errors with a team-wide type vocabulary; otherwise stick to `return -code error -errorcode …`. Do not mix three different raise styles in one package.

### 9. Stack discipline with `return -level`

`return -level N` adjusts which stack frame receives the return. Almost all application code should use the default. Metaprogramming, custom control structures, and ensemble wrappers are the usual justified cases—review any non-default `-level` carefully; it is easy to return past the frame you meant to fail in.

### 10. Introspection for incident response

Operator “dump” commands that help without leaking secrets:

```tcl
proc debugState {} {
    puts "patchlevel=[info patchlevel]"
    puts "executable=[info nameofexecutable]"
    puts "commands(sample)=[lrange [lsort [info commands]] 0 20]"
}
```

Avoid dumping full `array get env` or entire `info body` of auth procs into tickets. Pair with ch **16** redaction rules.

### 11. Interpreting `time` results honestly

- First iterations may include bytecode compile cost—use a large enough `count` or discard a warm-up `time`.
- Nested `time` inside traced/`bgerror`-noisy environments measures the noise too.
- Comparing across machines or load averages is meaningless without recording `info patchlevel` and a fixed dataset.
- Prefer fixing algorithmic complexity (list vs repeated string concat, unnecessary `eval`) over shaving a microsecond from a cold CLI tool.

---

## 3. Applications and use cases

| Domain | Use |
|--------|-----|
| **Application** | Input validation with `return -code error`; transactional cleanup via `finally` |
| **Systems** | Mapping `CHILDSTATUS` / `POSIX` codes to retries vs hard fails |
| **Security** | Never `catch` around `auth` checks and continue; fail closed; scrub messages |
| **Operations** | Standardize `errorCode` prefixes in automation so monitors can alert without parsing English |
| **Software engineering** | Test suites intentionally `catch` expected errors; `info` used in debug CLIs; `time` for hot-path claims |

Embedded hosts often surface Tcl errors to a parent C API—stable `errorCode` lists are kinder than free-form strings (ch **14**).

---

## Staff-level review checklist

- Failures use `return -code error` / `error` with stable `-errorcode` lists where machines care.
- `catch`/`try` handlers log and either recover **or** re-raise with `-options` preserved.
- No empty `catch` that swallows bugs; no catch wrapping `break`/`continue` unintentionally.
- Resource cleanup in `finally` or equivalent; channels/files closed on error paths.
- Event-driven apps define `bgerror` behavior.
- Traces are not used as invisible business logic.
- Error messages exclude secrets and raw credentials (ch **16**).
- Brownfield scripts that only set `errorInfo` scraping still work under `try` migration.
- Hot-path claims in PRs include a `time` comparison (or a clear reason I/O/`exec` dominates).
- No production logic depends on interactive `history` / `!!` shortcuts.

---

## References

- [catch](https://www.tcl-lang.org/man/tcl9.0/TclCmd/catch.html)
- [error](https://www.tcl-lang.org/man/tcl9.0/TclCmd/error.html)
- [try](https://www.tcl-lang.org/man/tcl9.0/TclCmd/try.html)
- [throw](https://www.tcl-lang.org/man/tcl9.0/TclCmd/throw.html)
- [return](https://www.tcl-lang.org/man/tcl9.0/TclCmd/return.html)
- [trace](https://www.tcl-lang.org/man/tcl9.0/TclCmd/trace.html)
- [info](https://www.tcl-lang.org/man/tcl9.0/TclCmd/info.html)
- [time](https://www.tcl-lang.org/man/tcl9.0/TclCmd/time.html)
- [history](https://www.tcl-lang.org/man/tcl9.0/TclCmd/history.html)
- [bgerror](https://www.tcl-lang.org/man/tcl9.0/TclCmd/bgerror.html)
- [Tcl 9.0 command index](https://www.tcl-lang.org/man/tcl9.0/TclCmd/)
