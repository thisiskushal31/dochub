# Testing, debugging, and profiling

[← Back to Perl](./README.md)

## What this chapter covers

Core Perl testing workflows (TAP, `Test::More`, `prove`), debugging (`perl -d`), coverage, and profiling. The emphasis is production-like verification: same runtime, same dependencies, and realistic data when measuring behavior.

---

## 1. Unit testing with `Test::More`

Basic tests are small assertions with readable intent:

```perl
use strict;
use warnings;
use Test::More;

is( 2 + 2, 4, 'basic arithmetic' );
done_testing();
```

Use deterministic inputs and avoid hidden network dependencies in unit tests.

---

## 2. Running suites with `prove`

`prove` executes TAP tests and aggregates results:

```bash
prove -lr t/
prove -j4 t/
```

- `-l` adds `lib/` to `@INC`
- `-j` parallelizes tests (safe only when tests are isolated)

CI should pin Perl and dependency versions so test outcomes are stable across environments.

---

## 3. Debugging with `perl -d`

The built-in debugger supports breakpoints, stepping, and variable inspection:

```bash
perl -d script.pl
```

For production issues, reproduce locally with the same Perl version, same module tree, and representative data snapshots.

---

## 4. Coverage and quality gates

Coverage tools (for example `Devel::Cover`) can track lines/branches/subroutines and enforce baseline thresholds for critical paths. Coverage is a signal, not a guarantee; pair it with behavior-oriented tests and edge-case fixtures.

---

## 5. Profiling hot paths

`Devel::NYTProf` is the common profiler for statement-level timing and call costs. Profile release-like builds and realistic workloads; debug-mode assumptions can mislead optimization work.

---

## Advanced use cases and implementation

**Snapshot testing:** useful for CLI/report output, but normalize locale/time/path differences to prevent flaky diffs.

**Load and soak tests:** long-running runs catch descriptor leaks, unbounded caches, and GC-like memory growth from retained references.

**Security tests:** include explicit tests for command injection, path traversal, and unsafe deserialization boundaries.

---

## References

- [Test::Tutorial](https://perldoc.perl.org/Test::Tutorial)
- [Test::More](https://perldoc.perl.org/Test::More)
- [perldebug](https://perldoc.perl.org/perldebug)
- [perlrun](https://perldoc.perl.org/perlrun)
