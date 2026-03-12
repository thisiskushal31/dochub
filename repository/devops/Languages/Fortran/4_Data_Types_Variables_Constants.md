# Data types, variables, and constants

[← Back to Fortran](./README.md)

Fortran provides **intrinsic** (built-in) data types and allows **derived** (user-defined) types. Variables must be declared before use when `implicit none` is in effect. Constants can be given a name with the `parameter` attribute. This section covers the five intrinsic types and how to declare variables and constants so you can write correct, readable programs.

**Why types matter.** Fortran is statically typed: the type of a variable is fixed. Choosing the right type (integer, real, logical, character, or complex) avoids overflow, rounding surprises, and logic errors. Explicit declarations make the intent clear and let the compiler catch mistakes.

**The five intrinsic types.** Fortran has five built-in types:

1. **integer** — Whole numbers. You can specify **kind** for size (e.g. `integer(kind=4)` or `integer(8)`).
2. **real** — Floating-point numbers. Default and double precision; kind selects precision.
3. **complex** — Complex numbers (real and imaginary parts).
4. **logical** — Boolean values: `.true.` and `.false.`.
5. **character** — Characters and strings. Length can be fixed or allocatable.

**Declaring variables.** Declarations appear at the top of the program unit, after `implicit none`. Syntax: `type [, attributes] :: name [= initial_value]`. Examples:

```fortran
integer       :: i, j
real          :: x, y
real(kind=8)  :: d
logical       :: flag
character(20) :: name
complex       :: z
```

**Integer kind and range.** The `huge()` intrinsic returns the largest value a given integer kind can hold. Common kinds: 2 (short), 4 (default on many systems), 8 (long). Use a larger kind when you need a bigger range.

```fortran
program show_int_kind
  implicit none
  integer(kind=4) :: k4
  integer(kind=8) :: k8
  print *, huge(k4)   ! e.g. 2147483647
  print *, huge(k8)   ! e.g. 9223372036854775807
end program show_int_kind
```

**Real type and division.** Real division produces a real result; integer division truncates toward zero. So `2.0 / 3.0` is about 0.667, but `2 / 3` is 0.

```fortran
real :: p, q, real_res
integer :: i, j, int_res
p = 2.0; q = 3.0; real_res = p / q   ! 0.666...
i = 2;   j = 3;   int_res = i / j     ! 0
```

**Logical type.** The only values are `.true.` and `.false.`. They are used in conditions and with logical operators.

**Character type.** `character(len)` declares a string of fixed length. Example: `character(40) :: name` then `name = 'Zara Ali'`. A substring is given by `name(1:4)` (e.g. `'Zara'`). If the assigned string is shorter than the length, the rest is padded with spaces.

**Constants (parameter).** To give a constant a name, use the `parameter` attribute. The value cannot change.

```fortran
real, parameter :: pi = 3.14159265
integer, parameter :: max_size = 100
```

**Implicit typing (avoid).** Older Fortran allowed variables without declarations; the first letter determined the type (i–n → integer, others → real). This is error-prone. Always use `implicit none` and declare all variables.

**Why this matters.** Correct types and explicit declarations prevent subtle bugs (e.g. integer division when you meant real, or a typo creating an unintended variable). In scientific code, choosing the right real kind is important for precision and reproducibility.

---

## Further reading

- [Fortran – Data Types (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_data_types.htm)
- [Fortran – Variables (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_variables.htm)
- [Fortran – Constants (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_constants.htm)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/) (e.g. `huge`, `kind`)
