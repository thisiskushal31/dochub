# Lists and dictionaries

[← Back to Tcl](./README.md)

## What this chapter covers

Tcl’s structured data: **lists** (ordered collections that are still strings at the language level) and **dictionaries** (`dict`), plus when to choose a **dict** versus an **array**. Proper list construction is the difference between reliable `eval`/`exec`/`{*}` use and quoting disasters. Default narrative: **Tcl 9.0.x**.

If you remember one rule: **build lists with list commands**, not with hand-joined spaces.

---

## 1. Concepts

### 1. What a list is

A Tcl list is a string that follows list syntax rules (whitespace-separated elements; braces/quotes protect metacharacters). Commands like `lindex` and `llength` parse that string as a list. Because of EIAS, the same characters might be “just a string” until a list command interprets them.

```tcl
set L [list a b c]
llength $L
# → 3
lindex $L 1
# → b
```

**Canonical construction:** `list`, `lappend`, `concat` (with care), `split` (when converting from delimited text). **Avoid:** `set L "$a $b $c"` when `$a` might contain spaces or braces.

### 2. Core list commands

| Command | Role |
|---------|------|
| `list a b c` | Build a proper list from arguments |
| `lindex $L i` | Element at index (`end`, `end-1`, …) |
| `lrange $L a b` | Sublist |
| `llength $L` | Length |
| `lappend L x y` | Append elements in place to variable `L` |
| `linsert` / `lreplace` / `lset` | Insert/replace/set by index |
| `lsearch` | Find index (exact/glob/regexp options) |
| `lsort` | Sort (ASCII, integer, dictionary, unique, …) |
| `lmap` | Map a script over elements → new list |
| `lassign` | Unpack into variables |
| `join` / `split` | Convert between lists and delimited strings |
| `concat` | Concatenate lists (see Advanced) |

```tcl
set nums [list 3 1 2]
set nums [lsort -integer $nums]
lassign $nums a b c
puts "$a $b $c"
```

```tcl
set doubled [lmap x {1 2 3} {expr {$x * 2}}]
# → 2 4 6
```

### 3. Proper lists and `{*}`

Once you have a proper list, splice it into a command safely:

```tcl
set files [list one.txt two.txt]
exec cat {*}$files
```

Contrast the fragile approach:

```tcl
# Fragile — breaks when names have spaces
# eval exec cat $files
```

Review smell: stringy `eval` next to path or argv data.

### 4. Nested lists

Lists nest. Braces in the printed form show structure:

```tcl
set nested [list [list a b] [list c d]]
lindex $nested 0
# → a b
lindex $nested 0 1
# → b
```

Multi-index `lindex`/`lset` paths are normal for small trees. For richer records, prefer **dicts**.

### 5. Dictionaries

A **dict** is a flat key/value string with dict syntax rules—first-class value you can return, nest, and pass without `upvar`.

```tcl
set user [dict create name Ada uid 1001]
dict get $user name
dict set user shell /bin/sh
dict exists $user uid
dict keys $user
dict for {k v} $user {
    puts "$k=$v"
}
```

| Operation | Typical command |
|-----------|-----------------|
| Create | `dict create`, `dict` with args |
| Read | `dict get`, `dict exists` |
| Write | `dict set`, `dict unset`, `dict append`/`lappend` |
| Iterate | `dict for`, `dict keys`, `dict values` |
| Merge | `dict merge`, `dict update`/`with` (Advanced) |

Nested dicts:

```tcl
dict set cfg db host localhost
dict get $cfg db host
```

### 6. Dict vs array (choose deliberately)

| Need | Prefer |
|------|--------|
| Value you can `return`, nest, store in a list | **dict** |
| Brownfield API that already uses arrays | **array** (+ `array get`/`set` bridges) |
| Traces on individual elements / array-specific stats | **array** |
| Config blobs, JSON-like structures (manually) | **dict** |
| `upvar`-style call-by-name mutation | **array** or dict-in-variable with `dict set` |

Bridge patterns:

```tcl
# array → dict
set d [dict create {*}[array get user]]

# dict → array
array set user [dict get $d]
# or: array set user {*}$d   when $d is a flat dict value
```

Exact bridging depends on shape; prefer explicit `dict create {*}[array get …]` for clarity.

### 7. `split` and `join` — when to convert, when to keep a list

