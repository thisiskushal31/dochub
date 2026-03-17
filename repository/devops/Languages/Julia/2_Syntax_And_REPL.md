 # Basic concepts: syntax and REPL

This topic covers **all basic concepts** of Julia: everything you need to go from zero knowledge to writing and running your first script. No prior experience with Julia is assumed. It includes variables, types, numbers and operators, functions, arrays, tuples, strings, control flow, dictionaries and sets, date and time, files I/O, scoping, documentation (docstrings), the REPL, the command line, modules, standard libraries, comments, and environment setup. Advanced concepts (type system in depth, multiple dispatch, metaprogramming, performance) are in Topic 3.

Julia has a clear, expression-based syntax. Values have types; variables are names bound to values. Functions are defined with `function ... end` or the short form `f(x) = x + 1`. The language uses multiple dispatch to choose which method runs based on argument types; for now, you can use functions without thinking about that.

## Your first Julia session

**Environment setup.** Download and install Julia from [julialang.org/downloads](https://julialang.org/downloads/) (or [julialang.org/install](https://julialang.org/install/)): choose 32-bit or 64-bit for your OS (Linux, Windows, macOS). On Linux you can unpack a tarball and add the `bin` directory to your PATH (e.g. in `~/.bashrc`: `export PATH="$PATH:/path/to/julia/bin"`). On Windows run the installer and add the installation directory (e.g. `C:\...\Julia-1.x.x\bin`) to the system PATH so you can run `julia` from the command prompt. On macOS open the `.dmg`, drag the app to Applications, and optionally create a symlink (e.g. `ln -s /Applications/Julia-x.app/Contents/Resources/julia/bin/julia /usr/local/bin/julia`) to run from the terminal. You can also build from source; see Further reading for links. The REPL is the default working environment: type `julia` with no arguments to start it. To install packages, type `]` in the REPL to enter package mode, then use `add PackageName`, `rm PackageName`, `update`, and `test PackageName`. IJulia provides a Jupyter kernel for Julia (install with `add IJulia`); Juno (Atom-based) and other IDEs offer integrated REPL and editing. No IDE is required; many users use the REPL and a text editor.

To run Julia interactively, open a terminal and type `julia` (with no arguments). You should see a banner with the version and a prompt `julia>`. Type an expression and press Enter; Julia evaluates it and prints the result. For example, type `1 + 2` and press Enter; you should see `3`. The variable `ans` holds the value of the last expression you typed. To exit, type `Ctrl-D` or `exit()`.

To run a script (a file of Julia code) instead of typing line by line, pass the script path to Julia: `julia script.jl`. Any arguments after the script name are available to your script in the global `ARGS`. So your first script can be a file containing a single line like `println("Hello, ", length(ARGS) > 0 ? ARGS[1] : "World")`; run it with `julia script.jl` or `julia script.jl Alice`. To load and run a file from inside the REPL, use `include("script.jl")`.

**Comments.** Single-line comments start with `#` and run to the end of the line. Multi-line comments are enclosed in `#=` and `=#`. You can use them to document code or temporarily disable expressions.

That is enough to get started. The rest of this topic fills in the basic building blocks: variables, types, numbers and operators, functions, arrays, tuples, strings, control flow, dictionaries and sets, date and time, files I/O, REPL modes, and the command line.

## Variables and assignment

A variable is a name bound to a value. Assignment uses `=`: the name on the left is bound to the value of the expression on the right. Variables are case-sensitive and have no semantic meaning by name—the language does not treat variables differently based on their names.

```julia
x = 10
x = 1 + 1
x = "Hello World!"
```

Variable names must start with a letter (A–Z, a–z), underscore, or certain Unicode code points (e.g. letters, currency symbols); later characters may include digits, `!`, and various Unicode marks. Unicode names in UTF-8 are allowed, which is useful for mathematical notation (e.g. `δ`, `∑`). In the REPL and many editors, you can type `\delta` followed by Tab to get `δ`. The only disallowed names are reserved keywords (e.g. `else`, `try`, `function`). Identifiers that are only underscores (e.g. `___`) are write-only: you can assign to them to discard a value, but you cannot read their value. Operators like `+` are valid identifiers in some contexts; `(+)` refers to the addition function.

Assignment is an expression: it evaluates to the right-hand value. That allows chaining (`a = b = 1`) and using assignments inside other expressions:

```julia
a = (b = 2 + 2) + 3   # a is 7, b is 4
```

Distinguish *assignment* (binding a name to a value) from *mutation* (changing the contents of a mutable value). If you run `a = [1,2,3]` then `b = a`, both names refer to the same array; there is no copy. Changing `a[1] = 42` mutates that array, so `b` sees the change. Rebinding `a = 3.14` only gives `a` a new value; the array that `b` still refers to is unchanged. Only values have types—variables are just names—but we often say "type of a variable" to mean the type of the value it refers to.

## Types

Every value has a type; types are first-class and exist at run time. The type system is dynamic, nominative, and parametric. You can omit types and let the compiler infer them, or add type annotations with `::` to document intent or help performance.

Used on an expression, `::` asserts that the value is an instance of the given type; if not, an exception is thrown. Used on the left-hand side of an assignment (e.g. `x::Int8 = 100`), it declares that the variable will always hold that type in that scope; values assigned later are converted to that type. Concrete types do not subtype each other; only abstract types sit above concrete types in the hierarchy. This keeps the model simple and supports multiple dispatch: function behavior is chosen from the types of all arguments, not just the first. Type annotations serve to improve readability, to catch programmer errors, and to take advantage of multiple dispatch and compiler optimizations.

## Numbers and basic operators

Julia has built-in numeric types: **integers** (e.g. `Int`, `Int8`, `UInt64`) and **floating-point** (e.g. `Float64`, `Float32`). Literals like `42` and `3.14` are inferred; the default integer type is `Int` (e.g. `Int64` on 64-bit systems). Integer types include signed and unsigned variants from 8 to 128 bits (`Int8`, `UInt8`, `Int16`, `UInt16`, `Int32`, `UInt32`, `Int64`, `UInt64`, `Int128`, `UInt128`). **Overflow:** if a value exceeds the maximum for its type, Julia uses wraparound (e.g. `typemax(Int64) + 1` wraps to a negative). For arbitrary precision, use `BigInt` (e.g. `big(10)^19`). Integer division by zero or dividing the smallest negative integer by -1 throws `DivideError`; `rem` and `mod` throw when the second argument is zero.

**Floating-point** literals use decimal or E-notation (`1.0`, `2e11`, `3.6e-5`). For `Float32`, use `f` (e.g. `0.5f0`). Types include `Float16`, `Float32`, and `Float64`. Special values: `Inf` and `-Inf` (infinity), `NaN` (not a number). Positive and negative zero both exist (`0.0 == -0.0` is true but their bit representations differ). The function `eps(T)` gives the distance between 1.0 and the next representable float for type `T`. Rounding follows the default mode (e.g. round to nearest).

**Rational numbers** use `//`: `2//3` is exact. **Complex numbers** use `im`: `1 + 2im`. The standard library provides mathematical functions (`sin`, `cos`, `sqrt`, `log`, etc.); use help mode (`?sqrt`) in the REPL for details.

**Operators** are ordinary functions with infix syntax. Arithmetic: `+`, `-`, `*`, `/`, `÷`, `^`, `%`. Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`. Logic: `&&`, `||`, `!`. Many operators have dot forms for element-wise use on arrays (e.g. `A .+ B`). Operator precedence and associativity follow standard mathematical conventions.

## Functions

Functions map argument values to a return value. The last expression in the function body is the return value (or use `return` explicitly). **Optional arguments** have default values: `function pos(ax, by, cz=0) ... end`; if you omit the third argument, `cz` is 0. **Keyword arguments** follow a semicolon: `function foo(a, b; c=10, d="hi") ... end`; call with `foo(1, 2; c=20)` or `foo(1, 2, c=20)`. Order of keyword arguments in a call does not need to match the definition. **Multiple return values** are returned as a tuple: `return a, b`; the caller can use `x, y = f()` or a single name to get the tuple. **Anonymous functions** use `->`: `x -> x^2` or `(x, y) -> x + y`; they are useful with `map` and `filter`: `map(x -> x^2, [1,2,3])`, `filter(x -> x > 0, arr)`. Functions can be **recursive**; define a base case to avoid infinite recursion. Two common definition forms:

```julia
function add(x, y)
    x + y
end

add(x, y) = x + y
```

Call a function with parentheses: `add(2, 3)`. Without parentheses, `add` refers to the function object and can be passed around like any other value. Function names can use Unicode (e.g. `∑(x, y) = x + y`). By convention, functions that mutate one or more of their arguments have names ending in `!` (e.g. `sort!`).

Arguments are passed by sharing: the function gets new variable bindings to the same values, so no copy is made. Mutating a mutable argument (e.g. setting `x[1] = 42` on an array) is visible to the caller; reassigning an argument name (e.g. `y = 7 + y`) only changes the local binding, not the caller's variable.

## Arrays

Arrays are ordered, mutable collections in a multi-dimensional grid. Literal vectors use square brackets and commas: `[1, 2, 3]`. Matrices use spaces between elements in a row and semicolons (or newlines) between rows: `[1 2; 3 4]`. You can build arrays from ranges: `collect(1:5)` or `collect(0:5:50)` (start:step:stop). Comprehensions build arrays from expressions: `[n^2 for n in 1:10]` or `[n*m for n in 1:10, m in 1:10]` for a 2D array. Constructors: `zeros(Int, 2, 3)`, `ones(3)`, `rand(4, 5)`, `randn(4, 5)`, `fill(x, dims)`. Uninitialized arrays: `Array{Int64}(undef, 3)`. Empty or typed: `Int64[]`, `String[]`. Indexing is 1-based; the last element is `A[end]`, second-to-last `A[end-1]`. Use `A[i]` for linear indexing and `A[i, j]` for multiple dimensions. Slices: `A[1:end]`, `A[2:5]`. Add elements: `push!(arr, x)` (end), `pushfirst!(arr, x)` (front), `splice!(arr, index, value)` (at index). Remove: `pop!(arr)`, `popfirst!(arr)`, `splice!(arr, index)`. Mutate in place: `fill!(arr, value)`. The language does not require vectorized style for performance; loops over array elements are efficient.

## Tuples

Tuples are fixed-length, immutable sequences. Literals use parentheses and commas: `(1, 2)` or `(1,)` for a single-element tuple. They can hold values of different types: `("a", 2, 3.0)`. Indexing is 1-based: `t[1]`; slices like `t[3:end]` work. You cannot change a tuple after creation (no `setindex!`). Tuples are often used for multiple return values (e.g. `return a, b` returns a tuple) and for destructuring: `x, y = (10, 20)`. **Named tuples** use `(a=1, b=2)`; access fields with `nt.a`. You can create them from separate keys and values: `NamedTuple{(:a, :b)}((1, 2))`. Combine two named tuples with `merge(nt1, nt2)`. Named tuples are a convenient way to pass keyword arguments: if `options = (b=200, c=300)`, call `f(1, 2, 3; options...)` to splat them.

## Strings and characters

String literals use double quotes: `"hello"`. Character literals use single quotes: `'x'`; the type is `Char` (32-bit Unicode code point). Convert between `Char` and code point: `Int('a')` gives 97, `Char(97)` gives `'a'`. Strings are immutable and encoded in UTF-8; the type is `String`. Escape double quote and dollar in strings with backslash: `\"`, `\$`. Concatenation: `"Hello" * " " * "World"` or `string(a, ", ", b)`. Interpolation: `"x = $x"` or `"2 + 2 = $(2+2)"`. Triple-quoted strings allow multi-line content and dedent to the least-indented line. Raw strings use `raw"..."` (no interpolation or unescaping). Indexing: `str[1]`, `str[end]`, `str[end-1]`; range indexing extracts a substring: `str[6:9]`. For a view without copying, use `SubString(str, start, stop)`. In UTF-8, not every byte index is a valid character index; indexing by integer uses code-unit positions, so `s[2]` on a string whose first character is multi-byte can throw `StringIndexError`. Search: `findfirst(isequal('o'), str)`, `findlast(isequal('o'), str)`, `occursin("sub", str)`. Useful functions: `repeat(str, n)`, `join([str1, str2], " ")`. Regular expressions use the `r"..."` literal; `occursin(r"^\s*(?:#|$)", line)` checks if a string matches. For any string type, the abstract type is `AbstractString`; for any character-like type, `AbstractChar`.

## Control flow

Conditionals use `if`-`elseif`-`else`-`end`. Loops use `for ... end` and `while ... end`. Short-circuit evaluation: `&&` evaluates the second expression only if the first is true; `||` only if the first is false. The ternary operator is `a ? b : c`. Use `continue` to skip the rest of the current iteration and start the next. Compound expressions use `begin ... end` or `;` to sequence expressions and take the value of the last. **Comprehensions** build collections: `[n^2 for n in 1:5]` or with a type prefix `Float64[x^2 for x in 1:5]`. **Iteration helpers:** `enumerate(collection)` yields index–value pairs; `zip(a, b, c)` yields tuples of elements from each collection (stops at shortest). Nested loops can use a single `for` with commas: `for n in 1:5, m in 1:5 ... end`. **Do blocks** attach an anonymous function to a call: `findall(collection) do x; x > 0; end` instead of `findall(x -> x > 0, collection)`. Exceptions: `try`-`catch`-`finally` and `throw(...)`. Loop variables and variables declared inside a loop are local by default; use `global` if you need to assign to a global from inside a loop.

```julia
if x < y
    println("x is less than y")
elseif x > y
    println("x is greater than y")
else
    println("x is equal to y")
end

for i in 1:5
    println(i)
end
```

## Dictionaries and sets

**Dictionaries** map keys to values. Literals: `Dict("a" => 1, "b" => 2)` (the `=>` is the `Pair` constructor). Create empty with `Dict{KeyType, ValType}()`. Keys are unique; assigning to an existing key updates the value. Access with `d[key]`; use `get(d, key, default)` to avoid KeyError. Check keys with `haskey(d, key)`; check a key–value pair with `in(("a" => 1), d)`. Add or update: `d["new"] = 10`. Delete: `delete!(d, "key")`. Get all keys or values: `keys(d)`, `values(d)`. Iteration yields key–value pairs. Dictionaries are unordered; to process in sorted order by key, use `sort(collect(keys(d)))` and index. Merge two dicts: `merge(d1, d2)`. **Sets** store unique elements; create with `Set()` or `Set([1, 2, 2, 3])`. Add with `push!(s, x)`. Check membership: `in(x, s)`. Set operations: `union(s1, s2)`, `intersect(s1, s2)`, `setdiff(s1, s2)`. Both dictionaries and sets are iterable and support `length`, `in`, and similar functions.

## Missing values

The type **`Missing`** represents a missing value (analogous to NA in R or NaN in some contexts). The singleton value **`missing`** is the only instance. Use **`ismissing(x)`** to check if a value is missing. To iterate over a collection while skipping missing values, use **`skipmissing(collection)`**. For data that may have missing entries, use types like **`Union{Int, Missing}`** so a value can be either an integer or missing. This is standard in data frames and pipelines; many functions in the ecosystem propagate or handle `missing` according to three-valued logic (true, false, missing).

## Date and time

The `Dates` standard library provides types and functions for dates and times. Use `using Dates` to bring names into scope, or `import Dates` and prefix with `Dates.`. **Types:** `Date(year, month, day)` for a date; `Time(hour, minute, second, millisecond)` for a time of day; `DateTime(...)` for a date and time (millisecond precision). Get current date and time: `today()`, `now()`; `now(UTC)` for UTC. Parse from strings using a format string or the `dateformat` macro: e.g. `DateTime("20180629 120000", dateformat"yyyymmdd HHMMSS")` or `Date("Sun, 27 Sep 2020", dateformat"e, d u y")` (format codes: y/year, m/month, d/day, H/M/S for time, e/E for day name, u/U for month name, etc.). **Queries:** `year(d)`, `month(d)`, `day(d)`, `dayofweek(d)`, `dayname(d)`, `hour(t)`, `minute(t)`, `second(t)`. **Arithmetic:** subtract two dates to get a period; add periods: `d + Year(20) + Month(6)`. Create a range: `Date(2000,1,1):Month(1):Date(2020,1,1)`. Round dates with `round(dt, Minute(15))`, `ceil(d, Month)`, etc. Unix time: `time()` returns seconds since epoch; `unix2datetime(t)` converts to `DateTime`. Useful for pipelines, logging, and scheduling.

## Files I/O

To read or write files, use `open(filename, "r")` for read and `open(filename, "w")` for write (or `"a"` for append). The pattern `open(path) do io ... end` ensures the file is closed after the block. Read lines with `readlines(io)` or a `for line in eachline(io)` loop; read all with `read(io, String)`. Write with `println(io, x)` or `write(io, x)`. Delimited and CSV-style reading are available in the standard library and in packages (e.g. DelimitedFiles, CSV.jl). For pipelines and automation, file I/O is often combined with command-line arguments and environment variables.

## The REPL

The read-eval-print loop (REPL) is started by running `julia` with no arguments (or by double-clicking the Julia executable). A banner and version information are shown, followed by the `julia>` prompt. You type expressions; when you enter a complete expression and press Enter, it is evaluated and its value is printed. A trailing semicolon suppresses printing. The variable `ans` is bound to the value of the last evaluated expression in that session, whether or not it was displayed; `ans` exists only in interactive sessions, not when running scripts. To exit, type `Ctrl-D` or `exit()`.

Help mode is entered by typing `?` at the prompt. In help mode, typing a keyword or function name and pressing Enter shows documentation and examples. This is a useful way to learn the language and standard library. Package mode is entered by typing `]`; you can then run Pkg commands (`add`, `status`, `update`, etc.). Typing `Backspace` at the prompt returns to the normal Julia prompt.

To evaluate code from a file in the REPL, use `include("file.jl")`. The file is evaluated in the current module. To run a script non-interactively from the shell, pass it as the first argument: `julia script.jl`.

## Running scripts and the command line

To run a script non-interactively, pass the script path as the first argument to `julia`:

```bash
julia script.jl arg1 arg2
```

Command-line arguments to the script are available in the global constant `ARGS` (a vector of strings). The script path is in `PROGRAM_FILE`. The delimiter `--` separates options for Julia from arguments for the script (e.g. `julia --color=yes -O -- script.jl arg1`). Common options include `-e 'expr'` to evaluate an expression, `-p n` to start with n worker processes, and `-L file` to load a file before the script. Scripts can define an entry point with `(@main)(args) = ...` so that `julia script.jl ...` automatically calls that function with `ARGS` and uses its return value as the process exit code.

## Scoping

Julia uses **lexical scoping**: the scope of a variable is determined by where it is defined in the source. **Global scope** is the top level of a module or the REPL; variables assigned there are global unless declared `local`. **Local scope** is introduced by functions, `let` blocks, and (with different rules) by loops and `try` blocks. In **hard scope** (function, `module`, `struct`, `macro`), a variable name refers to a local unless explicitly declared `global`; in **soft scope** (e.g. `for`, `while`, `try`), assignment inside the block creates a new local by default in inner functions, but at top level (e.g. REPL or script) it can affect the global. Use `global x` to assign to a global from inside a function; use `local x` to force a new local in soft scope. Each module has its own global namespace. Understanding scope avoids surprises when variables in loops or conditionals do not behave like in some other languages.

## Documentation (docstrings)

You can attach documentation to functions, types, or other objects by placing a **docstring** (a string literal, often triple-quoted) immediately before the definition. Docstrings are typically written in Markdown and can include a short description, argument and return details, and an `# Examples` section with runnable code. The REPL help mode (`?` followed by the name) displays the docstring. The `@doc` macro can bind or retrieve documentation. Good docstrings help others (and your future self) understand how to use a function or type and what it expects.

## Modules and keywords

Code is organized in modules (`module ... end`). The standard library and installed packages are loaded with `using ModuleName` or `import ModuleName`.

Bundled standard libraries include **Random** (random number generation), **Statistics** (mean, std, etc.), **LinearAlgebra** (matrix ops, eigenvalues), **Dates** (date and time), **SparseArrays** (sparse matrices), and **Test** (unit testing); use `using ModuleName` and then help (`?functionname`) or the links in Further reading for details. Reserved keywords (e.g. `if`, `else`, `for`, `function`, `end`, `try`, `catch`) cannot be used as variable names.

**Stylistic conventions.** Julia imposes few rules on names, but these conventions are widely followed: variable names are lowercase, with underscores only when needed for readability. Names of types and modules use capital first letter and CamelCase. Names of functions and macros are lowercase, without underscores. Functions that mutate one or more of their arguments have names ending in `!` (mutating or in-place functions).

---

## Further reading

- [Getting Started](https://docs.julialang.org/en/v1/manual/getting-started/)
- [Variables](https://docs.julialang.org/en/v1/manual/variables/)
- [Types](https://docs.julialang.org/en/v1/manual/types/)
- [Functions](https://docs.julialang.org/en/v1/manual/functions/)
- [Arrays](https://docs.julialang.org/en/v1/manual/arrays/)
- [Strings](https://docs.julialang.org/en/v1/manual/strings/)
- [Control Flow](https://docs.julialang.org/en/v1/manual/control-flow/)
- [Command-line Interface](https://docs.julialang.org/en/v1/manual/command-line-interface/)
- [Scope of Variables](https://docs.julialang.org/en/v1/manual/variables-and-scoping/)
- [Documentation](https://docs.julialang.org/en/v1/manual/documentation/)
- [The Julia REPL (standard library)](https://docs.julialang.org/en/v1/stdlib/REPL/)
- [Missing (documentation)](https://docs.julialang.org/en/v1/manual/missing/)
- [Julia Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/julia/index.htm) — Overview, syntax, arrays, tuples, numbers, operators, strings, functions, flow control, dictionaries & sets, date & time, files I/O, metaprogramming, plotting, data frames, modules, networking, databases.
