# Versions: Tcl 8 vs Tcl 9 and migration

[← Back to Tcl](./README.md)

## What this chapter covers

How to think about **Tcl 8.6** (brownfield literacy) versus **Tcl 9.0.x** (handbook default for new scripts), the migration landmines that bite ops and embedded hosts, and a practical **posture** for moving trees without folklore. You will leave able to explain UTF-8 script defaults, **encoding profiles**, tilde / `file home`, Unicode string indexing, and a **C stubs / `Tcl_Size`** glance for extension owners.

Pin reality with `info patchlevel` (chapter **00**). This chapter is about *behavior differences*, not changelog tourism.

---

## 1. Concepts

### 1. Two lines you must name

| Line | Handbook role | Typical habitat |
|------|---------------|-----------------|
| **Tcl 9.0.x** | Default for **new** scripts and modern installs | Fresh CI images, current tcl-lang.org builds |
| **Tcl 8.6.x** | **Brownfield literacy** | Distro packages, appliances, older Expect hosts, vendor images |

Matching **Tk 9** goes with Tcl 9 when GUI matters. Expect version skew is its own check (chapter **15**)—do not assume every Expect package is validated on Tcl 9.

```tcl
puts [info patchlevel]
# Ground truth. Write it in the migration ticket.
```

### 2. Migration is a product risk, not a style preference

Tcl 9 fixed long-standing footguns (silent encoding corruption, automatic tilde expansion, incomplete non-BMP Unicode handling). Those fixes are **incompatible** with some 8.6 scripts that accidentally depended on the old behavior. Migration work is:

1. Discover interpreters and patchlevels per environment.
2. Inventory scripts, `source` trees, and binary extensions.
3. Fix landmines deliberately (below).
4. Re-test ops paths (especially I/O, paths, and Expect).
5. Only then flip production.

### 3. Landmine map (ops-first)

| Topic | Tcl 8.6 habit | Tcl 9 default / rule |
|-------|---------------|----------------------|
| Script encoding | Often **system encoding** for `tclsh`/`source` | **UTF-8** unless `-encoding` given |
| Ill-formed bytes | Often silently coerced (`tcl8`-like behavior) | **`strict`** profile → errors |
| `~` in paths | Auto tilde expand in many file ops | **No** auto expand; use `file home` / `file tildeexpand` |
| Non-BMP characters | Surrogate pairs; length often **2** | Full Unicode; length **1** per code point |
| Leading `0` integers | Octal interpretation in many numeric contexts | Decimal; use `0o` for octal |
| `glob` no match | Error (unless `-nocomplain`) | Empty list |
| Variable resolution in namespaces | Fall back to global in some cases | Relative to **current** namespace |
| C extensions | 8.x stubs / size types | New stubs era; **`Tcl_Size`**; `tcl9`-prefixed libs |

Details follow. Encoding depth continues in chapter **07**; C API door in chapter **14**.

### 4. UTF-8 scripts

Save new scripts as **UTF-8**. Pure ASCII plus `\u` / `\U` escapes migrates quietly. Scripts saved in legacy system encodings must either be reconverted or sourced explicitly:

```tcl
source -encoding cp1252 legacy_pkg.tcl
# Use the real encoding of the file — example only
```

A copyright symbol or accented comment in the wrong encoding can fail **`source`** under Tcl 9’s strict profile even if “it always worked” on 8.6.

### 5. Encoding profiles (strict / replace / tcl8)

Channels and `encoding convertfrom` / `convertto` use **profiles** that decide what happens on ill-formed input or unmappable output:

| Profile | Posture |
|---------|---------|
| **`strict`** | Error on bad data — **Tcl 9 default** for most new channels |
| **`replace`** | Substitute replacement characters; standards-friendly soft mode |
| **`tcl8`** | Legacy silent mapping — compatibility escape hatch, not a goal |

```tcl
# Prefer fixing data or choosing an honest encoding over tcl8 profile
chan configure $ch -encoding utf-8 -profile replace
```

