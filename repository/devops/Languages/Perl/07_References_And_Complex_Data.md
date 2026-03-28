# References and complex data

[← Back to Perl](./README.md)

## What this chapter covers

**Scalar references** (`\`), **dereferencing** (`${}`, `@{`, `%{`), **anonymous** arrays and hashes, **nested** structures, and **autovivification**. **Advanced:** **typeglobs** and **symbol tables** (enough to read **legacy**). **Security:** **deep** structures from **YAML** or **Storable** without **validation** are **object injection** risks.

---

## 1. Taking references

The **backslash** operator creates a **reference** to an existing scalar, array, or hash.

```perl
my $s = 42;
my $rs = \$s;
$$rs = 99;
```

**Anonymous** composites:

```perl
my $ar = [ 1, 2, 3 ];
my $hr = { a => 1, b => 2 };
```

---

## 2. Dereferencing

**Syntax** options exist—pick one style per codebase for **readability**:

```perl
my @copy = @{ $ar };
my %h = %$hr;
```

**Arrow** `->` for **chains**:

```perl
$hr->{a} = 3;
$ar->[0] = 7;
```

**`ref`:** Returns the **referent** type string (**`ARRAY`**, **`HASH`**, **`SCALAR`**, **`Regexp`**, **`CODE`**, etc.) or **`undef`** for non-references—use in **validation** before deep traversal of **JSON**/**YAML** trees.

---

## 3. Nested structures

**Array of arrays** (tables), **hash of hashes** (configs), **mixed** trees—**references** are the **glue**.

```perl
my $rows = [
    [ 'a', 1 ],
    [ 'b', 2 ],
];
```

**Autovivification:** **Assigning** through a **deep** path **creates** intermediate **hashes**/**arrays**—convenient but can **hide** bugs when **keys** come from **user** input (**unbounded** memory).

---

## 4. Copying vs aliasing

**Slices** and **`@_`** **alias**—**subtle** **mutation** bugs when passing **hash**/**array** **elements**.

**Deep cloning** needs **`dclone`** from **`Storable`** or equivalent—**assignment** copies **top** level only for **references**.

**`no autovivification`:** The **`autovivification`** pragma (CPAN) or careful **`exists`** checks can stop accidental deep tree growth when probing **optional** config keys—reduces **DoS-by-config** shapes in hostile inputs.

---

## Advanced use cases and implementation

**JSON/YAML:** **`decode_json`** returns **nested** **refs**—**validate** **types** before **dereferencing** in **security** paths. Prefer **`JSON::PP`** (core) or **`Cpanel::JSON::XS`** where performance matters; never **`eval`** JSON.

**YAML loaders** historically differed in whether they **blessed** parsed mappings into **arbitrary classes** (“**YAML tags**”)—that is an **object injection** / **remote code** class of bugs if **`DESTROY`**, **`AUTOLOAD`**, or **`UNIVERSAL::DESTROY`** chains are reachable. Use **`Load`** options that **forbid** tags / **blessing**, or a **schema**-constrained loader, and treat **`YAML::Syck`**-era stacks as **high** audit priority in legacy estates.

**`Data::Dumper` / `Data::Printer`:** Handy for **logs** and **REPL**-style debugging—**never** log **secrets**; remember **`Dumper`** output is **not** a serialization format for **untrusted** round trips.

**Cycles:** **Circular** **references** prevent **refcount** **GC** from freeing—**weaken** with **`Scalar::Util::weaken`** in **cache** graphs.

**Typeglobs** `*foo` — **symbol table** entries bundling **SCALAR**, **ARRAY**, **HASH**, **CODE**—**legacy** **OO** and **`local *foo`** tricks; **read** **old** code, **avoid** writing new **glob** magic without **strong** reason.

---

## References

- [perlref](https://perldoc.perl.org/perlref), [perlreftut](https://perldoc.perl.org/perlreftut)
- [perldsc](https://perldoc.perl.org/perldsc), [perllol](https://perldoc.perl.org/perllol)
- [Scalar::Util](https://perldoc.perl.org/Scalar::Util) — `weaken`, `refaddr`, `dualvar`, etc.
- [JSON::PP](https://perldoc.perl.org/JSON::PP) — pure-Perl JSON.
- [Storable](https://perldoc.perl.org/Storable) — persistence and `dclone` (thaw only trusted blobs).
- [autovivification](https://metacpan.org/pod/autovivification) — pragma to tighten accidental vivification (MetaCPAN).
