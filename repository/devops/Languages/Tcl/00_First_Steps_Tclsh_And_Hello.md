# First steps: tclsh and hello

[← Back to Tcl](./README.md)

## What this chapter covers

Your first **honest contact** with Tcl on a real machine—especially **Linux**. By the end you should be able to:

1. Find which **`tclsh`** binary will run.
2. Print **`info patchlevel`** (the ground-truth version).
3. Run **hello** three ways: REPL, here-doc, script file.
4. See Tcl as a **Linux process** (PID, executable, stdout)—not a black box.
5. Tell **`tclsh`** apart from **`wish`**.
6. Read script arguments via **`argv0` / `argc` / `argv`** (and see how a Linux shebang fills them).

If you do not yet know **what Tcl is for**, read chapter **01** first (history, habitats, Linux architecture, command lifecycle), then come back here and *touch* the runtime.

Handbook default for new work: **Tcl 9.0.x**. Many servers still ship **8.6**—discover; do not assume.

Today’s picture: *one process + one interpreter + something that prints*. Fuzzy PATH here makes every later chapter feel cursed.

---

## 1. Concepts

### 1. What you are about to start

On Linux, starting Tcl means starting a **normal userspace program**. That program:

- loads the **Tcl library** (`libtcl`),
- creates an **interpreter** in memory,
- registers built-in **commands**,
- connects **channels** to stdin/stdout/stderr (file descriptors 0/1/2),
- then either talks to you (REPL) or reads a script.

Chapter **01** explains that architecture in depth. This chapter makes it *tangible*.

| Binary | Role |
|--------|------|
| **`tclsh`** | Command-line Tcl — scripts, REPL, ops glue |
| **`wish`** | Tcl + **Tk** — GUI scripts |

Same language. Different default world. Most labs use **`tclsh`**. Tk is chapter **13**.

### 2. Install sources (where `tclsh` comes from)

You typically get Tcl from:

| Source | What to expect |
|--------|----------------|
| Distro packages (`tcl`, sometimes `tcl-dev` / `tcl8.6`) | Often **8.6.x** on older LTS images |
| Official / vendor builds | May be **9.0.x** |
| Appliance / product image | Whatever the vendor froze—pin it |
| Source build | You chose the prefix; PATH may not see it |

```bash
# Debian/Ubuntu-style example (package names vary)
# sudo apt-get update && sudo apt-get install -y tcl
```

After install, **do not trust the package name alone**—ask the binary.

### 3. Discover what you actually have

```bash
command -v tclsh
type -a tclsh
ls -l "$(command -v tclsh)"
tclsh <<'EOF'
puts "patchlevel=[info patchlevel]"
puts "executable=[info nameofexecutable]"
puts "pid=[pid]"
puts "hostname=[info hostname]"
EOF
```

| Habit | Why |
|-------|-----|
| `command -v tclsh` | Is anything on PATH? |
| `type -a tclsh` | *Every* candidate—ghosts matter |
| `ls -l $(command -v tclsh)` | Symlink? wrapper? |
| `info patchlevel` | Exact version string |
| `info nameofexecutable` | Real binary path the runtime sees |
| `pid` | Reminder: this is an OS process |

If `command -v tclsh` is empty, fix install/PATH before debating language semantics.

Compare every candidate when PATH is messy:

```bash
type -a tclsh | while read -r _ _ path; do
  echo "== $path =="
  "$path" <<< 'puts [info patchlevel]'
done
```

Optional Tk smoke check (may open a window—exit promptly):

```bash
command -v wish
wish <<'EOF'
puts [info patchlevel]
exit
EOF
```

### 4. Hello — interactive REPL

```bash
tclsh
```

At the prompt (often `%`):

```tcl
puts "Hello, Tcl"
# → Hello, Tcl

info patchlevel
# e.g. 9.0.4 — write this in your notes

# See that stdout is a real channel
puts stdout "still hello"

exit
# Control-D also works on most Unix builds
```

**What just happened (Linux + Tcl together)**

1. Your shell `exec`’d the `tclsh` binary → new **PID**.
2. Tcl created an interpreter and bound `stdout` to **FD 1**.
3. `puts` wrote bytes to that channel → your terminal showed text.
4. `exit` ended the process; the kernel reclaimed memory and FDs.

Useful for smoke checks. **Not** how you ship automation.

### 5. Hello — one-liner and here-doc

Non-interactive forms for CI and onboarding:

```bash
tclsh <<< 'puts "Hello, Tcl"'
```

```bash
tclsh <<'EOF'
puts "Hello, Tcl"
puts "patchlevel=[info patchlevel]"
puts "pid=[pid]"
EOF
echo "shell sees tclsh exit status: $?"
```

Prefer `<<'EOF'` (quoted) so the **shell** does not expand `$` before Tcl sees the script.

### 6. Hello — script file and shebang

Save as `hello.tcl`:

