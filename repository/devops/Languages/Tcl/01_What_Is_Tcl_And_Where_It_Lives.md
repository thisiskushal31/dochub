# What Tcl is and where it lives

[← Back to Tcl](./README.md)

## What this chapter covers

If you are **new to Tcl**, start here—even before you memorize syntax. This chapter answers the questions that make every later lab click:

1. **What** Tcl is (in plain language).
2. **What you can do** with it—and what you usually should *not* expect it to be.
3. **Where** it runs (Linux, other OSes, inside other programs).
4. **Where it came from** and **when** it entered the world (a short, accurate history).
5. **How it works on Linux**—process, libraries, files, file descriptors—not magic.
6. **What happens when each command runs**—the real evaluation loop, step by step.
7. **How common Tcl verbs map to Linux syscalls**—so “hung” and “leaks FDs” become diagnosable.

Chapter **00** is the hands-on smoke check (`tclsh`, hello, patchlevel). This chapter is the **map of the territory**. After this, chapter **02** pins versions; chapter **03** drills quoting and substitution until they are muscle memory.

Handbook default for *new* scripts: **Tcl 9.0.x**. Much of the industrial world still runs **8.6**—you will see why that matters.

---

## 1. Concepts

### 1. What Tcl is (plain language)

**Tcl** stands for **Tool Command Language**. Pronounce it “tickle.”

Think of it as a **small scripting language whose job is to drive tools**—your own C/C++ programs, other Unix processes, network device CLIs, test harnesses, and (with **Tk**) simple GUIs. It was built to be:

- **easy to embed** inside a larger application,
- **easy to extend** with new commands,
- **easy to read** as a sequence of plain commands, not as a huge typed application framework.

A Tcl program is not “classes and types first.” It is:

> a text script → broken into **commands** → each command broken into **words** → words get **substituted** → the **first word** names what to run → that command looks at the remaining words and does work.

At the language level, **everything is a string** (often abbreviated **EIAS**). The number `42`, the path `/tmp/a`, and the script body of an `if` are all strings until a command decides “treat this as an integer,” “treat this as a path,” or “treat this as code to run.”

```tcl
puts "Hello"
set x 41
incr x
puts $x
# Prints Hello, then 42
```

You do not need the full syntax rulebook yet. Hold this picture: **Tcl is a command engine glued to strings**, designed to sit next to real systems software.

### 2. What you can do with Tcl

Concrete jobs Tcl is good at:

| You can… | Typical shape |
|----------|----------------|
| **Glue programs together** | `exec`, pipes, files, sockets |
| **Automate interactive programs** | **Expect**: `spawn` / `expect` / `send` (SSH, serial, installers, vendor CLIs) |
| **Script inside a large product** | Host app embeds a Tcl interpreter; your script calls host-specific commands |
| **Write regression / conformance tests** | Tcl + Expect DNA (e.g. **DejaGnu**-style worlds) |
| **Build small desktop tools** | **Tk** widgets on the same runtime (`wish`) |
| **Configure and extend tools** | Ship `.tcl` policy files the product `source`s at runtime |
| **Talk over the network** | sockets, HTTP helpers, event-driven I/O |

What Tcl is *usually not* hired to do today:

| Not the usual Tcl job | Better mental model |
|-----------------------|---------------------|
| Greenfield web backends / mobile apps | Other ecosystems dominate; Tcl can do sockets, but that is not why most teams keep it |
| Replacing your company’s primary application language | Tcl is often the **control plane** next to a C/C++/hardware **data plane** |
| Fashionable general-purpose scripting on a blank laptop | You learn Tcl because **something you operate already speaks it** |

Staff reality: you rarely “choose Tcl for a new startup.” You inherit a **critical path** that already runs Tcl—and you need to **read, fix, review, and migrate** it without breaking production.

### 3. Where it works (platforms and habitats)

**Operating systems.** Tcl runs on **Linux**, other Unix-like systems, **macOS**, and **Windows**. The handbook’s systems picture uses **Linux** because that is where ops, CI, and appliances most often meet Tcl—but the language ideas are the same elsewhere.

**Two ways it “lives” on a machine:**

