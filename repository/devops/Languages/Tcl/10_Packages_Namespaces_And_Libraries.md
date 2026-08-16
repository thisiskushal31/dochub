# Packages, namespaces, and libraries

[← Back to Tcl](./README.md)

## What this chapter covers

How Tcl code grows beyond one file: **`package require` / `package provide`**, **`pkgIndex.tcl`**, **`source`**, **`load`** for binary extensions, **`auto_path`**, **`tcl::tm`** modules (`.tm`), **`namespace ensemble`**, a **`zipfs`** packaging door (Tcl 9), and how **namespaces** keep libraries from colliding. Brief doors: **`msgcat`** for localization and a deepened **`unknown`** / auto-load caution. Default is **Tcl 9.0.x**; package ecosystems on **8.6** hosts remain common brownfield literacy.

You leave able to structure a small library (including an ensemble API), read an index or `.tm` module, explain how `require` finds code, mount a zip of scripts cautiously, and review supply-chain and naming risks.

---

## 1. Concepts

### 1. Why packages exist

A **package** is a named, versioned unit the interpreter can load on demand. Scripts declare what they need; the runtime locates and initializes it once per interpreter (unless you design otherwise).

```tcl
package require Tcl 9.0
package require http 2.9
```

`package require` returns the version actually loaded. If nothing satisfies the constraint, it errors—fail loudly in CI rather than silently running without a dependency.

### 2. Providing a package

At the end of your library initialization (after commands exist):

```tcl
package provide mymod 1.2.3
```

Version strings compare with `package vcompare` / `vsatisfies` rules—use numeric dotted versions teams understand.

### 3. How discovery works: `auto_path` and `pkgIndex.tcl`

Search path highlights:

| Mechanism | Role |
|-----------|------|
| `auto_path` | List of directories searched for packages |
| `tcl_pkgPath` | Install-oriented package roots (implementation detail teams peek at) |
| `pkgIndex.tcl` | Index scripts that call `package ifneeded …` |

A typical index line registers how to load:

```tcl
package ifneeded mymod 1.2.3 [list source [file join $dir mymod.tcl]]
```

or for binaries:

```tcl
package ifneeded mymod 1.2.3 [list load [file join $dir libmymod[info sharedlibextension]] mymod]
```

`package require mymod` evaluates the registered script when first needed.

Generate indexes with **`pkg_mkIndex`** during install/packaging—not by hand in every experiment if you can avoid drift.

### 4. `source` — load script text

`source` reads a file and evaluates it in the current interpreter/context:

```tcl
source [file join $here util.tcl]
```

`source` is immediate and unconditional; packages add versioning, dedupe, and discovery. Libraries meant for reuse should `package provide` even if you also `source` during development.

Optional `-encoding` on `source` matters when files are not UTF-8 (ch **07**/`02`).

### 5. `load` — binary extensions

`load` brings a shared library into the process and invokes its Tcl init entry point:

```tcl
load $path Myext
```

This is how many performance-sensitive or OS-binding features appear (database drivers, custom C code—ch **14**). Binary packages must match the Tcl ABI/stubs expectations for **9** vs **8.6**; mixing is a classic crash class.

### 6. Namespaces as library boundaries

Packages should export commands from a **namespace**, not litter the global namespace:

```tcl
namespace eval ::mymod {
    namespace export greet
    proc greet {name} {
        return "hello, $name"
    }
}
package provide mymod 1.0
```

Callers use `mymod::greet` or `namespace import mymod::greet` (import sparingly—imports are another collision surface).

`variable` inside namespaces, `namespace current`, and `namespace path` complete the everyday toolkit (deeper scope rules live in ch **04**).

### 7. `package` ensemble literacy

| Subcommand | Role |
|------------|------|
| `require` | Load / satisfy constraints |
| `provide` | Declare what this script offers |
| `ifneeded` | Register loader script |
| `names` / `versions` / `present` | Query |
| `vcompare` / `vsatisfies` | Version logic |
| `forget` | Rarely used cleanup/testing |

### 8. Worked ensemble: `namespace ensemble create`

Many mature APIs look like `string length …` / `chan configure …`—one root command, many subcommands. That pattern is a **namespace ensemble**. Here is a minimal `mymod` you can ship as a package:

