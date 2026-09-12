# Values and functions

[← Back to F#](./README.md)

In F#, **values** are named quantities with a specific type; the name is **bound** to a definition using **let**. Values are **immutable** by default: once bound, the name refers to that value for its whole scope. **Functions** are values that take arguments and return a result; they are the main unit of execution. This section covers let bindings, why immutability matters, mutable variables, function syntax and scope, partial application, recursion, pipelines, and composition so you can read and write idiomatic F#.

**Binding a value.** The term **binding** means associating a name with a definition. The **let** keyword binds a value: `let a = 1`, `let str = "text"`, or a function: `let f x = x + 1`. The type is inferred from the right-hand side (e.g. from the literal or from the function body). You do not reassign the name later in the same scope; instead you use a new binding or a new scope.

**Why immutability.** Immutable values cannot be changed during execution. In a multithreaded environment, shared mutable state is hard to reason about and easy to get wrong. With immutability, when you pass a value to a function, it cannot be altered by that function, so the behavior of the program is easier to understand and the compiler can optimize and check more aggressively. F# is not a pure functional language but encourages immutability so your code benefits from clearer reasoning and fewer bugs.

**Mutable variables.** When you need a cell that can be updated, use **mutable**: `let mutable x = 1`. You assign a new value with the **<-** operator: `x <- x + 1`. Mutable variables should have limited scope (e.g. local to a function or a field of a type) so they are easier to control. Note: if a mutable is captured by a closure (e.g. inside a lambda or a sequence), the compiler may promote it to a reference cell internally; you can enable warning 3180 to be notified.

```fsharp
let mutable count = 0
count <- count + 1
printfn "%d" count   // 1
```

**Function syntax.** A function is defined with **let** and a parameter list (names separated by spaces), then **=** and the body: `let f x = x + 1`. You can add an explicit return type with a colon: `let f x : int = x + 1`, or annotate parameters: `let f (x: int) = x + 1`. The **function body** is an expression; the **last expression** in the body is the return value. The body can contain local **let** bindings; they are in scope only inside that function. Indentation defines what is in the body.

```fsharp
let cylinderVolume radius length =
    let pi = 3.14159
    length * pi * radius * radius
```

**Scope and shadowing.** At **module** (top-level) scope, each name must be unique; you cannot have two bindings with the same name. Inside a function or other inner scope, you can **shadow** a name: a later **let** with the same name hides the earlier one in that scope. So the same identifier can refer to different values in different scopes, but not by reassigning in the same scope.

**Calling functions.** You call by writing the function name, a space, and the arguments separated by spaces: `cylinderVolume 2.0 3.0`. There are no parentheses around the argument list unless you need to group an expression (e.g. `f (a + b)` to pass one argument that is the sum).

**Partial application.** If you pass **fewer** arguments than the function expects, you get a **new function** that takes the remaining arguments. This is **currying**. For example, if `cylinderVolume` has two parameters, then `cylinderVolume 2.0` is a function that takes the length and returns the volume for radius 2.0. That lets you specialize functions without writing wrappers.

```fsharp
let smallPipeVolume = cylinderVolume 2.0
let vol = smallPipeVolume 3.0   // volume for radius 2.0, length 3.0
```

**Recursive functions.** A function that calls itself must be declared with **let rec**. The compiler then allows the name to be used in the body before the binding is fully defined. Without **rec**, the name would not be in scope for the call. For deep recursion, prefer tail recursion or explicit loops to avoid stack overflow.

```fsharp
let rec fib n =
    if n < 2 then 1 else fib (n - 1) + fib (n - 2)
```

**Function values and types.** In F#, functions are values. The type of a function is written with **->**: `int -> int` is “takes int, returns int”; `int -> int -> int` is “takes two ints, returns int” (curried). You can pass functions as arguments: `let apply1 (transform: int -> int) y = transform y`.

**Lambda expressions.** An anonymous function is written with **fun** and **->**: `fun x -> x + 1`. You can annotate: `fun (x: int) -> x + 1`. Lambdas are used as arguments to higher-order functions (e.g. `List.map`, `List.filter`) so you do not have to name every small function.

**The pipe operator.** The **|>** operator passes the left-hand value as the **last** argument to the right-hand function: `x |> f` is the same as `f x`. So `100 |> function1 |> function2` is the same as `function2 (function1 100)`. Pipelining lets you write a chain of operations in the order they execute, which is often easier to read. The operator is defined as: `let (|>) x f = f x`.

```fsharp
let squareAndAddOdd values =
    values |> List.filter (fun x -> x % 2 <> 0) |> List.map (fun x -> x * x + 1)
let result = squareAndAddOdd [1; 2; 3; 4; 5]   // [2; 10; 26]
```

**Function composition.** The **>>** operator composes two functions: `(f >> g) x` is `g (f x)`. So you get a **new** function that applies the first then the second. The **<<** operator is backward composition: `(f << g) x` is `f (g x)`. Use composition when you want to build a new function from existing ones; use pipeline when you have a value and want to pass it through a chain. Pipeline takes a value and a function and produces a value; composition takes two functions and produces a function.

```fsharp
let addOne x = x + 1
let timesTwo x = 2 * x
let h = addOne >> timesTwo
let result = h 100   // 202
```

**Why this matters.** Values and functions are the core of F#. Understanding immutability, scope, partial application, and the difference between pipeline and composition helps you read and write real code. Recursion and first-class functions are the basis for working with lists and domain logic in later topics.

---

## Further reading

- [Values (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/values/)
- [Functions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/functions/)
- [Lambda expressions: the fun keyword](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/functions/lambda-expressions-the-fun-keyword)
- [F# Language Reference](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/)
