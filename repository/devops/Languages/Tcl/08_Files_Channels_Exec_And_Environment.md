# Files, channels, exec, and environment

[← Back to Tcl](./README.md)

## What this chapter covers

How Tcl talks to the filesystem and other processes: **`file`** and **`glob`**, **`open`** / **`chan`**, line and block I/O (`gets` / `puts` / `read`), position and transfer (`seek` / `tell` / `chan copy`), channel options (`chan configure` / `fconfigure`), **`exec`**, CLI entry (`argc` / `argv` / `argv0`), and the process environment (`env`, `pwd`, `cd`). Default is **Tcl 9.0.x**; **8.6** differences that bite ops (tilde / `file home`, encoding defaults) appear in Advanced.

You leave able to write scripts that open files safely, configure encodings, transfer bytes without reinventing copy loops, parse CLI args for tools, run external programs without accidental shells, and review path/`exec` injection smells.

---

## 1. Concepts

### 1. Paths with `file` — not string concatenation

Build and inspect paths with the **`file`** ensemble so separators and edge cases stay platform-honest:

| Subcommand | Role |
|------------|------|
| `join` / `split` | Construct / decompose path components |
| `dirname` / `tail` / `rootname` / `extension` | Path parts |
| `normalize` | Logical normalization (within documented rules) |
| `exists` / `isfile` / `isdirectory` / `readable` / … | Tests |
| `mtime` / `size` / `type` / `attributes` | Metadata |
| `copy` / `delete` / `rename` / `mkdir` | Mutations |
| `tempfile` | Temp file creation helpers (see man page forms) |
| `home` | Home directory (Tcl 9 literacy — prefer over naive `~` habits) |

```tcl
set cfg [file join $root etc app.conf]
if {![file isfile $cfg]} {
    return -code error "missing config: $cfg"
}
```

Prefer `file join` over hard-coded `/` when scripts must run on Windows and Unix. Still validate components when any piece comes from a user or ticket field.

### 2. `glob` for expansion

`glob` expands patterns to file lists (`*`, `?`, character classes). Switches commonly matter:

- `-nocomplain` — empty result instead of error when nothing matches
- `-types` — restrict to files/dirs/etc.
- `-directory` — pattern relative to a directory

```tcl
set logs [glob -nocomplain -directory $logdir *.log]
```

Never feed untrusted strings as glob patterns without hard constraints—glob metacharacters are a control surface.

### 3. Channels: `open`, `chan`, and friends

A **channel** is Tcl’s handle for a stream (file, pipe, socket, stderr, …). Classic entry points:

```tcl
set ch [open $cfg r]
# ... read ...
close $ch
```

Modes include `r`, `w`, `a`, and combinations with `+` for read/write; binary intent is expressed with channel configuration (below), not only with a magic letter in every case—read the `open` man page for the exact mode string you need.

Modern code often prefers the **`chan`** ensemble (`chan open` is not universal naming—`open` remains standard; `chan configure`, `chan puts`, `chan gets`, `chan read`, `chan close`, `chan copy`, `chan flush`, `chan eof`, `chan pending`, …). `fconfigure` remains as the classic alias for configuration.

Standard channels: `stdin`, `stdout`, `stderr`.

### 4. Reading and writing

| Command | Typical use |
|---------|-------------|
| `gets chan ?var?` | One line (result length or -1 on EOF when storing in var) |
| `puts ?-nonewline? ?chan? string` | Write a line (default `stdout`) |
| `read chan ?numBytes?` | Block read; whole remaining stream if size omitted |
| `flush chan` | Push buffered output |
| `seek` / `tell` | Position (where the channel type supports it) |
| `chan copy` | Efficient channel-to-channel copy |

Line loop:

```tcl
set ch [open $path r]
chan configure $ch -encoding utf-8 -translation auto
while {[gets $ch line] >= 0} {
    # process $line
}
close $ch
```

For large binary blobs, prefer `read` with known sizes or `chan copy` into a sink, not line loops.

### 5. Position and transfer: `seek`, `tell`, `chan copy`

Random-access and bulk transfer literacy belongs next to open/read/write—ops scripts that parse binary headers, resume downloads, or shuttle bytes between sockets and files need these commands, not line loops.

| Command | Role |
|---------|------|
| `seek chan offset ?origin?` | Move the access position (`start`, `current`, or `end`) |
| `tell chan` | Return the current access position |
| `chan copy` / `fcopy` | Copy from one channel to another efficiently |

Modern spelling prefers the **`chan`** ensemble (`chan seek`, `chan tell`, `chan copy`); classic `seek` / `tell` / `fcopy` remain aliases with the same job.

