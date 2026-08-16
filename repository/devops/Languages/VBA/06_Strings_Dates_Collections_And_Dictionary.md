# Strings, dates, collections, and Dictionary

[← Back to VBA](./README.md)

## What this chapter covers

Everyday **text**, **time**, and **in-memory structures** you will use constantly in Office automation. By the end you should be able to:

1. Use core string tools: **`Mid`**, **`InStr`**, **`Replace`**, **`Split`**, **`Join`**, **`Len`**, **`Trim`** (and `$` forms).
2. Handle newlines with **`vbCrLf`** / related constants.
3. Work with **`Date` / `Now` / `DateAdd`** at literacy level (locale and serial awareness).
4. Use the built-in **`Collection`** type.
5. Create a **`Scripting.Dictionary`** via **`CreateObject`** (late binding literacy).
6. Tie **arrays** briefly to `Split`/`Join` and loops from **04**.

Chapters **02–05** built procedures, types, flow, and errors. This chapter is the **data-in-motion** toolkit before object/Automation depth in **07**.

Handbook default: **explicit conversions**, **bounded loops**, Dictionary when you need keyed lookup—not nested Collections of mystery Variants.

---

## 1. Concepts

### 1. Strings — the core verbs

```vb
Option Explicit

Dim s As String
s = Trim$("  hello  ")           ' "hello"
s = UCase$(s)                    ' "HELLO"
s = Mid$(s, 1, 4)                ' "HELL"
s = Replace(s, "H", "Y")         ' "YELL"

If InStr(1, s, "ELL", vbTextCompare) > 0 Then
    ' found
End If

Debug.Print Len(s)
```

| Function | Role |
|----------|------|
| `Len` | Character length |
| `Trim` / `LTrim` / `RTrim` | Strip spaces |
| `Left` / `Right` / `Mid` | Slice |
| `InStr` / `InStrRev` | Find position (`0` = not found) |
| `Replace` | Substitute substrings |
| `Split` | String → array |
| `Join` | Array → string |
| `UCase` / `LCase` | Case fold |

Many have `Foo$` forms returning `String` directly. Prefer them in typed code for clarity.

**Compare modes:** `vbBinaryCompare` (default in many contexts) vs `vbTextCompare`. Pick deliberately for identifiers vs case-insensitive UI matching.

### 2. Newlines and constants

| Constant | Typical meaning |
|----------|-----------------|
| `vbCrLf` | Carriage return + line feed (Windows text) |
| `vbLf` | Line feed |
| `vbCr` | Carriage return |
| `vbTab` | Tab |
| `vbNullString` | Convenient empty string constant |

```vb
line = "Name" & vbTab & "Value" & vbCrLf
```

When writing files (chapter **11**), match the consumer’s expected line endings. When putting text in Word/Excel, prefer the host’s APIs over inventing control characters blindly.

### 3. `Split` and `Join` with arrays

```vb
Dim parts() As String
Dim whole As String

parts = Split("a,b,c", ",")
whole = Join(parts, ";")   ' "a;b;c"
```

| Habit | Why |
|-------|-----|
| Know `LBound`/`UBound` after Split | Empty input edge cases |
| Limit splits on untrusted text | Pathological sizes |
| Trim pieces after Split | User CSV often has spaces |

Indexed loops from chapter **04** pair naturally:

```vb
Dim i As Long
For i = LBound(parts) To UBound(parts)
    parts(i) = Trim$(parts(i))
Next i
```

### 4. Dates — literacy, not a calendar product

```vb
Dim d As Date
d = Date          ' today's date (time midnight-ish depending on use)
d = Now           ' date + time
d = DateAdd("d", 7, Date)
Debug.Print Format$(d, "yyyy-mm-dd")
```

| API | Role |
|-----|------|
| `Date` | Current date |
| `Now` | Current date/time |
| `Time` | Current time |
| `DateAdd` | Add interval (`"d"`, `"m"`, `"yyyy"`, `"h"`, …) |
| `DateDiff` | Difference between dates |
| `DatePart` | Extract calendar part |
| `Weekday` | Day-of-week as integer (`vbSunday`…`vbSaturday`; optional first-day-of-week) |
| `DateSerial` / `TimeSerial` | Build a Date from y/m/d or h/m/s parts—prefer over ambiguous text |
| `CDate` | Convert to Date (**03**) |
| `Format` / `Format$` | Display—not storage |

**Staff truths:**

