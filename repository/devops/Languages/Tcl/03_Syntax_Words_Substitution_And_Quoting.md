# Syntax: words, substitution, and quoting

[← Back to Tcl](./README.md)

## What this chapter covers

The **twelve syntax rules** that define Tcl—taught so a newcomer can *see* what the machine does on every line. You will learn how **commands** and **words** are formed, how **`""`**, **`{}`**, **`[]`**, **`$`**, **`{*}`**, and **backslashes** interact, how **comments** attach, and why **order of substitution** makes or breaks `eval`, `expr`, and Expect glue. Default narrative: **Tcl 9.0.x**.

Chapter **01** gave the Linux + lifecycle picture. This chapter is the **microscope on one command**. Wrong quoting is the #1 Tcl bug class—master this before trusting any clever one-liner.

---

## 1. Concepts

### 0. From script bytes to a finished command (slow motion)

Before the numbered rules, watch **one** line travel through the runtime. On Linux, `tclsh` has already opened your script file and is reading text. Suppose the next line is:

```tcl
puts "sum=[expr {2 + 2}]"
```

**Step A — Read a command.**  
The reader collects characters until a command separator (newline or semicolon outside quotes/braces). That chunk is one command string.

**Step B — Split into raw words (with quoting rules).**  
Rough word boundaries, respecting `"…"`, `{…}`, and nesting:

| Raw word | Kind |
|----------|------|
| `puts` | bare word |
| `"sum=[expr {2 + 2}]"` | double-quoted word |

**Step C — Substitute left to right inside each word that allows it.**  
Inside the quoted word:

1. See `[expr {2 + 2}]` → **command substitution**.
2. Recursively evaluate the nested script `expr {2 + 2}`:
   - words: `expr` | `{2 + 2}`
   - braces protected the math text from `$`/`[]` while *building* the `expr` call
   - `expr` computes `4` and returns the string `4`
3. Replace the brackets with `4`.
4. The quoted word is now the single string `sum=4`.

**Step D — Dispatch.**  
Command table lookup: first word `puts`. Arguments: one word `sum=4`.  
`puts` writes to the `stdout` channel → on Linux, bytes hit FD 1 → your terminal or CI log.

**Step E — Result.**  
`puts`’s result is normally empty; the *visible* effect was the write. The interpreter moves to the next command.

Hold this slow-motion loop for every example below: **read → word-split → substitute → dispatch → side effects / result**.

### 1. The evaluation loop (rules 1–3)

**Rule 1 — Commands.** A script is one or more commands. **Newlines** and **semicolons** separate commands (unless quoted). A close bracket `]` ends a command during command substitution.

**Rule 2 — Evaluation.** Each command is handled in two steps:

1. Parse into **words** and perform **substitutions** (same rules for every command).
2. Look up the command named by the **first word**; pass the remaining words as arguments. The command decides what each argument *means* (integer, list, script, path, …).

**Rule 3 — Words.** Words are separated by whitespace (space/tab). Newlines are command separators, not ordinary word separators, unless quoted.

```tcl
puts Hello
set x 1; incr x
# Two commands on one line, separated by semicolon
```

Mental model: *substitute, then dispatch*. There is no separate “expression language” outside `expr`—and even `expr` receives ordinary words after substitution.

**What “dispatch” does on the machine:** the interpreter finds a **command procedure** (C function or Tcl `proc`) bound to that name and calls it with the argument list. Built-ins live in `libtcl`; host apps add more; `proc` adds yours. If the name is missing → `invalid command name "…"`.

### 2. Double quotes (rule 4)

If a word starts with `"`, it ends at the next unescaped `"`. Inside quotes:

- whitespace, semicolons, and newlines are **ordinary characters** (they do not split commands/words),
- **`$`**, **`[]`**, and **backslash** substitution **still run**,
- the quote characters themselves are not part of the value.

```tcl
set name world
puts "Hello, $name"
# → Hello, world
```

Use quotes when you need one word that still interpolates.

### 3. Braces (rule 6)

If a word starts with `{` (and is not argument expansion—rule 5), it ends at the **matching** `}`. Braces nest. Inside braces:

