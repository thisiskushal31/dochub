# Control flow, procs, and return

[← Back to Tcl](./README.md)

## What this chapter covers

How Tcl makes decisions and repeats work: **`if`**, **`switch`**, **`while`**, **`for`**, **`foreach`**, **`incr`**, how **`proc`** defines commands, what **`return`** codes mean, a glance at **`apply`**, **`expr` discipline** (with **`::tcl::mathop`**), and **`tailcall`** literacy. Bodies are just words—usually **braced**—so chapter **03** quoting rules apply everywhere here. Default: **Tcl 9.0.x**.

---

## 1. Concepts

### 1. `if`

```tcl
if {$n < 0} {
    puts negative
} elseif {$n == 0} {
    puts zero
} else {
    puts positive
}
```

| Rule | Practice |
|------|----------|
| Condition | Prefer `if {expr}` so the expression is protected |
| Bodies | Braced scripts |
| Truth | `0` and empty string are false; other strings often true—be explicit with comparisons |

`if` is an ordinary command. Messy quoting produces weird branches—not “parser magic.”

### 2. `switch`

```tcl
switch -exact -- $cmd {
    start { puts starting }
    stop  { puts stopping }
    default { puts "unknown: $cmd" }
}
```

Common option patterns:

| Form | Use |
|------|-----|
| `-exact` | String equality (good default for commands) |
| `-glob` | Glob patterns |
| `-regexp` | Regular expressions (brace patterns) |
| `--` | End of options when the value might look like a flag |

Arm bodies can be braced scripts. Avoid the removed legacy `case` command (gone in Tcl 9).

### 3. `while`

```tcl
set i 0
while {$i < 3} {
    puts $i
    incr i
}
```

Condition is an expression (brace it). Infinite loops in event-driven programs may need `after` / `update` patterns (chapter **11**)—do not busy-spin in GUI/Expect hosts.

### 4. `for`

```tcl
for {set i 0} {$i < 3} {incr i} {
    puts $i
}
```

Three words: **init** script, **condition** expression, **next** script, then body. Same bracing discipline as `while`.

### 5. `foreach`

```tcl
foreach item {a b c} {
    puts $item
}

foreach {k v} [list name Ada uid 1001] {
    puts "$k=$v"
}
```

`foreach` can walk multiple lists in parallel and bind multiple variables per iteration (key/value pairs are the usual dict/`array get` pattern). Prefer `foreach` over hand-rolled index loops when iterating lists.

### 6. `incr`

```tcl
set n 10
incr n
incr n -3
```

Expects an integer-looking value. Wide-integer behavior differs slightly across 8.6/9 (chapter **02**)—do not use `incr` as a bit-truncation tool.

### 7. `proc`

```tcl
proc greet {who {punct !}} {
    return "Hello, ${who}${punct}"
}
puts [greet Ada]
puts [greet Ada .]
```

| Piece | Meaning |
|-------|---------|
| Name | New command (can be namespaced: `proc ::app::greet …`) |
| Args | List of parameter names; `{name default}` for optional args |
| `args` | Special trailing formal collects remaining arguments as a list |
| Body | Braced script; local scope by default |

```tcl
proc sum {args} {
    set t 0
    foreach n $args { incr t $n }
    return $t
}
sum 1 2 3
```

### 8. `return` and result codes

`return` ends a proc (or `uplevel`’d script) with an optional value. Options control **exception codes**—not just “yield a string.”

```tcl
proc find {lst needle} {
    set i [lsearch -exact $lst $needle]
    if {$i < 0} {
        return -code error "not found: $needle"
    }
    return $i
}
```

Conceptual code families you must recognize:

| Code | Everyday meaning |
|------|------------------|
| `ok` | Normal result |
| `error` | Error (caught by `catch` / `try`) |
| `return` | Return from caller (used carefully with `-level`) |
| `break` / `continue` | Loop control propagated as codes |
| `break`/`continue` via `return -code` | Can synthesize loop control |

```tcl
proc earlyExit {} {
    return -code break
}
while 1 {
    earlyExit
}
# loop ends — advanced pattern; use sparingly and document
```

Default mental model for staff review: **normal `return`**, **`return -code error`**, and let `break`/`continue` stay in the loop body unless you have a library reason.

### 9. `apply` (glance)

`apply` runs an anonymous proc-like body without `proc`’s lasting command name—useful for callbacks and one-off closures with optional namespace.

