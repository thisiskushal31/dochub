# Advanced concepts

This topic covers **all advanced concepts** of Julia: the type system in depth, composite types and constructors, conversion and promotion, interfaces, multiple dispatch, metaprogramming, performance, calling C and Fortran, memory management and GC, debugging and profiling, and world age. Once you know the basics (Topic 2), these concepts let you write idiomatic, efficient, and extensible Julia.

## Types in depth

Every value has a type; types are first-class and exist at run time. The type system is **dynamic**, **nominative**, and **parametric**. You can omit types and let the compiler infer them, or add annotations to document intent, catch errors, and help the compiler generate better code.

**Abstract vs concrete types.** Only **abstract types** can have subtypes; **concrete types** cannot be subclassed. So `Int`, `Float64`, and `String` are concrete: you cannot create a new type that subtypes `Int`. Abstract types like `Number`, `AbstractFloat`, or `AbstractArray` group concrete types and are used for method dispatch and for describing constraints. This design keeps the model simple: function behavior is chosen from the types of all arguments, and the compiler can specialize on concrete types.

**Parametric types.** Types can take parameters. For example, `Vector{Int}` is a vector whose elements are `Int`; `Dict{String, Int}` is a dictionary mapping strings to integers. The same type constructor can produce different concrete types for different parameters. Type parameters can be other types, symbols, or (for certain kinds) values (e.g. fixed-size arrays). Omitting parameters is allowed when the parameter does not need to be fixed (e.g. `Vector` without element type).

**Type annotations.** The `::` operator attaches a type to an expression or variable. On an expression, `::` asserts that the value has that type; if not, an exception is thrown. On the left-hand side of an assignment (e.g. `x::Int8 = 100`), it declares that the variable will always hold that type in that scope; later assignments are converted to that type. Annotations help the compiler when it cannot infer a stable type and improve readability and multiple dispatch.

**Only values have types.** Variables are names bound to values; the type belongs to the value. So "type of a variable" means the type of the value it refers to. At run time, the only type a value has is its actual type; there is no separate "compile-time type" in the sense of static languages. Types are run-time objects: you can store them in variables, pass them to functions, and use them in dispatch.

## Composite types and constructors

You define custom data structures with **structs** (composite types). Syntax: `struct MyType ... end` for immutable structs and `mutable struct MyType ... end` for mutable ones. Fields are listed inside; each has a name and optionally a type. Instances are created with **constructors**: by default Julia generates an "outer" constructor that takes one argument per field in order. You can add **inner constructors** (defined inside the struct block) to enforce invariants or provide alternative creation logic; inner constructors call the built-in `new(...)` to allocate the struct. **Outer constructors** (defined outside the struct) are just functions that eventually call an inner constructor or the default one. Custom constructors are the main way to control how values of your type are created and validated.

## Conversion and promotion

**Conversion** turns a value of one type into another when the conversion is well-defined: use `convert(T, x)` to get a value of type `T` from `x`, or define `convert(::Type{MyType}, x) = ...` for your type. **Promotion** takes several values of possibly different types and picks a common type so they can be used together (e.g. in `+`); the promotion system is used by arithmetic and by functions like `promote`. You can extend both by defining methods for `convert` and `promote_rule`. Understanding conversion and promotion helps when defining numeric-like types or when mixing types in arithmetic or in function calls.

## Interfaces

Julia does not have formal "interfaces" in the sense of declared contracts, but many functions rely on **informal interfaces**: if your type implements a certain set of methods, it works with a whole set of generic code. Common interfaces include: **iteration** (`iterate`, `IteratorSize`, `IteratorEltype`), **indexing** (`getindex`, `setindex!`, `firstindex`, `lastindex`), **length** (`length`), **broadcasting** (defining `BroadcastStyle` and possibly `copy`), and **equality/hashing** (`==`, `hash`). Docstrings for types like `AbstractArray` or `AbstractDict` describe the method set expected; see Further reading for the full interfaces section. When you define a new type that should behave like a collection or support indexing, implement the relevant methods so it composes with the rest of the ecosystem.

## Multiple dispatch

In Julia, a **function** is an object that can have many **methods**. Each method is a definition for a specific combination of argument types (and number of arguments). When you call a function, the runtime chooses the **most specific** method that matches the arguments. Because dispatch uses **all** arguments, not just the first, this is called **multiple dispatch**. It fits mathematical code well: the implementation of `x + y` depends on the types of both `x` and `y`, not on one "owner" of the operation.

