# Records and discriminated unions

[← Back to F#](./README.md)

**Records** are aggregates of named fields; they are the standard way to model a fixed set of related data in F#. **Discriminated unions** (DUs) represent a value that is exactly one of several named cases, each possibly carrying different data. Both are immutable by default, support structural equality, and work with pattern matching. This section covers definition, construction, copy-and-update, mutable fields, pattern matching with records, and how they differ from classes so you can structure data correctly.

**Record type definition.** A record type is declared with **type** and curly braces; each field has a name and a type. Labels are separated by semicolons; when each label is on its own line, the semicolon is optional. You can add **member-list** (methods, static members) after the closing brace. By default a record is a **reference type**. You can make it a **struct** with the **\[&lt;Struct&gt;]** attribute for allocation on the stack when the record is small.

```fsharp
type Point = { X: float; Y: float; Z: float }
type Customer =
    { First: string
      Last: string
      SSN: uint32 }
[<Struct>]
type StructPoint = { X: float; Y: float; Z: float }
```

**Creating records.** You create a record with a **record expression**: braces and label = value for each field. The compiler infers the record type from the labels. You **must** supply a value for every field; you cannot reference other fields in the initialization of a field. If two record types in scope have the same label names, the compiler may infer the wrong type (the most recently declared type wins). In that case, prefix the first field with the type name: `{ Point.X = 1.0; Y = 1.0; Z = 0.0 }`.

```fsharp
let mypoint = { X = 1.0; Y = 1.0; Z = -1.0 }
let myRecord2 = { MyRecord.X = 1; MyRecord.Y = 2; MyRecord.Z = 3 }
```

**Copy-and-update.** Records are immutable; you do not change a field in place. Instead you use a **copy-and-update** expression: `{ record with Field1 = newValue1; Field2 = newValue2 }`. That builds a **new** record with the same values as the original except for the listed fields. Use this for “update one or a few fields” without touching the rest. You can also use it to build from a “default” instance: define a default value and then use **with** to fill in only the fields that vary.

```fsharp
let myRecord3 = { myRecord2 with Y = 100; Z = 2 }
let defaultRecord = { Field1 = 0; Field2 = 0 }
let rr3 = { defaultRecord with Field2 = 42 }
```

**Mutable record fields.** You can mark a single field as **mutable**. Then that field can be updated with **<-** on an instance: `myCar.Odometer <- myCar.Odometer + 21`. The rest of the record remains immutable. Use mutable fields sparingly (e.g. caches, counters); prefer copy-and-update when you can. Do not use **DefaultValue** on record fields; use a default instance and copy-and-update instead.

**Mutually recursive records.** If record A has a field of type B and B has a field of type A, you must define them together with **and**: `type Person = { ...; Address: Address } and Address = { ...; Occupant: Person }`. Without **and**, the compiler would not know **Address** when parsing **Person**.

**Pattern matching with records.** In a **match**, you can use a **record pattern**: `{ X = 0.0; Y = 0.0; Z = 0.0 }` to match the origin, or `{ X = xVal; Y = 0.0; Z = 0.0 }` to bind **xVal** to the X field when Y and Z are zero. You can mix literal and variable patterns to both test and extract. That makes it easy to branch on the shape of record data.

```fsharp
let evaluatePoint (point: Point3D) =
    match point with
    | { X = 0.0; Y = 0.0; Z = 0.0 } -> printfn "Origin."
    | { X = x; Y = 0.0; Z = 0.0 } -> printfn "On x-axis. Value is %f." x
    | { X = x; Y = y; Z = z } -> printfn "At (%f, %f, %f)." x y z
```

**Records and members.** You can add instance members (e.g. methods) and static members to a record. A common pattern is a static **Default** member that returns a default instance so callers can use **with** to build variants. The self-identifier in a member (e.g. **this**) refers to the record instance.

**Records vs classes.** Record fields are exposed as properties automatically; there is no separate constructor syntax—construction is the record expression. Records have **structural equality**: two records with the same type and equal field values are equal. Classes have **reference equality** unless they override **Equals**. If you need reference equality for a record, you can add the **\[&lt;ReferenceEquality&gt;]** attribute.

**Discriminated unions.** A DU has one or more **cases**. Each case has a name and optionally one or more fields (a single value, a tuple, or a record). You construct with the case name and arguments; you deconstruct with pattern matching. DUs are ideal for “one of these possibilities”: success vs error, optional value (Option), or a closed set of shapes. The compiler can check that you handle every case in a match.

```fsharp
type Result<'T, 'E> = | Ok of 'T | Error of 'E
type Shape = | Rectangle of height: float * width: float | Circle of radius: float
let matchShape shape =
    match shape with
    | Rectangle(height = h; width = w) -> printfn "Rectangle %f x %f" h w
    | Circle(radius = r) -> printfn "Circle radius %f" r
```

**Why this matters.** Records give you named, typed data with minimal syntax and structural equality. Copy-and-update and pattern matching make updates and branching clear. DUs make invalid states unrepresentable and force exhaustive handling. Together they are the backbone of domain modeling in F# and reduce bugs in security- and correctness-sensitive code.

---

## Further reading

- [Records (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/records)
- [Discriminated Unions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/discriminated-unions)
- [Anonymous Records (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/anonymous-records)