`split` and `join` sit on the **boundary between delimited text and proper lists**. They are essential—and easy to misuse.

| Command | Direction | Role |
|---------|-----------|------|
| **`split`** *string* ?*chars*? | text → list | Cut on delimiter characters (default: whitespace) |
| **`join`** *list* ?*joinString*? | list → text | Insert a separator between elements |

```tcl
set line "ada:1001:/bin/sh"
lassign [split $line :] name uid shell
puts "$name uid=$uid shell=$shell"

set fields [list ada 1001 /bin/sh]
puts [join $fields :]
# → ada:1001:/bin/sh
```

#### When to `split` / `join` vs keep-as-list

| Situation | Prefer |
|-----------|--------|
| Data already arrived as a **proper list** (`argv`, `glob`, API return) | **Keep the list** — `lindex` / `foreach` / `{*}` |
| Building argv for `exec` / callbacks | **`list` / `lappend`**, then `{*}` — not `join` then re-parse |
| Reading a **simple** delimiter-separated line (no escapes/quotes) | **`split`** once at the edge, then list ops |
| Display, logs, CSV-*like* export | **`join`** at the edge for humans/files |
| Paths, filenames, untrusted blobs with spaces | **Never** round-trip through space-`join`/`split` |

```tcl
# Good — stay in list land
set files [glob -nocomplain *.log]
foreach f $files { puts $f }
exec cat {*}$files

# Bad — destroys structure when a name has spaces
# set blob [join $files " "]
# exec cat {*}[split $blob " "]
```

#### Traps: empty fields

`split` **keeps empty elements** when delimiters collide or sit at the ends—often what you want for columnar data, and a surprise when you assumed “words only.”

```tcl
split "a::b" :
# → a {} b          (empty middle field)
split ":a:" :
# → {} a {}         (leading/trailing empties)
split "" :
# → {}              (one empty element — not an empty list)
split "a:b:" :
# → a b {}
```

| Trap | What to do |
|------|------------|
| Empty fields from `::` | Decide: preserve column positions, or `lmap`/`lsearch` to drop empties **intentionally** |
| `split ""` → one-element list `{}` | Do not confuse with `llength == 0`; test explicitly |
| Joining then splitting with a delimiter that appears *inside* fields | Pick another delimiter, escape scheme, or real parser |

```tcl
# Drop empty fields only when that is the real grammar
set parts {}
foreach p [split $raw :] {
    if {$p ne {}} {
        lappend parts $p
    }
}
```

#### Traps: paths and whitespace

| Trap | Why it hurts |
|------|----------------|
| `split $path /` on Unix paths | Leading `/` → empty first element; fine for components, wrong if you `join` back naively without restoring the root |
| `split $line " "` on paths or argv text | Embedded spaces shatter one path into many words |
| `join [file split $path] /` carelessly | Prefer **`file join`** for platform-aware path construction (ch **08**) |
| Using `split` as a substitute for `file split` | Different rules; path APIs exist for a reason |

```tcl
file split "/var/log/app.log"
# → / var log app.log     (platform-aware components)

# Reconstruct with file join — not stringy join alone
file join / var log app.log
```

**Rule of thumb:** `split`/`join` are for **payloads with a declared delimiter**. Lists from Tcl commands and pathnames from `file`/`glob` should stay structured until you intentionally serialize them.

### 8. Small lab

```tcl
proc addUser {db name uid} {
    dict set db $name uid $uid
    return $db
}

set db [dict create]
set db [addUser $db ada 1001]
set db [addUser $db grace 1002]
puts [dict get $db ada uid]
puts [lsort [dict keys $db]]
```

Immutable-style updates (`dict set` returns new value when used as a function of a value) keep data flow obvious—assign back to the variable.

---

## 2. Advanced concepts

### 1. Canonicalization and shimmering

List and dict commands may change internal representation and sometimes the canonical string form while preserving list/dict meaning. Do not compare structures with `eq`/`==` on their string prints when order of dict keys or brace formatting may differ—use `dict`/`list` operations or sort keys before comparing.

### 2. `concat` vs `list` vs `{*}`

- `list a b` → always a two-element list of those values.
- `concat` merges lists at the top level—handy, but easy to flatten one level too many.
- `{*}` splices at call sites without building an intermediate eval string.

```tcl
set a [list 1 2]
set b [list 3 4]
concat $a $b
# → 1 2 3 4
list $a $b
# → {1 2} {3 4}
```