```tcl
namespace eval ::mymod {
    namespace export {[a-z]*}
    variable version 1.0.0

    proc greet {name} {
        return "hello, $name"
    }

    proc version {} {
        variable version
        return $version
    }

    proc ping {args} {
        # demonstrate forwarding leftover words
        return [list pong {*}$args]
    }

    namespace ensemble create
}
package provide mymod 1.0.0
```

Callers then write:

```tcl
package require mymod 1.0
puts [mymod greet world]   ;# hello, world
puts [mymod version]       ;# 1.0.0
puts [mymod ping a b]      ;# pong a b
```

Literacy notes:

- `namespace ensemble create` (with defaults) turns exported procs in the namespace into subcommands of the ensemble command named like the namespace (`mymod`).
- You can pass options (`-map`, `-prefixes`, `-subcommands`, …) when you need renames or restricted surfaces—read the **namespace** man page before inventing magic.
- Ensembles still obey normal substitution; build dynamic subcommand calls with `list` / `{*}` carefully—do not `eval` user strings into `mymod $userCmd`.
- For a first library, `mymod::greet` exports are enough; graduate to ensembles when the command set grows and you want a single documented root.

### 9. Tcl modules: `tcl::tm` and `.tm` files

A **Tcl module** is a single-file package named so the runtime can discover it without a handwritten `pkgIndex.tcl`. Filename shape:

```text
name-version.tm
```

Examples: `mymod-1.0.tm`, or nested package names mapped to directories (`encoding/base64-1.0.tm` for package `encoding::base64`).

Discovery uses the **module path**, managed by **`::tcl::tm`**, separate from classic `auto_path` package indexes:

| Command | Role |
|---------|------|
| `::tcl::tm::path list` | Paths searched for `.tm` files |
| `::tcl::tm::path add …` | Prepend search paths (with ancestor-path restrictions) |
| `::tcl::tm::path remove …` | Drop paths |
| `::tcl::tm::roots …` | Add versioned system/site roots (advanced / installers) |

```tcl
# Dev: put your modules on the module path
::tcl::tm::path add [file join $repo lib tm]
package require mymod 1.0
```

A module file is ordinary Tcl that ends with `package provide` (the index/`ifneeded` script is generated as `source` of that file). Modules are always `source`d—not `load`ed as binaries. Hybrid binary packages still use classic `pkgIndex.tcl` + `load`.

Staff habits:

- Prefer `.tm` for small pure-Tcl internal libraries; keep one concern per file.
- Remember module paths are **not** `auto_path`—ops docs must mention both when both are in play.
- Environment variables such as `TCL9_0_TM_PATH` (and related forms documented in the **tm** man page) can extend user/site module paths—treat them as trust configuration in hardened images.

### 10. `zipfs` packaging door (Tcl 9)

**`zipfs`** mounts a ZIP archive as a virtual filesystem so scripts and assets can ship inside a zip (or an executable image built with zipfs helpers). This is a **Tcl 9** packaging door—not a full application-distribution course.

```tcl
set base [file join [zipfs root] myApp]
zipfs mount $zipfile $base
source [file join $base app.tcl]
# … use files under $base …
zipfs unmount $base
```

Literacy:

| Idea | Staff takeaway |
|------|----------------|
| Mount / unmount | `zipfs mount` / `zipfs unmount`; list mounts with bare `zipfs mount` |
| Scripts inside zip | `source`, `package require` (if indexes/modules are laid out), `open` paths under the mount |
| `zipfs mkzip` / `mkimg` | Build archives or attach a zip to a `tclsh`/`wish` image for single-file apps (`main.tcl` convention—see man page) |
| Password option | Optional zip password / obfuscation exists for **casual** inspection resistance |

**Security caution:** zipfs encryption/password features are **not strong encryption**. Official docs state they deter casual inspection, not a determined attacker. Do not store real secrets in a “password-protected” zipfs image and call it vaulting. Treat mounted content as **code you trust** (same supply-chain bar as `auto_path`).

`cd` into a mount is process-local and inconsistent for native code that bypasses Tcl’s filesystem API—prefer absolute paths under the mount point.

### 11. `msgcat` door — localization

The bundled **`msgcat`** package localizes message strings (GUIs, CLI help, operator errors). Door-level literacy only:

```tcl
package require msgcat
namespace import msgcat::*
# Prefer msgcat::mc / mcload patterns from the man page in real apps
puts [mc "Ready."]
```

