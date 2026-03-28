# Subroutines, packages, and the module system

[← Back to Perl](./README.md)

## What this chapter covers

**Subroutines** (`sub`), **return** context, **`package`**, **`use`**, **`require`**, **`@INC`**, **`Exporter`**, and how **`.pm`** files map to **`Foo::Bar`** namespaces. **Operations** focus: predictable **load order** and **startup** time. **Security** focus: only loading **trusted** paths, **`@INC`** manipulation, and **`%INC`** visibility for audits.

---

## 1. Subroutines

**Definition:**

```perl
sub add {
    my ($x, $y) = @_;
    return $x + $y;
}
```

**`@_`** is the argument array—**aliases** to the actual scalars passed, so assigning to **`$_[0]`** can mutate the caller’s variable (usually avoided).

**Context** propagates into **`return`**: **`return @arr`** in **scalar** context returns the **length** of **`@arr`** unless you force a scalar another way—common bug when refactoring.

```perl
my $n = count_items();   # want scalar
sub count_items { return @items; }  # OOPS: scalar context → count of items
```

Use **`return scalar @items`** or **`return 0+@items`** when you mean “number of elements.”

---

## 2. Packages and namespaces

**`package Name;`** switches the **default** namespace for **unqualified** globals and **`sub`** names until the next **`package`** or end of scope (block/file).

**`Foo::Bar::`** is the **hierarchical** name for **`Bar`** inside **`Foo`**.

```perl
package MyApp::Util;

sub trim {
    my ($s) = @_;
    $s =~ s/^\s+|\s+$//g;
    return $s;
}
```

**`__PACKAGE__`** stringifies the current package—useful for logging and **metaprogramming**.

---

## 3. `use` vs `require`

**`use Module LIST`** is **`BEGIN { require Module; Module->import(LIST); }`** at compile time—**fails fast** if missing.

**`require`** loads at **runtime** (historically used for **optional** features); still updates **`%INC`**.

**`%INC`** maps **file paths** to **`1`** (or true) when loaded—inspect it to see **what** actually loaded in a long-running process.

---

## 4. `@INC` and shadowing

`@INC` lists **roots**; **`Module::Name`** maps to **`Module/Name.pm`** under one of those roots **in order**.

**Shadowing:** If **`./lib`** precedes system paths and contains a **`JSON.pm`**, you may load the **wrong** **`JSON`**—a **supply-chain** and **security** incident when **`./lib`** is writable by **untrusted** users.

**`use lib 'path'`** prepends for **that** compilation unit—prefer **explicit** project **`lib/`** over global **`PERL5LIB`** in application repos when possible.

---

## 5. Exporter pattern

Many modules **`use base 'Exporter'`** or **`use Exporter 'import'`** and define **`@EXPORT`** / **`@EXPORT_OK`**. Callers get **symbols** in their namespace.

```perl
use List::Util qw( shuffle min max );
```

**Review** what **`import`** pulls in—**namespace pollution** complicates **static** analysis and **refactoring**.

---

## Advanced use cases and implementation

**Dynamic loading:** **`Module::Load::Conditional`**, **`require` with variable**—powerful for **plugins**; **dangerous** if the **module name** comes from **network** input without an **allowlist**.

**XS bootstrap:** **`Foo::Bar`** may **`bootstrap`** **`Foo::Bar`**. **`so`**—**ABI** tied to **perl** minor; **container** images must **match** build and runtime.

**Circular `use`:** Design **layers** so **low-level** modules never **`use`** **high-level** ones; **dependency cycles** break **initialization** in painful ways.

---

## References

- [perlsub](https://perldoc.perl.org/perlsub)
- [perlmod](https://perldoc.perl.org/perlmod)
- [perlmodlib](https://perldoc.perl.org/perlmodlib)
- [Exporter](https://perldoc.perl.org/Exporter)
