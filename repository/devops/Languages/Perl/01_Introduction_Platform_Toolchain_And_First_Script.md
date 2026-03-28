# Introduction: platform, interpreter, toolchain, and first script

[← Back to Perl](./README.md)

## What this chapter covers

What Perl is as a **language** and **runtime**, how the **interpreter** turns source into execution, where **modules** load from (`@INC`), which **command-line** switches and **environment** variables matter in production, and how to run a **minimal script** you can repeat in CI or on a server. Later chapters assume you understand **context** (previewed here), **strict** discipline, and why **legacy** Perl appears in operations and security reviews.

---

## 1. What Perl is (for a new reader)

Perl is a **high-level, interpreted** language in typical deployment: you ship **source** (or a generated bundle), and a `perl` binary executes it. Internally, the implementation does **lexing**, **parsing**, **optimization** of an op tree, then **execution**—so “interpreted” does not mean “no compilation,” only that the compilation step is **inside** the `perl` process and usually **per run** unless you use persistent frameworks (e.g. FastCGi, embedded interpreters).

The surface syntax mixes **C**-like punctuation with **sigils** on variables (`$` scalar, `@` array, `%` hash). **Regular expressions** are first-class, not an afterthought library. Multiple styles coexist: **procedural** scripts, **functional** idioms (`map`, `grep`), and **object-oriented** patterns built on **blessed** references or CPAN OO systems.

For **engineering**, expect decades of **idioms** and **CPAN** modules: not every stack uses the same style. For **security**, treat Perl like any powerful glue language: **string eval**, **shell** invocation, and **dynamic loading** of code from untrusted paths are high-risk knobs that show up in incident postmortems when scripts are exposed to the network or to multi-tenant inputs.

---

## 2. Compilation model (what actually runs)

When you run `perl script.pl`, the interpreter roughly:

1. Opens the program text (or reads from `-e`).
2. Parses into a syntax tree and builds **ops** (operators) in an internal format.
3. Executes those ops, which may **load modules** from disk as `use` and `require` run.
4. Exits with an exit code; **warnings** may print to **stderr** even on success.

There is no separate `.o` file for pure Perl in the default workflow. **XS** extensions compile C code into shared objects that `perl` **dynamically loads** when a module needs them—those **do** have binary artifacts and **ABI** concerns across Perl **minor** versions.

```bash
perl -MO=Concise -e 'print 2+2' 2>/dev/null | head
```

`B::Concise` (when available) shows op-level structure—useful when profiling or reading optimizer behavior; not needed for everyday scripting.

---

## 3. Where it runs

The runtime is the **`perl`** executable plus **core libraries** on disk. **Unix** systems often ship a system Perl; **containers** and **CI** images may install a **specific** minor release via the OS package manager or a **per-user** tool (**perlbrew**, **plenv**). **Windows** commonly uses **Strawberry Perl** or **ActiveState**-style distributions; paths and **DLL** loading differ from ELF + `LD_LIBRARY_PATH` models.

Scripts depend on the **environment**:

- **`PATH`** — must find `perl` and any helper binaries (`sendmail`, `curl`, etc.).
- **`PERL5LIB`** — prepends directories to **`@INC`** (module search path); powerful and easy to misconfigure in production.
- **Locale / encoding** — affects warnings, sorting, and regex unless you normalize explicitly (chapter 4 goes deeper).

A script that works interactively but fails in **cron** is often missing **`PATH`**, **`PERL5LIB`**, or a **working directory** assumption.

```bash
which perl
perl -V
```

`perl -V` prints version, **config**, and the effective **`@INC`** list—always collect it when opening a “works here, fails there” ticket.

---

## 4. `@INC` and module loading (preview)

`@INC` is an array of **directory roots** searched when a `use` or `require` loads a **`.pm`** file. Order matters: **earlier** directories win. **Shadowing** (accidentally loading the wrong `Foo::Bar` because a local `lib/` appears first) is a real incident class.

```bash
perl -V | sed -n '/\@INC/,/^$/p'
```

**`PERL5LIB`** (colon-separated paths) **prepends** to `@INC`. **`use lib 'path'`** in code does the same for that script only—prefer that for project-relative paths when you control the tree.

Chapter 5 expands **packages** and **`use`/`require`**; chapter 6 covers **reproducible** installs.

---

## 5. Toolchain pieces

| Piece | Role |
|-------|------|
| **`perl`** | Executes scripts and **`-e`** one-liners; dozens of **switches** (`perlrun`). |
| **`perldoc`** | Reads **POD** documentation from core and installed modules (`perldoc perlop`, `perldoc Some::Module`). |
| **`cpan` / `cpanm`** | CPAN clients—policy varies by org (air-gapped mirror, approval gates). |
| **`prove`** | Runs **Test::** suites (TAP); standard in CI for module-style repos. |
| **`carton` / `Pinto`** (ecosystem) | **Snapshot** or **mirror** dependencies for repeatable deploys. |

