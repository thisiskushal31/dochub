# Object-oriented Perl and design

[← Back to Perl](./README.md)

## What this chapter covers

Perl OO fundamentals (`bless`, method dispatch, `UNIVERSAL`), inheritance and method resolution, dynamic hooks (`AUTOLOAD`, `DESTROY`), and modern systems (**Moo**, **Moose**, **Class::Tiny**). It also covers the **`class` / field** syntax in recent Perl (see **perlclass**) as an optional, core-backed alternative to hand-rolled hashes. Design emphasis: composition and shallow hierarchies. Security emphasis: hidden dispatch surfaces, destructor ordering, and deserializing untrusted data.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. `bless` and object identity

Perl objects are usually references **blessed** into a package (conventionally a hash reference; arrays and other referents are possible but less common).

```perl
package Point;

sub new {
    my ($class, $x, $y) = @_;
    return bless { x => $x, y => $y }, $class;
}

sub x { $_[0]->{x} }
```

A method call `$obj->x` dispatches to a subroutine in the object’s class (or ancestors) with the invocant as the first argument. **`__PACKAGE__`** is useful when logging or when the constructor receives a subclass name as `$class`.

---

### 2. `UNIVERSAL`, inheritance, and `SUPER`

All classes inherit from **`UNIVERSAL`**: **`$obj->can('method')`**, **`$obj->isa('Some::Class')`**, and **`$obj->DOES('SomeRole')`** (roles when provided by the OO framework) support reflection and guards in tests.

Inheritance uses **`@ISA`**; method lookup walks ancestors according to the effective **method resolution order** (historically depth-first; **`use mro 'c3'`** changes resolution for multiple inheritance—prefer **composition** or **roles** in new code to avoid MRO surprises).

**`$self->SUPER::method(...)`** calls the next implementation in the parent chain. Keep inheritance **shallow**; deep trees are hard to change under pressure.

---

### 3. Dynamic hooks: `AUTOLOAD`, `DESTROY`

**`AUTOLOAD`** intercepts calls to undefined methods. Powerful for proxies and adapters; **dangerous** for security review because the callable surface is implicit—pair with **`can`** checks in tests and document allowed method names.

**`DESTROY`** runs when the last reference to an object is reclaimed. Keep it minimal: no heavy I/O, no assumptions about other objects still being alive during **global destruction** (order is not reliable). Exceptions in **`DESTROY`** are especially painful—log and swallow or rethrow only with great care.

---

### 4. The `class` keyword (Perl 5.38+)

Recent Perls ship an experimental/opt-in **class** syntax documented in **perlclass**: fields, **`ADJUST`**, **`FIELD`**, and **`:param`**-style patterns reduce hand-maintained hash keys for **new** code. Treat it like any **perlexperiment** feature: enable only on Perl versions your **CI and production** both support, read **perldelta** for your release, and avoid mixing ad hoc **`bless`** hashes with **`class`** instances in one object graph without a clear boundary.

---

### 5. Moo, Moose, and Class::Tiny

- **Moose** — full metaprogramming (attributes, types, roles), higher startup cost; common in large applications.
- **Moo** — subset of Moose ideas, faster load; typical for services and CLIs.
- **Class::Tiny** — minimal attribute generator for small objects.

Use **one** ecosystem per repository when possible; mixing Moose metaclasses with raw **`bless`** in the same layer confuses readers and static tooling.

---

### 6. Design guidance for maintainable Perl OO

- Prefer **composition** and **roles** over deep **`@ISA`** trees for shared behavior.
- Keep constructors explicit; validate input at object boundaries (config files, RPC payloads).
- Avoid magic globals in methods; inject **logger**, **clients**, and **clock** abstractions for testability.
- Expose a **narrow** public method set; keep instance state **private by convention** (hash keys or lexical fields).
- Serialization (**JSON**, **Sereal**, **Storable**): never **`eval`** thawed blobs from untrusted sources; validate type tags and schema versions.

---

## 2. Advanced concepts

**Plugin systems:** **`require $module`** or **`Module::Load`** with a module name from the network requires an **allowlist**—dynamic **`AUTOLOAD`** plus dynamic loading is a high-risk combination.

**Performance:** Method dispatch is rarely the bottleneck next to **I/O**, **regex**, and **XS** boundaries; profile before micro-optimizing call paths.

**Threads:** Perl **ithreads** clone interpreters; sharing **Moose** objects across threads is uncommon and fragile—prefer **processes** or external workers for concurrency.

---

## 3. Applications and use cases

- **CPAN services and CLIs:** **Moo**/**Moose** **attrs** and **roles** dominate **maintainable** **internals**—**standardize** one stack per **repo** for **onboarding**.
- **Web apps:** **Mojolicious**/**Dancer2** **controllers** are **OO**—**narrow** **public** **methods** and **avoid** **`AUTOLOAD`** on **request** paths you **audit**.
- **Serialization boundaries:** **API** **JSON** must not **bless** into **arbitrary** classes—**thaw**/**YAML** **tags** are **object-injection** class (chapters 7, 12).
- **`class` keyword (new Perls):** Pilot **only** when **CI** and **prod** **Perl** versions match—**perldelta** + **perlexperiment** in **release** notes.

---

## References

- [perlobj](https://perldoc.perl.org/perlobj) — objects, classes, methods.
- [perlootut](https://perldoc.perl.org/perlootut) — OO tutorial (supersedes the old **perlboot** stub).
- [perlclass](https://perldoc.perl.org/perlclass) — `class` syntax and fields (version-gated).
- [perlexperiment](https://perldoc.perl.org/perlexperiment) — experimental features.
- [UNIVERSAL](https://perldoc.perl.org/UNIVERSAL) — `isa`, `can`, `DOES`.
- [Moo](https://metacpan.org/pod/Moo), [Moose](https://metacpan.org/pod/Moose), [Class::Tiny](https://metacpan.org/pod/Class::Tiny) — popular CPAN OO layers (module POD on MetaCPAN).