- VBA `Date` is a floating-point serial under the hood; **display format ≠ value**.
- `CDate` and locale settings can surprise you on ambiguous strings (`01/02/03`). Prefer ISO-like inputs at boundaries.
- Excel cell dates are a related-but-separate serial story (chapter **08**)—convert carefully with `CDate` / `DateValue` awareness.

### 5. `Collection`

Built into VBA—no extra reference required:

```vb
Dim c As Collection
Set c = New Collection

c.Add "alpha", "a"      ' item, key
c.Add "beta", "b"

Debug.Print c.Item(1)   ' "alpha" — 1-based
Debug.Print c.Item("b") ' "beta"

c.Remove "a"
```

| Trait | Implication |
|-------|-------------|
| 1-based indexing | Easy off-by-one if you assume 0 |
| Optional string keys | Keys must be unique; retrieve by key or index |
| No built-in “exists?” | `On Error Resume Next` probe *or* prefer Dictionary |
| Holds Variants/objects | Still declare intent when pulling items out |

`For Each` works over Collections (chapter **04**).

### 6. `Scripting.Dictionary` via `CreateObject`

Late-bound (no Tools → References required):

```vb
Dim map As Object
Set map = CreateObject("Scripting.Dictionary")

map.CompareMode = 1   ' TextCompare — set before adding keys if needed
map.Add "id-1", "Ada"
map.Item("id-2") = "Grace"   ' add or replace depending on use

If map.Exists("id-1") Then
    Debug.Print map.Item("id-1")
End If

Debug.Print map.Count
```

| Why Dictionary | Why not always |
|----------------|----------------|
| `Exists` is first-class | Extra COM dependency (`scrrun`) |
| Keyed lookup / replace ergonomics | Overkill for tiny lists |
| `Keys` / `Items` arrays | Reviewers must see CreateObject (**07**, **15**) |

Early binding (`Dim map As Scripting.Dictionary`) is fine when the reference is part of your controlled project—document it.

**Security note:** `CreateObject` is an Automation surface. Using it for `Scripting.Dictionary` / `Scripting.FileSystemObject` is common LOB—still list it in reviews. Do not treat this chapter as permission to spawn arbitrary progids.

---

## 2. Advanced concepts

### 1. Binary vs text compare — and `StrComp`

`InStr`, `Replace`, `StrComp`, and Dictionary `CompareMode` care about case and locale-ish text rules. For IDs and tokens, prefer binary/case-sensitive behavior unless product requirements say otherwise. Set Dictionary `CompareMode` **before** you add keys.

```vb
' 0 = equal under the chosen mode; -1 / 1 = less / greater; Null if either side is Null
If StrComp(a, b, vbBinaryCompare) = 0 Then
    ' exact, case-sensitive (typical for tokens)
ElseIf StrComp(a, b, vbTextCompare) = 0 Then
    ' case-insensitive text compare
End If
```

| Mode | Literacy |
|------|----------|
| **`vbBinaryCompare`** | Binary/case-sensitive in usual VBA practice—default in many APIs when you pass it |
| **`vbTextCompare`** | Case-insensitive text rules—UI labels, user-facing match |
| **`Option Compare`** | Module-level default when compare args are omitted—**spell the mode at call sites** for Public helpers |

Do not mix “sometimes binary, sometimes text” on the same identifier space without documenting why.

### 2. `Format`, `Val`, and `Str` — honesty

| API | Honest role |
|-----|-------------|
| **`Format` / `Format$`** | **Display** (and some locale-aware formatting). Great for logs and labels (`yyyy-mm-dd`). Not the stored source of truth for dates or money. |
| **`Val`** | Reads a leading number from a string; stops at the first non-numeric character; **period** is the decimal separator it understands—locale-fragile. Prefer `CDbl` / `CLng` / explicit parse when you know the shape (**03**). |
| **`Str` / `Str$`** | Number → string with an older leading-space-for-sign habit. Fine in legacy code; for new LOB display prefer `CStr` or `Format$` with an intentional picture. |

```vb
Debug.Print Format$(Now, "yyyy-mm-dd hh:nn:ss")
Debug.Print Val("12.5kg")    ' 12.5 — stops at "k"; still not a locale engine
Debug.Print Str$(42)         ' often " 42" (leading space) — know the quirk
```

Staff rule: **convert with `C*` at boundaries; format late; do not round-trip business values through `Format`/`Val` as if they were parsers.**

### 3. `Weekday` and date helpers (next to `DateAdd` / `DateDiff`)