```tcl
set f {{x} {expr {$x * 2}}}
puts [apply $f 21]
# → 42
```

```tcl
apply {{} {variable version; return $version}} ::app
```

Reach for `apply` when a named `proc` would be noise; reach for `proc` when you need a stable public command.

### 10. `expr` discipline (and a glance at `::tcl::mathop`)

Almost every `if` / `while` / `for` condition eventually touches **`expr`** (directly or inside braces). Treat `expr` as its own mini-language with one non-negotiable habit: **brace the expression** so Tcl substitution does not rewrite it before `expr` parses it.

```tcl
# Preferred — braces protect the expression
set n 3
puts [expr {$n * 2 + 1}]
# → 7

if {$n > 0 && $n < 10} {
    puts in-range
}
```

| Habit | Why |
|-------|-----|
| `expr {…}` | `$` / `[]` inside still work; untrusted expansion and double-evaluation hazards shrink |
| Avoid `expr $a + $b` | Unbraced forms invite quoting bugs and historical security footguns |
| Prefer `incr` for ±1 on integers | Clearer and avoids an extra `expr` where `incr` is enough |
| Validate before math | `string is integer -strict` (ch **07**) on external input |

Operators inside braced `expr` are the usual arithmetic/logic set (`+`, `-`, `*`, `/`, `%`, `**`, comparisons, `&&` / `||` / `!`, bitwise ops, ternaries, math functions like `sqrt`). Exact operator table lives in the `expr` man page—learn the bracing rule first, then look up rare operators.

**`::tcl::mathop` — math as ordinary commands**

Tcl also exposes many operators as **commands** under the `::tcl::mathop` namespace (ensemble-style). Useful when you want math without nesting `expr`, or when building pipelines of list operations:

```tcl
namespace path {::tcl::mathop ::tcl::mathfunc}

puts [+ 1 2 3]
# → 6
puts [* 4 5]
# → 20
puts [ > 3 2 ]
# → 1  (true)

# Without altering namespace path:
puts [::tcl::mathop::+ 10 20]
```

| Reach for… | When… |
|------------|--------|
| Braced `expr {…}` | Inline formulas, conditions, one-off arithmetic |
| `::tcl::mathop` commands | Multi-operand folds (`+` over many args), clearer `{*}`-style composition |
| `incr` / dedicated commands | Simple integer bumping |

Staff literacy: recognize `::tcl::mathop::+` in a PR as intentional—not a typo for `expr`. Do not mix styles randomly inside one proc.

---

## 2. Advanced concepts

### 1. Why bracing is non-negotiable here

```tcl
# Fragile — substitution timing / word splitting hazards
# if $flag { … }

# Preferred
if {$flag} { … }
```

The same applies to `while`/`for` conditions and most `expr` call sites inside them.

### 2. `switch` body quoting

When the pattern map is stored in a variable, use proper list construction so patterns with spaces survive:

```tcl
set arms [list \
    start {puts starting} \
    stop  {puts stopping} \
    default {puts other}]
switch -exact -- $cmd $arms
```

Building `switch` maps with string concatenation is a defect waiting to happen.

### 3. `return -level` and tail control

`return -level N` / combined `-code` options implement advanced control-flow libraries. In application scripts, prefer readable `return`/`error`/`break`. If you see `-level` in a PR, demand a comment and tests.

### 4. Errors vs return values

Tcl style often uses:

- **return values** for expected outcomes,
- **`error` / `return -code error`** for unexpected failures,
- **`catch` / `try`** at boundaries (chapter **09**).

Do not encode failure only as magic strings (`"ERROR"`) when a real error code would compose better with `catch`.

### 5. Recursion and deep call stacks

Tcl can recurse, but deep recursion in ops scripts is usually a smell—prefer explicit stacks/`while`. Embeds may have tighter stack limits than your laptop.

### 6. `foreach` over dictionaries

```tcl
dict for {k v} $d {
    puts "$k=$v"
}
```

`dict for` is clearer than converting to a flat list when you already hold a dict (chapter **06**).

### 7. Renaming and wrapping commands

`rename` and ensemble wrapping appear in frameworks. Control-flow bugs sometimes come from a wrapped `unknown` or renamed `proc`. Introspect with `info body` / `info args` when behavior disagrees with source on disk.

### 8. `tailcall` literacy

