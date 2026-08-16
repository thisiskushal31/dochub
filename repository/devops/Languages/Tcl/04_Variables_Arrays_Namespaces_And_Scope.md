# Variables, arrays, namespaces, and scope

[← Back to Tcl](./README.md)

## What this chapter covers

How Tcl stores state: **`set`**, **`unset`**, **`append`**, **arrays**, **`global`**, **`upvar`**, **`uplevel`**, **`namespace`**, and **`variable`**. You will learn lexical-looking patterns that are actually **call-frame and namespace** rules—and how **Tcl 9** tightened unqualified name resolution. Default narrative: **Tcl 9.0.x**; call out **8.6** where resolution differs.

Lists and dictionaries (structured values) are chapter **06**. Packages that *export* namespaces are chapter **10**.

---

## 1. Concepts

### 1. Scalars with `set`

`set name value` creates or updates a variable. `set name` (one argument) returns the current value—useful when `$` parsing is awkward.

```tcl
set host api.example.com
set host
# → api.example.com

set weird "a b"
puts [set weird]
```

Variables hold strings (EIAS). Commands decide whether that string is an integer, path, or list.

### 2. `unset` and existence

```tcl
set x 1
unset x
info exists x
# → 0
```

`unset -nocomplain` avoids errors when names are missing—handy in cleanup paths. Prefer explicit existence checks when absence is unexpected.

### 3. `append` (and friends)

`append var args…` concatenates onto a scalar in place—efficient for building strings.

```tcl
set msg ""
append msg "Hello, " "world"
```

Related patterns you will meet:

| Command | Role |
|---------|------|
| `append` | String concatenate onto scalar |
| `lappend` | Append elements to a **list** value (chapter **06**) |
| `incr` | Integer increment (chapter **05**) |

### 4. Arrays

An **array** is a collection of elements keyed by string names—not a single string value. You cannot `$array` as a whole meaningfully the way you read a scalar; you operate with `array` subcommands and `$array(key)`.

```tcl
set user(name) Ada
set user(uid) 1001
puts $user(name)
array get user
# → name Ada uid 1001   (flat key/value list)
array names user
array size user
array exists user
```

| Habit | Why |
|-------|-----|
| Use arrays for named fields / sparse maps in older code | Ubiquitous in brownfield |
| Prefer **dicts** for values you pass around as one item | Chapter **06** |
| Remember arrays are **not** first-class values | You pass names; you `array get` to snapshot |

```tcl
# Iteration pattern
foreach {k v} [array get user] {
    puts "$k=$v"
}
```

### 5. Procedures and local scope

Variables created inside a `proc` are **local** to that call unless linked outward.

```tcl
set ::counter 0
proc bump {} {
    global counter
    incr counter
}
```

Without `global`, `variable`, or `upvar`, assignment inside a proc creates a local.

### 6. `global`

`global name…` links local names to **global namespace** variables (`::name`). Effective inside `proc` / `apply` bodies. Outside that context it does nothing useful—do not expect `global` inside a bare `namespace eval` to set up locals (there is no proc frame).

```tcl
proc useEnv {key} {
    global env
    return $env($key)
}
```

Fully qualified form `global ns::var` still creates a **local** alias named `var` linked to `::ns::var`.

### 7. `variable` (namespace-aware)

Inside a namespace (and in procs belonging to that namespace), `variable name` brings a **namespace variable** into scope—creating it if needed. This is the usual way namespace state is shared among that namespace’s procs.

```tcl
namespace eval ::app {
    variable version 1
    proc getVersion {} {
        variable version
        return $version
    }
}
```

### 8. `upvar` and `uplevel`

**`upvar`** links a local name to a variable in another call frame (by level or absolute `#0` global frame). Classic use: pass variables by name (array or scalar) without copying.

```tcl
proc setByName {varName value} {
    upvar 1 $varName v
    set v $value
}
set x 0
setByName x 42
```

**`uplevel`** runs a script in another frame—powerful and easy to abuse. Prefer specific APIs over `uplevel` when possible. When required, pass scripts as proper lists:

```tcl
uplevel 1 [list set $varName $value]
```

### 9. Namespaces

Namespaces group commands and variables under a prefix (`::app::…`). They reduce global clashes in libraries and embeds.

```tcl
namespace eval ::app {
    proc hello {} { puts hello }
}
::app::hello
namespace current
namespace which -command hello
```

| Idea | Meaning |
|------|---------|
| `::` | Global / absolute path separator |
| Relative name | Resolved from current namespace (Tcl **9** rules—see Advanced) |
| `namespace export` / `import` | Selective command sharing (packages deepen this) |
| `namespace delete` | Removes a namespace tree |

