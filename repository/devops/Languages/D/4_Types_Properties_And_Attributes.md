# D — Types, properties, and attributes

[← D README](./README.md)

**Types** define the layout and operations of data: basic types (integral, floating-point), arrays, pointers, structs, classes, enums, and type constructors. **Properties** are named values or behaviors attached to types or expressions (e.g. `.length`). **Attributes** and **pragmas** add metadata or compiler hints to declarations. Understanding types and attributes is essential for correct and efficient D code.

**Why properties?** They provide a uniform way to query or modify state (e.g. array length) without exposing implementation. **Why attributes?** They express constraints (e.g. `pure`, `nothrow`) and guide optimization and safety.

---

## Basic and built-in types

Integral types include **bool**, **byte**, **ubyte**, **short**, **ushort**, **int**, **uint**, **long**, **ulong**. Floating-point types are **float**, **double**, **real**. **void** denotes no value; **size_t** and **ptrdiff_t** are common for sizes and pointer difference. Character types **char**, **wchar**, **dchar** represent UTF code units.

```d
int n = 42;
double d = 3.14;
bool flag = true;
```

---

## Type constructors and qualifiers

**const**, **immutable**, and **shared** qualify how data may be modified. **Pointers** and **arrays** are built from element types. User-defined types are **struct**, **class**, **interface**, **enum**. Type aliases use **alias** or **typedef**.

```d
immutable int[] arr;
const(char)[] str;
```

---

## Properties

Many types and expressions have **properties**: e.g. `.length` for arrays, `.ptr` for the underlying pointer, `.sizeof` for type size. Property syntax allows reading (and sometimes writing) without a method call. User-defined properties are implemented with **property** functions.

---

## Attributes and pragmas

**Attributes** annotate declarations: **@safe**, **@system**, **@trusted** for safety; **pure**, **nothrow**, **@nogc** for function contracts. **Pragma** directives give implementation-specific or compiler-specific instructions (e.g. alignment, visibility).

```d
@safe pure nothrow int add(int a, int b) { return a + b; }
```

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Types](https://dlang.org/spec/type.html)
- [D spec: Properties](https://dlang.org/spec/property.html)
- [D spec: Attributes](https://dlang.org/spec/attribute.html)