Locale selection interacts with environment variables such as `LANG` / `LC_MESSAGES` / `LC_ALL` (see **tclvars** / **msgcat** man pages). Ops implication: pin locale in CI so golden strings do not flake; keep secret-bearing text out of translated catalogs that land in tickets.

Full catalog layout and plural forms live in the **msgcat** man page and ch **18**’s door checklist—do not invent a second i18n framework beside it without cause.

---

## 2. Advanced concepts

### 1. Dual version worlds (9 vs 8.6)

A host may ship separate package trees for 8.6 and 9. Your `auto_path` must point at binaries built for the running interpreter. Symptoms of mismatch: failed `load`, missing symbols, subtle memory corruption.

Pin in deployment:

```tcl
puts [info patchlevel]
puts $auto_path
```

CI should run `package require` smoke tests on the same major as production.

### 2. Index scripts are code

`pkgIndex.tcl` content runs with the privileges of the process when the package is required (and index probing itself evaluates index files). Treat package directories as **trust roots**. Supply-chain review (ch **16**) includes who can write into those dirs.

### 3. Circular requires and init order

`package require` while a package is already initializing can surprise you. Keep top-level init shallow: define commands, `provide`, defer heavy work to procs. Avoid `require` cycles between peer packages—introduce a thinner shared core.

### 4. Export surfaces and OO doors

Public API = exported namespace commands (and documented ensembles). Internal helpers stay unexported.

Object systems (**TclOO**, **[incr Tcl]**) usually ship as packages. This chapter only opens the door: still use `package require` + namespace/OO naming; full OO curricula belong in man pages / compass (ch **18**).

### 5. `unknown` and auto-loading (deepened caution)

When a command name does not resolve, Tcl invokes **`unknown`** (or a per-namespace unknown handler). The default implementation may:

1. **Auto-load** a command via library indexes (`auto_load` / package indexes on `auto_path`).
2. In interactive mode, try **auto-exec** of an external program with the same name.
3. Interactively, expand history-style shortcuts and unique command abbreviations.

Consequences for staff:

| Risk | Mitigation |
|------|------------|
| Missing dep surfaces late, mid-request | `package require` every hard dependency at startup |
| Typo silently becomes an external `exec` in interactive experiments | Do not copy interactive habits into daemons; set `auto_noexec` when appropriate |
| Custom `unknown` wrappers hide failures | Chain carefully; log; never swallow security-sensitive misses |
| Safe interps | Default `unknown` is absent—do not assume auto-load in locked-down children (ch **12**) |

```tcl
# Production startup — fail fast
foreach pkg {http msgcat} {
    package require $pkg
}
# Optional hardening in non-interactive appliances:
# set ::auto_noload 1   ;# only if you explicitly require everything
```

Do not rely on mysterious auto-load for critical security paths. Prefer explicit requires and explicit `source`/`load` in install docs so missing files fail before serving traffic.

Overriding `unknown` is powerful metaprogramming—review any `rename unknown` in a PR as a global behavioral change.

### 6. Fat applications vs many packages

Ship internal packages with your app (vendor into a `lib/` on `auto_path`) when reproducibility matters more than distro packages. Record versions in a lock-style file your ops team understands—even if Tcl lacks a single universal lock format.

### 7. Minimal library layout that reviews well

A small pure-Tcl library that survives staff review usually looks like:

```text
mymod/
  pkgIndex.tcl
  mymod.tcl          ;# package provide + namespace eval
  mymod/internal.tcl ;# optional sourced helpers
  tests/...
```

`pkgIndex.tcl` registers `source` of the entry file. The entry file sets up the namespace, `source`s helpers with paths relative to `::mymod::dir` (set from `[file dirname [info script]]`), then `package provide`. Avoid requiring callers to invent their own `source` order.

### 8. Version constraints in practice

```tcl
package require http 2.9        ;# minimum
package require Tcl 9.0         ;# major floor for new scripts
package vsatisfies 1.2.3 1.2    ;# query helper
```

Be explicit when an API you need appeared in a minor. Conversely, overly tight pins (`exact` style habits) make security backports painful—prefer “minimum known good” unless you depend on a quirk.

### 9. Namespaces and ensembles as API surface

Public APIs may use `mymod::verb` exports or a root ensemble (`mymod verb …`) as in Concepts §8. Under the hood ensembles are still namespace procedures plus `namespace ensemble create`. Keep internal helpers unexported; never `namespace import *` in library init—import only what you own or carefully named utilities.

