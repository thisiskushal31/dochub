# Ada — Case studies and hands-on examples

[← Ada README](./README.md)

This topic gives **hands-on examples** and **case studies** so you can see the **implementation**, **format**, and **thought process** behind Ada code. Each example follows the same pattern: **concept or goal** → **approach** → **code** → **expected behavior**. The same pattern is used across all language sections in this handbook: define the concept, then illustrate with a code block or diagram so nothing is left vague.

---

## Format used in this handbook

For every concept we use:

1. **Text first** — What we are doing and why (goal, concept, or rule).
2. **Then a code block or visual** — Concrete Ada code (or diagram) that shows the idea so you can see structure, syntax, and flow.

That way you always get both the explanation and something you can read or run. The case studies below are full, runnable examples drawn from the Intro to Ada labs.

---

## Case study 1: Hello World (imperative entry point)

**Goal:** Display `"Hello World!"` from the main procedure.

**Thought process:** The program needs a procedure (the main entry point), a dependency on `Ada.Text_IO` for output, and a single call to `Put_Line` with the message string.

**Implementation:**

```ada
with Ada.Text_IO; use Ada.Text_IO;

procedure Main is
begin
   Put_Line ("Hello World!");
end Main;
```

**Expected behavior:** Running the program prints `Hello World!` and exits.

---

## Case study 2: Greetings (procedure with parameter)

**Goal:** Greet a person by name: given a string (e.g. from the command line), display `"Hello <name>!"`.

**Thought process:** Use a procedure `Greet (Name : String)` that concatenates `"Hello "`, `Name`, and `"!"` and passes the result to `Put_Line`. The `&` operator concatenates strings. The main procedure checks argument count and calls `Greet (Argument (1))`.

**Implementation:**

```ada
with Ada.Command_Line; use Ada.Command_Line;
with Ada.Text_IO;      use Ada.Text_IO;

procedure Main is

   procedure Greet (Name : String) is
   begin
      Put_Line ("Hello " & Name & "!");
   end Greet;

begin
   if Argument_Count < 1 then
      Put_Line ("ERROR: missing arguments! Exiting...");
      return;
   elsif Argument_Count > 1 then
      Put_Line ("Ignoring additional arguments...");
   end if;

   Greet (Argument (1));
end Main;
```

**Expected behavior:** For input `John`, output is `Hello John!`. For `Joanna`, output is `Hello Joanna!`.

---

## Case study 3: Classify number (if / elsif / else)

**Goal:** Given an integer, classify it as positive, negative, or zero and display the result.

**Thought process:** Use a procedure that takes one `Integer` and uses a single `if` / `elsif` / `else` to choose among three messages. No loops or extra state; the condition structure directly reflects the three cases.

**Implementation:**

```ada
procedure Classify_Number (X : Integer);

with Ada.Text_IO; use Ada.Text_IO;

procedure Classify_Number (X : Integer) is
begin
   if X > 0 then
      Put_Line ("Positive");
   elsif X < 0 then
      Put_Line ("Negative");
   else
      Put_Line ("Zero");
   end if;
end Classify_Number;
```

**Expected behavior:** Input `0` → `Zero`; `1` or `99999` → `Positive`; `-1` or `-99999` → `Negative`.

---

## Case study 4: Display numbers in range (loops and bounds)

**Goal:** Given two integers A and B, display all numbers in the range from the smaller to the larger, one per line.

**Thought process:** Normalize the range: compute `X := min(A, B)` and `Y := max(A, B)` using `if A <= B then ... else ... end if`. Then iterate with `for I in X .. Y loop` and print `Integer'Image (I)`. The `for` loop and range make the intent clear.

**Implementation:**

```ada
procedure Display_Numbers (A, B : Integer);

with Ada.Text_IO; use Ada.Text_IO;

procedure Display_Numbers (A, B : Integer) is
   X, Y : Integer;
begin
   if A <= B then
      X := A;
      Y := B;
   else
      X := B;
      Y := A;
   end if;

   for I in X .. Y loop
      Put_Line (Integer'Image (I));
   end loop;
end Display_Numbers;
```

