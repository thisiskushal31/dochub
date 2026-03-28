# Object-oriented Perl and larger design

[← Back to Perl](./README.md)

## What this chapter covers

Perl OO fundamentals (`bless`, method dispatch, inheritance), practical object design in production code, and modern object systems (Moo/Moose). It also covers risky dynamic hooks (`AUTOLOAD`, `DESTROY`) from a maintenance and security perspective.

---

## 1. `bless` and object identity

Perl objects are usually references blessed into a package:

```perl
package Point;

sub new {
    my ($class, $x, $y) = @_;
    return bless { x => $x, y => $y }, $class;
}

sub x { $_[0]->{x} }
```

A method call `$obj->x` dispatches to a subroutine in the object’s class (or parents) with `$obj` as the first argument.

---

## 2. Inheritance, `@ISA`, and `SUPER`

Inheritance uses `@ISA`; method lookup walks ancestors according to method resolution rules.

`$self->SUPER::method(...)` calls the parent implementation directly. Keep inheritance shallow and behavior explicit; deep trees are difficult to reason about under change.

---

## 3. Dynamic hooks: `AUTOLOAD`, `DESTROY`

`AUTOLOAD` can intercept unknown methods and implement late-bound APIs. It is useful for adapters and proxies, but it also hides call surfaces from readers and security reviewers.

`DESTROY` runs at object teardown. Keep it minimal and side-effect-light; global destruction order is not deterministic enough for complex cleanup logic.

---

## 4. Moo, Moose, and class tooling

- **Moose**: rich metaprogramming, roles, types, bigger startup cost.
- **Moo**: lighter, faster startup, common for CLI/services.
- **Class::Tiny**: minimal attribute boilerplate.

Use one object ecosystem per repository when possible; mixed paradigms create onboarding and debugging friction.

---

## 5. Design guidance for maintainable Perl OO

- Prefer composition/roles over inheritance for shared behavior.
- Keep constructors explicit; validate input near object boundaries.
- Avoid magic globals in methods; pass dependencies (logger, config, clients) explicitly.
- Expose narrow public methods and keep internal state private by convention.

---

## Advanced use cases and implementation

**Serialization safety:** never deserialize untrusted object payloads into executable class contexts without strict class allowlists.

**Plugin systems:** dynamic loading plus OO can work well, but module names must come from validated allowlists, not raw user input.

**Performance:** method calls are cheap enough for most service code; optimize data structures and I/O first.

---

## References

- [perlobj](https://perldoc.perl.org/perlobj)
- [perlboot](https://perldoc.perl.org/perlboot)
- [modules](https://perldoc.perl.org/modules)
# Object-oriented Perl and larger design

[← Back to Perl](./README.md)

## What this chapter covers

Blessing references, basic OO patterns, `DESTROY`, `UNIVERSAL`, and CPAN object systems (Moo, Moose, Class::Tiny). Design emphasis: composition over deep inheritance. Security emphasis: `AUTOLOAD`, destructor side effects, and deserializing untrusted data.

---

## 1. Blessing and method dispatch

`bless` ties a reference (usually a hash) to a package name. Methods are subroutines in that package, conventionally invoked as `$obj->method` with `$self` as the first argument.

```perl
package Point;

sub new {
    my ($class, $x, $y) = @_;
    bless { x => $x, y => $y }, $class;
}

sub x { $_[0]->{x} }
```

`$obj->method()` resolves through `@ISA` (inheritance) and `UNIVERSAL`.

---

## 2. Inheritance and `SUPER`

`@ISA` lists parent packages; method lookup walks the tree. `$self->SUPER::method` calls the parent implementation. Method resolution order (MRO) matters when using multiple inheritance — prefer roles or composition in new designs.

---

## 3. `DESTROY` and `AUTOLOAD`

`DESTROY` runs when the last reference to an object goes away. Exceptions inside `DESTROY` are hazardous; keep destructors minimal. During global destruction, object teardown order is not fully predictable — avoid relying on peer objects still existing.

`AUTOLOAD` catches missing method names — flexible for lazy APIs, difficult for security review if arbitrary names can trigger behavior.

---

## 4. Moo, Moose, and Class::Tiny

Moose provides a full metaobject protocol (attributes, types, roles) with heavier startup cost. Moo is a lighter subset, common for CLIs. Class::Tiny offers minimal attribute generators. Pick one ecosystem per codebase; mixing Moose with hand-rolled `bless` in one object graph confuses maintainers.

---

## Advanced use cases and implementation

**Roles vs inheritance:** Prefer `with 'SomeRole'` composition over deep `@ISA` trees to reduce fragile base-class coupling.

**Serialization:** Storable, Sereal, JSON — never `eval` serialized blobs from untrusted sources; validate type tags and versions before thawing.

**Threads:** Moose immutability helps read-only shared data, but Perl threads are uncommon; most concurrent designs use processes or external workers.

---

## References

- [perlobj](https://perldoc.perl.org/perlobj)
- [perlboot](https://perldoc.perl.org/perlboot)