Ops lesson: a pipe that used to “kinda work” with corrupted bytes may now **throw**. That is usually a feature. Choose `replace` when you must keep going and log; avoid `tcl8` unless you are mid-migration and tracking debt.

### 6. Tilde and home directories

Tcl 8 expanded `~` and `~user` in many path arguments. Convenient in a REPL; risky with untrusted names (paths that *look* like home refs). Tcl 9 **stops** doing that automatically.

```tcl
# Tcl 9 — be explicit
set home [file home]
set cfg  [file join [file home] .config myapp.conf]
set expanded [file tildeexpand ~/Projects/x]
```

```tcl
# Legacy (Tcl 8.6) — implicit tilde expansion in many file commands
# set f [open ~/.secret r]
```

Scripts that prefixed `./` to defeat tilde expansion can drop that workaround. Scripts that relied on `~` must call `file home` / `file tildeexpand`.

### 7. Unicode string index and length

Tcl 9 treats characters outside the BMP as **one** string index unit. Tcl 8 stored them as surrogate pairs (often length 2). Any 8.6 workaround that stepped by two for emoji / supplementary-plane text must be removed on 9—and any code that assumed BMP-only length must be retested.

```tcl
set s "\U1F600"
puts [string length $s]
# Tcl 9: 1
# Legacy (Tcl 8.6) — often 2 because of surrogates
```

### 8. C stubs glance (extension owners)

Binary extensions compiled against Tcl 8 headers are not drop-in on Tcl 9. Expect:

- stubs / init differences (`Tcl_InitStubs` era discipline),
- size-type changes (**`Tcl_Size`** for lengths/indices in modern APIs),
- library naming with a **`tcl9`** prefix in many builds,
- **case-sensitive** `load` init function names.

Script authors feel this as “package will not load.” Extension authors need the C migration notes—doorway only here; chapter **14** expands.

Practical dual-support sketch for `pkgIndex.tcl` authors:

```tcl
# Sketch — choose the binary that matches the running major
if {[package vsatisfies [package provide Tcl] 9.0-]} {
    # load tcl9-prefixed library / case-accurate Init
} else {
    # Legacy (Tcl 8.6) — classic library name
}
```

Exact file names vary by TEA/nmake; the point for script owners is: **one `pkgIndex.tcl` may need two branches**, and copying an 8.6 `.so` into a 9 tree will not work.

---

## 2. Advanced concepts

### 1. More script-visible incompatibilities

**Octal literals.** Leading `0` is no longer octal. Use `0o755` style when octal is intended. Watch interactions with external tools that still speak classic C octal.

**Underscores in numbers.** Tcl 9 allows `1_000_000` in numeric strings—including some runtime validations. If user input must reject underscores, do not rely on `string is integer` alone.

**`string is integer` / `int()`.** Wide integers are accepted more consistently; `int()` no longer truncates to 32-bit the 8.6 way. Use explicit range checks and masks.

**Namespace variable resolution.** Unqualified names no longer fall back to globals the old way. Bring globals into scope with `global`, `variable`, `namespace upvar`, or fully qualified `::names`. Inside `namespace eval`, `env` and friends often need `::env` or an explicit link.

**Array index parsing.** Special characters in `$a(index)` need proper escaping; braced `${...}` nesting rules tightened.

**`glob`.** No matches → empty list (not an error). Drop logic that expected a throw; `-nocomplain` is effectively noise for that case.

**Removed legacy.** `case` → `switch`; old `puts nonewline` / `read nonewline` spellings → `-nonewline`; old `trace variable` / `vdelete` / `vinfo` → `trace add|remove|info variable`; `tcl_precision` gone—use `format`.

**`load` / pkgIndex.** Init names case-sensitive; dual 8/9 `pkgIndex.tcl` files must pick the right binary name (`tcl9…` vs classic).

**zipfs.** Tcl 9 can embed script libraries in a zip volume. Installers that write into `auto_path` entries must check writability—some paths may be inside `//zipfs:/`.

