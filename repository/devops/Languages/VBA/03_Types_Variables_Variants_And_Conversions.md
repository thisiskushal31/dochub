# Types, variables, Variants, and conversions

[← Back to VBA](./README.md)

## What this chapter covers

How VBA **represents values**—and how Variants hide bugs when you let them. By the end you should be able to:

1. Name the common **intrinsic types** and when to reach for each.
2. Explain **`Variant`**, **`Object`**, and why “everything Variant” is not speed—it is fog.
3. Use **`Dim` / `ReDim`** honestly with arrays.
4. Convert at edges with **`CInt`**, **`CLng`**, **`CStr`**, **`CBool`**, **`CDate`**, and cousins.
5. Distinguish **`Empty`**, **`Null`**, and **`Nothing`**.
6. Inspect values with **`TypeName`** / **`VarType`**.
7. Use **`Const`** and treat **`Enum`** as a literacy door.

Chapter **02** gave you modules and `Option Explicit`. This chapter is the **data** layer. Control flow is **04**; collections/strings deepen in **06**.

Handbook default: **declare real types**; convert at boundaries; Variants only with a reason.

---

## 1. Concepts

### 1. Intrinsic types you will actually use

| Type | Role | Notes |
|------|------|-------|
| **Boolean** | True/False | Not interchangeable with arbitrary integers in careful code |
| **Byte** | 0–255 | Rare in LOB; useful for tight buffers |
| **Integer** | 16-bit | Prefer **`Long`** for counters in modern code |
| **Long** | 32-bit integer | Default integer choice |
| **LongLong** | 64-bit integer | 64-bit Office; pair with `LongPtr` literacy for APIs (**13**) |
| **LongPtr** | Pointer-sized | Declare/API work—not everyday business math |
| **Single** / **Double** | Floating point | Money: prefer careful Decimal strategies / Currency awareness |
| **Currency** | Scaled fixed-point | Financial-ish; know rounding rules |
| **Date** | Date/time | Stored as `Double` under the hood—display ≠ value (**06**) |
| **String** | Text | VBA strings are length-aware; see **06** |
| **Object** | Object reference | Must `Set`; default `Nothing` |
| **Variant** | Universal container | Default if you omit types—avoid that habit |

```vb
Option Explicit

Dim rowCount As Long
Dim label As String
Dim whenOpened As Date
Dim sheet As Worksheet
```

### 2. `Dim` and the cost of silence

With `Option Explicit`, every variable needs a declaration. Without a type:

```vb
Dim x   ' As Variant — implicit
```

Staff style: **always write `As SomeType`**. Implicit Variant is how “temporary” becomes permanent fog.

### 3. `Variant` — power and fog

A `Variant` can hold many kinds of data (including arrays and `Empty`). Hosts and Excel cells often hand you Variants.

| Use Variant when… | Prefer a concrete type when… |
|--------------------|------------------------------|
| Talking to cells / COM that return Variant | Local counters, flags, names |
| Truly heterogeneous bags (rare) | Public API parameters you control |
| You are about to branch on `VarType` | You already know the domain type |

```vb
Dim v As Variant
v = Range("A1").Value
If IsNumeric(v) Then
    rowCount = CLng(v)
End If
```

Convert **once** at the edge; keep the interior typed.

### 4. `Object` and `Set`

```vb
Dim rng As Range
Set rng = Range("A1:B2")
' rng = Range(...)  ' wrong — needs Set
```

| Assignment | Use |
|------------|-----|
| `x = …` | Value types / Variants holding values |
| `Set x = …` | Object references |

Clearing: `Set rng = Nothing` releases your reference (host lifetime still applies—chapter **07**).

### 5. Conversions at the boundary

Common conversion functions:

| Function | Toward |
|----------|--------|
| `CBool` | Boolean |
| `CByte` | Byte |
| `CInt` | Integer |
| `CLng` | Long |
| `CLngLng` | LongLong (where available) |
| `CSng` / `CDbl` | Single / Double |
| `CStr` | String |
| `CDate` | Date |
| `CCur` | Currency |
| `CVar` | Variant |

```vb
Dim n As Long
n = CLng(Trim$(CStr(Range("A1").Value)))
```

**Overflow and domain errors** raise runtime errors—handle at edges (chapter **05**). Prefer `CLng` over `CInt` for worksheet integers unless you truly need 16-bit.

Also know: `Val` parses leading numbers from strings with older locale quirks; prefer explicit `C*` conversions when you know the shape.

### 6. `Empty`, `Null`, and `Nothing`

| Sentinel | Meaning |
|----------|---------|
| **`Empty`** | Uninitialized `Variant` (or cleared) |
| **`Null`** | Database/Null-ish Variant state; spreads through expressions |
| **`Nothing`** | Object reference points nowhere |

```vb
If IsEmpty(v) Then ...
If IsNull(v) Then ...
If obj Is Nothing Then ...
```

Do not use `obj = Nothing` for the test—use **`Is`**. Do not assume Excel blank cells are always `Empty`; they can be `""` or other values depending on how you read them (chapter **08**).

### 7. Arrays — `Dim` / `ReDim` / `Array()` literacy

```vb
Dim names(1 To 3) As String
Dim flexible() As Long
ReDim flexible(1 To 10)
ReDim Preserve flexible(1 To 20)  ' keep existing elements; costlier

Dim days As Variant
days = Array("Mon", "Tue", "Wed")   ' Variant holding an array
Debug.Print LBound(days), UBound(days)
```

| Habit | Why |
|-------|-----|
| Prefer explicit bounds | Avoid off-by-one fights with default `0 To n` vs `Option Base` |
| `ReDim Preserve` sparingly | Copies; not a free resize—never in a hot loop without need |
| Know `LBound` / `UBound` | Never assume `0`; always bound loops to the actual array |
| `Array(...)` | Handy for small Variant lists; lower bound interacts with `Option Base` (and `VBA.Array` quirks)—check `LBound` |

