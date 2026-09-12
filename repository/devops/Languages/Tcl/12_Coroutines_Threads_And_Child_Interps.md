# Coroutines, threads, and child interpreters

[← Back to Tcl](./README.md)

## What this chapter covers

Three ways Tcl scales concurrency and isolation: **coroutines** (`coroutine` / `yield` / `yieldto`), **child interpreters** (`interp`, including the **safe interp** door), and the **Thread** package door. Default is **Tcl 9.0.x**. Coroutines and interps are core; **Thread** is an extension you must `package require` when the build provides it. **Tcl 8.6** already has coroutines—brownfield code may use them heavily.

You leave able to structure async flows without nested `vwait` hell, sandbox untrusted scripts at the interp boundary, and know when OS threads are (and are not) the right tool.

---

## 1. Concepts

### 1. Why three mechanisms?

| Tool | Concurrency style | Isolation | Typical use |
|------|-------------------|-----------|-------------|
| **Coroutines** | Cooperative, same thread | Shared globals (careful) | Readable async I/O state machines |
| **Child interps** | Separate Tcl worlds | Strong command/var isolation | Plugins, safe eval, embedding |
| **Threads** | OS threads, separate interps | Per-thread interp + explicit messaging | Parallel CPU / blocking libraries |

Do not confuse them: a coroutine does not protect you from shared mutable state; a safe interp does not add multi-core speed; a thread does not make `vwait` unnecessary inside each interp.

### 2. Coroutines — functions you can pause

```tcl
proc counter {n} {
    for {set i 0} {$i < $n} {incr i} {
        yield $i
    }
}
coroutine c1 counter 3
puts [c1]   ;# 0
puts [c1]   ;# 1
puts [c1]   ;# 2
```

- **`coroutine name cmd ?args?`** — creates a coroutine command `name` that runs `cmd`
- **`yield ?value?`** — suspends; value becomes the result of the coroutine invocation
- Resuming calls the coroutine command again; optional arguments can be received via `yield`’s return value
- **`yieldto`** — advanced transfer of control to another command/coroutine

Coroutines shine when paired with the event loop (ch **11**): wait for readability without nesting `vwait`.

Sketch:

```tcl
proc readLine {ch} {
    while 1 {
        set n [gets $ch line]
        if {$n >= 0} { return $line }
        if {[chan eof $ch]} { return -code error "eof" }
        # wait until readable, then resume this coroutine
        fileevent $ch readable [list [info coroutine]]
        yield
        fileevent $ch readable {}
    }
}
```

Exact production helpers vary by team; the idea is: **yield instead of nested vwait**.

### 3. Child interpreters — `interp`

Each interpreter has its own commands, variables, and packages (largely). The primary interp can create children:

```tcl
set i [interp create worker]
interp eval $i {expr {2 + 2}}   ;# 4
interp delete $i
```

Useful subcommands (literacy set):

| Subcommand | Role |
|------------|------|
| `create` / `delete` | Lifecycle |
| `eval` | Run script in child |
| `alias` | Expose parent commands selectively to child |
| `share` / `transfer` | Move channels between interps |
| `invokehidden` / `hide` / `expose` | Command visibility |
| `limit` | Resource limits (time, depth, …) where supported |
| `bgerror` | Per-interp background error handler |

Child interps are how embedding hosts and plugin architectures quarantine script state.

### 4. Safe interpreters (door)

`interp create -safe` builds an interpreter with dangerous commands removed or hidden (`open`, `exec`, `socket`, `source` of arbitrary paths, etc., per the safe set documented for your version).

```tcl
set s [interp create -safe]
# Grant only what policy allows:
interp alias $s hostLog {} safeLogProxy
```

Safe interps are a **door**, not a complete product security story:

- You must design aliases carefully (confused deputy risk).
- Resource limits matter (CPU loops, memory).
- Binary `load` and some extensions can blow holes—policy must forbid them.
- Safe is for **trusted parent + untrusted script**, not for hostile OS peers.

Full policy design pairs with ch **16**.

### 5. Thread package (door)

The **Thread** extension provides OS threads, each typically with its own Tcl interpreter:

```tcl
package require Thread
set tid [thread::create]
thread::send $tid {expr {1+1}}
```

Mental model:

- No sharing of arbitrary Tcl objects across threads without APIs designed for it
- Prefer message passing (`thread::send`, thread-safe queues) over inventing shared globals
- Channels and Tk have historically strict thread-affinity rules—read current Thread/Tk docs before moving GUIs or sockets across threads

This handbook stops at the door: enough to recognize Thread code in the wild and know isolation boundaries. Deep pool design belongs to the Thread man pages and your platform constraints.

---

## 2. Advanced concepts

### 1. Coroutine + event loop pitfalls

- Leaving `fileevent` pointed at a dead coroutine causes errors—clear handlers on exit/error.
- `catch`/`try` inside coroutines must not accidentally swallow the resume protocol.
- Destroying a coroutine while a channel still references it needs an ordered shutdown.
- Recursion depth and `interp limit` interact with coroutine stacks—test large workloads.

### 2. `yieldto` and structured concurrency

`yieldto` enables trampoline-style control transfer. Use sparingly; most application code should stick to `yield` + event registration. If two coroutines resume each other carelessly, you can livelock without an OS scheduler saving you.

### 3. Aliases and the confused deputy

