# LINQ and query expressions

[← Back to VB.NET](./README.md)

## What this chapter covers

**LINQ** in VB.NET: **query expressions** (`From` … `Where` … `Select`) versus **method syntax** (extension methods on `IEnumerable(Of T)` / `IQueryable(Of T)`), deferred execution, and operator literacy for filtering, projection, ordering, grouping, and aggregation. Same ideas as [C# LINQ](../CSharp/17_LINQ_And_Async_Await.md); VB keyword shapes differ (`Aggregate`, `Take While`, etc.).

You leave able to read both syntaxes, predict when queries run, and avoid accidental multiple enumeration and N+1 database patterns.

---

## 1. Concepts

### 1. LINQ is language-integrated query over sequences

LINQ providers expose a common operator vocabulary over **in-memory** sequences (`IEnumerable(Of T)`) and **remote** queryables (`IQueryable(Of T)`—EF Core, etc.). Operators compose; the final shape is usually another sequence or a scalar (`Count`, `First`, `Sum`).

```vb
Dim scores = {90, 70, 85, 60}
Dim passing = From s In scores
              Where s >= 70
              Select s
```

Equivalent method syntax:

```vb
Dim passing2 = scores.Where(Function(s) s >= 70)
```

Pick one style per team for consistency; mixing in one method is fine when query syntax is clearer for joins/groups.

### 2. Core operators (mental map)

| Intent | Typical operators |
|--------|-------------------|
| Filter | `Where` |
| Project | `Select`, `SelectMany` |
| Order | `OrderBy`, `OrderByDescending`, `ThenBy` |
| Slice | `Take`, `Skip` |
| Test | `Any`, `All`, `Contains` |
| Element | `First`, `FirstOrDefault`, `Single`, `SingleOrDefault` |
| Aggregate | `Count`, `Sum`, `Average`, `Aggregate` |
| Shape | `GroupBy`, `Join`, `Distinct` |

`First` throws if empty; `FirstOrDefault` returns default—know which contract callers need. `Single` throws if not exactly one—good for keys, harsh for optional rows.

### 3. Query syntax in VB

VB query expressions use `From`, `Where`, `Select`, `Order By`, `Group By`, `Join`, and more. Example:

```vb
Dim q = From c In customers
        Where c.Active
        Order By c.Name
        Select New With {c.Id, c.Name}
```

`Let` introduces intermediate range variables. `Aggregate … Into` is idiomatic VB for aggregates in query form.

### 4. Deferred execution

Most operators build a **pipeline**; work runs when you **enumerate** (`For Each`, `ToList`, `Count` that must scan, etc.).

```vb
Dim q = data.Where(Function(x) IsValid(x))  ' not executed yet
Dim list = q.ToList()                       ' executes now
```

Implications:

- Changing source data before enumeration changes results.
- Enumerating twice may recompute (or re-hit the database).
- Side effects inside `Where`/`Select` lambdas run at enumeration time—keep them pure.

### 5. Immediate execution

`ToList`, `ToArray`, `ToDictionary`, and many aggregates force execution. Use them when you need a stable snapshot or to avoid repeated enumeration—but do not materialize huge sequences without need.

---

## 2. Advanced concepts

### 1. `IEnumerable(Of T)` vs `IQueryable(Of T)`

| | In-memory | Queryable |
|--|-----------|-----------|
| Type | `IEnumerable(Of T)` | `IQueryable(Of T)` |
| Execution | Local delegates | Expression trees → provider (SQL, etc.) |
| Risk | CPU/alloc on large collections | Operators that **cannot** translate → client eval or runtime errors |

Keep queryable expressions **translatable**. Calling arbitrary VB functions inside `Where` against EF may pull too many rows or fail translation depending on version and config.

### 2. Multiple enumeration

```vb
If q.Any() Then
    For Each item In q  ' second execution
        ...
    Next
End If
```

Prefer a single materialization when the source is expensive:

```vb
Dim items = q.ToList()
If items.Count > 0 Then ...
```

### 3. Joins and groups

Query syntax shines for multi-sequence joins and groupings. Method syntax uses `Join`, `GroupJoin`, `SelectMany`. Prefer clear range variable names over cryptic one-letter identifiers in production queries.

### 4. Laziness and resource lifetime

LINQ over open readers/streams must not outlive the underlying resource. Enumerate **inside** `Using`, or materialize before dispose.

### 5. PLINQ literacy (door)

`AsParallel()` enables parallel LINQ for CPU-bound local work. It is not free: ordering, thread safety, and exception aggregation (`AggregateException`) change. Default staff path is ordinary LINQ unless profiling says otherwise.

### 6. LINQ to Objects performance habits

- Filter early (`Where` before expensive `Select`).
- Avoid repeated `Count()` on deferred queries that re-scan.
- Prefer `Any()` over `Count() > 0` when you only need existence.
- Do not use LINQ to hide O(n²) nested scans over large lists without measurement.

### 7. Anonymous types and DTOs

`Select New With { … }` is convenient locally. Across APIs and serializers, prefer named DTOs/classes for stability and documentation.

### 8. XML literals and axis properties (VB specialty)

Visual Basic can embed **XML literals** and navigate with **axis properties**—syntax C# reviewers often miss in brownfield reporting/config code:

```vb
Dim doc =
    <order id="42">
        <item sku="A1" qty="2"/>
        <item sku="B9" qty="1"/>
    </order>

Dim id = doc.@id
Dim skus = From el In doc.<item> Select el.@sku
```

| Surface | Meaning |
|---------|---------|
| `<tag>…</tag>` literals | Build `XElement` / `XDocument` trees in source |
| `.@attr` | Attribute axis |
| `.<child>` | Child elements |
| `...<desc>` | Descendants |

Staff ceiling: **read and review** this syntax; know it maps to `System.Xml.Linq`. Prefer ordinary LINQ-to-Objects/XML APIs in new shared libraries when the team is polyglot—XML literals are a VB-maintainer skill, not a reason to invent a second XML stack. Do not treat XML literals as a substitute for schema validation at trust boundaries.

### 9. Data access door (ADO.NET / EF literacy)

LINQ over `IQueryable` often means **Entity Framework** (or similar). ADO.NET command/parameter APIs still appear under older LOB. This track’s rule: **parameterize**; keep queries translatable; treat connection strings as secrets (**16**). Full EF modeling belongs in product docs / the C# track’s data doors—not a second database encyclopedia here.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Shape view models with `Select`; keep business rules testable outside queries when heavy |
| **Systems** | Push filters to the database via `IQueryable`; page with `Skip`/`Take` intentionally |
| **Security** | Never compose raw SQL strings “around” LINQ; parameterized providers only; do not log PII from projections casually |
| **Operations** | Watch for N+1 (per-row queries inside loops); metrics on query duration |
| **Software engineering** | Consistent syntax style; pure predicates; materialize at clear boundaries |

LINQ is not a substitute for proper indexing and query plans on the database side.

---

## 4. Staff-level review checklist

- Query vs method syntax is readable and consistent in the touched area.
- Deferred vs immediate execution understood at each use site.
- Expensive queries are not enumerated multiple times accidentally.
- `IQueryable` expressions stay provider-translatable where required.
- `First` / `Single` / `OrDefault` match emptiness contracts.
- Projections to anonymous types do not leak across API boundaries needlessly.
- No side-effecting lambdas inside operators without strong justification.
- Pagination and filters applied before large materialization.
- Resource lifetimes cover full enumeration.
- Parallel LINQ used only with measured need and correct ordering/exception handling.
- XML literals/axis usage is intentional and reviewable; trust boundaries still validate input.
- Data access uses parameterized APIs / provider-safe `IQueryable`—not string-concat SQL.

---

## References

- [LINQ in Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/linq/)
- [Introduction to LINQ Queries (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/linq/introduction-to-linq)
- [How query expressions work](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/linq/how-query-expression-work)
- [LINQ query operations](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/linq/query-expression-basics)
- [XML literals overview](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/xml/xml-literals-overview)
- [XML axis properties](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/xml-axis/)
- [Enumerable class](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable)
- [IQueryable interface](https://learn.microsoft.com/en-us/dotnet/api/system.linq.iqueryable)
- [LINQ to Objects](https://learn.microsoft.com/en-us/dotnet/csharp/linq/linq-to-objects)
