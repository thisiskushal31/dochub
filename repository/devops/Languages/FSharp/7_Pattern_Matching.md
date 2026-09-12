# Pattern matching

[← Back to F#](./README.md)

**Pattern matching** is how you inspect data and choose behavior in F#. A **pattern** is a rule that describes a shape of data; when the input matches that shape, you can bind parts of it to names and run a corresponding expression. Patterns are used in **match** expressions, **let** bindings, lambda parameters, and exception handlers. This section covers the main pattern kinds, match syntax, guards, and exhaustiveness so you can write correct, compiler-checked logic.

**Where patterns appear.** Patterns are used in: **match** expressions (the main branching construct); **let** bindings (e.g. `let (a, b) = someTuple`); lambda arguments (e.g. `fun (Some x) -> x`); and **try...with** (to match exception types). In each case, the pattern both **tests** the shape and **binds** subparts to names.

**match expression syntax.** A match has the form: `match expression with | pattern1 [ when condition1 ] -> result1 | pattern2 -> result2 ...`. The expression is evaluated once; its value is compared against each pattern in order. The **first** pattern that matches runs; its **result** expression is the value of the whole match. The optional **when** clause is a **guard**: it is checked only after the pattern matches; if the guard is false, that branch is skipped and the next pattern is tried. So **when** lets you add extra conditions on the bound values.

**Exhaustiveness.** The compiler checks that match branches **cover** all possible values of the input type. For a discriminated union, that means every case is handled; for an enum, every value (or a wildcard). If you miss a case, you get a warning or error. That is why pattern matching is safer than a chain of ifs: the compiler enforces handling every possibility.

**Constant pattern.** A numeric, character, or string literal, or an identifier marked **\[&lt;Literal&gt;]**, or an enum value (e.g. **Color.Red**) matches when the input is equal to that value. Use for exact values. For enums you must use the type name: **Color.Red**, not just **Red**.

```fsharp
let filter123 x =
    match x with
    | 1 | 2 | 3 -> printfn "Found 1, 2, or 3!"
    | v -> printfn "%d" v
```

**Variable pattern.** A single identifier matches **any** value and binds it to that name. So **| x -> ...** is a catch-all. Often you put the variable pattern last so it acts as the default. Combined with other patterns (e.g. inside a tuple), the variable binds the part that matched.

**Identifier pattern (DU and option).** For discriminated unions, the case name is the pattern. **Some x** matches the **Some** case and binds the inner value to **x**; **None** matches the **None** case and has no inner value. For a DU with named fields you can use **Case(fieldName = var)** or **Case(var)**. If the DU has multiple fields, use a tuple pattern: **FirstLast(firstName, lastName)**.

```fsharp
let printOption (data: int option) =
    match data with
    | Some v -> printfn "%d" v
    | None -> ()
```

**Tuple and list patterns.** A **tuple pattern** is **(p1, p2, ...)**; it matches a tuple and binds each element to the subpattern. A **list pattern** can be **[]** (empty list), **[a; b; c]** (fixed-length list with elements matching a, b, c), or **head :: tail** (cons: head and tail bound to subpatterns). So you can both test the structure and pull out parts in one step.

**Record pattern.** Use **{ Label1 = p1; Label2 = p2 }** to match a record and bind fields. You can use literals (e.g. **X = 0.0**) or variables (e.g. **X = xVal**). Only the labels you list are required; you can omit others. That makes it easy to match “any record with this field equal to this value” and bind the rest.

**OR and AND patterns.** **pattern1 | pattern2** (OR) matches if either pattern matches; **pattern1 & pattern2** (AND) matches if both match (useful when the same value is constrained in two ways). The **as** pattern binds the whole matched value: **pattern as id** gives **id** the full value while also matching **pattern**.

**Wildcard pattern.** The **_** pattern matches anything and binds nothing. Use it when you do not care about the value (e.g. the default branch or a placeholder in a tuple). It does not introduce a name, so you cannot use the value on the right-hand side.

**Type test and null patterns.** The pattern **:? Type as id** matches when the value is of that type (or a subtype) and binds it to **id**. The **null** pattern matches the null value. Use type tests when working with .NET types that are not DUs; use null only when interoping with APIs that can return null.

**Why this matters.** Pattern matching is the main way you branch on data in F#. Exhaustiveness forces you to handle every case of a DU or option, which catches many bugs at compile time. Knowing the different pattern kinds (constant, variable, identifier, tuple, list, record, cons, OR, AND, wildcard, type test) lets you write clear, safe control flow. In security- and correctness-sensitive code, explicit handling of every case is a best practice.

---

## Further reading

- [Pattern Matching (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/pattern-matching)
- [Match Expressions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/match-expressions)
- [Active Patterns (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/active-patterns)