- **no** `$` / `[]` / normal backslash substitution,
- **exception:** backslash-newline is still collapsed (line continuation),
- whitespace and semicolons are literal.

```tcl
set body {
    puts "Hi $name"
}
# $name is NOT substituted when defining body — only later, if something evals body
```

**Staff instinct:** script bodies for `if`, `while`, `proc`, `expr {…}` almost always use braces so substitution happens under the command’s control—not while the command word list is being built.

### 4. Command substitution (rule 7)

`[ … ]` runs a nested script; the result of the **last** command in that script replaces the brackets. May appear inside quotes; **not** inside braces (unless you later `eval` the braced text).

```tcl
set n [expr {2 + 2}]
puts "n=$n"
```

Nested scripts are full Tcl—multiple commands allowed—so keep them short in review.

### 5. Variable substitution (rule 8)

Forms you will see constantly:

| Form | Meaning |
|------|---------|
| `$name` | Scalar variable |
| `$name(index)` | Array element; `index` *does* get `$` / `[]` / `\` substitution |
| `${name}` | Scalar (or array form inside) when name needs delimiters |

```tcl
set greeting Hello
puts $greeting
set arr(x) 1
puts $arr(x)
puts ${greeting},world
```

Names in `$name` use ASCII letters/digits/underscore and namespace separators (`::`). Weird names need `set`’s one-argument read form or `${…}`.

**Tcl 9 note:** braced `${…}` counts nested braces; array indices with quotes/parentheses need proper escaping (chapter **02**).

### 6. Argument expansion `{*}` (rule 5)

If a word begins with `{*}` followed by a non-whitespace character, Tcl:

1. strips the `{*}`,
2. substitutes the remainder as a normal word,
3. parses that result as a **list**,
4. splices the list’s elements as **additional words** into the command.

```tcl
set opts [list -encoding utf-8 -translation auto]
open out.txt w {*}$opts
# Equivalent in spirit to: open out.txt w -encoding utf-8 -translation auto
```

`{*}` is the safe cousin of building command lines with `eval`. Prefer `{*}` + proper lists over stringy `eval`.

### 7. Backslash substitution (rule 9)

Outside braces, `\` escapes the next character or introduces a known sequence (`\n`, `\t`, `\uXXXX`, `\UXXXXXXXX`, octal/hex forms, etc.). Inside braces, only **backslash-newline** is special (continuation → single space).

```tcl
puts "line1\nline2"
puts {raw $name and [cmd]}
# braces: dollar and brackets stay literal
```

### 8. Comments (rule 10)

`#` starts a comment only where Tcl expects the **first character of the first word** of a command. Mid-command `#` is just data.

```tcl
# This is a comment
puts ok; # NOT a comment — this is another command word starting with #
```

```tcl
puts ok ;# common idiom: semicolon ends prior command, then # comments
```

### 9. Order of substitution (rule 11)

Each character is processed **once** while building words. After `$var` or `[cmd]` yields a value, that value is inserted **verbatim**—no second round of `$` / `[]` on the inserted text (unless a later command such as `eval` or `subst` intentionally reprocesses it).

Substitutions run **left to right**, each completed before the next:

```tcl
set y [set x 0][incr x][incr x]
# y becomes 012
```

### 10. Substitutions do not split words (rule 12)

Except for `{*}`, substitution never creates new word boundaries. If `$x` contains spaces, it is still **one** word.

```tcl
set x "a b"
puts $x
# puts receives one argument: a b
```

This is why hand-built `eval "cmd $x"` is dangerous and why lists/`{*}` matter.

### 11. Quotes vs braces — decision table

| Need | Prefer |
|------|--------|
| Interpolate `$` / `[]` in one word | `"…"` |
| Protect a script/expr body until later | `{…}` |
| Splice a list into args | `{*}…` |
| Literal `$` / `[` without braces | backslash escapes in quotes |

```tcl
set name Ada
expr {$name eq "Ada"}
# Wrong pattern: expr "$name eq \"Ada\"" invites double-evaluation bugs
```

### 12. Small lab — see the rules

