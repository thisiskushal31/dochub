# Ada — Privacy

[← Ada README](./README.md)

Encapsulation in Ada is specified at the **package** level: a **visible part** (public) and a **private part** hide implementation details. **Private types** and **limited private types** expose only operations, not representation. Child packages have defined rules for seeing a parent’s private part.

---

## Basic encapsulation

A package specification can have a **private** section. Everything after **private** is hidden from units that **with** the package: they cannot reference private subprograms, types, or objects. The package body (and child packages, as below) can use the private part.

```ada
package Encapsulate is
   procedure Hello;
private
   procedure Hello2;  -- not visible to with'ing units
end Encapsulate;
```

Clients may only call **Hello**; **Hello2** is for internal use. Reading the spec, the visible part is enough to use the package; the private part is for implementers.

---

## Abstract data types — private types

A type declared in the visible part as **private** is an **abstract data type (ADT)**. Clients see only that the type exists; they can declare variables, assign, test for equality, and call subprograms that take or return the type. They cannot see or depend on the type’s structure. The **full view** (the real definition) appears in the private part (or in the body for **private** types whose full view is only in the body).

```ada
package Stacks is
   type Stack is private;

   procedure Push (S : in out Stack; Val : Integer);
   procedure Pop  (S : in out Stack; Val : out Integer);
private
   subtype Stack_Index is Natural range 1 .. 10;
   type Content_Type is array (Stack_Index) of Natural;
   type Stack is record
      Top     : Stack_Index;
      Content : Content_Type;
   end record;
end Stacks;
```

The visible **Stack** is the **partial view**; the record in the private part is the **full view**. Helper types (e.g. **Content_Type**) can be declared in the private part so they do not leak into the public API.

---

## Limited types

A **limited** type does not have built-in assignment or equality. You declare it as **limited private** (or **limited record** in the private part). Useful when copying by bit would be wrong (e.g. file handles, resources, or types that need custom copy semantics). You can still overload **=** and **/=** for limited types. For custom assignment semantics, Ada provides **controlled types**; for types that must not be copied at all, **limited** is the right choice. **File_Type** in **Ada.Text_IO** is limited.

```ada
type Stack is limited private;
-- S := S2;  -- illegal
```

In the private part, the full type must also be limited: **type Stack is limited record ...**.

---

## Child packages and privacy

Child packages extend a parent and have special visibility rules:

- **Public part of child spec** — Sees only the **public** part of the parent. So the rest of the program cannot use the child to bypass the parent’s encapsulation.
- **Private part of child spec** and **child body** — See the **private** part of the parent. So the child can use parent’s private types and subprograms to implement extended functionality while the parent’s encapsulation is preserved.

So a procedure in the **body** of **Parent.Child** can call a private procedure of **Parent** and can access the full view of a private type of **Parent**. The **body** of **Parent.Child** and the **private** part of **Parent.Child**’s spec can declare objects of the parent’s private type and set their components; the **public** part of **Parent.Child** cannot, because that would expose the parent’s private structure to the rest of the program.

This supports layered abstraction: the parent hides representation; children can implement more operations without breaking the abstraction.

---

## Further reading

- [Privacy](https://learn.adacore.com/courses/intro-to-ada/chapters/privacy.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
