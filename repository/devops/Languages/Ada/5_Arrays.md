# Ada — Arrays

[← Ada README](./README.md)

Arrays are contiguous collections of elements indexed by a discrete type. Ada supports fixed bounds, anonymous ranges, and unconstrained array types whose bounds are given per object.

---

## Array type declaration

You specify the **index type** (and thus the bounds) and the **element type**. Any **discrete** type (integer or enumeration) can index an array. The index type defines the range of valid indices (e.g. 1 .. 5 or 11 .. 15).

```ada
type My_Int is range 0 .. 1000;
type Index is range 1 .. 5;

type My_Int_Array is array (Index) of My_Int;
Arr : My_Int_Array := (2, 3, 5, 7, 11);

for I in Index loop
   V := Arr (I);
   Put (My_Int'Image (V));
end loop;
```

Element access uses the same syntax as function calls: **Arr (I)**. So **A (B)** is either a function call or an array index depending on the type of **A**. Arrays are **bounds-checked** at runtime; out-of-range access raises an exception. The index type is strong: a variable of a different discrete type (even with the same range) cannot index the array without conversion.

---

## Simpler bounds and range attribute

You can use an anonymous range instead of a named index type: **array (1 .. 5) of My_Int**. Then the index subtype is **Integer**. To iterate without hard-coding bounds, use the **'Range** attribute: **for I in Arr'Range loop**. **'First**, **'Last**, and **'Length** give the first index, last index, and number of elements. A null array has an empty range (upper bound &lt; lower bound).

---

## Unconstrained arrays

An **unconstrained** array type has bounds that are not fixed in the type; each object must supply its bounds when declared. The index is written **Discrete_Type range &lt;&gt;**:

```ada
type Workload_Type is array (Days range <>) of Natural;
Workload : constant Workload_Type (Monday .. Friday) := (Friday => 7, others => 8);
```

Different objects of the same unconstrained type can have different bounds, but a given object’s bounds are fixed for its lifetime. Unconstrained arrays are first-class values: they carry their bounds, so you can pass them to subprograms or return them from functions without passing length separately. The compiler can store them on the stack.

---

## String type

The predefined **String** type is an unconstrained array of **Character**:

```ada
type String is array (Positive range <>) of Character;
```

String literals are syntactic sugar for character aggregates. You can omit bounds when initializing from an expression: **Message : constant String := "Hello";** — the bounds are taken from the initial value. You **cannot** change the bounds of an array after creation; assigning a longer or shorter string to a fixed-length **String** variable is illegal (or a constraint error if lengths differ at runtime). For dynamic strings use **Ada.Strings.Unbounded.Unbounded_String** from the standard library.

---

## Array slices

A **slice** is a contiguous subsequence: **Buf (7 .. 9)** or **Full_Name (1 .. 4)**. A slice can be used on the left of assignment (if the right-hand side has the same length) or in expressions. Slices are one-dimensional; multidimensional arrays have different rules.

---

## Returning unconstrained arrays

Functions can return unconstrained array types (e.g. **String**). The return value’s bounds are determined by the return statement. This avoids passing buffers and lengths from the caller and reduces the need for manual dynamic allocation in many cases.

---

## Further reading

- [Arrays](https://learn.adacore.com/courses/intro-to-ada/chapters/arrays.html)
- [Standard Library: Strings](https://learn.adacore.com/courses/intro-to-ada/chapters/standard_library_strings.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
