# Program structure and basic syntax

[← Back to Delphi](./README.md)

A Delphi **program** or **application** is built from a **project file** (**.dpr**) and one or more **units** (**.pas**). Execution starts at the **begin** / **end** block in the project file. This topic describes that structure in depth: the **program** and **library** entry points, **units** (interface, implementation, initialization, finalization), **begin**/ **end** and **semicolons**, **comments**, and **identifiers**. Understanding this structure is essential for reading legacy code and for knowing **load order** and **initialization** when debugging or analyzing binaries.

---

## Project file (.dpr)

The main program is stored in a **.dpr** (Delphi project) file. It has a **program** name, a **uses** clause listing units, and a **begin** / **end** block that runs when the application starts. The **program** name must match the file name (without extension) in many setups.

```pascal
program MyApp;

uses
  SysUtils, Classes;

begin
  WriteLn('Hello, World!');
end.
```

The **uses** clause brings in **units** (modules) that provide procedures, functions, and types. Order of units can matter: they are **initialized** in the order they appear (each unit’s **initialization** section runs before the next unit’s). The **begin** ... **end.** (with a **period**) is the main block; the program terminates when execution reaches **end.** In a **GUI** application, the **.dpr** usually does little besides **Application.Initialize**, **Application.CreateForm(...)**, and **Application.Run**; the real logic lives in units and form classes.

---

## Library (.dpr as library or package)

You can also build a **library** (DLL) or a **package** instead of an executable. The **.dpr** then starts with **library** MyDll; or **package** MyPkg; and exposes procedures/functions in **exports**. For **packages** (**.bpl** on Windows), the IDE and compiler manage **requires** and **contains**; the runtime loads **.bpl** files when the main exe uses units from that package. When analyzing a Delphi binary, distinguishing between an **exe** (program) and a **.bpl** (package) or **.dll** (library) helps you understand the module’s role.

---

## Units (.pas) in depth

Reusable code lives in **units**. A unit has a **name** (must match the file name), an **interface** section (what it exports), and an **implementation** section (how it does it). Optionally it has **initialization** and **finalization** blocks that run when the unit is loaded and when the program shuts down (or when the package is unloaded).

```pascal
unit MyUnit;

interface

uses
  SysUtils;

procedure DoSomething;
function GetValue: Integer;

implementation

uses
  Classes;

var
  FValue: Integer;

procedure DoSomething;
begin
  WriteLn('Doing something');
end;

function GetValue: Integer;
begin
  Result := FValue;
end;

initialization
  FValue := 0;

finalization
  // cleanup if needed
end.
```

- **interface:** Declares types, constants, variables, procedures, and functions that **other units** can use. Only the **signatures** (and type definitions) appear here; no implementation. The **interface** can have its own **uses** clause (units needed for the declarations). Everything in **interface** is **public** to units that list this unit in their **uses**.
- **implementation:** Contains the actual code for the procedures and functions declared in **interface**. It can have a **uses** clause (often for units that are only needed for implementation, not for the public API). It can also declare **private** types, constants, variables, and helper routines that are **not** visible to other units. This keeps the public API small and hides implementation details.
- **initialization:** Runs once when the unit is loaded (at program start, in the order of **uses** in the **.dpr** and in the **uses** of other units). Use it to set up global state, register classes, or open resources. If multiple units have **initialization**, the order is defined by the dependency graph (units used by the **.dpr** are initialized first, in order; then their dependencies, etc.).
- **finalization:** Runs at shutdown (in **reverse** order of initialization). Use it to free resources, unregister, or flush state. If **initialization** raises an exception, **finalization** may still run for units that were successfully initialized; rely on **finalization** for cleanup, not on “last use.”

---

## Circular unit references

A unit **A** cannot **use** a unit **B** if **B** also **use**s **A** in its **interface** section (circular dependency). The compiler will report an error. Common fixes: move the shared declarations to a third unit **C** that both **A** and **B** use, or put one of the **uses** in the **implementation** section of **A** or **B** so that the dependency is one-way at the interface level. When reading legacy code, circular **uses** in **implementation** are allowed (e.g. **A** implementation uses **B**, **B** implementation uses **A**), but circular **interface** uses are not.

---

## Begin and end

Delphi uses **begin** and **end** to group **statements** into blocks. A **compound statement** is:

```pascal
begin
  Statement1;
  Statement2;
end
```

Semicolons **separate** statements; they do not **terminate** them. So you do **not** put a semicolon after the **end** that closes a **begin** when that **end** is immediately followed by **else** or **until** (otherwise the compiler would treat the **else** or **until** as a new statement). The **end** that closes the **program** or **unit** is followed by a **period** (**end.**).

---

## Semicolons and formatting

**Semicolons** separate statements. They are not required after the **end** of a **begin** block when that **end** is followed by **else** or **until**. Indentation and line breaks are for readability only; the compiler does not rely on them for structure. Consistent style (e.g. **begin** and **end** aligned, body indented) makes code and decompiled code easier to follow.

---

## Comments

- **Single-line:** **//** from the double slash to the end of the line.
- **Block:** **(* ... *)** or **{ ... }** for multi-line or inline comments. Nested **{** inside **{ }** is not allowed; use **(* *)** for nested comments if needed.

```pascal
// This is a single-line comment.
x := 1;  (* inline comment *)
{ Another block comment
  spanning two lines }
```

Compiler directives (e.g. **{$IFDEF}**) use the same **{ $ ... }** or **(* $ ... *)** syntax; the **$** right after the opening **{** or **(*** makes it a directive rather than a plain comment.

---

## Identifiers and names

**Identifiers** (names for variables, procedures, functions, types, units) start with a letter or underscore and can contain letters, digits, and underscores. Delphi is **case-insensitive** for identifiers: **MyVar** and **myvar** refer to the same symbol. By convention (and for readability in decompiled or shared code):

- **T** prefix for **types** (e.g. **TForm**, **TButton**).
- **E** prefix for **exception** classes (e.g. **EConvertError**, **EAccessViolation**).
- **I** prefix for **interface** types (e.g. **IUnknown**, **IStream**).
- **F** prefix for **private fields** (e.g. **FName**, **FCount**).
- **A** prefix for **parameters** in some codebases (e.g. **AValue**, **ASender**).

Reserved words (**begin**, **end**, **procedure**, **function**, **var**, **type**, **uses**, etc.) cannot be used as identifiers.

---

## Summary

- The **program** (**.dpr**) has **uses** and a **begin** / **end.** main block; **library** and **package** are alternative entry points for DLLs and packages.
- **Units** (**.pas**) have **interface** (public API), **implementation** (code and private helpers), and optionally **initialization** / **finalization** (load/unload order matters).
- **begin** / **end** group statements; **semicolons** separate statements; no semicolon before **else** or **until**.
- **Comments** use **//**, **(* *)**, or **{ }**. Identifiers are case-insensitive; conventions use **T**, **E**, **I**, **F**, **A** prefixes. Avoid circular **interface** **uses** between units.

---

## Further reading

- [Delphi Language Reference](https://docwiki.embarcadero.com/RADStudio/en/Delphi_Language_Reference)
- [Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_(Delphi))
