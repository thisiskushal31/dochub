# Processes, I/O, and security-relevant boundaries

[← Back to Perl](./README.md)

## What this chapter covers

Opening files and sockets, pipes, `system`, `exec`, `qx//`, `open` modes, taint mode (`-T`), and **`eval`** (block vs **string**). The emphasis is defensive: shell injection, safe `open` patterns, and least privilege. Operations topics include blocking I/O, timeouts, and signal handling in long-running scripts.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. `open`: two-argument vs three-argument

**Three-argument** `open` keeps mode and path separate — preferred when paths are influenced by users or configuration:

```perl
open my $fh, '<', $path or die "open: $!";
```

**Two-argument** `open FH, "$mode$path"` concatenates mode and path — dangerous if `$path` can contain shell metacharacters or `|` pipe opens.

**Pipe to external command** without a shell — list form:

```perl
open my $pipe, '-|', 'grep', '^ERROR', $logfile or die $!;
```

**`open` to a process:** **`open my $fh, '|-', $prog, @args`** passes **`$prog`** and **`@args`** without the shell—build **`@args`** from validated data and prefer this over string **`qx//`** when inputs are not fully trusted.

**`readpipe` / backticks:** **`readpipe EXPR`** is the functional form of **`` ` ``**—still **shell** on Unix when the expression is a single string; use **`open`**-list or **`IPC::Open3`** instead.

---

### 2. `system`, `exec`, and backticks

`system LIST` with multiple arguments avoids the shell. `system STRING` runs through the shell — only use when you fully control and escape the string.

```perl
system( 'mv', $src, $dst );   # preferred
system( "mv $src $dst" );    # shell injection if tainted
```

`qx//` and backticks invoke the shell on Unix — treat as high risk with untrusted data. `exec` replaces the current process; use when handing off to another binary under a supervisor.

**`IPC::Open3`:** Captures **stdout** and **stderr** separately while feeding **stdin**—use when you must **log** errors without merging streams or when the child is **chatty** on stderr. Pair with **non-blocking** **`select`** or **timeouts** (`alarm`, **`IPC::Run`**, or event loops) so a stuck child cannot hang your **worker** forever.

---

### 3. Taint mode (`-T`)

`perl -T` tracks “tainted” data from outside the program and restricts operations that affect the outside world until values are validated. Relevant for setuid wrappers and strict dataflow policies; see **perlsec** for interaction with `PERL5LIB`, `PATH`, and `%ENV`.

---

### 4. Signals and `%SIG`

Install small handlers for `TERM`, `INT`, or `PIPE` for graceful shutdown. Keep handlers minimal — set a flag and exit the main loop elsewhere — because signals can interrupt XS code and `eval` in subtle ways.

---

### 5. `eval`, string code, and sandboxes

**`eval { ... }`** (a **block**) compiles the block once and runs it with **exception** capture into **`$@`**—normal control flow when used carefully.

**`eval EXPR`** where **`EXPR`** is a **string** compiles and runs **arbitrary Perl** at **runtime**—equivalent to shipping a **`perl -e`** inside your program. **Never** feed string **`eval`** untrusted text (templates, **JSON**, **YAML**, **HTTP** bodies). This is a **primary RCE** class in Perl audits alongside **shell** metacharacters.

**`Safe`** and **`Opcode`** compartments are **legacy** defense-in-depth; they have had **escapes** over the years and are **not** a substitute for **OS-level** isolation (**containers**, **seccomp**, separate **UID**). Prefer **not** executing untrusted Perl at all.

---

## 2. Advanced concepts

**FD leaks:** After `fork`, close unused pipe ends or connections to avoid hangs and descriptor exhaustion.

**Privilege:** Drop root immediately after any work that truly requires it; prefer systemd socket activation or Linux capabilities over long-lived root Perl.

**Secrets:** Arguments and environment are visible in `ps` — pass secrets via file descriptors, memory-only APIs, or secret stores, not argv.

**Temporary files:** **`File::Temp`** avoids predictable **`/tmp`** names and handles **template** permissions—still mind **TOCTOU** if another user can write the same directory (shared **`/tmp`** on multi-tenant hosts). For **sensitive** data, use **`tempfile`** with **`UNLINK => 1`** and appropriate **`chmod`**.

**`sysopen`:** Low-level **`O_CREAT`**, **`O_EXCL`**, **`O_NOFOLLOW`** patterns appear in **hardened** file creation—use when **`open`**’s conveniences hide the flags you need (see **perlfunc** / **perlopentut**).

---

## 3. Applications and use cases

- **Setuid and legacy wrappers:** **`-T`** **taint** and **perlsec** rules still appear in **old** **wrappers**—know **`PERL5LIB`** and **`PATH`** interactions before **changing** **infra**.
- **Cron and batch jobs:** **List-form** **`system`** and **three-arg** **`open`** for **paths** from **config**—**shell** **injection** is the top **Perl** **finding** in **glue** scripts.
- **Secret injection:** **Vault** → **fd** or **env** scoped to **process**—**argv** and **`ps`** leak **tokens** (advanced above).
- **Subprocess orchestration:** **`IPC::Open3`** + **timeouts** for **health** **checks** and **CI** **steps** that must not **hang** **workers**.

---

## References

- [perlipc](https://perldoc.perl.org/perlipc)
- [perlsec](https://perldoc.perl.org/perlsec)
- [perlopentut](https://perldoc.perl.org/perlopentut)
- [perlfunc](https://perldoc.perl.org/perlfunc) — `open`, `pipe`, `readpipe`, `sysopen`, and [`eval`](https://perldoc.perl.org/perlfunc#eval-EXPR) (block vs string).
- [IPC::Open3](https://perldoc.perl.org/IPC::Open3)
- [File::Temp](https://perldoc.perl.org/File::Temp)
- [Safe](https://perldoc.perl.org/Safe) — compartment (legacy; read **perlsec** before relying on it).
