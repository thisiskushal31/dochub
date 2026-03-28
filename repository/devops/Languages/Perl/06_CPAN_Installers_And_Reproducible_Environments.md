# CPAN, installers, and reproducible environments

[← Back to Perl](./README.md)

## What this chapter covers

How CPAN distributions are published and resolved, practical installer workflows (`cpan`, `cpanm`), local dependency roots (`local::lib`), lock/snapshot strategies (Carton, mirror stacks), and operational discipline for repeatable CI and production environments.

---

## 1. What CPAN actually ships

CPAN publishes **distributions** (`.tar.gz`) rather than single modules. A distribution usually contains:

- module files under `lib/`
- metadata (`META.json` / `META.yml`)
- build entry (`Makefile.PL` or `Build.PL`)
- tests

One distribution can contain many modules, and names do not always map 1:1 with package names. Dependency resolution follows metadata and index information.

---

## 2. Installer choices

| Tool | Typical use |
|------|-------------|
| `cpan` | Full interactive client, can be scripted. |
| `cpanm` | Minimal installer popular in CI and containers. |
| `cpanp` | Legacy CPANPLUS workflows in older estates. |

In regulated or air-gapped setups, installers should target internal mirrors, not the public internet directly.

---

## 3. Local dependency roots (`local::lib`)

`local::lib` lets non-root users install modules into an isolated tree and prepend it to module lookup.

```bash
cpanm --local-lib=~/perl5 local::lib
eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib)"
```

This is standard for shared CI workers and user-space development shells.

---

## 4. Reproducibility patterns

For repeatable builds, pin exact dependency versions:

- `cpanfile` + `cpanfile.snapshot` with Carton
- internal curated mirror stacks (for example Pinto workflows)
- vendored module trees checked into artifacts

The same lock input should drive local, CI, and release builds to prevent “works here” drift.

---

## 5. XS vs pure-Perl implications

Pure-Perl modules are source-only and broadly portable. XS modules compile native code against Perl headers and platform libraries, so:

- ABI and libc mismatches can break runtime loading
- base image and compiler toolchain become part of reproducibility
- CVE handling must include native linked dependencies

---

## Advanced use cases and implementation

**Private CPAN (DarkPAN):** internal module publishing with authenticated mirror endpoints and review gates.

**Dependency auditing:** periodic upgrade simulations in CI, policy checks for stale or vulnerable dependencies, and explicit allowlists for critical modules.

**Immutable runtime:** never run ad hoc `cpan install` on production hosts; build dependencies into deploy artifacts.

---

## References

- [Perldoc Browser](https://perldoc.perl.org/)
- [Modules index](https://perldoc.perl.org/modules)
- [CPAN](https://www.cpan.org/)
- [perlfaq2](https://perldoc.perl.org/perlfaq2)