Chapter **06** pairs arrays with `Split` / `Join`.

---

## 2. Advanced concepts

### 1. `TypeName` and `VarType`

```vb
Debug.Print TypeName(v)   ' e.g. "String", "Range", "Nothing"
Debug.Print VarType(v)    ' vb... constants
```

Use in diagnostics and careful edge parsing—not as a substitute for designing typed APIs.

### 2. `Const`

```vb
Private Const MAX_ROWS As Long = 5000
Private Const APP_TITLE As String = "Quarterly Export"
```

Constants document intent and prevent magic numbers. Prefer module `Private Const` over unexplained literals in Public procedures.

### 3. `Enum` literacy door

```vb
Private Enum JobState
    JobPending = 0
    JobRunning = 1
    JobDone = 2
End Enum
```

Enums improve readability for small closed sets. Know that under the hood they are integers—validate when values arrive from worksheets as free text.

### 4. Default members and implicit conversion traps

Host objects often have **default properties** (e.g. `Range`’s default leading toward `.Value`). That means `x = Range("A1")` can mean something different from `Set r = Range("A1")`. Staff habit: be explicit—`.Value`, `.Value2`, `.Text`—especially in Excel (chapter **08**).

### 5. Boolean and numeric honesty

In VBA, `True` is historically `-1` in numeric contexts. Do not write clever arithmetic on Booleans in LOB code. Use `If flag Then` / `And` / `Or` clearly; prefer `AndAlso`-style short-circuit thinking by structuring `If`s (VBA’s `And`/`Or` do not short-circuit like some languages—chapter **04**).

### 6. Strings: fixed vs variable (door)

Classic `String * n` fixed-length strings appear in older APIs. Prefer ordinary `String` for business text (**06**).

### 7. 64-bit Office and `LongPtr`

When touching `Declare` (chapter **13**), pointer-sized types matter. For ordinary row counters, **`Long` remains the workhorse**—do not sprinkle `LongPtr` into business logic.

### 8. User-defined types (`Type ... End Type`)

A **user-defined type (UDT)** groups related *value* fields into one named structure. Declare at module level:

```vb
Private Type AddressLine
    Line1 As String
    City As String
    PostalCode As String
End Type

Private Sub DemoUdt()
    Dim a As AddressLine
    a.Line1 = "1 Contoso Way"
    a.City = "Redmond"
    a.PostalCode = "98052"
End Sub
```

| Use a UDT when… | Prefer a **class module** when… |
|-----------------|----------------------------------|
| You need a compact record of values (coords, parse results, DTO-ish bags) | You need **behavior**, validation on write, or lifecycle (`Initialize`/`Terminate`) |
| Passing a small bundle ByRef/ByVal without inventing an object | You need properties with logic, or instances in Collections with identity |
| Interop / older APIs expect a structured layout | You are modeling a domain entity staff will extend |

**When not to use:** if the “struct” keeps growing methods, invariants, or object fields you mutate carefully—graduate to a class (chapter **02**). UDTs are values, not objects: no `New`, no `Property Get` on the type itself, and assignment copies fields. Nested objects inside UDTs have sharp edges—keep UDTs simple.

---

## 3. Applications and use cases

| Angle | Types in practice |
|-------|-------------------|
| **Application** | Typed locals; Variant only at cell/COM edges with immediate conversion. |
| **Systems** | Match host types (`Range`, `Document`) via early binding inside the host. |
| **Security** | Never “trust” sheet input as Long without validation—conversion errors and toxic values are ops issues. |
| **Operations** | Constants for limits/titles; enums for state machines in long-lived templates. |
| **Software engineering** | Public APIs take/return concrete types; document Variant only when unavoidable. |

**Whole-engineering picture:** Types are how you keep macros *movable*. Variants are how you talk to Office—not how you abandon structure.

---

## Staff-level review checklist

- `Option Explicit` present; every variable has an explicit `As` type unless Variant is justified in a comment/name.
- Counters and IDs use `Long` (not casual `Integer`) unless a real 16-bit constraint exists.
- Object variables assigned with `Set`; released/`Nothing` where ownership requires it.
- Conversions (`CLng`, `CStr`, `CDate`, …) at edges; interiors stay typed.
- `Empty` / `Null` / `Nothing` tests use the right predicate (`IsEmpty` / `IsNull` / `Is Nothing`).
- Arrays have clear bounds; loops use `LBound`/`UBound`; `ReDim Preserve` not used in tight loops without need.
- `Array()` results treated as Variant arrays—bounds verified, not assumed from `Option Base` folklore.
- UDTs (`Type...End Type`) used for simple value records; classes preferred when behavior or validation belongs with the data.
- `Const` for repeated literals; no secret credentials in constants.
- Default property reliance avoided—explicit `.Value` / `.Value2` in Excel code.
- `TypeName`/`VarType` used for diagnostics or true unions—not spaghetti control flow.
- Public Functions document return types and do not silently return Empty on failure without a contract (pair with **05**).

---

## References

- [Data type summary](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/data-type-summary)
- [Variant data type](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/variant-data-type)
- [Declaring variables](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/declaring-variables)
- [Type conversion functions](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/type-conversion-functions)
- [TypeName function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/typename-function)
- [VarType function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/vartype-function)
- [Const statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/const-statement)
- [Enum statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/enum-statement)
- [Type statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/type-statement)
- [User-defined data type](https://learn.microsoft.com/en-us/office/vba/language/how-to/user-defined-data-type)
- [Array function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/array-function)
- [LBound function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/lbound-function)
- [UBound function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/ubound-function)
