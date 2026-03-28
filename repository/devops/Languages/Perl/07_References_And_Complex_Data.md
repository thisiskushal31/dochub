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

---

## Advanced use cases and implementation

**JSON/YAML:** **`decode_json`** returns **nested** **refs**—**validate** **types** before **dereferencing** in **security** paths.

**Cycles:** **Circular** **references** prevent **refcount** **GC** from freeing—**weaken** with **`Scalar::Util::weaken`** in **cache** graphs.

**Typeglobs** `*foo` — **symbol table** entries bundling **SCALAR**, **ARRAY**, **HASH**, **CODE**—**legacy** **OO** and **`local *foo`** tricks; **read** **old** code, **avoid** writing new **glob** magic without **strong** reason.

---

## References

- [perlref](https://perldoc.perl.org/perlref)
- [perldsc](https://perldoc.perl.org/perldsc)
- [perllol](https://perldoc.perl.org/perllol)
