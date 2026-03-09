# D — Templates and template mixins

[← D README](./README.md)

**Templates** parameterize types and functions over types, values, or symbols; they are the basis of generic and metaprogramming in D. **Template mixins** inject generated code or declarations into a scope. Together they allow compile-time code generation and reuse without runtime overhead.

**Why templates?** They provide type-safe generics (e.g. containers, algorithms) and compile-time introspection. **Why mixins?** They generate repetitive or boilerplate code from a template and keep the source DRY.

---

## Templates

A **template** is declared with **template** and a name; it can take **type** parameters, **value** parameters, or **alias** parameters. Instantiating the template with arguments produces a type or function. **static if** and **is** expressions allow conditional compilation inside templates.

```d
template Max(T)
{
    T max(T a, T b) { return a > b ? a : b; }
}
alias maxInt = Max!int.max;
int m = maxInt(1, 2);
```

---

## Template mixins

**mixin** **templateName!args** injects the template's declarations into the current scope. Mixins are used to add members, implement patterns, or generate code from a string (with **mixin** **compile** for compile-time string mixins).

```d
mixin template Counted()
{
    static size_t count;
    this() { count++; }
    ~this() { count--; }
}
class C { mixin Counted!; }
```

---

## Constraints and specialization

**template constraints** (e.g. **is(T : int)** or **if (isNumeric!T)**) restrict which types can instantiate a template. **static if** branches allow different code paths per instantiation. This enables trait-based and concept-style generic code.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Templates](https://dlang.org/spec/template.html)
- [D spec: Template Mixins](https://dlang.org/spec/template-mixin.html)