1. **Standalone** — you run a binary named `tclsh` (or `wish` for Tk). Your script is a `.tcl` file or a here-doc. This feels like Python/`perl`/`bash`: one process, your script, done.
2. **Embedded** — a larger program (EDA tool, network OS feature, lab controller, appliance) **links against the Tcl library**, creates an interpreter in-process, and evaluates your script *inside that product*. There may be no `tclsh` on PATH that can reproduce the same commands—the host registered private commands only it understands.

**Habitats you will actually see:**

| Habitat | What “Tcl” means there |
|---------|-------------------------|
| Linux jump hosts / bastions | `tclsh` + often **Expect** for interactive gear |
| CI containers | Packaged `tcl` / `tclsh`; version often **8.6** on older images |
| Network / telecom gear & NMS | On-box or off-box scripts; frequently brownfield |
| EDA / semiconductor / lab | Tool-specific Tcl APIs; long-lived script trees |
| Product support consoles | Embedded REPL; field engineers `source` scripts |
| Desktop internal tools | `wish` + Tk |
| Test frameworks | Expect-based suites (DejaGnu and cousins) |

**Rule of thumb:** before debugging “Tcl,” ask *standalone or embedded?* and *which patchlevel?* Wrong answer wastes days.

### 4. Where it came from — a short history

Tcl has a clear origin story. Knowing it explains *why* the language looks the way it does.

| When | What happened |
|------|----------------|
| **Fall 1987** | **John Ousterhout** (then at UC Berkeley; idea formed while on sabbatical at DEC’s Western Research Lab) starts shaping an **embeddable command language** for tools—so each tool would not invent its own ad-hoc command language. |
| **Spring–summer 1988** | First implementation; used inside internal Berkeley applications (editors / tooling). No Tk yet. |
| **1989** | Early external copies; language designed to be **library + interpreter**, not a closed product. |
| **Jan 1990** | USENIX talk; interest spikes; source spreads via FTP. **Don Libes** (NIST) builds **Expect** on Tcl in weeks—first *widely* loved Tcl application for sysadmins. |
| **1990–1991** | **Tk** (toolkit) becomes usable; first Internet release of Tk around early **1991**. Same runtime DNA for GUIs. |
| **1990s growth** | Expect + Tk pull huge audiences; Tcl becomes the “glue + GUI + embed” language of many Unix shops. |
| **Mid–late 1990s** | Industry stewardship evolves (Sun, then Scriptics / later community core). **Tcl 8.0** era brings a **bytecode** compiler—scripts still look interpreted, but hot paths compile to bytecodes inside the process. |
| **Tcl 8.1+** | Stronger **Unicode**, threads safety work, modern regex era—internationalization and server-ish use. |
| **Long 8.6 era** | **Tcl 8.6** becomes the “default on Linux distros and appliances” line for many years. |
| **Sep 2024** | **Tcl 9.0** ships as the modern major line (UTF-8 defaults, encoding profiles, Unicode model cleanup, and more). Handbook default for *new* work. |

**Why history matters to you as a beginner:**

- Tcl was born to be **embedded in tools**, not to win “general language of the year.”
- **Expect** is why ops people still meet Tcl on Linux boxes.
- **Tk** is why GUIs and the **event loop** share DNA with network scripts.
- **8.6 vs 9** is not trivia—it is the version split you will hit on real hosts (chapter **02**).

### 5. The Linux architecture picture (how Tcl sits on the OS)

On Linux, Tcl is not a kernel feature. It is an ordinary **userspace program** (and/or **shared library**) that uses the same OS facilities as everyone else: processes, virtual memory, files, and file descriptors.

#### 5.1 Pieces on disk

A typical Linux install looks conceptually like this (paths vary by distro):

```text
/usr/bin/tclsh          → executable (the “shell” front end)
/usr/lib/.../libtcl*.so → shared library (the real engine)
/usr/share/tcl*/...     → script libraries, packages, encodings
man pages / docs        → optional, from -doc packages
```

| Piece | Role |
|-------|------|
| **`tclsh`** | Small program: create interpreter, read script or REPL, exit |
| **`libtcl`** | Parser, substitution, command table, channels, bytecode, packages |
| **Library scripts** | `init.tcl` and friends; package indices; encodings |
| **`wish`** | Like `tclsh`, but also initializes **Tk** (GUI) |

When a **product embeds Tcl**, it often links `libtcl` directly. Your field script still speaks Tcl; the “main” binary is the product, not `tclsh`.

