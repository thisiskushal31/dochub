# Strings, regex, encoding, and Unicode

[← Back to Tcl](./README.md)

## What this chapter covers

How Tcl treats **strings** as Unicode character sequences, how **`string`** and **`regexp`/`regsub`** work day to day, how **`format`/`scan`** handle printf-style text, and how **`encoding`** / **`binary`** sit at the boundary between characters and bytes. Default narrative is **Tcl 9.0.x**. **Tcl 8.6** is brownfield literacy—especially where indexing and script encoding diverge from 9.

You leave able to choose `string` vs list/`dict` ops, write braced regex that survives substitution, convert at I/O boundaries, and review scripts that mishandle UTF-8 or binary payloads.

---

## 1. Concepts

### 1. Everything is a string — but commands still interpret

At the language level, a Tcl value is a string: a sequence of Unicode characters. Commands decide whether that string means an integer, a list, a script, or “just text.” EIAS does **not** mean you should splice structured data with `string range` instead of list/`dict` commands. It means the runtime has one value representation and many interpretations.

Mental model for text work:

| Layer | What you hold | Typical tools |
|-------|----------------|---------------|
| Characters (logical) | Unicode string | `string`, `regexp`, `regsub` |
| Bytes (on wire / disk) | binary string | `binary`, `encoding convert*`, channel `-encoding` / `-translation` |
| Structured words | proper list / dict | list/`dict` (ch **06**) |

Cross the character/byte boundary **explicitly**. Silent mixing is the classic mojibake and truncation class.

### 2. The `string` ensemble

`string` is a multi-subcommand ensemble. Day-to-day staff literacy:

| Subcommand | Role |
|------------|------|
| `length` | Character count |
| `index` / `range` | Extract by character index |
| `first` / `last` | Find substring positions |
| `equal` / `compare` | Equality / ordering (`-nocase` available) |
| `match` | Glob-style match (`*` `?` `[…]`) |
| `map` | Multi-pair substitution (ordered) |
| `trim` / `trimleft` / `trimright` | Strip characters (default whitespace) |
| `tolower` / `toupper` / `totitle` | Case mapping |
| `is` | Type/property tests (`integer`, `double`, `boolean`, `list`, `digit`, …) |
| `repeat` / `reverse` | Build / reverse |
| `cat` | Concatenate without inserting separators |
| `replace` | Replace a character range |

Indices are **character** indices (see Advanced for Tcl 9 vs 8.6). Forms include integers, `end`, `end-N`, `end+N`, and `M±N` combinations documented under string indices.

```tcl
set s "ops-run-42"
puts [string length $s]           ;# 10
puts [string range $s 0 2]        ;# ops
puts [string index $s end]        ;# 2
puts [string first "-" $s]        ;# 3
puts [string equal -nocase OpS ops] ;# 1
puts [string is integer -strict 42] ;# 1
```

`string match` is glob, not regex:

```tcl
string match "*.log" "app.log"    ;# 1
string match -nocase "ERR*" "error" ;# 1
```

`string map` replaces each left-hand key with its right-hand value, scanning left-to-right with longest-first behavior within that pass—useful for escaping or small vocabularies without regex:

```tcl
set out [string map {& &amp; < &lt; > &gt;} $raw]
```

`string is` is for validation, not parsing. Prefer `-strict` when empty strings must fail (empty is “true” for several classes without `-strict`).

### 3. Regex: `regexp`, `regsub`, and `re_syntax`

Tcl’s regex engine is documented under **`re_syntax`** (ARE — advanced regular expressions, with Tcl-specific notes). Matching and substitution are separate commands:

- **`regexp`** — test / capture
- **`regsub`** — replace

Brace the pattern so `$`, `[`, and backslashes are not eaten by Tcl substitution before the regex engine sees them:

```tcl
set line "host=edge01 status=up"
if {[regexp {^host=(\S+)\s+status=(\S+)$} $line -> host status]} {
    puts "$host -> $status"
}
```

Useful switches (combine as needed):

