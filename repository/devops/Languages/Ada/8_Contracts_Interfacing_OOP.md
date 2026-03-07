# Ada — Contracts, interfacing, and OOP

[← Ada README](./README.md)

Contracts (pre/postconditions, predicates, invariants) document and enforce expectations. Interfacing with C allows binding to existing code. Tagged types provide object-oriented programming with type extension and runtime polymorphism.

---

## Design by contract

**Preconditions** and **postconditions** express requirements on inputs and outputs of subprograms. They are specified with aspect clauses: **with Pre =>** *condition*, **with Post =>** *condition*. The precondition is a promise from the caller to the callee; the postcondition is a promise from the callee to the caller. If a precondition fails when the subprogram is called (or a postcondition when it returns), **Assertion_Error** is raised (when assertions are enabled, e.g. **-gnata** in GNAT).

```ada
procedure DB_Entry (Name : String; Age : Natural)
  with Pre => Name'Length > 0;
```

**Quantified expressions** are useful in conditions: **(for all I in A'Range => A(I) = 0)** (all elements zero), **(for some I in A'Range => A(I) &gt; 0)** (at least one positive). In a postcondition, **'Result** refers to the function result and **'Old (X)** to the value of **X** at entry.

**Subtype predicates** restrict the set of values of a subtype with **with Dynamic_Predicate =>** *expression*. **Type invariants** (on private types) state a property that must hold for every object of the type after any operation. These are checked at specified points and support both documentation and static analysis (e.g. in SPARK).

---

## Interfacing with C

Ada can call C subprograms and expose subprograms to C using the **Interfaces.C** package and **pragma Import**, **pragma Export**, and **Convention => C**. Types (e.g. **int**, **char**), pointers, and structs can be mapped. Generated bindings and manual mapping are both used in practice. This is essential for system and embedded code that uses C libraries or the OS API.

---

## Object-oriented programming — tagged types

Ada 95 added **tagged types** to support object-oriented programming: type extension, runtime polymorphism, and extensibility. A **tagged** record type can be **extended** with new components in a **derived** type. **Primitive operations** are subprograms declared in the same package as the type (same scope); they are “attached” to the type and are inherited by derived types. **Class-wide types** (e.g. **Point'Class**) allow holding any object in the derivation hierarchy. **Dispatching** calls (on **'Class** values or through access-to-class-wide types) resolve at runtime to the actual type’s primitive, giving polymorphism.

```ada
type Point is tagged record
   X, Y : Integer;
end record;

procedure Move (P : in out Point; DX, DY : Integer);

type Point_3D is new Point with record
   Z : Integer;
end record;
-- Point_3D inherits Move; can override it.
```

**Overriding** uses **overriding** in the subprogram declaration. **Abstract** subprograms and **abstract** types defer implementation to derived types. **Limited** and **private** extend to tagged types for encapsulation. Ada’s OOP is based on **nominal** typing (by type name) and is designed to work with the rest of the language (generics, contracts, tasking). You can write Ada without tagged types; use them when type extension and polymorphism are the right fit.

---

## Further reading

- [Design by contracts](https://learn.adacore.com/courses/intro-to-ada/chapters/contracts.html)
- [Interfacing with C](https://learn.adacore.com/courses/intro-to-ada/chapters/interfacing_with_c.html)
- [Object-oriented programming](https://learn.adacore.com/courses/intro-to-ada/chapters/object_oriented_programming.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