#### 5.2 What happens when you type `tclsh script.tcl`

Linux view, simplified:

```text
1. Shell resolves `tclsh` via PATH → execve() that ELF binary
2. Kernel creates a process (PID), maps the binary + libtcl into memory
3. tclsh starts:
   - creates a Tcl interpreter object in heap memory
   - registers built-in commands (puts, set, expr, open, exec, …)
   - opens standard channels tied to FDs 0/1/2 (stdin/stdout/stderr)
   - reads script.tcl (or -c / stdin)
4. For each command in the script: parse → substitute → dispatch (section 6)
5. Process exits; kernel reclaims memory and closes FDs
```

```bash
# See the process and its interpreter binary
command -v tclsh
tclsh <<'EOF'
puts "pid=[pid]"
puts "exe=[info nameofexecutable]"
puts "patchlevel=[info patchlevel]"
EOF
```

#### 5.3 Channels ≈ file descriptors (with a Tcl wrapper)

When Tcl `open`s a file or talks to a socket, under the hood Linux gives the process a **file descriptor**. Tcl wraps that as a **channel** (`file4`, `sock6`, `stdin`, …) so scripts use `gets` / `puts` / `chan configure` instead of raw `read()` calls.

| Tcl idea | Linux idea |
|----------|------------|
| `stdin` / `stdout` / `stderr` | FDs 0 / 1 / 2 |
| `open file r` | `open()` → new FD → Tcl channel |
| `socket …` | network FD → channel |
| `exec` / pipelines | `fork` + `execve` child processes; pipes between them |
| Expect `spawn` | pty + child process (interactive control) |

This is why Tcl feels “system-oriented”: its everyday verbs map onto **OS I/O and processes**, not onto a sealed VM with no escape hatches.

#### 5.4 What resources a running Tcl “takes up”

Nothing exotic—just be honest about the bill:

| Resource | What Tcl uses |
|----------|----------------|
| **CPU** | Interpreter loop + bytecode; plus any child processes you `exec`/`spawn` |
| **RAM** | Interpreter state: variables, procedures, package code, channel buffers |
| **FDs** | Every open file/socket/pipe; leaking channels eventually hits `ulimit -n` |
| **Child processes** | `exec` and Expect leave OS processes you must wait/reap/timeout |
| **Time** | Event loop (`after`, `fileevent`, `vwait`) schedules work without busy-spinning |

A “hung” Tcl automation is often **not** a language mystery: it is a child waiting on a prompt, a blocking `gets`, or a `vwait` that never sees its variable change.

#### 5.5 How this differs from the Unix shell

| | Bash / POSIX shell | Tcl |
|--|--------------------|-----|
| Primary metaphor | Start programs, connect pipes | Evaluate commands inside one (embeddable) interpreter |
| Structured data | Mostly strings; arrays vary | Lists / dicts with real commands |
| In-process embed | Unusual | Designed for it (`libtcl` in your app) |
| GUI | External programs | Tk shares the same event-loop DNA |

Tcl can *call* the shell (`exec sh -c …`)—that is a sharp tool, not the default mental model. Prefer Tcl’s own list-safe `exec` forms when you control the argv (chapter **08**).

#### 5.6 Command → Linux syscall map (beginner table)

You do not need to memorize every syscall. You *do* need a lucid map: **everyday Tcl verbs are thin wrappers over ordinary Linux I/O and process calls**. When a script “hangs” or “leaks files,” this table tells you which OS resource to look at.