**Threaded builds.** Tcl 9 builds are threaded by default; `tcl_platform(threaded)` is gone—use `tcl::pkgconfig get threaded` for portable checks.

### 2. Windows encoding note

On some Windows setups, Tcl 9 executables advertise UTF-8 via manifest, so `encoding system` may differ from an 8.6 install on the same machine. Files written by old apps in a legacy code page need explicit channel encodings when read on 9. Do not assume `source -encoding [encoding system]` restores 8.6 behavior.

### 3. Migration posture (recommended order)

1. **Inventory** — binaries, patchlevels, Expect, critical script roots, binary packages.
2. **Encoding pass** — ensure sources are UTF-8 or explicitly tagged; fix channel profiles on untrusted I/O.
3. **Path pass** — replace `~` reliance; audit `glob` error assumptions.
4. **Unicode pass** — remove surrogate-pair workarounds; retest string index math.
5. **Namespace pass** — qualify globals; retest `namespace eval` blocks.
6. **Extension pass** — rebuild or replace packages for Tcl 9 stubs.
7. **Behavioral tests** — especially `exec`, sockets, and Expect timeouts/EOF.
8. **Dual-run** — where possible, run 8.6 and 9 in parallel on the same fixtures before cutover.

Keep migration tickets in engineering language (encoding, paths, Unicode, extensions)—link the official migration checklists from References when you need the full inventory.

### 4. What *not* to do

- Do not sprinkle `-profile tcl8` everywhere to “make tests green.”
- Do not rewrite working 8.6 appliance scripts in a laptop-only Tcl 9 dialect without a deployment plan.
- Do not migrate C extensions by copying object files between majors.

---

## 3. Applications and use cases

| Angle | Migration reality |
|-------|-------------------|
| **Application** | Embedded consoles upgrade with the product; script encoding and package binaries ship together. |
| **Systems** | Channel profile changes surface first on sockets, files, and pipes with dirty data. |
| **Security** | Dropping implicit tilde expansion removes a class of path surprises; strict encoding fails closed on garbage. |
| **Ops** | Expect + 8.6 bastions may lag; keep a compatibility matrix per jump host. |
| **SE** | CI should matrix **8.6 and 9** while dual support lasts; print patchlevel in artifacts. |

---

## Staff-level review checklist

- Change names the **target patchlevel(s)**; “Tcl 8” or “Tcl 9” alone is too vague for binaries.
- New files are UTF-8; legacy `source -encoding` is explicit and justified.
- No new reliance on implicit `~` expansion; uses `file home` / `file tildeexpand` on Tcl 9.
- I/O on untrusted bytes sets an intentional **encoding profile** (prefer `strict` or `replace`, not silent `tcl8`).
- String index/length logic retested for non-BMP text on Tcl 9.
- `glob` callers handle **empty list**.
- Namespace code uses `::` / `variable` / `global` correctly under Tcl 9 resolution rules.
- Binary packages rebuilt for Tcl 9; `pkgIndex.tcl` dual-path reviewed if supporting both majors.
- Rollback plan exists for appliance/embed cutovers.

---

## References

- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
- [Migrating C extensions to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+C+extensions+to+Tcl+9)
- [TIP 600](https://core.tcl-lang.org/tips/doc/trunk/tip/600.md)
- [encoding](https://www.tcl-lang.org/man/tcl9.0/TclCmd/encoding.html)
- [file](https://www.tcl-lang.org/man/tcl9.0/TclCmd/file.html)
- [string](https://www.tcl-lang.org/man/tcl9.0/TclCmd/string.html)
- [source](https://www.tcl-lang.org/man/tcl9.0/TclCmd/source.html)
- [Tcl_InitStubs](https://www.tcl-lang.org/man/tcl9.0/TclLib/InitStubs.html)
- [zipfs](https://www.tcl-lang.org/man/tcl9.0/TclCmd/zipfs.html)
- [Tcl 9.0 / Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