```tcl
#!/usr/bin/env tclsh
# hello.tcl — run: tclsh hello.tcl   or   ./hello.tcl after chmod +x
puts "Hello, Tcl"
puts "Running [info nameofexecutable] at [info patchlevel]"
puts "My PID is [pid]"
```

```bash
tclsh hello.tcl
chmod +x hello.tcl
./hello.tcl
```

| Piece | Meaning on Linux |
|-------|------------------|
| `#!/usr/bin/env tclsh` | Kernel shebang → `env` finds `tclsh` on PATH |
| Hard-coded `/usr/bin/tclsh` | Fine when the platform guarantees that path |
| `chmod +x` | File mode bit; without it `./hello.tcl` fails |
| `tclsh hello.tcl` | Always works even without execute bit |

On Windows, prefer `tclsh hello.tcl` (or installer file association) over Unix shebang folklore.

### 7. Script entrypoints: `argv0`, `argc`, `argv`

When `tclsh` runs a script, the interpreter fills a few **special variables** (documented under **tclvars**) so your program can see *how it was started* and *what arguments followed*. Treat them like a tiny, portable `main(argc, argv)` for Tcl.

| Variable | Meaning |
|----------|---------|
| **`argv0`** | Name used to invoke the script (often the script path; sometimes a symlink name) |
| **`argc`** | Count of arguments in `argv` (integer string) |
| **`argv`** | Proper **list** of arguments after the script name |

They are set for **script** and many non-interactive starts. In a bare interactive REPL you may see empty/`0`—that is normal.

#### Linux picture: how `./script.tcl a b` becomes `argv`

```text
You type:  ./script.tcl a b
           │            └───┬───┘
           │                arguments for the script
           └── script path (shebang target)

Kernel (shebang):
  execve("/usr/bin/env", ["env", "tclsh", "./script.tcl", "a", "b"], …)
  env finds tclsh → execve(tclsh, ["tclsh", "./script.tcl", "a", "b"], …)

tclsh then:
  opens/reads ./script.tcl
  sets argv0  ≈  "./script.tcl"   (invocation name of the script)
  sets argv   =  [list a b]
  sets argc   =  2
  evaluates the script body
```

Same argv when you skip the shebang and call the interpreter yourself:

```bash
tclsh ./script.tcl a b
# argv0 ≈ ./script.tcl ; argv = a b ; argc = 2
```

Interactive smoke check of the same idea without a file:

```bash
tclsh <<'EOF'
puts "argv0=$argv0"
puts "argc=$argc"
puts "argv=$argv"
EOF
```

(Here-doc runs often show an empty or synthetic `argv0` and `argc` 0—use a real script file for the full picture.)

#### Small lab — `args_demo.tcl`

```tcl
#!/usr/bin/env tclsh
# args_demo.tcl — run:  tclsh args_demo.tcl one "two words" three
#                or:  chmod +x args_demo.tcl && ./args_demo.tcl one "two words" three

puts "I am: $argv0"
puts "argc: $argc"
puts "argv as list: $argv"
puts "first arg: [lindex $argv 0]"
puts "all args joined: [join $argv { | }]"
```

```bash
chmod +x args_demo.tcl
./args_demo.tcl one "two words" three
tclsh args_demo.tcl one "two words" three
```

Expected shape (paths may differ):

```text
I am: ./args_demo.tcl          # or args_demo.tcl / absolute path
argc: 3
argv as list: one {two words} three
first arg: one
all args joined: one | two words | three
```

| Habit | Why |
|-------|-----|
| Treat `argv` as a **list** | Spaces inside one shell-quoted arg stay one element |
| Prefer `lindex` / `lassign` / `foreach` | Do not re-`split` `argv` on spaces |
| Log `$argv0` + `$argv` at start of CLI tools | Reproduces the exact invocation in incident tickets |
| Validate `argc` before `lindex` | Missing args → clear `return -code error`, not empty surprises |

Deep list/`{*}` discipline is chapter **06**; richer CLI packaging comes later. For day one: **know these three names and that `argv` is already a list.**

### 8. Optional: watch Tcl touch the OS once

Once per onboarding is enough—connects chapter **01**’s architecture talk to reality:

```bash
strace -e trace=write,openat,execve -f tclsh hello.tcl 2>&1 | head -n 50
```

You should see an `execve` of `tclsh` (from your shell), then `openat` of the script, then `write` calls as `puts` runs. Exact output varies; the lesson is: **Tcl is userspace I/O and processes**, not a sealed applet.

### 9. `tclsh` vs `wish` (glance)

| Question | `tclsh` | `wish` |
|----------|---------|--------|
| Primary job | Scripts, REPL, glue | Tk GUI scripts |
| Tk by default? | No | Yes |
| Typical shebang | `#!/usr/bin/env tclsh` | `#!/usr/bin/env wish` |
| Headless CI | Natural | Needs display / xvfb / etc. |

When a ticket says “the Tcl script,” ask: **automation** or **GUI**? Failure modes diverge (PATH vs display).

### 10. Minimal language picture (bridge to later chapters)

