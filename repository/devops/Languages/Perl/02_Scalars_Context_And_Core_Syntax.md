# Scalars, context, and core syntax

[← Back to Perl](./README.md)

## What this chapter covers

**Sigils** (`$`, `@`, `%`), **scalar** vs **list context**, **undef**, truthiness, core **operators**, **quoting** mechanisms, and the lexical **`my`** vs package **`our`** distinction. Advanced topics include **prototypes** (why libraries use them sparingly) and **feature** pragmas. Without context, Perl looks like noisy punctuation; with it, data flow becomes predictable.

---

## 1. Sigils and names

- **`$name`** — a **scalar**: single value (number, string reference, object reference, `undef`).
- **`@name`** — an **array**: ordered list of scalars, indexed by integer.
- **`%name`** — a **hash**: unordered mapping from string keys to scalars.

The **same** basename can exist in all three slots: `$foo`, `@foo`, and `%foo` are **different** variables. That surprises newcomers; it also lets libraries use parallel names without collision between a scalar config and an array of items.

```perl
my $count = 10;
my @items = qw(apple banana);
my %price = ( apple => 120, banana => 90 );
```

---

## 2. Scalar vs list context (the central rule)

**Context** is not “type coercion” in the Java sense; it is **which value shape** the language expects at that point in the program.

- **Scalar context** expects a single scalar: boolean tests, assignment to a scalar, string concatenation with `.`, numeric `+`.
- **List context** expects a list of scalars (possibly empty): assignment to an array or hash, arguments to a list-taking construct.

```perl
my @letters = ('a', 'b', 'c');
my $n = @letters;        # scalar context: number of elements
my ($x) = @letters;      # list context: first element only
```

`localtime` illustrates the same function behaving differently:

```perl
my $epoch = time;
my $pretty = scalar localtime $epoch;   # human-readable string
my @parts  = localtime $epoch;          # list of fields
```

**Why it matters in operations:** subtle context bugs show up when you **return** values from subroutines or **assign** to **`my ($x)`** vs **`my $x`**. Code review should flag “list vs scalar” on hot paths.

---

## 3. `undef`, truth, and comparison

**`undef`** is the “no value” scalar. Uninitialized scalars are **`undef`**. Warnings often catch **use of uninitialized value**—keep **`use warnings`** on.

**Truthiness:** `0`, **`''`**, **`'0'`**, and **`undef`** are false in boolean context; almost everything else is true (including **`'00'`** and non-empty strings).

**Numeric vs string comparison** use different operators—classic Perl footgun:

| Numeric | String |
|---------|--------|
| `==`, `!=`, `<`, `>` | `eq`, `ne`, `lt`, `gt` |

```perl
if ( $a == $b ) { }   # numeric
if ( $a eq $b ) { }   # string
```

Mixing them silently **coerces** types in ways that confuse audits—pick the right family explicitly.

**`defined` and `//`:** Use **`defined $x`** when **`0`** or **`''`** are legitimate values; **`$x // $default`** (defined-or) avoids the classic **`||`** bug where **`0`** is treated as missing.

**`chomp`:** Removes trailing record separators from **`$_`** or a named scalar—almost always call it on **input lines** before parsing so comparisons and hashes behave predictably.

---

## 4. Operators (overview)

**Arithmetic:** `+`, `-`, `*`, `/`, `%`, `**`. **String:** `.` concatenation, `x` repetition.

**Logical:** `&&`, `||`, `//` (defined-or), `and`, `or`, `not` (lower precedence—often used for flow control).

**Bitwise:** `&`, `|`, `^`, `<<`, `>>` — know your **numeric** width if you port crypto or protocol code.

**Assignment** can be compound: `+=`, `.=`, `//=`.

Exhaustive tables and precedence rules live in **`perlop`**; for handbook work, **parenthesize** when precedence is not obvious—reviews and **static analyzers** thank you.

---

## 5. Quoting and interpolation

**Single quotes** `'...'` — **no** interpolation, **few** escapes.

**Double quotes** `"..."` — interpolate **`$scalar`**, **`@array`**, **`%hash`** slices, and **escape** sequences.

**`q//`, `qq//`, `qw//`** — pick arbitrary delimiters to avoid backslash soup in regex-heavy strings:

```perl
my $path = q{/usr/local/bin};
my $msg  = qq{Error: $path};
my @toks = qw{ one two three };
```

**Here-documents** (`<<'EOF'` / `<<"EOF"`) build multi-line strings—common in generated configs; ensure **closing** token is alone on the line and watch **indentation** on older Perls.

---

## 6. Lexical scope with `my`

**`my`** declares **lexical** variables visible from the declaration to the end of the enclosing **block**, **file**, or **`eval`**. They are **not** package globals—this is what you want for almost all new code.

**`our`** declares a **package** variable with lexical **visibility** of the name—used sparingly for **interop** with older APIs expecting package variables.

```perl
{
    my $inner = 1;
}
# $inner not visible here
```

**State variables** (`use feature 'state'` or `use 5.010`) give **persistent** lexicals across calls—use when you need **memoization** without package globals.

---

## 7. Prototypes (read carefully)

**Subroutine prototypes** (`sub foo ($$) { ... }`) exist mainly for **compile-time** argument checking and **optional** syntactic sugar. They **do not** validate **types** like a static language; they interact badly with **references** and **&sub** calling conventions.

**Rule:** avoid inventing new prototypes in application code unless you know why a **CPAN**-style API needs them. Mis-prototyped subs confuse **maintainers** and **static** tooling.

---

## Advanced use cases and implementation

**Unicode and bytes:** Source file **encoding**, **`use utf8`**, and **`binmode`** on handles are separate concerns. **Security** reviews for web and IPC code should verify **normalization** and **byte** vs **character** boundaries—**length** in bytes ≠ **length** in graphemes. **`utf8::upgrade`** / internal UTF-8 flags are easy to misuse; prefer **`Encode`** at boundaries and document encoding in APIs (chapter 4).

**Here-documents in generated configs:** A terminator line that is not **exactly** alone (trailing spaces, wrong indent) fails at compile time or silently includes garbage—common in templated **Kubernetes** manifests and **CI** snippets. Prefer **`<<~EOF`** (indented heredocs on supported Perls) or **`qq{...}`** for short multiline strings to keep reviews readable.

**Embedding:** When **`perl`** is embedded, **`@INC`** and **`%ENV`** may be locked down; **XS** loading paths are a **sandbox** escape surface if untrusted code can write to those directories.

**Tooling:** **`Perl::Critic`** and **`perltidy`** enforce house style; wire them in **CI** for repos large enough to justify **bike-shed** automation.

---

## References

- [perldata](https://perldoc.perl.org/perldata)
- [perlsyn](https://perldoc.perl.org/perlsyn)
- [perlop](https://perldoc.perl.org/perlop)
- [perlsub](https://perldoc.perl.org/perlsub) — subroutines and prototypes.
- [feature](https://perldoc.perl.org/feature) — `state`, `say`, and version bundles.
- [perlunicook](https://perldoc.perl.org/perlunicook) — recipes at the Unicode/text boundary (with chapter 4).