```vb
Dim d As Date
d = DateSerial(2026, 8, 16)
Debug.Print Weekday(d)                 ' 1–7 depending on firstdayofweek default
Debug.Print Weekday(d, vbMonday)       ' Monday-based week if product needs it
Debug.Print DateDiff("d", d, DateAdd("m", 1, d))
```

| Helper | Use |
|--------|-----|
| `Weekday` | Branch on day-of-week (schedulers, “skip weekend” gates)—document `firstdayofweek` |
| `DateAdd` / `DateDiff` | Relative move / span in calendar units |
| `DatePart` | Extract year/month/… when you need a piece, not a whole Date |
| `DateSerial` | Construct from parts after you validated integers |

### 4. Building strings efficiently enough

Repeated `s = s & chunk` in huge loops can get costly. For large exports, prefer buffering strategies (arrays + `Join`, or streaming file writes in **11**) over naive megacharacter concatenation.

### 5. Nulls and strings from cells

Excel may give `Null`, `Empty`, or `""`. Guard before `Len`/`CStr` as needed:

```vb
If IsNull(v) Then
    s = ""
Else
    s = CStr(v)
End If
```

Pair with chapter **03** sentinels and **05** handlers.

### 6. Collection vs Dictionary vs array

| Need | Prefer |
|------|--------|
| Ordered list, simple stack/queue-ish | Array or Collection |
| Key existence checks / maps | Dictionary |
| Fixed small set of columns | Typed variables or a tiny class (**07** door) |
| Sheet dump | Arrays from `Range.Value` (**08**) |

### 7. Dates across locales and machines

LOB macros that parse `CDate(userText)` on multilingual desktops will fail intermittently. Prefer:

- real `Date` values from Excel cells,
- ISO strings you parse explicitly,
- or `DateSerial(y, m, d)`.

Store UTC vs local only with an explicit policy—VBA `Now` is local machine time.

### 8. `vbNullString` vs `""`

Often interchangeable in comparisons; `vbNullString` is idiomatic in API Declare worlds (**13**). For business code, consistency matters more than micro-difference.

---

## 3. Applications and use cases

| Angle | Strings / dates / maps in practice |
|-------|-------------------------------------|
| **Application** | Parse codes, build export lines, map IDs to names with Dictionary. |
| **Systems** | Line endings for cross-tool files; local time vs documented timezone policy. |
| **Security** | Untrusted strings never concatenated into `Shell` paths (**11**, **15**); Dictionary progid is fine—review other CreateObject targets. |
| **Operations** | `Format$` timestamps in logs; stable ISO-ish formats for machine consumers. |
| **Software engineering** | Trim/Split at edges; typed interiors; Exists checks instead of error-driven Collection key probes when practical. |

**Whole-engineering picture:** most macro bugs are string/date edge cases wearing Range clothing. Normalize early; format late.

---

## Staff-level review checklist

- String compares choose `vbBinaryCompare` / `vbTextCompare` deliberately (`StrComp` / `InStr` / Dictionary).
- `InStr` results checked against `0`; off-by-one avoided with Mid/Left.
- `Split`/`Join` paired with Trim and bounded loops; pathological input considered.
- Newlines use `vbCrLf` (or host APIs) intentionally—not accidental `Chr` soup.
- Dates: avoid ambiguous `CDate` on free text; prefer `DateSerial` / cell dates / ISO policy.
- `Weekday` / `DateAdd` / `DateDiff` used with documented first-day-of-week and interval units.
- `Format$` used for display—not as the stored source of truth; `Val`/`Str` not treated as modern parse/format APIs.
- Collections documented as 1-based; key collisions handled.
- Dictionary created with documented binding; `Exists` used; `CompareMode` set before keys when needed.
- `CreateObject("Scripting.Dictionary")` accepted only as known LOB—other progids scrutinized (**07**, **15**).
- Large string builds avoid quadratic `&` patterns without need.

---

## References

- [String manipulation functions](https://learn.microsoft.com/en-us/office/vba/language/reference/functions-visual-basic-for-applications#string-functions)
- [Mid function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/mid-function)
- [InStr function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/instr-function)
- [StrComp function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/strcomp-function)
- [Split function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/split-function)
- [Format function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/format-function-visual-basic-for-applications)
- [Val function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/val-function)
- [Str function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/str-function)
- [DateAdd function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/dateadd-function)
- [DateDiff function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/datediff-function)
- [Weekday function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/weekday-function)
- [Collection object](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/collection-object)
- [CreateObject function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/createobject-function)
- [Dictionary object](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/dictionary-object)