| Switch | Effect |
|--------|--------|
| `-nocase` | Case-insensitive |
| `-all` | All matches (with `-inline` / indices behavior as documented) |
| `-inline` | Return list of matches instead of writing vars |
| `-indices` | Capture start/end index pairs |
| `-line` / `-linestop` / `-lineanchor` | Line-oriented semantics |
| `--` | End of switches (required when the pattern can start with `-`) |

`regsub` rewrites:

```tcl
regsub -all {\s+} $blob " " normalized
# or capture the result:
set normalized [regsub -all {\s+} $blob " "]
```

Backreferences in the replacement use `\1` style sequences as documented for `regsub`. Prefer named clarity via a small `proc` when replacements grow nested.

When **not** to use regex: nested markup, JSON, or anything you already have as a proper list/dict. Regex on shell-ish lines is fine; regex as a parser for hostile HTML is not.

### 4. Encoding: characters ↔ bytes

`encoding` bridges Tcl strings and external byte sequences:

| Command shape | Meaning |
|---------------|---------|
| `encoding names` | Available encoding names |
| `encoding system` | Encoding used for many OS string exchanges |
| `encoding convertfrom ?enc? bytes` | Bytes → Tcl string |
| `encoding convertto ?enc? string` | Tcl string → bytes (binary string) |
| `encoding profiles` | Named conversion profiles (Tcl 9) |

```tcl
set bytes [encoding convertto utf-8 "café"]
set text  [encoding convertfrom utf-8 $bytes]
```

Channel configuration (ch **08**) often sets `-encoding` so `gets`/`puts` do this for you. Use `encoding convert*` when you already hold a binary blob (HTTP body, protobuf field, encrypted payload).

### 5. `binary`: pack, unpack, and encode helpers

`binary format` / `binary scan` are the structured byte tools (think pack/unpack). `binary encode` / `binary decode` cover common transfer encodings (e.g. base64, hex) depending on build.

```tcl
set blob [binary format "Ia*" 42 "payload"]
binary scan $blob "Ia*" n s
```

For pure text, stay in `string`/`encoding`. Reach for `binary` when length prefixes, endianness, or fixed layouts matter.

### 6. `format` and `scan` (printf / sscanf literacy)

**`format`** and **`scan`** are the everyday **printf / sscanf** twins for **character strings**. Staff scripts use them for aligned logs, stable machine-readable lines, and light field parsing when a full regex would be noise.

| Command | C cousin | Role |
|---------|----------|------|
| **`format`** *fmt* *args…* | `printf` / `sprintf` | Build a string from a format and values |
| **`scan`** *string* *fmt* *varName…* | `sscanf` | Parse a string into variables (or return a list of values) |

#### `format` — small examples

```tcl
set id 42
set name Ada
puts [format "%s-%04d" $name $id]
# → Ada-0042

puts [format "host=%s load=%.2f" edge01 1.5]
# → host=edge01 load=1.50

# Width / alignment (handy in ops tables)
puts [format "%-10s %8d" ok 7]
# → ok              7
```

Common conversion letters you will see constantly: `%s` string, `%d` / `%i` integer, `%u` unsigned, `%x`/`%X` hex, `%f`/`%g` floating, `%%` literal percent. Width, precision, and flags (`-`, `0`, …) follow the usual printf-style rules documented on the `format` man page.

#### `scan` — small examples

```tcl
set line "id=42 score=3.5"
scan $line "id=%d score=%f" id score
puts "id=$id score=$score"
# → id=42 score=3.5

# Return values instead of writing variables:
set vals [scan "42,Ada" "%d,%s"]
# → 42 Ada
lassign $vals id name
```

`scan` returns the **number of conversions** when you pass variable names, or a **list of values** when you omit them—check the man page form you are using and test both success and partial match.

```tcl
if {[scan $line "%d:%s" code msg] != 2} {
    return -code error "bad line: $line"
}
```

#### `format` / `scan` vs `binary format` / `binary scan`

| Tool | Operates on | Typical job |
|------|-------------|-------------|
| **`format` / `scan`** | Unicode **character** strings | Logs, text protocols, human-facing tables, simple text records |
| **`binary format` / `binary scan`** | **Byte** strings | Length-prefixed frames, endian integers, packed structs on the wire |