Defining methods is done by writing the same function name with different type annotations on the arguments. For example:

```julia
f(x::Float64, y::Float64) = 2x + y
f(x::Number, y::Number) = 2x - y
f(x, y) = println("Whoa there, Nelly.")
```

The first method applies only when both arguments are `Float64`. The second applies to any pair of numbers (e.g. `Int`, `Float32`). The third has no type constraints (equivalent to `Any`) and acts as a catch-all. When you call `f(2.0, 3.0)`, the first method runs; when you call `f(2, 3)`, the second runs; when you call `f("foo", 1)`, the third runs. No automatic conversion of arguments is performed; conversion is explicit (e.g. via the conversion and promotion system).

**Extending existing functions.** You can add new methods to functions defined elsewhere. To extend `+` for a custom type, define a method like `+(a::MyType, b::MyType) = ...`. Existing code that calls `+` will then use your method when both arguments are `MyType`. You can list existing methods with `methods(f)` and see the function object (and method count) by typing `f` in the REPL.

**Operators are functions.** Infix operators such as `+`, `*`, and `==` are ordinary functions with special syntax. So `a + b` is the same as `+(a, b)`. Extending an operator means defining new methods for that function. Multiple dispatch is the core unifying feature of Julia: functions are defined on combinations of argument types, and the most specific matching method is applied.

## Metaprogramming

Julia represents its own code as data structures in the language. A piece of code can be **parsed** into an **expression** (`Expr`), which can be inspected, transformed, and then **evaluated**. This allows code generation and Lisp-style **macros** that operate on the abstract syntax tree, not on raw text.

**Expressions.** Code like `1 + 1` can be parsed with `Meta.parse("1 + 1")` to get an `Expr` object. Expressions have a **head** (e.g. `:call` for a function call) and **args** (e.g. the function and its arguments). You can build expressions programmatically with the `Expr` constructor or by **quoting** with `:( ... )` so that the enclosed code is not run but turned into an expression. A block of code can be quoted with `quote ... end`. Quoting is the main way to capture code as data.

**Evaluation.** Given an expression, `eval(ex)` evaluates it in the global scope of the module where `eval` is called. So you can build an expression and then run it. Use this sparingly: evaluating arbitrary strings or user input as code is dangerous; prefer constructing `Expr` objects and avoid `Meta.parse` on untrusted input.

**Macros.** A macro is a function that takes expressions (and possibly other values) and returns a new expression; the returned expression is then compiled and run in place of the original call. Macros are invoked with `@name` and run at parse time. They are useful for eliminating boilerplate, implementing domain-specific syntax, or injecting code. Macros should be used when simpler approaches (e.g. functions, type dispatch) are not enough; they make code harder to debug and reason about, so use them with care.

**Hygiene and scope.** Macros and generated code have subtle scope rules. The language provides tools (e.g. `esc`) to control which variables in the generated code refer to the macro’s call site versus the macro’s definition. When writing macros, prefer generating as little code as possible and delegating to normal functions for most logic.

## Performance

Julia compiles code just-in-time (JIT) using type information. To get C-like speed, the compiler must be able to infer types and avoid runtime overhead. A few rules of thumb go a long way.

**Put performance-critical code in functions.** Code at the top level (e.g. in the REPL or at module scope) is harder for the compiler to optimize. Wrap hot loops and numerical code in functions that take arguments and return values. Functions are also more reusable and testable.

**Avoid untyped global variables.** The type of a global can change at any time, so the compiler cannot assume a fixed type and must emit slower, defensive code. Prefer passing data as function arguments. If you need a global, make it a **constant** with `const` so its type is fixed, or annotate its type at the point of use (e.g. `for i in x::Vector{Float64}`).

**Type stability.** A function is **type-stable** if the type of its return value can be inferred from the types of its arguments. If the return type depends on runtime values (e.g. branching that returns an `Int` in one branch and a `Float64` in another), the compiler may not optimize well and may allocate more than necessary. Prefer designs that keep return types predictable. The `@code_warntype` macro (or the built-in tools) can show where type inference fails or becomes `Any`.

**Break functions into multiple definitions.** Instead of one big function that branches on types with `isa` or `typeof`, define several methods with different type signatures. The compiler can then dispatch directly to the right implementation and inline it. For example, instead of `function mynorm(A); if isa(A, Vector) ... elseif isa(A, Matrix) ... end; end`, write `mynorm(x::Vector) = ...` and `mynorm(A::Matrix) = ...`.

