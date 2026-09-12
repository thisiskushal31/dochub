# CPAN, installers, and reproducible environments

[← Back to Perl](./README.md)

## What this chapter covers

How CPAN distributions are published and resolved, practical installer workflows (`cpan`, `cpanm`), local dependency roots (`local::lib`), lock/snapshot strategies (Carton, mirror stacks), and operational discipline for repeatable CI and production environments.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. What CPAN actually ships

CPAN publishes **distributions** (`.tar.gz`) rather than single modules. A distribution usually contains:

- module files under `lib/`
- metadata (`META.json` / `META.yml`)
- build entry (`Makefile.PL` or `Build.PL`)
- tests

One distribution can contain many modules, and names do not always map 1:1 with package names. Dependency resolution follows metadata and index information.

---

### 2. Installer choices

| Tool | Typical use |
|------|-------------|
| `cpan` | Full interactive client, can be scripted. |
| `cpanm` | Minimal installer popular in CI and containers. |
| `cpanp` | Legacy CPANPLUS workflows in older estates. |

In regulated or air-gapped setups, installers should target internal mirrors, not the public internet directly.

**TLS and trust stores:** **`cpanm`**, **`cpan`**, and **`HTTP::Tiny`** (often used under the hood) rely on the platform **CA bundle**. Minimal **container** images sometimes omit **`ca-certificates`**—downloads then fail or, worse, teams disable verification in scripts. Corporate **TLS inspection** may require an **internal** root in **`SSL_CERT_FILE`** / **`PERL_LWP_SSL_CA_FILE`**-style configuration; document that for **CI** the same way you document **`HTTP_PROXY`**.

---

### 3. Local dependency roots (`local::lib`)

`local::lib` lets non-root users install modules into an isolated tree and prepend it to module lookup.

```bash
cpanm --local-lib=~/perl5 local::lib
eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib)"
```

This is standard for shared CI workers and user-space development shells.

---

### 4. Reproducibility patterns

For repeatable builds, pin exact dependency versions:

- `cpanfile` + `cpanfile.snapshot` with Carton
- internal curated mirror stacks (for example Pinto workflows)
- vendored module trees checked into artifacts

The same lock input should drive local, CI, and release builds to prevent “works here” drift.

**OS packages vs CPAN:** Linux distributions ship **`perl`** and a **vendor** `@INC` tree (`/usr/share/perl/...`) that may **patch** or **freeze** modules for the distro lifecycle. Mixing **`apt install libfoo-perl`** with **`cpanm`** into **`/usr/local`** or **`local::lib`** can produce **two versions** of the same module—**shadowing** bugs and **security** scanners reporting the wrong copy. Pick **one** strategy per host or image: **either** vendor Perl + distro modules **or** a **managed** Perlbrew/plenv + Carton tree.

**Toolchain stack:** **`ExtUtils::MakeMaker`** (**`Makefile.PL`**) and **`Module::Build`** / **`Module::Build::Tiny`** (**`Build.PL`**) are the common installers CI invokes; **`cpanm`** abstracts them. Failing tests during **`./Build test`** or **`make test`** should fail the **image** build, not be forced with **`--notest`** in production pipelines.

---

### 5. XS vs pure-Perl implications

Pure-Perl modules are source-only and broadly portable. XS modules compile native code against Perl headers and platform libraries, so:

- ABI and libc mismatches can break runtime loading
- base image and compiler toolchain become part of reproducibility
- CVE handling must include native linked dependencies

---

## 2. Advanced concepts

**Private CPAN (DarkPAN):** internal module publishing with authenticated mirror endpoints and review gates.

**Dependency auditing:** periodic upgrade simulations in CI, policy checks for stale or vulnerable dependencies, and explicit allowlists for critical modules.

**Immutable runtime:** never run ad hoc `cpan install` on production hosts; build dependencies into deploy artifacts.

**Vulnerability scanning:** Track **native** libraries linked by **XS** (OpenSSL, libxml2, etc.) the same way you track the Perl layer—**`META.json`** / **`MYMETA`** record some deps; **SBOM** tools and **distro** security feeds complement **`cpan-outdated`**-style workflows.

---

## 3. Applications and use cases

- **CI images:** **`cpanm`** + **`local::lib`** or **Carton** **snapshot** in **Docker** **build** stages—**fail** the build on **`make test`** failures, not **`--notest`** in **prod** paths.
- **Air-gapped and regulated orgs:** **Pinto** / **DarkPAN** + **internal** **TLS** trust (chapter 13)—no **surprise** **`HTTP_PROXY`** to the **public** index.
- **Distro vs CPAN mixing:** **`apt install libfoo-perl`** plus **`cpanm`** into **`/usr/local`** creates **dual** installs—**scanner** false positives and **runtime** **shadowing**.
- **Upgrade windows:** **Perl** **minor** bumps require **XS** **rebuild**—schedule **maintenance** with **chapter 16** checklist.

---

## References

- [perlmodinstall](https://perldoc.perl.org/perlmodinstall) — installing from CPAN.
- [perlmodstyle](https://perldoc.perl.org/perlmodstyle) — authoring modules (useful when reading upstream).
- [CPAN](https://www.cpan.org/) — archive; [MetaCPAN](https://metacpan.org/) — search, reverse deps, release metadata.
- [Modules index](https://perldoc.perl.org/modules) — core module index in the browser.
- [perlfaq2](https://perldoc.perl.org/perlfaq2) — obtaining Perl and modules.
- [Carton](https://metacpan.org/pod/Carton) — snapshot installs from `cpanfile` (MetaCPAN).
- [HTTP::Tiny](https://perldoc.perl.org/HTTP::Tiny) — minimal HTTPS client used by many installers (SSL options in POD).
