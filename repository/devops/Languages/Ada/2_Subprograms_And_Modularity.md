# Ada — Subprograms and modularity

[← Ada README](./README.md)

Subprograms (procedures and functions), parameter modes, packages, and child packages form the modular structure of Ada programs.

---

## Subprograms

**Procedures** perform actions and do not return a value (similar to C/C++ functions returning `void`). **Functions** return a value. A subprogram with **no parameters** has no parameter list at all: `procedure Proc;` or `function F return Integer;`. Parameters can have **default values**; when calling, you can omit arguments that have defaults. A parameterless call does not use parentheses: `Increment_By;` uses default values.

You can **declare** a subprogram (specification only) and **define** it later. Forward declarations allow mutually recursive subprograms.

```ada
function Increment (I : Integer) return Integer;

function Increment (I : Integer) return Integer is
begin
   return I + 1;
end Increment;
```

**Named parameter passing** is allowed at the call site. Positional parameters must come first; a positional parameter cannot follow a named one.

```ada
C := Increment_By (I => A, Incr => B);
```

---

## Function return values

In Ada, a function call’s return value **cannot be ignored**: a function call cannot be used as a statement. If you call a function and do not need the result, you must assign it to a variable (or otherwise use it). This avoids silent misuse and supports static analysis.

---

## Parameter modes

Parameter modes document and enforce how parameters are used:

| Mode      | Meaning                         |
|----------|----------------------------------|
| **in**   | Read-only (default). Cannot assign to the parameter. |
| **out**  | Write, then read. Caller provides a variable; the subprogram sets its value. |
| **in out** | Read and write. Changes are visible to the caller. |

**in** is the default, so parameters are not modified unless you explicitly use **out** or **in out**. Assigning to an **in** parameter is a compile-time error. To swap two integers, the procedure must use **in out**:

```ada
procedure Swap (A, B : in out Integer) is
   Tmp : Integer;
begin
   Tmp := A;
   A   := B;
   B   := Tmp;
end Swap;
```

**out** parameters are used when a subprogram must “return” more than one value (Ada has no tuple type); the subprogram writes to the out parameter before returning. Semantically, modes are higher-level than “by value” vs “by reference”; the compiler may pass by reference for efficiency when the parameter is not modified (e.g. large arrays as **in**).

---

## Nested subprograms

A subprogram can be declared inside another. Nested subprograms can use the outer scope (parameters and local variables), which helps with organization and controlled sharing of state. Helper procedures used only by one subprogram are often declared nested.

---

## Subprogram renaming

You can introduce a new name for a subprogram with **renames**:

```ada
procedure Show (S : String) renames A_Procedure_With_Very_Long_Name;
function Img (I : Integer) return String renames Integer'Image;
```

Renaming can also add default expressions that the original declaration did not have.

---

## Packages

**Packages** group related declarations (types, constants, subprograms) into a **specification** (`.ads`) and, when needed, a **body** (`.adb`). The **with** clause names a dependency on another unit; it is **semantic**, not text inclusion (unlike C `#include`). The effect of a package does not depend on where it is **with**’ed. **use** *Package_Name* makes the package’s entities directly visible so you can write `Put_Line` instead of `Ada.Text_IO.Put_Line`.

```ada
package Week is
   Mon : constant String := "Monday";
   Tue : constant String := "Tuesday";
   -- ...
end Week;
```

Accessing entities uses dot notation: **Package.Entity**. A **with** clause may only appear in the prelude of a compilation unit (before the unit’s declaration). A **use** clause may appear in the prelude or in any declarative region; its effect is limited to that scope.

---

## Package body and encapsulation

When a package has subprograms or private state, the **body** contains their implementations. Entities declared **only in the body** are invisible outside the package (and to child packages). That provides encapsulation: e.g. a variable that tracks internal state can live in the body and be updated only by the package’s own subprograms.

```ada
package Operations is
   function Increment_By (I : Integer; Incr : Integer := 0) return Integer;
   function Get_Increment_Value return Integer;
end Operations;

package body Operations is
   Last_Increment : Integer := 1;  -- hidden from clients

   function Increment_By (I : Integer; Incr : Integer := 0) return Integer is
   begin
      if Incr /= 0 then
         Last_Increment := Incr;
      end if;
      return I + Last_Increment;
   end Increment_By;
   -- ...
end Operations;
```

---

## Child packages

**Child packages** extend a parent: the name is **Parent.Child** (e.g. **Ada.Text_IO**). The child automatically sees the **specification** of the parent (not the parent’s body). So **Week.Child** can use **Mon**, **Tue**, etc., from **Week** without a separate **with Week**. A parent can have multiple children (**Week.Child**, **Week.Child_2**). The hierarchy can go deeper: **Week.Child.Grandchild**.

Visibility rule: only what is in the **parent’s specification** is visible in the child. Anything declared only in the parent’s **body** is not visible to the child. To expose behavior, the parent exposes subprograms in its spec that the child can call.

---

## Package and subprogram renaming

Packages can be renamed: `package TIO renames Ada.Text_IO;` then `TIO.Put_Line ("Hello");`. You can also rename a subprogram inside a package: `procedure Say (S : String) renames Ada.Text_IO.Put_Line;`.

---

## Further reading

- [Subprograms](https://learn.adacore.com/courses/intro-to-ada/chapters/subprograms.html)
- [Modular programming](https://learn.adacore.com/courses/intro-to-ada/chapters/modular_programming.html)
- [Privacy](https://learn.adacore.com/courses/intro-to-ada/chapters/privacy.html)
