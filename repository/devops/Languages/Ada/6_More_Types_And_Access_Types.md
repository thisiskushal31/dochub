# Ada — More types and access types

[← Ada README](./README.md)

This topic covers aggregates in more detail, overloading, qualified expressions, character types, and access types (pointers). Ada keeps pointers restricted and safe where possible and provides alternatives (parameter modes, unconstrained arrays) so they are not needed for many typical uses.

---

## Aggregates: every component and shortcuts

In an aggregate, **every** component of the record or array must be specified. For components with defaults you can use **&lt;&gt;** to mean “use default”. You can use **|** to give several components the same value, **others =>** for all unspecified components (when they share a type), and **..** for a contiguous range of indices in arrays. Once you use a named association, all following components must be named.

```ada
Origin : Point := (X | Y => <>);
Points_2 : Point_Array := (1 => (1, 2), 2 => (3, 4), 3 .. 20 => <>);
```

---

## Overloading and qualified expressions

Subprograms and enumeration literals can be **overloaded**: same name, different parameter or return types. Ada can resolve calls based on the **return type** when the context expects a specific type. When the compiler cannot resolve an overload (ambiguity), you must disambiguate with a **qualified expression**: **Type'(expression)**. This states the type of the expression without converting it. For subtype constraints you can use a qualified expression; if the value violates the constraint, **Constraint_Error** is raised.

```ada
P : Point := Point'(12, 15);
S2 : String := Convert (SSID'(123_145_299));
```

**Type conversion** and **qualified expression** are different: conversion changes the value (and can raise an error if invalid); a qualified expression only pins the type for overload resolution (or for constraint checking when used across subtypes).

---

## Character types

**Character** is a predefined enumeration type. You can define **custom character types** as enumerations whose literals are character literals: **type My_Char is ('a', 'b', 'c');**. Each enumeration type is distinct: you cannot assign **Character** to **My_Char** or use an invalid literal. **Character'Val (65)** yields the character at position 65 in the enumeration (e.g. 'A'). Character types are discrete and can index arrays and be used in **case** and **for** loops.

---

## Access types (pointers) — overview

**Access types** are Ada’s pointer types. Ada reduces the need for pointers by providing parameter modes (**in**, **out**, **in out**), unconstrained arrays, and first-class composite values. When you do need indirection, access types are made as safe and restricted as possible: nominally typed (two access types to the same designated type are incompatible unless designed that way), with **null**, allocation via **new**, and dereference via **.all** or implicit dereference in certain contexts.

```ada
type Date_Acc is access Date;
D : Date_Acc := null;
```

An access type designates a type; variables of the access type hold references to objects of that type. Two access types that both designate **Date** are **not** interchangeable; strong typing applies. A common pattern is to declare the access type in the same package as the designated type.

---

## Allocation and dereferencing

**new** allocates an object and returns an access value: **D := new Date'(1, January, 2000);**. To read or update the designated object, use **D.all** (dereference). In many contexts (e.g. **D.all.Field**) you can write **D.Field** and the dereference is implicit. Access types can be used for recursive or mutually recursive structures (e.g. trees or linked lists).

---

## Further reading

- [More about types](https://learn.adacore.com/courses/intro-to-ada/chapters/more_about_types.html)
- [Access types](https://learn.adacore.com/courses/intro-to-ada/chapters/access_types.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