---

## 2. Advanced concepts

### 1. Tcl 9 variable resolution (read this if you migrate)

In **Tcl 8.6**, unqualified variables often fell back to the **global** namespace if missing locally/current. In **Tcl 9**, unqualified names stay relative to the **current namespace**—no silent global overwrite/fallback in those cases.

Consequences:

- Inside `namespace eval`, use `::env`, `::tcl_platform`, or `namespace upvar :: env env`.
- Old code that wrote `ns::var` expecting global `::ns::var` from inside another namespace may break—fully qualify or `variable` / `global` / `namespace upvar`.
- Mysterious “variable does not exist” after a 9 upgrade is often this change—not flaky hardware.

```tcl
namespace eval ::demo {
    # Tcl 9 — be explicit
    puts $::tcl_platform(platform)
}
```

### 2. Arrays vs upvar traces

Tcl 9 fires array traces even when elements are modified through `upvar` links (8.6 could miss those). Migration can reveal latent trace callbacks—test trace-heavy frameworks.

### 3. Arrays are not dicts

| | Array | Dict |
|--|-------|------|
| First-class value? | No (collection of vars) | Yes (a string/value) |
| Pass to proc | By name + `upvar` | By value (or name if you want) |
| Nesting | Awkward | Natural |
| Order | Implementation-defined iteration | Key order semantics per dict ops |

Brownfield APIs often expose arrays; new code should default to **dict** unless you need array-specific features (`array statistics`, traces on elements, etc.).

### 4. `uplevel` and substitution

`uplevel` runs scripts with the callee’s quoting rules. Building scripts with string concatenation reintroduces chapter **03** hazards. Pattern:

```tcl
uplevel 1 [list foreach $vars $values $body]
```

### 5. Absolute vs relative command lookup

Commands resolve through namespace pathways (`namespace path`, imports, global). When debugging “wrong proc called,” print `namespace which -command name` and `info commands`. Packages (chapter **10**) layer on top.

### 6. `info` introspection (preview)

Useful checks while learning scope:

```tcl
info exists x
info vars
info globals
info locals
namespace which -variable version
```

Deeper introspection is chapter **09**.

### 7. Frame levels

`upvar 1` / `uplevel 1` = caller. `#0` = global frame. Off-by-one level bugs are classic in call-by-name helpers—write tests for nested procs.

---

## 3. Applications and use cases

| Angle | Pattern |
|-------|---------|
| **Application** | Host registers commands; scripts keep policy in namespaces to avoid colliding with product globals. |
| **Systems** | `env` and `tcl_platform` are global arrays—qualify them under Tcl 9 namespaces. |
| **Security** | `uplevel`/`upvar` with attacker-controlled variable **names** can touch unexpected frames—validate names. |
| **Ops** | Expect scripts share state via globals too freely; namespaces make long suites maintainable. |
| **SE** | Library authors: `namespace eval`, `variable`, export lists; avoid polluting `::`. |

---

## Staff-level review checklist

- Procs that need globals use `global` / `variable` / `namespace upvar`—not accidental locals.
- Tcl 9 targets fully qualify or link `env` / platform arrays inside namespaces.
- New structured data prefers **dict** unless arrays are required; no new public APIs that force array-only without reason.
- `upvar` levels documented or tested; no magic `uplevel` strings built with `$` interpolation.
- Namespace names are stable and prefixed (`::org::project::…`) for anything shared.
- `unset` cleanup paths considered for long-running embeds/event loops.

---

## References

- [set](https://www.tcl-lang.org/man/tcl9.0/TclCmd/set.html)
- [unset](https://www.tcl-lang.org/man/tcl9.0/TclCmd/unset.html)
- [append](https://www.tcl-lang.org/man/tcl9.0/TclCmd/append.html)
- [array](https://www.tcl-lang.org/man/tcl9.0/TclCmd/array.html)
- [global](https://www.tcl-lang.org/man/tcl9.0/TclCmd/global.html)
- [variable](https://www.tcl-lang.org/man/tcl9.0/TclCmd/variable.html)
- [upvar](https://www.tcl-lang.org/man/tcl9.0/TclCmd/upvar.html)
- [uplevel](https://www.tcl-lang.org/man/tcl9.0/TclCmd/uplevel.html)
- [namespace](https://www.tcl-lang.org/man/tcl9.0/TclCmd/namespace.html)
- [info](https://www.tcl-lang.org/man/tcl9.0/TclCmd/info.html)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
