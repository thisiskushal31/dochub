# Types and type inference

[← Back to F#](./README.md)

F# is **statically typed**: every value and expression has a type, and the compiler checks them before run time. The compiler often **infers** types from context, so you do not have to write them everywhere. You can add explicit type annotations when you want clarity or when inference needs a hint. This section covers basic types, type syntax, inference, annotations, the unit type, and generics so you can read and write correctly typed F# code.

**Why types matter.** Types catch many errors at compile time and document the shape of data. F#’s inference keeps code concise while keeping type safety. Knowing how inference works (and when it fails) helps you fix type errors and design clear APIs.

**Basic (primitive) types.** F# has the usual primitives: **int**, **float**, **bool**, **string**, **char**, **byte**, and sized variants (e.g. **int32**, **float32**). They correspond to .NET types (e.g. **int** is **System.Int32**). Literals have a default type: **42** is **int**, **3.14** is **float**, **"text"** is **string**. Suffixes specify type: **42u** (unsigned int), **3.14f** (float32), **1.0** (float). For a full list, see the language reference under Basic Types.

**Type syntax.** When you write or read type annotations, you use F# type syntax. Primitives are just the type name. **Tuples** use **\***: **int * string** is a pair of int and string. **Function types** use **->**: **int -> string** is “takes int, returns string”; **int -> int -> int** is “takes two ints, returns int” (curried). **Arrays** use **type[]** or **type array**: **int[]**, **float array**. **Generic types** use **'a** (type parameter): **'a list**, **list&lt;'a&gt;**, **option&lt;int&gt;**. **Unit** is **unit** and has a single value **()**. When the compiler prints a type (e.g. in an error), it uses this syntax.

**Type inference.** The compiler infers the type of a binding or expression from how it is used. For **let x = 1 + 2**, **x** is **int**. For **let f x = x + 1**, **f** is **int -> int** because **+** with **1** constrains **x** to **int**. If you use a value in a way that conflicts with an earlier use (e.g. pass it where a different type is expected), you get a type error. Inference works across function boundaries: parameter and return types are inferred from the body and from call sites. When inference is ambiguous (e.g. which numeric type), add an explicit annotation.

**Explicit annotations.** You can annotate a binding: **let (x: int) = 42** or **let add (a: int) (b: int) : int = a + b**. Use annotations to document intent, resolve ambiguity (e.g. **float** vs **int**), or constrain a generic to a specific type. For public APIs, annotations often improve readability.

**Unit type.** The type **unit** has a single value, written **()**. It represents “no meaningful value.” Functions that only perform side effects (e.g. **printfn**) often return **unit**. The compiler treats **unit** as distinct from other types: you cannot accidentally use a **unit** value where a “real” value is expected without an explicit ignore. That helps avoid silently discarding results. In **match** and **if**, every branch must produce the same type; **else ()** is common when one branch has a side effect and returns **unit**.

**Generics and automatic generalization.** When you write a function that does not depend on a specific type (e.g. **let id x = x**), the compiler **generalizes** it to a generic type: **'a -> 'a**. Type parameters are prefixed with a tick: **'a**, **'T**. That lets you write one implementation that works for many types. The compiler infers type parameters from usage; you can constrain them (e.g. **when 'a : comparison**) when needed.

**Why this matters.** Type inference and generics reduce boilerplate while keeping safety. When the compiler reports a type error, it usually points at a mismatch or an ambiguous use; adding a local annotation or fixing the expression resolves it. Understanding type syntax (tuple **\***, function **->**, array **[]**, generic **'a**) is necessary for reading signatures and for records, discriminated unions, and pattern matching in later topics.

---

## Further reading

- [F# Types (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/fsharp-types)
- [Basic Types (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/basic-types)
- [Type Inference (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/type-inference)
- [Unit Type (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/unit-type)
- [Generics and Automatic Generalization](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/generics/automatic-generalization)
