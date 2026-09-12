# Data types, variables, and constants

[← Back to Delphi](./README.md)

Delphi is **statically typed**: every variable and parameter has a **type**, and the compiler enforces that values match their type. This topic goes deep on **built-in types**, **variables** and **constants**, **type declarations**, **strings**, **arrays** (static and dynamic), **records**, **sets**, **enumerations**, **pointers**, and **variants** so you can read and write typical Delphi code and understand type compatibility and when to use which type.

---

## Variable declarations

Variables are declared in a **var** section. The syntax is **identifier list : type ;**. Multiple variables of the same type can be listed together. **Global** (unit-level or program-level) variables can be given an initial value with **= constantExpression**; **local** variables cannot be initialized in the declaration and start with an undefined value (or the type’s default) unless you assign them before use. Global variables are zero-initialized (or nil for pointers/classes) if not given an explicit initial value in many implementations.

```pascal
var
  X, Y, Z: Double;
  I, J, K: Integer;
  Name: string;
  Count: Integer = 0;  // allowed for global (unit-level) var
```

---

## Ordinal and numeric types

- **Integer** — Signed integer (size depends on platform; often 32-bit). Use for counts, indices, and general arithmetic.
- **Cardinal** — Unsigned integer (same bit size as Integer on the platform).
- **Int64** / **UInt64** — 64-bit signed/unsigned when you need range beyond 32 bits.
- **Word**, **Byte**, **Shortint**, **Smallint** — Smaller integer types; useful for interoperability or when size matters.
- **Double** / **Single** — 64-bit and 32-bit floating-point. **Extended** is available on some platforms for higher precision. Use **Double** for most real-number math; **Single** when size or compatibility (e.g. with APIs) requires it.

```pascal
var
  N: Integer;
  R: Double;
  Flag: Boolean;
  C: Char;
  S: string;
```

---

## Boolean and character

- **Boolean** — **True** or **False**. Conditions in **if**, **while**, **until** must be Boolean. There is no implicit conversion from integer to Boolean; write **I <> 0** instead of **I** in conditions.
- **Char** — Single character (often 16-bit Unicode in modern Delphi). **AnsiChar** (8-bit) and **WideChar** exist for compatibility and API calls. Character literals use single quotes: **'A'**.

---

## Strings in depth

**string** is a fundamental type for text. In modern Delphi it is typically **UnicodeString** (UTF-16). **AnsiString** is 8-bit per character (code page–dependent). String literals are written in **single quotes**; a single quote inside a string is represented by **two single quotes** (**'It''s'**). Concatenation uses **+**. Many string operations are in **SysUtils** (e.g. **Length**, **Copy**, **Pos**, **Trim**, **IntToStr**, **StrToInt**, **Format**) and **StrUtils** (e.g. **ContainsStr**, **ReplaceStr**). **string** is **reference-counted** and **copy-on-write** in many implementations; assigning or passing by value does not necessarily copy the buffer until the string is modified.

```pascal
var
  S: string;
begin
  S := 'Hello, world!';
  S := S + ' More text';
  if Pos('world', S) > 0 then
    S := Trim(S);
end;
```

---

## Constants

Constants are declared in a **const** section. **True constants** get a value at compile time and cannot be changed at runtime. **Typed constants** (with **: type = value**) may behave like initialized variables in some dialects (e.g. writable in Delphi; check your compiler). For true read-only constants, use untyped **const** or **resourcestring** for string constants that can be localized.

```pascal
const
  MaxSize = 100;
  AppName = 'MyApp';
  PiApprox: Double = 3.14159;
```

---

## Type declarations and compatibility

You can introduce **type aliases** or **new types** in a **type** section. A simple alias is **type TMyString = string;** — **TMyString** and **string** are then **compatible** for assignment and parameters. To create a **distinct** type (incompatible with its base for assignment), use **type NewName = type BaseType;** (e.g. **type TMyInt = type Integer;**). Then you cannot assign an **Integer** to a **TMyInt** without an explicit cast. Distinct types help avoid mixing semantics (e.g. “index” vs “count”) and improve type safety.

```pascal
type
  TMyString = string;
  TCount = Integer;
  TIndex = type Integer;  // distinct
```

---

## Enumerations and sets

**Enumerations** define an ordered set of named constants. They are ordinal types (each value has an integer representation). **Sets** are collections of values of the same ordinal type (often an enum); the base type must have at most 256 possible values (ordinality 0..255). Sets are used for flags and multi-value options.

```pascal
type
  TState = (stIdle, stRunning, stDone);
  TStates = set of TState;
var
  State: TState;
  Allowed: TStates;
begin
  State := stRunning;
  Allowed := [stIdle, stRunning];
  if State in Allowed then
    WriteLn('Allowed');
end;
```