A Tcl script is a sequence of **commands**. Each command is **words**. After **substitution**, the first word is the command name. Values are strings (**EIAS**). Deep dive: chapters **01** (lifecycle) and **03** (twelve rules).

```tcl
set name World
puts "Hello, $name"
# set stores a string; $name substitutes; puts writes one word to stdout
```

---

## 2. Advanced concepts

### 1. Multiple installs and PATH discipline

Ops hosts often carry:

- distro `tclsh` (**8.6.x** common),
- side-installed **9.0.x** under `/usr/local` or a vendor prefix,
- an appliance binary **not** on your interactive PATH.

Record `command -v` + patchlevel per environment. Print patchlevel at CI job start.

### 2. Shared library mismatch (rare but ugly)

`tclsh` dynamically links `libtcl`. If someone copies only the binary across machines without matching libraries, you get loader errors (`libtcl.so.8` / `.9` missing). Fix packaging—not your script logic.

```bash
# Linux: see what the binary links
ldd "$(command -v tclsh)" | head
```

### 3. Script encoding (Tcl 9 default)

In **Tcl 9**, scripts from `tclsh` / `source` (no `-encoding`) default to **UTF-8**. Save labs as UTF-8. Legacy files need explicit encoding—chapter **02**.

```tcl
# Legacy (Tcl 8.6) — system encoding was a common default for source/tclsh
# source myscript.tcl
#
# Tcl 9 — prefer UTF-8; override only for known legacy files:
# source -encoding cp1252 myscript.tcl
```

### 4. Exit status

`tclsh` exits **0** on success. Uncaught errors usually yield non-zero—exact codes depend on the error path. Enough for CI smoke tests; richer handling is chapter **09**.

### 5. What “hello works” does *not* prove

| Hello proves | Hello does **not** prove |
|--------------|---------------------------|
| This binary runs | `auto_path` / packages match production |
| Patchlevel is X | Expect is installed |
| stdout works | Encoding profiles for binary protocols |
| | C extension ABI matches the major version |

First gate only—then deepen.

### 6. Cron / systemd gotchas (preview)

Jobs fail when:

- `PATH` is minimal and `tclsh` is missing,
- shebang points at a binary that does not exist in that image,
- working directory assumptions differ from your laptop.

Always use absolute paths or a known `PATH` export in unit files—and still log `info patchlevel`.

---

## 3. Applications and use cases

| Angle | How first steps show up |
|-------|-------------------------|
| **Application** | Embedded products expose a console; patchlevel is the support baseline. |
| **Systems** | Cron/systemd/containers must name a real ELF + matching `libtcl`. |
| **Security** | Interactive `tclsh` on a bastion is a powerful REPL—treat like a shell. |
| **Ops** | Expect hosts start with “which Tcl is on this box?” |
| **SE** | Onboarding without patchlevel wastes days on 8.6 vs 9 drift. |

**Whole-engineering picture:** hello is the reproducibility gate. Encoding, lists, and Expect reviews all assume you can name the interpreter that will run the change.

---

## Staff-level review checklist

- [ ] Runbook states **full `info patchlevel`** (and binary path) per host class.
- [ ] CI prints patchlevel before sourcing project scripts.
- [ ] New scripts use `#!/usr/bin/env tclsh` (or documented absolute path) and **UTF-8**.
- [ ] Tk scripts use `wish` (or load Tk explicitly)—not accidental GUI in headless jobs.
- [ ] Onboarding shows `command -v` / `type -a` / optional `ldd`.
- [ ] Brownfield **8.6** hosts are labeled—not tested only on a laptop’s Tcl 9.
- [ ] Newcomers have read chapter **01**’s Linux + command-lifecycle picture.
- [ ] CLI scripts document how they read **`argv0` / `argc` / `argv`** (and treat `argv` as a list).
- [ ] Onboarding lab runs a script with multi-word args (`"two words"`) so newcomers see list quoting in `argv`.

---

## References

- [tclsh](https://www.tcl-lang.org/man/tcl9.0/UserCmd/tclsh.html)
- [wish](https://www.tcl-lang.org/man/tcl9.0/UserCmd/wish.html)
- [info](https://www.tcl-lang.org/man/tcl9.0/TclCmd/info.html)
- [puts](https://www.tcl-lang.org/man/tcl9.0/TclCmd/puts.html)
- [pid](https://www.tcl-lang.org/man/tcl9.0/TclCmd/pid.html)
- [source](https://www.tcl-lang.org/man/tcl9.0/TclCmd/source.html)
- [tclvars](https://www.tcl-lang.org/man/tcl9.0/TclCmd/tclvars.html) — `argv0`, `argc`, `argv`, and related interpreter variables
- [Tcl — language summary](https://www.tcl-lang.org/man/tcl9.0/TclCmd/Tcl.html)
- [Tcl software / downloads](https://www.tcl-lang.org/software/tcltk/)
- [Tcl/Tk documentation hub](https://www.tcl-lang.org/doc/)
- [Tcl 9.0 / Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
