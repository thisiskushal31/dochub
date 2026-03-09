# Procedures and functions

[← Back to Delphi](./README.md)

Delphi code is organized into **procedures** and **functions**. A **procedure** performs an action and does not return a value; a **function** returns a value and can be used in expressions. Both can take **parameters** (by value, **var**, **const**, or **out**), **default** parameters, and **directives** (e.g. **overload**, **inline**, **cdecl**). This topic goes deep on declaration syntax, parameter passing, overloading, forward declarations, and when to use each style.

---

## Procedure declaration

A **procedure** is declared with **procedure** name, optional **parameters** in parentheses, optional **directives**, then **local declarations** (var, const, type) and a **begin** / **end** body. It is called by writing its name and arguments.

```pascal
procedure PrintSum(A, B: Integer);
var
  Sum: Integer;
begin
  Sum := A + B;
  WriteLn('Sum = ', Sum);
end;

// Call:
PrintSum(3, 5);
```

---

## Function declaration

A **function** is like a procedure but has a **return type** after the parameter list. The return value is assigned to the special variable **Result** (or, in older syntax, to the function name) before the function exits.

```pascal
function Add(A, B: Integer): Integer;
begin
  Result := A + B;
end;

// Use in expression:
N := Add(10, 20);
```

---

## Parameters: value, var, const, out

- **By value (default):** The parameter receives a **copy**. For simple types (Integer, Double) this is cheap. For **string** and **dynamic array**, the reference is copied so the callee can modify content unless you use **const**. Use **const** for read-only parameters (e.g. **const S: string**) to avoid unnecessary copies and document intent.
- **var:** Passed by **reference**; the routine can modify the caller’s variable. Use for output or in-out (e.g. **Swap**). Caller must pass a variable, not a constant.
- **const:** Read-only reference; the routine must not modify it. For strings and arrays, **const** is efficient and preferred when the routine does not change the value.
- **out:** Like **var** but indicates the routine will **assign** before use; documents “return via parameter.”

```pascal
procedure Swap(var X, Y: Integer);
var
  T: Integer;
begin
  T := X;
  X := Y;
  Y := T;
end;

function LengthStr(const S: string): Integer;
begin
  Result := System.Length(S);
end;

procedure Parse(const Line: string; out Key, Value: string);
begin
  // assign Key and Value
end;
```

---

## Default (optional) parameters

Parameters can have a **default value**; callers may omit trailing such parameters. Defaults must be at the **end** of the parameter list and must be constant expressions. Useful for optional behavior (e.g. **Level: Integer = 0**).

```pascal
procedure Log(const Msg: string; Level: Integer = 0);
begin
  // Level defaults to 0 if not passed
end;
```

---

## Overloading

You can define multiple procedures or functions with the same name but different parameter lists (different number or types of parameters). The compiler chooses the correct one from the call site. This is called **overloading**.

```pascal
function Max(A, B: Integer): Integer;
begin
  if A > B then Result := A else Result := B;
end;

function Max(A, B: Double): Double;
begin
  if A > B then Result := A else Result := B;
end;
```

Mark each overload with the **overload** directive. The compiler picks the correct one from the argument types at the call site.

---

## Forward declaration

If **A** calls **B** and **B** is defined later in the same unit, declare **B** with **forward** and define it later: **procedure B(X: Integer); forward;** then **procedure B;** ... **begin** ... **end;**. Useful when two routines call each other.

---

## Directives: inline, calling convention

- **inline:** Suggests inlining at call sites for small, hot-path routines.
- **cdecl**, **stdcall**, **safecall:** **Calling conventions** for C, WinAPI, or COM interop. Use when declaring **external** or callback functions that must match a foreign ABI (e.g. **external 'mylib.dll'; cdecl;**).

---

## Exit

**Exit** leaves the current procedure or function immediately. In a function, the return value is the current **Result**. Use for early returns to avoid deep nesting.

```pascal
function FindIndex(const A: array of Integer; V: Integer): Integer;
var
  I: Integer;
begin
  for I := 0 to High(A) do
    if A[I] = V then
    begin
      Result := I;
      Exit;
    end;
  Result := -1;
end;
```

---

## Summary

- **procedure** / **function** with **Result** for return value. **var** = by reference; **const** = read-only; **out** = write-only output.
- **Default** parameters at end of list. **overload** for same name, different parameter lists. **forward** for declaration before definition. **inline** and calling-convention directives for performance and interop. **Exit** for early return.

---

## Further reading

- [Procedures and Functions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Procedures_and_Functions)
