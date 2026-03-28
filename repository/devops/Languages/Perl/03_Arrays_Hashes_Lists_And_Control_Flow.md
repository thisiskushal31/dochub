# Arrays, hashes, lists, and control flow

[← Back to Perl](./README.md)

## What this chapter covers

**Arrays** (`@foo`), **hashes** (`%bar`), **list assignment**, **slices**, **`foreach`**, **`while`**, **`map`**, **`grep`**, **`sort`**, and control-flow idioms used in production scripts. Engineering focus: **memory** and **algorithm** choices on large files; **security** focus: never **`eval`** a list built from untrusted input.

---

## 1. Lists and arrays

A **list** is a sequence of scalars written in parentheses; an **array** is a named container of scalars in order.

```perl
my @nums = (1, 2, 3);
push @nums, 4;
my $last = pop @nums;
```

**Stack** idioms: **`push`/`pop`** at the end; **`shift`/`unshift`** at the front ( **`shift`** on **`@ARGV`** is common for CLI parsing).

**Scalar context** on an array name yields **length**:

```perl
my $n = @nums;
```

---

## 2. Hashes (associative arrays)

A **hash** maps string keys to scalars (values can be references). **Fat comma** `=>` is often used for readability; it quotes bareword keys on the left.

```perl
my %cfg = (
    host => 'db.internal',
    port => 5432,
);
my $h = $cfg{host};
exists $cfg{ssl} or $cfg{ssl} = 1;
```

**Iteration** order was historically undefined for hashes; modern Perls have **insertion-ordered** keys for standard hashes—**do not** rely on order for **security** decisions unless you document the Perl **version** floor.

**`keys`**, **`values`**, and **`each`** (deprecated style in new code—prefer explicit iteration) walk the hash.

---

## 3. Slices

**Array slice** — multiple indices from one array:

```perl
my @x = @nums[0, 2, 4];
```

**Hash slice** — multiple keys at once:

```perl
my @vals = @cfg{ 'host', 'port' };
```

Slices return **lists**; context rules still apply when you assign into scalars vs arrays.

---

## 4. Control flow

**`if` / `unless` / `else`**, **`elsif`** (note spelling). **Postfix** forms save lines but hurt **coverage** readability—pick team style.

```perl
do_something() if $ready;
```

**`for` / `foreach`** are synonyms; **C-style** `for (my $i = 0; $i < $n; $i++)` exists but **foreach** over a list is more idiomatic for clarity.

**`while` / `until`** — watch **`<>`** line input and **`$.`** (line number) in log-parsing scripts.

**`given` / `when`** — experimental **`smartmatch`** territory; many teams **avoid** it for portability and predictability—use **`if`/`elsif`** chains in new code.

---

## 5. `map` and `grep`

**`grep`** filters a list; **`map`** transforms it. Both set **`$_`** in the block—lexical **`my`** inside blocks avoids accidental outer **`$_`** clobbering in nested code.

```perl
my @lines = qw( a bb ccc );
my @long = grep { length $_ >= 2 } @lines;
my @lens = map { length $_ } @lines;
```

**Performance:** multiple passes over huge **arrays** cost **RAM** if you materialize everything—**stream** with **`while (<>)`** when files are large (chapter 4).

---

## 6. `sort`

**`sort`** defaults to **string** sort. **Numeric** sort requires an explicit block or **`sort { $a <=> $b }`**.

```perl
my @n = sort { $a <=> $b } ( 10, 2, 30 );
```

**Locale**-aware sorting uses **`sort` with `use locale`**—be explicit when **compliance** requires language rules.

---

## Advanced use cases and implementation

**Shared mutable state:** **Global** arrays and hashes in **persistent** processes (daemons, **FCGI**) are **concurrency** hazards unless access is **serialized**—use **locks**, **job queues**, or **process** pools with **one** writer.

**Storable / serialization:** **`freeze`/`thaw`**-style modules appear in **cache** layers—**never** **`eval`** thawed blobs from **untrusted** sources (remote code execution class).

**Algorithm audits:** **`map`/`grep`** chains are clear to **Perl** natives and opaque to some **static** tools—document intent in **security**-sensitive paths.

---

## References

- [perldata](https://perldoc.perl.org/perldata)
- [perlsyn](https://perldoc.perl.org/perlsyn)
- [perllol](https://perldoc.perl.org/perllol) — lists of lists
- [perlfunc](https://perldoc.perl.org/perlfunc) — `map`, `grep`, `sort`