Nothing in core forces an IDE. **Version pinning** is non-optional for production: language deprecations, **XS** ABIs, and **regex** engine details evolve between **5.x** minors.

---

## 6. `use strict`, `use warnings`, and modern baseline

`use strict` turns on **strict vars**, **strict refs**, and **strict subs** (see the `strict` pragma). In practice it stops **bareword** filehandles from being silently created, catches **undeclared** globals in many cases, and forces **lexical** variables (`my`) where you intend them.

`use warnings` enables compile-time and runtime **warnings** for suspicious operations. Together they are the **baseline** for new code; **legacy** scripts may lack them—treat editing such scripts as a chance to add them incrementally and run the test suite.

```perl
use strict;
use warnings;

my $x = 1;
print $x, "\n";
```

Omitting `my` under `strict` for a new variable is a **compile-time** failure—this is preferable to silently using a **package global**.

---

## 7. First script

A minimal script prints a line and exits **0**:

```perl
#!/usr/bin/env perl
use strict;
use warnings;

print "Hello, Perl\n";
```

**One-liners** are idiomatic for **glue**:

```bash
perl -e 'print "ok\n"'
perl -E 'say "ok"'
```

`-E` enables **`feature` bundle** defaults for that invocation (including **`say`** on supported versions). For maximum portability across **5.x** ages, stick to `-e` and `print`, or add `use feature 'say';` explicitly in a **`.pl`** file.

---

## 8. Shebang, permissions, invocation

On Unix, the **shebang** line selects the interpreter. **`#!/usr/bin/env perl`** uses the first `perl` on **`PATH`**—good for developer laptops and many CI images. **Pinned** containers sometimes use a **fixed** path (`#!/opt/perl/bin/perl`) so behavior cannot drift with `PATH`.

Invoking as **`perl script.pl`** avoids relying on the execute bit and documents the interpreter in automation logs. **`./script.pl`** requires **execute** permission and a valid shebang.

**Security habit:** treat downloaded **`.pl`** files like any executable text: read before running; never **`chmod +x`** first.

---

## 9. Selected `perl` switches (operations cheat sheet)

| Switch | Meaning |
|--------|---------|
| **`-c`** | Syntax check only (does not run `BEGIN` blocks fully the same way as execution—know the limits). |
| **`-w`** | Enable many warnings (older style; `use warnings` preferred in files). |
| **`-T`** | **Taint** mode: stricter dataflow rules; legacy defense-in-depth for setuid-ish designs. |
| **`-e 'code'`** | Run code string. |
| **`-n` / `-p`** | **Wrap** a loop around **`-e`** (line processing—chapter 4). |

Full tables live in **`perlrun`**; the **`-T`** flag interacts with **`PERL5LIB`** and file ownership—read **perlsec** before relying on tainting.

---

## Advanced use cases and implementation

**Long-running daemons:** **Preforking** servers, **AnyEvent**/**POE**-style async stacks, and **embedded** `libperl` all share concerns: **memory** leaks in **XS**, **signal** handling, **graceful** worker restart, and **file descriptor** inheritance. Perl syntax is rarely the bottleneck; **I/O**, **locking**, and **external** services are.

**CGI / legacy web:** Older **CGI** scripts spawn a **new** `perl` per request unless a **persistent** layer sits in front. Operations focus is **process** churn and **cold start**, not regex speed.

**Containers:** Build images with a **single** Perl version, **frozen** CPAN tree, and **documented** **XS** prerequisites (compiler, `-dev` packages). Mismatch between **glibc** in the image and **XS** blobs built elsewhere is a common **load failure** at runtime.

**Incident response:** **`~/.bash_history`**, **cron** spools, and **configuration management** repos often contain Perl **one-liners**. Attackers use them too—correlate with **file** timestamps and **network** logs, not only the language.

---

## References

### Primary (core docs)

- [perlintro](https://perldoc.perl.org/perlintro)
- [perl](https://perldoc.perl.org/perl)
- [perldoc](https://perldoc.perl.org/perldoc)
- [perlrun](https://perldoc.perl.org/perlrun)
- [strict](https://perldoc.perl.org/strict)
- [warnings](https://perldoc.perl.org/warnings)

### Internals (selected)

- [perlguts](https://perldoc.perl.org/perlguts) — C API and interpreter internals.

### Ecosystem

- [CPAN](https://www.cpan.org/)