An alias that takes a child-supplied path and calls parent `open` is a classic escape. Patterns that hold up better:

- Parent maps **capability IDs** to resources; child never sees raw paths
- Allowlists of host commands with typed arguments
- No string `eval` of child data in the parent

### 4. Sharing channels across interps

`interp share` / `transfer` move channel ownership. After transfer, the sender must not use the channel. Bugs here look like “random EBADF” under load. Document ownership in protocol state machines.

### 5. Threads vs event loop — choose deliberately

| Need | Prefer |
|------|--------|
| Many idle sockets | Event loop (+ coroutines) |
| One blocking vendor library | Thread or subprocess |
| Parallel CPU on large batch | Threads or multiple processes |
| Untrusted plugin script | Safe child interp |
| Tk UI + background work | Event loop first; Thread only with documented Tk rules |

Premature Thread use complicates debugging; premature safe-interp without aliases makes plugins useless; premature coroutines without framing leave partial-read bugs unchanged.

### 6. Error propagation

- Coroutine errors surface when the coroutine is resumed/called—decide who `catch`es.
- `interp eval` returns errors to the caller; pair with `try`.
- `thread::send` can be synchronous or async; know which you used when diagnosing timeouts.
- `bgerror` is per-interp—set it in workers, not only in main.

### 7. Version and build literacy

Coroutines: core since 8.6; available on 9. Thread: extension—may be absent in minimal embeds. Safe interp command sets evolve—re-read the man page when migrating 8.6 → 9 (ch **02**). C extensions that store `Tcl_Interp*` must respect thread affinity (ch **14**).

### 8. Coroutine lifecycle details

- A coroutine that returns normally (or errors out of its root command) **deletes** its command.
- `rename coro {}` deletes a suspended coroutine; variable traces inside may fire—keep teardown boring.
- `info coroutine` returns the current coroutine’s name (empty string when not inside one)—use it when registering `fileevent` so the resume target is explicit.
- Coroutines start with resolution rules documented in the man page: the started command runs with global namespace as current, and no caller frames above it for `upvar`/`uplevel` in the sense those commands expect—write coroutine bodies accordingly (pass state explicitly; do not assume caller locals).

### 9. `coroprobe` / `coroinject` (advanced door)

Tcl provides introspection/injection into **suspended** coroutines (`coroprobe`, `coroinject`). Useful for debuggers and sophisticated schedulers; easy to abuse as hidden control flow. Application code should rarely need them—prefer clean yield protocols. If you inject, document that the injection runs on resume and can rewrite the value seen by `yield`.

### 10. Child interp package independence

A fresh interp does not automatically see every `package require` from the parent. Parents either:

- `interp eval $i {package require …}` after adjusting the child’s `auto_path`, or
- expose a narrow parent alias that performs host operations.

For plugins, loading packages **inside** the child keeps their commands out of the parent namespace—usually what you want.

### 11. Thread messaging discipline

When Thread is present:

- Treat `thread::send` sync forms as remote procedure calls with timeout discipline.
- Keep payloads Tcl-literal friendly (lists/dicts of strings); do not pretend arbitrary pointers travel.
- One owner for each socket/channel; do not “just” use the same channel from two threads.
- Shut down workers explicitly on process exit so joins do not race destructors.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Coroutine-per-connection servers; plugin interps for user scripts |
| **Systems** | Partition control plane (main) vs worker interps; thread offload for compression/crypto libs |
| **Security** | Safe interps for untrusted automation snippets; no raw filesystem aliases |
| **Operations** | Device fan-out with cooperative coroutines; isolate flaky vendor Tcl in a child interp |
| **Software engineering** | Test harness spins child interps for clean state; Thread pools in heavy batch tools |

Expect (ch **15**) historically interacts with the event loop; combining Expect, coroutines, and custom `vwait` needs explicit design—do not stack them accidentally.

---

## Staff-level review checklist

- Coroutines: lifecycle clear (create/resume/finalize); `fileevent` handlers cleared; errors handled at resume points.
- No nested `vwait` maze where a coroutine would clarify control flow.
- Child interps: aliases are capabilities, not thin wrappers around dangerous parent commands with child-controlled args.
- Safe interps: documented allowlist; `load`/filesystem/`exec` policy explicit.
- Channels have a single owning interp at a time after share/transfer.
- Thread use justified; messaging API used; no assumed shared Tcl vars across threads.
- `bgerror` / error paths defined for workers and children.
- Build ships the Thread package only if code `package require`s it—CI verifies presence/absence.

---

## References

- [coroutine](https://www.tcl-lang.org/man/tcl9.0/TclCmd/coroutine.html)
- [yield](https://www.tcl-lang.org/man/tcl9.0/TclCmd/yield.html)
- [yieldto](https://www.tcl-lang.org/man/tcl9.0/TclCmd/yieldto.html)
- [interp](https://www.tcl-lang.org/man/tcl9.0/TclCmd/interp.html)
- [Thread package (ThreadCmd)](https://www.tcl-lang.org/man/tcl9.0/ThreadCmd/thread.html)
- [after](https://www.tcl-lang.org/man/tcl9.0/TclCmd/after.html)
- [fileevent](https://www.tcl-lang.org/man/tcl9.0/TclCmd/fileevent.html)
- [Tcl 9.0 command index](https://www.tcl-lang.org/man/tcl9.0/TclCmd/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