**Expected behavior:** For `1 5` or `5 1`, the program prints the numbers 1, 2, 3, 4, 5 (one per line). For `-5 -1`, it prints -5 through -1. The range is always from the smaller to the larger bound.

---

## Case study 5: Months package (spec, body, constants)

**Goal:** Create a package that holds constants for month names and a procedure that displays them.

**Thought process:** Put the public interface in the **spec**: constants `Jan` .. `Dec` and procedure `Display_Months`. Put the implementation of `Display_Months` in the **body**; it uses the constants and `Put_Line`. Clients `with Months; use Months;` and call `Display_Months`.

**Implementation (spec):**

```ada
package Months is

   Jan : constant String := "January";
   Feb : constant String := "February";
   Mar : constant String := "March";
   Apr : constant String := "April";
   May : constant String := "May";
   Jun : constant String := "June";
   Jul : constant String := "July";
   Aug : constant String := "August";
   Sep : constant String := "September";
   Oct : constant String := "October";
   Nov : constant String := "November";
   Dec : constant String := "December";

   procedure Display_Months;

end Months;
```

**Implementation (body):**

```ada
with Ada.Text_IO; use Ada.Text_IO;

package body Months is

   procedure Display_Months is
   begin
      Put_Line ("Months:");
      Put_Line ("- " & Jan);
      Put_Line ("- " & Feb);
      Put_Line ("- " & Mar);
      Put_Line ("- " & Apr);
      Put_Line ("- " & May);
      Put_Line ("- " & Jun);
      Put_Line ("- " & Jul);
      Put_Line ("- " & Aug);
      Put_Line ("- " & Sep);
      Put_Line ("- " & Oct);
      Put_Line ("- " & Nov);
      Put_Line ("- " & Dec);
   end Display_Months;

end Months;
```

**Expected behavior:** Calling `Display_Months` prints a list of all 12 month names under the heading "Months:".

---

## Case study 6: Operations package (functions and child package)

**Goal:** A package that provides four integer operations (Add, Subtract, Multiply, Divide) and a child package `Operations.Test` with a `Display (A, B)` procedure that shows all four operations for a given pair.

**Thought process:** **Spec** declares the four functions. **Body** implements each with a single expression. The child package `Operations.Test` declares `Display` and in its body calls `Operations.Add`, `Operations.Subtract`, etc., and formats the output. This shows package hierarchy and reuse.

**Implementation (Operations spec and body):**

```ada
package Operations is

   function Add      (A, B : Integer) return Integer;
   function Subtract (A, B : Integer) return Integer;
   function Multiply (A, B : Integer) return Integer;
   function Divide   (A, B : Integer) return Integer;

end Operations;

package body Operations is

   function Add (A, B : Integer) return Integer is
   begin
      return A + B;
   end Add;

   function Subtract (A, B : Integer) return Integer is
   begin
      return A - B;
   end Subtract;

   function Multiply (A, B : Integer) return Integer is
   begin
      return A * B;
   end Multiply;

   function Divide (A, B : Integer) return Integer is
   begin
      return A / B;
   end Divide;

end Operations;
```

**Expected behavior:** `Add (100, 2) = 102`, `Subtract (100, 2) = 98`, `Multiply (100, 2) = 200`, `Divide (100, 2) = 50`. `Display (10, 5)` prints a line showing all four operations for 10 and 5.

---

## More labs and solutions

The learn.adacore.com **Introduction to Ada** course has a matching **Laboratories** document with exercises (and solutions) for: Imperative Language, Subprograms, Modular Programming, Strongly Typed Language, Records, Arrays, More About Types, Privacy, Generics, Exceptions, Tasking, Design by Contracts, Object Oriented Programming, and Standard Library (Containers, Dates & Times, Strings, Numerics). Each lab follows the same pattern: goal, steps, requirements, starter code, and expected I/O. The case studies above show the **format** and **thought process**; the full lab set gives more hands-on practice.

---

## Further reading

- [Introduction to Ada — course](https://learn.adacore.com/courses/intro-to-ada/index.html)
- [Introduction to Ada: Laboratories](https://learn.adacore.com/courses/labs/intro-to-ada/index.html) — exercises and solutions
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