```tcl
set ch [open $blob r]
chan configure $ch -encoding binary -translation binary
chan seek $ch 0 start
set magic [read $ch 4]
set pos [chan tell $ch]
chan seek $ch -8 end
set trailer [read $ch 8]
close $ch
```

Not every channel supports seeking (many sockets and some pipes do not)—`seek`/`tell` fail when the channel type has no position. Prefer sequential `read` / `chan copy` for those streams.

**`chan copy` / `fcopy`** moves data using Tcl’s I/O buffers so you do not hold an entire file in a Tcl string:

```tcl
set in  [open $src r]
set out [open $dst w]
chan configure $in  -encoding binary -translation binary
chan configure $out -encoding binary -translation binary
set n [chan copy $in $out]
close $in
close $out
```

| Mode | Pattern |
|------|---------|
| Synchronous | `chan copy $in $out` blocks until EOF (or `-size`); returns bytes/chars written |
| Background | `chan copy $in $out -command [list onDone $in $out]` returns immediately; callback runs when finished—needs the event loop (`vwait` / Tk; ch **11**) |
| Sized chunks | `-size N` limits one transfer; useful for progress or chunked pipelines |

Rules of thumb:

- For **exact byte** copies, set both channels to binary encoding and binary translation so EOL/encoding conversion does not rewrite the stream.
- Background `chan copy` owns the channels—do not also `read`/`puts` the same sides until the callback fires; turn off conflicting `fileevent` handlers for that direction.
- Prefer `file copy` when you need filesystem metadata (permissions) on a same-host file-to-file copy; use `chan copy` when channels are sockets, pipes, or already-open handles.
- Encoding mismatches between in and out mean conversion (and possible `EILSEQ` under strict profiles)—treat that as a feature only when you intend transcoding.

### 6. Configuring channels

`chan configure` / `fconfigure` control:

| Option | Why it matters |
|--------|----------------|
| `-encoding` | Character decoding/encoding (e.g. `utf-8`, `binary`) |
| `-translation` | End-of-line (`auto`, `lf`, `crlf`, `binary`) |
| `-buffering` | `full`, `line`, `none` |
| `-blocking` | Blocking vs nonblocking (pairs with `fileevent`, ch **11**) |
| `-eofchar` | EOF character behavior on some platforms |

```tcl
chan configure $ch -encoding binary -translation binary
```

Mismatch between `-encoding` and actual file bytes produces mojibake or errors depending on profile/strictness (ch **07**).

### 7. `exec` — other programs

`exec` runs external programs and (by default) returns stdout as the command result; non-zero exit normally raises an error.

```tcl
set out [exec uname -s]
```

Redirections and pipelines use Tcl’s `exec` syntax (`|`, `<`, `>`, `2>`, `@chan`, …)—this is **not** `/bin/sh` by default when you pass separate words. Building one string and hoping for shell metacharacters is the injection footgun; prefer argument lists and Tcl redirections.

```tcl
# Separate words — no shell
exec grep -e $pattern -- $file
```

Capture stderr or merge streams using the documented redirection forms when diagnosing CI failures.

### 8. Environment: `env`, `pwd`, `cd`

- **`::env`** — array of environment variables (`$env(PATH)`, `array get env`, …)
- **`pwd`** — current working directory
- **`cd`** — change directory (process-wide for that interpreter)

```tcl
set home $env(HOME)
cd [file join $home projects]
puts [pwd]
```

Treat `env` as shared mutable process state: mutating `PATH` or locale variables affects later `exec` and some encodings.

### 9. CLI entry: `argc`, `argv`, `argv0`

In **`tclsh`** / **`wish`** (and environments that mimic them), three globals describe how the process was started:

| Variable | Content |
|----------|---------|
| **`argv0`** | Script path if a script was given; otherwise the name used to invoke the executable |
| **`argc`** | Number of arguments in `argv` |
| **`argv`** | Tcl **list** of the remaining command-line arguments |

These are entrypoint globals—not part of every embedded interpreter. Library code that must behave differently when run as main vs `source`d often compares `$argv0` to `[info script]`.

```tcl
# tool.tcl — minimal CLI shape
if {$argc < 1} {
    puts stderr "usage: $argv0 path ?extra...?"
    exit 2
}
set path [lindex $argv 0]
if {![file isfile $path]} {
    return -code error -errorcode {APP BAD PATH} "not a file: $path"
}
```

**Validation habits** for CLI tools:

1. Check `argc` (or `llength $argv`) before `lindex`.
2. Treat every `argv` element as untrusted input: path allowlists, no `eval`, no shell.
3. Prefer explicit flags you parse yourself (or a small dedicated parser) over stuffing raw strings into `expr` / `glob` / `exec`.
4. Exit with distinct codes for usage vs runtime failure so CI can classify.

