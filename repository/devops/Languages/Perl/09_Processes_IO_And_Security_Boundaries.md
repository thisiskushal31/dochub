# Processes, I/O, and security-relevant boundaries

[← Back to Perl](./README.md)

## What this chapter covers

Opening files and sockets, pipes, `system`, `exec`, `qx//`, `open` modes, and taint mode (`-T`). The emphasis is defensive: shell injection, safe `open` patterns, and least privilege. Operations topics include blocking I/O, timeouts, and signal handling in long-running scripts.

---

## 1. `open`: two-argument vs three-argument

**Three-argument** `open` keeps mode and path separate — preferred when paths are influenced by users or configuration:

```perl
open my $fh, '<', $path or die "open: $!";
```

**Two-argument** `open FH, "$mode$path"` concatenates mode and path — dangerous if `$path` can contain shell metacharacters or `|` pipe opens.

**Pipe to external command** without a shell — list form:

```perl
open my $pipe, '-|', 'grep', '^ERROR', $logfile or die $!;
```

---

## 2. `system`, `exec`, and backticks

`system LIST` with multiple arguments avoids the shell. `system STRING` runs through the shell — only use when you fully control and escape the string.

```perl
system( 'mv', $src, $dst );   # preferred
system( "mv $src $dst" );    # shell injection if tainted
```

`qx//` and backticks invoke the shell on Unix — treat as high risk with untrusted data. `exec` replaces the current process; use when handing off to another binary under a supervisor.

---

## 3. Taint mode (`-T`)

`perl -T` tracks “tainted” data from outside the program and restricts operations that affect the outside world until values are validated. Relevant for setuid wrappers and strict dataflow policies; see **perlsec** for interaction with `PERL5LIB`, `PATH`, and `%ENV`.

---

## 4. Signals and `%SIG`

Install small handlers for `TERM`, `INT`, or `PIPE` for graceful shutdown. Keep handlers minimal — set a flag and exit the main loop elsewhere — because signals can interrupt XS code and `eval` in subtle ways.

---

## Advanced use cases and implementation

**FD leaks:** After `fork`, close unused pipe ends or connections to avoid hangs and descriptor exhaustion.

**Privilege:** Drop root immediately after any work that truly requires it; prefer systemd socket activation or Linux capabilities over long-lived root Perl.

**Secrets:** Arguments and environment are visible in `ps` — pass secrets via file descriptors, memory-only APIs, or secret stores, not argv.

---

## References

- [perlipc](https://perldoc.perl.org/perlipc)
- [perlsec](https://perldoc.perl.org/perlsec)
- [perlfunc](https://perldoc.perl.org/perlfunc)