```tcl
# Text world — characters
puts [format "%c" 65]
# → A

# Byte world — binary layout (ch §5 above)
set blob [binary format "Ia*" 42 "payload"]
binary scan $blob "Ia*" n s
```

**Do not** use `format`/`scan` for binary protocol offsets, and **do not** use `binary format` when you only need printf-style text. Mixing them is a common source of “works on ASCII, breaks on UTF-8” bugs—character indices and byte lengths diverge (Advanced §1).

When **not** to use `scan`: nested or quoted grammars, HTML/JSON, or hostile input that needs a real parser. Prefer `regexp` for flexible text patterns; prefer `split`/`lassign` when the delimiter grammar is truly simple (ch **06**).

---

## 2. Advanced concepts

### 1. Tcl 9 Unicode and indexing (vs 8.6 literacy)

In **Tcl 9**, strings are logically Unicode character sequences; `string length`, `string index`, and `string range` operate on **characters** (code points as Tcl defines them), not raw UTF-8 bytes. That is the default mental model for new scripts.

**Brownfield 8.6:** older trees sometimes mixed “byte-ish” assumptions, system encodings that were not UTF-8, and scripts saved in legacy code pages. Migration landmines include:

- Assuming `string length` equals byte length on disk
- Slicing “UTF-8 by bytes” with `string range` and corrupting multi-byte characters
- Reading files without setting channel `-encoding`
- Source files that were not UTF-8 while the runtime expected something else (Tcl 9’s script encoding defaults are stricter—pin behavior in ch **02**)

Rule of review: if a script computes offsets for a wire protocol, ask whether those offsets are **characters** or **bytes**. If bytes, use `binary` / `encoding convertto` and length of the binary string—not character indices into a decoded string.

### 2. Encoding profiles and failure modes (Tcl 9)

Tcl 9 adds **profiles** controlling what happens when conversion hits invalid bytes or unrepresentable characters (strict vs replace-style behaviors among the documented profiles). Prefer explicit profiles at trust boundaries (uploaded files, partner feeds) instead of inheriting a global default you never named.

Also distinguish:

- **`encoding system`** — OS-facing default
- **channel `-encoding`** — per-stream
- **script file encoding** — how the interpreter reads source

Changing `encoding system` globally in a long-lived process can surprise unrelated libraries. Prefer local convert or channel options.

### 3. Regex engine costs and quoting traps

Two failure modes dominate reviews:

1. **Substitution before regex** — unbraced patterns with `$`/`[]` mutate before compile. Brace patterns; pass data in the string argument.
2. **Catastrophic backtracking** — nested quantifiers on untrusted input can pin a CPU core. Cap input size, avoid user-supplied patterns on hot paths, or prefer `string`/`split` for fixed delimiters.

`regexp -inline -all` is convenient but can allocate large lists on huge haystacks—stream with `gets` when files are large (ch **08**).

### 4. Normalization, case, and identifiers

Unicode equality is not visual equality. Case folds and normalization forms (NFC/NFD) matter for usernames, inventory keys, and filenames arriving from macOS vs Linux. Tcl’s `string tolower` / `equal -nocase` help for simple ASCII-heavy ops data; for security-sensitive identity, define an explicit normalize-then-compare policy and keep it one function.

### 5. IDNA and hostnames (door)

Tcl ships IDNA-related support for internationalized domain names in the encoding/IDNA cluster of the manuals. Treat hostname display vs DNS wire forms as a dedicated conversion step—do not invent manual punycode with `regsub`.

### 6. Performance habits

- Prefer `string equal` / `eq` in `expr` over regex for fixed-string checks.
- Prefer `string map` for small finite vocabularies.
- Compile-once mindset: store patterns in variables; avoid rebuilding huge `regsub` pipelines inside tight loops without need.
- For multi-field records already whitespace-separated into words, `split` + list ops often beat one giant regex.

### 7. `string is` classes staff actually use

| Test | Typical check |
|------|----------------|
| `integer -strict` | IDs, ports, exit codes |
| `double -strict` | Measurements (still validate range yourself) |
| `boolean -strict` | Config flags (`true`/`false`/`yes`/`no`/…) |
| `list` | “Can this be parsed as a list?” before `lindex` on untrusted text |
| `ascii` / `print` / `graph` | Rough allowlists for tokens (not a full policy engine) |
| `digit` / `xdigit` / `alnum` | Character-class checks on short fields |