When mapping user-visible subcommands with `-map`, treat the map as part of your compatibility surface—changing it is an API break.

### 10. `info script` and relocatable installs

During `source`, `info script` tells you which file is loading—use it to find sibling files without hard-coding install prefixes. After load completes, stash the directory:

```tcl
namespace eval ::mymod {
    variable dir [file dirname [file normalize [info script]]]
}
```

This pattern keeps packages relocatable across `/opt`, image layers, and developer checkouts.

### 11. When to write C vs Tcl packages

Stay in Tcl when the work is orchestration, string/list shaping, or calling other tools. Move to `load`able C (ch **14**) when you need OS APIs Tcl does not expose, tight loops over large binary buffers, or an existing vendor SDK. Hybrid packages (Tcl wrapper + optional binary accelerator) should still `package provide` one name so callers do not branch on implementation.

### 12. Module path vs `auto_path` confusion

Symptoms: `package require` fails in CI but works on a laptop because one environment had `::tcl::tm::path add` in a dotfile. Document which mechanism each library uses (`.tm` vs `pkgIndex.tcl`). Do not nest module search roots in ways the **tm** man page forbids (ancestor/descendant path pairs).

### 13. zipfs as a trust boundary

Anything you `zipfs mount` and `source` runs with process privileges. Sign or hash release zips; verify before mount in high-assurance flows. Password-protected zips are obfuscation—not confidentiality. Unmount when done; watch open-channel errors on `unmount`.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Feature modules as packages or `.tm` modules; ensembles as public CLI-like APIs; optional zipfs shipping |
| **Systems** | Extensions for OS integration loaded once at process start |
| **Security** | Controlled `auto_path` / module paths; no world-writable package dirs; review binary `load` and zipfs mounts; explicit `package require` over `unknown` auto-load |
| **Operations** | Appliance images pin package sets; health checks `package require` critical deps; locale pins when using msgcat |
| **Software engineering** | Versioned internal libs; `pkg_mkIndex` or `.tm` naming in install rules; namespace exports / ensembles as API |

Network gear / EDA / test harnesses often expose Tcl with a fixed package set—staff work is knowing how to add a **small** extension without polluting globals.

Startup checklist many teams encode once:

1. Pin `info patchlevel` in logs.
2. `package require` every hard dependency.
3. Abort if `auto_path` unexpectedly includes world-writable dirs in production.
4. Only then open sockets or touch credentials.

---

## Staff-level review checklist

- Dependencies declared with `package require` and useful version constraints.
- Libraries `package provide` matching index versions.
- Commands live under a namespace; globals not used as API.
- `auto_path` / install layout documented for 8.6 vs 9 where both ship.
- Binary `load` artifacts match interpreter major/ABI.
- Package directories are not writable by untrusted users.
- Index generation is part of build/install, not a tribal manual step.
- Startup fails fast if required packages are missing.
- Ensemble / namespace export surface is intentional; no `eval` of user strings into ensemble roots.
- `.tm` modules vs `pkgIndex.tcl` discovery documented; module paths treated as trust roots.
- zipfs mounts (if any) verified/hashed; no secrets relying on zip password “encryption.”
- Custom `unknown` / auto-load behavior reviewed; critical paths use explicit `package require`.

---

## References

- [package](https://www.tcl-lang.org/man/tcl9.0/TclCmd/package.html)
- [pkg_mkIndex](https://www.tcl-lang.org/man/tcl9.0/TclCmd/pkgMkIndex.html)
- [source](https://www.tcl-lang.org/man/tcl9.0/TclCmd/source.html)
- [load](https://www.tcl-lang.org/man/tcl9.0/TclCmd/load.html)
- [namespace](https://www.tcl-lang.org/man/tcl9.0/TclCmd/namespace.html)
- [tm](https://www.tcl-lang.org/man/tcl9.0/TclCmd/tm.html)
- [zipfs](https://www.tcl-lang.org/man/tcl9.0/TclCmd/zipfs.html)
- [msgcat](https://www.tcl-lang.org/man/tcl9.0/TclCmd/msgcat.html)
- [unknown](https://www.tcl-lang.org/man/tcl9.0/TclCmd/unknown.html)
- [Tcl 9.0 command index](https://www.tcl-lang.org/man/tcl9.0/TclCmd/)
- [Tcl/Tk software hub](https://www.tcl-lang.org/software/tcltk/)