**Measure before optimizing.** Use `@time` to see run time and allocation. The first call to a function triggers compilation, so ignore that run. Repeated allocations in a loop often indicate type instability or unnecessary temporary arrays. For serious benchmarking, use the BenchmarkTools package to reduce noise. Profiling tools help find the real bottlenecks.

**Pre-allocate outputs.** When building arrays or strings in a loop, avoid growing them incrementally (which reallocates). Pre-allocate a vector or buffer of the right size and fill it, or use in-place operations where possible. Mutating functions (those whose names end with `!`) often avoid allocating a new result.

**Calling C and Fortran.** Julia can call C and Fortran libraries directly with **`ccall`** (or the `@ccall` macro), with no separate wrapper layer. The syntax specifies the library, function name, argument types, and return type; Julia compiles to the same machine-level call as native C, so overhead is minimal. This is useful for legacy or high-performance C/Fortran code, system libraries, and native dependencies. For Python, R, or Java, the ecosystem provides PyCall, RCall, and JavaCall. When you see `ccall` or `@ccall` in code, it is invoking an external C or Fortran function; see Further reading for the full signature and type mapping.

## Memory management and garbage collection

Julia uses **automatic memory management**: memory for heap-allocated objects is reclaimed by a **garbage collector (GC)**. You do not manually free memory. The GC is designed to work well with high allocation rates common in numerical code. For performance, reducing allocations (e.g. reusing buffers, avoiding temporary arrays, writing type-stable code) reduces GC pressure. Tuning the GC is rarely needed; in long-running or latency-sensitive applications, you can trigger a full GC with `GC.gc()` or adjust GC behavior via options, but the defaults are usually sufficient. When operating Julia in production, set process or container memory limits so that runaway allocation does not exhaust the host.

## Debugging and profiling

**Stack traces.** When an error is thrown, Julia prints a **stack trace**: the sequence of function calls that led to the error. Read it from top (where the error occurred) to bottom (earlier callers). The trace includes file names and line numbers when available. Use this to locate the source of bugs. The **Debugger** package (and IDE integrations) let you set breakpoints and step through code.

**Profiling.** To find performance bottlenecks, use **profiling**. The standard library **Profile** module (`using Profile`) provides `@profile` to sample the running program and report where time is spent. Run your code under `@profile`, then use `Profile.print()` or a graphical viewer to inspect the results. Focus optimization on the hot paths identified by the profiler; avoid optimizing cold code. The **BenchmarkTools** package gives reliable timing for small snippets and helps compare implementations.

## World age

When you define a new method or type at run time (e.g. in the REPL or via `eval`), that definition is visible only to code **compiled after** that point. This is called **world age**: the runtime tracks a "world" counter that increments when new definitions are added. Code that was compiled earlier cannot see methods added later. In practice you hit this when calling from old code into a function that you then extend; the call may still use the old method set. Restarting the session or wrapping the call in a "barrier" function that was compiled after the new definition fixes it. When writing macros or generated code that define methods, world age can affect when those methods are visible; see Further reading for details.

Once you understand these concepts, you can read and write Julia that is both idiomatic and fast, and you can navigate type hierarchies, method lists, constructors, interfaces, and macro-heavy code in the ecosystem.

---

## Further reading

- [Types](https://docs.julialang.org/en/v1/manual/types/)
- [Constructors](https://docs.julialang.org/en/v1/manual/constructors/)
- [Conversion and Promotion](https://docs.julialang.org/en/v1/manual/conversion-and-promotion/)
- [Interfaces](https://docs.julialang.org/en/v1/manual/interfaces/)
- [Methods](https://docs.julialang.org/en/v1/manual/methods/)
- [Metaprogramming](https://docs.julialang.org/en/v1/manual/metaprogramming/)
- [Performance Tips](https://docs.julialang.org/en/v1/manual/performance-tips/)
- [Memory Management](https://docs.julialang.org/en/v1/manual/memory-management/)
- [Calling C and Fortran Code](https://docs.julialang.org/en/v1/manual/calling-c-and-fortran-code/)
- [Stack Traces](https://docs.julialang.org/en/v1/manual/stacktraces/)
- [Profile (standard library)](https://docs.julialang.org/en/v1/stdlib/Profile/)
- [World Age (method invalidation)](https://docs.julialang.org/en/v1/manual/methods/#Redefining-Methods)