**Forwarding arguments to `exec` with `{*}`:**

`argv` is already a proper list. Expanding it with `{*}` passes each element as its own word—no shell, no accidental word-splitting:

```tcl
# Run a pinned helper with the user's remaining args
set helper [file join $bindir helper]
if {![file executable $helper]} {
    return -code error "missing helper: $helper"
}
# Drop our own options first if needed, then forward:
set rest [lrange $argv 1 end]
set out [exec $helper {*}$rest]
```

Anti-patterns:

```tcl
# Bad — rebuilds a string and invites shell metacharacters if you then wrap sh -c
exec /bin/sh -c "helper $argv"

# Bad — eval on argv
eval exec helper $argv
```

```tcl
# Good — separate words
exec $helper {*}$argv
```

Optional flag-style sketch (literacy only—teams often grow a real parser):

```tcl
set verbose 0
set files {}
foreach arg $argv {
    switch -exact -- $arg {
        -v - --verbose { set verbose 1 }
        -- { # end of options — remainder are files
            # (handle in a fuller parser)
        }
        default {
            if {[string match -* $arg]} {
                return -code error "unknown option: $arg"
            }
            lappend files $arg
        }
    }
}
```

Pair with ch **00** for the first `tclsh script.tcl …` smoke check, and with ch **16** when arguments influence `open` / `exec` / network targets.

---

## 2. Advanced concepts

### 1. Tcl 9 path and home literacy vs 8.6

**Tcl 9** tightens long-standing tilde and home-directory behaviors. Prefer **`file home`** and **`file join`** over relying on shell-style `~` expansion habits ported from old snippets. Brownfield **8.6** scripts that embed `~/…` in paths need an explicit migration read (ch **02**)—do not assume identical expansion in 9.

Also normalize before compare when the same directory can appear with different spellings (`./`, symlink forms). `file normalize` helps within its documented limits; it is not a substitute for policy on symlink escape (`..` components from untrusted input).

### 2. Binary vs text channels

Text mode applies encoding and translations; binary mode must disable both in the usual way (`-encoding binary` and `-translation binary`, or the documented equivalent for your patchlevel). Mixing `gets` (line-oriented, encoding-aware) with binary protocols corrupts payloads.

For checksums and signatures, hash the **bytes** you will ship, not a re-encoded text form.

### 3. Nonblocking I/O and partial reads

With `-blocking 0`, `gets`/`read` may return partial data; you must accumulate and parse yourself, usually driven by `fileevent` (ch **11**). Forgetting to handle `chan pending` / EOF conditions produces “works on small inputs” bugs.

### 4. `exec` error surfaces

`exec` failures raise errors that include the program’s stderr in many cases—inspect `errorCode` (often `CHILDSTATUS` …) in `catch`/`try` (ch **09**). Pipelines abort under `exec`’s own rules for which stage failed; do not assume shell `pipefail` semantics unless you intentionally wrap a shell.

`exec` of a shell (`exec /bin/sh -c $userString`) reintroduces shell injection—reserve for controlled literals.

### 5. Working directory races

`cd` is process-global (per interpreter). Libraries that `cd` and assume restoration are hostile to concurrent event handlers and threads (ch **12**). Prefer absolute paths from `file normalize`/`file join` over chdir for library code.

### 6. Temp files and cleanup

Create temps with documented `file tempfile` / platform-safe patterns; always define cleanup (`file delete`) on success and failure paths. In long-running daemons, leaked temps are an ops incident.

### 7. Permissions and umask

`file attributes` / creation modes interact with process umask and platform ACLs. Scripts that write secrets must set restrictive permissions explicitly where the platform allows—and avoid world-readable temp dirs.

### 8. Atomic replace pattern

Ops scripts that rewrite configs should not truncate the live file in place:

1. Write to a temp file in the **same directory** (same filesystem) with correct encoding.
2. `flush` / `close`.
3. `file rename -force` over the target (atomic replace on the platforms Tcl documents for that case).

Cross-device renames are not atomic—detect and fail or copy carefully. Pair with restrictive permissions before putting secrets on disk.

### 9. `exec` pipelines vs Tcl channels

`exec prog1 | prog2` is concise for fixed tools. When you need incremental processing, separate stderr, or event-driven reads, prefer `open |prog` (or two-ended pipelines as documented) and treat the result as a channel with `fileevent` (ch **11**). Mixing both styles in one script is fine; mixing **assumptions** about buffering is not—flush and `-buffering` matter at process boundaries.

### 10. Environment hygiene for subprocesses

Before `exec` of toolchains:

- Ensure `PATH` is what you intend (absolute tool paths beat scavenger hunts).
- Locale variables (`LANG`, `LC_*`) affect child encoding and sort order.
- Strip or ignore unexpected `LD_PRELOAD` / `DYLD_*` style variables in high-assurance runners when policy requires it.

