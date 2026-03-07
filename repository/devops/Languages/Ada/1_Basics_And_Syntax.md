# Ada — Basics and syntax

[← Ada README](./README.md)

This topic covers the foundation: program structure, the imperative core (conditionals, loops, case), declarative regions, and conditional expressions. Ada clearly separates **statements** (which do something) from **expressions** (which produce a value).

---

## Role of the language

Ada is a multi-paradigm language; its **core** is a simple, coherent procedural/imperative language similar to C or Pascal. An important distinction from C is that **statements and expressions are strictly separate**: if you use an expression where a statement is required (or the reverse), the program does not compile. That supports a useful style—expressions deliver values and avoid side effects—and prevents mistakes such as using `=` instead of `:=` in an assignment.

---

## Hello world

A minimal program uses a **procedure** as the entry point. `with` names external modules (similar to `import` or `#include`). The main procedure can have any name; the builder chooses the entry point.

```ada
with Ada.Text_IO;

procedure Greet is
begin
   Ada.Text_IO.Put_Line ("Hello, World!");
end Greet;
```

`Put_Line` is a procedure in the standard package `Ada.Text_IO`; it outputs a line of text. To avoid the package prefix, add a **use clause**:

```ada
with Ada.Text_IO; use Ada.Text_IO;

procedure Greet is
begin
   Put_Line ("Hello, World!");
end Greet;
```

Comments start with `--` and run to the end of the line. There is no multi-line comment; use `--` on each line.

---

## If / then / else / elsif

The **if** statement has a Boolean condition, a **then** part, and optionally **else** and **elsif** parts. It is terminated by **end if**.

```ada
if N > 0 then
   Put_Line (Integer'Image (N) & " is positive");
elsif N < 0 then
   Put_Line (Integer'Image (N) & " is negative");
else
   Put_Line ("Zero");
end if;
```

The **in** operator tests whether a scalar value is in a range and returns a Boolean (e.g. `N in 1 .. 10`). Ada uses **elsif** (one word), not `else if`. The explicit **end if** avoids the "dangling else" problem.

---

## Loops

Ada has three loop forms.

**1. For loop** — Iterate over a discrete range. The loop parameter is constant and local to the loop; it cannot be modified. Use **reverse** to iterate backwards.

```ada
for I in 1 .. 5 loop
   Put_Line ("Hello" & Integer'Image (I));
end loop;

for I in reverse 1 .. 5 loop
   Put_Line (Integer'Image (I));
end loop;
```

If the upper bound is less than the lower bound, the loop body is not executed. Bounds are evaluated once before the loop.

**2. Bare loop** — An infinite loop; exit with **exit when** condition. Declarations (e.g. a variable `I`) go in the **declarative region** between **is** and **begin**.

```ada
I : Integer := 1;
loop
   Put_Line (Integer'Image (I));
   exit when I = 5;
   I := I + 1;
end loop;
```

Assignment uses **:=**; equality uses **=**. There is no `++`; use `I := I + 1`.

**3. While loop** — The condition (must be Boolean) is evaluated before each iteration.

```ada
while I <= 5 loop
   Put_Line (Integer'Image (I));
   I := I + 1;
end loop;
```

In Ada the condition must be a Boolean value, not an integer treated as true/false.

---

## Case statement

**case** selects one branch based on a discrete expression. Every possible value must be covered by exactly one branch (checked at compile time). Branches can list single values, ranges, or combinations separated by **|**. The **others** branch covers any remaining values. There is no fall-through (no **break** needed).

```ada
case N is
   when 0 | 360     => Put_Line ("due north");
   when 1 .. 89     => Put_Line ("northeast quadrant");
   when 90          => Put_Line ("due east");
   when 91 .. 179   => Put_Line ("southeast quadrant");
   when others      => Put_Line ("not in 0..360");
end case;
```

---

## Declarative regions and block statement

Declarations (variables, constants, types, nested subprograms) appear in **declarative regions**. In a subprogram, the region is between **is** and **begin**. A declaration cannot appear as a statement. To declare a local variable in the middle of statements, use a **block**:

```ada
declare
   Name : String := Get_Line;
begin
   exit when Name = "";
   Put_Line ("Hi " & Name & "!");
end;
```

The **&** operator concatenates strings. After the block, `Name` is out of scope.

---

## If and case expressions (Ada 2012)

**if** and **case** can be used as expressions that produce a value. All branches must have the same type. The **if** expression must be in parentheses when used inside a larger expression; an **else** branch is required (unless the result is Boolean, in which case it can default to **else True**).

```ada
S : constant String :=
  (if N > 0 then " is positive" else " is not positive");

Put_Line (if I mod 2 = 0 then "Even" else "Odd");
```

**Case** expression branches are separated by commas:

```ada
Put_Line (case I is
          when 1 | 3 | 5 | 7 | 9  => "Odd",
          when 2 | 4 | 6 | 8 | 10 => "Even");
```

---

## Attributes

Attributes are built-in operations on types or values, written with an apostrophe: **Type'Attribute** or **Object'Attribute**. Examples: **Integer'Image (X)** converts an integer to a String; **Integer'Last** is the maximum value; **Arr'Range** is the index range of an array; **Arr'First**, **Arr'Last**, **Arr'Length** give bounds and length.

---

## Further reading

- [Introduction to Ada — Imperative language](https://learn.adacore.com/courses/intro-to-ada/chapters/imperative_language.html)
- [Ada 2022 Reference Manual (AdaIC)](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
