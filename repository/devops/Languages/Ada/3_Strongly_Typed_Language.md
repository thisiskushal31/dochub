# Ada — Strongly typed language

[← Ada README](./README.md)

Ada is strongly typed: types enforce invariants at compile time and runtime. This topic covers scalar types (integers, modular, enumerations, floating-point), derived types, subtypes, and type conversion.

---

## What is a type?

In a statically typed language, a **type** is mainly a compile-time construct that enforces **invariants** about program behavior—e.g. that variables never hold invalid values. Types classify **objects** (variables and constants) by what you can do with them (allowed operations) so you can reason about correctness. Ada makes it easy to introduce new types and uses them to prevent many misuse errors.

---

## Integer types

Integer types are defined by **range**, not by bit width. The compiler chooses an appropriate representation. You can define your own signed integer types:

```ada
type My_Int is range -1 .. 20;

for I in My_Int loop
   Put_Line (My_Int'Image (I));
end loop;
```

The predefined **Integer** type is defined the same way; a typical 32-bit implementation might use `range -(2**31) .. +(2**31 - 1)`. Ada does not fix the range of **Integer**; a 16-bit target might use a smaller range. **Operational semantics**: operations on integers are checked for overflow; violating the type’s range can raise **Constraint_Error**. Machine-level overflow typically always raises; type-level overflow is checked at certain boundaries (e.g. assignment), so an intermediate computation might overflow without an exception if the final result is in range.

---

## Modular (unsigned) types

**Modular** types are unsigned integer types with wrap-around semantics: out-of-range results are reduced modulo the modulus. The modulus can be any positive value (not only a power of two).

```ada
type Mod_Int is mod 2**5;  -- range 0 .. 31
M : constant Mod_Int := 20 + 15;  -- (20+15) mod 32 = 3
```

Because wrap-around is defined by the language, you can write portable code that relies on it (e.g. ring buffers).

---

## Enumerations

**Enumeration** types list their literals; they are **not** integers and are incompatible with other enumeration types. They are **discrete** types, so they can index arrays and be used in **case** and **for** loops.

```ada
type Days is (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday);

for I in Days loop
   case I is
      when Saturday .. Sunday => Put_Line ("Weekend");
      when Monday .. Friday   => Put_Line (Days'Image (I));
   end case;
end loop;
```

The predefined **Boolean** type is defined as an enumeration: `type Boolean is (False, True);`.

---

## Floating-point types

**Float** is the usual predefined floating-point type (precision is implementation-defined; often 32-bit). You can define types with a required **precision** (decimal digits) and optionally a **range**:

```ada
type T3  is digits 3;
type T15 is digits 15;
type T_Norm is new Float range -1.0 .. 1.0;
type T6_Inv_Trig is digits 6 range -Pi/2.0 .. Pi/2.0;
```

**digits** asks for at least that many decimal digits of precision; the compiler picks a representation. Assigning a value outside the range raises **Constraint_Error**.

---

## Strong typing and type conversion

Different types in the same “family” (e.g. two different integer or float types) are **incompatible**: you cannot assign one to the other without an explicit **type conversion**. There is no implicit conversion between e.g. **Integer** and **Float**, or between two derived numeric types. That avoids subtle bugs (e.g. integer division when you meant float division). Conversion uses the syntax **Type_Name (Expression)**:

```ada
type Meters is new Float;
type Miles  is new Float;
Dist_Metric   : constant Meters := 1000.0;
Dist_Imperial : Miles;
Dist_Imperial := Miles (Dist_Metric) * 621.371e-6;
```

The idiomatic way to convert between domain types (e.g. Meters and Miles) is to introduce **conversion functions** (e.g. **To_Miles (M : Meters) return Miles**) and use them instead of raw conversions everywhere.

---

## Derived types

**Derived types** create a new type from an existing one with **type New_T is new Old_T**. The new type has the same representation and operations but is **distinct**: you cannot assign between them without conversion. You can refine the range for scalar types:

```ada
type Social_Security_Number is new Integer range 0 .. 999_99_9999;
SSN : Social_Security_Number := 555_55_5555;
-- I := SSN;        -- illegal
-- SSN := I;        -- illegal
I := Integer (SSN);  -- OK with conversion
```

Underscores in numeric literals are ignored (for readability).

---

## Subtypes

A **subtype** does **not** introduce a new type; it restricts the set of values of an existing type. Subtypes are compatible: you can assign a **Days** value to a **Weekend_Days** variable if the value is in the subtype’s range. Constraints are enforced at **runtime**; violating them raises **Constraint_Error**.

```ada
subtype Weekend_Days is Days range Saturday .. Sunday;
M : Days := Sunday;
S : Weekend_Days := M;  -- OK, same type
```

Predefined subtypes include **Natural** (`Integer range 0 .. Integer'Last`) and **Positive** (`Integer range 1 .. Integer'Last`).

---

## Subtypes as type aliases

A subtype **without** a new constraint is a **type alias** (synonym): it is the same type under another name. So **subtype Meters is Float;** and **subtype Miles is Float;** both mean **Float**; variables of both can be mixed without conversion. That loses the benefit of strong typing between domains (e.g. meters vs miles), so for domain types the recommendation is to use **type X is new Y** (derived types). Type aliases are still useful for readability (e.g. **subtype Amount is Float;** and then **Paid, Due : Amount;**).

---

## Further reading

- [Strongly typed language](https://learn.adacore.com/courses/intro-to-ada/chapters/strongly_typed_language.html)
- [More about types](https://learn.adacore.com/courses/intro-to-ada/chapters/more_about_types.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