| Tcl (or Expect) verb | What you intend | Typical Linux syscalls / objects | Beginner note |
|----------------------|-----------------|----------------------------------|---------------|
| **`puts`** (stdout/stderr or a channel) | Write text | **`write`** (often after stdio buffering) on an FD | Terminal/CI log noise is usually `write` on FD 1/2 |
| **`gets`** / **`read`** | Read a line or bytes | **`read`** on an FD | Blocking `gets` waits for data or EOF—classic “hung script” |
| **`open`** path | Open a file | **`open`** / **`openat`** → new FD → Tcl **channel** | Always `close` (or use patterns that close) to avoid FD exhaustion |
| **`close`** | Release a channel | **`close`** on the FD | Pipes/`exec` redirections also hold FDs |
| **`cd`** | Change directory | **`chdir`** | Process-wide: affects later relative paths and child cwd |
| **`pwd`** | Print working directory | **`getcwd`** (conceptually) | Handy in cron/systemd debugging |
| **`file`** (`exists`, `size`, `mtime`, …) | Inspect path metadata | **`stat`** / **`lstat`** / **`fstat`** | Metadata only—does not open file contents |
| **`glob`** | Expand patterns to paths | **`opendir`** / **`readdir`** (+ `stat` as needed) | Tcl 9: no match → empty list (handle `llength == 0`) |
| **`exec`** | Run another program | **`fork`** + **`execve`** + **`wait`**/`waitpid` (plus **pipes** if redirected) | Child is a real OS process; timeouts and exit status matter |
| **`socket`** / **`chan`** network forms | Talk on the network | **`socket`**, **`connect`** / **`bind`**+**`listen`**+**`accept`**, then `read`/`write` | Still an FD wrapped as a channel |
| **Expect `spawn`** | Drive an interactive program | Allocate a **pty** (pseudo-terminal), **`fork`/`execve`** the child, talk over the pty master | Why Expect can answer password prompts—kernel pty, not magic |

```text
Your Tcl script
    │
    ├─ puts / gets / open  ──►  channels  ──►  file descriptors  ──►  write/read/write
    ├─ cd / file / glob    ──►  path ops  ──►  chdir / stat / readdir
    ├─ exec                ──►  child process  ──►  fork + execve + wait
    └─ Expect spawn        ──►  pty + child   ──►  interactive dialogue
```

**How to use this as a beginner**

1. Name the Tcl command that misbehaves.
2. Find its row—ask “file, process, or network?”
3. Debug with the matching Linux lens (`lsof`/`ls -l /proc/PID/fd`, `ps`, `strace -e …`) instead of only re-reading the Tcl.

Optional once-per-onboarding check (same spirit as chapter **00**):

```bash
strace -e trace=openat,read,write,chdir,execve,clone,socket,connect -f \
  tclsh your_script.tcl 2>&1 | head -n 60
```

Exact syscall names vary (`clone` vs `fork` on modern Linux); the lesson is the **mapping**, not a particular `strace` recipe.

### 6. What happens when each command runs (the evaluation loop)

This is the heart of “how Tcl works.” Every line you write goes through the same machine.

#### 6.1 One sentence

> **Parse words → substitute → look up the first word as a command → run it with the remaining words as arguments.**

#### 6.2 Walkthrough: three commands

Script:

```tcl
set name World
puts "Hello, $name"
incr x
```

Assume `x` was already set to `41` earlier (or this third line would error—that is fine for learning).

**Command 1 — `set name World`**

1. Split into words: `set` | `name` | `World`
2. No `$` / `[]` needing work here.
3. Dispatch: command **`set`** runs with args `name`, `World`.
4. Effect: interpreter stores variable `name` with value `World` (a string).
5. Result of `set` (if used) is the new value; here the result is discarded.

**Command 2 — `puts "Hello, $name"`**

1. See a quoted word starting with `"`.
2. Inside quotes, perform **variable substitution**: `$name` → `World`.
3. Words after substitution: `puts` | `Hello, World`
4. Dispatch: command **`puts`** writes that string to the `stdout` channel (FD 1) and adds a newline by default.
5. On Linux, that becomes a `write()` (or buffered write) on the process’s stdout.

**Command 3 — `incr x`**

1. Words: `incr` | `x`
2. Dispatch: **`incr`** reads variable `x`, interprets its string as an integer, adds 1, stores it back.
3. If `x` were not an integer string, `incr` raises an error—EIAS does not mean “any string is a number,” it means “the value *is* a string that commands try to interpret.”

#### 6.3 Where substitution fits (preview of chapter **03**)

Before dispatch, Tcl may transform words:

| Mechanism | Example | Meaning |
|-----------|---------|---------|
| `$var` | `puts $name` | Insert variable value |
| `[cmd …]` | `puts [expr {1+1}]` | Run nested script; insert result |
| `"…"` | `"Hello, $name"` | One word; substitutions still run |
| `{…}` | `{Hello, $name}` | One word; **mostly no** substitutions |
| `{*}…` | `exec {*}[list ls -l]` | Expand a list into multiple words |

**Most Tcl bugs are substitution bugs:** something expanded too early, too late, or into the wrong number of words. Braces exist so `if`/`while`/`proc` bodies stay *text* until the command that owns them decides to evaluate them.