### 3. `split` / `join` under review (serialization edges)

Concepts covered the everyday traps. In reviews, push converters to the **edge**:

- **Inbound:** `split` (or a real parser) once → validate field count → list/dict ops forever after.
- **Outbound:** `join` once for the wire/file format you own.
- **Never:** `join` → pass through a shell → `split` as a poor man’s RPC.

Quoted CSV, escaped delimiters, or nested structures need a dedicated parser—not deeper `split` cleverness. For command arguments, prefer keeping data as lists from the start.

### 4. `lsearch` and sorting options

```tcl
lsearch -exact $hay $needle
lsearch -glob $hay *.tcl
lsort -integer -unique $nums
lsort -dictionary $versions
```

Know whether you want exact match or pattern match; `-inline` returns values instead of indices.

### 5. `dict update` / `dict with`

These temporarily map dict keys to variables for in-place editing—powerful, scope-sensitive, easy to misuse in reviews. Prefer plain `dict get`/`dict set` until you need the concision.

```tcl
dict with user {
    set name [string toupper $name]
}
```

Document when `dict with` mutates caller state.

### 6. Empty lists and `glob`

Remember Tcl 9 `glob` returns an empty list on no match—callers should handle `llength == 0`, not assume an error (chapter **02**).

### 7. Performance literacy

For large structures, prefer dict/list algorithms (`lmap`, `lsort`, dict ops) over repeated string concatenation. Still, clarity beats micro-optimization in ops scripts unless profiling says otherwise.

### 8. Security angle

Lists protect boundaries only if you **built** them correctly. Converting untrusted text with naive `split` and then `{*}` into `exec` is still dangerous—validate and escape at the `exec` boundary (chapter **08**, **16**).

---

## 3. Applications and use cases

| Angle | Pattern |
|-------|---------|
| **Application** | Host APIs often return Tcl lists of IDs; keep them as lists until display time. |
| **Systems** | `chan`/`exec` argv building with `{*}` and `list`. |
| **Security** | Proper lists reduce injection-like mistakes; they do not sanitize semantics of commands you invoke. |
| **Ops** | Inventory scripts: dict of host → attributes; `dict for` over reports. |
| **SE** | Public library APIs should take/return **dicts** (or well-documented lists), not require callers to `upvar` arrays, unless matching historical interfaces. |

---

## Staff-level review checklist

- Lists built with `list`/`lappend`/`lmap`, not `"$a $b"` concatenation, when elements may contain whitespace.
- `eval` of command lines replaced with `{*}` where possible.
- New code prefers **dict** for record-like data; arrays justified when needed.
- Nested data uses multi-index list ops or nested dicts—not ad-hoc delimiter encodings.
- Comparisons of dicts/lists use structured operations, not brittle string equality.
- `split`/`join` call sites note delimiter limitations, empty-field behavior, and path/`argv` keep-as-list rules.
- Empty-list cases (`glob`, searches) handled explicitly on Tcl 9.

---

## References

- [list](https://www.tcl-lang.org/man/tcl9.0/TclCmd/list.html)
- [lindex](https://www.tcl-lang.org/man/tcl9.0/TclCmd/lindex.html)
- [lrange](https://www.tcl-lang.org/man/tcl9.0/TclCmd/lrange.html)
- [lappend](https://www.tcl-lang.org/man/tcl9.0/TclCmd/lappend.html)
- [lsearch](https://www.tcl-lang.org/man/tcl9.0/TclCmd/lsearch.html)
- [lsort](https://www.tcl-lang.org/man/tcl9.0/TclCmd/lsort.html)
- [lmap](https://www.tcl-lang.org/man/tcl9.0/TclCmd/lmap.html)
- [concat](https://www.tcl-lang.org/man/tcl9.0/TclCmd/concat.html)
- [split](https://www.tcl-lang.org/man/tcl9.0/TclCmd/split.html)
- [join](https://www.tcl-lang.org/man/tcl9.0/TclCmd/join.html)
- [dict](https://www.tcl-lang.org/man/tcl9.0/TclCmd/dict.html)
- [array](https://www.tcl-lang.org/man/tcl9.0/TclCmd/array.html)
- [Tcl — EIAS / values](https://www.tcl-lang.org/man/tcl9.0/TclCmd/Tcl.html)
