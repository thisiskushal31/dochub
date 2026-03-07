# Ada — More about records

[← Ada README](./README.md)

Records can have runtime-determined size, discriminants (fixed per object), and variant parts (different sets of fields depending on a discriminant). These features support flexible, safe data structures without resorting to unchecked unions.

---

## Dynamically sized record types

Record object size does not have to be known at compile time. For example, the size can depend on a function result or a constant computed at elaboration. All objects of that type will then have the same size (the one determined when the type was elaborated). This is a **definite** type (you can declare unconstrained arrays of it only when the size is known in that scope).

```ada
Max_Len : constant Natural := Compute_Max_Len;
type Items_Array is array (Positive range <>) of Integer;
type Growable_Stack is record
   Items : Items_Array (1 .. Max_Len);
   Len   : Natural;
end record;
```

---

## Records with discriminants

A **discriminant** is a special component that (in its simple form) is constant after initialization and can control the size or shape of the record. Different objects can have different discriminant values, so they can have different sizes—analogous to unconstrained arrays. The type becomes **indefinite**: you must supply the discriminant when declaring an object (or give the discriminant a default).

```ada
type Growable_Stack (Max_Len : Natural) is record
   Items : Items_Array (1 .. Max_Len);
   Len   : Natural := 0;
end record;

S : Growable_Stack := (Max_Len => 128, Items => (1, 2, 3, 4, others => <>), Len => 4);
```

Discriminants are specified in aggregates and are read via dot notation like other components. If you give discriminants defaults (e.g. **Natural := 0**), you can declare **P : Point;** and use the defaults. You cannot modify a discriminant after initialization. A type with a discriminant (and no default) cannot be used as an array element type when the size would be unknown.

---

## Variant records

A **variant part** uses a discriminant (usually an enumeration) to choose which set of fields exists. There is at most one variant part, and it is usually at the end of the record. The **case** is on the discriminant; each **when** branch lists the components available for those discriminant values. Accessing a component that is not valid for the current discriminant value raises **Constraint_Error**.

```ada
type Expr_Kind_Type is (Bin_Op_Plus, Bin_Op_Minus, Num);
type Expr (Kind : Expr_Kind_Type) is record
   case Kind is
      when Bin_Op_Plus | Bin_Op_Minus =>
         Left, Right : Expr_Access;
      when Num =>
         Val : Integer;
   end case;
end record;
```

Variant records are similar to sum types in functional languages (e.g. OCaml, Haskell); the discriminant is the “tag”. Compared to C/C++ unions, variant records are safer because the discriminant is explicit and misuse is checked at runtime. They are useful for expression trees, message types, and other data that can take several shapes.

---

## Further reading

- [More about records](https://learn.adacore.com/courses/intro-to-ada/chapters/more_about_records.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