```tcl
set a 1
set b [list $a [expr {$a + 1}]]
puts $b
# → 1 2   (a proper list as a string)

proc greet {who} {
    puts "Hello, $who"
}
greet World

set args [list World]
greet {*}$args
```

---

## 2. Advanced concepts

### 1. Double evaluation (the classic footgun)

If you build a string that contains `$` or `[]` and then `eval` it, substitution runs again. That is powerful for intentional metaprogramming and catastrophic for untrusted input.

```tcl
set userInput {$env(HOME)}
# Dangerous if eval'd: would expand env
# Prefer list-based APIs and {*} 
```

Review questions:

- Was this string meant as **data** or as a **script**?
- Can `{*}` + `list` replace `eval`?
- Is `subst` required, and with which flags?

### 2. `expr` and bracing

`expr` performs its own parsing. Pass expressions in braces so Tcl does not substitute before `expr` sees operators—and so operators are not exposed to an extra substitution pass.

```tcl
set i 3
expr {$i * 2}
# Good default

# Fragile: expr $i * 2   — word splitting / operator exposure risks
```

### 3. Command separators vs quoted newlines

A newline inside quotes or braces does not end the command. Large braced bodies can contain many logical lines—that is normal for `proc` / `if`.

### 4. `{*}` and empty lists

`{*}{}` or `{*}[list]` splices **zero** words—useful and easy to miss in reviews when optional flags disappear.

### 5. Comments and interactive pastes

Because `#` only comments at command-start, pasting JSON or shell fragments into Tcl often “eats” the wrong lines. When embedding foreign text, brace it or quote it so `#` is data.

### 6. Interaction with Tcl 9 parsing tweaks

Stricter `${…}` nesting and array-index escaping can break old generated code that assumed 8.6’s looser parse. When a brownfield script “fails to parse” only on 9, check those forms before hunting logic bugs.

### 7. `subst` (preview)

`subst` reprocesses a string for `$` / `[]` / backslash with optional control flags. It is a sharp tool—chapter **09**/security material covers safer patterns. Do not reach for `subst` to fix quoting you do not understand; fix the quoting.

---

## 3. Applications and use cases

| Angle | Where syntax rules decide outcomes |
|-------|-------------------------------------|
| **Application** | Embedded DSLs are mostly braced scripts calling host commands—quoting errors become product bugs. |
| **Systems** | Building `exec` argument lists: lists + `{*}` beat string concatenation. |
| **Security** | Any `eval`/`uplevel`/`subst` on attacker-influenced text is a critical finding. |
| **Ops** | Expect `send`/`expect` patterns mixed with Tcl substitution—brace regexes and patterns deliberately. |
| **SE** | Code review checklists should include “braces on `expr`/`if`/`while` bodies” as a default nits. |

---

## Staff-level review checklist

- [ ] `expr`, `if`, `while`, `for`, `proc` bodies use **braces** unless there is a documented reason not to.
- [ ] No `eval` of concatenated strings where `{*}` + `list` would work.
- [ ] User-controlled data is never fed to `eval` / `subst` / `uplevel` without a hard guarantee it is not a script.
- [ ] `{*}` is used when splicing argv/flag lists; reviewers confirm the spliced value is a **proper list**.
- [ ] Comments after commands use `;#` (or a real newline), not a bare mid-command `#` expecting comment semantics.
- [ ] Reviewers can explain why `"$x"` vs `$x` vs `{ $x }` was chosen at each call site that matters.

---

## References

- [Tcl — syntax rules](https://www.tcl-lang.org/man/tcl9.0/TclCmd/Tcl.html)
- [expr](https://www.tcl-lang.org/man/tcl9.0/TclCmd/expr.html)
- [set](https://www.tcl-lang.org/man/tcl9.0/TclCmd/set.html)
- [list](https://www.tcl-lang.org/man/tcl9.0/TclCmd/list.html)
- [eval](https://www.tcl-lang.org/man/tcl9.0/TclCmd/eval.html)
- [subst](https://www.tcl-lang.org/man/tcl9.0/TclCmd/subst.html)
- [Tcl 9.0 / Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
