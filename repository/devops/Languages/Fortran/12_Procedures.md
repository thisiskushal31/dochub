# Procedures

[← Back to Fortran](./README.md)

**Procedures** are **subroutines** and **functions**. Subroutines perform actions and can modify their arguments; functions return a value and should be free of side effects when used in expressions. Both can have optional arguments, keyword arguments, and array or assumed-shape arguments. This section covers how to define and call procedures so you can structure programs clearly.

**Why procedures matter.** Breaking a program into subroutines and functions avoids duplication, clarifies intent, and makes testing easier. Scientific code often separates numerical kernels (functions) from driver logic (subroutines). Correct use of intent, optional arguments, and array arguments is essential for safe and efficient code.

**Subroutines.** A subroutine is defined with `subroutine name(args)` … `end subroutine name`. It is called with `call name(args)`. Arguments can be modified; use the **intent** attribute to document and enforce: `intent(in)` (input only), `intent(out)` (output only), `intent(in out)` (both). The compiler can use intent for optimization and checking.

```fortran
subroutine swap(a, b)
  real, intent(in out) :: a, b
  real :: tmp
  tmp = a
  a = b
  b = tmp
end subroutine swap
```

**Functions.** A function returns a single value. Define with `function name(args) result(res)` … `end function name` and declare the type of `res`. Or use the older form where the function name is the result variable. Prefer `result(name)` to avoid confusion. Functions should be **pure** when possible (no side effects, only intent(in) arguments) so they can be used in expressions and in parallel contexts.

```fortran
function norm2(x) result(n)
  real, intent(in) :: x(:)
  real :: n
  n = sqrt(sum(x**2))
end function norm2
```

**Optional and keyword arguments.** Mark an argument as `optional`. Before use, test with `present(arg)`. Call with keyword syntax: `call sub(y=val, x=val)` so order does not matter. Optional and keyword arguments make interfaces more flexible and backward compatible.

**Array arguments.** Use **assumed-shape** arrays in the procedure: `real, intent(in) :: x(:)` or `x(:,:)`. The actual bounds are passed; do not use explicit bounds that assume a fixed size. For allocatable or pointer arrays, declare accordingly. Pass arrays by simply using the array name; the whole array or a slice can be passed.

**Interface blocks and elemental.** When a procedure is in another module or is external, the compiler may need an **interface block** (the procedure's signature) to check arguments and support keyword calls. Modules provide the interface automatically. For **elemental** procedures, declare with `elemental`; the procedure is applied element-wise to arrays (e.g. an elemental function can be called with a scalar or an array). Pure and elemental procedures are important for parallel and array-oriented code; see the references for full syntax.

**Why this matters.** Clear intent and small, focused procedures improve maintainability. Pure functions are easier to test and use in array expressions. Correct array argument handling avoids bounds errors and allows the compiler to optimize. In libraries, document the interface (argument types, intent, optional) so callers use them correctly.

---

## Further reading

- [Fortran – Procedures (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_procedures.htm)
- [Fortran Best Practices (fortran-lang.org)](https://fortran-lang.org/learn/best_practices/)
- [Quickstart tutorial (fortran-lang.org)](https://fortran-lang.org/learn/quickstart/)