#### 6.4 Commands are just names in a table

`puts`, `set`, `expr`, `open`, `exec` are not “syntax keywords” in the C sense. They are **entries in the interpreter’s command table**—some built in C inside `libtcl`, some defined later with `proc`, some registered by an embedded host, some loaded from packages.

That is why an embedded product can invent `device open` and your script calls it like any other command—and why vanilla `tclsh` on your laptop may say `invalid command name "device"`.

```tcl
# Built-in
puts hello

# You can create new commands with proc (chapter 05)
proc greet {who} {
    puts "Hello, $who"
}
greet Tcl
```

#### 6.5 Errors are part of the loop

If a command fails (bad integer, missing file, undefined variable), Tcl raises an **error** that aborts the current script level unless you catch it (`catch` / `try`—chapter **09`). On Linux, an uncaught error in `tclsh script.tcl` typically ends the process with a non-zero exit status—so CI can fail the job.

### 7. The “big picture” diagram (keep this)

```text
┌─────────────────────────────────────────────────────────┐
│  Linux process (tclsh OR product binary linking libtcl) │
│                                                         │
│   script text  ──►  parser / substituter                │
│                         │                               │
│                         ▼                               │
│                  command table                          │
│               (puts, set, exec, … host cmds)            │
│                         │                               │
│          ┌──────────────┼──────────────┐                │
│          ▼              ▼              ▼                │
│      variables      channels       child procs          │
│      & procs        (FDs)          (exec/Expect)        │
│                                                         │
│   stdout/stderr → terminal, CI log, pipe                │
└─────────────────────────────────────────────────────────┘
```

If you can point at each box and say what your ticket is touching, you are no longer “new to Tcl”—you are ready for syntax depth.

### 8. How this track uses the picture

| Your question | Go next |
|---------------|---------|
| Run hello / pin version on this box | Chapter **00** |
| 8.6 vs 9 surprises | Chapter **02** |
| Quoting / `$` / `[]` / braces deep dive | Chapter **03** |
| Files, `exec`, environment | Chapter **08** |
| Expect interactive automation | Chapter **15** |
| Embedding / C API | Chapter **14** |
| Security review of glue | Chapter **16** |

---

## 2. Advanced concepts

### 1. Interpreter object ≠ OS process

One Linux **process** can host **many Tcl interpreters** (mother interp + child interps). Embedders use that for isolation (limited command sets, separate variable spaces). Debugging “works in tclsh, fails in product” often means: **different interpreter**, **different command table**, **different `auto_path`**.

### 2. Bytecode (why “interpreted” is half-true)

Since the Tcl 8 era, the runtime may **compile** hot script bodies to **bytecode** inside the process. You still ship source (or embedded scripts); you do not produce a separate `.o` for pure Tcl the way C does. Performance intuition: tight loops care about shimmering between string/list/int representations; correctness intuition: still EIAS at the language level.

### 3. Packages and search paths are filesystem policy

`package require Foo` is not magic—it searches configured directories (`auto_path` and friends), reads `pkgIndex.tcl` files, and `source`s or `load`s implementations. On Linux, wrong install prefix or missing package package (`tcl-thread`, vendor libs, …) shows up as “can’t find package,” which is an **ops layout** problem as often as a code problem (chapter **10**).

### 4. Encoding sits between Tcl strings and OS bytes

Tcl values are Unicode-oriented strings. Files and sockets are **bytes**. `chan configure` / encoding profiles decide how those worlds meet—especially visible in **Tcl 9** (chapter **02**, **07**, **08**). Beginners who ignore encoding meet “works on my UTF-8 laptop, breaks on appliance logs” bugs.

### 5. Safe vs powerful by default

Stock `tclsh` is a **powerful** peer of a login shell: it can read files, start processes, open sockets. Embedded hosts sometimes strip commands. Never assume a script that is safe in a locked-down embed is safe to paste into an open `tclsh` on a bastion—or the reverse.

### 6. Why Expect changed ops forever

Expect did not invent SSHs or serial consoles. It made **dialogue automation** programmable in the same language as the rest of your glue. That is why “Tcl on Linux” so often means “Expect on Linux.” Learn the language first; then chapter **15**.

### 7. Syscall map literacy under load

The Concepts table (section **5.6**) is enough for day one. Under review pressure, add two refinements:

| Situation | Deeper OS reality |
|-----------|-------------------|
| Buffered `puts` “missing” from a log | Userland stdio/Tcl channel buffering—may need `flush` or line buffering before you see a `write` |
| `exec` pipelines | Extra FDs for pipes between children; failure can be in *any* stage |
| Non-blocking / `fileevent` | Still the same FDs; readiness via `poll`/`epoll` (event loop—chapter **11**) |
| Threaded builds | Same syscalls; which thread blocks is an extra debugging axis (compass chapter **18**) |

Staff question in incidents: “Which row of the map is stuck—**read**, **child wait**, or **event wait**?” That triage beats guessing at language syntax.

---

## 3. Applications and use cases

| Angle | How this chapter’s picture shows up |
|-------|-------------------------------------|
| **Application** | Product embeds `libtcl`; field scripts call domain commands; support uses a REPL. |
| **Systems** | Channels ↔ FDs; `exec` ↔ child processes; event loop ↔ non-blocking automation. |
| **Security** | Powerful interpreter + `eval`/`exec`/Expect secrets = review surface (chapter **16**). |
| **Ops** | Jump-host Expect, cron `tclsh`, appliance consoles—always pin binary + patchlevel. |
| **SE** | Shared packages, namespaces, tests; treat Tcl as production software, not scratch notes. |

**Beginner onboarding story worth repeating:** Day one, draw the Linux process box and the evaluation loop. Day two, break a script on purpose with wrong braces and watch substitution fire early. Day three, run the same script under `strace -e write,openat,execve` once—so you *see* Tcl touch the OS. After that, syntax chapters stop feeling abstract.

```bash
# Optional systems lab (once): watch Tcl talk to Linux
strace -e trace=openat,write,execve -f tclsh hello.tcl 2>&1 | head -n 40
```

---

## Staff-level review checklist

- Newcomers can explain Tcl in one minute: **embeddable command language**, **strings**, **substitute then dispatch**.
- Team can name whether a script is **standalone**, **Expect**, **embedded**, or **wish**.
- Runbooks record **binary path + `info patchlevel`** per environment.
- Reviews ask what **OS resources** a change touches (files, FDs, child processes, network)—not only “does the Tcl parse.”
- Nobody confuses “invalid command name” in laptop `tclsh` with a language bug when the command is **host-specific**.
- History literacy is enough to explain **why Expect/Tk exist** and **why 8.6 still appears**.
- Newcomers can map common verbs (`puts`, `open`/`gets`, `exec`, `socket`, `cd`, `glob`/`file`, Expect `spawn`) to **write / open+read / fork+execve / socket / chdir / stat+readdir / pty**—at least one level deep.

---

## References

- [History of Tcl](https://www.tcl-lang.org/about/history.html)
- [About Tcl/Tk](https://www.tcl-lang.org/about/)
- [Tcl — language summary (syntax & EIAS)](https://www.tcl-lang.org/man/tcl9.0/TclCmd/Tcl.html)
- [tclsh](https://www.tcl-lang.org/man/tcl9.0/UserCmd/tclsh.html)
- [wish](https://www.tcl-lang.org/man/tcl9.0/UserCmd/wish.html)
- [puts](https://www.tcl-lang.org/man/tcl9.0/TclCmd/puts.html)
- [open](https://www.tcl-lang.org/man/tcl9.0/TclCmd/open.html)
- [gets](https://www.tcl-lang.org/man/tcl9.0/TclCmd/gets.html)
- [exec](https://www.tcl-lang.org/man/tcl9.0/TclCmd/exec.html)
- [socket](https://www.tcl-lang.org/man/tcl9.0/TclCmd/socket.html)
- [cd](https://www.tcl-lang.org/man/tcl9.0/TclCmd/cd.html)
- [glob](https://www.tcl-lang.org/man/tcl9.0/TclCmd/glob.html)
- [file](https://www.tcl-lang.org/man/tcl9.0/TclCmd/file.html)
- [Tcl 9.0 / Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [Tcl/Tk documentation hub](https://www.tcl-lang.org/doc/)
- [Tcl software / downloads](https://www.tcl-lang.org/software/tcltk/)
- [Expect](https://core.tcl-lang.org/expect/)