**`tailcall`** replaces the **current** procedure invocation with another command, instead of nesting a normal call underneath and waiting for it to return. When it applies, you avoid growing the Tcl call stack for “last action is: call something else.”

**What it is (mental model)**

```text
Normal call:    proc A → calls B → B returns → A continues/returns
tailcall:       proc A → tailcall B  ⇒  A’s frame is replaced by B
                (A does not resume after B)
```

**When to reach for it**

| Use `tailcall` when… | Prefer ordinary calls when… |
|----------------------|-----------------------------|
| The **last** act of a proc is “invoke this other command” and you care about stack depth / trampolines | You need to run code *after* the callee returns |
| Implementing a dispatcher / state-machine hop that would otherwise recurse deeply | The call is mid-body, or you need the callee’s result for further work in *this* frame |
| A library pattern documents tail-call chaining | A simple `return [other …]` is clearer and depth is tiny |

Small example — dispatcher without stacking frames:

```tcl
proc handle {state args} {
    switch -exact -- $state {
        init {
            puts "boot"
            tailcall handle ready {*}$args
        }
        ready {
            puts "ready args=[join $args ,]"
            return ok
        }
        default {
            return -code error "unknown state: $state"
        }
    }
}

puts [handle init x y]
# boot
# ready args=x,y
# → ok
```

Contrast: `return [handle ready {*}$args]` from `init` also works for this tiny case, but each hop still pays a normal call frame. `tailcall` is the tool when hops are deep or you are writing explicit trampolines.

**Review habits**

- Demand a one-line comment when `tailcall` appears in application scripts.
- Remember: nothing in the caller runs *after* a successful `tailcall`.
- Pair with chapter **09** when errors must surface from the *replacement* command’s context.

---

## 3. Applications and use cases

| Angle | Pattern |
|-------|---------|
| **Application** | Host commands are often implemented as C, but policy branches live in Tcl `if`/`switch` scripts shipped beside the binary. |
| **Systems** | State machines for protocol scripts: `switch` on events, `while` on session lifetime. |
| **Security** | `expr` in conditions must not interpolate untrusted strings without bracing and validation. |
| **Ops** | Expect flows are control-heavy; timeouts/`break` interactions need clear proc boundaries. |
| **SE** | Small procs with explicit `return -code error` beat giant monolith scripts for testability. |

---

## Staff-level review checklist

- [ ] Conditions and loop headers use braced expressions.
- [ ] `switch` includes `--` when the subject string may start with `-`.
- [ ] No legacy `case` command in Tcl 9 trees.
- [ ] Failure paths use error codes (or documented `catch` contracts), not silent empty returns, unless intentional.
- [ ] `return -code break/continue` and `-level` are rare, justified, and tested.
- [ ] Public procs live in namespaces; names collide less than global `proc do {}`.
- [ ] `apply` used for local callbacks—not as an obfuscation layer.
- [ ] `expr` call sites are **braced**; mathop (`::tcl::mathop`) used deliberately when chosen over `expr`.
- [ ] `tailcall` is rare, commented, and actually in tail position (no “code after” illusions).

---

## References

- [if](https://www.tcl-lang.org/man/tcl9.0/TclCmd/if.html)
- [switch](https://www.tcl-lang.org/man/tcl9.0/TclCmd/switch.html)
- [while](https://www.tcl-lang.org/man/tcl9.0/TclCmd/while.html)
- [for](https://www.tcl-lang.org/man/tcl9.0/TclCmd/for.html)
- [foreach](https://www.tcl-lang.org/man/tcl9.0/TclCmd/foreach.html)
- [incr](https://www.tcl-lang.org/man/tcl9.0/TclCmd/incr.html)
- [proc](https://www.tcl-lang.org/man/tcl9.0/TclCmd/proc.html)
- [return](https://www.tcl-lang.org/man/tcl9.0/TclCmd/return.html)
- [apply](https://www.tcl-lang.org/man/tcl9.0/TclCmd/apply.html)
- [expr](https://www.tcl-lang.org/man/tcl9.0/TclCmd/expr.html)
- [mathop](https://www.tcl-lang.org/man/tcl9.0/TclCmd/mathop.html) — `::tcl::mathop` operator commands
- [tailcall](https://www.tcl-lang.org/man/tcl9.0/TclCmd/tailcall.html)
- [catch](https://www.tcl-lang.org/man/tcl9.0/TclCmd/catch.html)