Snapshot the env you need into a small dict; do not mutate `::env` globally in library code without restoring.

### 11. Seeking and `chan copy` footguns

- **Text vs binary positions.** After text-mode reads, `tell`/`seek` still work on supporting channels, but character vs byte accounting interacts with encoding—binary mode is the honest choice for protocol offsets.
- **`-size` units.** On binary input, `-size` is bytes; on encoded text channels it is characters. Mixing assumptions corrupts chunked transfers.
- **Busy channels.** During background `chan copy`, wrong-sided I/O raises “channel busy.” Design one owner for each direction.
- **Partial failure.** If a background copy errors, the callback receives an error string—always close or reset both ends; do not leave half-written artifacts as “success.”
- **Sockets.** Prefer `chan copy` for bulk upload/download once headers are parsed; do not `seek` a TCP socket.

### 12. CLI argv review smells

- Scripts that `eval` `$argv` or pass `$argv` into `/bin/sh -c`.
- Tools that take paths from argv without `file normalize` + allowlist / jail checks.
- Forgetting that `argv0` can be a relative path—resolve when comparing to `info script` or when locating sibling assets.

---

## 3. Applications and use cases

| Domain | Patterns |
|--------|----------|
| **Application** | Config load/store, asset pipelines, plugin file discovery via `glob`; CLI tools via `argv` |
| **Systems** | Spool directories, atomic write (write temp + `file rename`), log rotation helpers; binary shuttle with `chan copy` |
| **Security** | Path allowlists; no `exec sh -c` with untrusted strings; binary downloads verified before decode; validate `argv` |
| **Operations** | CI wrappers calling compilers/test runners; capturing `exec` output into artifacts; `{*}$argv` forwarding |
| **Software engineering** | Thin Tcl facades over CLI tools with stable argument vectors and pinned encodings |

Expect (ch **15**) builds on channels and process control—this chapter is the non-interactive foundation those automations still rely on for file drops and helper binaries.

---

## Staff-level review checklist

- Paths built with `file join` / inspected with `file` tests; no naive string concat across OSes.
- User-influenced path components checked for `..` / absolute escapes per policy.
- Channels set `-encoding` / `-translation` intentionally (especially UTF-8 text vs binary).
- Binary transfers use binary channel config; bulk copies prefer `chan copy` / `fcopy` over giant `read`s where appropriate.
- `seek`/`tell` only on channels that support position; protocol offsets verified under binary mode.
- Background `chan copy` has cleanup callbacks; no conflicting `fileevent` on the same direction mid-copy.
- Files closed on all paths (or use patterns that guarantee close); temps deleted.
- CLI tools validate `argc`/`argv`; forward extras with `{*}$argv` (or a sliced list)—never `eval`/`sh -c` on raw argv.
- `exec` uses separate arguments; no untrusted string passed to a shell.
- `cd` avoided in library code; cwd mutations documented if required.
- `env` mutations scoped and restored when touching `PATH` / locale.
- Tcl 9 `file home` / tilde migration considered for 8.6 ports.

---

## References

- [file](https://www.tcl-lang.org/man/tcl9.0/TclCmd/file.html)
- [glob](https://www.tcl-lang.org/man/tcl9.0/TclCmd/glob.html)
- [open](https://www.tcl-lang.org/man/tcl9.0/TclCmd/open.html)
- [chan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/chan.html)
- [gets](https://www.tcl-lang.org/man/tcl9.0/TclCmd/gets.html)
- [puts](https://www.tcl-lang.org/man/tcl9.0/TclCmd/puts.html)
- [read](https://www.tcl-lang.org/man/tcl9.0/TclCmd/read.html)
- [seek](https://www.tcl-lang.org/man/tcl9.0/TclCmd/seek.html)
- [tell](https://www.tcl-lang.org/man/tcl9.0/TclCmd/tell.html)
- [fcopy](https://www.tcl-lang.org/man/tcl9.0/TclCmd/fcopy.html)
- [fconfigure](https://www.tcl-lang.org/man/tcl9.0/TclCmd/fconfigure.html)
- [exec](https://www.tcl-lang.org/man/tcl9.0/TclCmd/exec.html)
- [pwd](https://www.tcl-lang.org/man/tcl9.0/TclCmd/pwd.html)
- [cd](https://www.tcl-lang.org/man/tcl9.0/TclCmd/cd.html)
- [tclvars (`argc` / `argv` / `argv0` / `env`)](https://www.tcl-lang.org/man/tcl9.0/TclCmd/tclvars.html)
- [Tcl 9.0 command index](https://www.tcl-lang.org/man/tcl9.0/TclCmd/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