---

## Records (structs)

**Records** are value types that group **fields**. They are declared with **record** ... **end** and can have **methods** and **properties** in modern Delphi (record helpers). Records are copied by value on assignment; they are useful for small, fixed-size data (points, rectangles, config structs) and for interop with C or the OS when layout must match.

```pascal
type
  TPoint = record
    X, Y: Integer;
  end;
  TRect = record
    Left, Top, Right, Bottom: Integer;
  end;
var
  P: TPoint;
  R: TRect;
begin
  P.X := 10;
  P.Y := 20;
  R.Left := 0;
  R.Right := 100;
end;
```

---

## Arrays: static and dynamic

**Static arrays** have fixed bounds: **array[0..9] of Integer** or **array[1..10] of string**. The index type can be any ordinal type. **Dynamic arrays** are declared with **array of T** (e.g. **array of Integer**). They are allocated at runtime with **SetLength(A, N)**; **Length(A)** and **High(A)** give the count and upper bound. Dynamic arrays are **zero-based** and are reference-counted in many implementations. When you pass a dynamic array to a procedure, changes to elements are visible to the caller; to resize, you must call **SetLength** (or reassign). **Open array** parameters (**array of T**) accept both static and dynamic arrays and are passed by reference for efficiency.

```pascal
var
  Arr: array[0..9] of Integer;       // static
  Dyn: array of Integer;             // dynamic
  I: Integer;
begin
  for I := 0 to 9 do
    Arr[I] := I;
  SetLength(Dyn, 10);
  for I := 0 to High(Dyn) do
    Dyn[I] := I;
end;
```

---

## Pointers

Delphi supports **typed pointers** (**PInteger**, **PByte**, etc.) and **untyped Pointer**. Pointer arithmetic is limited (e.g. **Inc(P, size)** or **P + offset** depending on dialect). Pointers are used for low-level code, API interop, and sometimes for performance-critical buffers. **Class**-type variables are effectively **pointers** to objects (nil or a valid instance); you do not use **^** to dereference them — the compiler treats them as references. **Record** and **array** types are value types unless you use **pointer to record** or **dynamic array** (which is already a reference type). When analyzing binaries, pointer and buffer usage in Delphi often shows up as **PByte**, **PChar**, or **Pointer** in decompiled code.

```pascal
var
  P: PInteger;
  B: PByte;
begin
  GetMem(P, SizeOf(Integer));
  try
    P^ := 42;
  finally
    FreeMem(P);
  end;
end;
```

---

## Variant type

**Variant** is a type that can hold values of different kinds (integer, string, float, array, etc.) at runtime. It is used for **COM** automation, **scripting**, and when the type is not known at compile time. **VarType**, **VarAsType**, and **variant** operators let you inspect and convert. **Variant** is heavy (size and overhead) and not type-safe; use only when necessary (e.g. OLE/COM, dynamic data from external sources).

---

## When to use which type

| Need | Prefer |
|------|--------|
| Counts, indices, small integers | **Integer**, **Cardinal** |
| Large range | **Int64** |
| Real numbers | **Double** (or **Single** if size matters) |
| Text | **string** |
| Flags / multi-value options | **set of** enum |
| Small fixed structs, interop | **record** |
| Variable-length collections | **array of T** (dynamic array) or **TList**/ **TStringList** in **Classes** |
| Low-level / API buffers | **Pointer**, **PByte**, **PChar** |
| COM / scripting / unknown type | **Variant** (sparingly) |

---

## Summary

- **var** declares variables with **identifier : type**; globals can have **= value**; locals are uninitialized unless assigned.
- Built-in types: **Integer**, **Double**, **Boolean**, **Char**, **string**; plus **Int64**, **Cardinal**, **Single**, **AnsiString**, **WideChar**, etc.
- **const** for constants; **type** for aliases or distinct types. **Enum** and **set of** for ordinals and flags.
- **Records** for value structs; **static** and **dynamic** **arrays** for indexed data; **pointers** for low-level or API; **Variant** for dynamic/COM. Use **SysUtils** and **StrUtils** for string and conversion helpers.

---

## Further reading

- [Data Types, Variables, and Constants (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Data_Types,_Variables,_and_Constants_Index_(Delphi))
- [Type Declarations](https://docwiki.embarcadero.com/RADStudio/en/Type_Declarations)
- [Variables (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Variables_(Delphi))
- [Structured Types (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Structured_Types)
- [Pointers and Pointer Types (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Pointers_and_Pointer_Types_(Delphi))
