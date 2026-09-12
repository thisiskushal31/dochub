# Conditionals and loops

[← Back to F#](./README.md)

F# has **if...then...else** expressions for branching and **for...in**, **for...to**, and **while...do** for iteration. In functional style you often use pattern matching and recursion or collection functions (map, filter, fold) instead of explicit loops; conditionals and loops are still useful for imperative sections and when they clarify intent. This section covers their syntax, the fact that they are expressions, and typical use so you can write and read both styles correctly.

**Why conditionals and loops matter.** Even in functional-first code you sometimes need a simple branch or a loop (e.g. over a range or until a condition). Knowing that **if** and **for** are **expressions** (they produce a value or **unit**) and that **if** requires both branches to have the same type helps you write correct and idiomatic F#. In scripts and DevOps automation, **for** and **while** are common for file or retry logic.

**if...then...else.** An **if** expression has the form **if condition then expression1 else expression2**. Both branches must return the **same type**; the **else** is **required** (so every path produces a value—F# has no “implicit” fall-through). You can chain with **else if** (or **elif**). Use **if** for simple conditions; for multiple cases or deconstructing data, **match** is usually clearer and gives exhaustiveness checking. If one branch is only for side effects, it often returns **()** (unit).

```fsharp
let sign n = if n > 0 then 1 elif n < 0 then -1 else 0
let result = if true then "yes" else "no"
```

**for...in.** The **for...in** loop iterates over a sequence, list, array, or range. Syntax: **for pattern in collection do expression**. The loop body can be a single expression or a block. The loop evaluates to **unit** (it is for side effects). Ranges are written **1..5** (inclusive) or **1..2..10** (start, step, end). Use **for x in list do ...** when you need to perform an action for each element.

```fsharp
for x in [1; 2; 3] do printfn "%d" x
for i in 1..5 do printfn "%d" i
for i in 2..2..10 do printfn "%d" i   // 2, 4, 6, 8, 10
```

**for...to.** The **for...to** form is a counted loop: **for id = start to end do expression**. Use **downto** for a decreasing range: **for i = 10 downto 1 do ...**. Again, the result is **unit**. The loop variable is in scope only inside the loop.

**while...do.** The **while...do** loop runs while a condition is true: **while condition do expression**. Use sparingly; prefer **for** or sequence/list operations when possible so control flow stays clear and testable. **while** is useful when the stopping condition is not a simple range (e.g. “read until end of stream”).

**Why this matters.** Conditionals and loops are part of the language reference and appear in scripts and mixed-style code. Prefer **match** and higher-order functions where they simplify logic; use **if** and loops where they are the clearest. In DevOps scripts, **for** and **while** are common for iterating over files or retrying operations.

---

## Further reading

- [Conditional expressions: if...then...else (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/conditional-expressions-if-then-else)
- [Loops: for...in (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/loops-for-in-expression)
- [Loops: for...to (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/loops-for-to-expression)
- [Loops: while...do (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/loops-while-do-expression)