Remember: without `-strict`, empty strings pass many `string is` tests. That single switch prevents a surprising class of “blank config looked valid” bugs.

### 8. Glob vs regex vs exact

Three matching tools, three jobs:

| Tool | Pattern language | Prefer when |
|------|------------------|-------------|
| `string equal` / `eq` | Exact | Fixed tokens, enums |
| `string match` | Glob | Filenames, simple prefixes/suffixes |
| `regexp` | ARE (`re_syntax`) | Captures, alternation, character classes beyond glob |

Reviews often find regex where `string match "*.log"` or `string equal` would have been clearer and safer.

### 9. Channel encoding vs `encoding convert*`

If data still lives on a channel, configure the channel (`-encoding`, and in Tcl 9 often `-profile`) and use `gets`/`read`/`puts`. If data is already in a Tcl variable as bytes (or you need a one-shot conversion), use `encoding convertfrom` / `convertto`. Doing both—or neither—produces the classic “works on ASCII, breaks on café” incident.

For strict intake of UTF-8 files on Tcl 9, prefer an explicit strict profile on the channel so invalid sequences fail instead of silently replacing characters.

---

## 3. Applications and use cases

| Domain | How this chapter shows up |
|--------|---------------------------|
| **Application** | Config line parsing, template escaping, feature-flag strings, message formatting |
| **Systems** | Path basenames vs Unicode-aware trimming; binary protocol glue beside channels |
| **Security** | Validate with `string is` / allowlists before `expr` or `eval`; bound regex on untrusted text; never use regex as HTML sanitizer |
| **Operations** | Log scrubbing (`regsub` secrets → redacted), inventory normalization, Expect string matches (ch **15**) |
| **Software engineering** | Shared `normalizeId` / `escapeHtml` procs in a package (ch **10**); tests for UTF-8 fixtures on Tcl 9 and 8.6 CI images |

Concrete patterns:

- **Ops glue:** trim, match `*.cfg`, extract `key=value` with a braced regexp, reject non-`string is integer -strict` IDs.
- **Embedded tools:** convertfrom partner encoding once at the API edge; keep internals UTF-8 Tcl strings.
- **IR / SRE:** `regsub` to redact tokens before pasting into tickets—run on copies, not only on live buffers you still need to hash.

---

## Staff-level review checklist

- [ ] Patterns for `regexp`/`regsub` are **braced** (or otherwise safe from substitution).
- [ ] Character vs byte boundaries are explicit (`encoding` / `binary` / channel `-encoding`).
- [ ] No assumption that `string length` equals on-disk byte length for UTF-8 protocols.
- [ ] `string is … -strict` used where empty must not validate.
- [ ] Untrusted input does not supply regex patterns on hot or network-facing paths.
- [ ] HTML/JSON/XML not “parsed” with regex when structure matters.
- [ ] Tcl 8.6 brownfield paths document encoding assumptions; new code targets Tcl 9 Unicode indexing.
- [ ] Secret scrubbing uses explicit maps/regexes reviewed for false negatives (ch **16**).
- [ ] `format`/`scan` used for **text** layouts; `binary format`/`binary scan` reserved for **byte** layouts—call sites do not blur the two.

---

## References

- [string](https://www.tcl-lang.org/man/tcl9.0/TclCmd/string.html)
- [regexp](https://www.tcl-lang.org/man/tcl9.0/TclCmd/regexp.html)
- [regsub](https://www.tcl-lang.org/man/tcl9.0/TclCmd/regsub.html)
- [re_syntax](https://www.tcl-lang.org/man/tcl9.0/TclCmd/re_syntax.html)
- [format](https://www.tcl-lang.org/man/tcl9.0/TclCmd/format.html)
- [scan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/scan.html)
- [encoding](https://www.tcl-lang.org/man/tcl9.0/TclCmd/encoding.html)
- [binary](https://www.tcl-lang.org/man/tcl9.0/TclCmd/binary.html)
- [Tcl 9.0 command index](https://www.tcl-lang.org/man/tcl9.0/TclCmd/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
